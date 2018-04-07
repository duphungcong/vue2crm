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
          clearable
          label="Type vaeco ID (4 digits) to active scan"
          v-model="person"></v-text-field>
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
          <v-layout row wrap align-center>
            <v-flex xs2>
              <span>TASK ITEM ({{ scan.length }})</span>
            </v-flex>
            <v-flex xs2>
              <span>PERSON</span>
            </v-flex>
            <v-flex xs2>
              <span>TIME</span>
            </v-flex>
            <v-flex xs5>
              <span>REMARKS</span>
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
                <v-flex xs2>
                  <span>{{ item.wpItem }}</span>
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
      scan: [],
      scannedAlert: false
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
        let time = Date.now(7)
        console.log(time)
        this.scan.push({
          wpItem: wpItem,
          person: this.person,
          time: time,
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
            const obj = data.val()
            if (obj !== null && obj !== undefined) {
              for (let key in obj) {
                if (element.notes !== null && element.notes !== undefined) {
                  obj[key].notes = element.notes
                }
                obj[key].status = 'out'
                // obj[key].logs = obj[key].logs || []
                // obj[key].logs.push({
                //   status: 'out',
                //   person: element.person,
                //   time: element.time,
                //   notes: element.notes
                // })
                let log = {
                  status: 'out',
                  person: element.person,
                  time: element.time,
                  action: 'take out',
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
                    console.log('log - take out')
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