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
      taskData: {},
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
          let scanWorkpack = {
            done: 0,
            inProgress: 0,
            out: 0,
            notYet: 0
          }
          this.workpack.forEach(element => {
            if (element.status === 'notYet') {
              scanWorkpack.notYet++
              return
            }
            if (element.status === 'inProgress') {
              scanWorkpack.inProgress++
              return
            }
            if (element.status === 'done') {
              scanWorkpack.done++
              return
            }
            if (element.status === 'out') {
              scanWorkpack.out++
              return
            }
          })
          // console.log(scanWorkpack)
          this.taskData = Object.assign({}, scanWorkpack)
          this.taskDataChart.datasets[0].data = Object.values(this.taskData)
          this.$refs.taskChart.update()
          this.taskData.total = this.workpack.length
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
          let scanNRCList = {
            done: 0,
            inProgress: 0,
            out: 0,
            notYet: 0
          }
          this.nrcList.forEach(element => {
            if (element.status === 'notYet') {
              scanNRCList.notYet++
              return
            }
            if (element.status === 'inProgress') {
              scanNRCList.inProgress++
              return
            }
            if (element.status === 'done') {
              scanNRCList.done++
              return
            }
            if (element.status === 'out') {
              scanNRCList.out++
              return
            }
          })
          // console.log(scanNRCList)
          this.nrcData = Object.assign({}, scanNRCList)
          this.nrcDataChart.datasets[0].data = Object.values(this.nrcData)
          this.$refs.nrcChart.update()
          this.nrcData.total = this.nrcList.length
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

