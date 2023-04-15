<template>
<div class="container-fluid">
    <!--Product add-->
    <div class="container">
        <h1>Dodaj produkt</h1>
        <form>


                <div class="container text-center">
                    <div class="row row-cols-2 justify-content-md-center">
                        <div class="col col-lg-2">
                            <input type="text" class="form-control" id="flight-number" v-model="flightNumber" placeholder="flightnumber" aria-label="Zip">
                        </div>
                        <div class="col col-lg-2">
                            <input type="text" class="form-control" id="destination" v-model="destination" placeholder="destination" aria-label="Zip">
                        </div>
                    </div>

                    <div class="row row-cols-2 justify-content-md-center mt-3">
                        <div class="col col-lg-4">
                            <input type="text" class="form-control" placeholder="Zip" aria-label="Zip">
                        </div>

                    </div>

                </div>
                <button type="button" @click="submitFlight">Submit Flight</button>
        </form>
    </div>
</div>
</template>
<script>

import {db} from '@/firebase'
import { doc, setDoc } from "firebase/firestore"
export default {
  data() {
    return {
      flightNumber: "",
      destination: "",
      successMessage: "",
      errorMessage: ""
    };
  },
  methods: {
    async submitFlight() {
      try {

        const docRef = await setDoc(doc(db, "flights", this.flightNumber),
        {destination:this.destination,
        test:"tet"
        });
        

        this.successMessage = `Flight ${docRef} added successfully!`;
        this.errorMessage = "";


      } catch (error) {
        
        this.errorMessage = `Error adding flight: ${error.message}`;
        console.log(this.errorMessage);
      }
    }
  }
};

import 'bootstrap/dist/css/bootstrap.css'
import 'jquery'
import 'popper.js'
import 'bootstrap/dist/js/bootstrap'
</script>
<style>
body {
    background-color: #f0f7ff;
    padding: 50px;
}

.container-fluid {
    height: 100vh;
}

.card {
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.1);
}

.btn-primary {
    background-color: #007bff;
    border-color: #007bff;
}

.btn-primary:hover {
    background-color: #0069d9;
    border-color: #0062cc;
}
</style>