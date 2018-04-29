<template>
  <v-container fluid>
    <v-layout row>
      <v-flex md4 offset-md4>
        <v-card>
          <v-card-title>
              <h4>User Settings</h4>
            </v-card-title>
            <v-card-text>
              <!-- <v-layout row>
                <v-flex>
                  <v-text-field disabled label="Email" v-model="user.email"></v-text-field>
                </v-flex>
              </v-layout> -->
              <v-layout row align-baseline>
                <v-flex xs2>
                  Name
                </v-flex>
                <v-flex xs10>
                  <v-text-field v-model="userProfile.displayName"></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row align-baseline>
                <v-flex xs2>
                  Avatar
                </v-flex>
                <v-flex xs2>
                  <v-avatar>
                    <img src="/assets/img/avatar0.png" alt="avatar">
                  </v-avatar>
                </v-flex>
                <!-- <v-flex xs10>
                  <v-form>
                    <input type="file" id="file" @change="onFileChange">
                  </v-form>
                </v-flex> -->
              </v-layout>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue" flat @click.native="close()">Close</v-btn>
              <v-btn color="blue" flat @click.native="save()">Save</v-btn>
            </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

// import firebase from 'firebase'

export default {
  name: 'User',
  data () {
    return {
      user: {},
      userProfile: {}
    }
  },
  methods: {
    save() {
      const rootComponent = this.appUtil.getRootComponent(this)
      this.user.updateProfile(this.userProfile).then(
        (data) => {
          rootComponent.openSnackbar('Success', 'success')
        },
        (error) => {
          rootComponent.openSnackbar(error, 'error')
          console.log(error)
        }
      )
    }
  },
  mounted() {
    this.user = this.$store.getters.user
    this.userProfile = {
      displayName: this.user.displayName,
      photoUrl: this.user.photoUrl || '/assets/img/avatar0.png'
    }
  }
}
</script>

