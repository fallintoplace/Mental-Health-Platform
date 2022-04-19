<template>
  <div class="home">
    <sidebar-menu :menu="menu" :collapsed="true" />
    <vue-ellipse-progress
      :progress="tasksDonePercent"
      :color="gradient"
      animation="rs 700 1000"
      fontSize="1.5rem"
      lineMode="out 2"
      :size="180"
      :thickness="5"
      :empty-thickness="3"
      :dot="{
        size: 5,
        width: '20px',
        backgroundColor: 'blue',
        transitionDuration: '1000ms',
      }"
    >
      {{ score }}
      <span slot="legend-value"> / {{ total }}</span>
      <span slot="legend-caption">Score</span>
    </vue-ellipse-progress>
    after {{ timeCompletion }} seconds
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      timeCompletion: 0,
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
      score: 0,
      total: 27,
      gradient: {
        radial: false,
        colors: [
          {
            color: "#6546f7",
            offset: "0",
            opacity: "1",
          },
          {
            color: "lime",
            offset: "100",
            opacity: "0.6",
          },
        ],
      },
    };
  },
  created() {
    this.menu[0].title = this.getEmail;
    // console.dir(this.getResults);
    var res = this.getResults;
    if (res.length > 0) {
      this.timeCompletion = this.getTimeCompletion;
      this.total = 3 * (res.length - 1);
      for (let i = 0; i < res.length - 1; i++) {
        this.score += + res[i];
      }
    }
  },
  computed: {
    ...mapGetters(["getResults"]),
    ...mapGetters(["getEmail"]),
    ...mapGetters(["getTimeCompletion"]),
    tasksDonePercent() {
      return (this.score * 100) / this.total;
    },
  },
};
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 60px);
  flex-direction: column;
}
</style>
