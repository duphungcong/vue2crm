<template>
  <v-dialog v-model="loading" persistent max-width="100" max-height="100">
    <v-card class="v-card">
      <v-card-text>
        <v-progress-circular 
        indeterminate
        color="primary"
        :size="60"
        :width="3"></v-progress-circular>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  created() {
    console.log('loading-progress component')
  },
  computed: {
    loading () {
      return this.$store.getters.loading
    }
  }
}
</script>

<style scoped>
  .v-card {
    text-align: center
  }
</style>

