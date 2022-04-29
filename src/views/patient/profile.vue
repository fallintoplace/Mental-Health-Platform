<template>
  <div class="home">
    <div class="box">
    <sidebar-menu :menu="menu" :width="'15rem'" />
      <h2 class="home__title">Personal Information</h2>
      <div>Email: {{ this.menu[0].title }}</div>
      <br />
      Name: {{ name }} {{ surname }}
      <div class="namebox">
        <input type="text" placeholder="Name" v-model="newName" />
        <input type="text" placeholder="Surname" v-model="newSurname" />
      </div>

      Gender: {{ selectedGender }}
      <label class="select" for="slct">
        <select id="slct" required="required" v-model="newGender">
          <option value="null" disabled="disabled" selected="selected" hidden>
            Your Gender
          </option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <svg>
          <use xlink:href="#select-arrow-down"></use>
        </svg>
      </label>
      <svg class="sprites">
        <symbol id="select-arrow-down" viewbox="0 0 10 6">
          <polyline points="1 1 5 5 9 1"></polyline>
        </symbol>
      </svg>
      <label for="dateofbirth"> Date Of Birth: {{ selectedDOB }} </label>
      <input
        type="date"
        id="dateofbirth"
        class="datePicker"
        v-model="dateOfBirth"
        max="2007-12-31"
      />

      <button
        class="button-3"
        role="button"
        @click="
          changeSaveMessage();
          updateGender();
        "
      >
        {{ saveMessage }}
      </button>
    </div>
  </div>
</template>

<script>
import { supabase } from "@/supabase/init";
import { mapGetters } from "vuex";
import moment from "moment";

export default {
  metaInfo() {
    let title = "Profile: " + this.getEmail;

    return { title };
  },
  created() {
    this.menu[0].title = this.getEmail;
    this.fetchData();
  },
  data() {
    return {
      selectedGender: null,
      dateOfBirth: null,
      selectedDOB: null,
      newGender: null,
      patients: null,
      name: null,
      surname: null,
      newName: null,
      newSurname: null,
      saveMessage: "Save",
      menu: [
        {
          header: true,
          title: "Main Navigation",
          hiddenOnCollapse: true,
        },
        {
          href: "/calendar",
          title: "Calendar",
          icon: "far fa-calendar-alt",
        },
        {
          href: "/PHQ9",
          title: "Start PHQ9",
          icon: "fas fa-copy",
        },
        {
          href: "/GAD7",
          title: "Start GAD7",
          icon: "far fa-copy",
        },
        {
          href: "/profile",
          title: "Edit Profile",
          icon: "fas fa-user-cog",
        },
        {
          href: "/result",
          title: "Show Result",
          icon: "fas fa-poll-h",
        },
        {
          href: "/",
          title: "Exit",
          icon: "fas fa-sign-out-alt",
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["getEmail"]),
  },
  methods: {
    changeSaveMessage() {
      this.saveMessage = "Saved!";
    },
    async fetchData() {
      // eslint-disable-next-line no-unused-vars
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .like("email", "%" + this.getEmail + "%");
      // console.table(data);
      // console.log(data[0].gender);
      if (data[0].gender) this.selectedGender = data[0].gender;
      if (data[0].date_of_birth)
        this.selectedDOB = moment(data[0].date_of_birth).format("DD/MM/YYYY");
      if (data[0].name) this.name = data[0].name;
      if (data[0].surname) this.surname = data[0].surname;
    },
    async updateGender() {
      if (this.newGender) {
        // eslint-disable-next-line no-unused-vars
        const { data, error } = await supabase
          .from("patients")
          .update({ gender: this.newGender })
          .match({ email: this.getEmail });
        console.log(this.newGender);
      }
      if (this.dateOfBirth) {
        // eslint-disable-next-line no-unused-vars
        const { data, error } = await supabase
          .from("patients")
          .update({ date_of_birth: this.dateOfBirth })
          .match({ email: this.getEmail });
      }
      if (this.newName) {
        // eslint-disable-next-line no-unused-vars
        const { data, error } = await supabase
          .from("patients")
          .update({ name: this.newName })
          .match({ email: this.getEmail });
      }
      if (this.newSurname) {
        // eslint-disable-next-line no-unused-vars
        const { data, error } = await supabase
          .from("patients")
          .update({ surname: this.newSurname })
          .match({ email: this.getEmail });
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
  &__title {
    color: rgb(74, 57, 124);
  }
}

.datePicker {
  width: 180px;
  height: 36px;
  font-size: 15px;
  font-family: "Roboto", sans-serif;
}

.select {
  position: relative;
  min-width: 200px;
  margin-bottom: 10px;
}
.select svg {
  position: absolute;
  right: 12px;
  top: calc(50% - 3px);
  width: 10px;
  height: 6px;
  stroke-width: 2px;
  stroke: #9098a9;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  pointer-events: none;
}
.select select {
  -webkit-appearance: none;
  padding: 7px 40px 7px 12px;
  width: 100%;
  border: 1px solid #e8eaed;
  border-radius: 5px;
  background: #fff;
  box-shadow: 0 1px 3px -2px #9098a9;
  cursor: pointer;
  font-family: inherit;
  font-size: 16px;
  transition: all 150ms ease;
}
.select select:required:invalid {
  color: #5a667f;
}
.select select option {
  color: #223254;
}
.select select option[value=""][disabled] {
  display: none;
}
.select select:focus {
  outline: none;
  border-color: #07f;
  box-shadow: 0 0 0 2px rgba(0, 119, 255, 0.2);
}
.select select:hover + svg {
  stroke: #07f;
}
.sprites {
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
  user-select: none;
}

/* CSS */
.button-3 {
  appearance: none;
  background-color: #2ea44f;
  border: 1px solid rgba(27, 31, 35, 0.15);
  border-radius: 6px;
  box-shadow: rgba(27, 31, 35, 0.1) 0 1px 0;
  box-sizing: border-box;
  color: #fff;
  cursor: pointer;
  display: inline-block;
  font-family: -apple-system, system-ui, "Segoe UI", Helvetica, Arial,
    sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  padding: 6px 16px;
  position: relative;
  text-align: center;
  text-decoration: none;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: middle;
  white-space: nowrap;
  margin-top: 1rem;
}

.button-3:focus:not(:focus-visible):not(.focus-visible) {
  box-shadow: none;
  outline: none;
}

.button-3:hover {
  background-color: #2c974b;
}

.button-3:focus {
  box-shadow: rgba(46, 164, 79, 0.4) 0 0 0 3px;
  outline: none;
}

.button-3:disabled {
  background-color: #94d3a2;
  border-color: rgba(27, 31, 35, 0.1);
  color: rgba(255, 255, 255, 0.8);
  cursor: default;
}

.button-3:active {
  background-color: #298e46;
  box-shadow: rgba(20, 70, 32, 0.2) 0 1px 0 inset;
}

input[type="text"] {
  width: 100%;
  border: 2px solid #aaa;
  border-radius: 4px;
  margin-left: 4px;
  margin-bottom: 4px;
  outline: none;
  padding: 8px;
  box-sizing: border-box;
  transition: 0.3s;
  font-family: "Roboto", sans-serif;
}

input[type="text"]:focus {
  border-color: dodgerBlue;
  box-shadow: 0 0 8px 0 dodgerBlue;
}

.namebox {
  display: flex;
  width: 280px;
}

.box {
  border: 2px solid black;
  height: 400px;
  width: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: 25px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 12px 28px 0px,
    rgba(0, 0, 0, 0.1) 0px 2px 4px 0px,
    rgba(255, 255, 255, 0.05) 0px 0px 0px 1px inset;
}
</style>
