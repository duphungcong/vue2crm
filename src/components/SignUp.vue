<template>
<v-container fluid>
  <v-layout row wrap>
    <v-flex xs4 offset-xs4 justify-space-between>
      <h1> &nbsp; </h1>
      <v-card>
        <v-card-title class="blue darken-1">
          <h4 style="color:white">Sign Up</h4>
        </v-card-title>
        <v-card-text>
          <form @submit.prevent="onSignUp">
            <v-layout row>
              <v-flex xs4>
                <v-subheader>User ID</v-subheader>
              </v-flex>
              <v-flex xs8>
                <v-text-field name="email" v-model="email" label="email" value="Input text" class="input-group--focused"></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs4>
                <v-subheader>Password</v-subheader>
              </v-flex>
              <v-flex xs8>
                <v-text-field name="password" v-model="password" label="password" value="Input text" type="password" class="input-group--focused"></v-text-field>
              </v-flex>
            </v-layout>
            <v-btn type="submit" :disabled="loading" :loading="loading">sign up</v-btn>
          </form>
          <br>
          <v-layout row>
            <p>Already have an account? <router-link to="/login">Log In</router-link></p>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
export default {
  data () {
    return {
      email: '',
      password: ''
    }
  },
  computed: {
    user () {
      let user = this.$store.getters.user
      if (user !== null && user !== undefined) {
        this.$router.push(this.$route.query.redirect || '/')
      }
      return user
    },
    error () {
      return this.$store.getters.error
    },
    loading () {
      return this.$store.getters.loading
    }
  },
  watch: {
    // TODO: check watcher not working
    user (value) {
      // if (value !== null && value !== undefined) {
      //   this.$router.push(this.$route.query.redirect || '/')
      // }
    }
  },
  methods: {
    onSignUp () {
      this.$store.dispatch('signUp', {email: this.email, password: this.password})
    }
  }
}
</script>

<style lang="stylus">
  @import '../stylus/main'
</style>