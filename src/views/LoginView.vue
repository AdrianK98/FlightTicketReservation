<template>
    <div class="container-fluid">
        <div class="row justify-content-center align-items-center">
            <div class="col-md-6 col-lg-4">
                <form class="card p-4" @submit.prevent="login">
                    <h2 class="text-center mb-4">Login</h2>
                    <div class="form-group">
                        <input type="email" class="form-control" placeholder="Email address" v-model="login_form.email" />
                    </div>
                    <div class="form-group">
                        <input type="password" class="form-control" placeholder="Password" v-model="login_form.password" />
                    </div>
                    <button type="submit" class="btn btn-primary btn-block mt-4">Login</button>
                    <button @click.prevent="loginWithGoogle" class="btn btn-danger btn-block mt-4">
                        <i class="fab fa-google"></i> Login with Google
                    </button>
                </form>
            </div>
            <div class="col-md-6 col-lg-4">
                <form class="card p-4 my-4" @submit.prevent="register">
                    <h2 class="text-center mb-4">Register</h2>
                    <div class="form-group">
                        <input type="email" class="form-control" placeholder="Email address" v-model="register_form.email" />
                    </div>
                    <div class="form-group">
                        <input type="password" class="form-control" placeholder="Password" v-model="register_form.password" />
                    </div>
                    <button type="submit" class="btn btn-primary btn-block mt-4">Register</button>
                </form>
            </div>
        </div>
    </div>
</template>
<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import {auth} from "@/firebase";

export default {
    setup() {
        const login_form = ref({});
        const register_form = ref({});
        const store = useStore();

        const login = () => {
            store.dispatch('login', login_form.value);
        }

        const register = () => {
            store.dispatch('register', register_form.value);
        }

        const loginWithGoogle = async () => {
            const provider = new GoogleAuthProvider();
            try {
                const result = await signInWithPopup(auth, provider);
                const user = result.user;
                console.log('Logged in with Google: ', user);
            } catch (error) {
                console.log('Error logging in with Google: ', error.message);
            }
        }

        return {
            login_form,
            register_form,
            login,
            register,
            loginWithGoogle
        }
    }
}
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
    box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.1);
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