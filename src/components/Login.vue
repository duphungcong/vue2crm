<template>
  <v-container fluid>
    <v-layout row>
      <v-flex md4 offset-md4>
        <h1> &nbsp;</h1>
        <v-card>
            <v-card-title  class="blue darken-1">
              <h4 class="white--text">Log In</h4>
            </v-card-title>
            <v-card-text>
                <form @submit.prevent="onLogin">
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
                  <v-btn class="blue white--text" type="submit" :disabled="loading" :loading="loading">login</v-btn>
                </form>
                <br>
                <v-layout row>
                  <p>No account? <router-link to="/signup">Create one</router-link></p>
                </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-snackbar
      :timeout="timeout"
      color="error"
      :top="y === 'top'"
      :bottom="y === 'bottom'"
      :right="x === 'right'"
      :left="x === 'left'"
      :multi-line="mode === 'multi-line'"
      :vertical="mode === 'vertical'"
      v-model="snackbar"
      >
      {{ snackbarMsg }}
      <v-btn flat @click.native="snackbar = false">Close</v-btn>
    </v-snackbar>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      email: '',
      password: '',
      snackbarMsg: '',
      snackbar: false,
      y: 'top',
      x: null,
      mode: '',
      timeout: 3000
    }
  },
  computed: {
    error () {
      return this.$store.getters.error
    },
    loading () {
      return this.$store.getters.loading
    }
  },
  watch: {
    error (value) {
      if (value !== null && value !== undefined) {
        this.snackbarMsg = value.message
        this.snackbar = true
      }
    }
  },
  methods: {
    onLogin () {
      this.$store.dispatch('login', {email: this.email, password: this.password})
    }
  }
}
</script>

<style lang="stylus">
  @import '../stylus/main'
</style>