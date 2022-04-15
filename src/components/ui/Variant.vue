<template>
  <label
    :class="['ui-variant', { 'ui-variant_active': active }]"
    v-shortkey="hotKeys"
    @shortkey="enter"
  >
    <input
      ref="control"
      v-model="state"
      :type="type"
      :name="name"
      :value="value"
      :checked="checked"
      class="ui-variant__control"
    />

    <span class="ui-variant__box">
      <span v-if="variant" class="ui-variant__variant">
        <span class="ui-variant__key">Key</span>
        {{ variant }}
      </span>

      <span class="ui-variant__label">
        {{ label }}
      </span>

      <span class="ui-variant__check" />
    </span>
  </label>
</template>

<script>
export default {
  name: "UiVariant",

  props: {
    value: {
      type: String,
      default: () => undefined,
    },
    type: {
      type: String,
      default: () => undefined,
    },
    name: {
      type: String,
      default: () => undefined,
    },
    label: {
      type: String,
      default: () => undefined,
    },
    variant: {
      type: String,
      default: () => undefined,
    },
    checked: Boolean,
    active: Boolean,
  },

  data() {
    return {
      state: false,
    };
  },

  computed: {
    hotKeys() {
      if (!this.active) {
        return;
      }
      return { enter: ["enter"], space: ["space"] };
    },
  },

  watch: {
    checked: {
      immediate: true,
      handler(val) {
        if (this.state === val) {
          return;
        }

        this.state = val;

        if (this.type === "radio" && val && this.$refs.control) {
          this.$refs.control.checked = true;
        }
      },
    },

    state: {
      immediate: true,
      handler(val) {
        if (this.checked === val) {
          return;
        }

        this.$emit("change", {
          value: this.value,
          type: this.type,
          selected: val,
        });
      },
    },
  },

  methods: {
    enter() {
      if (this.type === "radio") {
        this.$refs.control.checked = true;
        this.state = this.value;
      }

      if (this.type === "checkbox") {
        this.state = !this.state;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/_mixins.scss";

$block: ".ui-variant";

#{$block} {
  display: block;
  font-size: var(--font-size-base);
  font-weight: 500;
  line-height: 1.15;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  cursor: pointer;

  &__box {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 4px;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    color: var(--color-light);
    transition: 0.2s;
    will-change: box-shadow, background;

    &:hover {
      background: rgba(#fff, 0.2);
    }

    #{$block}_active & {
      border-color: var(--color-primary);
      box-shadow: 0 0 0 1px var(--color-primary);
      background: rgba(#fff, 0.2);
    }
  }

  &__control:checked ~ &__box {
    border-color: var(--color-success);
    background: var(--color-success);
    color: #fff;
    animation: 0.5s linear 0s alternate blink;

    #{$block}_active & {
      border-color: var(--color-primary);
    }
  }

  &__control {
    position: absolute;
    left: -9999px;
  }

  &__label {
    flex: 1;
    padding: 2px 0;

    @include display-less(tablet) {
      padding: calc(var(--gap) / 2);
    }
  }

  &__variant,
  &__check {
    flex: 0 0 22px;
    width: 22px;
    height: 22px;
    box-sizing: border-box;
  }

  &__variant {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border: 1px solid var(--color-border);
    border-radius: 3px;
    background: var(--color-bg);
    color: var(--color-text);
    font-size: var(--font-size-tiny);
    font-weight: 600;

    @include display-less(tablet) {
      display: none;
    }
  }

  &__control:checked ~ &__box > &__variant {
    background: var(--color-light);
    color: var(--color-text);
  }

  &__key {
    display: flex;
    align-items: center;
    position: absolute;
    top: -1px;
    bottom: -1px;
    left: -27px;
    padding: 0 4px;
    border: inherit;
    border-right: none;
    border-radius: 3px 0 0 3px;
    background: inherit;
    color: transparent;
    transform: translateX(50%) scaleX(0);
    transition: transform 0.2s, color 0.2s 0.1s;
    will-change: transform;

    #{$block}__box:hover &,
    #{$block}_active & {
      color: inherit;
      transform: translateX(0) scaleX(1);
      transition: transform 0.2s 0.1s cubic-bezier(0, 0, 0.6, 2), color 0.2s;
    }
  }

  &__check {
    align-self: center;
    display: block;
    position: relative;
    opacity: 0;
    transform: scale(0);
    transition: transform 0.2s cubic-bezier(0, 0, 0.6, 2),
      opacity 0.2s cubic-bezier(0, 0, 0.6, 2);
    will-change: transform;

    &::before,
    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      height: 2px;
      background: #fff;
    }

    &::before {
      width: 6px;
      transform: translate(2px, 9px) rotate(45deg);
    }

    &::after {
      width: 12px;
      transform: translate(5px, 8px) rotate(-45deg);
    }
  }

  &__control:checked ~ &__box > &__check {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes blink {
  0% {
    background: var(--color-success);
  }
  25% {
    background: transparent;
  }
  50% {
    background: var(--color-success);
  }
  75% {
    background: transparent;
  }
  100% {
    background: var(--color-success);
  }
}
</style>
