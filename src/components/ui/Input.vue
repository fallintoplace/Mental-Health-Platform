<template>
  <label class="ui-input">
    <input
      ref="input"
      v-model="text"
      :type="type"
      class="ui-input__field"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
      @keyup.enter="submit"
    />
  </label>
</template>

<script>
export default {
  name: "UiInput",

  props: {
    value: {
      type: String,
      default: () => undefined,
    },
    type: {
      type: String,
      default: () => undefined,
    },
  },

  data() {
    return {
      text: "",
      canSubmit: false,
    };
  },

  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.text = val;
      },
    },
  },

  methods: {
    handleInput() {
      this.$emit("input", this.text);
    },

    handleFocus() {
      this.canSubmit = false;

      setTimeout(() => {
        this.canSubmit = true;
      }, 100);
    },

    handleBlur() {
      this.canSubmit = true;
    },

    focus() {
      setTimeout(() => {
        this.$refs.input.focus();
      }, 600);
    },

    submit() {
      if (!this.canSubmit) {
        return;
      }
      this.$refs.input.blur();
      this.$emit("submit", this.text);
    },
  },
};
</script>

<style lang="scss" scoped>
$block: ".ui-input";

#{$block} {
  &__field {
    width: 100%;
    padding: 6px 16px;
    border: 1px solid var(--color-light);
    border-radius: var(--border-raius);
    background: rgba(#fff, 0.1);
    color: var(--color-light);
    font-family: var(--font-family);
    font-size: var(--font-size-bigger);
    transition: background 0.2s, box-shadow 0.2s;

    &:focus {
      background: rgba(#fff, 0.2);
      box-shadow: 0 0 0 1px var(--color-light);
      outline: none;
    }
  }
}
</style>
