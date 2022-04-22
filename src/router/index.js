import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/PHQ9",
    name: "PHQ9",
    component: () => import("@/views/patient/PHQ9"),
  },
  {
    path: "/GAD7",
    name: "GAD7",
    component: () => import("@/views/patient/GAD7"),
  },
  {
    path: "/SUS",
    name: "SUS",
    component: () => import("@/views/patient/SUS"),
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("@/views/patient/profile"),
  },
  {
    path: "/result",
    name: "result",
    component: () => import("@/views/patient/result"),
  },
  {
    path: "/overviewPatient",
    name: "overviewPatient",
    component: () => import("@/views/psychiatrist/overviewPatient"),
  },
  {
    path: "/comparePatients",
    name: "comparePatients",
    component: () => import("@/views/psychiatrist/comparePatients"),
  },
  {
    path: "/trackPatient",
    name: "trackPatient",
    component: () => import("@/views/psychiatrist/trackPatient"),
  },
  // {
  //   path: "/:category",
  //   name: "CategoryPage",
  //   props: ({ params }) => ({ category: +params.category }),
  //   component: () => import("@/views/category"),
  // },
    {
    path: "/startPHQ9",
    name: "QuestionnairePage",
    // props: ({ params }) => ({ questionnaire: +params.questionnaire }),
    component: () => import("@/views/category/questionnaire"),
  },
  {
    path: "/startGAD7",
    name: "QuestionnairePage1",
    // props: ({ params }) => ({ questionnaire: +params.questionnaire }),
    component: () => import("@/views/category/questionnaire1"),
  },
  {
    path: "/startSUS",
    name: "QuestionnairePage_SUS",
    // props: ({ params }) => ({ questionnaire: +params.questionnaire }),
    component: () => import("@/views/category/questionnaire_SUS"),
  },
  // {
  //   path: "/:category/:id",
  //   name: "QuestionnairePage",
  //   props: ({ params }) => ({ questionnaire: +params.questionnaire }),
  //   component: () => import("@/views/category/questionnaire"),
  // },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
