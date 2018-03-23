<template>
  <v-dialog v-model="loading" persistent max-width="60px">
    <v-card class="v-card">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
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

