<template>
  <v-container fluid>
    <v-flex xs12>
      <v-stepper v-model="e1">
        <v-stepper-header>
          <v-stepper-step step="1" :complete="e1 > 1">Create check</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step step="2" :complete="e1 > 2">Import WP</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step step="3" :complete="e1 > 3">Finish</v-stepper-step>
        </v-stepper-header>
        <v-stepper-items>
          <v-stepper-content step="1">
            <v-card class="grey lighten-4 elevation-0">
              <v-card-text>
                <v-container fluid grid-list-md>
                  <v-layout row wrap class="px-10">
                    <v-flex md6 xs12>
                      <v-text-field name="checkName" label="Check" hint="Check name is required" value="Input text" v-model="check.name"
                        class="input-group--focused" required></v-text-field>
                    </v-flex>
                    <v-flex md6 xs12>
                      <v-select v-bind:items="aircraftList" label="Aircraft" v-model="check.aircraft" item-text="name" item-value="name" class="input-group--focused" required></v-select>
                    </v-flex>
                    <v-flex md6 xs12>
                      Start Date<br>
                      <v-date-picker v-model="check.startDate"></v-date-picker>
                    </v-flex>
                    <v-flex md6 xs12>
                      Finish Date<br>
                      <v-date-picker v-model="check.finishDate"></v-date-picker>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>
            </v-card>
            <v-btn @click.native="dialogConfirm = true">Cancel</v-btn>
            <v-btn color="primary" @click.native="e1 = 2">Next</v-btn>
          </v-stepper-content>
          <v-stepper-content step="2">
            <v-card class="grey lighten-4 elevation-0">
              <v-card-text>
                <v-form>
                  <label for="file">Import WP CONTROL</label><br>
                  <input type="file" id="file" @change="onFileChange">
                </v-form>
              </v-card-text>
              <v-card-title pl-0>Number of task cards: {{ numberTaskCard }}</v-card-title>
            </v-card>
            <v-btn @click.native="e1 = 1">Back</v-btn>
            <v-btn color="primary" @click.native="e1 = 3" :disabled="!readingIsCompleted">Next</v-btn>
          </v-stepper-content>
          <v-stepper-content step="3">
            <v-card class="grey lighten-4 elevation-0">
              <v-card-text>
                <p>Check: <strong>{{ check.name }}</strong></p>
                <p>Aircraft: <strong>{{ check.aircraft }}</strong></p>
                <p>Task Cards: <strong>{{ numberTaskCard }}</strong></p>
                <p>From: <strong>{{ check.startDate }}</strong></p>
                <p>To: <strong>{{ check.finishDate }}</strong></p>
              </v-card-text>
            </v-card>
            <v-btn @click.native="e1 = 2">Back</v-btn>
            <v-btn color="primary" @click.native="save()">Save</v-btn>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-flex>
    <v-dialog v-model="dialogConfirm" max-width="290">
      <v-card>
        <v-card-title>Do you want to cancel your progress?</v-card-title>
        <v-card-actions>
          <v-btn color="blue" flat="flat" @click.native="dialogConfirm = false">No</v-btn>
          <v-btn flat="flat" @click.native="cancel()">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>

import firebase from 'firebase'
import XLSX from 'xlsx'

const makeCols = refstr => Array(XLSX.utils.decode_range(refstr).e.c + 1).fill(0).map((x, i) => ({name: XLSX.utils.encode_col(i), key: i}))

export default {
  name: 'NewCheck',
  data () {
    return {
      title: '',
      aircraftList: [],
      check: {
        name: '',
        aircraft: '',
        startDate: '',
        finishDate: '',
        workpack: []
      },
      e1: 0,
      cols: [],
      readingIsCompleted: false,
      dialogConfirm: false
    }
  },
  computed: {
    numberTaskCard () {
      return this.check.workpack.length
    }
  },
  methods: {
    save() {
      const check = this.check
      firebase.database().ref('checks').push(check).then(
        (data) => {
          this.$router.push('checks')
        },
        (error) => {
          console.log(error)
        }
      )
    },
    cancel() {
      this.dialogConfirm = false
      this.$router.push('checks')
    },
    getAircraftList() {
      firebase.database().ref('aircraft').once('value').then(
        (data) => {
          const obj = data.val()
          for (let key in obj) {
            this.aircraftList.push({
              name: obj[key].name
            })
          }
        },
        (error) => {
          console.log(error)
        }
      )
    },
    onFileChange(e) {
      const files = e.target.files || e.dataTransfer.files
      if (files && files[0]) {
        this.readFile(files[0])
      }
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
        const data = XLSX.utils.sheet_to_json(ws, {header: 0})
        /* Update state */
        this.check.workpack = data
        this.cols = makeCols(ws['!ref'])
        this.readingIsCompleted = true
      }
      reader.readAsBinaryString(file)
    }
  },
  mounted() {
    this.getAircraftList()
    this.title = 'New Check'
  }
}
</script>

