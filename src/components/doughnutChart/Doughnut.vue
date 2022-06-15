<template>
  <div style="max-width: 25vw;">
    <DoughnutChart :data="chartData" :options="chartOptions" />
  </div>
</template>

<script>
import DoughnutChart from "./DoughnutChart";
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  components: {
    DoughnutChart,
  },
  data() {
    return {
      chartOptions: {
        hoverBorderWidth: 20,
      },
      chartData: {
        responsive: true,
        maintainAspectRatio: false,
        labels: ["Approved", "Rejected", "Duplicate","Pending"],
        datasets: [
          {
            label: "Data One",
            backgroundColor: ["#6ce588","#ff5f70", '#f2c037',"#76a0e4"],
            data: [],
          },
        ],
      },
    };
  },
  created() {
    if (this.data) 
      this.chartData.datasets[0].data = this.data;
    else 
      this.chartData.datasets[0].data = [0, 0, 0, 0];
  }
};
</script>

<style></style>
