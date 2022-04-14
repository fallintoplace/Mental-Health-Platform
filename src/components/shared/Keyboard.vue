<template>
  <div class="keyboard">
    <button
      v-for="key in keys"
      :key="key.direction"
      :class="[
        'keyboard__control',
        `keyboard__control_${key.direction}`,
        { keyboard__control_active: activeKey === key.direction },
      ]"
      @click="handleKey(key.direction, 'inner')"
    >
      {{ key.label }}
    </button>
  </div>
</template>

<script>
export default {
  name: "Keyboard",

  data() {
    return {
      keys: [
        {
          direction: "left",
          label: "←",
        },
        {
          direction: "right",
          label: "→",
        },
      ],
      activeKey: null,
    };
  },

  methods: {
    handleKey(key, target) {
      this.activeKey = key;

      setTimeout(() => {
        this.activeKey = null;
      }, 300);

      if (target === "inner") {
        this.emitKey(key);
      }
    },

    emitKey(key) {
      this.$emit("click", key);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/_mixins.scss";

$block: ".keyboard";

$controlSize: 46px;

#{$block} {
  position: absolute;
  bottom: var(--gap);
  right: var(--gap);
  z-index: 100;
  color: var(--color-text-secondary);
  font-weight: bold;
  text-align: center;

  display: grid;
  grid-template-columns: repeat(2, $controlSize);
  grid-gap: 4px;

  @include display-less(tablet) {
    right: auto;
    left: var(--gap);
    bottom: calc(var(--gap) + 3px);
  }

  &__control {
    @extend %resetButton;
    width: $controlSize;
    height: $controlSize;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    background: var(--color-bg-dark);
    font-size: var(--font-size-big);
    line-height: 1;

    &_active {
      background: var(--color-border);
    }

    @include display-less(tablet) {
      font-size: var(--font-size-large);
    }
  }
}
</style>
