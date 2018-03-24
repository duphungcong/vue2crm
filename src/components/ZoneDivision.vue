<template>
  <p>{{ checkId }}</p>
</template>

<script>

import firebase from 'firebase'

export default {
  name: 'ZoneDivision',
  data () {
    return {
      checkId: null,
      check: null
    }
  },
  methods: {
    getCheckById(id) {
      this.checkId = id
      firebase.database().ref('checks').once('value').then(
        (data) => {
          const obj = data.val()
          for (let key in obj) {
            if (key === this.checkId) {
              this.check = obj[key]
              return
            }
          }
        },
        (error) => {
          console.log(error)
        }
      )
    }
  },
  mounted() {
    this.getCheckById(this.$route.params.id)
  }
}
</script>
