<template>
    <div class="container">
        <div class="wrapper">
                <div class="bg"></div>
            </div>
</div>
    <div class="container">
       
        <div class="card-mt4" >

            <div class="card-header">

            </div>
            <ul class="list-group list-group-flush">
                <li class="list-group-item" style="background-color: skyblue">No.{{flight.number}} </li>
                <li class="list-group-item" data-bs-toggle="collapse" data-bs-target="#departureMapCollapse" aria-expanded="false" aria-controls="departureMapCollapse" @click="changeToDepartureLoc()">Departure:<b role="button"> {{flight.departureAirport}} </b></li>
                <li class="list-group-item">Departure time: {{flight.departureTime }}</li>
                <li class="list-group-item" data-bs-toggle="collapse" data-bs-target="#departureMapCollapse" aria-expanded="false" aria-controls="departureMapCollapse" @click="changeToArrivalLoc()">Arrival: <b role="button">{{flight.arrivalAirport}} </b></li>
                <li class="list-group-item">Arrival time: {{flight.arrivalTime }}</li>
                <li class="list-group-item">Flight duration: {{flight.flightLength}} Hours</li>
                <li class="list-group-item"><router-link :to="{ name: 'Seats', params: { flightId: flightId }}"><h5>SEATS</h5></router-link></li>

                <div class="collapse" id="departureMapCollapse" >
                <div class="card card-body">
                    <h4 data-bs-toggle="collapse" data-bs-target="#departureMapCollapse"> HIDE</h4>
                    <i class="bi bi-geo-alt-fill fs-2" @click="changeToMyLoc()">My Location</i>
                    <i class="bi bi-pin-map-fill fs-2" @click="changeToCurrentLoc()">Airport</i>
                  <div id="map" ></div>
                  </div>
                </div>
            </ul>
        </div>

    </div>
    <div class="container-fluid">


    </div>
</template>

<script>

import VectorLayer from 'ol/layer/Vector'; 
import VectorSource from 'ol/source/Vector';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import Icon from 'ol/style/Icon';
import Style from 'ol/style/Style';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import { db } from '../firebase/index.js';
import { doc, getDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL  } from "firebase/storage";
import markerIconRed from '@/assets/location-pin.png';
import markerIconGreen from '@/assets/gps.png';
export default {

    props:{
        flightId:{
            required: true,
        },
    },
    data() {
        return {
            mapLat:'',
            mapLong:'',
            flight: {},
            departureLocationLat:'',
            departureLocationLong:'',
            arrivalLocationLat:'',
            arrivalLocationLong:'',
            currentLat:'',
            currentLong:'',
            map:'',
            imgUrl:'',
            imgUrlArr:'',
            imgUrlDest:'',
            latLongCurrentPosition:'',

        };
    },
    async mounted() {

        //read current position and save it to variable
        await navigator.geolocation.getCurrentPosition((position) => {

                const curPosLat = position.coords.latitude;
                const curPosLong = position.coords.longitude;
                this.latLongCurrentPosition = fromLonLat([curPosLong, curPosLat]);
            });

        
        //Get flightid from route url
        const flightId = this.$router.currentRoute._value.params.flightId

        //Load flight document with given id
        const docRef = doc(db, "flights", flightId);
        const docSnap = await getDoc(docRef);
        
        //check if data exists
        if (docSnap.exists()) {
            this.flight = docSnap.data();
            console.log("Document data has beed read");
        } else {
            // docSnap.data() will be undefined in this case
            console.log("Failed to load")}



        //Read depature airport data
        const departureAirportRef = doc(db, "airports", this.flight.departureAirport);
        const departureAirportRefSnap = await getDoc(departureAirportRef);

        if (departureAirportRefSnap.exists()) {
            console.log("Airport data has beed read");
        } else {
            console.log("Failed to load airport data")}
        
        //load airports images
        try {

    //load images from firebase and set it as background
            await this.loadImages(this.flight.arrivalAirport, this.flight.departureAirport);

        } catch (error) {
            console.log(error);
        }


        //Read arrival airport data
        const arrivalAirportRef = doc(db, "airports", this.flight.arrivalAirport);
        const arrivalAirportRefSnap = await getDoc(arrivalAirportRef);
        if (arrivalAirportRefSnap.exists()) {
            console.log("Document data has beed read");
        } else {
            console.log("Failed to load airport data")
        }



        //Read departure long lat from firebase
        this.departureLocationLat = departureAirportRefSnap.data().location._lat;
        this.departureLocationLong = departureAirportRefSnap.data().location._long;

        //Read arrival long lat from firebase
        this.arrivalLocationLat = arrivalAirportRefSnap.data().location._lat;
        this.arrivalLocationLong = arrivalAirportRefSnap.data().location._long;

    
        //load OSM map
        await this.loadMap()
    },
    methods: {
    async loadImages(arr,dest){
        //load arrive airport data
        const arrAirportRef = doc(db, "airports", arr);
        const arrAirportSnap = await getDoc(arrAirportRef);
        const arrAirportData = arrAirportSnap.data();

        //load departure airport data
        const destAirportRef = doc(db, "airports", dest);
        const destAirportSnap = await getDoc(destAirportRef);
        const destAirportData = destAirportSnap.data();

        //initialize firebase storage
        const storage = getStorage();

        //get url for images from arrive airport by its name
        await getDownloadURL(ref(storage, arrAirportData.img))
        .then((url) => {
            
            //set image as background
            const divElement = document.querySelector('.bg');
            this.imgUrlArr = url;
            divElement.style.backgroundImage = `url('${this.imgUrlArr}')`;

        })
        .catch((error) => {
            // Handle any errors
            console.log(error)
        });

        //get url for images from destination airport by its name
        await getDownloadURL(ref(storage, destAirportData.img))
        .then((url) => {
            
            //set image as background
            const divElement = document.querySelector('.wrapper');
            this.imgUrlDest = url;
            divElement.style.backgroundImage = `url('${this.imgUrlDest}')`;

        })
        .catch((error) => {
            // Handle any errors
            console.log(error)
        });



        },
      async loadMap() {

            //initialize map
            this.map = new Map({
            target: 'map',
            layers: [
                new TileLayer({
                source: new OSM(),
                }),
            ],
            view: new View({
                center: fromLonLat([this.mapLong,this.mapLat]),
                zoom: 15,
            }),
            });

            //create departure airport marker
            const departureMarker = new Feature({
            geometry: new Point(fromLonLat([this.departureLocationLong, this.departureLocationLat])),
        });
        
        //create current position marker
        const curMarker = new Feature({
            geometry: new Point(this.latLongCurrentPosition),
        });        
        
        //create arrival airport position marker
        const arrivalMarker = new Feature({
            geometry: new Point(fromLonLat([this.arrivalLocationLong, this.arrivalLocationLat])),
        });

        //create red marker style
        var iconStyleRed = new Style({
    image: new Icon(/** @type {module:ol/style/Icon~Options} */ ({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: markerIconRed
    }))
})


//create green marker style
var iconStyleGreen = new Style({
    image: new Icon(/** @type {module:ol/style/Icon~Options} */ ({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: markerIconGreen
    }))
})

//load styles into markers
  departureMarker.setStyle(iconStyleRed);
  arrivalMarker.setStyle(iconStyleRed);
  curMarker.setStyle(iconStyleGreen);
        


        const vectorSource = new VectorSource({
            features: [departureMarker, arrivalMarker,curMarker],
        });

        const vectorLayer = new VectorLayer({
            source: vectorSource,
        });



        //add layers into map
        this.map.addLayer(vectorLayer);
        },

        //set current location and view for departure airport
        changeToDepartureLoc(){
            this.currentLat=this.departureLocationLat;
            this.currentLong = this.departureLocationLong;
            this.mapLat = this.departureLocationLat;
            this.mapLong = this.departureLocationLong;
            const newCenter = fromLonLat([this.mapLong, this.mapLat]);
            this.map.getView().setCenter(newCenter);
        },
        //set current location and view for arrival airport
        changeToArrivalLoc(){
            this.currentLat=this.arrivalLocationLat;
            this.currentLong = this.arrivalLocationLong;
            this.mapLat = this.arrivalLocationLat;
            this.mapLong = this.arrivalLocationLong;
            const newCenter = fromLonLat([this.mapLong, this.mapLat]);
            this.map.getView().setCenter(newCenter);
        
        },

        //set map view for your current position
        changeToMyLoc(){
                this.map.getView().setCenter(this.latLongCurrentPosition);

        },

        //set map view for current opened airport map
        changeToCurrentLoc(){
            this.mapLat = this.currentLat;
            this.mapLong = this.currentLong;
            const newCenter = fromLonLat([this.mapLong, this.mapLat]);
            this.map.getView().setCenter(newCenter);
        
        },
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
  background-repeat: no-repeat;
  background-size: cover;
  background-position: calc(100%) calc(100%);
}

.bg {
    width: 100%;
  height: 100%;
  clip-path: polygon(70% 0, 100% 0, 100% 100%, 30% 100%);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: calc(30%) calc(30%); 

}
.container {
  height: 50vh;
}
</style>
