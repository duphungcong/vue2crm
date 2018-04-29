import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import firebase from 'firebase'

Vue.use(Vuex)

const state = {
  user: null,
  loading: false,
  searching: '',
  error: null,
  following: null,
  check: null
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
  },
  setFollowing (state, payload) {
    state.following = payload
  }
}

const actions = {
  login({commit}, payload) {
    commit('setLoading', true)
    commit('clearError')
    firebase.auth().signInWithEmailAndPassword(payload.email, payload.password).then(
      (user) => {
        commit('setLoading', false)
        firebase.database().ref('users/' + user.uid).on('value',
          (data) => {
            let newUser = data.val()
            commit('setUser', newUser)
          },
          (error) => {
            console.log(error)
          }
        )
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
          email: user.email,
          displayName: '',
          photoUrl: '/assets/img/avatar0.png'
        }
        firebase.database().ref('users/' + user.uid).set(newUser).then(
          (data) => {
            commit('setUser', newUser)
          },
          (error) => {
            console.log(error)
          }
        )
      },
      (error) => {
        commit('setLoading', false)
        commit('setError', error)
      }
    )
  },
  autoSignIn ({commit}, payload) {
    firebase.database().ref('users/' + payload.uid).on('value',
      (data) => {
        let newUser = data.val()
        commit('setUser', newUser)
      },
      (error) => {
        console.log(error)
      }
    )
  },
  logOut ({commit}) {
    firebase.auth().signOut()
    commit('setUser', null)
  },
  clearError ({commit}) {
    commit('clearError')
  },
  beginLoading ({commit}) {
    commit('setLoading', true)
  },
  endLoading ({commit}) {
    commit('setLoading', false)
  },
  setFollowing({commit}, payload) {
    commit('setFollowing', payload)
  },
  stopFollowing ({commit}) {
    commit('setFollowing', null)
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
  },
  following (state) {
    return state.following
  }
}

const store = new Vuex.Store({
  plugins: [createPersistedState({ storage: window.sessionStorage })],
  state,
  mutations,
  actions,
  getters
})

export default store
