<template>
  <v-container fluid grid-list-sm>
    <v-card>
      <v-layout row wrap align-baseline justify-space-around>
        <v-flex xs1>
          <span>{{ task.taskName }}</span>
        </v-flex>
        <v-flex xs1>
          <span>{{ task.zone }}</span>
        </v-flex>
        <v-flex xs1>
          <span>{{ task.taskType }}</span>
        </v-flex>
        <v-flex xs1>
          <span>{{ task.taskTitle }}</span>
        </v-flex>
        <v-flex xs1>
          <span>{{ task.zoneDivision }}</span>
        </v-flex>
        <v-flex xs2>
          <span>{{ task.remarks }}</span>
        </v-flex>
        <v-flex xs4>
          <v-select
            label="Select shifts"
            :items="shifts"
            v-model="task.shifts"
            item-text="number"
            item-value="number"
            multiple
            max-height="auto"
            autocomplete></v-select>
        </v-flex>
      </v-layout>
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
    },
    task: {
      type: Object,
      default: () => {
        return {
          amsMH: '1.65',
          hour: '3.42',
          macMH: '6.85',
          men: '2',
          remarks: 'NIL',
          taskID: '-L8zZuFh3Ugd-o9kq4_4',
          taskName: 'VN320000-01-1',
          taskTitle: 'MAIN LDG BRAKES',
          taskType: 'GVI',
          wpItem: 'VN00273522-2',
          zone: '700',
          zoneDivision: '500-600-700 LDG'
        }
      }
    }
  }
}
</script>

<style scoped>
  .btn{
    min-width: 0;
    width: 40px;
    display: inline-block;
  }
</style>


