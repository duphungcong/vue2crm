<template>
  <v-container fluid>
    <v-flex xs12>
      <v-card class="grey lighten-4 elevation-0">
        <v-card-title>
          {{ title }}
          <v-spacer></v-spacer>
          <v-btn fab small @click.native="cancel()">
            <v-icon>cancel</v-icon>
          </v-btn>
          &nbsp;
          <v-btn fab small class="blue" @click.native="save()">
            <v-icon>save</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-container fluid grid-list-md>
            <v-layout row wrap class="px-10">
              <v-flex md6 xs12>
                <v-text-field name="checkName" label="Check" hint="Check name is required" value="Input text" v-model="check.name"
                  class="input-group--focused" required></v-text-field>
              </v-flex>
              <v-flex md6 xs12>
                <v-select v-bind:items="aircraftList" label="Aircraft" v-model="check.aircraft" item-text="name" item-value="name" class="input-group--focused" required></v-select>
              </v-flex>
              <v-flex md6 xs12>
                Start Date<br>
                <v-date-picker v-model="check.startDate" landscape></v-date-picker>
              </v-flex>
              <v-flex md6 xs12>
                Finish Date<br>
                <v-date-picker v-model="check.finishDate" landscape></v-date-picker>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-container>
</template>

<script>

import firebase from 'firebase'

export default {
  name: 'NewCheck',
  data () {
    return {
      title: '',
      aircraftList: [],
      check: {
        name: '',
        aircraft: '',
        startDate: '',
        finishDate: ''
      }
    }
  },
  methods: {
    save() {
      const check = this.check
      firebase.database().ref('checks').push(check).then(
        (data) => {
          this.$router.push('checks')
        },
        (error) => {
          console.log(error)
        }
      )
    },
    cancel() {
      this.$router.push('checks')
    },
    getAircraftList() {
      firebase.database().ref('aircraft').once('value').then(
        (data) => {
          const obj = data.val()
          for (let key in obj) {
            this.aircraftList.push({
              name: obj[key].name
            })
          }
        },
        (error) => {
          console.log(error)
        }
      )
    }
  },
  mounted() {
    this.getAircraftList()
    this.title = 'New Check'
  }
}
</script>

