<template>
    <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
    </head>
    <div id="nav" v-if="$store.state.user">
        <router-link to="/">Home</router-link> |
        <router-link to="/about">Scan QR code</router-link> |
        <router-link to="/add_flight">Add Flight</router-link> |
        <router-link :to="{ name: 'Reserved', params: { userId: $store.state.userId }}">Your Flights</router-link> |
        <button type="button" class="btn btn-info" @click="$store.dispatch('logout')">Logout</button>
    </div>
    <router-view/>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.css'
import 'jquery'
import 'popper.js'
import 'bootstrap/dist/js/bootstrap'
import { onBeforeMount } from 'vue'
import { useStore } from 'vuex'


export default {
    setup() {
        const store = useStore()

        onBeforeMount(() => {
            store.dispatch('fetchUser')
        })
    },
}


</script>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

#nav {
    padding: 30px;
}

#nav a {
    font-weight: bold;
    color: #2c3e50;
}

#nav a.router-link-exact-active {
    color: #42b983;
}
</style>