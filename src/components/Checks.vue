<template>
  <v-container fluid grid-list-sm>
      <v-flex xs12>
        <v-card>
          <v-card-title>
            <h3>List of checks</h3>
            <v-spacer></v-spacer>
            <v-btn fab small dark class="blue" @click.native.stop="rightDrawer = !rightDrawer">
              <v-icon>search</v-icon>
            </v-btn>
            &nbsp;
            <v-btn fab small dark class="red" @click.native="addCheck">
              <v-icon>add</v-icon>
            </v-btn>
          </v-card-title>
            <v-data-table v-bind:headers="headers" v-bind:items="checks" v-bind:search="search" v-bind:pagination.sync="pagination">
              <template slot="items" slot-scope="props" class="body-2">
                <td class="body-2">{{ props.item.aircraft }}</td>
                <td class="body-2">{{ props.item.name }}</td>
                <td class="body-2">{{ props.item.startDate }}</td>
                <td class="body-2">{{ props.item.finishDate }}</td>
                <td class="text-xs-right">
                  <v-btn icon class="mx-0" @click.native="followCheck(props.item)">
                    <v-icon color="green">touch_app</v-icon>
                  </v-btn>
                  <v-btn icon class="mx-0" @click.native="shiftManagement(props.item)">
                    <v-icon color="green">sort</v-icon>
                  </v-btn>
                  <v-btn icon class="mx-0" @click.native="taskManagement(props.item)">
                    <v-icon color="green">assignment</v-icon>
                  </v-btn>
                  <v-btn icon class="mx-0" @click.native="editCheck(props.item)">
                    <v-icon color="green">edit</v-icon>
                  </v-btn>
                  <v-btn icon class="mx-0" @click.native="removeCheck(props.item)">
                    <v-icon color="red">delete</v-icon>
                  </v-btn>
                </td>
              </template>
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
    shiftManagement(item) {
      this.$router.push({ name: 'Shifts', params: { id: item.id } })
    },
    followCheck(item) {
      this.$store.dispatch('setFollowing')
    }
  },
  mounted() {
    this.loadChecks()
  }
}
</script>

