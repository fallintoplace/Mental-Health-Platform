<template>
  <div class="home">
    <sidebar-menu :menu="menu" :collapsed="true" />
    <h1 class="home__title">Track Patient</h1>
    <div class="namebox">
      <input type="text" placeholder="Email" v-model="email" />
    </div>

    <div class="searchButtons">
      <button
        class="button-80"
        role="button"
        @click="
          searchPatient(email, name, surname);
          toggled.fill(false);
        "
      >
        Search Patient
      </button>

      <button
        class="button-80"
        role="button"
        @click="
          searchPatient(null, null, null);
          toggled.fill(false);
        "
      >
        Patient List
      </button>
    </div>

    <div v-for="(patient, index) in patients" :key="index" class="container">
      <!-- {{ patient.email }}
      {{ index }} -->
      <button
        class="button-4"
        role="button"
        @click="
          searchResponses(patient.email);
          indexToggle(index);
        "
      >
        {{ patient.email }}
      </button>

      <div v-show="toggled[index]" class="box">
        <div class="box__table">
          <ve-table :columns="columns" :table-data="responses" />
        </div>
        <div class="box__table">
          <line-chart
            :labels="labels"
            :datasets="datasets"
            :options="options"
          ></line-chart>
        </div>
        <!-- <div class="box__table">
          <line-chart
            :labels="labels"
            :datasets="datasets1"
            :options="options1"
          ></line-chart>
        </div> -->
        <div class="box__table">
          <ve-table :columns="columns" :table-data="GAD7Responses" />
        </div>
        <div class="box__table">
          <line-chart
            :labels="GAD7_labels"
            :datasets="GAD7_datasets"
            :options="GAD7_options"
          ></line-chart>
        </div>
        <!-- <div class="box__table">
          <line-chart
            :labels="GAD7_labels"
            :datasets="GAD7_datasets1"
            :options="GAD7_options1"
          ></line-chart>
        </div> -->

        <div v-for="(response, index) in responses" :key="index">
          <!-- {{ response }} -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from "@/supabase/init";
import { mapGetters } from "vuex";
import LineChart from "@/components/LineChart";

export default {
  metaInfo() {
    let title = "Track Patient";
    if (this.currentEmail) title += " (" + this.currentEmail + ")";
    return { title };
  },
  name: "SinglePatient",
  components: {
    LineChart,
  },
  data() {
    return {
      currentEmail: null,
      columns: [
        { field: "email", key: "a", title: "Type", align: "center" },
        { field: "q0", key: "b", title: "Q1", align: "center" },
        { field: "q1", key: "c", title: "Q2", align: "center" },
        { field: "q2", key: "d", title: "Q3", align: "center" },
        { field: "q3", key: "e", title: "Q4", align: "center" },
        { field: "q4", key: "f", title: "Q5", align: "center" },
        { field: "q5", key: "g", title: "Q6", align: "center" },
        { field: "q6", key: "h", title: "Q7", align: "center" },
        { field: "q7", key: "i", title: "Q8", align: "center" },
        { field: "q8", key: "j", title: "Q9", align: "center" },
        { field: "q9", key: "o", title: "Q10", align: "center" },
        { field: "total_score", key: "n", title: "Score", align: "center" },
        {
          field: "time_completion",
          key: "k",
          title: "Time Completion",
          align: "center",
        },
        { field: "datestamp", key: "l", title: "Datestamp", align: "center" },
        { field: "timestamp", key: "m", title: "Timestamp", align: "center" },
      ],

      series: [
        {
          name: null,
          data: [],
        },
      ],
      chartOptions: {
        chart: {
          height: 350,
          type: "heatmap",
        },
        dataLabels: {
          enabled: false,
        },
        colors: ["#008FFB"],
        title: {
          text: null,
        },
      },
      labels: [],
      GAD7_labels: [],
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                max: 30,
              },
            },
          ],
        },
      },
      options1: {
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
      GAD7_options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                max: 25,
              },
            },
          ],
        },
      },
      GAD7_options1: {
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
      datasets: [
        {
          data: [],
          label: "Score PHQ-9",
          borderColor: "rgba(50, 115, 220, 0.5)",
          backgroundColor: "rgba(50, 115, 220, 0.1)",
        },
      ],
      datasets1: [
        {
          data: [],
          label: "Time Completion PHQ-9",
          borderColor: "rgba(50, 115, 220, 0.5)",
          backgroundColor: "rgba(50, 115, 220, 0.1)",
        },
      ],
      GAD7_datasets: [
        {
          data: [],
          label: "Score GAD-7",
          borderColor: "rgba(255, 56, 96, 0.5)",
          backgroundColor: "rgba(255, 56, 96, 0.1)",
        },
      ],
      GAD7_datasets1: [
        {
          data: [],
          label: "Time Completion GAD-7",
          
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
      responsesLoaded: null,
      patients: null,
      responses: null,
      GAD7Responses: null,
      email: null,
      name: null,
      surname: null,
      toggled: [],
    };
  },
  created() {
    this.menu[0].title = this.getEmail;
  },
  computed: {
    ...mapGetters(["getEmail"]),
  },
  methods: {
    async searchPatient(email, name, surname) {
      if (email && name && surname) {
        const { data, error } = await supabase
          .from("patients")
          .select("*")
          .like("email", "%" + email + "%")
          .like("name", "%" + name + "%")
          .like("surname", "%" + surname + "%");
        if (error) throw error;
        this.patients = data;
      } else if (email && name) {
        const { data, error } = await supabase
          .from("patients")
          .select("*")
          .like("email", "%" + email + "%")
          .like("name", "%" + name + "%");
        if (error) throw error;
        this.patients = data;
      } else if (email && surname) {
        const { data, error } = await supabase
          .from("patients")
          .select("*")
          .like("email", "%" + email + "%")
          .like("surname", "%" + surname + "%");
        if (error) throw error;
        this.patients = data;
      } else if (name && surname) {
        const { data, error } = await supabase
          .from("patients")
          .select("*")
          .like("name", "%" + name + "%")
          .like("surname", "%" + surname + "%");
        if (error) throw error;
        this.patients = data;
      } else if (email) {
        const { data, error } = await supabase
          .from("patients")
          .select("*")
          .like("email", "%" + email + "%");
        if (error) throw error;
        this.patients = data;
      } else if (name) {
        const { data, error } = await supabase
          .from("patients")
          .select("*")
          .like("name", "%" + name + "%");
        if (error) throw error;
        this.patients = data;
      } else if (surname) {
        const { data, error } = await supabase
          .from("patients")
          .select("*")
          .like("surname", "%" + surname + "%");
        if (error) throw error;
        this.patients = data;
      } else {
        const { data, error } = await supabase.from("patients").select("*");
        if (error) throw error;
        this.patients = data;
      }
    },
    async searchResponses(email) {
      this.currentEmail = email;
      const { data: PHQ9Data, error: PHQ9Error } = await supabase
        .from("responses")
        .select("*")
        .like("email", "%" + email + "%");
      const { data: GAD7Data, error: GAD7Error } = await supabase
        .from("GAD7")
        .select("*")
        .like("email", "%" + email + "%");
      if (PHQ9Error) throw PHQ9Error;
      if (GAD7Error) throw GAD7Error;
      this.responses = PHQ9Data;
      this.labels.length = 0;
      this.datasets[0].data.length = 0;
      this.datasets1[0].data.length = 0;
      for (let i = 0; i < this.responses.length; i++) {
        this.responses[i].email = "PHQ-9";
        this.labels[i] = this.responses[i].datestamp;
        this.datasets1[0].data[i] = this.responses[i].time_completion;
        this.datasets[0].data[i] =
          this.responses[i].q0 +
          this.responses[i].q1 +
          this.responses[i].q2 +
          this.responses[i].q3 +
          this.responses[i].q4 +
          this.responses[i].q5 +
          this.responses[i].q6 +
          this.responses[i].q7 +
          this.responses[i].q8;
      }

      this.GAD7Responses = GAD7Data;
      this.GAD7_labels.length = 0;
      this.GAD7_datasets[0].data.length = 0;
      this.GAD7_datasets1[0].data.length = 0;
      for (let i = 0; i < this.GAD7Responses.length; i++) {
        this.GAD7Responses[i].email = "GAD-7";
        this.GAD7_labels[i] = this.GAD7Responses[i].datestamp;

        this.GAD7_datasets1[0].data[i] = this.GAD7Responses[i].time_completion;
        this.GAD7_datasets[0].data[i] =
          this.GAD7Responses[i].q0 +
          this.GAD7Responses[i].q1 +
          this.GAD7Responses[i].q2 +
          this.GAD7Responses[i].q3 +
          this.GAD7Responses[i].q4 +
          this.GAD7Responses[i].q5 +
          this.GAD7Responses[i].q6;
      }

    },
    indexToggle(index) {
      // this.toggled.fill(false);
      // this.toggled[index] = !this.toggled[index];
      if (!this.toggled[index]) {
        this.toggled.fill(false);
        this.toggled[index] = !this.toggled[index];
      } else if (this.toggled[index]) {
        this.currentEmail = null;
        this.toggled[index] = !this.toggled[index];
      }
    },
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
  padding-top: 5rem;
  padding-bottom: 5rem;
  &__title {
    color: rgb(74, 57, 124);
  }
}



.container {
  display: block;
  margin-top: 1rem;
  text-align: center;
  // flex-direction: column;
}

.searchButtons {
  margin-top: 1rem;
  
  // @include display-less(tablet) {
  //   width: 100%;
  //   overflow: auto;
  // }
  // display: flex;
  
  // justify-content: space-between;
}

.box {
  width: 850px;
  

  // text-align: center;
  // align-items: center;
  // display: flex;
  // justify-content: center;
  // flex-direction: column;
  @include display-less(tablet) {
    // width: 100%;
    overflow: auto;
  }

}

input[type="text"] {
  width: 300px;
  border: 2px solid #aaa;
  border-radius: 4px;
  outline: none;
  padding: 8px;
  box-sizing: border-box;
  transition: 0.3s;
  font-family: "Roboto", sans-serif;
  font-size: 1.2rem;
}

input[type="text"]:focus {
  border-color: dodgerBlue;
  box-shadow: 0 0 8px 0 dodgerBlue;
}

.namebox {
  // width: 280px;
  // height: 50px;
  // margin-bottom: 10px;
}

.box__table {
  border: 1px solid darkblue;
  // width: 200px;
  border-radius: 5px;
  margin-top: 1rem;
  margin-bottom: 1rem;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 12px 28px 0px,
    rgba(0, 0, 0, 0.1) 0px 2px 4px 0px,
    rgba(255, 255, 255, 0.05) 0px 0px 0px 1px inset;
  @include display-less(tablet) {
    overflow: auto;
    width: 75%;
  }
  
}

// <!-- HTML !-->
// <button class="button-4" role="button">Button 4</button>

/* CSS */
.button-4 {
  appearance: none;
  background-color: #fafbfc;
  border: 1px solid rgba(27, 31, 35, 0.15);
  border-radius: 6px;
  box-shadow: rgba(27, 31, 35, 0.04) 0 1px 0,
    rgba(255, 255, 255, 0.25) 0 1px 0 inset;
  box-sizing: border-box;
  color: #24292e;
  cursor: pointer;
  display: inline-block;
  font-family: -apple-system, system-ui, "Segoe UI", Helvetica, Arial,
    sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  list-style: none;
  padding: 6px 16px;
  position: relative;
  transition: background-color 0.2s cubic-bezier(0.3, 0, 0.5, 1);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: middle;
  white-space: nowrap;
  word-wrap: break-word;
}

.button-4:hover {
  background-color: #f3f4f6;
  text-decoration: none;
  transition-duration: 0.1s;
}

.button-4:disabled {
  background-color: #fafbfc;
  border-color: rgba(27, 31, 35, 0.15);
  color: #959da5;
  cursor: default;
}

.button-4:active {
  background-color: #edeff2;
  box-shadow: rgba(225, 228, 232, 0.2) 0 1px 0 inset;
  transition: none 0s;
}

.button-4:focus {
  outline: 1px transparent;
}

.button-4:before {
  display: none;
}

.button-4:-webkit-details-marker {
  display: none;
}




/* CSS */
.button-80 {
  background: paleturquoise;
  backface-visibility: hidden;
  border-radius: 0.375rem;
  border-style: solid;
  border-width: 0.125rem;
  box-sizing: border-box;
  color: black;
  cursor: pointer;
  display: inline-block;
  font-family: Circular, Helvetica, sans-serif;
  font-size: 1.125rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.3;
  padding: 0.875rem 1.125rem;
  position: relative;
  text-align: left;
  text-decoration: none;
  transform: translateZ(0) scale(1);
  transition: transform 0.2s;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  margin: 1rem;
}

.button-80:not(:disabled):hover {
  transform: scale(1.05);
}

.button-80:not(:disabled):hover:active {
  transform: scale(1.05) translateY(0.125rem);
}

.button-80:focus {
  outline: 0 solid transparent;
}

.button-80:focus:before {
  content: "";
  left: calc(-1 * 0.375rem);
  pointer-events: none;
  position: absolute;
  top: calc(-1 * 0.375rem);
  transition: border-radius;
  user-select: none;
}

.button-80:focus:not(:focus-visible) {
  outline: 0 solid transparent;
}

.button-80:focus:not(:focus-visible):before {
  border-width: 0;
}

.button-80:not(:disabled):active {
  transform: translateY(0.125rem);
}


</style>
