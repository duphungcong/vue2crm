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
      <v-text-field
        flat
        solo-inverted
        prepend-icon="search"
        label="Search"
        class="hidden-sm-and-down"></v-text-field>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>apps</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>notifications</v-icon>
      </v-btn>
      <v-btn icon large>
        <v-avatar size="32px" tile>
          <img
            src="https://vuetifyjs.com/static/doc-images/logo.svg"
            alt="Vuetify"
          >
        </v-avatar>
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <v-layout>
          <v-flex row>
            <router-view></router-view>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <v-btn
      fab
      bottom
      right
      color="pink"
      dark
      fixed
      @click.stop="sheet = !sheet">
      <v-icon>add</v-icon>
    </v-btn>
    <!-- <v-dialog v-model="dialog" width="800px">
      <v-card>
        <v-card-title
          class="grey lighten-4 py-4 title"
        >
          Create contact
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-layout row wrap>
            <v-flex xs12 align-center justify-space-between>
              <v-layout align-center>
                <v-avatar size="40px" class="mr-3">
                  <img
                    src="//ssl.gstatic.com/s2/oz/images/sge/grey_silhouette.png"
                    alt=""
                  >
                </v-avatar>
                <v-text-field
                  placeholder="Name"
                ></v-text-field>
              </v-layout>
            </v-flex>
            <v-flex xs6>
              <v-text-field
                prepend-icon="business"
                placeholder="Company"
              ></v-text-field>
            </v-flex>
            <v-flex xs6>
              <v-text-field
                placeholder="Job title"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                prepend-icon="mail"
                placeholder="Email"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                type="tel"
                prepend-icon="phone"
                placeholder="(000) 000 - 0000"
                mask="phone"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                prepend-icon="notes"
                placeholder="Notes"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-btn flat color="primary">More</v-btn>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="dialog = false">Cancel</v-btn>
          <v-btn flat @click="dialog = false">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->
    <v-bottom-sheet v-model="sheet" inset="">
      <!-- <v-btn slot="activator" color="purple" dark>Click me</v-btn> -->
      <v-list>
        <v-list-tile
          v-for="tile in tiles"
          :key="tile.title"
          @click="sheet = false">
          <v-list-tile-title class="text-xs-right pr-2">{{ tile.title }}</v-list-tile-title>
          <v-list-tile-avatar>
            <v-avatar size="32px" tile>
              <img :src="`https://vuetifyjs.com/static/doc-images/bottom-sheets/${tile.img}`" :alt="tile.title">
            </v-avatar>
          </v-list-tile-avatar>
        </v-list-tile>
      </v-list>
    </v-bottom-sheet>
    </template>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
      dialog: false,
      drawer: null,
      menuItem: '',
      items: [
        { icon: 'contacts', text: 'Dashboard', link: 'Dashboard', vertical: 'Dashboard' },
        { icon: 'history', text: 'Orders', link: 'Orders', vertical: 'Order' },
        { icon: 'content_copy', text: 'Customers', link: 'Customers', vertical: 'Customer' },
        { icon: 'settings', text: 'Products', link: 'Products', vertical: 'Product' },
        { icon: 'chat_bubble', text: 'About', link: 'About', vertical: 'About' }
      ],
      sheet: false,
      tiles: [
        { img: 'keep.png', title: 'NRC' },
        { img: 'inbox.png', title: 'Spare order' },
        { img: 'hangouts.png', title: 'Add task card into WP' }
      ]
    }),
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
      }
    },
    methods: {
      clickMenu (item) {
        this.menuItem = item.text
        this.$router.push({
          name: item.link
        })
      },
      onLogOut () {
        this.$store.dispatch('logOut')
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