<template>
    <div class="container">
        <h1>Dodaj lot</h1>
        <form @submit.prevent="addFlight">
            <div class="form-group">
                <label for="flight-number">Numer lotu:</label>
                <input type="text" class="form-control" id="flight-number" v-model="flight.number" required>
            </div>
            <div class="form-group">
                <label for="departure-airport">Lotnisko wylotu:</label>
                <input type="text" class="form-control" id="departure-airport" v-model="flight.departureAirport" required>
            </div>
            <div class="form-group">
                <label for="arrival-airport">Lotnisko przylotu:</label>
                <input type="text" class="form-control" id="arrival-airport" v-model="flight.arrivalAirport" required>
            </div>
            <div class="form-group">
                <label for="flight-length">Długość lotu:</label>
                <input type="number" class="form-control" id="flight-length" v-model="flight.flightLength" required>
            </div>
            <div class="form-group">
                <label for="departure-time">Godzina wylotu:</label>
                <input type="datetime-local" class="form-control" id="departure-time" v-model="flight.departureTime" required>
            </div>
            <div class="form-group">
                <label for="arrival-time">Godzina przylotu:</label>
                <input type="datetime-local" class="form-control" id="arrival-time" v-model="flight.arrivalTime" required>
            </div>
            <div class="form-group">
                <label for="price">Cena:</label>
                <input type="number" class="form-control" id="price" v-model="flight.price" required>
            </div>
            <button type="submit" class="btn btn-primary">Dodaj lot</button>
        </form>
    </div>
</template>
<script>
import { db } from '../firebase/index.js';
import {addDoc, collection } from "firebase/firestore"
export default {
    data() {
        return {
            flight: {
                number: '',
                departureAirport: '',
                arrivalAirport: '',
                flightLength: '',
                departureTime: '',
                arrivalTime: '',
                price: '',
            },
        };
    },
    methods: {
        async addFlight() {
            try {
                const flightsRef = collection(db, "testmdoe");
                await addDoc(flightsRef, this.flight);
                this.flight = {
                    number: '',
                    departureAirport: '',
                    arrivalAirport: '',
                    flightLength: '',
                    departureTime: '',
                    arrivalTime: '',
                    price: '',
                };
            } catch (error) {
                alert(`Błąd podczas dodawania lotu do bazy danych: ${error}`);
            }
        },
    },
};
</script>