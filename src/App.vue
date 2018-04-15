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

      <v-dialog v-model="dialogNrc" max-width="600">
        <v-card>
          <v-card-title>
            <span class="headline">New NRC</span>
          </v-card-title>
          <v-card-text>
             <v-layout row wrap align-baseline>
               <v-flex xs3>
                  <v-subheader>NRC</v-subheader>
                </v-flex>
               <v-flex xs9>
                <v-text-field type="number" v-model="nrc.number" required readonly></v-text-field>
              </v-flex>
             </v-layout>
            <v-layout row wrap align-baseline>
              <v-flex xs3>
                <v-subheader>WO</v-subheader>
              </v-flex>
              <v-flex xs9>
                <v-text-field mask="########" counter="8" prefix="VN" v-model="nrc.wo"></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row wrap align-baseline>
              <v-flex xs3>
                <v-subheader>Reference</v-subheader>
              </v-flex>
              <v-flex xs9>
                <v-text-field v-model="nrc.ref"></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row wrap align-baseline>
              <v-flex xs3>
                <v-subheader>Zone</v-subheader>
              </v-flex>
              <v-flex xs9>
                <v-select :items="zoneSelection" v-model="nrc.zone"></v-select>
              </v-flex>
            </v-layout>
            <v-layout row wrap align-baseline>
              <v-flex xs3>
                <v-subheader>Content</v-subheader>
              </v-flex>
              <v-flex xs9>
                <v-text-field v-model="nrc.content" required multi-line rows="2"></v-text-field>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="dialogNrc = false">Cancel</v-btn>
            <v-btn color="blue darken-1" flat @click.native="save('nrc')">Save</v-btn>
            <v-btn color="blue darken-1" flat @click.native="saveAndExit('nrc')">Save and Exit</v-btn>
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
        { icon: 'assignment', text: 'NRCs', link: 'Nrcs', vertical: 'Nrcs' },
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
        { img: 'keep.png', title: 'NRC', value: 'nrc' },
        { img: 'inbox.png', title: 'Spare order', value: 'spare' },
        { img: 'hangouts.png', title: 'Additional tasks', value: 'task' }
      ],
      checkId: '',
      dialogNrc: false,
      nrcList: [],
      nrc: {},
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
      defaultNrc: {
        number: 0,
        wo: '00000000',
        ref: 'PI',
        zone: 'N/A',
        priority: 'critical',
        content: '',
        spares: []
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
        this.loadNrc()
        this.nrc = Object.assign({}, this.defaultNrc)
        this.dialogNrc = true
      }
    },
    save(item) {
      if (item === 'nrc') {
        firebase.database().ref('nrcs/' + this.checkId + '/' + this.nrcList.length).set(this.nrc).then(
          (data) => {
            // console.log(this.nrcList)
            this.defaultNrc.number = this.nrcList.length + 1
            this.nrc = Object.assign({}, this.defaultNrc)
          },
          (error) => {
            console.log(error)
          }
        )
      }
    },
    saveAndExit(item) {
      if (item === 'nrc') {
        this.save(item)
        this.dialogNrc = false
      }
    },
    loadNrc() {
      // console.log(this.checkId)
      firebase.database().ref('nrcs/' + this.checkId).on('value',
        (data) => {
          this.nrcList = data.val() || []
          this.defaultNrc.number = this.nrcList.length + 1
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