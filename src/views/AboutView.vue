<template>
   <div class="container-sm">
     <p class="decode-result"><b>Scan your QR code!</b></p>
 
     <qrcode-stream v-if="isScanning" :camera="camera" @decode="onDecode" @init="onInit">
 
       <div v-if="validationSuccess" class="validation-success">
         This is a URL
       </div>
 
       <div v-if="validationFailure" class="validation-failure">
         This is NOT a URL!
       </div>
 
       <div v-if="validationPending" class="validation-pending">
         Long validation in progress...
       </div>
 
     </qrcode-stream>
 
     <button class="btn btn-warning" v-else @click="startScanning">Start Scanning</button>
 
   </div>
 </template>
 
 <script>
 import { QrcodeStream } from 'vue3-qrcode-reader'
 import { db } from '../firebase/index.js';
 import { collection, getDocs} from "firebase/firestore";
 import router from '../router';
 
 export default {
   components: { QrcodeStream },
 
   data () {
     return {
       isValid: undefined,
       camera: 'auto',
       flightsIds:[],
       isScanning: false
     }
   },
 
   async mounted() {
     const q = collection(db, "flights")
     const querySnapshot = await getDocs(q);
     querySnapshot.forEach((doc) => {
       // doc.data() is never undefined for query doc snapshots
       this.flightsIds.push(doc.id)
     });
   },
 
   computed: {
     validationPending () {
       return this.isValid === undefined && !this.isScanning
     },
 
     validationSuccess () {
       return this.isValid === true;
     },
 
     validationFailure () {
       return this.isValid === false
     }
   },
 
   methods: {
     onInit (promise) {
       promise.catch(console.error).then(this.resetValidationState)
     },
 
     resetValidationState () {
       this.isValid = undefined
     },
 
     async onDecode (content) {
       this.result = content
       this.turnCameraOff()
 
       //validate and route for flight if qr is correct
       if (this.flightsIds.includes(content)){
         this.isValid = true;
         await router.push('/flights/'+ content)
       }
       else{
         console.log("NOT SAME!!")
       }
 
       // some more delay, so users have time to read the message
       await this.timeout(2000)
 
       this.turnCameraOn()
     },
 
     startScanning () {
       this.isScanning = true
     },
 
     turnCameraOn () {
       this.camera = 'auto'
       this.isScanning = false
     },
 
     turnCameraOff () {
       this.camera = 'off'
     },
 
     timeout (ms) {
       return new Promise(resolve => {
         window.setTimeout(resolve, ms)
       })
     }
   }
 }
 </script>
 
 <style scoped>
 .validation-success,
 .validation-failure,
 .validation-pending {
   position: absolute;
   width: 100%;
   height: 100%;
 
   background-color: rgba(255, 255, 255, .8);
   text-align: center;
   font-weight: bold;
   font-size: 1.4rem;
   padding: 10px;
 
   display: flex;
   flex-flow: column nowrap;
   justify-content: center;
 }
 .validation-success {
   color: green;
 }
 .validation-failure {
   color: red;
 }
 </style>
 