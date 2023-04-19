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
                <h1>{{flight.number}} </h1>
                <h1 data-bs-toggle="collapse" data-bs-target="#departureMapCollapse" aria-expanded="false" aria-controls="departureMapCollapse">Departure : {{flight.departureAirport}} </h1>
                <h1 >Arrival: {{flight.arrivalAirport}} </h1>
                <div class="collapse" id="departureMapCollapse">
                <div class="card card-body">
                  <div id="map"></div>
                  </div>
                </div>
            </ul>
        </div>

    </div>
</template>

<script>
import VectorLayer from 'ol/layer/Vector'; // Added VectorLayer import
import VectorSource from 'ol/source/Vector';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
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
            departureLocationLat:'',
            departureLocationLong:'',
            arrivalLocationLat:'',
            arrivalLocationLong:'',

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
        //Read depature airport data
        const departureAirportRef = doc(db, "airports", this.flight.departureAirport);
        const departureAirportRefSnap = await getDoc(departureAirportRef);
        if (departureAirportRefSnap.exists()) {
            console.log("Document data:", departureAirportRefSnap.data());
        } else {
            console.log("Failed to load airport data")}

        //Read arrival airport data
        const arrivalAirportRef = doc(db, "airports", this.flight.arrivalAirport);
        const arrivalAirportRefSnap = await getDoc(arrivalAirportRef);
        if (arrivalAirportRefSnap.exists()) {
            console.log("Document data:", arrivalAirportRefSnap.data());
        } else {
            console.log("Failed to load airport data")
        }



        //Read departure long lat from firebase
        this.departureLocationLat = departureAirportRefSnap.data().location._lat;
        this.departureLocationLong = departureAirportRefSnap.data().location._long;

        //Read arrival long lat from firebase
        this.arrivalLocationLat = arrivalAirportRefSnap.data().location._lat;
        this.arrivalLocationLong = arrivalAirportRefSnap.data().location._long;

        
        await this.loadMap()

  
    },
    methods: {
      async loadMap() {
            const map = new Map({
            target: 'map',
            layers: [
                new TileLayer({
                source: new OSM(),
                }),
            ],
            view: new View({
                center: fromLonLat([this.departureLocationLong,this.departureLocationLat ]),
                zoom: 15,
            }),
            });

            const marker = new Feature({
            geometry: new Point(fromLonLat([this.departureLocationLong,this.departureLocationLat ])),
            });

            const vectorLayer = new VectorLayer({
            source: new VectorSource({
            features: [marker],
            }),
            });

            map.addLayer(vectorLayer);
        }
    },

}
</script>       
<style>
#map {
    height: 450px;
  }
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
