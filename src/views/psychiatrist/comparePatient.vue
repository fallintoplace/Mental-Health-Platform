<template>
  <div>
    <sidebar-menu :menu="menu" :collapsed="true" />
    {{ this.patients }}
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { supabase } from "@/supabase/init";

export default {
  created() {
    this.menu[0].title = this.getEmail;
    this.fetchData();
  },
  methods: {
    async fetchData() {
      // eslint-disable-next-line no-unused-vars
      const { data, error } = await supabase.from("patients").select("*");
      this.patients = data;
    }
  },
  computed: {
    ...mapGetters(["getEmail"]),
  },
  data() {
    return {
      patients: null,
      menu: [
        {
          header: true,
          title: "Main Navigation",
          hiddenOnCollapse: true,
        },
        {
          href: "/overviewPatient",
          title: "Overview Dashboard",
          icon: "fas fa-users",
        },
        {
          href: "/trackPatient",
          title: "Track Patient",
          icon: "fas fa-user",
        },
        {
          href: "/comparePatient",
          title: "Compare Patient",
          icon: "fas fa-user-friends",
        },
        {
          href: "/",
          title: "Log Out",
          icon: "fas fa-sign-out-alt",
        },
      ],
    }
  }

};
  

</script>

<style lang="scss" scoped></style>
