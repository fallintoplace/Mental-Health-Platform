<template>
  <div class="home">
    <sidebar-menu :menu="menu" :collapsed="true" />
    <div class="box">
      <h2 class="home__title">
        Patient Health Questionnaire 9 (PHQ-9)
      </h2>
      <h3>What's your role?</h3>
      <!-- <h1>{{patient.username}}</h1> -->
      <toggle-switch :options="myOptions" v-model="toggle" />
      <div v-if="toggle == 'Psychiatrist'">
        <div class="form__group field">
          <input
            type="input"
            class="form__field"
            placeholder="Email"
            name="name"
            id="name"
            v-model="psychiatrist.username"
            required
          />
          <label for="name" class="form__label">Email</label>
        </div>
        <!-- <div class="form__group field">
          <input
            type="input"
            class="form__field"
            placeholder="Name"
            name="name"
            id="name"
            v-model="psychiatrist.password"
            required
          />
          <label for="name" class="form__label">Password</label>
        </div> -->

        <router-link to="/overviewPatient">
          <button
            @click="
              submitForm;
              setEmail(
                psychiatrist.username ? psychiatrist.username : guestEmail
              );
            "
          >
            Enter
          </button>
        </router-link>
      </div>

      <div v-if="toggle == 'Patient'">
        <div class="form__group field">
          <input
            type="input"
            class="form__field"
            placeholder="Email"
            name="name"
            id="name"
            v-model="patient.username"
            required
          />
          <label for="name" class="form__label">Email</label>
        </div>

        <!-- <div class="form__group field">
          <input
            type="input"
            class="form__field"
            placeholder="Name"
            name="name"
            id="name"
            v-model="patient.password"
            required
          />
          <label for="name" class="form__label">Password</label>
        </div> -->

        <router-link to="/PHQ9">
          <button
            @click="
              submitForm;
              setEmail(patient.username ? patient.username : guestEmail);
              resetData();
            "
          >
            Enter
          </button>
        </router-link>
        <h3>Or</h3>
        <router-link to="/PHQ9">
          <button
            @click="
              submitForm;
              setEmail(guestEmail);
              resetData();
            "
          >
            Enter as Guest
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import * as TYPES from "@/store/modules/questionnaire/types";

export default {
  name: "Home",

  components: {},
  metaInfo() {
    let title = "Home / PHQ9";

    return { title };
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
          href: "/",
          title: "Home",
          icon: "fas fa-home",
        },
        // {
        //   href: "/about",
        //   title: "About",
        //   icon: "far fa-question-circle",
        // },
      ],
      guestEmail: "guest@tum.de",
      psychiatrist: {
        username: null,
        password: null,
      },
      patient: {
        username: null,
        password: null,
      },
      myOptions: {
        layout: {
          color: "black",
          backgroundColor: "lightgray",
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
          fontSize: 1.5,
          height: 3,
          padding: 0.5,
          width: 24,
        },
        items: {
          delay: 0.4,
          preSelected: "unknown",
          disabled: false,
          labels: [
            {
              name: "Psychiatrist",
              color: "black",
              backgroundColor: "turquoise",
            },
            { name: "Patient", color: "black", backgroundColor: "orange" },
          ],
        },
      },
      toggle: null,
      email: "",
      password: {
        password: "",
        confirm: "",
      },
      activeQuestionIndex: 0,
      isShaking: false,
    };
  },

  mounted() {
    // this.fetchQuestionnaire();
  },

  computed: {
    ...mapGetters("questionnaire", {
      questionnaire: TYPES.GET_QUESTIONNAIRE,
      questions: TYPES.GET_QUESTIONS,
    }),

    numberOfQuestions() {
      if (!this.questions) {
        return;
      }

      return this.questions.length;
    },
  },

  methods: {
    ...mapMutations(["setEmail"]),
    ...mapMutations(["resetData"]),

    submitForm() {},
    // ...mapActions("questionnaire", ["fetchQuestionnaire"]),
  },

  // metaInfo() {
  //   const title = !this.questionnaire
  //     ? "Questionnaire"
  //     : this.questionnaire.name;

  //   return { title };
  // },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/main.scss";
$block: ".home";

#{$block} {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 60px);
  flex-direction: column;
  &__title {
    color: rgb(74, 57, 124);
  }
}



// input {
//   font-size: 1em;
//   padding: 5px 0;
//   margin: 10px 0 5px 0;
//   width: 100%;
// }

$primary: #11998e;
$secondary: #38ef7d;
$white: #fff;
$gray: #9b9b9b;
.form__group {
  caret-color: black;
  position: relative;
  padding: 20px 0 0;
  margin-top: 20px;
  margin-bottom: 10px;
  width: 300px;
  
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

.box {
  border: 2px solid black;
  height: 550px;
  width: 450px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: 25px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 12px 28px 0px,
    rgba(0, 0, 0, 0.1) 0px 2px 4px 0px,
    rgba(255, 255, 255, 0.05) 0px 0px 0px 1px inset;
  @include display-less(phablet) {
    width: 75%;
    overflow: auto;
  }
}




button {
  background-color: #ffffff;
  border: 1px solid rgb(209, 213, 219);
  border-radius: 0.5rem;
  box-sizing: border-box;
  color: #111827;
  font-family: "Inter var", ui-sans-serif, system-ui, -apple-system, system-ui,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  font-size: large;
  font-weight: 600;
  line-height: 1.25rem;
  padding: 0.75rem 1rem;
  text-align: center;
  text-decoration: none #d1d5db solid;
  text-decoration-thickness: auto;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  margin-top: 10px;
}

button:hover {
  background-color: rgb(249, 250, 251);
}

button:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

button:focus-visible {
  box-shadow: none;
}

</style>
