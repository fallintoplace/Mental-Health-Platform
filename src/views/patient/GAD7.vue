<template>
  <div class="home">
    <sidebar-menu :menu="menu" :collapsed="true" />
    <questionnaire-card :value="questionnaire" :number="numberOfQuestions" />
    <footer>
      <toggle-switch
        :options="myOptions"
        v-model="toggle"
        @change="refetchQuestionnaire()"
      />
    </footer>
  </div>
</template>

<script>
import { supabase } from "@/supabase/init";

import { mapGetters, mapActions } from "vuex";
import * as TYPES from "@/store/modules/questionnaire/types";
import QuestionnaireCard from "@/components/shared/QuestionnaireCard1";

export default {
  name: "GAD7",

  components: {
    QuestionnaireCard,
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
          preSelected: "English",
          disabled: false,
          labels: [
            {
              name: "English",
              color: "black",
              backgroundColor: "lightgrey",
            },
            { name: "German", color: "black", backgroundColor: "lightgrey" },
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
          href: "/",
          title: "Exit",
          icon: "fas fa-sign-out-alt",
        },
      ],
      activeQuestionIndex: 0,
      isShaking: false,
    };
  },

  mounted() {
    this.fetchQuestionnaire("/api/English/GAD7.json");
  },
  created() {
    this.menu[0].title = this.getEmail;
    this.uploadEmail();
  },

  computed: {
    ...mapGetters("questionnaire", {
      questionnaire: TYPES.GET_QUESTIONNAIRE,
      questions: TYPES.GET_QUESTIONS,
    }),
    ...mapGetters(["getEmail"]),

    numberOfQuestions() {
      if (!this.questions) {
        return;
      }

      return this.questions.length;
    },
  },

  methods: {
    refetchQuestionnaire() {
      this.fetchQuestionnaire("/api/" + this.toggle + "/GAD7.json");
    },
    ...mapActions("questionnaire", ["fetchQuestionnaire"]),
    async uploadEmail() {
      const { _data, _error } = await supabase.from("patients").insert([
        {
          email: this.getEmail,
        },
      ]);
      console.log(_data);
      console.log(_error);
    },
  },

  metaInfo() {
    const title = !this.questionnaire
      ? "Questionnaire"
      : this.questionnaire.name;

    return { title };
  },
};
</script>

<style lang="scss" scoped>
$block: ".home";

#{$block} {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 60px);
  flex-direction: column;
}
</style>
