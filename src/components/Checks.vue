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
            <v-btn fab small dark class="red" @click.native="add">
              <v-icon>add</v-icon>
            </v-btn>
          </v-card-title>
            <v-data-table v-bind:headers="headers" v-bind:items="checks" v-bind:search="search" v-bind:pagination.sync="pagination">
              <template slot="items" slot-scope="props" class="body-2">
                <td class="body-2">{{ props.item.aircraft }}</td>
                <td class="text-xs-left">{{ props.item.name }}</td>
                <td class="text-xs-right">
                  <v-btn fab small dark class="green" @click.native="divideZone(props.item)">
                    <v-icon>edit</v-icon>
                  </v-btn>
                  <v-btn fab small dark class="teal" @click.native="edit(props.item)">
                    <v-icon>edit</v-icon>
                  </v-btn>
                  <v-btn fab small class="cyan" @click.native="remove(props.item)">
                    <v-icon>delete</v-icon>
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
        headers: [{
          text: 'Aircraft',
          left: true,
          value: 'aircraft'
        },
        {
          text: 'Name',
          left: true,
          value: 'name'
        },
        {
          text: '',
          sortable: false,
          value: ''
        }],
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
              name: obj[key].name
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
    add() {
      this.$router.push('newcheck')
    },
    divideZone(item) {
      this.$router.push({ name: 'ZoneDivision', params: { id: item.id } })
    }
  },
  mounted() {
    this.loadChecks()
  }
}
</script>

