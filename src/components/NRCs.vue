<template>
  <v-container fluid grid-list-sm>
    <v-flex sx12>
      <v-card>
        <v-card-actions>
          <v-layout row wrap px-2>
            <v-flex xs12 sm3 md3>
              <v-select v-model="selectedZone" :items="zoneSelection" label="Select zone" clearable></v-select>
            </v-flex>
            <v-flex xs1 sm1 md1></v-flex>
            <v-flex xs12 sm3 md3>
              <v-text-field append-icon="search" label="Search" single-line hide-details v-model="search"></v-text-field>
            </v-flex>
            <v-flex xs2 sm2 md2></v-flex>
            <v-flex xs12 sm3 md3>
              <v-btn @click.native="exportNRCList()" class="blue white--text">Export to Excel
                <v-icon dark right>file_download</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
        </v-card-actions>
        <v-data-table :headers="headerNRC" :items="nrcList" :pagination.sync="paginationNRC" :search="search" item-key="id">
          <template slot="items" slot-scope="props" class="body-0">
            <td class="body-0" @click="props.expanded = !props.expanded"><v-chip :class="statusColor(props.item.status)" label>{{ props.item.number }}</v-chip></td>
            <td class="body-0" @click="props.expanded = !props.expanded" :class="priorityColor(props.item.priority)">{{ props.item.priority }}</td>
            <td class="body-0">
              <v-btn v-if="props.item.spareStatus !== undefined && props.item.spareStatus !== ''" icon class="mx-0" @click.native="showNRCSpares(props.item)">
                <v-tooltip bottom>
                  <v-icon color="blue" slot="activator" v-if="props.item.spareStatus === 'ready'">local_grocery_store</v-icon>
                  <v-icon color="grey darken-2" slot="activator" v-else>local_grocery_store</v-icon><span>spares</span>
                </v-tooltip>
              </v-btn>
              <v-btn v-if="props.item.tars !== undefined && props.item.tars.length !== ''" icon class="mx-0" @click.native="showTAR(props.item)">
                <v-tooltip bottom>
                  <v-icon color="grey darken-2" slot="activator">help</v-icon><span>TAR</span>
                </v-tooltip>
              </v-btn>
            </td>
            <td class="body-0" @click="props.expanded = !props.expanded">{{ props.item.notes }}</td>
            <td class="body-0" @click="props.expanded = !props.expanded">{{ props.item.content }}</td>
            <td class="body-0" @click="props.expanded = !props.expanded">{{ props.item.ref }}</td>
            <td class="body-0" @click="props.expanded = !props.expanded">{{ props.item.zone }}</td>
          </template>
          <template slot="expand" slot-scope="props">
            <v-card flat color="blue lighten-5" class="elevation-0">
              <v-card-actions>
                <v-btn icon class="mx-0" @click="editNRC(props.item)">
                  <v-tooltip bottom>
                    <v-icon color="blue" slot="activator">edit</v-icon><span>edit</span>
                  </v-tooltip>
                </v-btn>
                <v-btn icon class="mx-0" @click.native="orderSpare(props.item)">
                  <v-tooltip bottom>
                    <v-icon color="blue" slot="activator">add_shopping_cart</v-icon><span>order</span>
                  </v-tooltip>
                </v-btn>
                <v-btn icon class="mx-0" @click.native="makeTAR(props.item)">
                  <v-tooltip bottom>
                    <v-icon color="blue" slot="activator">help_outline</v-icon><span>tar</span>
                  </v-tooltip>
                </v-btn>
                <v-btn icon class="mx-0" @click.native="showLog(props.item)">
                  <v-tooltip bottom>
                    <v-icon color="blue" slot="activator">assignment</v-icon><span>log</span>
                  </v-tooltip>
                </v-btn>
              </v-card-actions>
              <v-card-text>
                <p>WO: <strong>{{ props.item.wo }}</strong></p>
              </v-card-text>
            </v-card>
          </template>
        </v-data-table>
      </v-card>
    </v-flex>
    <v-dialog v-model="dialogEditNRC" persistent max-width="600">
      <v-card>
        <v-card-title class="blue darken-1">
          <h4 class="white--text">Edit NRC</h4>
        </v-card-title>
        <v-card-text>
          <v-layout row wrap align-baseline>
            <v-flex xs12>
              NRC {{ editedNRC.number }}
            </v-flex>
          </v-layout>
          <v-layout row wrap align-baseline>
            <v-flex xs6>
              <v-text-field label="W/O" mask="########" counter="8" v-model="editedNRC.wo"></v-text-field>
            </v-flex>
            <v-flex xs1></v-flex>
            <v-flex xs5>
              <v-text-field label="Reference" v-model="editedNRC.ref"></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row wrap align-baseline>
            <v-flex xs6>
              <v-select label="Zone" :items="zoneSelection" v-model="editedNRC.zone"></v-select>
            </v-flex>
            <v-flex xs1></v-flex>
            <v-flex xs5>
              <v-select label="Status" :items="nrcStatusSelection" v-model="editedNRC.status"></v-select>
            </v-flex>
          </v-layout>
          <v-layout row wrap align-baseline>
            <v-flex xs12>
              <v-select label="Priority" :items="prioritySelection" v-model="editedNRC.priority"></v-select>
            </v-flex>
            <v-flex xs12>
              <v-text-field label="Content" v-model="editedNRC.content" required multi-line rows="2"></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field label="Notes" v-model="editedNRC.notes" required multi-line rows="2"></v-text-field>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue" flat @click.native="closeEditNRC()">Cancel</v-btn>
          <v-btn color="blue" flat @click.native="saveEditedNRC()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogOrderSpare" persistent max-width="600">
      <v-card>
        <v-card-title class="blue darken-1">
          <h4 class="white--text">Order Spare</h4>
        </v-card-title>
        <v-card-text>
          <v-layout row wrap align-baseline>
            <v-flex xs12>
              NRC {{ editedNRC.number }}
            </v-flex>
          </v-layout>
          <v-layout row wrap align-baseline>
            <v-flex xs6>
              <v-text-field label="RQF (Ex: HM  01145678)" mask="AA  ########" counter="12" v-model="newOrder.number"></v-text-field>
            </v-flex>
            <v-flex xs1></v-flex>
            <v-flex xs5>
              <v-text-field label="P/N" v-model="newOrder.pn"></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row wrap align-baseline>
            <v-flex xs6>
              <v-text-field label="Description" v-model="newOrder.description"></v-text-field>
            </v-flex>
            <v-flex xs1></v-flex>
            <v-flex xs5>
              <v-text-field label="Qty" v-model="newOrder.quantity" type="number"></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row wrap align-baseline>
            <v-flex xs6>
              <v-select label="Priority" :items="prioritySelection" v-model="newOrder.priority"></v-select>
            </v-flex>
            <v-flex xs1></v-flex>
            <v-flex xs5>
              <v-select label="Status" :items="spareStatusSelection" v-model="newOrder.status"></v-select>
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
                  v-model="newOrder.reqDate"
                  prepend-icon="event"
                  readonly
                ></v-text-field>
                <v-date-picker v-model="newOrder.reqDate"></v-date-picker>
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
                  v-model="newOrder.dueDate"
                  prepend-icon="event"
                  readonly
                ></v-text-field>
                <v-date-picker v-model="newOrder.dueDate"></v-date-picker>
              </v-menu>
            </v-flex>
          </v-layout>
          <v-flex xs12>
            <v-text-field label="Note" v-model="newOrder.notes" required multi-line rows="2"></v-text-field>
          </v-flex>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue" flat @click.native="closeOrderSpare()">Cancel</v-btn>
          <v-btn color="blue" flat @click.native="saveOrderSpare()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogNRCSpares" max-width="1200">
      <v-card class="elevation-0">
        <v-card-title class="blue darken-1">
          <h4 class="white--text">Spares List</h4>
        </v-card-title>
        <v-card-actions>
          <v-switch label="All Ready" v-model="allSparesReady" color="info"></v-switch>
          <v-spacer></v-spacer>
          <v-btn color="blue" flat @click.native="closeNRCSpares()">Close</v-btn>
          <v-btn color="blue" flat @click.native="saveNRCSpares()">Save</v-btn>
        </v-card-actions>
        <v-data-table
          :items="sparesList"
          item-key="pn"
          :headers="headerSpare"
          :pagination.sync="paginationSpare"
          :loading="spareLoading"
          class="elevation-1">
          <template slot="items" slot-scope="props">
            <td class="boyd-0" @click="props.expanded = !props.expanded">{{ props.item.number }}</td>
            <td class="boyd-0" @click="props.expanded = !props.expanded">{{ props.item.description }}</td>
            <td class="boyd-0" @click="props.expanded = !props.expanded">{{ props.item.pn }}</td>
            <td class="boyd-0" @click="props.expanded = !props.expanded" :class="priorityColor(props.item.priority)">{{ props.item.priority }}</td>
            <td class="boyd-0" @click="props.expanded = !props.expanded"><v-icon color="blue">{{ statusToIcon(props.item.status) }}</v-icon></td>
            <td class="boyd-0" @click="props.expanded = !props.expanded">{{ props.item.estDate || 'NIL' }}</td>
            <td class="boyd-0" @click="props.expanded = !props.expanded">{{ props.item.notes || 'NIL'}}</td>
            <td class="body-0">
              <v-menu bottom right>
                <v-btn icon class="mx-0" slot="activator">
                  <v-tooltip bottom>
                    <v-icon color="blue" slot="activator">edit</v-icon><span>status</span>
                  </v-tooltip>
                </v-btn>
                <v-list>
                  <v-list-tile v-for="status in spareStatusSelection" :key="status" @click="props.item.status = status">
                    <v-list-tile-title v-text="status"></v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
              <v-menu
                lazy
                :close-on-content-click="true"
                transition="scale-transition"
                offset-y
                :nudge-right="40"
                min-width="290px">
                <v-btn icon class="mx-0" slot="activator">
                  <v-tooltip bottom>
                    <v-icon color="blue" slot="activator">today</v-icon><span>est date</span>
                  </v-tooltip>
                </v-btn>
                <v-date-picker v-model="props.item.estDate"></v-date-picker>
              </v-menu>
            </td>
          </template>
          <template slot="expand" slot-scope="props">
              <v-card flat color="blue lighten-5" class="elevation-0">
                <v-card-text>
                  <p>Req Date: <strong>{{ props.item.reqDate }}</strong></p>
                  <p>Due Date: <strong>{{ props.item.dueDate }}</strong></p>
                </v-card-text>
              </v-card>
          </template>
        </v-data-table>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogLog" max-width="900">
      <v-card class="elevation-0">
        <v-data-table
          :items="nrcLogs"
          :headers="headerLog"
          :pagination.sync="paginationLog"
          :loading="logLoading"
          class="elevation-1">
          <template slot="items" slot-scope="props">
            <td class="boyd-0">{{ props.item.person }}</td>
            <td class="boyd-0">{{ props.item.action }}</td>
            <td class="boyd-0">{{ props.item.status }}</td>
            <td class="boyd-0">{{ props.item.time }}</td>
            <td class="boyd-0">{{ props.item.notes || 'NIL'}}</td>
          </template>
        </v-data-table>
      </v-card>
    </v-dialog>
    <loading-progress></loading-progress>
  </v-container>
</template>

<script>

import firebase from 'firebase'
import XLSX from 'xlsx'

export default {
  name: 'NRCs',
  data () {
    return {
      checkId: null,
      nrcList: [],
      nrcListBeforeFilter: [],
      nrcLogs: [],
      paginationNRC: {
        page: 1,
        totalItems: 0,
        rowsPerPage: 10,
        sortBy: 'number',
        descending: true
      },
      paginationSpare: {
        page: 1,
        totalItems: 0,
        rowsPerPage: 10,
        sortBy: 'number',
        descending: true
      },
      paginationLog: {
        page: 1,
        totalItems: 0,
        rowsPerPage: 10,
        sortBy: 'time',
        descending: true
      },
      headerNRC: [
        { text: 'NRC', left: true, value: 'number' },
        { text: 'PRI', left: true, value: 'priority' },
        { text: 'INFO', left: true, value: '' },
        { text: 'NOTES', left: true, value: 'notes' },
        { text: 'CONTENT', left: true, value: 'content' },
        { text: 'REF', left: true, value: 'ref' },
        { text: 'ZONE', left: true, value: 'zone' }
      ],
      headerSpare: [
        { text: 'RQF', left: true, value: 'rqf' },
        { text: 'DESCRIPTION', left: true, value: 'description' },
        { text: 'P/N', left: true, value: 'pn' },
        { text: 'PRI', left: true, value: 'priority' },
        { text: 'STATUS', left: true, value: 'status' },
        { text: 'EST DATE', left: true, value: 'estDate' },
        { text: 'NOTES', left: true, value: 'notes' },
        { text: 'ACTIONS', sortable: false, value: '' }
      ],
      headerLog: [
        { text: 'PERSON', left: true, value: 'person' },
        { text: 'ACTION', left: true, value: 'action' },
        { text: 'STATUS', left: true, value: 'status' },
        { text: 'TIME', left: true, value: 'time' },
        { text: 'NOTES', left: true, value: 'notes' }
      ],
      zoneSelection: this.constUtil.zoneSelection,
      prioritySelection: this.constUtil.prioritySelection,
      nrcStatusSelection: this.constUtil.nrcStatusSelection,
      spareStatusSelection: this.constUtil.spareStatusSelection,
      editedNRC: {},
      newOrder: {},
      sparesList: [],
      spareLoading: false,
      dialogEditNRC: false,
      dialogOrderSpare: false,
      dialogNRCSpares: false,
      dialogLog: false,
      logLoading: false,
      selectedZone: null,
      search: '',
      allSparesReady: false
    }
  },
  watch: {
    dialogNRCSpares (newValue, oldValue) {
      if (newValue === false) {
        this.closeNRCSpares()
      }
    },
    selectedZone (newValue, oldValue) {
      this.filterNRC(newValue)
    }
  },
  methods: {
    loadNRC() {
      this.$store.dispatch('beginLoading')
      firebase.database().ref('nrcs/' + this.checkId).on('value',
        (data) => {
          const obj = data.val()
          if (obj !== null && obj !== undefined) {
            this.nrcList = Object.values(data.val()) || []
          } else {
            this.nrcList = []
          }
          this.nrcListBeforeFilter = this.nrcList
          this.$store.dispatch('endLoading')
        },
        (error) => {
          console.log(error)
          this.$store.dispatch('endLoading')
        }
      )
    },
    editNRC(item) {
      this.editedNRC = Object.assign({}, item)
      this.dialogEditNRC = true
    },
    closeEditNRC() {
      this.dialogEditNRC = false
      setTimeout(() => {
        this.editedNRC = {}
      }, 300)
    },
    saveEditedNRC() {
      const rootComponent = this.appUtil.getRootComponent(this)
      firebase.database().ref('nrcs/' + this.checkId + '/' + this.editedNRC.id).update(this.editedNRC).then(
        (data) => {
          rootComponent.openSnackbar('Success', 'success')
        },
        (error) => {
          // console.log(error)
          rootComponent.openSnackbar(error, 'error')
        }
      )
      this.closeEditNRC()
    },
    showNRCSpares(item) {
      this.editedNRC = Object.assign({}, item)
      if (this.editedNRC.spareStatus === 'ready') {
        this.allSparesReady = true
      } else {
        this.allSparesReady = false
      }
      this.spareLoading = true
      firebase.database().ref('spares/' + this.checkId).orderByChild('nrcId').equalTo(this.editedNRC.id).once('value').then(
        (data) => {
          this.sparesList = Object.values(data.val()) || []
          this.spareLoading = false
        },
        (error) => {
          console.log(error)
          this.spareLoading = false
        }
      )
      this.dialogNRCSpares = true
    },
    closeNRCSpares() {
      this.dialogNRCSpares = false
      this.sparesList = []
      setTimeout(() => {
        this.editedNRC = {}
      }, 300)
    },
    saveNRCSpares() {
      if (this.sparesList.length > 0) {
        const rootComponent = this.appUtil.getRootComponent(this)
        if (this.allSparesReady) {
          this.editedNRC.spareStatus = 'ready'
        } else {
          this.editedNRC.spareStatus = 'order'
        }
        let updates = {}
        updates['/nrcs/' + this.checkId + '/' + this.editedNRC.id + '/spareStatus'] = this.editedNRC.spareStatus
        this.sparesList.forEach(element => {
          updates['/spares/' + this.checkId + '/' + element.id] = element
        })
        firebase.database().ref().update(updates).then(
          (data) => {
            rootComponent.openSnackbar('Success', 'success')
          },
          (error) => {
            // console.log(error)
            rootComponent.openSnackbar(error, 'error')
          }
        )
      }
      this.closeNRCSpares()
    },
    showLog(item) {
      this.logLoading = true
      firebase.database().ref('nrcLogs/' + this.checkId).orderByChild('nrcId').equalTo(item.id).once('value').then(
        (data) => {
          let obj = data.val()
          // console.log(obj)
          for (let key in obj) {
            this.nrcLogs.push(obj[key])
          }
          this.logLoading = false
        },
        (error) => {
          console.log(error)
          this.logLoading = false
        }
      )
      this.dialogLog = true
    },
    showTAR(item) {},
    orderSpare(item) {
      this.editedNRC = Object.assign({}, item)
      this.newOrder.priority = this.editedNRC.priority
      this.newOrder.status = 'notYet'
      this.newOrder.estDate = ''
      this.dialogOrderSpare = true
    },
    closeOrderSpare() {
      this.dialogOrderSpare = false
      setTimeout(() => {
        this.newOrder = {}
        this.editedNRC = {}
      }, 300)
    },
    saveOrderSpare() {
      const rootComponent = this.appUtil.getRootComponent(this)
      let updates = {}
      let newSpareKey = firebase.database().ref('spares/' + this.checkId).push().key
      this.newOrder.id = newSpareKey
      this.newOrder.nrcId = this.editedNRC.id
      this.newOrder.nrcNumber = this.editedNRC.number
      updates['/nrcs/' + this.checkId + '/' + this.editedNRC.id + '/spareStatus'] = 'order'
      updates['/spares/' + this.checkId + '/' + newSpareKey] = this.newOrder
      firebase.database().ref().update(updates).then(
        (data) => {
          rootComponent.openSnackbar('Success', 'success')
        },
        (error) => {
          // console.log(error)
          rootComponent.openSnackbar(error, 'error')
        }
      )
      this.closeOrderSpare()
    },
    makeTAR(item) {},
    priorityColor(priority) {
      if (priority === 'AOG') {
        return 'red--text body-1'
      }
    },
    filterNRC(byZone) {
      function filterByZone(element) {
        return element.zone.indexOf(byZone) === 0
      }

      if (byZone === null) {
        this.nrcList = this.nrcListBeforeFilter
      } else {
        this.nrcList = this.nrcListBeforeFilter.filter(filterByZone)
      }
    },
    statusColor(status) {
      if (status === 'inProgress') {
        return 'yellow darken-3 white--text'
      }
      if (status === 'out') {
        return 'blue-grey white--text'
      }
      if (status === 'notYet') {
        return 'grey lighten-2'
      }
      if (status === 'ready') {
        return 'blue white--text'
      }
      if (status === 'done') {
        return 'green white--text'
      }
      if (status === 'cancel') {
        return 'line-bg white--text'
      }
    },
    statusToIcon(itemStatus) {
      const iconByStatus = (status) => ({
        'avail': 'check_circle',
        'notYet': 'directions_bike',
        'issued': 'build',
        'cancel': 'remove_circle_outline'
      })[status]
      return iconByStatus(itemStatus)
    },
    exportNRCList() {
      let exportedNRCList = []
      this.nrcList.forEach((element) => {
        let item = {
          NRC: element.number,
          DESCRIPTION: element.content,
          REF: element.ref
        }
        exportedNRCList.push(item)
      })
      // console.log(exportedWorkpack)
      let worksheet = XLSX.utils.json_to_sheet(Object.assign([], exportedNRCList))
      // console.log(worksheet)
      let workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'NRC')
      // // console.log(workbook)
      XLSX.writeFile(workbook, 'NRC.xlsx')
    }
  },
  mounted() {
    this.checkId = this.$store.getters.following
    this.loadNRC()
  }
}
</script>

<style scoped>
  .line-bg {
    background: repeating-linear-gradient(
      45deg,
      #2e2f36,
      #c3c5c9 2px
    ) !important;
  }
</style>


