<template>
  <p>hello</p>
</template>

<script>

import firebase from 'firebase'

export default {
  name: 'Spares',
  data () {
    return {
      checkId: null,
      sparesList: []
    }
  },
  methods: {
    loadSpares() {
      firebase.database().ref('spares/' + this.checkId).on('value',
      (data) => {
        this.sparesList = Object.values(data.val()) || []
      },
      (error) => {
        console.log(error)
      })
    }
  },
  mounted() {
    this.checkId = this.$store.getters.following
    this.loadSpares()
  }
}
</script>

