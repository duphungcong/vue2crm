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
              <v-btn @click.native="exportNrcList" class="blue white--text">Export to Excel
                <v-icon dark right>file_download</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
        </v-card-actions>
        <v-data-table :headers="headers" :items="nrcList" :pagination.sync="pagination" :search="search" item-key="number">
          <template slot="items" slot-scope="props" class="body-0">
            <!-- <td class="body-0" @click="props.expanded = !props.expanded"><v-chip :class="statusColor(props.item.status)" label>{{ props.item.number }}</v-chip></td> -->
            <td class="body-0" @click="props.expanded = !props.expanded">{{ props.item.number }}</td>
            <td class="body-0" @click="props.expanded = !props.expanded" :class="priorityColor(props.item.priority)">{{ props.item.priority }}</td>
            <td class="body-0">
              <v-btn v-if="props.item.spares !== undefined && props.item.spares !== ''" icon class="mx-0" @click.native="showSpare(props.item)">
                <v-tooltip bottom>
                  <v-icon color="grey darken-3" slot="activator">local_grocery_store</v-icon><span>spares</span>
                </v-tooltip>
              </v-btn>
              <v-btn v-if="props.item.tars !== undefined && props.item.tars.length > 0" icon class="mx-0" @click.native="showTAR(props.item)">
                <v-tooltip bottom>
                  <v-icon color="grey" slot="activator">help</v-icon><span>TAR</span>
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
                  <v-btn icon class="mx-0" @click="editItem(props.item)">
                    <v-tooltip bottom>
                      <v-icon color="blue" slot="activator">edit</v-icon><span>edit</span>
                    </v-tooltip>
                  </v-btn>
                  <v-btn icon class="mx-0" @click.native="orderSpare(props.item)">
                    <v-tooltip bottom>
                      <v-icon color="blue" slot="activator">add_shopping_cart</v-icon><span>order</span>
                    </v-tooltip>
                  </v-btn>
                  <v-btn icon class="mx-0" @click.native="makeTar(props.item)">
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
    <v-dialog v-model="dialogEditNrc" max-width="600">
      <v-card>
        <v-card-title>
          <span class="headline">Edit NRC</span>
        </v-card-title>
        <v-card-text>
          <v-layout row wrap align-baseline>
            <v-flex xs3>
              <v-subheader>NRC {{ editedItem.number }}</v-subheader>
            </v-flex>
          </v-layout>
          <v-layout row wrap align-baseline>
            <v-flex xs3>
              <v-subheader>Status</v-subheader>
            </v-flex>
            <v-flex xs9>
              <v-select :items="statusSelection" v-model="editedItem.status"></v-select>
            </v-flex>
          </v-layout>
          <v-layout row wrap align-baseline>
            <v-flex xs3>
              <v-subheader>WO</v-subheader>
            </v-flex>
            <v-flex xs9>
              <v-text-field mask="########" counter="8" v-model="editedItem.wo"></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row wrap align-baseline>
            <v-flex xs3>
              <v-subheader>Reference</v-subheader>
            </v-flex>
            <v-flex xs9>
              <v-text-field v-model="editedItem.ref"></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row wrap align-baseline>
            <v-flex xs3>
              <v-subheader>Zone</v-subheader>
            </v-flex>
            <v-flex xs9>
              <v-select :items="zoneSelection" v-model="editedItem.zone"></v-select>
            </v-flex>
          </v-layout>
          <v-layout row wrap align-baseline>
            <v-flex xs3>
              <v-subheader>Priority</v-subheader>
            </v-flex>
            <v-flex xs9>
              <v-select :items="prioritySelection" v-model="editedItem.priority"></v-select>
            </v-flex>
          </v-layout>
          <v-layout row wrap align-baseline>
            <v-flex xs3>
              <v-subheader>Content</v-subheader>
            </v-flex>
            <v-flex xs9>
              <v-text-field v-model="editedItem.content" required multi-line rows="2"></v-text-field>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue" flat @click.native="dialogEditNrc = false">Cancel</v-btn>
          <v-btn color="blue" flat @click.native="save()">Save</v-btn>
        </v-card-actions>
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
      pagination: {
        page: 1,
        totalItems: 0,
        rowsPerPage: 10,
        sortBy: 'number',
        descending: true
      },
      headers: [
        { text: 'NRC', left: true, value: 'number' },
        { text: 'PRI', left: true, value: 'priority' },
        { text: 'INFO', left: true, value: '' },
        { text: 'NOTES', left: true, value: 'notes' },
        { text: 'CONTENT', left: true, value: 'content' },
        { text: 'REF', left: true, value: 'ref' },
        { text: 'ZONE', left: true, value: 'zone' }
      ],
      itemIndex: -1,
      zoneSelection: [
        'N/A',
        '100-200-800',
        '300-400',
        '500-600-700',
        'AVIONIC',
        'STRUCTURE',
        'CABIN',
        'CLEANING'
      ],
      prioritySelection: [
        'AOG',
        'critical',
        'normal'
      ],
      statusSelection: [
        'notYet',
        'inProgress',
        'done',
        'out',
        'ready'
      ],
      editedItem: {},
      dialogEditNrc: false,
      selectedZone: '',
      search: ''
    }
  },
  methods: {
    loadNrc() {
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
    editItem(item) {
      this.itemIndex = this.nrcList.indexOf(item)
      console.log(this.itemIndex)
      this.editedItem = Object.assign({}, item)
      this.dialogEditNrc = true
    },
    save() {
      if (this.itemIndex > -1) {
        firebase.database().ref('nrcs/' + this.checkId + '/' + this.itemIndex).update(this.editedItem).then(
          (data) => {
            this.dialogEditNrc = false
          },
          (error) => {
            console.log(error)
          }
        )
      }
    },
    saveInlineEdit(item) {
      // console.log(item.number)
    },
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
      // if (status === 'notYet') {
      //   return 'red white--text'
      // }
      if (status === 'done') {
        return 'green white--text'
      }
    },
    showLog(item) {},
    showSpare(item) {},
    showTAR(item) {},
    orderSpare(item) {},
    makeTar(item) {}
  },
  mounted() {
    this.checkId = this.$store.getters.following
    this.loadNrc()
  }
}
</script>

