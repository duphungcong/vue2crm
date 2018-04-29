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
        <v-btn color="blue" dark @click.native="update()">UPDATE
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
              <v-flex xs3 sm3 md3>
                <v-radio-group v-model="allStatus" row>
                  <v-radio value="done" color="green"></v-radio>
                  <v-radio value="inProgress" color="yellow darken-3"></v-radio>
                  <v-radio value="notYet" color="red"></v-radio>
                </v-radio-group>
              </v-flex>
              <v-flex xs2>
                <span>TASK ITEM ({{ scanList.length }})</span>
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
          <li v-for="item in scanList" :key="item.number">
            <v-card mx-0 px-0>
              <v-layout row wrap align-center mx-0 px-0>
                <v-flex xs3 sm3 md3>
                  <v-radio-group v-model="item.status" row>
                    <v-radio value="done" color="green"></v-radio>
                    <v-radio value="inProgress" color="yellow darken-3"></v-radio>
                    <v-radio value="notYet" color="red"></v-radio>
                  </v-radio-group>
                </v-flex>
                <v-flex xs2>
                  <span v-if="item.isNRC">NRC </span><span>{{ item.number }}</span>
                </v-flex>
                <v-flex xs6>
                  <v-text-field label="Remarks" v-model="item.notes"></v-text-field>
                </v-flex>
                <v-flex xs1 pl-3>
                  <v-btn icon @click.native="remove(item)">
                    <v-tooltip bottom>
                      <v-icon color="red" slot="activator">delete</v-icon><span>delete</span>
                    </v-tooltip>
                  </v-btn>
                  <v-icon color="green" v-if="item.updateSuccess">check</v-icon>
                  <v-icon color="red" v-if="item.updateFail">close</v-icon>
                </v-flex>
            </v-layout>
            </v-card>
          </li>
        </ul>
      </v-flex>
    </v-layout>
    <loading-progress></loading-progress>
  </v-container>
</template>

<script>

import firebase from 'firebase'

export default {
  name: 'BarcodeIn',
  data () {
    return {
      checkId: '',
      person: '',
      barcode: '',
      scan: [],
      scanList: [],
      scannedAlert: false,
      allStatus: ''
    }
  },
  watch: {
    allStatus (value) {
      if (value !== null && value !== undefined) {
        for (let key in this.scanList) {
          this.scanList[key].status = value
        }
      }
    }
  },
  methods: {
    onBarcodeScanned(barcode) {
      // console.log(barcode)
      this.scannedAlert = false
      let scanItem = this.formatBarcode(this.barcode)
      // console.log(scanItem)
      let found = this.scanList.find((item) => {
        return item.number === scanItem.number
      })
      if (found === undefined) {
        let now = Date.now(7)
        let time = new Date(now)
        // console.log(time)
        this.scanList.push({
          number: scanItem.number,
          isNRC: scanItem.isNRC,
          status: this.allStatus,
          time: time.toLocaleString(),
          notes: '',
          updateSuccess: false,
          updateFail: false
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
      let isNRC = barcode.substr(0, 3) === 'nrc'
      if (isNRC) {
        let nrcNumber = parseInt(barcode.substr(3, 7), 10)
        // console.log(nrcNumber)
        return {
          number: nrcNumber,
          isNRC: isNRC
        }
      } else {
        let workPackNumber = barcode.substr(8, 8)
        let itemNumber = parseInt(barcode.substr(16, 4), 10)
        return {
          number: 'VN' + workPackNumber + '-' + itemNumber,
          isNRC: isNRC
        }
      }
    },
    update() {
      this.$store.dispatch('beginLoading')
      this.scanList.forEach(element => {
        if (element.isNRC) {
          firebase.database().ref('nrcs/' + this.checkId).orderByChild('number').equalTo(element.number).limitToFirst(1).once('value').then(
            (data) => {
              // console.log(data.val())
              const obj = data.val()
              if (obj !== null && obj !== undefined) {
                for (let key in obj) {
                  if (element.notes !== null && element.notes !== undefined) {
                    obj[key].notes = element.notes
                  }
                  obj[key].status = element.status
                  let log = {
                    nrcId: obj[key].id,
                    status: element.status,
                    person: this.person,
                    time: element.time,
                    action: 'received',
                    notes: element.notes
                  }
                  let updates = {}
                  let newLogKey = firebase.database().ref('nrcLogs/' + this.checkId).push().key
                  updates['nrcs/' + this.checkId + '/' + obj[key].id] = obj[key]
                  updates['nrcLogs/' + this.checkId + '/' + newLogKey] = log
                  firebase.database().ref().update(updates).then(
                    (data) => {
                      element.updateSuccess = true
                    },
                    (error) => {
                      console.log(error)
                      element.updateFail = true
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
            })
        } else {
          firebase.database().ref('workpacks/' + this.checkId).orderByChild('wpItem').equalTo(element.number).limitToFirst(1).once('value').then(
            (data) => {
              // console.log(data.val())
              const obj = data.val()
              if (obj !== null && obj !== undefined) {
                for (let key in obj) {
                  if (element.notes !== null && element.notes !== undefined) {
                    obj[key].notes = element.notes
                  }
                  obj[key].status = element.status
                  let log = {
                    taskId: obj[key].id,
                    status: element.status,
                    person: this.person,
                    time: element.time,
                    action: 'received',
                    notes: element.notes
                  }
                  let updates = {}
                  let newLogKey = firebase.database().ref('taskLogs/' + this.checkId).push().key
                  updates['workpacks/' + this.checkId + '/' + key] = obj[key]
                  updates['taskLogs/' + this.checkId + '/' + newLogKey] = log
                  firebase.database().ref().update(updates).then(
                    (data) => {
                      element.updateSuccess = true
                    },
                    (error) => {
                      console.log(error)
                      element.updateFail = true
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
        }
      })
      this.$store.dispatch('endLoading')
    },
    remove(item) {
      let itemIndex = this.scanList.indexOf(item)
      if (itemIndex > -1) {
        this.scanList.splice(itemIndex, 1)
      }
    },
    clear() {
      this.scanList.forEach(element => {
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
    this.person = this.$store.getters.user.displayName || this.$store.getters.user.email
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

