<template>
    <h1>Choose your seat</h1>
    <div class="container">
        <div class="row justify-content-center">
            <h2>Airplane Seats Map</h2>
        </div>
        <div class="row justify-content-center">
            <div class="col-md-5">
                <div class="row" v-for="(seatsInRow, row) in rows" :key="row">
                    <div class="col-4 mb-3" v-for="seat in seatsInRow.slice(0, 3)" :key="seat.id">
                        <div class="card" :class="{ 'bg-secondary': seat.reserved }">
                            <div class="card-body">
                                {{ seat.id }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-2"></div>
            <div class="col-md-5">
                <div class="row" v-for="(seatsInRow, row) in rows" :key="row">
                    <div class="col-4 mb-3" v-for="seat in seatsInRow.slice(3, 6)" :key="seat.id">
                        <div class="card" :class="{ 'bg-secondary': seat.reserved }">
                            <div class="card-body">
                                {{ seat.id }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>


</template>

<script>
import { db } from '@/firebase';
import { doc, getDoc } from "firebase/firestore";
export default {
    props:{
        flightId:{
            required: true,
        },
    },
    data() {
        return {
            seats: {},
        };
    },
    async mounted() {
        const flightId = this.$router.currentRoute._value.params.flightId
        const docRef = doc(db, "flights", flightId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            this.seats = docSnap.data().seats;
        } else {
            console.log("Failed to load");
        }
    },
    methods: {
        reserveSeat(id) {
            this.seats[id].reserved = true;
            //ADD FIREBASE SEATS UPDATE
        }
    },
    computed: {
        rows() {
            const rows = {};
            for (const seat in this.seats) {
                const seatNum = parseInt(seat);
                const row = Math.floor((seatNum - 1) / 6) + 1;
                const col = seatNum % 6;
                const isMiddleSpace = col === 3;
                const isRightOfMiddleSpace = col > 3;
                const seatInfo = {
                    id: seat,
                    reserved: this.seats[seat].reserved,
                    middleSpace: isMiddleSpace,
                    rightOfMiddleSpace: isRightOfMiddleSpace,
                };
                if (!rows[row]) {
                    rows[row] = [];
                }
                rows[row].push(seatInfo);
            }
            return Object.values(rows);
        },
    }
}
</script>

<style scoped>
.container {
    display: flex; /* Use flexbox to align divs horizontally */
    flex-wrap: wrap; /* Wrap the divs to new line on smaller screens */
}

.container > div {
    flex: 1 1 100%; /* Each div should take 100% width on smaller screens */
}

@media (min-width: 768px) {
    /* Reset flexbox styles for larger screens */
    .container {
        display: block;
    }
}
</style>