<template>
  <h1>Choose your seat</h1>
  <div class="container">
      <div class="row justify-content-center">
          <h2>Airplane Seats Map</h2>
      </div>
      <div class="row justify-content-center">
          <div class="col-md-5">
            <h2>First Row</h2>
              <div class="row" v-for="(seatsInRow, row) in rows" :key="row">
                  <div class="col-4 mb-3" v-for="seat in seatsInRow.slice(0, 3)" :key="seat.id">
                      <div class="card" :class="{ 'bg-secondary': seat.reserved }">
                          <div class="card-body" :disabled="!seat.available" @click="reserveSeat(seat.id)">
                              {{ seat.id }}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          <div class="col-md-2"></div>
          <div class="col-md-5">
            <h2>Second Row</h2>
              <div class="row" v-for="(seatsInRow, row) in rows" :key="row">
                  <div class="col-4 mb-3" v-for="seat in seatsInRow.slice(3, 6)" :key="seat.id">
                      <div class="card" :class="{ 'bg-secondary': seat.reserved }">
                          <div class="card-body" :disabled="!seat.available" @click="reserveSeat(seat.id)">
                              {{ seat.id }}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
import { getAuth } from "firebase/auth";
import { db } from '@/firebase';
import { doc, getDoc, updateDoc, arrayUnion, setDoc } from "firebase/firestore";
export default {
  props:{
      flightId:{
          required: true,
      },
  },
  data() {
      return {
          seats: {},
          flightRef:'',
      };
  },
  async mounted() {

      const flightId = this.$router.currentRoute._value.params.flightId
      this.flightRef = doc(db, "flights", flightId);
      const flightSnap = await getDoc(this.flightRef);
      if (flightSnap.exists()) {
          this.seats = flightSnap.data().seats;
      } else {
          console.log("Failed to load");
      }
  },
  methods: {
      async reserveSeat(seatId) {
          const auth = getAuth();
          const user = auth.currentUser;
          
          if (!user) {
            return 
          } 
          const uid = user.uid;


          //ADD FIREBASE SEATS STATUS CHANGE AND ADD USERID
          const seatReservationChangeStatus = 'seats.'+ seatId +'.reserved';
          const seatReservationChangeUid = 'seats.'+ seatId +'.userId';
          this.seats[seatId].reserved = true;
          await updateDoc(this.flightRef, {
            [seatReservationChangeStatus] : true,
            [seatReservationChangeUid]:uid,
        },{ merge: true });

        // const userFlightData = {
        //     flightId:this.flightId,
        //     seatNum:arrayUnion(seatId),

        // }
        
        //ADD userFlight with uid, seats and flight
        await setDoc(doc(db, 'userFlights', uid), {},{ merge: true });

        const userFlightQuery = this.flightId +'.seats';
        await updateDoc(doc(db, 'userFlights', uid), {
            [userFlightQuery]: arrayUnion(seatId),
 
        },{ merge: true });



      }
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