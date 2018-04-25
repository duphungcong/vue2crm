<template>
  <v-container fluid grid-list-sm>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card>
          <v-layout row wrap>
            <v-flex xs6>
              <doughnut ref="taskChart" :data="taskDataChart"></doughnut>
            </v-flex>
            <v-flex xs6>
              <p><strong>TASK OVERVIEW</strong></p>
              <p>Total: <strong>{{ taskData.total }}</strong></p>
              <p>Done: <strong>{{ taskData.done }}</strong></p>
              <p>InProgress: <strong>{{ taskData.inProgress }}</strong></p>
              <p>Take Out: <strong>{{ taskData.out }}</strong></p>
              <p>Not Yet: <strong>{{ taskData.notYet }}</strong></p>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
    
    <v-layout row wrap>
      <v-flex xs12>
        <v-card>
          <v-layout row wrap>
            <v-flex xs6>
              <doughnut ref="nrcChart" :data="nrcDataChart"></doughnut>
            </v-flex>
            <v-flex xs6>
              <p><strong>NRC OVERVIEW</strong></p>
              <p>Total: <strong>{{ nrcData.total }}</strong></p>
              <p>Done: <strong>{{ nrcData.done }}</strong></p>
              <p>InProgress: <strong>{{ nrcData.inProgress }}</strong></p>
              <p>Take Out: <strong>{{ nrcData.out }}</strong></p>
              <p>Not Yet: <strong>{{ nrcData.notYet }}</strong></p>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
    <loading-progress></loading-progress>
  </v-container>
</template>

<script>

import firebase from 'firebase'
import Doughnut from './chart/Doughnut'

export default {
  name: 'Dashboard',
  data () {
    return {
      checkId: null,
      taskData: {
        total: '',
        done: '',
        inProgress: '',
        notYet: '',
        out: ''
      },
      nrcData: {
        total: '',
        done: '',
        inProgress: '',
        notYet: '',
        out: ''
      },
      workpack: [],
      nrcList: [],
      taskDataChart: {
        labels: ['Done', 'InProgress', 'Takeout', 'NotYet'],
        datasets: [
        {
          backgroundColor: [
            '#4CAF50',
            '#F9A825',
            '#607D8B',
            '#BDBDBD'
          ],
          data: []
        }]
      },
      nrcDataChart: {
        labels: ['Done', 'InProgress', 'Takeout', 'NotYet'],
        datasets: [
        {
          backgroundColor: [
            '#4CAF50',
            '#F9A825',
            '#607D8B',
            '#BDBDBD'
          ],
          data: []
        }]
      }
    }
  },
  methods: {
    loadWorkpack() {
      this.$store.dispatch('beginLoading')
      firebase.database().ref('workpacks/' + this.checkId).on('value',
        (data) => {
          this.workpack = data.val()
          this.taskData.total = this.workpack.length
          this.taskData.done = this.workpack.filter(element => element.status === 'done').length
          this.taskData.inProgress = this.workpack.filter(element => element.status === 'inProgress').length
          this.taskData.notYet = this.workpack.filter(element => element.status === 'notYet').length
          this.taskData.out = this.workpack.filter(element => element.status === 'out').length
          let arr = [
            this.taskData.done,
            this.taskData.inProgress,
            this.taskData.out,
            this.taskData.notYet
          ]
          // console.log(arr)
          this.taskDataChart.datasets[0].data = arr
          this.$refs.taskChart.update()
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
          this.nrcData.total = this.nrcList.length
          this.nrcData.done = this.nrcList.filter(element => element.status === 'done').length
          this.nrcData.inProgress = this.nrcList.filter(element => element.status === 'inProgress').length
          this.nrcData.notYet = this.nrcList.filter(element => element.status === 'notYet').length
          this.nrcData.out = this.nrcList.filter(element => element.status === 'out').length
          let arr = [
            this.nrcData.done,
            this.nrcData.inProgress,
            this.nrcData.out,
            this.nrcData.notYet
          ]
          // console.log(arr)
          this.nrcDataChart.datasets[0].data = arr
          this.$refs.nrcChart.update()
          this.$store.dispatch('endLoading')
        },
        (error) => {
          console.log(error)
          this.$store.dispatch('endLoading')
        }
      )
    }
  },
  components: {
    doughnut: Doughnut
  },
  mounted() {
    this.checkId = this.$store.getters.following
    this.loadWorkpack()
    this.loadNRC()
  }
}
</script>

