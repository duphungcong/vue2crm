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
                <v-select label="Select group" :items="groups" item-text="name"></v-select>
              </v-flex>
              <v-flex xs3 pl-2 pt-3>
                <v-btn icon class="mx-0" @click.native="editGroup()">
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
            <v-flex xs6 class="border-group">
              <v-data-table
              light
                :headers="headerTask"
                :items="selected"
                :pagination.sync="paginationTask"
                :search="search"
                item-key="wpItem"
                select-all
                v-model="unSelected">
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
                <v-btn class="blue white--text">
                  <v-icon dark>arrow_back</v-icon>
                </v-btn>
              </v-layout>
              <v-layout justify-center>
                <v-btn class="blue white--text">
                  <v-icon dark>arrow_forward</v-icon>
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
                v-model="selected">
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
      tabs: 'tab-1',
      search: '',
      selected: [],
      unSelected: [],
      headers: [
        {
          text: 'Dessert (100g serving)',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        { text: 'Calories', value: 'calories' },
        { text: 'Fat (g)', value: 'fat' },
        { text: 'Carbs (g)', value: 'carbs' },
        { text: 'Protein (g)', value: 'protein' },
        { text: 'Iron (%)', value: 'iron' }
      ],
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
      groups: [
        { name: 'Dool 1L' },
        { name: 'Dool 2L' },
        { name: 'Dool 3L' },
        { name: 'Dool 4L' },
        { name: 'Aft cargo' },
        { name: 'Dool 1R' },
        { name: 'Dool 2R' },
        { name: 'Dool 3R' },
        { name: 'Dool 4R' },
        { name: 'Fwd cargo' },
        { name: 'Dool 1L' },
        { name: 'Dool 2L' },
        { name: 'Dool 3L' },
        { name: 'Dool 4L' },
        { name: 'Aft cargo' },
        { name: 'Dool 1R' },
        { name: 'Dool 2R' },
        { name: 'Dool 3R' },
        { name: 'Dool 4R' },
        { name: 'Fwd cargo' }
      ]
    }
  },
  watch: {
    tabs (newValue, oldValue) {
      this.showTab()
      this.search = ''
    }
  },
  methods: {
    showTab() {
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
      if (zoneByTab(this.tabs) === 'N/A') {
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
        this.workpackByTab = this.workpack.filter(task => task.zoneDivision.indexOf(zoneByTab(this.tabs)) === 0)
        this.workpackByTabBeforeFilter = this.workpackByTab
        this.$store.dispatch('endLoading')
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
    }
  },
  mounted() {
    this.checkId = this.$store.getters.following
    this.loadCheck()
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
