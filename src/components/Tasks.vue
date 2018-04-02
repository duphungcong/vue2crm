<template>
  <v-container fluid grid-list-sm>
    <v-layout row wrap>
      <v-flex lg12 md12 sm12 xs12>
        <v-card>
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
          </v-tabs>
          <v-tabs-items v-model="tabs">
            <v-tab-item
              v-for="i in 8"
              :key="i"
              :id="'tab-' + i"
            >
              <v-card class="lighten-4 elevation-0">
                <v-data-table :headers="headers" :items="workpackByTab" :pagination.sync="pagination" expand>
                  <template slot="items" slot-scope="props" class="body-0">
                    <td class="body-0">{{ props.item.wpItem }}</td>
                    <td class="body-0">{{ props.item.taskName }}</td>
                    <td class="body-0">{{ props.item.zone }}</td>
                    <td class="body-0">{{ props.item.taskType }}</td>
                    <td class="body-0">{{ props.item.taskTitle }}</td>
                    <td class="body-0">{{ props.item.zoneDivision }}</td>
                    <td class="body-0">{{ props.item.remarks }}</td>
                    <td class="justify-center layout px-0">
                      <shiftbar></shiftbar>
                    </td>
                  </template>
                </v-data-table>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

import firebase from 'firebase'
import ShiftBar from './ShiftBar.vue'

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
        { text: 'WP ITEM', left: true, value: 'wpItem' },
        { text: 'TASK', left: true, value: 'taskName' },
        { text: 'ZONE', left: true, value: 'zone' },
        { text: 'TYPE', left: true, value: 'taskType' },
        { text: 'TITLE', left: true, value: 'taskTitle' },
        { text: 'ZONE DIVISION', left: true, value: 'zoneDivision' },
        { text: 'REMARKS', left: true, value: 'remarks' }
      ],
      pagination: {
        page: 1,
        totalItems: 0,
        rowsPerPage: 10
      }
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
      firebase.database().ref('workpacks').child(this.checkId).once('value').then(
        (data) => {
          this.workpack = data.val()
          this.workpackByTab = this.workpack.filter(task => task.zoneDivision.includes('100-200-800'))
        },
        (error) => {
          console.log(error)
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
        'tab-8': 'N/A'
      })[tab]

      this.workpackByTab = this.workpack.filter(task => task.zoneDivision.includes(zoneByTab(this.tabs)))
      // this.workpackByTab = this.workpack.filter(task => task.zoneDivision.indexOf(zoneByTab(this.tabs)) > -1)
    }
  },
  components: {
    shiftbar: ShiftBar
  },
  mounted() {
    this.checkId = this.$store.getters.following
    this.loadCheck()
    this.loadWorkpack()
  }
}
</script>

