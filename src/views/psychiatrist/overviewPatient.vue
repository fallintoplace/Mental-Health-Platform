<template>
  <div class="dashboard">
    <sidebar-menu :menu="menu" :width="'12rem'" />
    <toggle-switch
      :options="myOptions"
      v-model="toggle"
      @change="refetchData()"
    />

    <h1 class="dashboard__title">Statistics</h1>

    <h2>Filling frequencies of the respondents</h2>
    <div class="box__frequencies">
      <template v-if="toggle === 'PHQ-9'">
        <template v-if="loadingFillingFrequencies">
          <apexchart
            height="350px"
            width="800px"
            type="heatmap"
            :options="PHQ9chartOptions"
            :series="PHQ9series"
          ></apexchart>
        </template>
        <PuSkeleton circle height="350px" width="800px" v-else />
      </template>
      <template v-else-if="toggle === 'GAD-7'">
        <template v-if="loadingFillingFrequencies">
          <apexchart
            height="350px"
            width="700px"
            type="heatmap"
            :options="GAD7chartOptions"
            :series="GAD7series"
          ></apexchart>
        </template>
        <PuSkeleton circle height="350px" width="700px" v-else />
      </template>
    </div>

    <h2>Average Score for each Question</h2>
    <div class="box2">
      <template v-if="toggle === 'PHQ-9'">
        <template v-if="loadingAverageScore">
          <apexchart
            width="900"
            height="900"
            type="polarArea"
            :options="averageOptions"
            :series="averageSeries"
          ></apexchart>
        </template>
        <PuSkeleton circle height="490px" width="900px" v-else />
      </template>
      <template v-else-if="toggle === 'GAD-7'">
        <template v-if="loadingAverageScore">
          <apexchart
            width="800"
            height="800"
            type="polarArea"
            :options="GAD7AverageOptions"
            :series="GAD7AverageSeries"
          ></apexchart>
        </template>
        <PuSkeleton circle height="490px" width="800px" v-else />
      </template>
    </div>

    <h2>Device of the Respondents</h2>
    <div class="box3">
      <template v-if="loadingDevice">
        <apexchart
          type="pie"
          width="500"
          height="500"
          :options="chartOptionsDevice"
          :series="seriesDevice"
        ></apexchart>
      </template>
      <PuSkeleton circle height="370px" width="500px" v-else />
    </div>

    <h2>Geolocation of the Respondents</h2>
    <div class="box__country">
      <template v-if="loadingCountryData">
        <MapChart :countryData="countryData" />
      </template>
      <PuSkeleton circle height="590px" width="1000px" v-else />
    </div>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import MapChart from "vue-map-chart";
import { supabase } from "@/supabase/init";
import { mapGetters } from "vuex";

export default {
  metaInfo() {
    let title = "Statistics" + " (" + this.toggle + ")";

    return { title };
  },
  name: "Dashboard",
  components: {
    // MonthlySalesChart,
    MapChart,
    // Slide,
  },
  data() {
    return {
      myOptions: {
        layout: {
          color: "black",
          backgroundColor: "white",
          selectedColor: "white",
          selectedBackgroundColor: "green",
          borderColor: "black",
          fontFamily: "Calibri",
          fontWeight: "normal",
          fontWeightSelected: "bold",
          squareCorners: false,
          noBorder: true,
        },
        size: {
          fontSize: 0.9,
          height: 2,
          padding: 0.3,
          width: 8,
        },
        items: {
          delay: 0.4,
          disabled: false,
          labels: [
            {
              name: "PHQ-9",
              color: "black",
              backgroundColor: "lightgrey",
            },
            { name: "GAD-7", color: "black", backgroundColor: "lightgrey" },
          ],
        },
      },
      toggle: null,
      menu: [
        {
          header: true,
          title: "Main Navigation",
          hiddenOnCollapse: true,
        },
        {
          href: "/trackPatient",
          title: "Track Patient",
          icon: "fas fa-user",
        },
        {
          href: "/comparePatients",
          title: "Compare Patients",
          icon: "fas fa-user-friends",
        },
        {
          href: "/overviewPatient",
          title: "Statistics",
          icon: "fas fa-users",
        },
        {
          href: "/",
          title: "Exit",
          icon: "fas fa-sign-out-alt",
        },
      ],
      loadingFillingFrequencies: null,
      loadingCountryData: null,
      loadingAverageScore: null,
      loadingDevice: null,
      countryData: null,

      averageSeries: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      GAD7AverageSeries: [0, 0, 0, 0, 0, 0, 0],

      averageOptions: {
        yaxis: [
          {
            // min: 0,
            // max: 3,
            labels: {
              formatter: function (val) {
                return val.toFixed(2);
              },
            },
          },
        ],
        chart: {
          type: "polarArea",
        },
        labels: [
          "Little interest or pleasure in doing things",
          "Feeling down, depressed, or hopeless",
          "Trouble falling or staying asleep, or sleeping too much",
          "Feeling tired or having little energy",
          "Poor appetite or overeating",
          "Feeling bad about yourself",
          "Trouble concentrating on things",
          "Moving or speaking so slowly that other people could have noticed?",
          "Thoughts that you would be better off dead or of hurting yourself in some way",
        ],
        stroke: {
          colors: ["#fff"],
        },
        fill: {
          opacity: 0.8,
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
      },
      GAD7AverageOptions: {
        yaxis: [
          {
            // min: 0,
            // max: 3,
            labels: {
              formatter: function (val) {
                return val.toFixed(2);
              },
            },
          },
        ],
        chart: {
          type: "polarArea",
        },
        labels: [
          "Feeling nervous, anxious, or on edge",
          "Not being able to stop or control worrying",
          "Worrying too much about different things",
          "Trouble relaxing",
          "Being so restless that it is hard to sit still",
          "Becoming easily annoyed or irritable",
          "Feeling afraid, as if something awful might happen",
        ],
        stroke: {
          colors: ["#fff"],
        },
        fill: {
          opacity: 0.8,
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
      },

      PHQ9chartOptions: {
        chart: {
          toolbar: {
            show: false,
          },
          fontFamily: "Calibri",
        },
        dataLabels: {
          enabled: true,
        },
        colors: ["#fb0012"],
        xaxis: {
          type: "category",
          tickAmount: 10,
          tickPlacement: "on",
          labels: {
            show: true,
          },
          categories: [
            "Q1",
            "Q2",
            "Q3",
            "Q4",
            "Q5",
            "Q6",
            "Q7",
            "Q8",
            "Q9",
            "Q10",
          ],
        },
      },
      GAD7chartOptions: {
        chart: {
          toolbar: {
            show: false,
          },
          fontFamily: "Calibri",
        },
        dataLabels: {
          enabled: true,
        },
        colors: ["#fb0012"],
        xaxis: {
          type: "category",
          tickAmount: 10,
          tickPlacement: "on",
          labels: {
            show: true,
          },
          categories: ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7", "Q8"],
        },
      },

      PHQ9series: [
        {
          name: "Nearly everyday",
          data: [
            { x: "Q1", y: 30 },
            { x: "Q2", y: 30 },
            { x: "Q3", y: 25 },
            { x: "Q4", y: 20 },
            { x: "Q5", y: 10 },
            { x: "Q6", y: 35 },
            { x: "Q7", y: 20 },
            { x: "Q8", y: 40 },
            { x: "Q9", y: 5 },
            { x: "Q10", y: 20 },
          ],
        },
        {
          name: "More than half the days",
          data: [
            { x: "Q1", y: 40 },
            { x: "Q2", y: 20 },
            { x: "Q3", y: 25 },
            { x: "Q4", y: 30 },
            { x: "Q5", y: 10 },
            { x: "Q6", y: 20 },
            { x: "Q7", y: 20 },
            { x: "Q8", y: 40 },
            { x: "Q9", y: 5 },
            { x: "Q10", y: 30 },
          ],
        },
        {
          name: "Several days",
          data: [
            { x: "Q1", y: 20 },
            { x: "Q2", y: 20 },
            { x: "Q3", y: 25 },
            { x: "Q4", y: 40 },
            { x: "Q5", y: 40 },
            { x: "Q6", y: 25 },
            { x: "Q7", y: 35 },
            { x: "Q8", y: 10 },
            { x: "Q9", y: 35 },
            { x: "Q10", y: 25 },
          ],
        },
        {
          name: "Not at all",
          data: [
            { x: "Q1", y: 10 },
            { x: "Q2", y: 30 },
            { x: "Q3", y: 25 },
            { x: "Q4", y: 10 },
            { x: "Q5", y: 40 },
            { x: "Q6", y: 20 },
            { x: "Q7", y: 15 },
            { x: "Q8", y: 10 },
            { x: "Q9", y: 55 },
            { x: "Q10", y: 25 },
          ],
        },
      ],
      GAD7series: [
        {
          name: "Nearly everyday",
          data: [
            { x: "Q1", y: 30 },
            { x: "Q2", y: 30 },
            { x: "Q3", y: 25 },
            { x: "Q4", y: 20 },
            { x: "Q5", y: 10 },
            { x: "Q6", y: 35 },
            { x: "Q7", y: 20 },
            { x: "Q8", y: 40 },
          ],
        },
        {
          name: "More than half the days",
          data: [
            { x: "Q1", y: 40 },
            { x: "Q2", y: 20 },
            { x: "Q3", y: 25 },
            { x: "Q4", y: 30 },
            { x: "Q5", y: 10 },
            { x: "Q6", y: 20 },
            { x: "Q7", y: 20 },
            { x: "Q8", y: 40 },
          ],
        },
        {
          name: "Several days",
          data: [
            { x: "Q1", y: 20 },
            { x: "Q2", y: 20 },
            { x: "Q3", y: 25 },
            { x: "Q4", y: 40 },
            { x: "Q5", y: 40 },
            { x: "Q6", y: 25 },
            { x: "Q7", y: 35 },
            { x: "Q8", y: 10 },
          ],
        },
        {
          name: "Not at all",
          data: [
            { x: "Q1", y: 10 },
            { x: "Q2", y: 30 },
            { x: "Q3", y: 25 },
            { x: "Q4", y: 10 },
            { x: "Q5", y: 40 },
            { x: "Q6", y: 20 },
            { x: "Q7", y: 15 },
            { x: "Q8", y: 10 },
          ],
        },
      ],
      seriesDevice: [0, 0, 0],
      chartOptionsDevice: {
        chart: {
          width: 380,
          type: "pie",
        },
        labels: ["Desktop", "Phone", "Tablet"],
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(["getEmail"]),
  },
  created() {
    this.toggle = "PHQ-9";
    // this.menu[0].title = this.getEmail;
    this.fetchFillingFrequencies();
    this.fetchCountryData();
    this.fetchDevice();
  },
  methods: {
    refetchData() {
      // window.location.reload();
    },
    async fetchFillingFrequencies() {
      const { data: PHQ9Data, error: PHQ9Error } = await supabase.from(
        "responses"
      );
      // console.log(data);
      // console.log(error);
      let len = PHQ9Data.length;
      for (let i = 0; i < 10; i++) {
        if (i < 9) this.averageSeries[i] = 0;
        var total = 0;
        for (let v = 0; v < 4; v++) {
          this.PHQ9series[3 - v].data[i].y = 0;
          for (let j = 0; j < len; j++) {
            if (PHQ9Data[j]["q" + i] === v) {
              this.PHQ9series[3 - v].data[i].y++;
              if (i < 9) {
                total++;
                this.averageSeries[i] += v;
              }
            }
          }
        }
        if (total > 0 && i < 9) this.averageSeries[i] /= total;
      }

      const { data: GAD7Data, error: GAD7Error } = await supabase.from("GAD7");
      // console.log(GAD7Data);
      // console.log(error);
      len = GAD7Data.length;
      for (let i = 0; i < 8; i++) {
        if (i < 7) this.GAD7AverageSeries[i] = 0;
        total = 0;
        for (let v = 0; v < 4; v++) {
          this.GAD7series[3 - v].data[i].y = 0;
          for (let j = 0; j < len; j++) {
            if (GAD7Data[j]["q" + i] === v) {
              this.GAD7series[3 - v].data[i].y++;
              if (i < 7) {
                total++;
                this.GAD7AverageSeries[i] += v;
              }
            }
          }
        }
        if (total > 0 && i < 7) this.GAD7AverageSeries[i] /= total;
      }

      this.loadingFillingFrequencies = true;
      this.loadingAverageScore = true;
    },
    async fetchCountryData() {
      const { data, error } = await supabase
        .from("responses")
        .select("location");
      // console.log(data);
      // console.log(error);
      const occurrences = data.reduce(function (acc, curr) {
        return (
          !acc[curr.location] ? (acc[curr.location] = 1) : acc[curr.location]++,
          acc
        );
      }, {});

      this.countryData = occurrences;
      this.loadingCountryData = true;
    },
    async fetchDevice() {
      const { data, error } = await supabase.from("responses").select("device");
      // console.log(data);
      // console.log(error);
      for (let i = 0; i < data.length; i++) {
        if (data[i].device === "desktop") this.seriesDevice[0]++;
        if (data[i].device === "phone") this.seriesDevice[1]++;
        if (data[i].device === "tablet") this.seriesDevice[2]++;
      }
      this.loadingDevice = true;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/main.scss";

$block: ".dashboard";

#{$block} {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 60px);
  flex-direction: column;
  padding-bottom: 5rem;
  padding-top: 1rem;
  &__title {
    color: rgb(74, 57, 124);
  }
}
.box__country {
  border: 1px solid darkblue;
  height: 600px;
  width: 1000px;
  border-radius: 5px;
  margin-bottom: 2rem;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 12px 28px 0px,
    rgba(0, 0, 0, 0.1) 0px 2px 4px 0px,
    rgba(255, 255, 255, 0.05) 0px 0px 0px 1px inset;
  @include display-less(tablet) {
    width: 75%;
    overflow: auto;
  }
}

.box3 {
  border: 1px solid darkblue;
  // height: 380px;
  // width: 500px;
  border-radius: 5px;
  margin-bottom: 2rem;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 12px 28px 0px,
    rgba(0, 0, 0, 0.1) 0px 2px 4px 0px,
    rgba(255, 255, 255, 0.05) 0px 0px 0px 1px inset;
  @include display-less(tablet) {
    width: 75%;
    overflow: auto;
  }
}

.box2 {
  border: 1px solid darkblue;
  // height: 500px;
  // width: 1000px;
  border-radius: 5px;
  margin-bottom: 2rem;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 12px 28px 0px,
    rgba(0, 0, 0, 0.1) 0px 2px 4px 0px,
    rgba(255, 255, 255, 0.05) 0px 0px 0px 1px inset;
  @include display-less(tablet) {
    width: 75%;
    overflow: auto;
  }
}

.box__frequencies {
  border: 1px solid darkblue;
  // height: 360px;
  // width: 800px;
  border-radius: 5px;
  margin-bottom: 2rem;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 12px 28px 0px,
    rgba(0, 0, 0, 0.1) 0px 2px 4px 0px,
    rgba(255, 255, 255, 0.05) 0px 0px 0px 1px inset;
  @include display-less(tablet) {
    width: 75%;
    overflow: auto;
  }
}
</style>
