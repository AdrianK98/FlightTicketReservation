<template>
  <h1>Choose your seat</h1><br><br>
  <div class="container">

  <div class="row">
    <div class="col">
      <span class="badge bg-white w-auto px-5 py-3 m-2 text-dark">    Free     </span>
    </div>
    <div class="col">
      <span class="badge bg-secondary w-auto p-3 m-2">Already Reserved</span>
    </div>
    <div class="col">
      <span class="badge bg-danger w-auto p-3 m-2">Reserved by you</span>
    </div>
  </div>



      <div class="row justify-content-center mt-5">
          <h2>Front of the Plane</h2>
      </div>
      <div class="row justify-content-center">
          <div class="col-md-5">
            <h2>Left Row</h2>
            <div class="row" v-for="(seatsInRow, row) in rows" :key="row">
                  <div class="col-4 mb-3" v-for="seat in seatsInRow.slice(0, 3)" :key="seat.id">
                    <div class="card" :class="{ 'bg-danger': seat.userId == this.uid, 'bg-secondary':seat.reserved }" v-if="!seat.reserved">
                          <div class="card-body" :disabled="!seat.available" @click="showConfirmation(seat.id,false)" >
                              {{ seat.id }}
                          </div>
                      </div>
                      <div class="card" :class="{ 'bg-danger': seat.userId == this.uid, 'bg-secondary':seat.reserved }" v-else-if="seat.userId == this.uid">
                        <div class="card-body"  @click="showConfirmation(seat.id,true)">
                                {{ seat.id }}
                            </div>
                      </div>

                      <div class="card" :class="{ 'bg-danger': seat.userId == this.uid, 'bg-secondary':seat.reserved }" v-else>
                        <div class="card-body" :disabled="!seat.available">
                                {{ seat.id }}
                            </div>
                      </div>
                  </div>
              </div>
          </div>
          <div class="col-md-2"></div>
          <div class="col-md-5">
            <h2>Right Row</h2>
              <div class="row" v-for="(seatsInRow, row) in rows" :key="row">
                  <div class="col-4 mb-3" v-for="seat in seatsInRow.slice(3, 6)" :key="seat.id">
                    <div class="card" :class="{ 'bg-danger': seat.userId == this.uid, 'bg-secondary':seat.reserved }" v-if="!seat.reserved">
                          <div class="card-body" :disabled="!seat.available" @click="showConfirmation(seat.id,false)" >
                              {{ seat.id }}
                          </div>
                      </div>
                      <div class="card" :class="{ 'bg-danger': seat.userId == this.uid, 'bg-secondary':seat.reserved }" v-else-if="seat.userId == this.uid">
                        <div class="card-body"  @click="showConfirmation(seat.id,true)">
                                {{ seat.id }}
                            </div>
                      </div>

                      <div class="card" :class="{ 'bg-danger': seat.userId == this.uid, 'bg-secondary':seat.reserved }" v-else>
                        <div class="card-body" :disabled="!seat.available">
                                {{ seat.id }}
                            </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      <div>
    
    <confirmation-window v-if="showingConfirmation" @close="hideConfirmation" @confirm="handleConfirmation" :title="title" :message="confirmationMessage" :seat-id="selectedSeatId" />
    
  </div>
  </div>
</template>

<script>
import { getAuth } from "firebase/auth";
import { db } from '@/firebase';
import { doc, getDoc, updateDoc, arrayUnion, setDoc } from "firebase/firestore";
import ConfirmationWindow from '../components/ConfirmationView.vue'

export default {
  components: {
    ConfirmationWindow,
  },
  props:{
      flightId:{
          required: true,
      },
  },
  data() {
      return {
        selectedSeatId: '',
        showingConfirmation: false,
        title: 'Confirmation',
        message: 'Are you sure you want to select seat number ',
        delMessage: 'Are you sure you want to delete reservation of seat number ',
        seats: {},
        flightRef:'',
        flightData:{},
        uid:'',
        freeReservation:null,
      };
  },
  async mounted() {
    
        //get current user
        const auth = getAuth();
        const user = auth.currentUser;
        this.uid = user.uid;

          //read firebase data for given flight
      const flightId = this.$router.currentRoute._value.params.flightId
      this.flightRef = doc(db, "flights", flightId);
      this.flightSnap = await getDoc(this.flightRef);
      if (this.flightSnap.exists()) {
          this.seats = this.flightSnap.data().seats;
          this.flightData = this.flightSnap.data();
      } else {
          console.log("Failed to load");
      }
  },
  methods: {
      async reserveSeat(seatId) {

          //ADD FIREBASE SEATS STATUS CHANGE AND ADD USERID
          const seatReservationChangeStatus = 'seats.'+ seatId +'.reserved'; 
          const seatReservationChangeUid = 'seats.'+ seatId +'.userId';
          this.seats[seatId].reserved = true;
          await updateDoc(this.flightRef, {
            [seatReservationChangeStatus] : true,
            [seatReservationChangeUid]:this.uid,
        },{ merge: true });

        //create userflight document
        await setDoc(doc(db, 'userFlights', this.uid), {},{ merge: true });

        //create commands to update userFlight in firebase
        const userFlightQuerySeats = this.flightId +'.seats';
        const userFlightQueryNum = this.flightId +'.number';
        const userFlightQueryArrival = this.flightId +'.arrive';
        const userFlightQueryDeparture = this.flightId +'.departure';

        //change to seat data to integer
        seatId = parseInt(seatId);

        //update userFlight document with uid, seats and flight
        await updateDoc(doc(db, 'userFlights', this.uid), {
            [userFlightQuerySeats]: arrayUnion(seatId),
            [userFlightQueryNum]: this.flightData.number,
            [userFlightQueryArrival]: this.flightData.arrivalAirport,
            [userFlightQueryDeparture]: this.flightData.departureAirport,
 
        },{ merge: true });

        //reset selected seat
        this.selectedSeatId = null;
      },
    

    showConfirmation(seatId,freeSpace) {
    this.freeReservation = freeSpace;
      this.selectedSeatId = seatId;
      this.showingConfirmation = true;
    },
    hideConfirmation() {
      this.showingConfirmation = false;
    },

    //reserve seat or delete reservation after pressing confirm
    handleConfirmation() {
    if(!this.freeReservation){
        navigator.vibrate(200);
      console.log('Selected seat ID:', this.selectedSeatId);
      this.hideConfirmation();
      this.reserveSeat(this.selectedSeatId)
    }
    else{
        navigator.vibrate(200);
      console.log('deleting reservation of seat ID:', this.selectedSeatId);
      this.hideConfirmation();
      this.deleteReservation(this.selectedSeatId)

    }

    },

    async deleteReservation(seatId) {
        
        //ADD FIREBASE SEATS STATUS CHANGE AND ADD USERID
        const seatReservationChangeStatus = 'seats.'+ seatId;
        this.seats[seatId].reserved = false;
          await updateDoc(this.flightRef, {
            [seatReservationChangeStatus] : {reserved:false},
        },{ merge: false });


        console.log("Deleted seat "+seatId+" from reservation")
    },

  },
  computed: {
    confirmationMessage() {
      return this.freeReservation ? this.delMessage : this.message;
    },
      rows() {
          const rows = {};
          for (const seat in this.seats) {
              const seatNum = parseInt(seat);
              const row = Math.floor((seatNum - 1) / 6) + 1;
              const col = seatNum % 6;
              const isMiddleSpace = col === 3;
              const isRightOfMiddleSpace = col > 3;
              const seatInfo = {
                  id: seat,
                  userId: this.seats[seat].userId,
                  reserved: this.seats[seat].reserved,
                  middleSpace: isMiddleSpace,
                  rightOfMiddleSpace: isRightOfMiddleSpace,
              };
              if (!rows[row]) {
                  rows[row] = [];
              }
              rows[row].push(seatInfo);
          }
          return Object.values(rows);
      },
  }
}
</script>

<style scoped>
.container {
    display: flex; /* Use flexbox to align divs horizontally */
    flex-wrap: wrap; /* Wrap the divs to new line on smaller screens */
}

.container > div {
    flex: 1 1 100%; /* Each div should take 100% width on smaller screens */
}

@media (min-width: 768px) {
    /* Reset flexbox styles for larger screens */
    .container {
        display: block;
    }
}
</style>