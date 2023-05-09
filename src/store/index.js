import { createStore } from 'vuex'
import router from '../router'
import { auth } from '@/firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'

export default createStore({
  state: {
    user: null,
    userId: null
  },
  mutations: {

    SET_USER (state, user) {

      state.user = user
      state.userId = user.uid
    },

    CLEAR_USER (state) {
      state.user = null
      state.userId = null
    }

  },
  actions: {
    async login ({ commit }, details) {
   
      const { email, password } = details

      try {
        await signInWithEmailAndPassword(auth, email, password)
      } catch (error) {
        switch(error.code) {
          default:
            alert("Something went wrong")
        }

        return
      }

      commit('SET_USER', auth.currentUser)

      await router.push('/')
    },

    async register ({ commit}, details) {
      const { email, password } = details

      try {
        await createUserWithEmailAndPassword(auth, email, password)
      } catch (error) {
        switch(error.code) {
          case 'auth/email-already-in-use':
            alert("Email already in use")
            break
          case 'auth/invalid-email':
            alert("Invalid email")
            break
          case 'auth/operation-not-allowed':
            alert("Operation not allowed")
            break
          case 'auth/weak-password':
            alert("Weak password")
            break
          default:
            alert("Something went wrong")
        }

        return
      }

      commit('SET_USER', auth.currentUser)

      await router.push('/')
    },

    async logout ({ commit }) {


      await signOut(auth)

      commit('CLEAR_USER')

      await router.push('/login')
    },

    async loginWithGoogle({commit}) {
      const provider = new GoogleAuthProvider()
      try {
        const result = await signInWithPopup(auth, provider)
        const user = result.user
        commit('SET_USER', user)
        await router.push('/')
      } catch (error) {
        alert("Something went wrong")
      }
    },

    fetchUser ({ commit }) {
      auth.onAuthStateChanged(async user => {
        if (user === null) {
          commit('CLEAR_USER')
        } else {
          commit('SET_USER', user)

          if (await router.isReady() && router.currentRoute.value.path === '/login') {
            await router.push('/')
          }
        }
      })
    }

  }
})