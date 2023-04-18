<template>
<div class="container-md">
  <!-- Content here -->

    


        <router-link :to="{ name: 'Seats', params: { flightId: flightId }}"><h2>SEATS</h2></router-link>

        <h1>{{flight.number}} </h1>
        <h1 data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">Departure : {{flight.departureAirport}} </h1>
        <h1 >Arrival: {{flight.arrivalAirport}} </h1>

        <div class="collapse" id="collapseExample">
            <div class="card card-body">
                <div id="map"></div>
            </div>
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
            console.log("Failed to load flight data")}

        //Read depature airport data
        const departureAirportRef = doc(db, "airports", this.flight.departureAirport);
        const departureAirportRefSnap = await getDoc(departureAirportRef);
        if (departureAirportRefSnap.exists()) {
            console.log("Document data:", departureAirportRefSnap.data());
        } else {
            console.log("Failed to load airport data")}



        console.log(departureAirportRefSnap.data().location._lat);
        this.departureLocationLat = departureAirportRefSnap.data().location._lat;
        this.departureLocationLong = departureAirportRefSnap.data().location._long;


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
  <style scoped>
  #map {
    height: 450px;
  }
  </style>