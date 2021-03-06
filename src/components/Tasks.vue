<template>
  <v-container fluid pa-1>
    <v-flex xs12>
      <v-card class="elevation-0">
        <v-tabs
          height="40"
          fixed-tabs
          slider-color="red"
          show-arrows
          v-model="tabs">
          <v-tab href="#tab-1">Zone 128</v-tab>
          <v-tab href="#tab-2">Zone 34</v-tab>
          <v-tab href="#tab-3">Zone 567</v-tab>
          <v-tab href="#tab-4">Avionic</v-tab>
          <v-tab href="#tab-5">Structure</v-tab>
          <v-tab href="#tab-6">Cabin</v-tab>
          <v-tab href="#tab-7">Cleaning</v-tab>
          <v-tab href="#tab-8">Uncategorized</v-tab>
          <v-tab href="#tab-9">Removed</v-tab>
        </v-tabs>
        <v-card-actions>
          <v-layout row wrap>
            <v-flex xs12 sm2 md2>
              <v-select :items="check.shifts" v-model="selectedShift" clearable item-text="number" item-value="number" label="Shift"></v-select>
            </v-flex>
            <v-flex sm1 md1></v-flex>
            <v-flex xs12 sm2 md2>
              <v-select :items="taskStatus" v-model="selectedStatus" clearable label="Status" multiple></v-select>
            </v-flex>
            <v-flex sm1 md1></v-flex>
            <v-flex xs12 sm3 md3>
              <v-text-field append-icon="search" label="Search" single-line hide-details v-model="search"></v-text-field>
            </v-flex>
            <v-flex xs12 sm1 md1></v-flex>
            <v-flex xs12 sm2 md2>
              <v-btn @click.native="exportTask" class="blue white--text">Export to Excel
                <v-icon dark right>file_download</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
        </v-card-actions>
        <v-data-table
          :headers="headerTask"
          :items="workpackByTab"
          :pagination.sync="paginationTask"
          :search="search"
          item-key="wpItem"
          >
          <template slot="items" slot-scope="props">
            <td class="body-0" @click="props.expanded = !props.expanded">{{ props.item.taskTitle }}</td>
            <td class="body-0" @click="selectShift(props.item)"><v-chip v-for="shift in props.item.shifts" :key="shift" label :color="shiftColor(props.item.shifts, shift, props.item.status)">{{ shift }}</v-chip></td>
            <td class="body-0" @click="props.expanded = !props.expanded">{{ props.item.notes }}</td>
            <td class="body-0" @click="props.expanded = !props.expanded">{{ props.item.wpItem }}</td>
            <td class="body-0" @click="props.expanded = !props.expanded">{{ props.item.taskType }}</td>
            <td class="body-0" @click="props.expanded = !props.expanded">{{ props.item.zoneDivision }}</td>
          </template>
          <template slot="expand" slot-scope="props">
            <v-card flat color="blue lighten-5" class="elevation-0">
              <v-card-actions>
                <v-btn icon class="mx-0" @click.native="editTask(props.item)">
                  <v-tooltip bottom>
                      <v-icon color="blue" slot="activator">edit</v-icon><span>edit</span>
                  </v-tooltip>
                </v-btn>
                <v-menu transition="slide-x-transition">
                  <v-btn icon class="mx-0" slot="activator">
                    <v-tooltip bottom>
                        <v-icon color="blue" slot="activator" medium>forward</v-icon><span>move to</span>
                    </v-tooltip>
                  </v-btn>
                  <v-list>
                    <v-list-tile v-for="zone in zoneSelection" :key="zone" @click="moveTask(zone, props.item)">
                      <v-list-tile-title v-text="zone"></v-list-tile-title>
                    </v-list-tile>
                  </v-list>
                </v-menu>
                <v-btn icon class="mx-0" @click.native="deleteTask(props.item)" v-if="tabs !== 'tab-9'">
                  <v-tooltip bottom>
                      <v-icon color="red" slot="activator">delete</v-icon><span>delete</span>
                  </v-tooltip>
                </v-btn>
                <v-btn icon class="mx-0" @click.native="showLog(props.item)">
                  <v-tooltip bottom>
                      <v-icon color="blue" slot="activator">assignment</v-icon><span>log</span>
                  </v-tooltip>
                </v-btn>
              </v-card-actions>
              <v-card-text>
                <p>Zone: <strong>{{ props.item.zone }}</strong></p>
                <p>Task: <strong>{{ props.item.taskName }}</strong></p>
                <p>Remarks: <strong>{{ props.item.remarks }}</strong></p>
              </v-card-text>
            </v-card>
          </template>
        </v-data-table>
      </v-card>
    </v-flex>
    <v-dialog v-model="dialogDelete" max-width="290">
      <v-card>
        <v-card-title>Do you want to delete the task?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat color="blue" @click.native="closeDeleteTask()">No</v-btn>
          <v-btn flat color="red" @click.native="saveDeleteTask()">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogEdit" max-width="500">
      <v-card>
        <v-card-title class="blue darken-1">
          <h4 class="white--text">Edit Task</h4>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-sm>
            <v-layout wrap>
              <v-flex xs12 sm12 md12>
                <v-text-field multi-line rows="3" label="TITLE" v-model="editedItem.taskTitle"></v-text-field>
              </v-flex>
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
                <v-text-field multi-line rows="2" no-resize label="NOTES" v-model="editedItem.notes"></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue" flat @click.native="closeEditTask()">Cancel</v-btn>
          <v-btn color="blue" flat @click.native="saveEditTask()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogSelectShift" max-width="800">
      <v-card>
        <v-card-title class="blue darken-1">
          <h4 class="white--text">Select Shifts</h4>
        </v-card-title>
        <v-card-text>
          <v-layout row wrap>
            <v-flex lg1 md1 sm1 xs1 v-for="shift in check.shifts" :key="shift.number">
              <v-checkbox :label="shift.number.toString()" v-model="editedItem.shifts" :value="shift.number"></v-checkbox>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue" flat @click.native="closeSelectShift()">Cancel</v-btn>
          <v-btn color="blue" flat @click.native="saveSelectShift()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogLog" max-width="900">
      <v-card class="elevation-0">
        <v-data-table
          :items="taskLogs"
          :headers="headerLog"
          :pagination.sync="paginationLog"
          :loading="logLoading"
          class="elevation-1">
          <template slot="items" slot-scope="props">
            <td class="boyd-0">{{ props.item.person }}</td>
            <td class="boyd-0">{{ props.item.action }}</td>
            <td class="boyd-0">{{ props.item.status }}</td>
            <td class="boyd-0">{{ props.item.time }}</td>
            <td class="boyd-0">{{ props.item.notes || 'NIL'}}</td>
          </template>
        </v-data-table>
      </v-card>
    </v-dialog>
    <loading-progress></loading-progress>
  </v-container>
</template>

<script>

import firebase from 'firebase'
import XLSX from 'xlsx'

export default {
  name: 'Tasks',
  data () {
    return {
      checkId: '',
      check: {
        shifts: []
      },
      firstLoad: true,
      workpack: [],
      workpackByTab: [],
      workpackByTabBeforeFilter: [],
      tabs: 'tab-1',
      headerLog: [
        { text: 'PERSON', left: true, value: 'person' },
        { text: 'ACTION', left: true, value: 'action' },
        { text: 'STATUS', left: true, value: 'status' },
        { text: 'TIME', left: true, value: 'time' },
        { text: 'NOTES', left: true, value: 'notes' }
      ],
      headerTask: [
        { text: 'TITLE', left: true, value: 'taskTitle' },
        { text: 'STATUS', left: true, value: 'status' },
        { text: 'NOTE', left: true, value: 'notes' },
        { text: 'WP ITEM', left: true, value: 'wpItem' },
        { text: 'TYPE', left: true, value: 'taskType' },
        { text: 'ZONE DIVISION', left: true, value: 'zoneDivision' }
        // { text: '', sortable: false, value: '' }
      ],
      paginationTask: {
        page: 1,
        totalItems: 0,
        rowsPerPage: 10,
        sortBy: 'zoneDivision'
      },
      paginationLog: {
        page: 1,
        totalItems: 0,
        rowsPerPage: 10,
        sortBy: 'time',
        descending: true
      },
      search: '',
      editedItem: {},
      dialogDelete: false,
      dialogEdit: false,
      dialogSelectShift: false,
      dialogLog: false,
      zoneSelection: this.constUtil.zoneSelection,
      taskLogs: [],
      logLoading: false,
      taskStatus: this.constUtil.taskStatus,
      selectedShift: null,
      selectedStatus: []
    }
  },
  computed: {
    currentShift () {
      let today = Date.now(7)
      let start = new Date(this.check.startDate)
      if (today < start) {
        return 0
      }
      let diff = new Date(today - start)
      return diff.getUTCDate()
    }
  },
  watch: {
    tabs (newValue, oldValue) {
      this.showTab()
      this.search = ''
      this.selectedShift = null
      this.selectedStatus = []
    },
    dialogLog (newValue, oldValue) {
      if (newValue === false) {
        this.taskLogs = []
      }
    },
    selectedShift (newValue, oldValue) {
      // console.log(newValue)
      this.filterTask(newValue, this.selectedStatus, true)
    },
    selectedStatus (newValue, oldValue) {
      // console.log(newValue)
      this.filterTask(this.selectedShift, newValue, false)
    }
  },
  methods: {
    deleteTask(item) {
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },
    editTask(item) {
      this.editedItem = Object.assign({}, item)
      this.dialogEdit = true
    },
    moveTask(zone, item) {
      this.editedItem = Object.assign({}, item)
      this.editedItem.groupId = null
      this.editedItem.zoneDivision = zone + ' from ' + this.editedItem.zoneDivision
      const rootComponent = this.appUtil.getRootComponent(this)
      firebase.database().ref('/workpacks/' + this.checkId + '/' + this.editedItem.id).update(this.editedItem).then(
        (data) => {
          rootComponent.openSnackbar('Success', 'success')
          this.editedItem = {}
        },
        (error) => {
          // console.log(error)
          rootComponent.openSnackbar(error, 'error')
          this.editedItem = {}
        }
      )
    },
    selectShift(item) {
      this.editedItem = Object.assign({}, item)
      this.dialogSelectShift = true
    },
    showLog(item) {
      this.logLoading = true
      firebase.database().ref('taskLogs/' + this.checkId).orderByChild('taskId').equalTo(item.id).once('value').then(
        (data) => {
          let obj = data.val()
          // console.log(obj)
          for (let key in obj) {
            this.taskLogs.push(obj[key])
          }
          this.logLoading = false
        },
        (error) => {
          console.log(error)
          this.logLoading = false
        }
      )
      this.dialogLog = true
    },
    closeDeleteTask() {
      this.dialogDelete = false
      setTimeout(() => {
        this.editedItem = {}
      }, 300)
    },
    closeEditTask() {
      this.dialogEdit = false
      setTimeout(() => {
        this.editedItem = {}
      }, 300)
    },
    closeSelectShift() {
      this.dialogSelectShift = false
      setTimeout(() => {
        this.editedItem = {}
      }, 300)
    },
    saveDeleteTask() {
      this.editedItem.zoneDivision = 'REMOVED ' + this.editedItem.zoneDivision
      const rootComponent = this.appUtil.getRootComponent(this)
      firebase.database().ref('/workpacks/' + this.checkId + '/' + this.editedItem.id).update(this.editedItem).then(
        (data) => {
          rootComponent.openSnackbar('Deleted', 'error')
        },
        (error) => {
          // console.log(error)
          rootComponent.openSnackbar(error, 'error')
        }
      )
      this.closeDeleteTask()
    },
    saveEditTask() {
      const rootComponent = this.appUtil.getRootComponent(this)
      firebase.database().ref('/workpacks/' + this.checkId + '/' + this.editedItem.id).update(this.editedItem).then(
        (data) => {
          rootComponent.openSnackbar('Success', 'success')
        },
        (error) => {
          // console.log(error)
          rootComponent.openSnackbar(error, 'error')
          this.closeEditTask()
        }
      )
      this.closeEditTask()
    },
    saveSelectShift() {
      this.editedItem.shifts.sort((a, b) => {
        return a - b
      })
      firebase.database().ref('/workpacks/' + this.checkId + '/' + this.editedItem.id).update(this.editedItem).then(
        (data) => {},
        (error) => {
          console.log(error)
        }
      )
      this.closeSelectShift()
    },
    shiftColor(shifts, shiftNumber, taskStatus) {
      if (this.currentShift === 0) {
        return 'grey lighten-2'
      }
      let lastShiftNumber = shifts[shifts.length - 1]
      if (taskStatus === 'done') {
        return 'green'
      }
      if (taskStatus === 'out') {
        return 'blue-grey'
      }
      if (taskStatus === 'inProgress') {
        if (shiftNumber < this.currentShift && shiftNumber === lastShiftNumber) {
          return 'orange darken-3'
        } else if (shiftNumber > this.currentShift) {
          return 'grey lighten-2'
        } else {
          return 'yellow darken-3'
        }
      }
      if (taskStatus === 'notYet') {
        if (shiftNumber <= this.currentShift) {
          return 'red'
        } else {
          return 'grey lighten-2'
        }
      }
    },
    filterTask(byShift, byStatus, shiftChange) {
      function filterByShift(element) {
        let shifts = element.shifts
        let found = false
        shifts.forEach((item, index, array) => {
          if (item === byShift) {
            found = true
          }
        })
        return found
      }

      function filterByStatus(element) {
        let status = element.status
        let found = false
        byStatus.forEach((item, index, array) => {
          if (status === item) {
            found = true
          }
        })
        return found
      }

      if (byShift === null && byStatus.length === 0) {
        this.workpackByTab = this.workpackByTabBeforeFilter
        return
      }
      // console.log(shiftChange)
      if (shiftChange) {
        if (byShift !== null && byShift !== undefined) {
          this.workpackByTab = this.workpackByTabBeforeFilter.filter(filterByShift)
        } else {
          this.workpackByTab = this.workpackByTabBeforeFilter
        }
        if (byStatus.length > 0) {
          this.workpackByTab = this.workpackByTab.filter(filterByStatus)
        }
      } else {
        if (byStatus.length > 0) {
          this.workpackByTab = this.workpackByTabBeforeFilter.filter(filterByStatus)
        } else {
          this.workpackByTab = this.workpackByTabBeforeFilter
        }
        if (byShift !== null && byShift !== undefined) {
            this.workpackByTab = this.workpackByTab.filter(filterByShift)
        }
      }
    },
    loadCheck() {
      firebase.database().ref('checks').child(this.checkId).on('value',
        (data) => {
          this.check = data.val()
        },
        (error) => {
          console.log(error)
        }
      )
    },
    loadWorkpack() {
      this.$store.dispatch('beginLoading')
      firebase.database().ref('workpacks/' + this.checkId).on('value',
        (data) => {
          this.workpack = Object.values(data.val()) || []
          this.showTab()
          // console.log(this.firstLoad)
          if (!this.firstLoad) {
            this.filterTask(this.selectedShift, this.selectedStatus, true)
          }
          this.firstLoad = false
          this.$store.dispatch('endLoading')
        },
        (error) => {
          console.log(error)
          this.$store.dispatch('endLoading')
        }
      )
    },
    showTab() {
      if (this.appUtil.getZoneByTab(this.tabs) === 'N/A') {
        this.workpackByTab = this.workpack.filter(element =>
          element.zoneDivision.indexOf('100-200-800') === -1 &&
          element.zoneDivision.indexOf('300-400') === -1 &&
          element.zoneDivision.indexOf('500-600-700') === -1 &&
          element.zoneDivision.indexOf('AVI') === -1 &&
          element.zoneDivision.indexOf('STRUCTURE') === -1 &&
          element.zoneDivision.indexOf('CAB') === -1 &&
          element.zoneDivision.indexOf('CLEANING') === -1 &&
          element.zoneDivision.indexOf('REMOVED') === -1)
        this.workpackByTabBeforeFilter = this.workpackByTab
        return
      } else {
        this.workpackByTab = this.workpack.filter(task => task.zoneDivision.indexOf(this.appUtil.getZoneByTab(this.tabs)) === 0)
        this.workpackByTabBeforeFilter = this.workpackByTab
        this.$store.dispatch('endLoading')
      }
    },
    exportTask() {
      let exportedWorkpack = []
      this.workpackByTab.forEach((element) => {
        let item = {
          WP_ITEM: element.wpItem,
          TITLE: element.taskTitle
        }
        exportedWorkpack.push(item)
      })
      // console.log(exportedWorkpack)
      exportedWorkpack.sort((a, b) => {
        return a.WP_ITEM.localeCompare(b.WP_ITEM)
      })
      // console.log(exportedWorkpack)
      let worksheet = XLSX.utils.json_to_sheet(Object.assign([], exportedWorkpack))
      // console.log(worksheet)
      let workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'ZD')
      // // console.log(workbook)
      XLSX.writeFile(workbook, 'BSF40 - ' + this.appUtil.getZoneByTab(this.tabs) + '.xlsx')
    }
  },
  mounted() {
    this.checkId = this.$store.getters.following
    this.loadCheck()
    this.loadWorkpack()
  }
}
</script>

