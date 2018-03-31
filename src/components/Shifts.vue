<template>
  <v-container fluid grid-list-sm>
    <v-layout row wrap>
      <v-flex lg12 md12 sm12 xs12>
         <v-card>
            <v-card-actions>
              <v-btn @click.native="reset">Reset</v-btn>
              <v-btn @click.native="update" class="blue">Update</v-btn>
            </v-card-actions>
          </v-card>
      </v-flex>
      <v-flex lg1 md1 sm1 xs1 v-for="n in shifts.length" :key="n">
        <shift :date="dateOfShift(n)" :current="isCurrentShift(n)" :number="Number.parseInt(n)" :status="shifts[n-1]" @change="updateStatus($event)"></shift>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

import firebase from 'firebase'
import Shift from './Shift.vue'

export default {
  name: 'Shifts',
  data () {
    return {
      checkId: null,
      check: {
        aircraft: '',
        startDate: ''
      },
      shifts: [],
      restoreShifts: []
    }
  },
  computed: {
    currentShift () {
      let today = Date.now()
      let start = new Date(this.check.startDate)
      let diff = new Date(today - start)
      return diff.getUTCDate()
    }
  },
  methods: {
    loadCheckById(id) {
      this.checkId = id
      firebase.database().ref('checks').child(this.checkId + '/aircraft').once('value').then(
        (data) => {
          this.check.aircraft = data.val()
        },
        (error) => {
          console.log(error)
        }
      )
      firebase.database().ref('checks').child(this.checkId + '/startDate').once('value').then(
        (data) => {
          this.check.startDate = data.val()
        },
        (error) => {
          console.log(error)
        }
      )
      firebase.database().ref('checks').child(this.checkId + '/shifts').once('value').then(
        (data) => {
          this.shifts = data.val()
        },
        (error) => {
          console.log(error)
        }
      )
    },
    updateStatus(event) {
      this.shifts[event.number - 1] = event.status
    },
    isCurrentShift(n) {
      return this.currentShift === n
    },
    dateOfShift(n) {
      let start = new Date(this.check.startDate)
      let date = new Date(start.getTime() + (n - 1) * 24 * 60 * 60 * 1000)
      return date.toDateString()
    }
  },
  components: {
    shift: Shift
  },
  mounted() {
    this.loadCheckById(this.$route.params.id)
  }
}
</script>

