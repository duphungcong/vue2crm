<template>
  <v-container fluid grid-list-sm>
    <v-card class="lighten-4 elevation-0">
      <v-data-table :headers="headers" :items="check.workpack" expand>
        <template slot="items" slot-scope="props" class="body-0">
          <td class="body-0">{{ props.item.WP_ITEM }}</td>
          <td class="body-0">{{ props.item.TASKNAME }}</td>
          <td class="body-0">{{ props.item.ZONE }}</td>
          <td class="body-0">{{ props.item.TASKTYPE }}</td>
          <td class="body-0">{{ props.item.TASKTITLE }}</td>
          <td class="body-0">{{ props.item['AMS MH'] }}</td>
          <td class="body-0">{{ props.item['MAC MH'] }}</td>
          <td class="body-0">{{ props.item.MEN }}</td>
          <td class="body-0">{{ props.item.HOUR }}</td>
          <td class="body-0">{{ props.item.ZONEDIVISION }}</td>
          <td class="body-0">{{ props.item.REMARKS }}</td>
          <td class="justify-center layout px-0">
            <v-btn icon class="mx-0" @click="editItem(props.item)">
              <v-icon color="teal">edit</v-icon>
            </v-btn>
            <v-btn icon class="mx-0" @click="linkItem(props.item)" :disabled="!props.item.TASKNAME.includes('VN ')">
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
      check: null,
      headers: [
        { text: 'WP ITEM', left: true, value: 'WP_ITEM' },
        { text: 'TASK', left: true, value: 'TASKNAME' },
        { text: 'ZONE', left: true, value: 'ZONE' },
        { text: 'TYPE', left: true, value: 'TASKTYPE' },
        { text: 'TITLE', left: true, value: 'TASKTITLE' },
        { text: 'AMS MH', left: true, value: 'AMS MH' },
        { text: 'MAC MH', left: true, value: 'MAC MH' },
        { text: 'MEN', left: true, value: 'MEN' },
        { text: 'HOUR', left: true, value: 'HOUR' },
        { text: 'ZONE DIVISION', left: true, value: 'ZONEDIVISION' },
        { text: 'REMARK', left: true, value: 'REMARKS' }
      ],
      itemIndex: -1,
      defaultItem: {
        'AMS MH': 0,
        'MAC MH': 0,
        MEN: 0,
        HOUR: 0,
        ZONEDIVISION: 'N/A',
        REMARKS: 'NIL'
      },
      editedItem: {},
      linkedItem: {}
    }
  },
  methods: {
    loadCheckById(id) {
      this.checkId = id
      firebase.database().ref('checks').once('value').then(
        (data) => {
          const obj = data.val()
          for (let key in obj) {
            if (key === this.checkId) {
              this.check = obj[key]
              return
            }
          }
        },
        (error) => {
          console.log(error)
        }
      )
    }
  },
  mounted() {
    this.loadCheckById(this.$route.params.id)
  }
}
</script>