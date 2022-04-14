<template>
  <div class="dashboard">
    <sidebar-menu :menu="menu" :collapsed="true" />
    <!-- <Slide>
      <h3>Email: {{ getEmail }}</h3>
      <a id="track" href="/trackPatient">
        <span>Track Patient</span>
      </a>
      <a id="compare" href="/CompareGroup">
        <span>Compare Groups</span>
      </a>
      <a id="compare" href="/overviewPatient">
        <span>Overview</span>
      </a>
    </Slide> -->

    <p />

    <h1 :style="{ color: 'Purple' }">Statistical Dashboards</h1>


    <h2>Filling frequencies of the respondents</h2>
    <div class="box1">
      <template v-if="loadingFillingFrequencies">
        <apexchart
          width="800"
          height="350"
          type="heatmap"
          :options="chartOptions0"
          :series="series0"
        ></apexchart>
      </template>
      <PuSkeleton :count="18" v-else />
    </div>

    <!-- <p /> -->
    <!-- <h2 class="title is-5">Monthly Respondent Chart</h2> 
    <monthly-sales-chart></monthly-sales-chart> -->
    <!-- <p /> -->
    <h2>Average Score for each Question</h2>
    <div class="box2">
      <template v-if="loadingAverageScore">
        <apexchart
          width="1000"
          height="1000"
          type="polarArea"
          :options="timeTakenOptions"
          :series="series1"
        ></apexchart>
      </template>
      <PuSkeleton circle height="490px" width="1000px" v-else />
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
    <div class="box">
      <template v-if="loadingCountryData">
        <MapChart :countryData="countryData" />
      </template>
      <PuSkeleton circle height="590px" width="1000px" v-else />
    </div>
  </div>
</template>

<script>
// import MonthlySalesChart from "@/components/MonthlySalesChart";
import MapChart from "vue-map-chart";
// import { Slide } from "vue-burger-menu";
import { supabase } from "@/supabase/init";
import { mapGetters } from "vuex";

export default {
  name: "Dashboard",
  components: {
    // MonthlySalesChart,
    MapChart,
    // Slide,
  },
  data() {
    return {
      menu: [
        {
          header: true,
          title: "Main Navigation",
          hiddenOnCollapse: true,
        },
        {
          href: "/overviewPatient",
          title: "Overview Dashboard",
          icon: "fas fa-users",
        },
        {
          href: "/trackPatient",
          title: "Track Patient",
          icon: "fas fa-user",
        },
        // {
        //   href: "/comparePatient",
        //   title: "Compare Patient",
        //   icon: "fas fa-user-friends",
        // },
        {
          href: "/",
          title: "Log Out",
          icon: "fas fa-sign-out-alt",
        },
      ],
      loadingFillingFrequencies: null,
      loadingCountryData: null,
      loadingAverageScore: null,
      loadingDevice: null,
      countryData: null,

      series1: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      timeTakenOptions: {
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

      chartOptions0: {
        chart: {
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
        },
        // title: {
        //   text: "Filling frequencies of the respondents",
        //   align: "center",
        //   style: {
        //     fontSize: "22px",
        //   },
        // },
      },

      series0: [
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
      seriesDevice: [0, 0, 0],
      chartOptionsDevice: {
        chart: {
          width: 380,
          type: "pie",
        },
        labels: ["Desktop", "Mobile", "Tablet"],
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
    this.menu[0].title = this.getEmail;
    this.fetchFillingFrequencies();
    this.fetchCountryData();
    this.fetchDevice();
  },
  methods: {
    async fetchFillingFrequencies() {
      const { data, error } = await supabase.from("responses");
      console.log(data);
      console.log(error);
      let len = data.length;
      for (let i = 0; i < 10; i++) {
        if (i < 9) this.series1[i] = 0;
        var total = 0;
        for (let v = 0; v < 4; v++) {
          this.series0[3 - v].data[i].y = 0;
          for (let j = 0; j < len; j++) {
            // const { _data, _error, count } = await supabase.from("responses")
            //   .select("*", { count: "exact" , head: true})
            //   .eq("q" + i, v);
            // console.log(_data);
            // console.log(_error);
            // console.log(count);
            // console.log(data[j]["q" + i]);
            if (data[j]["q" + i] === v) {
              this.series0[3 - v].data[i].y++;
              if (i < 9) {
                total++;
                this.series1[i] += v;
              }
            }
          }
        }
        if (total > 0 && i < 9) this.series1[i] /= total;
      }
      this.loadingFillingFrequencies = true;
      this.loadingAverageScore = true;
    },
    async fetchCountryData() {
      const { data, error } = await supabase
        .from("responses")
        .select("location");
      console.log(data);
      console.log(error);
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
      console.log(data);
      console.log(error);
      for (let i = 0; i < data.length; i++) {
        if (data[i].device === "desktop") this.seriesDevice[0]++;
        if (data[i].device === "mobile") this.seriesDevice[1]++;
        if (data[i].device === "tablet") this.seriesDevice[2]++;
      }
      console.log(this.seriesDevice);
      this.loadingDevice = true;
    },
  },
};
</script>

<style lang="scss" scoped>
$block: ".dashboard";

#{$block} {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 60px);
  flex-direction: column;
  padding-bottom: 5rem;
}
.box {
  border: 1px solid darkblue;
  height: 600px;
  width: 1000px;
    border-radius: 5px;
    margin-bottom: 2rem;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 12px 28px 0px, rgba(0, 0, 0, 0.1) 0px 2px 4px 0px, rgba(255, 255, 255, 0.05) 0px 0px 0px 1px inset;
}

.box3 {
  border: 1px solid darkblue;
  height: 380px;
  width: 500px;
    border-radius: 5px;
    margin-bottom: 2rem;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 12px 28px 0px, rgba(0, 0, 0, 0.1) 0px 2px 4px 0px, rgba(255, 255, 255, 0.05) 0px 0px 0px 1px inset;
}

.box2 {
  border: 1px solid darkblue;
  height: 500px;
  width: 1000px;
    border-radius: 5px;
    margin-bottom: 2rem;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 12px 28px 0px, rgba(0, 0, 0, 0.1) 0px 2px 4px 0px, rgba(255, 255, 255, 0.05) 0px 0px 0px 1px inset;
}

.box1 {
  border: 1px solid darkblue;
  height: 360px;
  width: 800px;
    border-radius: 5px;
    margin-bottom: 2rem;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 12px 28px 0px, rgba(0, 0, 0, 0.1) 0px 2px 4px 0px, rgba(255, 255, 255, 0.05) 0px 0px 0px 1px inset;
}
</style>
