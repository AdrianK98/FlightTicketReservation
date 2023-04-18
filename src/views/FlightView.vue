<template>
    
    
        <h1>{{flight.number}} </h1>
        <h1>From : {{flight.arrivalAirport}} </h1>
        <h1>To: {{flight.departureAirport}} </h1>

        <router-link :to="{ name: 'Seats', params: { flightId: flightId }}"><h2>SEATS</h2></router-link>
    
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
        const docRef = doc(db, "flights", flightId);
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