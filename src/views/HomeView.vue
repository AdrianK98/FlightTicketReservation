<template>
    <div class="container">

        <div class="row">
            <div class="col-md-4" v-for="(flight, index) in flights" :key="index">

                <div class="card mb-4 box-shadow">
                    <router-link :to="{ name: 'Flight', params: { flightId: flight.id } }">
                        <div class="card-body">
                            <h5 class="card-title">Lot nr {{ flight.number }}</h5>
                            <p class="card-text">Lotnisko wylotu: {{ flight.departureAirport }}</p>
                            <p class="card-text">Lotnisko przylotu: {{ flight.arrivalAirport }}</p>
                            <p class="card-text">Długość lotu: {{ flight.flightLength }}</p>
                            <p class="card-text">Godzina wylotu: {{ flight.departureTime }}</p>
                            <p class="card-text">Godzina przylotu: {{ flight.arrivalTime }}</p>
                            <p class="card-text">Cena: {{ flight.price }} zł</p>

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