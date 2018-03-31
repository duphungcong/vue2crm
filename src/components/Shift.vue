<template>
  <v-container grid-list-sm mx-0 px-0>
      <v-card>
        <v-card-actions>
          <v-layout row wrap pr-2>
            <v-flex lg12 md12 xs12>
              <v-btn flat block class="elevation-1">Shift {{ number }}</v-btn>
            </v-flex>
            <v-flex lg12 md12 xs12>
              <v-btn block class="elevation-1" @click.native="changeElect" :class="{ green: status.elect }">ELECT</v-btn>
            </v-flex>
            <v-flex lg12 md12 xs12>
              <v-btn block class="elevation-1" @click.native="changeAir" :class="{ blue: status.air }" >AIR</v-btn>
            </v-flex>
            <v-flex lg12 md12 xs12>
              <v-btn block class="elevation-1" @click.native="changeHyd" :class="{ orange: status.hyd }">HYD</v-btn>
            </v-flex>
          </v-layout>
        </v-card-actions>
      </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'Shift',
  data () {
    return {}
  },
  props: {
    number: {
      type: Number,
      default: () => {
        return 0
      }
    },
    status: {
      type: Object,
      default: () => {
        return { elect: true, air: true, hyd: true }
      }
    }
  },
  methods: {
    changeElect() {
      this.status.elect = !this.status.elect
      this.$emit('change', { status: this.status, number: this.number })
    },
    changeAir() {
      this.status.air = !this.status.air
      this.$emit('change', { status: this.status, number: this.number })
    },
    changeHyd() {
      this.status.hyd = !this.status.hyd
      this.$emit('change', { status: this.status, number: this.number })
    }
  },
  created() {
    console.log('Shift - created')
  }
}
</script>

