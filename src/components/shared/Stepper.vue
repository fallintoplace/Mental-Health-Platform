<template>
  <div v-if="current < total + 2" class="stepper">
    <span class="stepper__current">
      {{ current }}
    </span>
    <span :class="slashClasses"> / </span>
    <span class="stepper__total">
      {{ total + 1 }}
    </span>
  </div>
</template>

<script>
export default {
  name: "Stepper",

  props: {
    total: {
      type: Number,
      default: () => undefined,
    },
    current: {
      type: Number,
      default: () => undefined,
    },
  },

  data() {
    return {
      lastStep: 0,
      mod: null,
    };
  },

  watch: {
    current: {
      handler(val) {
        this.turnSlash(val > this.lastStep);
        this.lastStep = val;
      },
    },
  },

  computed: {
    slashClasses() {
      const classes = ["stepper__slash"];

      if (this.mod) {
        classes.push(`stepper__slash_${this.mod}`);
      }

      return classes;
    },
  },

  methods: {
    turnSlash(val) {
      if (!val) {
        this.mod = "prev";
      } else {
        this.mod = "next";
      }

      setTimeout(() => {
        this.mod = null;
      }, 300);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/_mixins.scss";

$block: ".stepper";

#{$block} {
  display: grid;
  grid-template-columns: 30px 20px 30px;
  position: absolute;
  z-index: 20;
  bottom: 70px;
  left: 24px;
  color: var(--color-light);
  line-height: 22px;
  font-size: 20px;
  font-weight: normal;
  opacity: 0.2;
  pointer-events: none;

  @include display(tablet) {
    grid-template-columns: 160px 80px 160px;
    top: 3vh;
    left: 50%;
    bottom: auto;
    color: var(--color-text);
    line-height: 120px;
    font-size: 100px;
    transform: translateX(-50%);
    opacity: 0.1;
  }

  &__slash {
    text-align: center;
    will-change: transform;

    &_prev,
    &_next {
      transition: transform 0.3s ease-in-out;
    }

    &_prev {
      transform: rotate(-180deg);
    }

    &_next {
      transform: rotate(180deg);
    }
  }

  &__current {
    text-align: right;
  }

  &__total {
    text-align: left;
  }
}
</style>
