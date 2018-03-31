// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App'
import router from './router'
import store from './store'
import api from './utils/backend-api'
import appUtil from './utils/app-util'

import firebase from 'firebase'

import VueProgressBar from 'vue-progressbar'
import LoadingProgress from './components/shared/LoadingProgress.vue'

const options = {
  color: '#2196f3',
  failedColor: '#874b4b',
  thickness: '5px',
  transition: {
    speed: '0.1s',
    opacity: '0.5s',
    termination: 400
  },
  autoRevert: true,
  location: 'top',
  inverse: false
}

Vue.use(VueProgressBar, options)

Vue.use(Vuetify)
Vue.config.productionTip = false
Vue.component('loading-progress', LoadingProgress)

window.Store = store
Vue.prototype.api = api
Vue.prototype.appUtil = appUtil

// Initialize Firebase
let config = {
  apiKey: 'AIzaSyBXnXeRynieZD55-zDCpXD0BlHuQQZHH7c',
  authDomain: 'vue2crm.firebaseapp.com',
  databaseURL: 'https://vue2crm.firebaseio.com',
  projectId: 'vue2crm',
  storageBucket: 'vue2crm.appspot.com',
  messagingSenderId: '201150997664'
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  created () {
    firebase.initializeApp(config)
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch('autoSignIn', user)
      } else {
        this.$store.dispatch('logOut')
      }
    })
  }
})
