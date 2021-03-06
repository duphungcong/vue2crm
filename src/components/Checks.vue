<template>
  <v-container fluid grid-list-sm>
    <v-flex xs12>
      <v-card>
        <v-card-title>
          <v-btn fab small dark class="red" @click.native="addCheck">
            <v-icon>add</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-text-field append-icon="search" label="Search" single-line hide-details v-model="search"></v-text-field>
          &nbsp;
        </v-card-title>
        <v-data-table :headers="headers" :items="checks" :search="search" :pagination.sync="pagination">
          <template slot="items" slot-scope="props" class="body-2">
            <td class="body-2">{{ props.item.aircraft.name }}</td>
            <td class="body-2">{{ props.item.name }}</td>
            <td class="body-2">{{ formatDate(props.item.startDate) }}</td>
            <td class="body-2">{{ formatDate(props.item.finishDate) }}</td>
            <td class="body-2">{{ remainDay(props.item.startDate, props.item.finishDate) }}</td>
            <td class="text-xs-right">
              <v-btn icon class="mx-0" @click.native="followCheck(props.item)">
                <v-tooltip bottom>
                  <v-icon color="blue" slot="activator">touch_app</v-icon><span>follow</span>
                </v-tooltip>
              </v-btn>
              <v-btn icon class="mx-0" @click.native="editCheck(props.item)">
                <v-tooltip bottom>
                    <v-icon color="blue" slot="activator">edit</v-icon><span>edit</span>
                </v-tooltip>
              </v-btn>
              <v-btn icon class="mx-0" @click.native="dialogDelete = true, deletedCheckId = props.item.id">
                <v-tooltip bottom>
                    <v-icon color="red" slot="activator">delete</v-icon><span>delete</span>
                </v-tooltip>
              </v-btn>
            </td>
          </template>
          <v-alert slot="no-results" :value="true" color="error" icon="warning">
            Your search for "{{ search }}" found no results.
          </v-alert>
        </v-data-table>
      </v-card>
    </v-flex>
    <loading-progress></loading-progress>
    <v-dialog v-model="dialogDelete" persistent max-width="290">
      <v-card>
        <v-card-title>Do you want to delete the check?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue" flat @click.native="dialogDelete = false, deletedCheckId = ''">No</v-btn>
          <v-btn color="red" flat @click.native="dialogDelete =  false, deleteCheck(deletedCheckId)">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>

import firebase from 'firebase'

export default {
  name: 'Checks',
  data () {
    return {
      search: '',
      pagination: {
        page: 1,
        totalItems: 0,
        rowsPerPage: 10,
        sortBy: 'startDate',
        descending: true
      },
      headers: [
        { text: 'Aircraft', left: true, value: 'aircraft.name' },
        { text: 'Name', left: true, value: 'name' },
        { text: 'From', left: true, value: 'startDate' },
        { text: 'To', left: true, value: 'finishDate' },
        { text: 'Status', left: true, value: '' },
        { text: '', sortable: false, value: '' }
      ],
      checks: [],
      dialogDelete: false,
      deletedCheckId: ''
    }
  },
  methods: {
    loadChecks() {
      this.$store.dispatch('beginLoading')
      firebase.database().ref('checks').once('value').then(
        (data) => {
          const obj = data.val()
          for (let key in obj) {
            this.checks.push({
              id: key,
              aircraft: obj[key].aircraft,
              name: obj[key].name,
              startDate: obj[key].startDate,
              finishDate: obj[key].finishDate
            })
          }
          this.$store.dispatch('endLoading')
        },
        (error) => {
          console.log(error)
          this.$store.dispatch('endLoading')
        }
      )
    },
    addCheck() {
      this.$router.push('newcheck')
    },
    editCheck(item) {
      this.$router.push({ name: 'EditCheck', params: { id: item.id } })
    },
    deleteCheck() {
      let removes = {}
      removes['/checks/' + this.deletedCheckId] = null
      removes['/workpacks/' + this.deletedCheckId] = null
      removes['/nrcs/' + this.deletedCheckId] = null
      removes['/spares/' + this.deletedCheckId] = null
      removes['/taskLogs/' + this.deletedCheckId] = null
      removes['/nrcLogs/' + this.deletedCheckId] = null
      removes['/groups/' + this.deletedCheckId] = null
      firebase.database().ref().update(removes).then(
        (data) => {
          this.checks = this.checks.filter(element => element.id !== this.deletedCheckId)
          this.deletedCheckId = ''
        },
        (error) => {
          this.deletedCheckId = ''
          console.log(error)
        }
      )
    },
    followCheck(item) {
      this.$store.dispatch('setFollowing', item.id)
    },
    formatDate(dateStr) {
      let date = new Date(dateStr)
      return date.toDateString()
    },
    remainDay(startDate, finishDate) {
      let start = new Date(startDate)
      let finish = new Date(finishDate)
      let today = Date.now(7)
      let diff1 = new Date(start - today)
      let diff2 = new Date(finish - today)
      if (diff1 > 0) {
        let remain1 = diff1.getUTCDate() - 1
        return remain1 + ' days to start'
      }
      if (diff2 > 0) {
        let remain2 = diff2.getUTCDate()
        return remain2 + ' days to finish'
      }
      return 'completed'
    }
  },
  mounted() {
    this.loadChecks()
  }
}
</script>

