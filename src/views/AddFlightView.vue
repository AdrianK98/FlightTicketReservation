<template>
    <div class=" container-fluid">
      <h1>Dodaj lot</h1>
      <form @submit.prevent="addFlight">
            <div class="row justify-content-md-center">
                <div class="col col-lg-3">
                    <label for="flight-number">Numer lotu:</label>
                    <input type="text" class="form-control" id="flight-number" v-model="flight.number" >
                </div>
            </div>
            <div class="row justify-content-md-center">
                <div class="col col-lg-3">
                    <label for="flight-number">Lotnisko wylotu:</label>
                    <select class="form-select" aria-label="Default select example" id="departue-airport" v-model="flight.departureAirport" >
                        <option v-for="(airport, index) in airports" :key="index" :value="airport.name">{{ airport.name }}</option>
                    </select>
                </div>
            </div>
            <div class="row justify-content-md-center">
                <div class="col col-lg-3">
                    <label for="arrival-airport">Lotnisko przylotu:</label>
                    <select class="form-select" aria-label="Default select example" id="arrival-airport" v-model="flight.arrivalAirport" >
                        <option v-for="(airport, index) in airports" :key="index" :value="airport.name">{{ airport.name }}</option>
                    </select>
                </div>
            </div>
            <div class="row justify-content-md-center">
                <div class="col col-lg-3">
                    <label for="flight-length">Długość lotu:</label>
                    <input type="number" class="form-control" id="flight-length" v-model="flight.flightLength" >
                </div>
            </div>
            <div class="row justify-content-md-center">
                <div class="col col-lg-3">
                    <label for="departure-time">Godzina wylotu:</label>
                    <input type="datetime-local" class="form-control" id="departure-time" v-model="flight.departureTime" >
                </div>
            </div>
            <div class="row justify-content-md-center">
                <div class="col col-lg-3">
                    <label for="arrival-time">Godzina przylotu:</label>
                    <input type="datetime-local" class="form-control" id="arrival-time" v-model="flight.arrivalTime" >
                </div>
            </div>
            <div class="row justify-content-md-center">
                <div class="col col-lg-3">
                    <label for="price">Cena:</label>
                    <input type="number" class="form-control" id="price" v-model="flight.price" >
                </div>
            </div>


            <button type="submit" class="btn btn-primary">Dodaj lot</button>
        </form>
    </div>
</template>
<script>
import { db } from '@/firebase';
import {collection,getDocs,addDoc,setDoc,doc} from "firebase/firestore"

export default {
    data() {
        return {
            airports: [],
            flight: {
                number: '',
                departureAirport: '',
                arrivalAirport: '',
                flightLength: '',
                departureTime: '',
                arrivalTime: '',
                price: '',

            },
            seats:{
                reserved:'',
            }
        };
    },
    async mounted() {
        try {
            //read airports from firebase and save them into airports
            const airportsRef = collection(db, "airports");
            const airportsSnapshot = await getDocs(airportsRef);
            this.airports = airportsSnapshot.docs.map((doc) => doc.data());
            console.log(this.airports);
        } catch (error) {
            console.error(`Error fetching flights: ${error}`);
        }
    },
    methods: {
        async addFlight() {
            try {

                //add values into firebase from inputs

                const docRef = await addDoc(collection(db, "flights"),{});
                await setDoc(doc(db, 'flights', docRef.id), this.flight);
                this.flight = {
                    number: '',
                    departureAirport: '',
                    arrivalAirport: '',
                    flightLength: '',
                    departureTime: '',
                    arrivalTime: '',
                    price: '',
                };

                const seatData = {
                    id : docRef.id,
                    seats: {}
                }
                for (let i = 1; i <= 200; i++) {
                    seatData.seats[i] = {reserved:false};
                }


                await setDoc(doc(db, 'flights', docRef.id), seatData,{ merge: true });
                console.log("Document written with ID: ", docRef.id);



            } catch (error) {
                alert(`Błąd podczas dodawania lotu do bazy danych: ${error}`);
            }
        },

    },
};
</script>