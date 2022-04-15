<template>
  <div class="home">
    <sidebar-menu :menu="menu" :collapsed="true" />
    <h2>Personal Information</h2>
    <div>Email: {{this.menu[0].title}} </div>
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
    <!-- SVG Sprites-->
    <svg class="sprites">
      <symbol id="select-arrow-down" viewbox="0 0 10 6">
        <polyline points="1 1 5 5 9 1"></polyline>
      </symbol>
    </svg>
    <!-- HTML !-->
    <button class="button-3" role="button" @click="changeSaveMessage(); updateGender()">
      {{ saveMessage }}
    </button>
  </div>
</template>

<script>
import { supabase } from "@/supabase/init";
import { mapGetters } from "vuex";

export default {
  created() {
    this.menu[0].title = this.getEmail;
    this.fetchData();
  },
  data() {
    return {
      selectedGender: null,
      newGender: null,
      patients: null,
      saveMessage: "Save",
      menu: [
        {
          header: true,
          title: "Main Navigation",
          hiddenOnCollapse: true,
        },
        {
          href: "/StartPage",
          title: "Start Questionnaire",
          icon: "fas fa-copy",
        },
        {
          href: "/profile",
          title: "Edit Profile",
          icon: "fas fa-user-cog",
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
        .select("gender")
        .like("email", "%" + this.getEmail + "%");
      // console.table(data);
      // console.log(data[0].gender);
      this.selectedGender = data[0].gender;
    },
    async updateGender() {
      // eslint-disable-next-line no-unused-vars
      const { data, error } = await supabase
        .from("patients")
        .update({ gender: this.newGender })
        .match({ email: this.getEmail });
      console.log(this.newGender);
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
  font-family: "Roboto", sans-serif;
}

* {
  box-sizing: border-box;
}
.select {
  position: relative;
  min-width: 200px;
  margin: 10px;
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
</style>
