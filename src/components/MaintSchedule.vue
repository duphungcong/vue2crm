<template>
  <v-container fluid grid-list-sm>
    <v-layout row justify-space-around>
      <v-flex xs12>
        <v-card>
          <v-card-title><h3>Import AMS</h3></v-card-title>
          <v-card-text>
            <v-radio-group v-model="aircraftType">
              <v-radio
                label="A321"
                value="amsA321"
                ></v-radio>
              <v-radio
                label="B787"
                value="amsB787"
                ></v-radio>  
              <v-radio
                label="ATR72"
                value="amsATR"
                ></v-radio>
            </v-radio-group>
            <v-form>
              <input type="file" id="file" @change="onFileChange">
            </v-form>
            &nbsp;
            <p>Number of task cards: {{ numberTaskCard }}</p>
          </v-card-text>
          <v-card-actions>
            <v-btn @click.native="cancel()">Cancel</v-btn>
            <v-btn class="primary" @click.native="save()" :disabled="!readingIsCompleted || aircraftType == null">Save</v-btn>
          </v-card-actions>
        </v-card>
        <br>
        <v-card>
          <v-card-title><h3>Delete AMS</h3></v-card-title>
          <v-layout row justify-center>
            <v-btn class="error" @click.native="dialogDelete = true" :disabled="aircraftType == null">Delete</v-btn>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
    <v-dialog v-model="dialogDelete" max-width="290">
      <v-card>
        <v-card-title>Do you want to delete the {{ aircraftType }}?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue" flat @click.native="dialogDelete = false">No</v-btn>
          <v-btn color="red" flat @click.native="dialogDelete =  false, remove()">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <loading-progress></loading-progress>
  </v-container>
</template>

<script>

import firebase from 'firebase'
import XLSX from 'xlsx'

const makeCols = refstr => Array(XLSX.utils.decode_range(refstr).e.c + 1).fill(0).map((x, i) => ({name: XLSX.utils.encode_col(i), key: i}))

export default {
  name: 'MaintSchedule',
  data () {
    return {
      aircraftType: null,
      maintSchedule: [],
      readingIsCompleted: false,
      count: null,
      dialogDelete: false
    }
  },
  computed: {
    numberTaskCard () {
      return this.maintSchedule.length
    }
  },
  methods: {
    save() {
      const maintSchedule = this.maintSchedule
      this.count = 0
      this.$store.dispatch('beginLoading')
      for (let key in maintSchedule) {
        let newAMSKey = firebase.database().ref(this.aircraftType).push().key
        maintSchedule[key].id = newAMSKey
        firebase.database().ref(this.aircraftType + '/' + newAMSKey).update(maintSchedule[key]).then(
          (data) => {
            this.count++
            if (this.count === this.numberTaskCard) {
              this.$store.dispatch('endLoading')
              this.$router.push('/checks')
            }
          },
          (error) => {
            console.log(error)
            this.count++
            if (this.count === this.numberTaskCard) {
              this.$store.dispatch('endLoading')
            }
          }
        )
      }
    },
    cancel() {
      this.$router.push('checks')
    },
    onFileChange(e) {
      const files = e.target.files || e.dataTransfer.files
      if (files && files[0]) {
        this.readFile(files[0])
      }
    },
    remove() {
      this.$store.dispatch('beginLoading')
      let removes = {}
      removes[this.aircraftType] = null
      firebase.database().ref().update(removes).then(
        (data) => {
          this.$store.dispatch('endLoading')
        },
        (error) => {
          console.log(error)
          this.$store.dispatch('endLoading')
        }
      )
    },
    readFile(file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        /* Parse data */
        const bstr = e.target.result
        const wb = XLSX.read(bstr, {type: 'binary'})
        /* Get first worksheet */
        const wsname = wb.SheetNames[0]
        const ws = wb.Sheets[wsname]
        /* Convert array of arrays */
        const data = XLSX.utils.sheet_to_json(ws, { header: ['taskName', 'zone', 'taskType', 'taskTitle', 'amsMH', 'macMH', 'men', 'hour', 'zoneDivision', 'remarks'] })
        /* Update state */
        data.shift()
        this.maintSchedule = data
        this.cols = makeCols(ws['!ref'])
        this.readingIsCompleted = true
      }
      reader.readAsBinaryString(file)
    }
  }
}
</script>

<style scoped>
  .v-card {
    text-align: center
  }
</style>

