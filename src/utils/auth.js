/* globals Store */
import api from './backend-api'
import firebase from 'firebase'

export default {
  login (email, pass, cb) {
    cb = arguments[arguments.length - 1]
    let data = 'username=' + email + '&password=' + pass
    api.login('token', data).then((res) => {
      let token = res.access_token || res.data.access_token
      let user = res.user || res.data.user
      Store.commit('setToken', token)
      Store.commit('setUser', user)
      if (cb) cb(true, null)
      this.onChange(true)
    }, (err) => {
      console.log(err)
      if (cb) cb(false, err)
      this.onChange(false)
    })
  },
  signUpFireBase (email, password, cb) {
    cb = arguments[arguments.length - 1]
    firebase.auth().createUserWithEmailAndPassword(email, password).then(
      (user) => {
        Store.commit('setUser', user)
        if (cb) cb(true, null)
        this.onChange(true)
      },
      (err) => {
        if (cb) cb(false, err)
        this.onChange(false)
      }
    )
  },
  getToken () {
    return Store.state.token
  },
  logout (cb) {
    // delete localStorage.token
    Store.commit('setToken', null)
    if (cb) cb(false)
    this.onChange(false)
  },
  loggedIn () {
    return !!Store.state.token
  },
  onChange () {}
}
