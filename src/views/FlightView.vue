<template>
    <div class="container">
        <div class="card-mt4" >
            <div class="wrapper">
                <div class="bg"></div>
            </div>
            <div class="card-header">

            </div>
            <ul class="list-group list-group-flush">
                <li class="list-group-item" style="background-color: skyblue">To: {{flight.number}} </li>
                <li class="list-group-item">To: {{flight.departureAirport}} </li>
                <li class="list-group-item">From: {{flight.arrivalAirport}}</li>
                <li class="list-group-item">Duration: {{flight.flightLength}}</li>
                <li class="list-group-item"><router-link :to="{ name: 'Seats', params: { flightId: flightId }}">SEATS</router-link></li>
            </ul>
        </div>

    </div>
</template>

<script>

import { db } from '@/firebase';
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
<style>

.wrapper {
    width: 100%;
    height: 100%;
    background-image: url("@/assets/cities/image1_waw.jpg");
}

.bg {
    min-height: 300px;
    min-width: 300px;
    background-image: url("@/assets/cities/image2_krk.jpg");
    clip-path: polygon(70% 0, 100% 0, 100% 100%, 30% 100%);
}
</style>