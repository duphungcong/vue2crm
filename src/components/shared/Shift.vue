<template>
  <v-container fluid grid-list-sm pa-0 ma-0>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card>
          <v-card-actions>
            <v-layout row wrap pr-2>
              <v-flex xs12>
                <v-tooltip bottom>
                  <v-btn outline block class="elevation-1" :class="{ currentShift: current }" slot="activator" >Shift {{ shift.number }}</v-btn>
                  <span>{{ date }}</span>
                </v-tooltip>
              </v-flex>
              <v-flex xs12>
                <v-btn block class="elevation-1" @click.native="changeElect" :class="{ green: shift.elect }">ELECT</v-btn>
              </v-flex>
              <v-flex xs12>
                <v-btn block :disabled="!shift.elect" class="elevation-1" @click.native="changeAir" :class="{ blue: shift.air }" >AIR</v-btn>
              </v-flex>
              <v-flex xs12>
                <v-btn block :disabled="!shift.elect" class="elevation-1" @click.native="changeHyd" :class="{ orange: shift.hyd }">HYD</v-btn>
              </v-flex>
            </v-layout>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'Shift',
  data () {
    return {}
  },
  props: {
    shift: {
      type: Object,
      default: () => {
        return { number: -1, elect: true, air: true, hyd: true }
      }
    },
    current: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    date: {
      type: String
    }
  },
  methods: {
    changeElect() {
      this.shift.elect = !this.shift.elect
      if (!this.shift.elect) {
        this.shift.air = false
        this.shift.hyd = false
      }
      this.$emit('change', { shift: this.shift })
    },
    changeAir() {
      this.shift.air = !this.shift.air
      this.$emit('change', { shift: this.shift })
    },
    changeHyd() {
      this.shift.hyd = !this.shift.hyd
      this.$emit('change', { shift: this.shift })
    }
  },
  created() {
    // console.log('Shift - created')
  }
}
</script>

<style scoped>
  .currentShift {
    border: 2px solid red !important;
  }
</style>


