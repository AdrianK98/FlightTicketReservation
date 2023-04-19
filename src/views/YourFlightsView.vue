<template>
    <div class="container">
        <div class="row">
            <div class="col-md-4" v-for="(flight, index) in reservedFlights" :key="index">

                <div class="card mb-4 box-shadow">
                    <router-link :to="{ name: 'Flight', params: { flightId: index } }">
                        <div class="card-body">
                            <h5 class="card-title">Flight ID {{ index}}</h5>
                            <p class="card-text">Seats: {{ flight.seats }}</p>


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

      };
  },
  async mounted() {
    this.userId = this.$router.currentRoute._value.params.userId;
    const flightsRef = doc(db, "userFlights", this.userId);
    const flightsSnap = await getDoc(flightsRef);

    this.reservedFlights = flightsSnap.data();
    console.log(this.reservedFlights);
  },
}

</script>
