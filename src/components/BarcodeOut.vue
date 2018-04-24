<template>
  <v-container fluid grid-list-sm>
    <v-layout row wrap>
      <v-flex xs4 pl-2>
        <v-text-field
          label="Scan Task"
          @change.native="onBarcodeScanned(barcode)"
          v-model="barcode"
          :disabled="person === null || person.length < 4"></v-text-field>
        <v-text-field
          autofocus
          counter="4"
          mask="####"
          clearable
          label="Type vaeco ID (4 digits) to active scan"
          v-model="person"></v-text-field>
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
          <v-layout row wrap align-center>
            <v-flex xs2>
              <span>TASK ITEM ({{ scanList.length }})</span>
            </v-flex>
            <v-flex xs2>
              <span>PERSON</span>
            </v-flex>
            <v-flex xs2>
              <span>TIME</span>
            </v-flex>
            <v-flex xs5>
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
                <v-flex xs2>
                  <span v-if="item.isNRC">NRC </span><span>{{ item.number }}</span>
                </v-flex>
                <v-flex xs2>
                  <span>{{ item.person }}</span>
                </v-flex>
                <v-flex xs2>
                  <span>{{ item.time }}</span>
                </v-flex>
                <v-flex xs5>
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
  name: 'BarcodeOut',
  data () {
    return {
      checkId: '',
      barcode: '',
      person: '',
      scanList: [],
      scannedAlert: false
    }
  },
  methods: {
    onBarcodeScanned(barcode) {
      // console.log(barcode)
      this.scannedAlert = false
      let scanItem = this.formatBarcode(this.barcode)
      console.log(scanItem)
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
          person: this.person,
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
        console.log(nrcNumber)
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
                  obj[key].status = 'out'
                  let log = {
                    nrcId: obj[key].id,
                    status: 'out',
                    person: element.person,
                    time: element.time,
                    action: 'take out',
                    notes: element.notes
                  }
                  firebase.database().ref('nrcs/' + this.checkId + '/' + obj[key].id).update(obj[key]).then(
                    (data) => {
                      element.updateSuccess = true
                    },
                    (error) => {
                      console.log(error)
                      element.updateFail = true
                    }
                  )
                  firebase.database().ref('nrcLogs/' + this.checkId).push(log).then(
                    (data) => {},
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
                  obj[key].status = 'out'
                  let log = {
                    status: 'out',
                    person: element.person,
                    time: element.time,
                    action: 'take out',
                    notes: element.notes
                  }
                  firebase.database().ref('workpacks/' + this.checkId + '/' + key).update(obj[key]).then(
                    (data) => {
                      // console.log('update completed')
                      element.updateSuccess = true
                    },
                    (error) => {
                      console.log(error)
                      element.updateFail = true
                    }
                  )
                  firebase.database().ref('taskLogs/' + this.checkId + '/' + key).push(log).then(
                    (data) => {
                      // console.log('log - take out')
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
            })
          }
        })
      }
    },
    clear() {
      this.scanList.forEach(element => {
        element.updateSuccess = false
        element.updateFail = false
      })
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