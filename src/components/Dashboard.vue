<template>
  <v-container fluid grid-list-sm>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card>
          <v-card-title>
            Task Cards
          </v-card-title>
          <v-card-text>
            <p>Total: <strong>{{ taskOverview.total }}</strong></p>
            <p>Done: <strong>{{ taskOverview.done }}</strong></p>
            <p>InProgress: <strong>{{ taskOverview.inProgress }}</strong></p>
            <p>Not Yet: <strong>{{ taskOverview.notYet }}</strong></p>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12>
        <v-card>
          <v-card-title>
            NRC
          </v-card-title>
          <v-card-text>
            <p>Total: <strong>{{ nrcOverview.total }}</strong></p>
            <p>Done: <strong>{{ nrcOverview.done }}</strong></p>
            <p>InProgress: <strong>{{ nrcOverview.inProgress }}</strong></p>
            <p>Not Yet: <strong>{{ nrcOverview.notYet }}</strong></p>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'Dashboard',
  data () {
    return {
      checkId: null,
      taskOverview: {},
      nrcOverview: {}
    }
  },
  methods: {
  },
  mounted() {
    this.checkId = this.$store.getters.following
  }
}
</script>

