<template>
  <h1>Choose your seat</h1><br><br>
  <div class="container">
      <div class="row justify-content-center">
          <h2>Front of the Plane</h2>
      </div>
      <div class="row justify-content-center">
          <div class="col-md-5">
            <h2>Left Row</h2>
              <div class="row" v-for="(seatsInRow, row) in rows" :key="row">
                  <div class="col-4 mb-3" v-for="seat in seatsInRow.slice(0, 3)" :key="seat.id">
                      <div class="card" :class="{ 'bg-danger': seat.userId == this.uid, 'bg-secondary':seat.reserved }" v-if="!seat.reserved">
                          <div class="card-body" :disabled="!seat.available" @click="showConfirmation(seat.id)" >
                              {{ seat.id }}
                          </div>
                      </div>
                      <div class="card" :class="{ 'bg-danger': seat.userId == this.uid, 'bg-secondary':seat.reserved }" v-else>
                        <div class="card-body" :disabled="!seat.available" >
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
                          <div class="card-body" :disabled="!seat.available" @click="showConfirmation(seat.id)" >
                              {{ seat.id }}
                          </div>
                      </div>
                      <div class="card" :class="{ 'bg-danger': seat.userId == this.uid, 'bg-secondary':seat.reserved }" v-else>
                        <div class="card-body" :disabled="!seat.available" >
                                {{ seat.id }}
                            </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      <div>
    
    <confirmation-window v-if="showingConfirmation" @close="hideConfirmation" @confirm="handleConfirmation" :title="title" :message="message" :seat-id="selectedSeatId" />
    
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
          seats: {},
          flightRef:'',
          flightData:{},
          uid:'',
      };
  },
  async mounted() {
        const auth = getAuth();
        const user = auth.currentUser;
            
        if (!user) {
        return 
        } 
        this.uid = user.uid;

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

        //ADD userFlight with uid, seats and flight
        await setDoc(doc(db, 'userFlights', this.uid), {},{ merge: true });
        const userFlightQuerySeats = this.flightId +'.seats';
        const userFlightQueryNum = this.flightId +'.number';
        const userFlightQueryArrival = this.flightId +'.arrive';
        const userFlightQueryDeparture = this.flightId +'.departure';
        await updateDoc(doc(db, 'userFlights', this.uid), {
            [userFlightQuerySeats]: arrayUnion(seatId),
            [userFlightQueryNum]: this.flightData.number,
            [userFlightQueryArrival]: this.flightData.arrivalAirport,
            [userFlightQueryDeparture]: this.flightData.departureAirport,
 
        },{ merge: true });
        this.selectedSeatId = null;
      },
    
    showConfirmation(seatId) {
      this.selectedSeatId = seatId;
      this.showingConfirmation = true;
    },
    hideConfirmation() {
      this.showingConfirmation = false;
    },
    handleConfirmation() {
      // Handle confirmation here
      navigator.vibrate(200);
      console.log('Selected seat ID:', this.selectedSeatId);
      this.hideConfirmation();
      this.reserveSeat(this.selectedSeatId)
    },
  },
  computed: {
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