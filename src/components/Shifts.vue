<template>
  <v-container fluid grid-list-sm>
    <v-layout row wrap>
      <v-flex xs12>
         <v-card>
            <v-card-actions>
              <v-btn @click.native="reset">Reset</v-btn>
              <v-btn :disabled="hasError" @click.native="updateShiftNumber" class="blue white--text">Update</v-btn>
            </v-card-actions>
          </v-card>
      </v-flex>
      <v-flex xs12>
        <v-card>
          <v-card-actions>
            <v-layout row wrap align-baseline>
              <!-- <v-flex xs4>
                <v-select :items="check.shifts" label="Select shift" item-text="number" item-value="number" v-model="selectedShiftNumber"></v-select>
              </v-flex>
              <v-flex xs1></v-flex> -->
              <v-flex xs2>
                <v-text-field :rules="[rules.moreThan]" label="Number of shifts" type="number" v-model="numberOfShifts"></v-text-field>
              </v-flex>
              <!-- <v-btn :disabled="hasError" @click.native="updateShiftNumber" class="blue white--text">Update</v-btn> -->
              <v-flex xs12>
                <v-layout row wrap>
                  <v-flex xs1 v-for="shift in check.shifts" :key="shift.number">
                    <shift
                      :date="dateOfShift(shift.number)"
                      :current="isCurrentShift(shift.number)"
                      :shift="shift"
                      @change="updateStatus($event, shift)"></shift>
                  </v-flex>
                </v-layout>
              </v-flex> 
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
      check: {
        shifts: []
      },
      minShift: 0,
      numberOfShifts: null,
      // selectedShift: {},
      // selectedShiftNumber: null
      hasError: false,
      rules: {
        moreThan: (value) => {
          if (value >= this.minShift) {
            this.hasError = false
            return true
          } else {
            this.hasError = true
            return 'Number of shifts must be more than or equal ' + this.minShift + ' (number of days)'
          }
        }
      }
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
  // watch: {
  //   selectedShiftNumber(newValue, oldValue) {
  //     this.check.shifts.forEach((element) => {
  //       if (element.number === newValue) {
  //         this.selectedShift = element
  //       }
  //     })
  //   }
  // },
  methods: {
    loadCheck() {
      firebase.database().ref('checks').child(this.checkId).on('value',
        (data) => {
          this.check = data.val()
          this.numberOfShifts = this.check.shifts.length
          this.minShift = this.appUtil.getNumberOfShifts(this.check)
        },
        (error) => {
          console.log(error)
        }
      )
    },
    updateShiftNumber() {
      console.log('go')
      let oldShiftNumber = Number.parseInt(this.check.shifts.length)
      let newShiftNumber = Number.parseInt(this.numberOfShifts)
      if (newShiftNumber > oldShiftNumber) {
        for (let i = oldShiftNumber; i < newShiftNumber; i++) {
          console.log(i)
          this.check.shifts.push({
            number: i + 1,
            elect: true,
            air: true,
            hyd: true
          })
        }
      }
      if (newShiftNumber < oldShiftNumber) {
        for (let i = 0; i < oldShiftNumber - newShiftNumber; i++) {
          this.check.shifts.pop()
        }
      }
      this.update()
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

