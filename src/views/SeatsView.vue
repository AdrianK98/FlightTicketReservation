<template>
<h1>Choose your seat</h1>
<div class="container mt-5">
    <div class="row">
      <div v-for="(seat, id) in seats" :key="id" class="col-6 mb-3">
        <div class="card h-100" :class="{ 'bg-secondary': seat.reserved }">
          <div class="card-body">
            <div class="row">
              <div class="col-4">
                <h5 class="card-title">{{ id }}</h5>
              </div>
              <div class="col-4">
                <p class="card-text">{{ seat.reserved ? 'Reserved' : 'Available' }}</p>
              </div>
              <div class="col-4">
                <button v-if="!seat.reserved" @click="reserveSeat(id)" class="btn btn-primary">Reserve</button>
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

        const flightId = this.$router.currentRoute._value.params.flightId
        const docRef = doc(db, "testmdoe", flightId);
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
  }
    
}
</script>
