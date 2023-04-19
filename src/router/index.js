import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomeView.vue'
import Login from '../views/LoginView.vue'
import AddFlight from '../views/AddFlightView.vue'
import Seats from '../views/SeatsView.vue'
import Reserved from '../views/YourFlightsView.vue'
import Flight from '../views/FlightView.vue'
import { auth } from '@/firebase'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/AboutView.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/add_flight',
    name: 'AddFlight',
    component: AddFlight,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/auth/google',
    name: 'GoogleAuth',
    component: () => import('../views/GoogleAuthView.vue')
  },
  {
    path: '/flights/:flightId',
    name: 'Flight',
    component: Flight,
    props: true,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/reserved/:userId',
    name: 'Reserved',
    component: Reserved,
    props: true,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/flights/:flightId/seats',
    name: 'Seats',
    component: Seats,
    props: true,
    meta: {
      requiresAuth: true
    }
  }

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login' && auth.currentUser) {
    next('/')
    return;
  }

  if (to.matched.some(record => record.meta.requiresAuth) && !auth.currentUser) {
    next('/')
    return;
  }

  next();
})

export default router