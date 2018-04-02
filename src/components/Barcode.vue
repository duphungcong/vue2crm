<template>
  <v-container fluid grid-list-sm>
    <v-layout row wrap>
      <v-flex x12>
        <v-card>
          <v-card-text>
            <span>{{ scan }}</span>
          </v-card-text>
          <v-card-actions>
            <v-text-field v-model="input" autofocus :change="onScan"></v-text-field>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'Barcode',
  data () {
    return {
      input: '',
      scan: []
    }
  },
  methods: {
    onScan() {
      this.scan.push(this.input)
      console.log(this.scan)
      this.input = ''
    }
  }
}
</script>

