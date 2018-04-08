<template>
  <v-container>
    <v-layout>
      <v-flex xs12>
        server: {{ serverTime }}
        <br>
        client: {{ clientTime }}
        <br>
        shift: {{ currentShift }}
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

import firebase from 'firebase'

export default {
  name: 'Time',
  data () {
    return {
      serverTime: '',
      clientTime: '',
      currentShift: ''
    }
  },
  methods: {
    getClientTime() {
      let today = Date.now(7)
      let time = new Date(today)
      this.clientTime = time.toLocaleString()
      let start = new Date('2018-04-06')
      let diff = new Date(today - start)
      this.currentShift = diff.getUTCDate()
      console.log(this.clientTime)
    },
    getServerTime() {
      this.serverTime = firebase.database.ServerValue.TIMESTAMP
      console.log(this.serverTime)
    }
  },
  mounted() {
    this.getServerTime()
    this.getClientTime()
  }
}
</script>

