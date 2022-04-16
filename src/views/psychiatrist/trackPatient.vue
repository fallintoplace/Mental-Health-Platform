<template>
  <div class="home">
    <sidebar-menu :menu="menu" :collapsed="true" />
    <h1 :style="{ color: 'purple' }">Track Patient</h1>
    <div class="namebox">
      <input type="text" placeholder="Email" v-model="email" />
    </div>

    <!-- <div class="form__group field">
      <input
        v-model="email"
        type="input"
        class="form__field"
        placeholder="Name"
        name="name"
        id="name"
        required
      />
      <label for="name" class="form__label">Email</label>
    </div> -->
    <!-- <div class="form__group field">
      <input
        v-model="name"
        type="input"
        class="form__field"
        placeholder="Name"
        name="name"
        id="name"
        required
      />
      <label for="name" class="form__label">Name</label>
    </div>

    <div class="form__group field">
      <input
        v-model="surname"
        type="input"
        class="form__field"
        placeholder="Name"
        name="name"
        id="name"
        required
      />
      <label for="name" class="form__label">Surname</label>
    </div> -->
    <!-- <h1>{{ email }}</h1>
    <h1>{{ name }}</h1>
    <h1>{{ surname }}</h1> -->

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

    <!-- <h3>{{ patients }}</h3> -->

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
        <ve-table :columns="columns" :table-data="responses" />
        <line-chart
          :labels="labels"
          :datasets="datasets"
          :options="options"
        ></line-chart>
        <line-chart
          :labels="labels"
          :datasets="datasets1"
          :options="options1"
        ></line-chart>

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
import Portfolio from "@/components/Portfolio";

export default {
  metaInfo() {
    let title = "Track Patient";

    return { title };
  },
  name: "SinglePatient",
  components: {
    LineChart,
    // eslint-disable-next-line vue/no-unused-components
    Portfolio,
  },
  data() {
    return {
      columns: [
        { field: "email", key: "a", title: "Email", align: "center"},
        { field: "q0", key: "b", title: "Q1", align: "center" },
        { field: "q1", key: "c", title: "Q2", align: "center" },
        { field: "q2", key: "d", title: "Q3", align: "center" },
        { field: "q3", key: "e", title: "Q4", align: "center" },
        { field: "q4", key: "f", title: "Q5", align: "center" },
        { field: "q5", key: "g", title: "Q6", align: "center" },
        { field: "q6", key: "h", title: "Q7", align: "center" },
        { field: "q7", key: "i", title: "Q8", align: "center" },
        { field: "q8", key: "j", title: "Q9", align: "center" },
        { field: "total_score", key: "n", title: "Score", align: "center" },
        { field: "time_completion", key: "k", title: "Time Completion", align: "center" },
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
      labels: [0, 1, 2, 3, 4, 5, 6],
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
      datasets: [
        {
          data: [],
          label: "Total Score",
          borderColor: "rgba(255, 56, 96, 0.5)",
          backgroundColor: "rgba(255, 56, 96, 0.1)",
        },
      ],
      datasets1: [
        {
          data: [],
          label: "Time Completion",
          borderColor: "rgba(50, 115, 220, 0.5)",
          backgroundColor: "rgba(50, 115, 220, 0.1)",
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
        console.log(data);
      } else if (email && name) {
        const { data, error } = await supabase
          .from("patients")
          .select("*")
          .like("email", "%" + email + "%")
          .like("name", "%" + name + "%");
        if (error) throw error;
        this.patients = data;
        console.log(data);
      } else if (email && surname) {
        const { data, error } = await supabase
          .from("patients")
          .select("*")
          .like("email", "%" + email + "%")
          .like("surname", "%" + surname + "%");
        if (error) throw error;
        this.patients = data;
        console.log(data);
      } else if (name && surname) {
        const { data, error } = await supabase
          .from("patients")
          .select("*")
          .like("name", "%" + name + "%")
          .like("surname", "%" + surname + "%");
        if (error) throw error;
        this.patients = data;
        console.log(data);
      } else if (email) {
        const { data, error } = await supabase
          .from("patients")
          .select("*")
          .like("email", "%" + email + "%");
        if (error) throw error;
        this.patients = data;
        console.log(data);
      } else if (name) {
        const { data, error } = await supabase
          .from("patients")
          .select("*")
          .like("name", "%" + name + "%");
        if (error) throw error;
        this.patients = data;
        console.log(data);
      } else if (surname) {
        const { data, error } = await supabase
          .from("patients")
          .select("*")
          .like("surname", "%" + surname + "%");
        if (error) throw error;
        this.patients = data;
        console.log(data);
      } else {
        const { data, error } = await supabase.from("patients").select("*");
        if (error) throw error;
        this.patients = data;
        console.log(data);
      }
    },
    async searchResponses(email) {
      const { data, error } = await supabase
        .from("responses")
        .select("*")
        .like("email", "%" + email + "%");
      if (error) throw error;
      this.responses = data;
      this.labels.length = 0;
      this.datasets[0].data.length = 0;
      this.datasets1[0].data.length = 0;
      for (let i = 0; i < this.responses.length; i++) {
        this.labels[i] = i + 1;
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
      // this.labels[this.responses.length] = this.responses.length;
      // this.labels[this.responses.length + 1] = this.responses.length + 1;
      // this.datasets[0].data[0] = null;
      // this.datasets[0].data[this.responses.length + 1] = null;
      // console.log(this.datasets[0]);
    },
    indexToggle(index) {
      // this.toggled.fill(false);
      // this.toggled[index] = !this.toggled[index];
      if (!this.toggled[index]) {
        this.toggled.fill(false);
        this.toggled[index] = !this.toggled[index];
      } else if (this.toggled[index]) {
        this.toggled[index] = !this.toggled[index];
      }
    },
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
  padding-top: 5rem;
  padding-bottom: 5rem;
}

$primary: #11998e;
$secondary: #38ef7d;
$white: #fff;
$gray: #9b9b9b;
.form__group {
  caret-color: black;
  position: relative;
  padding: 15px 0 0;
  margin-top: 10px;
  width: 20%;
}

.form__field {
  font-family: "Roboto", sans-serif;
  width: 100%;
  border: 0;
  border-bottom: 2px solid $gray;
  outline: 0;
  font-size: 1.2rem;
  color: black;
  padding: 7px 0;
  background: transparent;
  transition: border-color 0.2s;

  &::placeholder {
    color: transparent;
  }

  &:placeholder-shown ~ .form__label {
    font-size: 1.3rem;
    cursor: text;
    top: 20px;
  }
}

.form__label {
  position: absolute;
  top: 0;
  display: block;
  transition: 0.2s;
  font-size: 1rem;
  color: $gray;
}

.form__field:focus {
  ~ .form__label {
    position: absolute;
    top: 0;
    display: block;
    transition: 0.2s;
    font-size: 1rem;
    color: $primary;
    font-weight: 700;
  }
  padding-bottom: 6px;
  font-weight: 700;
  border-width: 3px;
  border-image: linear-gradient(to right, $primary, $secondary);
  border-image-slice: 1;
}
/* reset input */
.form__field {
  &:required,
  &:invalid {
    box-shadow: none;
  }
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

.container {
  margin-top: 1rem;
  text-align: center;
  // flex-direction: column;
}

.searchButtons {
  margin-top: 1rem;
  display: flex;
  // justify-content: space-between;
}

.box {
  width: 850px;
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
  margin-top: 10px;
}
</style>
