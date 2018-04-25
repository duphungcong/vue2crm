<template>
  <v-container fluid grid-list-sm>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card>
          <v-card-title>
            Task Cards
          </v-card-title>
          <v-card-text>
            <p>Total: <strong>{{ taskOverview.total }}</strong></p>
            <p>Done: <strong>{{ taskOverview.done }}</strong></p>
            <p>InProgress: <strong>{{ taskOverview.inProgress }}</strong></p>
            <p>Not Yet: <strong>{{ taskOverview.notYet }}</strong></p>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12>
        <v-card>
          <v-card-title>
            NRC
          </v-card-title>
          <v-card-text>
            <p>Total: <strong>{{ nrcOverview.total }}</strong></p>
            <p>Done: <strong>{{ nrcOverview.done }}</strong></p>
            <p>InProgress: <strong>{{ nrcOverview.inProgress }}</strong></p>
            <p>Not Yet: <strong>{{ nrcOverview.notYet }}</strong></p>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

import firebase from 'firebase'

export default {
  name: 'Dashboard',
  data () {
    return {
      checkId: null,
      taskOverview: {
        total: '',
        done: '',
        inProgress: '',
        notYet: ''
      },
      nrcOverview: {
        total: '',
        done: '',
        inProgress: '',
        notYet: ''
      },
      workpack: [],
      nrcList: []
    }
  },
  methods: {
    loadWorkpack() {
      this.$store.dispatch('beginLoading')
      firebase.database().ref('workpacks/' + this.checkId).on('value',
        (data) => {
          this.workpack = data.val()
          this.taskOverview.total = this.workpack.length
          this.taskOverview.done = this.workpack.filter(element => element.status === 'done').length
          this.taskOverview.inProgress = this.workpack.filter(element => element.status === 'inProgress' || element.status === 'out').length
          this.taskOverview.notYet = this.workpack.filter(element => element.status === 'notYet').length
          this.$store.dispatch('endLoading')
        },
        (error) => {
          console.log(error)
          this.$store.dispatch('endLoading')
        }
      )
    },
    loadNRC() {
      this.$store.dispatch('beginLoading')
      firebase.database().ref('nrcs/' + this.checkId).on('value',
        (data) => {
          this.nrcList = Object.values(data.val()) || []
          this.nrcOverview.total = this.nrcList.length
          this.nrcOverview.done = this.nrcList.filter(element => element.status === 'done').length
          this.nrcOverview.inProgress = this.nrcList.filter(element => element.status === 'inProgress' || element.status === 'out').length
          this.nrcOverview.notYet = this.nrcList.filter(element => element.status === 'notYet').length
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
    this.loadWorkpack()
    this.loadNRC()
  }
}
</script>

