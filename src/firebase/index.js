// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCaotohqe9mwOy0xKSUk6p6tGzOmi4uvn4",
    authDomain: "flight-ticket-app-addaro.firebaseapp.com",
    projectId: "flight-ticket-app-addaro",
    storageBucket: "flight-ticket-app-addaro.appspot.com",
    messagingSenderId: "94838896700",
    appId: "1:94838896700:web:c7b3d496c3b7ce1687eb39"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)

const auth = getAuth(app)

export { auth }