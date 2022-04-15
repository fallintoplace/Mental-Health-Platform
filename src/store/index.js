import Vue from "vue";
import Vuex from "vuex";
import questionnaire from "./modules/questionnaire";
import metadata from "./modules/metadata";


Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    questionnaire,
    metadata,
  },
});
