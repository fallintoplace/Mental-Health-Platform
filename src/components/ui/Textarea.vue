<template>
  <label class="ui-textarea">
    <textarea
      v-model="text"
      ref="textarea"
      class="ui-textarea__field"
      @input="handleInput"
    />
  </label>
</template>

<script>
export default {
  name: "UiTextarea",

  props: {
    value: {
      type: String,
      default: () => undefined,
    },
  },

  data() {
    return {
      text: "",
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

    focus() {
      setTimeout(() => {
        this.$refs.textarea.focus();
      }, 600);
    },
  },
};
</script>

<style lang="scss" scoped>
$block: ".ui-textarea";

#{$block} {
  &__field {
    width: 100%;
    min-height: 80px;
    max-height: 150px;
    padding: 6px 16px;
    border: 1px solid var(--color-light);
    border-radius: var(--border-raius);
    background: rgba(#fff, 0.1);
    color: var(--color-light);
    font-family: var(--font-family);
    font-size: var(--font-size-bigger);
    resize: vertical;
    transition: background 0.2s, box-shadow 0.2s;

    &:focus {
      background: rgba(#fff, 0.2);
      box-shadow: 0 0 0 1px var(--color-light);
      outline: none;
    }
  }
}
</style>
