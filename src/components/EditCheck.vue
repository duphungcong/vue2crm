<template>
  <v-container fluid grid-list-sm>
    <v-flex sx12>
      <v-card>
        <v-card-title>
          <v-layout row wrap>
            <v-flex xs12 sm3 md3>
              <v-select v-model="selectedZone" :items="zoneSelection" label="Select zone" clearable></v-select>
            </v-flex>
            <v-flex xs1 sm1 md1></v-flex>
            <v-flex xs12 sm3 md3>
              <v-text-field append-icon="search" label="Search" single-line hide-details v-model="search"></v-text-field>
            </v-flex>
            <v-flex xs2 sm2 md2></v-flex>
            <v-flex xs12 sm3 md3>
              <v-btn @click.native="exportZoneDivision" class="blue white--text">Export to Excel
                <v-icon dark right>file_download</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
        </v-card-title>
        <v-data-table :headers="headers" :items="workpack" :pagination.sync="pagination" :search="search" item-key="wpItem">
          <template slot="items" slot-scope="props" class="body-0">
            <td class="body-0">{{ props.item.wpItem }}</td>
            <!-- <td class="body-0">{{ props.item.taskName }}</td> -->
            <td class="body-0">{{ props.item.zone }}</td>
            <!-- <td class="body-0">{{ props.item.taskType }}</td> -->
            <td class="body-0">{{ props.item.taskTitle }}</td>
            <!-- <td class="body-0">{{ props.item.amsMH }}</td>
            <td class="body-0">{{ props.item.macMH }}</td>
            <td class="body-0">{{ props.item.men }}</td>
            <td class="body-0">{{ props.item.hour }}</td> -->
            <td class="body-0">{{ props.item.zoneDivision }}</td>
            <!-- <td class="body-0">{{ props.item.remarks }}</td> -->
            <td class=justify-center layout px-0>
              <v-btn icon class="mx-0" @click="editItem(props.item)" v-if="!props.item.taskName.includes('VN ')">
                <v-icon color="blue">edit</v-icon>
              </v-btn>
              <v-btn icon class="mx-0" @click="linkItem(props.item)" v-if="props.item.taskName.includes('VN ')">
                <v-icon color="blue">link</v-icon>
              </v-btn>
            </td>
          </template>
        </v-data-table>
      </v-card>
    </v-flex>
    <loading-progress></loading-progress>
    <v-dialog v-model="dialogEditItem" max-width="500">
      <v-card>
        <v-card-title>
          <span class="headline">Edit Item</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm3 md3>
                <v-text-field type="number" label="AMS MH" v-model="editedItem.amsMH"></v-text-field>
              </v-flex>
              <v-flex xs12 sm3 md3>
                <v-text-field type="number" label="MAC MH" v-model="editedItem.macMH"></v-text-field>
              </v-flex>
              <v-flex xs12 sm3 md3>
                <v-text-field type="number" label="MEN" v-model="editedItem.men"></v-text-field>
              </v-flex>
              <v-flex xs12 sm3 md3>
                <v-text-field type="number" label="HOUR" v-model="editedItem.hour"></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-text-field multi-line rows="2" label="ZONE DIVISION" v-model="editedItem.zoneDivision"></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-text-field multi-line rows="2" no-resize label="REMARKS" v-model="editedItem.remarks"></v-text-field>
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
                 <v-text-field disabled label="TITLE" v-model="editedItem.taskTitle"></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-select clearable open-on-clear :items="eoList" label="Select EO" v-model="linkedItem" item-text="name" class="input-group--focused" required autocomplete @keyup.native.enter="addEO"></v-select>
              </v-flex>
              <v-flex xs12 sm3 md3>
                <v-text-field type="number" label="AMS MH" v-model="linkedItem.amsMH"></v-text-field>
              </v-flex>
              <v-flex xs12 sm3 md3>
                <v-text-field type="number" label="MAC MH" v-model="linkedItem.macMH"></v-text-field>
              </v-flex>
              <v-flex xs12 sm3 md3>
                <v-text-field type="number" label="MEN" v-model="linkedItem.men"></v-text-field>
              </v-flex>
              <v-flex xs12 sm3 md3>
                <v-text-field type="number" label="HOUR" v-model="linkedItem.hour"></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-text-field label="ZONE DIVISION" v-model="linkedItem.zoneDivision"></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-text-field label="REMARKS" v-model="linkedItem.remarks"></v-text-field>
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
  </v-container>
</template>

<script>

import firebase from 'firebase'
import XLSX from 'xlsx'

export default {
  name: 'EditCheck',
  data () {
    return {
      checkId: null,
      check: {},
      workpack: [],
      workpackBeforeFilter: [],
      eoList: [],
      pagination: {
        page: 1,
        totalItems: 0,
        rowsPerPage: 10,
        sortBy: 'zoneDivision'
      },
      headers: [
        { text: 'WP ITEM', left: true, value: 'wpItem' },
        // { text: 'TASK', left: true, value: 'taskName' },
        { text: 'ZONE', left: true, value: 'zone' },
        // { text: 'TYPE', left: true, value: 'taskType' },
        { text: 'TITLE', left: true, value: 'taskTitle' },
        // { text: 'AMS MH', left: true, value: 'amsMH' },
        // { text: 'MAC MH', left: true, value: 'macMH' },
        // { text: 'MEN', left: true, value: 'men' },
        // { text: 'HOUR', left: true, value: 'hour' },
        { text: 'ZONE DIVISION', left: true, value: 'zoneDivision' },
        // { text: 'REMARK', left: true, value: 'remarks' },
        { text: '', sortable: false, value: '' }
      ],
      itemIndex: -1,
      defaultItem: {
        amsMH: 0,
        macMH: 0,
        men: 0,
        hour: 0,
        zoneDivision: 'N/A',
        remarks: 'NIL'
      },
      editedItem: {},
      linkedItem: {},
      dialogEditItem: false,
      dialogLinkItem: false,
      zoneSelection: [
        'N/A',
        '100-200-800',
        '300-400',
        '500-600-700',
        'AVIONIC',
        'STRUCTURE',
        'CABIN',
        'CLEANING'
      ],
      selectedZone: '',
      search: ''
    }
  },
  watch: {
    linkedItem (newVal, oldVal) {
      if (newVal === null) {
        this.linkedItem = {}
      }
    },
    selectedZone (newVal, oldVal) {
      if (newVal === null) {
        this.workpack = this.workpackBeforeFilter
        return
      }

      if (newVal === 'N/A') {
        this.workpack = this.workpackBeforeFilter.filter(element =>
          element.zoneDivision.indexOf('100-200-800') === -1 &&
          element.zoneDivision.indexOf('300-400') === -1 &&
          element.zoneDivision.indexOf('500-600-700') === -1 &&
          element.zoneDivision.indexOf('AVI') === -1 &&
          element.zoneDivision.indexOf('AVI') === -1 &&
          element.zoneDivision.indexOf('STRUCTURE') === -1 &&
          element.zoneDivision.indexOf('CAB') === -1 &&
          element.zoneDivision.indexOf('CLEANING') === -1)
          return
      }

      console.log(newVal)
      this.workpack = this.workpackBeforeFilter.filter(element => element.zoneDivision.indexOf(newVal) === 0)
    }
  },
  methods: {
    loadCheck() {
      firebase.database().ref('checks').child(this.checkId).once('value').then(
        (data) => {
          this.check = data.val()
        },
        (error) => {
          console.log(error)
        }
      )
    },
    loadWorkPack() {
      this.$store.dispatch('beginLoading')
      firebase.database().ref('workpacks').child(this.checkId).once('value').then(
        (data) => {
          this.workpackBeforeFilter = data.val()
          this.workpack = this.workpackBeforeFilter
          this.$store.dispatch('endLoading')
        },
        (error) => {
          console.log(error)
          this.$store.dispatch('endLoading')
        }
      )
    },
    getEOList() {
      firebase.database().ref('eo').once('value').then(
        (data) => {
          const obj = data.val()
          for (let key in obj) {
            this.eoList.push(Object.assign({}, obj[key], { id: key }))
          }
        },
        (error) => {
          console.log(error)
        }
      )
    },
    editItem(item) {
      this.itemIndex = this.workpackBeforeFilter.indexOf(item)
      console.log(this.itemIndex)
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
      if (this.itemIndex > -1) {
        let editedProps = {
          amsMH: this.editedItem.amsMH,
          macMH: this.editedItem.macMH,
          men: this.editedItem.men,
          hour: this.editedItem.hour,
          zoneDivision: this.editedItem.zoneDivision,
          remarks: this.editedItem.remarks,
          taskName: this.editedItem.taskName,
          taskTitle: this.editedItem.taskTitle,
          taskType: this.editedItem.taskType,
          zone: this.editedItem.zone
        }
        if (this.editedItem.taskId !== null && this.editedItem.taskId !== undefined) {
          // console.log('edit')
          let updates = {}
          updates['/amsA321/' + this.editedItem.taskId] = editedProps
          updates['/workpacks/' + this.checkId + '/' + this.itemIndex] = this.editedItem
          firebase.database().ref().update(updates).then(
            (data) => {
              Object.assign(this.workpackBeforeFilter[this.itemIndex], editedProps)
            },
            (error) => {
              console.log(error)
          })
        } else {
          // console.log('new')
          firebase.database().ref('amsA321').push(editedProps).then(
            (data) => {
              // console.log(data.key)
              this.editedItem.taskId = data.key
            },
            (error) => {
              console.log(error)
            }
          )
          firebase.database().ref('workpacks/' + this.checkId + '/' + this.itemIndex).set(this.editedItem).then(
            (data) => {
              Object.assign(this.workpackBeforeFilter[this.itemIndex], this.editedItem)
            },
            (error) => {
              console.log(error)
            }
          )
        }
      }
      this.closeEditItem()
    },
    linkItem(item) {
      this.itemIndex = this.workpackBeforeFilter.indexOf(item)
      console.log(this.itemIndex)
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
          amsMH: this.linkedItem.amsMH,
          macMH: this.linkedItem.macMH,
          men: this.linkedItem.men,
          hour: this.linkedItem.hour,
          zoneDivision: this.linkedItem.zoneDivision,
          remarks: this.linkedItem.remarks
        }
        let updates = {}
        updates['/eo/' + this.linkedItem.id] = Object.assign({}, editedProps, { name: this.linkedItem.name })
        updates['/workpacks/' + this.checkId + '/' + this.itemIndex] = Object.assign({}, this.editedItem, editedProps, { taskId: this.linkedItem.id })
        firebase.database().ref().update(updates).then(
          (data) => {
            editedProps.taskId = this.linkedItem.id
            Object.assign(this.workpackBeforeFilter[this.itemIndex], editedProps)
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
        return item['name'] === e.target.value
      })
      if (found === undefined) {
        let newEO = {
          name: e.target.value,
          amsMH: 0,
          macMH: 0,
          men: 0,
          hour: 0,
          zoneDivision: 'N/A',
          remarks: 'NIL'
        }
        this.eoList.push(newEO)
        firebase.database().ref('eo').push(newEO).then(
          (data) => {
            this.eoList[this.eoList.length - 1].id = data.key
          },
          (error) => {
            console.log(error)
          }
        )
      }
    },
    exportZoneDivision() {
      let exportedWorkpack = []
      this.workpack.forEach((element) => {
        let item = {
          WP_ITEM: element.wpItem,
          TASK: element.taskName,
          ZONE: element.zone,
          TASK_TYPE: element.taskType,
          TITLE: element.taskTitle,
          AMS_MH: element.amsMH,
          MAC_MH: element.macMH,
          MEN: element.men,
          HOURS: element.hour,
          ZONE_DIVISION: element.zoneDivision,
          REMARKS: element.remarks
        }
        exportedWorkpack.push(item)
      })
      // console.log(exportedWorkpack)
      exportedWorkpack.sort((a, b) => {
        return a.ZONE_DIVISION.localeCompare(b.ZONE_DIVISION) || a.WP_ITEM.localeCompare(b.WP_ITEM)
      })
      // console.log(exportedWorkpack)
      let worksheet = XLSX.utils.json_to_sheet(Object.assign([], exportedWorkpack))
      // console.log(worksheet)
      let workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'ZD')
      // // console.log(workbook)
      XLSX.writeFile(workbook, 'BFS26 - ' + this.check.aircraft + '.xlsx')
    }
  },
  mounted() {
    this.checkId = this.$route.params.id
    this.loadCheck()
    this.loadWorkPack()
    this.getEOList()
  }
}
</script>