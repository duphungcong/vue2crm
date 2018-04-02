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
            <v-data-table :headers="headers" :items="checks" :search="search" v-bind:pagination.sync="pagination">
              <template slot="items" slot-scope="props" class="body-2">
                <td class="body-2">{{ props.item.aircraft }}</td>
                <td class="body-2">{{ props.item.name }}</td>
                <td class="body-2">{{ props.item.startDate }}</td>
                <td class="body-2">{{ props.item.finishDate }}</td>
                <td class="text-xs-right">
                  <v-btn icon class="mx-0" @click.native="followCheck(props.item)">
                    <v-tooltip bottom>
                      <v-icon color="green" slot="activator">touch_app</v-icon><span>follow</span>
                    </v-tooltip>
                  </v-btn>
                  <v-btn icon class="mx-0" @click.native="editCheck(props.item)">
                    <v-tooltip bottom>
                       <v-icon color="green" slot="activator">edit</v-icon><span>edit</span>
                    </v-tooltip>
                  </v-btn>
                  <v-btn icon class="mx-0" @click.native="removeCheck(props.item)">
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
        rowsPerPage: 10
      },
      headers: [
        { text: 'Aircraft', left: true, value: 'aircraft' },
        { text: 'Name', left: true, value: 'name' },
        { text: 'From', left: true, value: 'startDate' },
        { text: 'To', left: true, value: 'finishDate' },
        { text: '', sortable: false, value: '' }
      ],
      checks: []
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
    followCheck(item) {
      this.$store.dispatch('setFollowing', item.id)
    }
  },
  mounted() {
    this.loadChecks()
  }
}
</script>

