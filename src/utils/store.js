import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import firebase from 'firebase'
import router from '@/router'

Vue.use(Vuex)

const state = {
  user: null,
  loading: false,
  searching: '',
  error: null
}

const mutations = {
  setUser (state, payload) {
    state.user = payload
  },
  setLoading (state, payload) {
    state.loading = payload
  },
  setError (state, payload) {
    state.error = payload
  },
  clearError (state) {
    state.error = null
  }
}

const actions = {
  login({commit}, payload) {
    commit('setLoading', true)
    commit('clearError')
    firebase.auth().signInWithEmailAndPassword(payload.email, payload.password).then(
      (user) => {
        commit('setLoading', false)
        const newUser = {
          id: user.uid,
          email: user.email
        }
        commit('setUser', newUser)
      },
      (error) => {
        commit('setLoading', false)
        commit('setError', error)
      }
    )
  },
  signUp({commit}, payload) {
    commit('setLoading', true)
    commit('clearError')
    firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password).then(
      (user) => {
        commit('setLoading', false)
        const newUser = {
          id: user.uid,
          email: user.email
        }
        commit('setUser', newUser)
      },
      (error) => {
        commit('setLoading', false)
        commit('setError', error)
      }
    )
  },
  autoSignIn ({commit}, payload) {
    commit('setUser', {id: payload.uid, email: payload.email})
  },
  logOut ({commit}) {
    firebase.auth().signOut()
    commit('setUser', null)
  },
  clearError ({commit}) {
    commit('clearError')
  }
}

const getters = {
  user (state) {
    return state.user
  },
  error (state) {
    return state.error
  },
  loading (state) {
    return state.loading
  }
}

const store = new Vuex.Store({
  plugins: [createPersistedState({ storage: window.sessionStorage })],
  state,
  mutations,
  actions,
  getters
})

store.watch(
  (state) => state.user, (newValue, oldValue) => {
    if (oldValue == null) {
      router.push('/')
    } else if (newValue == null) {
      router.push('login')
    }
  }
)

export default store
