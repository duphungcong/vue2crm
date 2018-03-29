<template>
  <v-container fluid grid-list-sm>
    <v-flex xs12>
      <v-stepper v-model="e1">
        <v-stepper-header>
          <v-stepper-step step="1" :complete="e1 > 1">Create check</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step step="2" :complete="e1 > 2">Import WP</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step step="3" :complete="e1 > 3">Zone Division</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step step="4" :complete="e1 > 4">Finish</v-stepper-step>
        </v-stepper-header>
        <v-stepper-items>
          <v-stepper-content step="1">
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
            <v-btn @click.native="dialogConfirmCancel = true">Cancel</v-btn>
            <v-btn color="primary" @click.native="e1 = 2" :disabled="!inputCheckInfoCompleted">Next</v-btn>
          </v-stepper-content>
          <v-stepper-content step="2">
            <v-card class="lighten-4 elevation-0">
              <v-card-title><h3>Import WP CONTROL</h3></v-card-title>
              <v-card-text>
                <v-form>
                  <input type="file" id="file" @change="onFileChange">
                </v-form>
                &nbsp;
                <p>Number of task cards: {{ numberTaskCard }}</p>
              </v-card-text>
            </v-card>
            <v-btn @click.native="e1 = 1">Back</v-btn>
            <v-btn color="primary" @click.native="scanZoneDivision()" :disabled="!readingIsCompleted">Next</v-btn>
          </v-stepper-content>
          <v-stepper-content step="3">
            <v-card class="lighten-4 elevation-0">
              <v-card-title><h3>Zone Division</h3></v-card-title>
            </v-card>
            <v-btn @click.native="e1 = 2">Back</v-btn>
            <v-btn color="primary" @click.native="e1 = 4">Next</v-btn>
            <v-card class="lighten-4 elevation-0">
              <v-data-table :headers="headers" :items="check.workpack" expand>
                <template slot="items" slot-scope="props" class="body-0">
                  <td class="body-0">{{ props.item.WP_ITEM }}</td>
                  <td class="body-0">{{ props.item.TASKNAME }}</td>
                  <td class="body-0">{{ props.item.ZONE }}</td>
                  <td class="body-0">{{ props.item.TASKTYPE }}</td>
                  <td class="body-0">{{ props.item.TASKTITLE }}</td>
                  <td class="body-0">{{ props.item['AMS MH'] }}</td>
                  <td class="body-0">{{ props.item['MAC MH'] }}</td>
                  <td class="body-0">{{ props.item.MEN }}</td>
                  <td class="body-0">{{ props.item.HOUR }}</td>
                  <td class="body-0">{{ props.item.ZONEDIVISION }}</td>
                  <td class="body-0">{{ props.item.REMARKS }}</td>
                  <td class="justify-center layout px-0">
                    <v-btn icon class="mx-0" @click="editItem(props.item)">
                      <v-icon color="teal">edit</v-icon>
                    </v-btn>
                    <v-btn icon class="mx-0" @click="linkItem(props.item)" :disabled="!props.item.TASKNAME.includes('VN ')">
                      <v-icon color="teal">link</v-icon>
                    </v-btn>
                  </td>
                </template>
              </v-data-table>
            </v-card>
          </v-stepper-content>
          <v-stepper-content step="4">
            <v-card class="lighten-4 elevation-0">
              <v-card-title><h3>Review and submit</h3></v-card-title>
              <v-card-text>
                <p>Check: <strong>{{ check.name }}</strong></p>
                <p>Aircraft: <strong>{{ check.aircraft }}</strong></p>
                <p>Task Cards: <strong>{{ numberTaskCard }}</strong></p>
                <p>From: <strong>{{ check.startDate }}</strong></p>
                <p>To: <strong>{{ check.finishDate }}</strong></p>
              </v-card-text>
            </v-card>
            <v-btn @click.native="e1 = 3">Back</v-btn>
            <v-btn color="primary" @click.native="saveCheck()">Save</v-btn>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-flex>
    <v-dialog v-model="dialogConfirmCancel" max-width="290">
      <v-card>
        <v-card-title>Do you want to cancel your progress?</v-card-title>
        <v-card-actions>
          <v-btn color="blue" flat="flat" @click.native="dialogConfirmCancel = false">No</v-btn>
          <v-btn flat="flat" @click.native="cancelCheck()">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogEditItem" max-width="500">
      <v-card>
        <v-card-title>
          <span class="headline">Edit Item</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm3 md3>
                <v-text-field type="number" label="AMS MH" v-model="editedItem['AMS MH']"></v-text-field>
              </v-flex>
              <v-flex xs12 sm3 md3>
                <v-text-field type="number" label="MAC MH" v-model="editedItem['MAC MH']"></v-text-field>
              </v-flex>
              <v-flex xs12 sm3 md3>
                <v-text-field type="number" label="MEN" v-model="editedItem.MEN"></v-text-field>
              </v-flex>
              <v-flex xs12 sm3 md3>
                <v-text-field type="number" label="HOUR" v-model="editedItem.HOUR"></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-text-field multi-line rows="2" label="ZONE DIVISION" v-model="editedItem.ZONEDIVISION"></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-text-field multi-line rows="2" no-resize label="REMARKS" v-model="editedItem.REMARKS"></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="closeEditItem()">Cancel</v-btn>
          <v-btn color="blue darken-1" flat @click.native="saveEditItem()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogLinkItem" max-width="500">
      <v-card>
        <v-card-title><span class="headline">Link to EO</span></v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm12 md12>
                 <v-text-field disabled label="TITLE" v-model="editedItem['TASKTITLE']"></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-select cache-items clearable open-on-clear :items="eoList" label="Select EO" v-model="linkedItem" item-text="NAME" class="input-group--focused" required autocomplete @keyup.native.enter="addEO"></v-select>
              </v-flex>
              <v-flex xs12 sm3 md3>
                <v-text-field type="number" label="AMS MH" v-model="linkedItem['AMS MH']"></v-text-field>
              </v-flex>
              <v-flex xs12 sm3 md3>
                <v-text-field type="number" label="MAC MH" v-model="linkedItem['MAC MH']"></v-text-field>
              </v-flex>
              <v-flex xs12 sm3 md3>
                <v-text-field type="number" label="MEN" v-model="linkedItem.MEN"></v-text-field>
              </v-flex>
              <v-flex xs12 sm3 md3>
                <v-text-field type="number" label="HOUR" v-model="linkedItem.HOUR"></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-text-field label="ZONE DIVISION" v-model="linkedItem.ZONEDIVISION"></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-text-field label="REMARKS" v-model="linkedItem.REMARKS"></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="closeLinkItem()">Cancel</v-btn>
          <v-btn color="blue darken-1" flat @click.native="saveLinkItem()">Save</v-btn>
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
  name: 'NewCheck',
  data () {
    return {
      title: '',
      aircraftList: [],
      eoList: [],
      check: {
        name: '',
        aircraft: '',
        startDate: '',
        finishDate: '',
        workpack: []
      },
      e1: 0,
      readingIsCompleted: false,
      scanningIsCompleted: false,
      dialogConfirmCancel: false,
      dialogEditItem: false,
      dialogLinkItem: false,
      headers: [
        { text: 'WP ITEM', left: true, value: 'WP_ITEM' },
        { text: 'TASK', left: true, value: 'TASKNAME' },
        { text: 'ZONE', left: true, value: 'ZONE' },
        { text: 'TYPE', left: true, value: 'TASKTYPE' },
        { text: 'TITLE', left: true, value: 'TASKTITLE' },
        { text: 'AMS MH', left: true, value: 'AMS MH' },
        { text: 'MAC MH', left: true, value: 'MAC MH' },
        { text: 'MEN', left: true, value: 'MEN' },
        { text: 'HOUR', left: true, value: 'HOUR' },
        { text: 'ZONE DIVISION', left: true, value: 'ZONEDIVISION' },
        { text: 'REMARK', left: true, value: 'REMARKS' }
      ],
      itemIndex: -1,
      defaultItem: {
        'AMS MH': 0,
        'MAC MH': 0,
        MEN: 0,
        HOUR: 0,
        ZONEDIVISION: 'N/A',
        REMARKS: 'NIL'
      },
      editedItem: {},
      linkedItem: {}
    }
  },
  computed: {
    numberTaskCard () {
      return this.check.workpack.length
    },
    inputCheckInfoCompleted () {
      // return this.check.name.length !== 0
      //         && this.check.aircraft.length !== 0
      //         && this.check.startDate.length !== 0
      //         && this.check.finishDate.length !== 0
      return true
    }
  },
  watch: {
    linkedItem (newVal, oldVal) {
      if (newVal === null) {
        this.linkedItem = {}
      }
    }
  },
  methods: {
    saveCheck() {
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
    cancelCheck() {
      this.dialogConfirmCancel = false
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
    getEOList() {
      firebase.database().ref('eo').once('value').then(
        (data) => {
          const obj = data.val()
          for (let key in obj) {
            this.eoList.push(Object.assign({}, obj[key], { uid: key }))
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
    },
    scanZoneDivision() {
      let count = 0
      this.$store.dispatch('beginLoading')
      for (let key1 in this.check.workpack) {
        let taskName = this.check.workpack[key1].TASKNAME
        firebase.database().ref('amsA321').orderByChild('TASKNAME').equalTo(taskName).limitToFirst(1).once('value').then(
          (data) => {
            count++
            const obj = data.val()
            if (obj !== null && obj !== undefined) {
              for (let key2 in obj) {
                this.check.workpack[key1].uid = key2
                this.check.workpack[key1].ZONEDIVISION = obj[key2].ZONEDIVISION || ''
                this.check.workpack[key1]['AMS MH'] = obj[key2]['AMS MH'] || ''
                this.check.workpack[key1]['MAC MH'] = obj[key2]['MAC MH'] || ''
                this.check.workpack[key1].MEN = obj[key2].MEN || ''
                this.check.workpack[key1].HOUR = obj[key2].HOUR || ''
                this.check.workpack[key1].REMARKS = obj[key2].REMARKS || ''
              }
            } else {
              this.check.workpack[key1].ZONEDIVISION = ''
              this.check.workpack[key1]['AMS MH'] = ''
              this.check.workpack[key1]['MAC MH'] = ''
              this.check.workpack[key1].MEN = ''
              this.check.workpack[key1].HOUR = ''
              this.check.workpack[key1].REMARKS = ''
            }
            if (count === this.check.workpack.length) {
              this.$store.dispatch('endLoading')
              this.scanningIsCompleted = true
              this.e1 = 3
            }
          },
          (error) => {
            count++
            if (count === this.check.workpack.length) {
              this.$store.dispatch('endLoading')
              this.scanningIsCompleted = true
            }
            console.log(error)
          }
        )
      }
    },
    editItem(item) {
      this.itemIndex = this.check.workpack.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogEditItem = true
    },
    closeEditItem() {
      this.dialogEditItem = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.itemIndex = -1
      }, 300)
    },
    saveEditItem() {
      if (this.itemIndex > -1 && this.editedItem.TASKNAME.includes('VN ')) {
        let editedProps = {
          'AMS MH': this.editedItem['AMS MH'],
          'MAC MH': this.editedItem['MAC MH'],
          'MEN': this.editedItem['MEN'],
          'HOUR': this.editedItem['HOUR'],
          'ZONEDIVISION': this.editedItem['ZONEDIVISION'],
          'REMARKS': this.editedItem['REMARKS']
        }
        if (this.editedItem.uid !== null && this.editedItem.uid !== undefined) {
          console.log('edit')
          Object.assign(this.check.workpack[this.itemIndex], editedProps)
          firebase.database().ref('amsA321').child(this.editedItem.uid).update(editedProps).then(
            (data) => {
              console.log(data)
            },
            (error) => {
              console.log('NewCheck - saveEditItem' + error)
          })
        } else {
          console.log('new')
          firebase.database().ref('amsA321').push(this.editedItem).then(
            (data) => {
              console.log(data.key)
              this.editedItem.uid = data.key
              Object.assign(this.check.workpack[this.itemIndex], this.editedItem)
            },
            (error) => {
              console.log('NewCheck - saveEditItem' + error)
            }
          )
        }
      }
      this.closeEditItem()
    },
    linkItem(item) {
      this.itemIndex = this.check.workpack.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.linkedItem = Object.assign({}, item)
      this.dialogLinkItem = true
    },
    closeLinkItem() {
      this.dialogLinkItem = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.linkedItem = this.editedItem
        this.itemIndex = -1
      }, 300)
    },
    saveLinkItem() {
      if (this.itemIndex > -1) {
        let editedProps = {
          'AMS MH': this.linkedItem['AMS MH'],
          'MAC MH': this.linkedItem['MAC MH'],
          'MEN': this.linkedItem['MEN'],
          'HOUR': this.linkedItem['HOUR'],
          'ZONEDIVISION': this.linkedItem['ZONEDIVISION'],
          'REMARKS': this.linkedItem['REMARKS']
        }
        Object.assign(this.check.workpack[this.itemIndex], editedProps)
        firebase.database().ref('eo').child(this.linkedItem.uid).update(editedProps).then(
          (data) => {
            // console.log(data)
          },
          (error) => {
            console.log(error)
          }
        )
      }
      this.closeLinkItem()
    },
    addEO(e) {
      let found = this.eoList.find((item) => {
        return item['NAME'] === e.target.value
      })
      if (found === undefined) {
        let newEO = { 'NAME': e.target.value }
        this.eoList.push(newEO)
        firebase.database().ref('eo').push(newEO).then(
          (data) => {
            this.eoList[this.eoList.length - 1].uid = data.key
          },
          (error) => {
            console.log(error)
          }
        )
      }
    }
  },
  mounted() {
    this.getAircraftList()
    this.getEOList()
    this.title = 'New Check'
  }
}
</script>

