<template>
  <v-container fluid grid-list-sm>
    <v-layout row wrap>
      <v-flex lg12 md12 sm12 xs12>
         <v-card>
            <v-card-actions>
              <v-btn @click.native="reset">Reset</v-btn>
              <v-btn @click.native="update" class="blue white--text">Update</v-btn>
            </v-card-actions>
          </v-card>
      </v-flex>
      <v-flex lg1 md1 sm1 xs1 v-for="shift in check.shifts" :key="shift.number">
        <shift
          :date="dateOfShift(shift.number)"
          :current="isCurrentShift(shift.number)"
          :shift="shift"
          @change="updateStatus($event, shift)"></shift>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

import firebase from 'firebase'
import Shift from './shared/Shift.vue'

export default {
  name: 'Shifts',
  data () {
    return {
      checkId: null,
      check: {}
    }
  },
  computed: {
    currentShift () {
      let today = Date.now(7)
      let start = new Date(this.check.startDate)
      let diff = new Date(today - start)
      return diff.getUTCDate()
    }
  },
  methods: {
    loadCheck() {
      firebase.database().ref('checks').child(this.checkId).once('value').then(
        (data) => {
          this.check = data.val()
        },
        (error) => {
          console.log(error)
        }
      )
    },
    updateStatus(event, shift) {
      shift = event
    },
    isCurrentShift(n) {
      return this.currentShift === n
    },
    dateOfShift(n) {
      let start = new Date(this.check.startDate)
      let date = new Date(start.getTime() + (n - 1) * 24 * 60 * 60 * 1000)
      return date.toDateString()
    },
    update() {
      const rootComponent = this.appUtil.getRootComponent(this)
      firebase.database().ref('checks/' + this.checkId + '/shifts').set(this.check.shifts).then(
        (data) => {
          rootComponent.openSnackbar('Success', 'success')
        },
        (error) => {
          // console.log(error)
          rootComponent.openSnackbar(error, 'error')
        }
      )
    }
  },
  components: {
    shift: Shift
  },
  mounted() {
    this.checkId = this.$store.getters.following
    this.loadCheck()
  }
}
</script>

