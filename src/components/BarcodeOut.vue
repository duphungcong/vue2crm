<template>
  <v-container fluid grid-list-sm>
    <v-layout row wrap>
      <v-flex xs4>
        <v-text-field
          label="Scan Input"
          autofocus
          @change.native="onBarcodeScanned(barcode)"
          v-model="barcode"></v-text-field>
        <v-alert type="success" v-model="scannedAlert">
          This task is already scanned!
        </v-alert>
      </v-flex>
      <v-flex xs6>
        <v-btn color="blue darken-2" dark>UPDATE
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
            <v-layout row wrap>
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
                <span>TASK ITEM</span>
              </v-flex>
            </v-layout>
        </v-card>
      </v-flex>
      <v-flex xs12>
        <ul>
          <li v-for="item in scan" :key="item.wpItem">
            <v-card>
              <v-layout row wrap align-center>
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
                <v-text-field label="Remarks" v-model="item.remarks"></v-text-field>
              </v-flex>
              <v-flex xs1>
                <v-spacer></v-spacer>
                <v-icon color="green" large v-if="item.updateSuccess">check</v-icon>
                <v-icon color="red" large v-if="item.updateFail">close</v-icon>
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
export default {
  name: 'Barcode',
  data () {
    return {
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
        this.done = false
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
        this.scan.push({
          wpItem: wpItem,
          remarks: '',
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
    }
  },
  created() {
    this.$barcodeScanner.init(this.onBarcodeScanned)
  },
  destroyed() {
    this.$barcodeScanner.destroy()
  }
}
</script>
