import axios from "axios";
import moment from "moment";

const state = {
  results: [],
  timeCompletion: null,
  timeForEach: [],
  email: null,
  datestamp: null,
  timestamp: null,
  device: null,
  location: null,
  language: null,
};

const getters = {
  getResults: (state) => state.results,
  getTimeCompletion: (state) => state.timeCompletion,
  getTimeForEach: (state) => state.timeForEach,
  getEmail: (state) => state.email,
  getDatestamp: (state) => state.datestamp,
  getTimestamp: (state) => state.timestamp,
  getDevice: (state) => state.device,
  getLocation: (state) => state.location,
  getLanguage: (state) => state.language,
};

const actions = {
  async fetchDeviceLocation({ commit }) {
    const response = await axios.get(
      "https://api.ipregistry.co/?key=1xv2ok4qeqtfhd67"
    );
    // https://api.ipregistry.co/?key=1xv2ok4qeqtfhd67
    commit("setDeviceLocation", response);
  },
};

const mutations = {
  resetData: (state) => {
    state.results = [];
    state.timeCompletion = null;
    state.timeForEach = [];
  },
  setTimeCompletion: (state, timeCompletion) => (state.timeCompletion = timeCompletion),
  setEmail: (state, email) => {
    state.email = email.toLowerCase();
    // alert(state.email);
  },
  setResults: (state, payload) => {
    state.results[payload.index] = payload.value;
  },
  setTimeForEach: (state, payload) => {
    state.timeForEach[payload.index] = payload.value;
  },
  setDeviceLocation: (state, payload) => {
    // console.log(payload.data.location.country.code);
    // console.log(payload.data.user_agent.device.type);
    state.location = payload.data.location.country.code;
    state.device = payload.data.user_agent.device.type;
  },
  setDatestampTimestamp: (state) => {
    const date = new Date();
    state.datestamp = moment(date).format("YYYY-MM-DD");
    state.timestamp = moment(date).format("HH:mm:ss");
    console.log(state.datestamp);
    console.log(state.timestamp);
  },
  setLanguage: (state, language) => {
    // alert(language);
    state.language = language;
  }

};

export default {
  state,
  getters,
  actions,
  mutations,
};
