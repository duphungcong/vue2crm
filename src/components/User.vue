<template>
  <v-container fluid>
    <v-layout row>
      <v-flex md4 offset-md4 sm6 offset-sm3>
        <v-card>
          <v-card-title>
              <h4>User Settings</h4>
            </v-card-title>
            <v-card-text>
              <v-layout row align-baseline>
                <v-flex xs2>
                  Name
                </v-flex>
                <v-flex xs10>
                  <v-text-field v-model="currentUser.displayName"></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row align-baseline>
                <v-flex xs2>
                  Avatar
                </v-flex>
                <v-flex xs2>
                  <v-avatar>
                    <img :src="currentUser.photoUrl" alt="avatar">
                  </v-avatar>
                </v-flex>
                <v-flex xs8>
                  <v-form>
                    <input type="file" id="file" @change="onFileChange">
                  </v-form>
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <!-- <v-btn color="blue" flat @click.native="close()">Close</v-btn> -->
              <v-btn color="blue" flat @click.native="save()">Save</v-btn>
            </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

import firebase from 'firebase'

export default {
  name: 'User',
  data () {
    return {
      currentUser: {}
    }
  },
  methods: {
    save() {
      const rootComponent = this.appUtil.getRootComponent(this)
      firebase.database().ref('users/' + this.currentUser.id).update(this.currentUser).then(
        (data) => {
          rootComponent.openSnackbar('Success', 'success')
        },
        (error) => {
          rootComponent.openSnackbar(error, 'error')
          console.log(error)
        }
      )
    },
    onFileChange(e) {
      const files = e.target.files || e.dataTransfer.files
      if (files && files[0]) {
        console.log(files[0])
        this.uploadFile(files[0])
      }
    },
    uploadFile(file) {
      // let fileExtension = file.type
      let avatarRef = firebase.storage().ref().child('images/avatar/' + this.currentUser.id + '.jpg')
      avatarRef.put(file).then(
        (data) => {
          console.log(data)
          this.currentUser.photoUrl = data.downloadURL
        }
      )
    }
  },
  mounted() {
    this.currentUser = Object.assign({}, this.$store.getters.user)
  }
}
</script>

