<template>
  <v-container fluid pa-1>
      <v-flex xs12>
        <v-card class="elevation-0">
          <v-tabs
            height="40"
            fixed-tabs
            slider-color="red"
            show-arrows
            v-model="tabs"
          >
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
          <v-tabs-items v-model="tabs">
            <v-tab-item
              v-for="i in 9"
              :key="i"
              :id="'tab-' + i">
              <v-card class="elevation-0">
                <v-card-title>
                  <v-spacer></v-spacer>
                  <v-text-field append-icon="search" label="Search" single-line hide-details v-model="search"></v-text-field>
                </v-card-title>
              </v-card>
              &nbsp;
              <v-data-table
              :headers="headers"
              :items="workpackByTab"
              :pagination.sync="pagination"
              :search="search"
              item-key="taskName"
              >
              <template slot="items" slot-scope="props">
                <td class="body-0" @click="props.expanded = !props.expanded">{{ props.item.taskTitle }}</td>
                <td class="body-0"><v-chip v-for="shift in props.item.shifts" :key="shift.number" label :color="shiftColor(props.item.shifts, shift.number, props.item.status)">{{ shift.number }}</v-chip></td>
                <td class="body-0">{{ props.item.notes }}</td>
                <td class="body-0">{{ props.item.wpItem }}</td>
                <td class="body-0">{{ props.item.taskType }}</td>
                <td class="body-0">{{ props.item.zoneDivision }}</td>
                <td class="text-xs-center">
                  <v-btn icon class="mx-0" @click.native="editShift(props.item)">
                    <v-tooltip bottom>
                        <v-icon color="green" slot="activator">assignment</v-icon><span>shift</span>
                    </v-tooltip>
                  </v-btn>
                </td>
              </template>
              <template slot="expand" slot-scope="props">
                <v-card flat color="blue lighten-5" class="elevation-0">
                  <v-card-actions>
                    <v-btn icon class="mx-0" @click.native="editTask(props.item)">
                      <v-tooltip bottom>
                          <v-icon color="green" slot="activator">edit</v-icon><span>edit</span>
                      </v-tooltip>
                    </v-btn>
                    <v-menu transition="slide-x-transition">
                      <v-btn icon class="mx-0" slot="activator">
                        <v-tooltip bottom>
                            <v-icon color="green" slot="activator" medium>trending_flat</v-icon><span>move to</span>
                        </v-tooltip>
                      </v-btn>
                      <v-list>
                        <v-list-tile v-for="zone in newZone" :key="zone" @click="moveTask(zone, props.item)">
                          <v-list-tile-title v-text="zone"></v-list-tile-title>
                        </v-list-tile>
                      </v-list>
                    </v-menu>
                    <v-btn icon class="mx-0" @click.native="deleteTask(props.item)" v-if="tabs !== 'tab-9'">
                      <v-tooltip bottom>
                          <v-icon color="red" slot="activator">delete</v-icon><span>delete</span>
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
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-flex>
    <v-dialog v-model="dialogDelete" max-width="290">
      <v-card>
        <v-card-title>Do you want to delete the task?</v-card-title>
        <v-card-actions>
          <v-btn flat @click.native="closeDeleteTask()">No</v-btn>
          <v-btn flat color="red" @click.native="saveDeleteTask()">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogEdit" max-width="500">
      <v-card>
        <v-card-title blue>
          <span class="headline">Edit Task</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-sm>
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
          <v-btn color="blue darken-1" flat @click.native="closeEditTask()">Cancel</v-btn>
          <v-btn color="blue darken-1" flat @click.native="saveEditTask()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <loading-progress></loading-progress>
  </v-container>
</template>

<script>

import firebase from 'firebase'

export default {
  name: 'Tasks',
  data () {
    return {
      checkId: '',
      check: {
        shifts: []
      },
      workpack: [],
      workpackByTab: [],
      tabs: 'tab-1',
      headers: [
        { text: 'TITLE', left: true, value: 'taskTitle' },
        { text: 'STATUS', left: true, value: 'status' },
        { text: 'NOTE', left: true, value: 'notes' },
        { text: 'WP ITEM', left: true, value: 'wpItem' },
        { text: 'TYPE', left: true, value: 'taskType' },
        { text: 'ZONE DIVISION', left: true, value: 'zoneDivision' },
        { text: '', sortable: false, value: '' }
      ],
      pagination: {
        page: 1,
        totalItems: 0,
        rowsPerPage: 10,
        sortBy: 'zoneDivision'
      },
      search: '',
      itemIndex: -1,
      editedItem: {},
      dialogDelete: false,
      dialogEdit: false,
      newZone: [
        '100-200-800',
        '300-400',
        '500-600-700',
        'AVIONIC',
        'STRUCTURE',
        'CABIN',
        'CLEANING'
      ]
    }
  },
  computed: {
    currentShift () {
      let today = Date.now(7)
      let start = new Date(this.check.startDate)
      let diff = new Date(today - start)
      return diff.getUTCDate()
    }
  },
  watch: {
    tabs (newValue, oldValue) {
      this.showTab()
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
    loadWorkpack() {
      this.$store.dispatch('beginLoading')
      firebase.database().ref('workpacks').child(this.checkId).once('value').then(
        (data) => {
          this.workpack = data.val()
          this.showTab()
          this.$store.dispatch('endLoading')
        },
        (error) => {
          console.log(error)
          this.$store.dispatch('endLoading')
        }
      )
    },
    showTab() {
      console.log(this.tabs)
      const zoneByTab = (tab) => ({
        'tab-1': '100-200-800',
        'tab-2': '300-400',
        'tab-3': '500-600-700',
        'tab-4': 'AVI',
        'tab-5': 'STRUCTURE',
        'tab-6': 'CABIN',
        'tab-7': 'CLEANING',
        'tab-8': 'N/A',
        'tab-9': 'REMOVED'
      })[tab]
      this.$store.dispatch('beginLoading')
      // this.workpackByTab = this.workpack.filter(task => task.zoneDivision.includes(zoneByTab(this.tabs)))
      this.workpackByTab = this.workpack.filter(task => task.zoneDivision.indexOf(zoneByTab(this.tabs)) === 0)
      this.$store.dispatch('endLoading')
    },
    deleteTask(item) {
      this.itemIndex = this.workpack.indexOf(item)
      console.log(this.itemIndex)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },
    editTask(item) {
      this.itemIndex = this.workpack.indexOf(item)
      console.log(this.itemIndex)
      this.editedItem = Object.assign({}, item)
      this.dialogEdit = true
    },
    moveTask(zone, item) {
      this.itemIndex = this.workpack.indexOf(item)
      // console.log(this.itemIndex)
      this.editedItem = Object.assign({}, item)
      this.editedItem.zoneDivision = zone + ' from ' + this.editedItem.zoneDivision
      if (this.itemIndex > -1) {
        firebase.database().ref('/workpacks/' + this.checkId + '/' + this.itemIndex).update(this.editedItem).then(
          (data) => {
            // console.log(data)
            Object.assign(this.workpack[this.itemIndex], this.editedItem)
            this.editedItem = {}
            this.showTab()
          },
          (error) => {
            console.log(error)
            this.editedItem = {}
          }
        )
      }
    },
    closeDeleteTask() {
      this.dialogDelete = false
      setTimeout(() => {
        this.editedItem = {}
        this.itemIndex = -1
      }, 300)
    },
    closeEditTask() {
      this.dialogEdit = false
      setTimeout(() => {
        this.editedItem = {}
        this.itemIndex = -1
      }, 300)
    },
    saveDeleteTask() {
      this.editedItem.zoneDivision = 'REMOVED ' + this.editedItem.zoneDivision
      if (this.itemIndex > -1) {
        firebase.database().ref('/workpacks/' + this.checkId + '/' + this.itemIndex).update(this.editedItem).then(
          (data) => {
            Object.assign(this.workpack[this.itemIndex], this.editedItem)
            this.showTab()
          },
          (error) => {
            console.log(error)
          }
        )
      }
      this.closeDeleteTask()
    },
    saveEditTask() {
      if (this.itemIndex > -1) {
        firebase.database().ref('/workpacks/' + this.checkId + '/' + this.itemIndex).update(this.editedItem).then(
          (data) => {
            Object.assign(this.workpack[this.itemIndex], this.editedItem)
            this.showTab()
          },
          (error) => {
            console.log(error)
            this.closeEditTask()
          }
        )
      }
      this.closeEditTask()
    },
    shiftColor(shifts, shiftNumber, taskStatus) {
      let lastShiftNumber = shifts[shifts.length - 1].number
      if (taskStatus === 'done') {
        return 'green'
      }
      if (taskStatus === 'out') {
        return 'blue-grey'
      }
      if (taskStatus === 'inProgress') {
        if (shiftNumber < this.currentShift && shiftNumber === lastShiftNumber) {
          return 'red'
        } else {
          return 'yellow'
        }
      }
      if (taskStatus === 'notYet') {
        if (shiftNumber <= this.currentShift) {
          return 'red'
        } else {
          return 'grey lighten-3'
        }
      }
    }
  },
  mounted() {
    this.checkId = this.$store.getters.following
    this.loadCheck()
    this.loadWorkpack()
  }
}
</script>

