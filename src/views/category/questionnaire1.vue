<template>
  <div class="questionnaire">
    <!-- <h1>{{ getTime }}</h1> -->
    <sidebar-menu :menu="menu" :width="'15rem'" :collapsed="true" />
    <stepper
      v-if="questions"
      :total="questions.length - 1"
      :current="activeQuestionIndex + 1"
    />

    <feed
      v-if="slides"
      :can-navigate="
        currentQuestion && currentQuestion.question_type !== 'text'
      "
      @left="prevQuestion"
      @right="nextQuestion"
    >
      <question
        v-for="(question, index) in slides"
        :key="question.identifier"
        :value="question"
        :own-index="index"
        :active-index="activeQuestionIndex"
        :number="index + 1"
        :wrong="isShaking && activeQuestionIndex === index"
        @submit="nextQuestion"
      />
    </feed>

    <keyboard ref="keyboard" @click="handleKeyboardClick" />
    
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import * as TYPES from "@/store/modules/questionnaire/types";
import Feed from "@/components/shared/Feed";
import Question from "@/components/shared/Question1";
import Keyboard from "@/components/shared/Keyboard";
import Stepper from "@/components/shared/Stepper";


export default {
  name: "QuestionnairePage",

  components: {
    Feed,
    Question,
    Keyboard,
    Stepper,
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
      activeQuestionIndex: 0,
      isShaking: false,
    };
  },

  mounted() {
    // this.fetchQuestionnaire();
    this.fetchDeviceLocation();
    this.setDatestampTimestamp();
    this.resetData();
  },
  created() {
    this.menu[0].title = this.getEmail;

  },

  computed: {
    ...mapGetters("questionnaire", {
      questionnaire: TYPES.GET_QUESTIONNAIRE,
      questions: TYPES.GET_QUESTIONS,
    }),

    ...mapGetters(["getTime"]),
    ...mapGetters(["getEmail"]),


    slides() {
      if (!this.questions || this.questions.length === 0) {
        return;
      }

      return [
        ...this.questions,
        {
          headline: "Thank you for the answers!",
          question_type: "final",
        },
      ];
    },

    currentQuestion() {
      if (!this.slides || this.slides.length === 0) {
        return;
      }

      return this.slides[this.activeQuestionIndex];
    },

    canNext() {
      if (!this.currentQuestion) {
        return;
      }

      return (
        !this.currentQuestion.required ||
        (this.currentQuestion.choices &&
          this.currentQuestion.choices.some((item) => item.selected)) ||
        (this.currentQuestion.text && this.currentQuestion.text.length > 0)
      );
    },
  },

  watch: {
    activeQuestionIndex: {
      handler(index) {
        if (!this.questions || index < this.questions.length) {
          return;
        }
        this.submitQuestions();
      },
    },
  },

  methods: {

    ...mapActions("questionnaire", ["fetchQuestionnaire", "submitQuestions"]),
    ...mapActions(["fetchDeviceLocation"]),
    ...mapMutations(["setDatestampTimestamp"]),
    ...mapMutations(["resetData"]),

    prevQuestion() {
      if (this.activeQuestionIndex === 0) {
        return;
      }
      this.activeQuestionIndex--;
      this.$refs.keyboard.handleKey("left");
    },

    nextQuestion(val) {
      if (!this.questions) {
        return;
      }

      if (this.activeQuestionIndex >= this.slides.length - 1 || !this.canNext) {
        this.shake();
        return;
      }

      if (!val) {
        this.activeQuestionIndex++;
      } else {
        this.activeQuestionIndex = this.questions.findIndex((item) => {
          return item.identifier === val;
        });
      }

      this.$refs.keyboard.handleKey("right");
    },

    handleKeyboardClick(key) {
      switch (key) {
        case "right":
          this.nextQuestion();
          break;
        case "left":
          this.prevQuestion();
          break;
      }
    },

    shake() {
      this.isShaking = true;

      setTimeout(() => {
        this.isShaking = false;
      }, 500);
    },
  },

  metaInfo() {
    let counter;
    let title;

    if (this.questions && this.questions.length > 0) {
      if (this.activeQuestionIndex < this.questions.length) {
        counter = `[${this.activeQuestionIndex + 1}/${this.questions.length}]`;
      } else {
        counter = "🎉";
      }
    }

    if (counter && counter.length > 0) {
      title = counter + " ";
    }

    if (this.currentQuestion) {
      title = title + this.currentQuestion.headline;
    }

    return { title };
  },
};
</script>
