import 'chart.js'
import { Doughnut } from 'vue-chartjs'

export default Doughnut.extend({
  props: [
    'data'
  ],
  methods: {
    update() {
      this.renderChart(this.data, {responsive: true, maintainAspectRatio: false})
    }
  },
  mounted () {}
})
