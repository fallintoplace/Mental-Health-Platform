<template>
  <div class="home">
    <sidebar-menu :menu="menu" :width="'12rem'" />
    <toggle-switch :options="myOptions" v-model="toggle" />
    <h1 class="home__title">Compare Patients</h1>
    <h2>Score frequencies of Male and Female (Normalized)</h2>
    <div>
      <div v-if="toggle === 'PHQ-9'" class="box__gender">
        <template v-if="isLoaded">
          <line-chart
            :width="800"
            :labels="labels"
            :datasets="datasets"
            :options="options"
          ></line-chart>
        </template>
        <PuSkeleton circle height="350px" width="800px" v-else />
      </div>
    </div>
    <div>
      <div v-if="toggle === 'GAD-7'" class="box__gender">
        <template v-if="GAD7_isLoaded">
          <line-chart
            :width="800"
            :labels="GAD7_labels"
            :datasets="GAD7_datasets"
            :options="GAD7_options"
          ></line-chart>
        </template>
        <PuSkeleton circle height="350px" width="800px" v-else />
      </div>
    </div>
    <!-- ------------------------------------------ -->
    <h2>Custom patients comparison</h2>
    <template v-if="isLoaded">
      <div v-for="(patient, index) in patients" :key="index" class="container">
        <div class="home__member">
          {{ patient.email }}
          <toggle-switch
            :options="memberOptions"
            :group="patient.email"
            v-model="memberToggle[index]"
            @change="recountMember"
          />
        </div>
      </div>
      <div>
        <div v-if="toggle === 'PHQ-9'" class="box__gender">
          <line-chart
            :width="800"
            :labels="labels"
            :datasets="phq9_group_datasets"
            :options="options"
            :key="componentKey"
          ></line-chart>
        </div>
      </div>
      <div>
        <div v-if="toggle === 'GAD-7'" class="box__gender">
          <line-chart
            :width="800"
            :labels="GAD7_labels"
            :datasets="gad7_group_datasets"
            :options="GAD7_options"
            :key="componentKey"
          ></line-chart>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// import { supabase } from "@/supabase/init";
import LineChart from "@/components/LineChart";

export default {
  metaInfo() {
    let title = "Compare Patients" + " (" + this.toggle + ")";

    return { title };
  },
  created() {
    // this.menu[0].title = this.getEmail;
    this.fetchData();
  },
  components: {
    LineChart,
  },
  methods: {
    recountMember() {
      var Map = {};
      for (let i = 0; i < this.patients.length; i++) {
        Map[this.patients[i].email] = this.memberToggle[i];
      }
      for (let i = 0; i < 28; i++) {
        this.phq9_group_datasets[0].data[i] = 0;
        this.phq9_group_datasets[1].data[i] = 0;
        this.phq9_group_datasets[2].data[i] = 0;
      }
      for (let i = 0; i < this.responses.length; i++) {
        let totalScore = 0;
        totalScore += this.responses[i].q0;
        totalScore += this.responses[i].q1;
        totalScore += this.responses[i].q2;
        totalScore += this.responses[i].q3;
        totalScore += this.responses[i].q4;
        totalScore += this.responses[i].q5;
        totalScore += this.responses[i].q6;
        totalScore += this.responses[i].q7;
        totalScore += this.responses[i].q8;
        if (Map[this.responses[i].email] === "Group 1")
          this.phq9_group_datasets[0].data[totalScore]++;
        else if (Map[this.responses[i].email] === "Group 2")
          this.phq9_group_datasets[1].data[totalScore]++;
        else if (Map[this.responses[i].email] === "Group 3")
          this.phq9_group_datasets[2].data[totalScore]++;
      }
      var sum = { data0: 0, data1: 0, data2: 0 };
      for (let i = 0; i < 28; i++) {
        sum.data0 += this.phq9_group_datasets[0].data[i];
        sum.data1 += this.phq9_group_datasets[1].data[i];
        sum.data2 += this.phq9_group_datasets[2].data[i];
      }
      for (let i = 0; i < 28; i++) {
        if (sum.data0 > 0) this.phq9_group_datasets[0].data[i] /= sum.data0;
        if (sum.data1 > 0) this.phq9_group_datasets[1].data[i] /= sum.data1;
        if (sum.data2 > 0) this.phq9_group_datasets[2].data[i] /= sum.data2;
      }
      //-------------------------------------------
      for (let i = 0; i < 22; i++) {
        this.gad7_group_datasets[0].data[i] = 0;
        this.gad7_group_datasets[1].data[i] = 0;
        this.gad7_group_datasets[2].data[i] = 0;
      }
      for (let i = 0; i < this.GAD7_responses.length; i++) {
        let totalScore = 0;

        totalScore += this.GAD7_responses[i].q0;
        totalScore += this.GAD7_responses[i].q1;
        totalScore += this.GAD7_responses[i].q2;
        totalScore += this.GAD7_responses[i].q3;
        totalScore += this.GAD7_responses[i].q4;
        totalScore += this.GAD7_responses[i].q5;
        totalScore += this.GAD7_responses[i].q6;
        if (Map[this.GAD7_responses[i].email] === "Group 1")
          this.gad7_group_datasets[0].data[totalScore]++;
        if (Map[this.GAD7_responses[i].email] === "Group 2")
          this.gad7_group_datasets[1].data[totalScore]++;
        if (Map[this.GAD7_responses[i].email] === "Group 3")
          this.gad7_group_datasets[2].data[totalScore]++;
      }
      sum = { data0: 0, data1: 0, data2: 0 };
      for (let i = 0; i < 22; i++) {
        sum.data0 += this.gad7_group_datasets[0].data[i];
        sum.data1 += this.gad7_group_datasets[1].data[i];
        sum.data2 += this.gad7_group_datasets[2].data[i];
      }
      for (let i = 0; i < 22; i++) {
        if (sum.data0 > 0) this.gad7_group_datasets[0].data[i] /= sum.data0;
        if (sum.data1 > 0) this.gad7_group_datasets[1].data[i] /= sum.data1;
        if (sum.data2 > 0) this.gad7_group_datasets[2].data[i] /= sum.data2;
      }
      this.componentKey += 1;
    },
    async fetchData() {
      // eslint-disable-next-line no-unused-vars
      // const { data, _ } = await supabase.from("patients").select("*");
      // this.patients = data;
      // // console.dir(this.patients);
      this.patients = [
        {
          email: "a",
          gender: "Male",
        },
        {
          email: "b",
          gender: "Female",
        },
        {
          email: "c",
          gender: "Male",
        },
      ];
      this.GAD7_responses = this.responses = [
        {
          email: "a",
          q0: 0,
          q1: 0,
          q2: 1,
          q3: 0,
          q4: 0,
          q5: 0,
          q6: 0,
          q7: 0,
          q8: 0,
          q9: 0,
        },
        {
          email: "b",
          q0: 1,
          q1: 2,
          q2: 1,
          q3: 2,
          q4: 3,
          q5: 0,
          q6: 2,
          q7: 1,
          q8: 0,
          q9: 1,
        },
        {
          email: "c",
          q0: 0,
          q1: 1,
          q2: 2,
          q3: 3,
          q4: 0,
          q5: 0,
          q6: 2,
          q7: 1,
          q8: 0,
          q9: 1,
        },
        {
          email: "a",
          q0: 0,
          q1: 0,
          q2: 1,
          q3: 0,
          q4: 0,
          q5: 3,
          q6: 2,
          q7: 0,
          q8: 1,
          q9: 0,
        },
        {
          email: "b",
          q0: 1,
          q1: 0,
          q2: 1,
          q3: 2,
          q4: 0,
          q5: 2,
          q6: 2,
          q7: 1,
          q8: 0,
          q9: 1,
        },
        {
          email: "c",
          q0: 0,
          q1: 1,
          q2: 0,
          q3: 0,
          q4: 0,
          q5: 0,
          q6: 2,
          q7: 1,
          q8: 0,
          q9: 1,
        },
      ];

      // // eslint-disable-next-line no-unused-vars
      // const { data: temp, __ } = await supabase.from("phq9").select("*");
      // this.responses = temp;
      // // console.dir(this.responses);

      // // eslint-disable-next-line no-unused-vars
      // const { data: GAD7_temp, ____ } = await supabase.from("gad7").select("*");
      // this.GAD7_responses = GAD7_temp;
      // // console.dir(this.responses);

      //--------------------------------------

      var Map = {};
      for (let i = 0; i < this.patients.length; i++) {
        Map[this.patients[i].email] = this.patients[i].gender;
        // console.log(this.patients[i]);
        // console.log(Map[this.patients[i].email]);
      }
      for (let i = 0; i < 28; i++) {
        this.labels[i] = i;
        this.datasets[0].data[i] = 0;
        this.datasets[1].data[i] = 0;
      }
      for (let i = 0; i < this.responses.length; i++) {
        let totalScore = 0;
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
        else if (Map[this.responses[i].email] === "Female")
          this.datasets[1].data[totalScore]++;
      }

      var sum = { data0: 0, data1: 0 };
      for (let i = 0; i < 28; i++) {
        sum.data0 += this.datasets[0].data[i];
        sum.data1 += this.datasets[1].data[i];
      }
      for (let i = 0; i < 28; i++) {
        if (sum.data0 > 0) this.datasets[0].data[i] /= sum.data0;
        if (sum.data1 > 0) this.datasets[1].data[i] /= sum.data1;
      }

      //-------------------------------------------
      for (let i = 0; i < 22; i++) {
        this.GAD7_labels[i] = i;
        this.GAD7_datasets[0].data[i] = 0;
        this.GAD7_datasets[1].data[i] = 0;
      }
      for (let i = 0; i < this.GAD7_responses.length; i++) {
        let totalScore = 0;
        totalScore += this.GAD7_responses[i].q0;
        totalScore += this.GAD7_responses[i].q1;
        totalScore += this.GAD7_responses[i].q2;
        totalScore += this.GAD7_responses[i].q3;
        totalScore += this.GAD7_responses[i].q4;
        totalScore += this.GAD7_responses[i].q5;
        totalScore += this.GAD7_responses[i].q6;
        if (Map[this.GAD7_responses[i].email] === "Male")
          this.GAD7_datasets[0].data[totalScore]++;
        else if (Map[this.GAD7_responses[i].email] === "Female")
          this.GAD7_datasets[1].data[totalScore]++;
      }

      sum = { data0: 0, data1: 0 };
      for (let i = 0; i < 22; i++) {
        sum.data0 += this.GAD7_datasets[0].data[i];
        sum.data1 += this.GAD7_datasets[1].data[i];
      }
      for (let i = 0; i < 22; i++) {
        if (sum.data0 > 0) this.GAD7_datasets[0].data[i] /= sum.data0;
        if (sum.data1 > 0) this.GAD7_datasets[1].data[i] /= sum.data1;
      }

      this.isLoaded = true;
      this.GAD7_isLoaded = true;
      // console.dir(this.datasets[0].data);
    },
  },
  computed: {
    ...mapGetters(["getEmail"]),
  },
  data() {
    return {
      componentKey: 0,
      custom_phq9_loaded: null,
      custom_gad7_loaded: null,
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
          preSelected: "PHQ-9",
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
      memberOptions: {
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
          noBorder: false,
        },
        size: {
          fontSize: 0.7,
          height: 2,
          padding: 0.3,
          width: 20,
        },
        items: {
          delay: 0.4,
          disabled: false,
          preSelected: "None",
          labels: [
            {
              name: "None",
              color: "black",
              backgroundColor: "lightgrey",
            },
            { name: "Group 1", color: "black", backgroundColor: "lightblue" },
            { name: "Group 2", color: "black", backgroundColor: "pink" },
            { name: "Group 3", color: "black", backgroundColor: "lightgreen" },
          ],
        },
      },
      toggle: null,
      isLoaded: null,
      GAD7_isLoaded: null,
      patients: [],
      responses: [],
      memberToggle: [],
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                callback: function (value) {
                  return (value * 100).toFixed(0) + "%"; // convert it to percentage
                },
              },
            },
          ],
        },
      },
      GAD7_options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
      labels: [],
      GAD7_labels: [],
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
      phq9_group_datasets: [
        {
          data: [],
          label: "Group 1",
          borderColor: "rgba(50, 115, 220, 0.5)",
          backgroundColor: "rgba(50, 115, 220, 0.1)",
        },
        {
          data: [],
          label: "Group 2",

          borderColor: "rgba(255, 56, 96, 0.5)",
          backgroundColor: "rgba(255, 56, 96, 0.1)",
        },
        {
          data: [],
          label: "Group 3",
          borderColor: "rgb(50, 205, 50, 0.5)",
          backgroundColor: "rgb(50, 205, 50, 0.1)",
        },
      ],
      gad7_group_datasets: [
        {
          data: [],
          label: "Group 1",
          borderColor: "rgba(50, 115, 220, 0.5)",
          backgroundColor: "rgba(50, 115, 220, 0.1)",
        },
        {
          data: [],
          label: "Group 2",
          borderColor: "rgba(255, 56, 96, 0.5)",
          backgroundColor: "rgba(255, 56, 96, 0.1)",
        },
        {
          data: [],
          label: "Group 3",
          borderColor: "rgb(50, 205, 50, 0.5)",
          backgroundColor: "rgb(50, 205, 50, 0.1)",
        },
      ],
      GAD7_datasets: [
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
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/main.scss";
.home {
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
  &__member {
    font-size: var(--font-size-big);
    font-weight: bold;
    display: flex;
    // column-count: 2;
    color: rgb(74, 57, 124);
    justify-content: center;
    align-items: center;
    gap: 1rem;
    // flex-direction: column;
    margin-bottom: 0.2rem;
  }
}

.box__gender {
  border: 1px solid darkblue;
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
