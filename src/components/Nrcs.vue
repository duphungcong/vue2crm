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
              <v-btn @click.native="exportNRCList" class="blue white--text">Export to Excel
                <v-icon dark right>file_download</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
        </v-card-actions>
        <v-data-table :headers="headerNRC" :items="nrcList" :pagination.sync="paginationNRC" :search="search" item-key="number">
          <template slot="items" slot-scope="props" class="body-0">
            <td class="body-0" @click="props.expanded = !props.expanded"><v-chip :class="statusColor(props.item.status)" label>{{ props.item.number }}</v-chip></td>
            <td class="body-0" @click="props.expanded = !props.expanded" :class="priorityColor(props.item.priority)">{{ props.item.priority }}</td>
            <td class="body-0">
              <v-btn v-if="props.item.spares !== undefined && props.item.spares !== ''" icon class="mx-0" @click.native="showNRCSpares(props.item)">
                <v-tooltip bottom>
                  <v-icon color="blue" slot="activator" v-if="props.item.spares === 'ready'">local_grocery_store</v-icon>
                  <v-icon color="grey darken-2" slot="activator" v-else>local_grocery_store</v-icon><span>spares</span>
                </v-tooltip>
              </v-btn>
              <v-btn v-if="props.item.tars !== undefined && props.item.tars.length > 0" icon class="mx-0" @click.native="showTAR(props.item)">
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
              <v-text-field label="RQF" mask="AA  ########" counter="12" v-model="newOrder.number"></v-text-field>
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
            <td class="boyd-0" @click="props.expanded = !props.expanded">{{ props.item.status }}</td>
            <td class="boyd-0" @click="props.expanded = !props.expanded">{{ props.item.estDate }}</td>
            <td class="boyd-0" @click="props.expanded = !props.expanded">{{ props.item.notes || 'NIL'}}</td>
            <td class="body-0">
              <v-menu bottom right>
                <v-btn icon class="mx-0" @click.native="selectStatus(props.item)" slot="activator">
                  <v-tooltip bottom>
                    <v-icon color="blue" slot="activator">edit</v-icon><span>edit</span>
                  </v-tooltip>
                </v-btn>
                <v-list>
                  <v-list-tile v-for="status in spareStatusSelection" :key="status" @click="props.item.status = status">
                    <v-list-tile-title v-text="status"></v-list-tile-title>
                  </v-list-tile>
                </v-list>
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
    <loading-progress></loading-progress>
  </v-container>
</template>

<script>

import firebase from 'firebase'

export default {
  name: 'NRCs',
  data () {
    return {
      checkId: null,
      nrcList: [],
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
        { text: '', sortable: false, value: '' }
      ],
      itemIndex: -1,
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
      selectedZone: '',
      search: '',
      allSparesReady: false
    }
  },
  watch: {
    dialogNRCSpares (newValue, oldValue) {
      if (newValue === false) {
        this.closeNRCSpares()
      }
    }
  },
  methods: {
    loadNRC() {
      this.$store.dispatch('beginLoading')
      firebase.database().ref('nrcs/' + this.checkId).on('value',
        (data) => {
          this.nrcList = data.val() || []
          this.$store.dispatch('endLoading')
        },
        (error) => {
          console.log(error)
          this.$store.dispatch('endLoading')
        }
      )
    },
    editNRC(item) {
      this.itemIndex = this.nrcList.indexOf(item)
      console.log(this.itemIndex)
      this.editedNRC = Object.assign({}, item)
      this.dialogEditNRC = true
    },
    closeEditNRC() {
      this.dialogEditNRC = false
      setTimeout(() => {
        this.editedNRC = {}
        this.itemIndex = -1
      }, 300)
    },
    saveEditedNRC() {
      if (this.itemIndex > -1) {
        const rootComponent = this.appUtil.getRootComponent(this)
        firebase.database().ref('nrcs/' + this.checkId + '/' + this.itemIndex).update(this.editedNRC).then(
          (data) => {
            rootComponent.openSnackbar('Success', 'success')
          },
          (error) => {
            // console.log(error)
            rootComponent.openSnackbar(error, 'error')
          }
        )
      }
      this.closeEditNRC()
    },
    showNRCSpares(item) {
      this.itemIndex = this.nrcList.indexOf(item)
      this.editedNRC = Object.assign({}, item)
      if (this.editedNRC.spares === 'ready') {
        this.allSparesReady = true
      } else {
        this.allSparesReady = false
      }
      if (this.itemIndex > -1) {
        this.spareLoading = true
        firebase.database().ref('spares/' + this.checkId + '/' + this.itemIndex).once('value').then(
          (data) => {
            let obj = data.val()
            if (obj !== null && obj !== undefined) {
              for (let key in obj) {
                this.sparesList.push(Object.assign({}, obj[key], { id: key }))
              }
            }
            this.spareLoading = false
          },
          (error) => {
            console.log(error)
            this.spareLoading = false
          }
        )
      }
      this.dialogNRCSpares = true
    },
    closeNRCSpares() {
      this.dialogNRCSpares = false
      this.sparesList = []
      setTimeout(() => {
        this.editedNRC = {}
        this.itemIndex = -1
      }, 300)
    },
    saveNRCSpares() {
      if (this.itemIndex > -1 && this.sparesList.length > 0) {
        const rootComponent = this.appUtil.getRootComponent(this)
        if (this.allSparesReady) {
          this.editedNRC.spares = 'ready'
        } else {
          this.editedNRC.spares = 'order'
        }

        let sparesListObj = this.sparesList.reduce((obj, item) => {
          obj[item.id] = item
          obj[item.id].id = null
          return obj
        }, {})
        // console.log(sparesListObj)

        let updates = {}
        updates['/nrcs/' + this.checkId + '/' + this.itemIndex] = this.editedNRC
        updates['/spares/' + this.checkId + '/' + this.itemIndex] = sparesListObj
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
      // this.closeNRCSpares()
    },
    showLog(item) {},
    showTAR(item) {},
    orderSpare(item) {
      this.itemIndex = this.nrcList.indexOf(item)
      console.log(this.itemIndex)
      this.editedNRC = Object.assign({}, item)
      this.newOrder.priority = this.editedNRC.priority
      this.newOrder.status = 'notYet'
      this.newOrder.estDate = 'NIL'
      this.dialogOrderSpare = true
    },
    closeOrderSpare() {
      this.dialogOrderSpare = false
      setTimeout(() => {
        this.newOrder = {}
        this.editedNRC = {}
        this.itemIndex = -1
      }, 300)
    },
    saveOrderSpare() {
      if (this.itemIndex > -1) {
        const rootComponent = this.appUtil.getRootComponent(this)
        console.log(this.itemIndex)
        this.editedNRC.spares = 'order'
        let newSpareKey = firebase.database().ref('spares/' + this.checkId + '/' + this.itemIndex).push().key
        let updates = {}
        updates['/nrcs/' + this.checkId + '/' + this.itemIndex] = this.editedNRC
        updates['/spares/' + this.checkId + '/' + this.itemIndex + '/' + newSpareKey] = this.newOrder
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
      this.closeOrderSpare()
    },
    makeTAR(item) {},
    priorityColor(priority) {
      if (priority === 'AOG') {
        return 'red--text body-1'
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


