<template>
  <div>
    <!-- <div class="field is-grouped">
      <div class="control">
        <label class="checkbox">
          <input type="checkbox" :value="2020" v-model="selectedYears" />
          2020 Respondents
        </label>
      </div>
      <div class="control">
        <label class="checkbox">
          <input type="checkbox" :value="2021" v-model="selectedYears" />
          2021 Respondents
        </label>
      </div>
      <div class="control">
        <label class="checkbox">
          <input type="checkbox" :value="2022" v-model="selectedYears" />
          2022 Respondents
        </label>
      </div>
    </div> -->

    <line-chart
      :width="800"
      :height="400"
      :labels="[
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ]"
      :datasets="displayedDatasets"
      :options="options"
    ></line-chart>
  </div>
</template>

<script>
// import numeral from "numeral";
import LineChart from "./LineChart";

const datasets = {
  2020: {
    label: "2020 Respondents",
    borderColor: "rgba(50, 115, 220, 0.5)",
    backgroundColor: "rgba(50, 115, 220, 0.1)",
    data: [300, 700, 450, 750, 450, 360, 700, 230, 500, 820, 100, 400],
  },
  2021: {
    label: "2021 Respondents",
    borderColor: "rgba(255, 56, 96, 0.5)",
    backgroundColor: "rgba(255, 56, 96, 0.1)",
    data: [600, 550, 750, 250, 700, 300, 700, 450, 750, 450, 650, 450],
  },
  2022: {
    label: "2022 Respondents",
    borderColor: "rgba(78, 48, 23, 0.5)",
    backgroundColor: "rgba(78, 48, 23, 0.1)",
    data: [400, 450, 250],
  },
};

const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
          // callback: (value) => numeral(value).format("0,0"),
        },
      },
    ],
  },
  // tooltips: {
  //   mode: "index",
  //   callbacks: {
  //     label(tooltipItem, data) {
  //       const label = data.datasets[tooltipItem.datasetIndex].label;
  //       const value = numeral(tooltipItem.yLabel).format("0");

  //       return `${label}: ${value}`;
  //     },
  //   },
  // },
};

export default {
  name: "monthly-sales-chart",
  datasets,
  options,
  components: {
    LineChart,
  },
  data() {
    return {
      selectedYears: [2020, 2021, 2022],
    };
  },
  computed: {
    displayedDatasets() {
      return this.selectedYears.map((year) => datasets[year]);
    },
  },
};
</script>
