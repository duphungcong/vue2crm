<template>
  <v-container fluid grid-list-sm>
    <v-layout row>
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
            <v-layout row>
              <v-flex xs3>
                <v-select label="Select group" :items="groupListByTab" item-text="name" v-model="selectedGroup"></v-select>
              </v-flex>
              <v-flex xs3 pl-2 pt-3>
                <v-btn icon class="mx-0" @click.native="editGroup(selectedGroup)">
                  <v-tooltip bottom>
                      <v-icon color="blue" slot="activator">edit</v-icon><span>edit</span>
                  </v-tooltip>
                </v-btn>
                <v-btn icon class="mx-0" @click.native="deleteGroup()">
                  <v-tooltip bottom>
                      <v-icon color="red" slot="activator">delete</v-icon><span>delete</span>
                  </v-tooltip>
                </v-btn>
                <v-btn icon class="mx-0" @click.native="addGroup()">
                  <v-tooltip bottom>
                      <v-icon color="blue" slot="activator">add</v-icon><span>add group</span>
                  </v-tooltip>
                </v-btn>
              </v-flex>
            </v-layout>
          </v-card-actions>

          <v-layout row>
            <v-flex xs5 class="border-group">
              <v-data-table
              light
                :headers="headerTask"
                :items="workpackByGroup"
                :pagination.sync="paginationTask"
                :search="search"
                item-key="wpItem"
                select-all
                v-model="unSelectedTasks">
                <template slot="items" slot-scope="props">
                  <td>
                    <v-checkbox
                      primary
                      hide-details
                      v-model="props.selected"></v-checkbox>
                  </td>
                  <td class="body-0" @click="props.expanded = !props.expanded">{{ props.item.taskTitle }}</td>
                  <!-- <td class="body-0" @click="selectShift(props.item)"><v-chip v-for="shift in props.item.shifts" :key="shift" label :color="shiftColor(props.item.shifts, shift, props.item.status)">{{ shift }}</v-chip></td> -->
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
            </v-flex>

            <v-flex xs1>
              <v-layout justify-center>
                <v-btn :disabled="selectedGroup === null" class="blue white--text" @click.native="moveToGroup()">
                  <v-icon dark>arrow_back</v-icon>
                </v-btn>
              </v-layout>
              <v-layout justify-center>
                <v-btn :disabled="selectedGroup === null" class="blue white--text" @click.native="moveToWorkpack()">
                  <v-icon dark>arrow_forward</v-icon>
                </v-btn>
              </v-layout>
              <v-layout justify-center>
                <v-btn class="blue white--text" @click.native="deSelect()">
                  <v-icon dark>loop</v-icon>
                </v-btn>
              </v-layout>
            </v-flex>

            <v-flex xs6 class="border-workpack">
              <v-data-table
                :headers="headerTask"
                :items="workpackByTab"
                :pagination.sync="paginationTask"
                :search="search"
                item-key="wpItem"
                select-all
                v-model="selectedTasks">
                <template slot="items" slot-scope="props">
                  <td>
                    <v-checkbox
                      primary
                      hide-details
                      v-model="props.selected"></v-checkbox>
                  </td>
                  <td class="body-0" @click="props.expanded = !props.expanded">{{ props.item.taskTitle }}</td>
                  <!-- <td class="body-0" @click="selectShift(props.item)"><v-chip v-for="shift in props.item.shifts" :key="shift" label :color="shiftColor(props.item.shifts, shift, props.item.status)">{{ shift }}</v-chip></td> -->
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
            </v-flex>
          </v-layout>   
        </v-card>
      </v-flex>
    </v-layout>
    <v-dialog v-model="dialogGroup" max-width="800">
      <v-card>
        <v-card-title class="blue darken-1">
          <h4 class="white--text"><span v-if="editedGroup.id === ''" >New Group</span><span v-else>Edit Group</span></h4>
        </v-card-title>
        <v-card-text>
          <v-layout row wrap align-baseline>
            <v-flex xs12>
              <v-select disabled label="Zone" :items="zoneSelection" v-model="editedGroup.zoneDivision"></v-select>
            </v-flex>
          </v-layout>
          <v-layout row wrap align-baseline>
            <v-flex xs12>
              <v-text-field label="Name" counter="20" v-model="editedGroup.name"></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field label="Description" v-model="editedGroup.description"></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row wrap align-baseline>
            <v-flex xs12>Select shifts</v-flex>
            <v-flex lg1 md1 sm2 xs6 v-for="shift in check.shifts" :key="shift.number">
              <v-checkbox :label="shift.number.toString()" v-model="editedGroup.shifts" :value="shift.number"></v-checkbox>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue" flat @click.native="closeGroup()">Cancel</v-btn>
          <v-btn color="blue" flat @click.native="saveGroup()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <loading-progress></loading-progress>
  </v-container>
</template>

<script>

import firebase from 'firebase'

export default {
  name: 'Groups',
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
      workpackByGroup: [],
      tabs: 'tab-1',
      search: '',
      selectedTasks: [],
      unSelectedTasks: [],
      zoneSelection: this.constUtil.zoneSelection,
      dialogGroup: false,
      selectedGroup: null,
      headerTask: [
        { text: 'TITLE', left: true, value: 'taskTitle' },
        // { text: 'STATUS', left: true, value: 'status' },
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
      editedGroup: {},
      oldShifts: [],
      defaultGroup: {
        id: '',
        name: '',
        description: '',
        zone: 'N/A',
        shifts: []
      },
      groupList: [],
      groupListByTab: [],
      moveTaskMode: true
    }
  },
  watch: {
    tabs (newValue, oldValue) {
      this.showTab()
      this.search = ''
    },
    selectedGroup(newValue, oldValue) {
      if (newValue !== null && newValue !== undefined) {
        this.workpackByGroup = this.workpackByTabBeforeFilter.filter(element => element.groupId === newValue.id)
      } else {
        this.workpackByGroup = []
      }
      this.deSelect()
    }
  },
  methods: {
    deSelect() {
      this.selectedTasks = []
      this.unSelectedTasks = []
    },
    moveToWorkpack() {
      const rootComponent = this.appUtil.getRootComponent(this)
      if (this.unSelectedTasks.length > 0) {
        let updates = {}
        this.unSelectedTasks.forEach((element) => {
          element.groupId = null
          updates['workpacks/' + this.checkId + '/' + element.id] = element
        })
        // console.log(this.selectedTasks)
        firebase.database().ref().update(updates).then(
          (data) => {
            rootComponent.openSnackbar('Success', 'success')
          },
          (error) => {
            rootComponent.openSnackbar(error, 'error')
          }
        )
      } else {
        rootComponent.openSnackbar('No task to move', 'error')
      }
    },
    moveToGroup() {
      const rootComponent = this.appUtil.getRootComponent(this)
      if (this.selectedTasks.length > 0) {
        let updates = {}
        this.selectedTasks.forEach((element) => {
          element.groupId = this.selectedGroup.id
          // Merge group shifts with task shifts
          // let duplicateShifts = element.shifts.concat(this.selectedGroup.shifts)
          // element.shifts = [...(new Set(duplicateShifts))]

          // Apply group shifts to task shifts
          element.shifts = Object.assign([], this.selectedGroup.shifts)
          updates['workpacks/' + this.checkId + '/' + element.id] = element
        })
        // console.log(this.selectedTasks)
        firebase.database().ref().update(updates).then(
          (data) => {
            rootComponent.openSnackbar('Success', 'success')
          },
          (error) => {
            rootComponent.openSnackbar(error, 'error')
          }
        )
      } else {
        rootComponent.openSnackbar('No task to move', 'error')
      }
    },
    addGroup() {
      this.editedGroup = Object.assign({}, this.defaultGroup)
      this.dialogGroup = true
    },
    editGroup(item) {
      if (item !== null && item !== undefined) {
        this.editedGroup = Object.assign({}, item)
        this.oldShifts = Object.assign([], this.editedGroup.shifts)
        this.dialogGroup = true
      }
    },
    closeGroup() {
      this.editedGroup = Object.assign({}, this.defaultGroup)
      this.dialogGroup = false
      this.oldShifts = []
    },
    saveGroup() {
      const rootComponent = this.appUtil.getRootComponent(this)
      let updates = {}
      if (this.editedGroup.id === '') {
        this.editedGroup.id = firebase.database().ref('groups/' + this.checkId).push().key
      }
      this.editedGroup.shifts.sort((a, b) => {
        return a - b
      })
      this.selectedGroup = this.editedGroup
      updates['groups/' + this.checkId + '/' + this.editedGroup.id] = this.editedGroup
      if (!this.appUtil.compareNumericArray(this.oldShifts, this.editedGroup.shifts)) {
        this.workpackByGroup.forEach(element => {
          // console.log('change shifts')
          element.shifts = Object.assign([], this.editedGroup.shifts)
          updates['workpacks/' + this.checkId + '/' + element.id] = element
        })
      }
      firebase.database().ref().update(updates).then(
        (data) => {
          rootComponent.openSnackbar('Success', 'success')
        },
        (error) => {
          rootComponent.openSnackbar(error, 'error')
        }
      )
      this.closeGroup()
    },
    showTab() {
      if (this.appUtil.getZoneByTab(this.tabs) === 'N/A') {
        this.workpackByTabBeforeFilter = this.workpack.filter(element =>
          element.zoneDivision.indexOf('100-200-800') === -1 &&
          element.zoneDivision.indexOf('300-400') === -1 &&
          element.zoneDivision.indexOf('500-600-700') === -1 &&
          element.zoneDivision.indexOf('AVI') === -1 &&
          element.zoneDivision.indexOf('STRUCTURE') === -1 &&
          element.zoneDivision.indexOf('CAB') === -1 &&
          element.zoneDivision.indexOf('CLEANING') === -1 &&
          element.zoneDivision.indexOf('REMOVED') === -1)
        this.workpackByTab = this.workpackByTabBeforeFilter
      } else {
        // this.workpackByTab = this.workpack.filter(task => task.zoneDivision.indexOf(this.appUtil.getZoneByTab(this.tabs)) === 0)
        // this.workpackByTabBeforeFilter = this.workpackByTab
        this.workpackByTabBeforeFilter = this.workpack.filter(element => element.zoneDivision.indexOf(this.appUtil.getZoneByTab(this.tabs)) === 0)
        this.workpackByTab = this.workpackByTabBeforeFilter.filter(element => element.groupId === null || element.groupId === undefined)
      }
      this.defaultGroup.zoneDivision = this.appUtil.getZoneByTab(this.tabs)
      this.groupListByTab = this.groupList.filter(element => element.zoneDivision.indexOf(this.appUtil.getZoneByTab(this.tabs)) === 0)
      if (this.selectedGroup !== null && this.groupListByTab.indexOf(this.selectedGroup) === -1) {
        this.selectedGroup = null
      }
      if (this.selectedGroup !== null && this.selectedGroup !== undefined) {
        this.workpackByGroup = this.workpackByTabBeforeFilter.filter(element => element.groupId === this.selectedGroup.id)
      }
      this.deSelect()
      this.$store.dispatch('endLoading')
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
            // this.filterTask(this.selectedShift, this.selectedStatus, true)
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
    loadGroups() {
      firebase.database().ref('groups/' + this.checkId).on('value',
        (data) => {
          const obj = data.val()
          if (obj !== null && obj !== undefined) {
            this.groupList = Object.values(data.val()) || []
            this.groupListByTab = this.groupList.filter(element => element.zoneDivision.indexOf(this.appUtil.getZoneByTab(this.tabs)) === 0)
            if (this.selectedGroup !== null && this.selectedGroup !== undefined) {
              this.selectedGroup = this.groupListByTab.filter(element => element.id === this.selectedGroup.id).pop()
            }
          } else {
            this.groupList = []
          }
        },
        (error) => {
          console.log(error)
        }
      )
    }
  },
  mounted() {
    this.checkId = this.$store.getters.following
    this.loadCheck()
    this.loadGroups()
    this.loadWorkpack()
  }
}
</script>

<style scoped>
  .border-group {
    border: #03A9F4 1px solid;
  }
  .border-workpack {
    border: grey 1px solid;
  }
</style>
