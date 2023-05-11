<template>
    <div class="container">

        <div class="row">
            <div class="col-md-4" v-for="(flight, index) in flights" :key="index">

                <div class="card mb-4 box-shadow">
                    <router-link :to="{ name: 'Flight', params: { flightId: flight.id } }">
                        <div class="card-body">
                            <h5 class="card-title">Flight No. {{ flight.number }}</h5>
                            <p class="card-text">Departure: {{ flight.departureAirport }}</p>
                            <p class="card-text">Arrival: {{ flight.arrivalAirport }}</p>
                            <p class="card-text">Flight Lenght: {{ flight.flightLength }} Hours</p>
                            <p class="card-text">Departure Time: {{ flight.departureTime }}</p>
                            <p class="card-text">Arrival time: {{ flight.arrivalTime }}</p>
                            <p class="card-text">Price: {{ flight.price }} zł</p>

                        </div>
                    </router-link>
                </div>

            </div>
        </div>
    </div>
</template>
<script>
import { db } from '@/firebase';
import { collection, getDocs } from "firebase/firestore";


export default {
    data() {
        return {
            flights: [],
        };
    },
    async mounted() {
        //connect to database and read flights collection ans save to flights
        try {
            const flightsRef = collection(db, 'flights');
            const snapshot = await getDocs(flightsRef);
            this.flights = snapshot.docs.map(doc => doc.data());
        } catch (error) {
            console.error(`Error fetching flights: ${error}`);
        }
    },
    
}
</script>
<style>
a {
    text-decoration: none;
    color: inherit;
}
</style>