<template>
  <v-container fluid grid-list-sm>
    <v-flex sx12>
      <v-card>
        <v-card-title>
          <span class="headline">{{ check.aircraft.name }}-{{ check.name }}</span>
        </v-card-title>
        <v-card-actions>
          <v-layout row wrap px-2>
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
        </v-card-actions>
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
              <v-btn icon class="mx-0" @click="editItem(props.item)">
                <v-tooltip bottom>
                  <v-icon color="blue" slot="activator">edit</v-icon><span>edit</span>
                </v-tooltip>
              </v-btn>
              <v-btn icon class="mx-0" @click="linkItem(props.item)" v-if="props.item.taskName.includes('VN ')">
                <v-tooltip bottom>
                  <v-icon color="blue" slot="activator">link</v-icon><span>link EO</span>
                </v-tooltip>
              </v-btn>
            </td>
          </template>
        </v-data-table>
      </v-card>
    </v-flex>
    <loading-progress></loading-progress>
    <v-dialog v-model="dialogEditItem" max-width="500">
      <v-card>
        <v-card-title class="blue darken-1">
          <h4 class="white--text">Edit Item</h4>
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
          <v-btn color="blue" flat @click.native="closeEditItem()">Cancel</v-btn>
          <v-btn color="blue" flat @click.native="saveEditItem()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogLinkItem" max-width="500">
      <v-card>
        <v-card-title class="blue darken-1">
          <h4 class="white--text">Link to EO</h4>
        </v-card-title>
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
          <v-btn color="blue" flat @click.native="closeLinkItem()">Cancel</v-btn>
          <v-btn color="blue" flat @click.native="saveLinkItem()" :disabled="linkedItem.name === undefined">Save</v-btn>
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
      zoneSelection: this.constUtil.zoneSelection,
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
      this.filterTask(newVal)
    }
  },
  methods: {
    editItem(item) {
      this.editedItem = Object.assign({}, item)
      this.dialogEditItem = true
    },
    closeEditItem() {
      this.dialogEditItem = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
      }, 300)
    },
    saveEditItem() {
      const rootComponent = this.appUtil.getRootComponent(this)
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
      if (this.editedItem.amsId !== null && this.editedItem.amsId !== undefined) {
        // console.log('edit')
        let updates = {}
        updates['/ams' + this.check.aircraft.type + '/' + this.editedItem.amsId] = editedProps
        updates['/workpacks/' + this.checkId + '/' + this.editedItem.id] = this.editedItem
        firebase.database().ref().update(updates).then(
          (data) => {
            rootComponent.openSnackbar('Success', 'success')
          },
          (error) => {
            // console.log(error)
            rootComponent.openSnackbar(error, 'error')
        })
      } else {
        // console.log('new')
        if (!this.editedItem.taskName.includes('VN ')) {
          let newAmsTaskKey = firebase.database().ref('ams' + this.check.aircraft.type).push().key
          this.editedItem.amsId = newAmsTaskKey
          let updates = {}
          updates['/ams' + this.check.aircraft.type + '/' + newAmsTaskKey] = editedProps
          updates['/workpacks/' + this.checkId + '/' + this.editedItem.id] = this.editedItem
          firebase.database().ref().update(updates).then(
            (data) => {
              rootComponent.openSnackbar('Success', 'success')
            },
            (error) => {
              // console.log(error)
              rootComponent.openSnackbar(error, 'error')
            }
          )
        } else {
          // console.log('edit wo. no link')
          firebase.database().ref('/workpacks/' + this.checkId + '/' + this.editedItem.id).update(this.editedItem).then(
            (data) => {
              rootComponent.openSnackbar('Success', 'success')
            },
            (error) => {
              rootComponent.openSnackbar(error, 'error')
            }
          )
        }
      }
      this.closeEditItem()
    },
    linkItem(item) {
      this.editedItem = Object.assign({}, item)
      this.linkedItem = Object.assign({}, item)
      this.dialogLinkItem = true
    },
    closeLinkItem() {
      this.dialogLinkItem = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.linkedItem = this.editedItem
      }, 300)
    },
    saveLinkItem() {
      if (this.linkedItem.name !== undefined) {
        const rootComponent = this.appUtil.getRootComponent(this)
        let editedProps = {
          amsMH: this.linkedItem.amsMH,
          macMH: this.linkedItem.macMH,
          men: this.linkedItem.men,
          hour: this.linkedItem.hour,
          zoneDivision: this.linkedItem.zoneDivision,
          remarks: this.linkedItem.remarks
        }
        let updates = {}
        updates['/eo/' + this.linkedItem.id] = this.linkedItem
        updates['/workpacks/' + this.checkId + '/' + this.editedItem.id] = Object.assign({}, this.editedItem, editedProps, { amsId: this.linkedItem.id })
        firebase.database().ref().update(updates).then(
          (data) => {
            rootComponent.openSnackbar('Success', 'success')
          },
          (error) => {
            // console.log(error)
            rootComponent.openSnackbar(error, 'error')
          }
        )
      }
      this.closeLinkItem()
    },
    filterTask(zone) {
      if (zone === null) {
        this.workpack = this.workpackBeforeFilter
        return
      }

      if (zone === 'N/A') {
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

      // console.log(zone)
      this.workpack = this.workpackBeforeFilter.filter(element => element.zoneDivision.indexOf(zone) === 0)
    },
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
      firebase.database().ref('workpacks/' + this.checkId).on('value',
        (data) => {
          this.workpackBeforeFilter = Object.values(data.val()) || []
          this.workpack = this.workpackBeforeFilter
          this.filterTask(this.selectedZone)
          this.$store.dispatch('endLoading')
        },
        (error) => {
          console.log(error)
          this.$store.dispatch('endLoading')
        }
      )
    },
    loadEO() {
      firebase.database().ref('eo').on('value',
        (data) => {
          this.eoList = Object.values(data.val()) || []
        },
        (error) => {
          console.log(error)
        }
      )
    },
    addEO(e) {
      let found = this.eoList.find((item) => {
        return item['name'] === e.target.value
      })
      if (found === undefined) {
        let newEOKey = firebase.database().ref('eo').push().key
        let newEO = {
          id: newEOKey,
          name: e.target.value,
          amsMH: 0,
          macMH: 0,
          men: 0,
          hour: 0,
          zoneDivision: 'N/A',
          remarks: 'NIL'
        }
        firebase.database().ref('/eo/' + newEOKey).update(newEO).then(
          (data) => {},
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
      XLSX.writeFile(workbook, 'BFS26 - ' + this.check.aircraft.name + '.xlsx')
    }
  },
  mounted() {
    this.checkId = this.$route.params.id
    this.loadCheck()
    this.loadWorkPack()
    this.loadEO()
  }
}
</script>