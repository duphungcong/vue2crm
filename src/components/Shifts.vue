<template>
  <v-container fluid grid-list-sm>
    <v-layout row wrap>
      <v-flex xs12>
         <v-card>
            <v-card-actions>
              <v-btn @click.native="reset">Reset</v-btn>
              <v-btn @click.native="update" class="blue white--text">Update</v-btn>
            </v-card-actions>
          </v-card>
      </v-flex>
      <v-flex xs12>
        <v-card>
          <v-card-actions>
            <v-layout row wrap align-baseline>
              <v-flex xs4>
                <v-select :items="check.shifts" label="Select shift" item-text="number" item-value="number" v-model="selectedShiftNumber"></v-select>
              </v-flex>
              <v-flex xs1></v-flex>
              <v-flex xs2>
                <v-text-field label="Number of shifts" :value="check.shifts.length" type="number"></v-text-field>
              </v-flex>
              
              <!-- <v-flex xs1>
                <shift v-if="selectedShiftNumber !== null"
                  :date="dateOfShift(selectedShiftNumber)"
                  :current="isCurrentShift(selectedShiftNumber)"
                  :shift="selectedShift"
                  @change="updateStatus($event, selectedShift)"></shift>
              </v-flex> -->
               
            </v-layout>
          </v-card-actions>
        </v-card>
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
      check: {},
      selectedShift: {},
      selectedShiftNumber: null
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
  watch: {
    selectedShiftNumber(newValue, oldValue) {
      this.check.shifts.forEach((element) => {
        if (element.number === newValue) {
          this.selectedShift = element
        }
      })
    }
  },
  methods: {
    loadCheck() {
      firebase.database().ref('checks').child(this.checkId).on('value',
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

