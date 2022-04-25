<template>
  <div class="home">
    <sidebar-menu :menu="menu" :width="'15rem'" />
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

import { mapGetters, mapActions, mapMutations } from "vuex";
import * as TYPES from "@/store/modules/questionnaire/types";
import QuestionnaireCard from "@/components/shared/QuestionnaireCard_SUS";

export default {
  metaInfo() {
    let title = "System Usability Scale (SUS)";

    return { title };
  },
  name: "SUS",

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
          disabled: false,
          preSelected: "English",
          labels: [
            {
              name: "English",
              color: "black",
              backgroundColor: "lightgrey",
            },
            // { name: "German", color: "black", backgroundColor: "lightgrey" },
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
          href: "/",
          title: "Home",
          icon: "fas fa-home",
        },
        {
          href: "/SUS",
          title: "SUS Feedback",
          icon: "far fa-comment-dots",
        },
        // {
        //   href: "/about",
        //   title: "About",
        //   icon: "far fa-question-circle",
        // },
      ],
      activeQuestionIndex: 0,
      isShaking: false,
    };
  },

  created() {
    this.fetchQuestionnaire("/api/English/SUS.json");
    // this.menu[0].title = this.getEmail;
    // this.uploadEmail();
    // this.toggle = this.getLanguage;
    // if (!this.toggle) {
    //   this.toggle = "English";
    //   this.setLanguage("English");
    //   this.fetchQuestionnaire("/api/English/SUS.json");
    // } else if (this.toggle === "English")
    //   this.fetchQuestionnaire("/api/" + this.toggle + "/SUS.json");
    // else if (this.toggle === "German")
    //   this.fetchQuestionnaire("/api/" + this.toggle + "/SUS.json");
  },

  computed: {
    ...mapGetters("questionnaire", {
      questionnaire: TYPES.GET_QUESTIONNAIRE,
      questions: TYPES.GET_QUESTIONS,
    }),
    ...mapGetters(["getEmail"]),
    ...mapGetters(["getLanguage"]),

    numberOfQuestions() {
      if (!this.questions) {
        return;
      }

      return this.questions.length;
    },
  },

  methods: {
    refetchQuestionnaire() {
      // this.setLanguage(this.toggle);
      // this.fetchQuestionnaire("/api/" + this.toggle + "/SUS.json");
    },
    ...mapActions("questionnaire", ["fetchQuestionnaire"]),
    ...mapMutations(["setLanguage"]),
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
