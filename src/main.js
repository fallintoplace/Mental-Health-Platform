import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import "./globalComponents";
import VueMeta from "vue-meta";
import VueShortkey from "vue-shortkey";
import Vue2TouchEvents from "vue2-touch-events";
import ToggleSwitch from "vuejs-toggle-switch";
import Trend from "vuetrend";
import VueApexCharts from "vue-apexcharts";
import Skeleton from "vue-loading-skeleton";
import VueSidebarMenu from "vue-sidebar-menu";
import "vue-sidebar-menu/dist/vue-sidebar-menu.css";

import "vue-easytable/libs/theme-default/index.css"; // import style
import VueEasytable from "vue-easytable"; // import library

import VueEllipseProgress from "vue-ellipse-progress";
Vue.use(VueEllipseProgress);

/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";

/* import specific icons */
import { faUserSecret } from "@fortawesome/free-solid-svg-icons";

/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

/* add icons to the library */
library.add(faUserSecret);

import VCalendar from "v-calendar";
Vue.use(VCalendar, {
  componentPrefix: 'vc',  // Use <vc-calendar /> instead of <v-calendar />
});

/* add font awesome icon component */
Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.use(VueApexCharts);
Vue.use(VueMeta);
Vue.use(VueShortkey);
Vue.use(Vue2TouchEvents);
Vue.use(ToggleSwitch);
Vue.use(Trend);
Vue.use(Skeleton);
Vue.use(VueSidebarMenu);
Vue.use(VueEasytable);

Vue.config.productionTip = false;
Vue.component("apexchart", VueApexCharts);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
