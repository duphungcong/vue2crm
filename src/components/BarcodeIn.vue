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
                <v-flex xs3 sm3 md3>
                  <v-radio-group v-model="item.status" row>
                    <v-radio value="done" color="green"></v-radio>
                    <v-radio value="inProgress" color="yellow darken-3"></v-radio>
                    <v-radio value="notYet" color="red"></v-radio>
                  </v-radio-group>
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
      allStatus: ''
    }
  },
  watch: {
    allStatus (value) {
      if (value !== null && value !== undefined) {
        for (let key in this.scan) {
          this.scan[key].status = value
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
        this.scan.push({
          wpItem: wpItem,
          notes: '',
          updateSuccess: false,
          updateFail: false,
          status: this.allStatus
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
      let now = Date.now(7)
      let time = new Date(now)
      let timeStr = time.toLocaleString()
      this.scan.forEach(element => {
        firebase.database().ref('workpacks/' + this.checkId).orderByChild('wpItem').equalTo(element.wpItem).limitToFirst(1).once('value').then(
          (data) => {
            // console.log(data.val())
            const obj = data.val()
            if (obj !== null && obj !== undefined) {
              for (let key in obj) {
                if (element.notes !== null && element.notes !== undefined) {
                  obj[key].notes = element.notes
                }
                if (element.status !== null && element.status !== undefined) {
                  obj[key].status = element.status
                }
                let log = {
                  status: obj[key].status,
                  person: 'PPC',
                  time: timeStr,
                  action: 'received',
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
                    // console.log('log - receive')
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

