<template>
  <v-container fluid grid-list-sm>
    <v-flex sx12>
      <v-card>
        <v-card-actions>
          <v-layout row wrap px-2>
            <v-flex xs12 sm3 md3>
              <v-text-field append-icon="search" label="Search" single-line hide-details v-model="search"></v-text-field>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex xs12 sm3 md3>
              <v-btn @click.native="exportSparesList()" class="blue white--text">Export to Excel
                <v-icon dark right>file_download</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
        </v-card-actions>
        <v-data-table
          :items="sparesList"
          item-key="pn"
          :headers="headerSpare"
          :pagination.sync="paginationSpare"
          :search="search">
          <template slot="items" slot-scope="props">
            <td class="boyd-0" @click="props.expanded = !props.expanded">{{ props.item.number }}</td>
            <td class="boyd-0" @click="props.expanded = !props.expanded">{{ props.item.nrcNumber }}</td>
            <td class="boyd-0" @click="props.expanded = !props.expanded">{{ props.item.description }}</td>
            <td class="boyd-0" @click="props.expanded = !props.expanded">{{ props.item.pn }}</td>
            <td class="boyd-0" @click="props.expanded = !props.expanded">{{ props.item.quantity }}</td>
            <td class="boyd-0" @click="props.expanded = !props.expanded" :class="priorityColor(props.item.priority)">{{ props.item.priority }}</td>
            <td class="boyd-0" @click="props.expanded = !props.expanded"><v-icon color="blue">{{ statusToIcon(props.item.status) }}</v-icon></td>
            <td class="boyd-0" @click="props.expanded = !props.expanded">{{ props.item.estDate || 'NIL' }}</td>
            <td class="boyd-0" @click="props.expanded = !props.expanded">{{ props.item.notes || 'NIL'}}</td>
            <td class="body-0">
              <v-menu bottom right>
                <v-btn icon class="mx-0" slot="activator">
                  <v-tooltip bottom>
                    <v-icon color="blue" slot="activator">edit</v-icon><span>quick edit</span>
                  </v-tooltip>
                </v-btn>
                <v-list>
                  <v-list-tile v-for="status in spareStatusSelection" :key="status" @click="updateStatus(props.item, status)">
                    <v-list-tile-title v-text="status"></v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
              <v-menu
                lazy
                transition="scale-transition"
                offset-y
                :nudge-right="40"
                min-width="290px">
                <v-btn icon class="mx-0" slot="activator">
                  <v-tooltip bottom>
                    <v-icon color="blue" slot="activator">today</v-icon><span>est date</span>
                  </v-tooltip>
                </v-btn>
                <v-date-picker v-model="props.item.estDate" @change="updateEstDate(props.item)"></v-date-picker>
              </v-menu>
            </td>
          </template>
          <template slot="expand" slot-scope="props">
              <v-card flat color="blue lighten-5" class="elevation-0">
                <v-card-actions>
                  <v-btn icon class="mx-0" @click="editSpare(props.item)">
                    <v-tooltip bottom>
                      <v-icon color="blue" slot="activator">edit</v-icon><span>edit</span>
                    </v-tooltip>
                  </v-btn>
                </v-card-actions>
                <v-card-text>
                  <p>Req Date: <strong>{{ props.item.reqDate }}</strong></p>
                  <p>Due Date: <strong>{{ props.item.dueDate }}</strong></p>
                </v-card-text>
              </v-card>
          </template>
        </v-data-table>
      </v-card>
    </v-flex>
    <v-dialog v-model="dialogEditSpare" persistent max-width="600">
      <v-card>
        <v-card-title class="blue darken-1">
          <h4 class="white--text">Edit Spare</h4>
        </v-card-title>
        <v-card-text>
          <v-layout row wrap align-baseline>
            <v-flex xs12>
              NRC {{ editedSpare.nrcNumber }}
            </v-flex>
          </v-layout>
          <v-layout row wrap align-baseline>
            <v-flex xs6>
              <v-text-field label="RQF" mask="AA  ########" counter="12" v-model="editedSpare.number"></v-text-field>
            </v-flex>
            <v-flex xs1></v-flex>
            <v-flex xs5>
              <v-text-field label="P/N" v-model="editedSpare.pn"></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row wrap align-baseline>
            <v-flex xs6>
              <v-text-field label="Description" v-model="editedSpare.description"></v-text-field>
            </v-flex>
            <v-flex xs1></v-flex>
            <v-flex xs5>
              <v-text-field label="Qty" v-model="editedSpare.quantity" type="number"></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row wrap align-baseline>
            <v-flex xs6>
              <v-select label="Priority" :items="prioritySelection" v-model="editedSpare.priority"></v-select>
            </v-flex>
            <v-flex xs1></v-flex>
            <v-flex xs5>
              <v-select label="Status" :items="spareStatusSelection" v-model="editedSpare.status"></v-select>
            </v-flex>
          </v-layout>
          <v-layout row wrap align-baseline>
            <v-flex xs6>
              <v-menu
                lazy
                :close-on-content-click="true"
                transition="scale-transition"
                offset-y
                full-width
                :nudge-right="40"
                min-width="290px"
              >
                <v-text-field
                  slot="activator"
                  label="Req date"
                  v-model="editedSpare.reqDate"
                  prepend-icon="event"
                  readonly
                ></v-text-field>
                <v-date-picker v-model="editedSpare.reqDate"></v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs6>
              <v-menu
                lazy
                :close-on-content-click="true"
                transition="scale-transition"
                offset-y
                full-width
                :nudge-right="40"
                min-width="290px"
              >
                <v-text-field
                  slot="activator"
                  label="Due date"
                  v-model="editedSpare.dueDate"
                  prepend-icon="event"
                  readonly
                ></v-text-field>
                <v-date-picker v-model="editedSpare.dueDate"></v-date-picker>
              </v-menu>
            </v-flex>
          </v-layout>
          <v-layout row wrap align-baseline>
            <v-flex xs12>
              <v-menu
                lazy
                :close-on-content-click="true"
                transition="scale-transition"
                offset-y
                full-width
                :nudge-right="40"
                min-width="290px"
              >
                <v-text-field
                  slot="activator"
                  label="Req date"
                  v-model="editedSpare.estDate"
                  prepend-icon="event"
                  readonly
                ></v-text-field>
                <v-date-picker v-model="editedSpare.estDate"></v-date-picker>
              </v-menu>
            </v-flex>
          </v-layout>
          <v-flex xs12>
            <v-text-field label="Note" v-model="editedSpare.notes" required multi-line rows="2"></v-text-field>
          </v-flex>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue" flat @click.native="closeEditSpare()">Cancel</v-btn>
          <v-btn color="blue" flat @click.native="saveEditSpare()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <loading-progress></loading-progress>
  </v-container>
</template>

<script>

import firebase from 'firebase'
import XLSX from 'xlsx'

export default {
  name: 'Spares',
  data () {
    return {
      checkId: null,
      sparesList: [],
      spareStatusSelection: this.constUtil.spareStatusSelection,
      prioritySelection: this.constUtil.prioritySelection,
      paginationSpare: {
        page: 1,
        totalItems: 0,
        rowsPerPage: 10,
        sortBy: 'number',
        descending: true
      },
      headerSpare: [
        { text: 'RQF', left: true, value: 'number' },
        { text: 'NRC', left: true, value: 'nrcNumber' },
        { text: 'DESCRIPTION', left: true, value: 'description' },
        { text: 'P/N', left: true, value: 'pn' },
        { text: 'QTY', left: true, value: 'quantity' },
        { text: 'PRI', left: true, value: 'priority' },
        { text: 'STATUS', left: true, value: 'status' },
        { text: 'EST DATE', left: true, value: 'estDate' },
        { text: 'NOTES', left: true, value: 'notes' },
        { text: 'ACTIONS', sortable: false, value: '' }
      ],
      editedSpare: {},
      dialogEditSpare: false,
      search: ''
    }
  },
  methods: {
    loadSpares() {
      this.$store.dispatch('beginLoading')
      firebase.database().ref('spares/' + this.checkId).on('value',
      (data) => {
        const obj = data.val()
          if (obj !== null && obj !== undefined) {
            this.sparesList = Object.values(data.val()) || []
          } else {
            this.sparesList = []
          }
        this.sparesList.sort((a, b) => {
          return a.nrcNumber - b.nrcNumber || a.reqDate - b.reqDate
        })
        this.$store.dispatch('endLoading')
      },
      (error) => {
        console.log(error)
        this.$store.dispatch('endLoading')
      })
    },
    editSpare(item) {
      this.editedSpare = Object.assign({}, item)
      this.dialogEditSpare = true
    },
    closeEditSpare() {
      this.dialogEditSpare = false
      setTimeout(() => {
        this.editedSpare = {}
      }, 300)
    },
    saveEditSpare() {
      const rootComponent = this.appUtil.getRootComponent(this)
      firebase.database().ref('spares/' + this.checkId + '/' + this.editedSpare.id).update(this.editedSpare).then(
        (data) => {
          rootComponent.openSnackbar('Success', 'success')
        },
        (error) => {
          // console.log(error)
          rootComponent.openSnackbar(error, 'error')
        }
      )
      this.closeEditSpare()
    },
    updateStatus(item, status) {
      const rootComponent = this.appUtil.getRootComponent(this)
      let updates = {}
      updates['/spares/' + this.checkId + '/' + item.id + '/status'] = status
      firebase.database().ref().update(updates).then(
         (data) => {
          item.status = status
          rootComponent.openSnackbar('Success', 'success')
        },
        (error) => {
          // console.log(error)
          rootComponent.openSnackbar(error, 'error')
        }
      )
    },
    updateEstDate(item) {
      const rootComponent = this.appUtil.getRootComponent(this)
      let updates = {}
      updates['/spares/' + this.checkId + '/' + item.id + '/estDate'] = item.estDate
      firebase.database().ref().update(updates).then(
         (data) => {
          rootComponent.openSnackbar('Success', 'success')
        },
        (error) => {
          // console.log(error)
          rootComponent.openSnackbar(error, 'error')
        }
      )
    },
    priorityColor(priority) {
      if (priority === 'AOG') {
        return 'red--text body-1'
      }
    },
    statusToIcon(itemStatus) {
      const iconByStatus = (status) => ({
        'avail': 'check_circle',
        'notYet': 'directions_bike',
        'issued': 'people',
        'cancel': 'remove_circle_outline'
      })[status]
      return iconByStatus(itemStatus)
    },
    exportSparesList() {
      let exportedSparesList = []
      this.sparesList.forEach((element) => {
        let item = {
          RQF: element.number,
          NRC: element.nrc,
          DESCRIPTION: element.description,
          PN: element.pn,
          QTY: element.quantity,
          PRI: element.priority,
          STATUS: element.status,
          EST_DATE: element.estDate
        }
        exportedSparesList.push(item)
      })
      // console.log(exportedWorkpack)
      let worksheet = XLSX.utils.json_to_sheet(Object.assign([], exportedSparesList))
      // console.log(worksheet)
      let workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'SPARES')
      // // console.log(workbook)
      XLSX.writeFile(workbook, 'SPARES.xlsx')
    }
  },
  mounted() {
    this.checkId = this.$store.getters.following
    this.loadSpares()
  }
}
</script>

