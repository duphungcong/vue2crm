import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import firebase from 'firebase'

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
    console.log('write user state')
    console.log(payload)
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
          id: user.uid
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
          id: user.uid
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
    console.log('auto signin')
    commit('setUser', {id: payload.uid})
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
    console.log('read user state')
    console.log(state.user)
    return state.user
  },
  error (state) {
    return state.error
  },
  loading (state) {
    return state.loading
  }
}

export default new Vuex.Store({
  plugins: [createPersistedState({ storage: window.sessionStorage })],
  state,
  mutations,
  actions,
  getters
})
