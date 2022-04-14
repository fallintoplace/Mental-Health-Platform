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
    path: "/StartPage",
    name: "StartPage",
    component: () => import("@/views/patient/StartPage"),
  },
  {
    path: "/overviewPatient",
    name: "overviewPatient",
    component: () => import("@/views/psychiatrist/overviewPatient"),
  },
  {
    path: "/comparePatient",
    name: "comparePatient",
    component: () => import("@/views/psychiatrist/comparePatient"),
  },
  {
    path: "/trackPatient",
    name: "trackPatient",
    component: () => import("@/views/psychiatrist/trackPatient"),
  },
  {
    path: "/:category",
    name: "CategoryPage",
    props: ({ params }) => ({ category: +params.category }),
    component: () => import("@/views/category"),
  },
  {
    path: "/:category/:id",
    name: "QuestionnairePage",
    props: ({ params }) => ({ questionnaire: +params.questionnaire }),
    component: () => import("@/views/category/questionnaire"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
