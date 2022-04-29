<template>
  <div class="calendar">
    <sidebar-menu :menu="menu" :width="'15rem'" />
    <h2 class="calendar__title">Calendar</h2>
    <div v-if="data_loaded">
      <div class="calendar__box">
        <vc-calendar
          class="custom-calendar max-w-full"
          :masks="masks"
          :attributes="attributes"
          disable-page-swipe
          show-weeknumbers="right-outside"
        >
          <template v-slot:day-content="{ day, attributes }">
            <div class="flex flex-col h-full z-10 overflow-hidden">
              <span class="day-label text-sm text-gray-900">{{ day.day }}</span>
              <div class="flex-grow overflow-y-auto overflow-x-auto">
                <p
                  v-for="attr in attributes"
                  :key="attr.key"
                  class="text-xs leading-tight rounded-sm p-1 mt-0 mb-1"
                  :class="attr.customData.class"
                >
                  {{ attr.customData.title }}
                </p>
              </div>
            </div>
          </template>
        </vc-calendar>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { supabase } from "@/supabase/init";

export default {
  metaInfo() {
    let title = "Calendar: " + new Date().getDate() + "/" + (new Date().getMonth() + 1);

    return { title };
  },
  methods: {
    async fetchData() {
      let { data: temp, error: _ } = await supabase
        .from("responses")
        .select("*")
        .like("email", "%" + this.getEmail + "%");
      if (_) throw _;
      this.phq9_responses = temp;
      this.attributes = [];

      for (let i = 0; i < this.phq9_responses.length; i++) {
        let custom_data = { title: "PHQ-9", class: "class__phq9" };
        console.log(i);
        if (
          i === 0 ||
          (i > 0 &&
            this.phq9_responses[i].datestamp !=
              this.phq9_responses[i - 1].datestamp)
        )
          this.attributes.push({
            key: i,
            customData: custom_data,
            dates: this.phq9_responses[i].datestamp,
          });
      }

      let { data: _temp, error: __ } = await supabase
        .from("GAD7")
        .select("*")
        .like("email", "%" + this.getEmail + "%");
      if (__) throw __;
      this.gad7_responses = _temp;
      for (let i = 0; i < this.gad7_responses.length; i++) {
        let custom_data = { title: "GAD-7", class: "class__gad7" };
        console.log(i);
        if (
          i === 0 ||
          (i > 0 &&
            this.gad7_responses[i].datestamp !=
              this.gad7_responses[i - 1].datestamp)
        )
          this.attributes.push({
            key: i + this.phq9_responses.length,
            customData: custom_data,
            dates: this.gad7_responses[i].datestamp,
          });
      }

      let custom_data = { title: "Today", class: "class__today" };

      this.attributes.push({
        key: 0,
        customData: custom_data,
        dates: new Date(),
      });

      this.data_loaded = true;
    },
  },
  created() {
    this.menu[0].title = this.getEmail;
    this.fetchData();
  },
  computed: {
    ...mapGetters(["getEmail"]),
  },
  data() {
    const month = new Date().getMonth();
    const year = new Date().getFullYear();
    return {
      data_loaded: null,
      phq9_responses: null,
      gad7_responses: null,
      masks: {
        weekdays: "WWW",
      },
      attributes: [
        {
          key: 1,
          customData: {
            title: "GAD-7",
            class: "class__gad7",
          },
          dates: new Date(year, month, 1),
        },
        {
          key: 2,
          customData: {
            title: "PHQ-9",
            class: "class__phq9",
          },
          dates: new Date(year, month, 2),
        },
      ],
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
    };
  },
};
</script>
<style lang="scss">
$day-border: 1px solid #b8c2cc;
$day-border-highlight: 1px solid #b8c2cc;
$day-width: 90px;
$day-height: 90px;
$weekday-bg: #f8fafc;
$weekday-border: 1px solid #eaeaea;
.scrollbar {
  width: 0px;
}
.scrollbar-track {
  display: none;
}
.custom-calendar.vc-container {
  border-radius: 0;
  width: 100%;
  .vc-header {
    background-color: #f1f5f8;
    padding: 10px 0;
  }
  .vc-weeks {
    padding: 0;
  }
  .vc-weekday {
    background-color: $weekday-bg;
    border-bottom: $weekday-border;
    border-top: $weekday-border;
    padding: 5px 0;
  }
  .vc-day {
    padding: 0 5px 3px 5px;
    text-align: left;
    min-height: $day-height;
    min-width: $day-width;
    overflow: auto;
    background-color: white;
    &.weekday-1,
    &.weekday-7 {
      background-color: #eff8ff;
    }
    &:not(.on-bottom) {
      border-bottom: $day-border;
      &.weekday-1 {
        border-bottom: $day-border-highlight;
      }
    }
    &:not(.on-right) {
      border-right: $day-border;
    }
  }
  .vc-day-dots {
    margin-bottom: 5px;
  }
}

.class__gad7 {
  color: white;
  background-color: #d41f16;
  border-radius: 0.2rem;
  padding: 0.2rem;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 12px 28px 0px,
    rgba(0, 0, 0, 0.1) 0px 2px 4px 0px,
    rgba(255, 255, 255, 0.05) 0px 0px 0px 1px inset;
}

.class__phq9 {
  color: white;
  background-color: #1c1c5d;
  border-radius: 0.2rem;
  padding: 0.2rem;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 12px 28px 0px,
    rgba(0, 0, 0, 0.1) 0px 2px 4px 0px,
    rgba(255, 255, 255, 0.05) 0px 0px 0px 1px inset;
}
.class__today {
  color: white;
  background-color: green;
  border-radius: 0.2rem;
  padding: 0.2rem;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 12px 28px 0px,
    rgba(0, 0, 0, 0.1) 0px 2px 4px 0px,
    rgba(255, 255, 255, 0.05) 0px 0px 0px 1px inset;
}
.calendar {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 60px);
  flex-direction: column;
  &__box {
    width: 50rem;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 12px 28px 0px,
      rgba(0, 0, 0, 0.1) 0px 2px 4px 0px,
      rgba(255, 255, 255, 0.05) 0px 0px 0px 1px inset;
  }
  &__title {
    color: rgb(74, 57, 124);
  }
}
</style>
