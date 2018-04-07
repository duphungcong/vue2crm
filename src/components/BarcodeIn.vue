<template>
  <v-container fluid grid-list-sm>
    <v-layout row wrap>
      <v-flex xs4 pl-2>
        <v-text-field
          label="Scan Task"
          autofocus
          @change.native="onBarcodeScanned(barcode)"
          v-model="barcode"></v-text-field>
        <v-alert type="success" v-model="scannedAlert">
          This task is already scanned!
        </v-alert>
      </v-flex>
      <v-flex xs6>
        <v-btn color="blue darken-2" dark @click.native="update()">UPDATE
          <v-icon dark right>arrow_forward</v-icon>
        </v-btn>
      </v-flex>
      <v-flex xs12>
        <v-card class="elevation-1">
          <v-layout row wrap>
              <v-flex xs1>Done</v-flex>
              <v-flex xs1>In-Progress</v-flex>
              <v-flex xs1>Not Yet</v-flex>
            </v-layout>
            <v-layout row wrap align-center>
              <v-flex xs1>
                <v-checkbox hide-details class="shrink mr-2" v-model="allDone" color="green"></v-checkbox>
              </v-flex>
              <v-flex xs1>
                <v-checkbox hide-details class="shrink mr-2" v-model="allInProgress" color="yellow"></v-checkbox>
              </v-flex>
              <v-flex xs1>
                <v-checkbox hide-details class="shrink mr-2" v-model="allNotYet" color="red"></v-checkbox>
              </v-flex>
              <v-flex xs2>
                <span>TASK ITEM ({{ scan.length }})</span>
              </v-flex>
              <v-flex xs6>
                <span>NOTES</span>
              </v-flex>
              <v-flex xs1>
                <v-btn flat icon color="blue" @click.native="clear()">
                  <v-icon medium>loop</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
        </v-card>
      </v-flex>
      <v-flex xs12>
        <ul>
          <li v-for="item in scan" :key="item.wpItem">
            <v-card mx-0 px-0>
              <v-layout row wrap align-center mx-0 px-0>
                <v-flex xs1>
                  <v-checkbox hide-details class="shrink mr-2" v-model="item.done" color="green"></v-checkbox>
                </v-flex>
                <v-flex xs1>
                  <v-checkbox hide-details class="shrink mr-2" v-model="item.inProgress" color="yellow"></v-checkbox>
                </v-flex>
                <v-flex xs1>
                  <v-checkbox hide-details class="shrink mr-2" v-model="item.notYet" color="red"></v-checkbox>
                </v-flex>
                <v-flex xs2>
                  <span>{{ item.wpItem }}</span>
                </v-flex>
                <v-flex xs6>
                  <v-text-field label="Remarks" v-model="item.notes"></v-text-field>
                </v-flex>
                <v-flex xs1 pl-3>
                  <v-icon color="red">delete</v-icon>
                  <v-icon color="green" v-if="item.updateSuccess">check</v-icon>
                  <v-icon color="red" v-if="item.updateFail">close</v-icon>
                </v-flex>
            </v-layout>
            </v-card>
          </li>
        </ul>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

import firebase from 'firebase'

export default {
  name: 'BarcodeIn',
  data () {
    return {
      checkId: '',
      barcode: '',
      scan: [],
      scannedAlert: false,
      allDone: false,
      allInProgress: false,
      allNotYet: false
    }
  },
  watch: {
    allDone (value) {
      if (value === true) {
        this.allInProgress = false
        this.allNotYet = false
        for (let key in this.scan) {
          this.scan[key].done = true
          this.scan[key].inProgress = false
          this.scan[key].notYet = false
        }
      }
    },
    allInProgress (value) {
      if (value === true) {
        this.allDone = false
        this.allNotYet = false
        for (let key in this.scan) {
          this.scan[key].done = false
          this.scan[key].inProgress = true
          this.scan[key].notYet = false
        }
      }
    },
    allNotYet (value) {
      if (value === true) {
        this.allInProgress = false
        this.allDone = false
        for (let key in this.scan) {
          this.scan[key].done = false
          this.scan[key].inProgress = false
          this.scan[key].notYet = true
        }
      }
    }
  },
  methods: {
    onBarcodeScanned(barcode) {
      // console.log(barcode)
      this.scannedAlert = false
      let wpItem = this.formatBarcode(this.barcode)
      let found = this.scan.find((item) => {
        return item.wpItem === wpItem
      })
      if (found === undefined) {
        let now = Date.now(7)
        let time = new Date(now)
        this.scan.push({
          wpItem: wpItem,
          notes: '',
          time: time.toLocaleString(),
          updateSuccess: false,
          updateFail: false,
          done: false,
          inProgress: false,
          notYet: false
        })
      } else {
        this.scannedAlert = true
        setTimeout(() => {
          this.scannedAlert = false
        }, 2000)
      }
      this.barcode = ''
    },
    resetBarcode() {
      // let barcode = this.$barcodeScanner.getPreviousCode()
      // console.log(barcode)
    },
    formatBarcode(barcode) {
      let workPackNumber = barcode.substr(8, 8)
      let itemNumber = parseInt(barcode.substr(16, 4), 10)
      // console.log(workPackNumber)
      // console.log(itemNumber)
      return 'VN' + workPackNumber + '-' + itemNumber
    },
    update() {
      this.scan.forEach(element => {
        firebase.database().ref('workpacks/' + this.checkId).orderByChild('wpItem').equalTo(element.wpItem).limitToFirst(1).once('value').then(
          (data) => {
            console.log(data.val())
            let status
            if (element.notYet === true) {
              status = 'notYet'
            }
            if (element.inProgress === true) {
              status = 'inProgress'
            }
            if (element.done === true) {
              status = 'done'
            }
            const obj = data.val()
            if (obj !== null && obj !== undefined) {
              for (let key in obj) {
                if (element.notes !== null && element.notes !== undefined) {
                  obj[key].notes = element.notes
                }
                obj[key].status = status
                let log = {
                  status: status,
                  person: 'PPC',
                  time: element.time,
                  action: 'receive',
                  notes: element.notes
                }
                firebase.database().ref('workpacks/' + this.checkId + '/' + key).update(obj[key]).then(
                  (data) => {
                    console.log('update completed')
                    element.updateSuccess = true
                  },
                  (error) => {
                    console.log(error)
                    element.updateFail = true
                  }
                )
                firebase.database().ref('taskLogs/' + this.checkId + '/' + key).push(log).then(
                  (data) => {
                    console.log('log - receive')
                  },
                  (error) => {
                    console.log(error)
                  }
                )
              }
              return
            }
            element.updateFail = true
          },
          (error) => {
            element.updateFail = true
            console.log(error)
          }
        )
      })
    },
    clear() {
      this.scan.forEach(element => {
        element.updateSuccess = false
        element.updateFail = false
      })
    }
  },
  created() {
    this.$barcodeScanner.init(this.onBarcodeScanned)
  },
  mounted() {
    this.checkId = this.$store.getters.following
  },
  destroyed() {
    this.$barcodeScanner.destroy()
  }
}
</script>

<style scoped>
  div.container .layout .flex .card {
    padding-left: 6px
  }
</style>

