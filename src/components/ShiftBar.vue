<template>
  <v-container grid-list-sm mx-0 px-0>
    <v-card>
      <v-card-actions>
        <v-layout row wrap mx-0 px-0>
          <v-flex xs12 mx-0 px-0>
            <v-btn small>1</v-btn>
          </v-flex>
          <v-flex sx12 mx-0 px-0>
            <v-btn small>1</v-btn>
          </v-flex>
          <v-flex sx12 mx-0 px-0>
            <v-btn small>1</v-btn>
          </v-flex>
          <v-flex sx12 mx-0 px-0>
            <v-btn small>1</v-btn>
          </v-flex>
          <v-flex sx12 mx-0 px-0>
            <v-btn small>1</v-btn>
          </v-flex>
        </v-layout>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'ShiftBar',
  data () {
    return {}
  },
  props: {
    shifts: {
      type: Array,
      default: () => {
        return []
      }
    }
  }
}
</script>

<style scoped>
  .btn{
    min-width: 0;
    width: 50px
  }
</style>


