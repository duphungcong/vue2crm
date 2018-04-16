<template>
  <v-app>
    <vue-progress-bar>
    </vue-progress-bar>
    <template v-if="!userIsAuthenticated">
      <router-view></router-view>
    </template>
    <template v-if="userIsAuthenticated">
      <v-navigation-drawer
      fixed
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
      v-model="drawer">
        <v-list dense>
          <template v-for="item in items">
            <v-list-tile :key="item.text" @click="clickMenu(item)" router>
              <v-list-tile-action>
                <v-icon v-if="activeMenuItem.indexOf(item.vertical) > -1" class="blue--text">{{ item.icon }}</v-icon>
                <v-icon v-else>{{ item.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ item.text }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
        </v-list>
        <v-list>
          <v-list-tile avatar tag="div">
            <v-list-tile-avatar>
              <img src="/assets/img/avatar0.png">
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ user.email }}</v-list-tile-title>
            </v-list-tile-content>
            <v-menu bottom left offset-y origin="bottom right" transition="v-slide-y-transition">
              <v-btn icon light slot="activator">
                <v-icon>more_vert</v-icon>
              </v-btn>
              <v-list>
                <v-list-tile v-if="userIsFollowingCheck"  @click="onStopFollowing">Stop following check</v-list-tile>
                <v-list-tile @click="onLogOut">Logout</v-list-tile>
              </v-list>
            </v-menu>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
      <v-toolbar
        dense
        color="blue darken-3"
        dark
        app
        :clipped-left="$vuetify.breakpoint.lgAndUp"
        fixed>
        <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
          <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
          <span class="hidden-sm-and-down">PLN TEAM</span>
        </v-toolbar-title>
        <!-- <v-text-field
          flat
          single-line
          solo-inverted
          prepend-icon="search"
          label="Search"
          class="hidden-sm-and-down"></v-text-field> -->
        <!-- <v-text-field append-icon="search" label="Search" single-line hide-details v-model="search"></v-text-field>   -->
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon>apps</v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon>notifications</v-icon>
        </v-btn>
      </v-toolbar>
      <v-content>
        <router-view></router-view>
      </v-content>
      <v-btn
        v-if="userIsFollowingCheck"
        fab
        bottom
        right
        color="red"
        dark
        fixed
        @click.stop="bottomSheet = !bottomSheet">
        <v-icon>add</v-icon>
      </v-btn>
    
      <v-bottom-sheet v-model="bottomSheet" inset="">
        <!-- <v-btn slot="activator" color="purple" dark>Click me</v-btn> -->
        <v-list>
          <v-list-tile
            v-for="item in bottomSheetTitles"
            :key="item.title"
            @click="add(item.value)">
            <v-list-tile-title class="text-xs-right pr-2">{{ item.title }}</v-list-tile-title>
            <v-list-tile-avatar>
              <v-avatar size="32px" tile>
                <img :src="`https://vuetifyjs.com/static/doc-images/bottom-sheets/${item.img}`" :alt="item.title">
              </v-avatar>
            </v-list-tile-avatar>
          </v-list-tile>
        </v-list>
      </v-bottom-sheet>

      <v-dialog v-model="dialogAddNRC" persistent max-width="600">
        <v-card>
          <v-card-title>
            <span class="headline">New NRC</span>
          </v-card-title>
          <v-card-text>
            <v-layout row wrap align-baseline>
              <v-flex xs12>
                NRC {{ newNRC.number }}
              </v-flex>
            </v-layout>
            <v-layout row wrap align-baseline>
              <v-flex xs6>
                <v-text-field label="W/O" mask="########" counter="8" v-model="newNRC.wo"></v-text-field>
              </v-flex>
              <v-flex xs1></v-flex>
              <v-flex xs5>
                <v-text-field label="Reference" v-model="newNRC.ref"></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row wrap align-baseline>
              <v-flex xs6>
                <v-select label="Zone" :items="zoneSelection" v-model="newNRC.zone"></v-select>
              </v-flex>
              <v-flex xs1></v-flex>
              <v-flex xs5>
                <v-select label="Status" :items="nrcStatusSelection" v-model="newNRC.status"></v-select>
              </v-flex>
            </v-layout>
            <v-layout row wrap align-baseline>
              <v-flex xs12>
                <v-select label="Priority" :items="prioritySelection" v-model="newNRC.priority"></v-select>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Content" v-model="newNRC.content" required multi-line rows="2"></v-text-field>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue" flat @click.native="close('nrc')">Cancel</v-btn>
            <v-btn color="blue" flat @click.native="save('nrc')">Save</v-btn>
            <v-btn color="blue" flat @click.native="saveAndExit('nrc')">Save and Exit</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogOrder" persistent max-width="600">
        <v-card>
          <v-card-title>
            <span class="headline">Order Spare</span>
          </v-card-title>
          <v-card-text>
            <v-layout row wrap align-baseline>
              <v-flex xs12>
                <v-select label="NRC" :items="nrcList" v-model="orderNRC" item-text="number" autocomplete></v-select>
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
                <v-select label="Priority" :items="prioritySelection" v-model="newOrder.priority" autocomplete></v-select>
              </v-flex>
              <v-flex xs1></v-flex>
              <v-flex xs5>
                <v-select label="Status" :items="spareStatusSelection" v-model="newOrder.status" autocomplete></v-select>
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
              <v-text-field label="Note" v-model="newOrder.note" required multi-line rows="2"></v-text-field>
            </v-flex>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue" flat @click.native="close('order')">Cancel</v-btn>
            <v-btn color="blue" flat @click.native="save('order')">Save</v-btn>
            <v-btn color="blue" flat @click.native="saveAndExit('order')">Save and Exit</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </v-app>
</template>

<script>

import firebase from 'firebase'

export default {
  name: 'App',
  data () {
    return {
      drawer: null,
      menuItem: '',
      followingItems: [
        { icon: 'contacts', text: 'Dashboard', link: 'Dashboard', vertical: 'Dashboard' },
        { icon: 'assignment', text: 'Shifts', link: 'Shifts', vertical: 'Shifts' },
        { icon: 'assignment', text: 'Tasks', link: 'Tasks', vertical: 'Tasks' },
        { icon: 'assignment', text: 'NRCs', link: 'NRCs', vertical: 'NRCs' },
        { icon: 'assignment', text: 'Spares', link: 'Spares', vertical: 'Spares' },
        { icon: 'assignment', text: 'Barcode Receive', link: 'BarcodeIn', vertical: 'BarcodeIn' },
        { icon: 'assignment', text: 'Barcode Take Out', link: 'BarcodeOut', vertical: 'BarcodeOut' }
      ],
      noFollowingItems: [
        { icon: 'contacts', text: 'Checks', link: 'Checks', vertical: 'Checks' },
        { icon: 'contacts', text: 'AMS', link: 'MaintSchedule', vertical: 'MaintSchedule' }
      ],
      bottomSheet: false,
      bottomSheetTitles: [
        { img: 'keep.png', title: 'New NRC', value: 'nrc' },
        { img: 'inbox.png', title: 'New Order', value: 'order' },
        { img: 'hangouts.png', title: 'Add Task', value: 'task' }
      ],
      checkId: '',
      dialogAddNRC: false,
      dialogOrder: false,
      nrcList: [],
      newNRC: {},
      newOrder: {},
      orderNRC: {},
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
      nrcStatusSelection: [
        'notYet',
        'inProgress',
        'done',
        'out',
        'ready',
        'cancel'
      ],
      spareStatusSelection: [
        'notYet',
        'avail',
        'issued'
      ],
      defaultNRC: {
        number: 0,
        wo: '00000000',
        ref: 'PI',
        zone: 'N/A',
        priority: '',
        content: '',
        spares: '',
        status: 'notYet'
      }
    }
  },
  props: {
    source: String
  },
  created() {
    //  [App.vue specific] When App.vue is first loaded start the progress bar
    this.$Progress.start()
    //  hook the progress bar to start before we move router-view
    this.$router.beforeEach((to, from, next) => {
      //  does the page we want to go to have a meta.progress object
      if (to.meta.progress !== undefined) {
        let meta = to.meta.progress
        // parse meta tags
        this.$Progress.parseMeta(meta)
      }
      //  start the progress bar
      this.$Progress.start()
      //  continue to next page
      next()
    })
    //  hook the progress bar to finish after we've finished moving router-view
    this.$router.afterEach((to, from) => {
      if (to.name !== 'ErrorPage') {
        this.menuItem = to.name
      }
      //  finish the progress bar
      this.$Progress.finish()
    })
  },
  computed: {
    user () {
      return this.$store.getters.user
    },
    userIsAuthenticated () {
      return this.$store.getters.user !== null && this.$store.getters.user !== undefined
    },
    activeMenuItem () {
      return this.menuItem
    },
    items () {
      if (this.$store.getters.following !== null) {
        return this.followingItems
      }
      return this.noFollowingItems
    },
    userIsFollowingCheck () {
      return this.$store.getters.following !== null
    },
    following () {
      return this.$store.getters.following
    }
  },
  watch: {
    user (newValue, oldValue) {
      if (oldValue === null && newValue !== null) {
        this.$router.push('/')
      }
      if (oldValue !== null && newValue === null) {
        this.$router.push('login')
      }
    },
    following (newValue, oldValue) {
      if (oldValue === null && newValue !== null) {
        // console.log('go to /')
        this.$router.push('/')
      }
      if (oldValue !== null && newValue === null) {
        // console.log('go to check')
        this.$router.push('/checks')
      }
    }
  },
  methods: {
    clickMenu (item) {
      this.menuItem = item.text
      this.$router.push({ name: item.link })
    },
    onLogOut () {
      this.$store.dispatch('logOut')
    },
    onStopFollowing () {
      this.$store.dispatch('stopFollowing')
    },
    add(item) {
      this.checkId = this.$store.getters.following
      this.bottomSheet = false
      if (this.checkId !== null && item === 'nrc') {
        this.loadNRC()
        this.newNRC = Object.assign({}, this.defaultNRC)
        this.dialogAddNRC = true
      }
      if (this.checkId !== null && item === 'order') {
        this.loadNRC()
        this.newOrder.status = 'notYet'
        this.dialogOrder = true
      }
    },
    close(item) {
      if (item === 'nrc') {
        this.newNRC = {}
        this.dialogAddNRC = false
      }
      if (item === 'order') {
        this.newOrder = {}
        this.dialogOrder = false
      }
    },
    save(item) {
      if (item === 'nrc') {
        firebase.database().ref('nrcs/' + this.checkId + '/' + this.nrcList.length).set(this.newNRC).then(
          (data) => {
            // console.log(this.nrcList)
            this.defaultNRC.number = this.nrcList.length + 1
            this.newNRC = Object.assign({}, this.defaultNRC)
          },
          (error) => {
            console.log(error)
          }
        )
      }
      if (item === 'order') {
        let nrcIndex = this.nrcList.indexOf(this.orderNRC)
        console.log(nrcIndex)
        if (nrcIndex > -1) {
          let newSpareKey = firebase.database().ref('spares/' + this.checkId + '/' + nrcIndex).push().key
          let updates = {}
          if (this.orderNRC.spares === undefined || this.orderNRC.spares === '') {
            this.orderNRC.spares = 'order'
            updates['/nrcs/' + this.checkId + '/' + nrcIndex] = this.orderNRC
          }
          updates['/spares/' + this.checkId + '/' + nrcIndex + '/' + newSpareKey] = this.newOrder
          firebase.database().ref().update(updates).then(
            (data) => {
              this.newOrder = {}
              this.newOrder.status = 'notYet'
            },
            (error) => {
              console.log(error)
            }
          )
        }
      }
    },
    saveAndExit(item) {
      if (item === 'nrc') {
        this.save(item)
        this.dialogAddNRC = false
      }
      if (item === 'order') {
        this.save(item)
        this.dialogOrder = false
      }
    },
    loadNRC() {
      // console.log(this.checkId)
      firebase.database().ref('nrcs/' + this.checkId).on('value',
        (data) => {
          this.nrcList = data.val() || []
          this.defaultNRC.number = this.nrcList.length + 1
          // console.log(this.nrcList)
        },
        (error) => {
          console.log(error)
        }
      )
    }
  },
  mounted() {
    this.$Progress.finish()
  }
}
</script>

<style lang="stylus">
  @import './stylus/main'
</style>