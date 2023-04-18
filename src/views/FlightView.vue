<template>
    <router-link :to="{ name: 'Seats' }"><H1>SEATS</H1></router-link>
    <div v-for="(data, index) in flight.seats" :key="index">
        <h1>{{ index }}:{{ data}} </h1>
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
            flight: {},
        };
    },
    async mounted() {

        const flightId = this.$router.currentRoute._value.params.flightId
        const docRef = doc(db, "testmdoe", flightId);
        const docSnap = await getDoc(docRef);

        this.flight = docSnap.data();
        if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        } else {
        // docSnap.data() will be undefined in this case
        console.log("Failed to load")}

        
    }
}
  </script>