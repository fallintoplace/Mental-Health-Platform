import axios from "axios";

import * as TYPES from "./types";

const namespaced = true;

const state = () => ({
  questionnaire: null,
  questions: [],
});

const getters = {
  [TYPES.GET_QUESTIONNAIRE]: (state) => state.questionnaire,
  [TYPES.GET_QUESTIONS]: (state) => state.questions,
};

const mutations = {
  [TYPES.SET_QUESTIONNAIRE]: (state, payload) => {
    const {
      id,
      identifier,
      name,
      description,
      category_name_hyphenated,
    } = payload;

    let category;

    if (category_name_hyphenated && category_name_hyphenated.length > 0) {
      category = category_name_hyphenated.toLowerCase();
    }

    state.questionnaire = {
      id,
      identifier,
      name,
      description,
      category,
    };
  },

  [TYPES.SET_QUESTIONS]: (state, payload) => {
    state.questions = payload.map((question) => {
      const result = { ...question };

      if (result.multiple) {
        result.multiple = result.multiple === "true";
      }

      if (result.multiline) {
        result.multiline = result.multiline === "true";
      }

      if (result.question_type === "text") {
        result.text = null;
      }

      return result;
    });
  },

  [TYPES.SET_QUESTION_TEXT]: (state, payload) => {
    const question = state.questions.find(
      (item) => item.identifier === payload.identifier
    );
    question.text = payload.text;
  },

  [TYPES.SET_QUESTION_VARIANT]: (state, payload) => {
    const question = state.questions.find(
      (item) => item.identifier === payload.identifier
    );

    const variant = question.choices.find(
      (choice) => choice.value === payload.variant.value
    );

    if (!variant || variant === -1) {
      return;
    }

    if (payload.variant.type === "checkbox") {
      variant.selected = payload.variant.selected;
    }

    if (payload.variant.type === "radio") {
      question.choices.forEach((item) => {
        item.selected = false;
      });
      variant.selected = true;
    }
  },
};

const actions = {
  async fetchQuestionnaire({ commit, state }) {
    if (state.questionnaire) {
      // return;
    }

    try {
      const { data } = await axios.get("/api/questionnaire.json");
      if (!data || !data.questionnaire || data.questionnaire.length === 0) {
        return;
      }

      commit("SET_QUESTIONNAIRE", data.questionnaire);
      commit("SET_QUESTIONS", data.questionnaire.questions);
    } catch (err) {
      console.error("fetchQuestionsList", err);
    }
  },

  submitQuestions({ state }) {
    const answers = state.questions.map((question) => {
      const answer = {
        identifier: question.identifier,
      };

      if (question.choices) {
        answer.choices = question.choices
          .filter((choice) => choice.selected)
          .map((choice) => choice.value);
      }

      if (question.text) {
        answer.text = question.text;
      }
      return answer;
    });
    console.dir({
      questionnaire: state.questionnaire.identifier,
      answers,
    });
  },
};

export default {
  namespaced,
  state,
  getters,
  mutations,
  actions,
};
