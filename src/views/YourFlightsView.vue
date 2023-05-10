<template>
    <div class="container">
        <div class="row">
            <div class="col-md-4" v-for="(flight, index) in reservedFlights" :key="index">

                <div class="card mb-4 box-shadow">
                    <router-link :to="{ name: 'Flight', params: { flightId: index } }">
                        <div class="card-body">
                            <h5 class="card-title">{{flight.number}}</h5>
                            <h5 class="card-title">From: {{flight.departure}}</h5>
                            <h5 class="card-title">To: {{flight.arrive}}</h5>
                            <p class="card-text">Your reserved seats: </p>
                            {{ flight.seats.join(', ')}}


                        </div>
                    </router-link>
                </div>

            </div>
        </div>
    </div>
</template>
<script>
import { doc, getDoc} from "firebase/firestore";
import { db } from '@/firebase';
export default {
  data() {
      return {
          userId:'',
          reservedFlights:[],
          flightsData:'',
          flightData:'',
      };
  },
  async mounted() {
    //Read uid from url
    this.userId = this.$router.currentRoute._value.params.userId;
    //Get userFlights data
    const flightsRef = doc(db, "userFlights", this.userId);
    const flightsSnap = await getDoc(flightsRef);

    // const flightDataRef = doc(db, "flights", this.userId) DELETE?

    this.reservedFlights = flightsSnap.data();
//    this.flightData = new Map(Object.entries(this.reservedFlights)); DELETE?



  },
}

</script>
