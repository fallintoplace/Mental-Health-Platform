<template>
  <div class="home">
    <sidebar-menu :menu="menu" :collapsed="true" />
    <questionnaire-card :value="questionnaire" :number="numberOfQuestions" />
  </div>
</template>

<script>
import { supabase } from "@/supabase/init";

import { mapGetters, mapActions } from "vuex";
import * as TYPES from "@/store/modules/questionnaire/types";
import QuestionnaireCard from "@/components/shared/QuestionnaireCard";

export default {
  name: "StartPage",

  components: {
    QuestionnaireCard,
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
      activeQuestionIndex: 0,
      isShaking: false,
    };
  },

  mounted() {
    this.fetchQuestionnaire();
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
}
</style>
