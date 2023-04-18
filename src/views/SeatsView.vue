<template>
<h1>Choose your seat</h1>
<div class="container">
    <div class="row justify-content-md-center">
  <h2>Airplane Seats Map</h2>
  <div class="row " v-for="(seatsInRow, row) in rows" :key="row">
    <div class="col-md-12">
      <div class="row">
        <div class="col-1" v-for="seat in seatsInRow.slice(0,3)" :key="seat.id">
          <div class="card" :class="{ 'bg-secondary': seat.reserved }">
            <div class="card-body">
              {{ seat.id }}
            </div>
          </div>
        </div>
        <div class="col-2"></div>
        <div class="col-1" v-for="seat in seatsInRow.slice(3,6)" :key="seat.id">
          <div class="card" :class="{ 'bg-secondary': seat.reserved }">
            <div class="card-body">
              {{ seat.id }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</div>



</template>
<script>
import { db } from '../firebase/index.js';
import { doc, getDoc } from "firebase/firestore";
  export default {
    
    props:{
        flightId:{
            required: true,
        },
    },
    data() {
        return {
            seats: {},
        };
        
    },
    async mounted() {

        //READ FLIGHT DATA FROM FIREBASE
        const flightId = this.$router.currentRoute._value.params.flightId
        const docRef = doc(db, "flights", flightId);
        const docSnap = await getDoc(docRef);

        this.seats = docSnap.data().seats;
        if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        } else {
        // docSnap.data() will be undefined in this case
        console.log("Failed to load")}

        
    },
    methods: {
    reserveSeat(id) {
      this.seats[id].reserved = true;
      //ADD FIREBASE SEATS UPDATE




    }
  },
  computed: {
  rows() {

    //CREATE ROWS WITH FREE MIDDLE SPACE
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
    return rows;
  },
}
}
</script>
