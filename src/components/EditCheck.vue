<template>
  <v-container fluid grid-list-sm>
    <v-card class="lighten-4 elevation-0">
      <v-data-table :headers="headers" :items="workpack" expand :pagination.sync="pagination">
        <template slot="items" slot-scope="props" class="body-0">
          <td class="body-0">{{ props.item.wpItem }}</td>
          <td class="body-0">{{ props.item.taskName }}</td>
          <td class="body-0">{{ props.item.zone }}</td>
          <td class="body-0">{{ props.item.taskType }}</td>
          <td class="body-0">{{ props.item.taskTitle }}</td>
          <td class="body-0">{{ props.item.amsMH }}</td>
          <td class="body-0">{{ props.item.macMH }}</td>
          <td class="body-0">{{ props.item.men }}</td>
          <td class="body-0">{{ props.item.hour }}</td>
          <td class="body-0">{{ props.item.zoneDivision }}</td>
          <td class="body-0">{{ props.item.remarks }}</td>
          <td class="justify-center layout px-0">
            <v-btn icon class="mx-0" @click="editItem(props.item)">
              <v-icon color="teal">edit</v-icon>
            </v-btn>
            <v-btn icon class="mx-0" @click="linkItem(props.item)" :disabled="!props.item.taskName.includes('VN ')">
              <v-icon color="teal">link</v-icon>
            </v-btn>
          </td>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import firebase from 'firebase'
export default {
  name: 'EditCheck',
  data () {
    return {
      checkId: null,
      check: {},
      workpack: [],
      pagination: {
        page: 1,
        totalItems: 0,
        rowsPerPage: 10
      },
      headers: [
        { text: 'WP ITEM', left: true, value: 'wpItem' },
        { text: 'TASK', left: true, value: 'taskName' },
        { text: 'zone', left: true, value: 'zone' },
        { text: 'TYPE', left: true, value: 'taskType' },
        { text: 'TITLE', left: true, value: 'taskTitle' },
        { text: 'AMS MH', left: true, value: 'amsMH' },
        { text: 'MAC MH', left: true, value: 'macMH' },
        { text: 'MEN', left: true, value: 'men' },
        { text: 'HOUR', left: true, value: 'hour' },
        { text: 'zone DIVISION', left: true, value: 'zoneDivision' },
        { text: 'REMARK', left: true, value: 'remarks' }
      ],
      itemIndex: -1,
      defaultItem: {
        amsMH: 0,
        macMH: 0,
        men: 0,
        hour: 0,
        zoneDivision: 'N/A',
        remarks: 'NIL'
      },
      editedItem: {},
      linkedItem: {}
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
    loadWorkPack() {
      firebase.database().ref('workpacks').child(this.checkId).once('value').then(
        (data) => {
          this.workpack = data.val()
        },
        (error) => {
          console.log(error)
        }
      )
    }
  },
  mounted() {
    this.checkId = this.$route.params.id
    this.loadCheck()
    this.loadWorkPack()
  }
}
</script>