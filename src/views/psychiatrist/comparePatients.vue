<template>
  <div class="home">
    <sidebar-menu :menu="menu" :collapsed="true" />
    <h1 :style="{ color: 'Purple' }">Compare Groups</h1>
    <h2>Comparison of the score frequencies between Male and Female</h2>
    <div v-if="isLoaded">
      
      <line-chart
        :width=800
        :labels="labels"
        :datasets="datasets"
        :options="options"
      ></line-chart>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { supabase } from "@/supabase/init";
import LineChart from "@/components/LineChart";

export default {
  created() {
    this.menu[0].title = this.getEmail;
    this.fetchData();
  },
  components: {
    LineChart,
  },
  methods: {
    async fetchData() {
      // eslint-disable-next-line no-unused-vars
      const { data, _ } = await supabase.from("patients").select("*");
      this.patients = data;
      // console.dir(this.patients); 

      // eslint-disable-next-line no-unused-vars
      const { data: temp, __ } = await supabase.from("responses").select("*");
      this.responses = temp;
      // console.dir(this.responses);
      var Map = {};
      for (let i = 0; i < this.patients.length; i++) {
        Map[this.patients[i].email] = this.patients[i].gender;
        console.log(this.patients[i]);
        console.log(Map[this.patients[i].email]);
      }
      for (let i = 0; i < 28; i++) {
        this.labels[i] = i;
        this.datasets[0].data[i] = 0;
        this.datasets[1].data[i] = 0;
      }
      for (let i = 0; i < this.responses.length; i++) {
        var totalScore = 0;
        totalScore += this.responses[i].q0;
        totalScore += this.responses[i].q1;
        totalScore += this.responses[i].q2;
        totalScore += this.responses[i].q3;
        totalScore += this.responses[i].q4;
        totalScore += this.responses[i].q5;
        totalScore += this.responses[i].q6;
        totalScore += this.responses[i].q7;
        totalScore += this.responses[i].q8;
        if (Map[this.responses[i].email] === "Male")
          this.datasets[0].data[totalScore]++;
        else 
          this.datasets[1].data[totalScore]++;
      }
      this.isLoaded = true;
      // console.dir(this.datasets[0].data);
    },
  },
  computed: {
    ...mapGetters(["getEmail"]),
  },
  data() {
    return {
      isLoaded: null,
      patients: null,
      responses: null,
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                precision: 0,
                beginAtZero: true,
              },
            },
          ],
        },
      },
      labels: [],
      datasets: [
        {
          data: [],
          label: "Male",
          borderColor: "rgba(50, 115, 220, 0.5)",
          backgroundColor: "rgba(50, 115, 220, 0.1)",
        },
        {
          data: [],
          label: "Female",

          borderColor: "rgba(255, 56, 96, 0.5)",
          backgroundColor: "rgba(255, 56, 96, 0.1)",
        },
      ],
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
        {
          href: "/comparePatients",
          title: "Compare Patients",
          icon: "fas fa-user-friends",
        },
        {
          href: "/",
          title: "Log Out",
          icon: "fas fa-sign-out-alt",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 60px);
  flex-direction: column;
  padding-bottom: 5rem;
}
</style>
