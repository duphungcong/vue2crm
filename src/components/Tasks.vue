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
          </v-tabs>
          <v-tabs-items v-model="tabs">
            <v-tab-item
              v-for="i in 8"
              :key="i"
              :id="'tab-' + i"
            >
              <v-data-table
              :headers="headers"
              :items="workpackByTab"
              :pagination.sync="pagination"
              >
              <template slot="items" slot-scope="props">
                <td class="body-0">{{ props.item.taskTitle }}</td>
                <td class="body-0"><v-chip v-for="shift in props.item.shifts" :key="shift.number" label color="primary" text-color="white">{{ shift.number }}</v-chip></td>
                <td class="body-0">{{ props.item.taskName }}</td>
                <td class="body-0">{{ props.item.zone }}</td>
                <td class="body-0">{{ props.item.taskType }}</td>
                <td class="body-0">{{ props.item.zoneDivision }}</td>
                <td class="justify-center layout px-0">
                </td>
              </template>
            </v-data-table>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-flex>
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
        { text: 'TASK', left: true, value: 'taskName' },
        { text: 'ZONE', left: true, value: 'zone' },
        { text: 'TYPE', left: true, value: 'taskType' },
        { text: 'ZONE DIVISION', left: true, value: 'zoneDivision' }
      ],
      pagination: {
        page: 1,
        totalItems: 0,
        rowsPerPage: 10,
        sortBy: 'zoneDivision'
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
        'tab-8': 'N/A'
      })[tab]
      this.$store.dispatch('beginLoading')
      // this.workpackByTab = this.workpack.filter(task => task.zoneDivision.includes(zoneByTab(this.tabs)))
      this.workpackByTab = this.workpack.filter(task => task.zoneDivision.indexOf(zoneByTab(this.tabs)) === 0)
      this.$store.dispatch('endLoading')
    }
  },
  mounted() {
    this.checkId = this.$store.getters.following
    this.loadCheck()
    this.loadWorkpack()
  }
}
</script>

