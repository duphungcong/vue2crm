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
        <shift :number="Number.parseInt(n)" :status="shifts[n-1]" @change="updateStatus($event)"></shift>
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
        name: ''
      },
      shifts: [
        // { elect: true, air: true, hyd: true },
        // { elect: true, air: false, hyd: true },
        // { elect: true, air: false, hyd: false },
        // { elect: true, air: true, hyd: true },
        // { elect: true, air: false, hyd: true },
        // { elect: true, air: false, hyd: false },
        // { elect: true, air: true, hyd: true },
        // { elect: true, air: false, hyd: true },
        // { elect: true, air: false, hyd: false },
        // { elect: true, air: true, hyd: true }
      ],
      restoreShiftStatus: []
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
      firebase.database().ref('checks').child(this.checkId + '/name').once('value').then(
        (data) => {
          this.check.name = data.val()
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
    reset() {
      this.shifts = Object.create(this.restoreStatus)
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

