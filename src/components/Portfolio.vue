<template>
  <div>
    <!-- {{ value }} -->
    <template v-if="dataLoaded">
      <apexchart
        type="heatmap"
        height="80"
        width="500"
        :options="chartOptions"
        :series="series"
      ></apexchart>
    </template>
  </div>
</template>

<script>
export default {
  name: "Portfolio",
  props: {
    value: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    this.series[0].data[0] = this.value.q1;
    this.series[0].data[1] = this.value.q2;
    this.series[0].data[2] = this.value.q3;
    this.series[0].data[3] = this.value.q4;
    this.series[0].data[4] = this.value.q5;
    this.series[0].data[5] = this.value.q6;
    this.series[0].data[6] = this.value.q7;
    this.series[0].data[7] = this.value.q8;
    this.series[0].data[8] = this.value.q9;
    this.dataLoaded = true;
  },
  data() {
    return {
      dataLoaded: false,
      series: [
        {
          data: [],
        },
      ],
      chartOptions: {
        chart: {
          type: "heatmap",
          toolbar: {
            show: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        colors: ["#fb0012"],
        xaxis: {
          type: "category",
          tickAmount: 9,
          tickPlacement: "on",
          labels: {
            show: false,
          },
        },
        yaxis: {
          labels: {
            show: false,
          },
        },

      },
    };
  },
};
</script>

<style lang="scss" scoped></style>
