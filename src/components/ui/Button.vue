<template>
  <component
    :is="to === undefined ? 'button' : 'router-link'"
    :to="!disabled && to ? to : ''"
    :class="buttonClass"
    :disabled="disabled"
    type="button"
    @click="handleClick"
    @keyup.enter="handleClick"
  >
    <span class="ui-button__text">
      <slot v-if="$slots.default && !text" />
      <template v-else-if="text">{{ text }}</template>
    </span>
    <span v-if="loading" class="ui-button__loader">
      <!-- <ui-spinner :size="24" />-->
    </span>
  </component>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: undefined,
    },
    to: {
      type: String,
      default: undefined,
    },
    type: {
      type: String,
      default: "default",
    },
    size: {
      type: String,
      default: "medium",
    },
    outlined: Boolean,
    rounded: Boolean,
    wide: Boolean,
    disabled: Boolean,
    loading: Boolean,
  },

  computed: {
    buttonClass() {
      return {
        "ui-button": true,
        ["ui-button_" + this.type]: true,
        ["ui-button_" + this.size]: true,
        "ui-button_shadow": this.shadow,
        "ui-button_outlined": this.outlined,
        "ui-button_wide": this.wide,
        "ui-button_rounded": this.rounded,
        "ui-button_disabled": this.disabled || this.loading,
      };
    },
  },

  methods: {
    handleClick(e) {
      if (!this.disabled) {
        e.preventDefault();
        this.$emit("click");
      }
    },
  },
};
</script>

<style lang="scss">
@mixin buttonStyle($type, $bgc, $bgch, $text, $shadow: $bgc) {
  background: $bgc;
  color: $text;

  $shadowColor: $shadow;
  @if $type == "default" OR $type == "light" {
    $shadowColor: #999;
  }

  &:hover {
    background: $bgch;
    box-shadow: 0 0 6px rgba($shadowColor, 1);
  }

  &:active,
  &_active {
    background: $bgch;
    transform: translate(1px, 1px);
  }

  &:focus {
    background: $bgch;
  }

  &.ui-button_shadow {
    box-shadow: 0 6px 12px rgba($shadowColor, 0.4);

    &:hover {
      box-shadow: 0 3px 8px rgba($shadowColor, 0.6);
    }

    &:focus,
    &:active,
    &_active {
      box-shadow: 0 0 20px rgba($shadowColor, 0.8);
    }
  }

  &.ui-button_disabled {
    opacity: 0.7;
    cursor: not-allowed;
    box-shadow: none;

    &:focus {
      box-shadow: none;
    }
  }

  &.ui-button_outlined {
    @if $type == "default" {
      border: 2px solid var(--color-text-secondary);
      color: var(--color-text-secondary);
    } @else {
      border: 2px solid $bgc;
      color: $bgc;
    }
    @if $type == "light" {
      color: var(--color-text-secondary);
    }
    background: none;
    line-height: calc(100% - 4px);

    &:hover,
    &:active,
    &:focus {
      @if $type == "light" {
        border: 2px solid var(--color-text-secondary);
        color: var(--color-text-secondary);
      }
      background: rgba($bgc, 0.1);
    }
  }
}

@mixin buttonSize($size) {
  min-width: $size;
  min-height: $size;
  line-height: $size;
  border-radius: $size/6;
}

.ui-button,
a.ui-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  margin: 0;
  padding: 0 calc(var(--gap) * 2);
  border: none;
  background: none;
  color: inherit;
  font-family: inherit;
  font-size: var(--font-size-small);
  font-weight: bold;
  text-decoration: none !important;
  outline: none;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  transition: var(--speed);

  &:focus {
    box-shadow: 0 0 8px rgba(var(--color-info), 0.5);
  }

  // color

  &_default {
    @include buttonStyle(
      "default",
      #f4f4f4,
      var(--color-text),
      var(--color-info)
    );
  }

  &_primary {
    @include buttonStyle(
      "primary",
      var(--color-primary),
      var(--color-primary-hover),
      var(--color-light)
    );
  }

  &_accent {
    @include buttonStyle(
      "accent",
      var(--color-accent),
      var(--color-accent-hover),
      var(--color-light)
    );
  }

  &_success {
    @include buttonStyle(
      "success",
      var(--color-success),
      var(--color-success-hover),
      var(--color-light)
    );
  }

  &_warning {
    @include buttonStyle(
      "warning",
      var(--color-warning),
      var(--color-warning-hover),
      var(--color-light)
    );
  }

  &_danger {
    @include buttonStyle(
      "danger",
      var(--color-danger),
      var(--color-danger-hover),
      var(--color-light)
    );
  }

  &_info {
    @include buttonStyle(
      "info",
      var(--color-info),
      var(--color-info-hover),
      var(--color-light)
    );
  }

  // size

  &_medium {
    @include buttonSize(46px);
    font-size: var(--font-size-small);
  }

  &_small {
    @include buttonSize(32px);
    font-size: var(--font-size-small);
  }

  &_tiny {
    @include buttonSize(24px);
    padding: 0 calc(var(--gap) / 2);
    font-size: var(--font-size-small);
  }

  &_big {
    @include buttonSize(52px);
    font-size: var(--font-size-big);
  }

  &_large {
    @include buttonSize(64px);
    font-size: var(--font-size-big);
  }

  // other

  &_wide {
    display: flex;
    width: 100%;
  }

  &_rounded {
    &.ui-button_medium {
      border-radius: 46px;
    }

    &.ui-button_small {
      border-radius: 32px;
    }

    &.ui-button_tiny {
      border-radius: 24px;
    }

    &.ui-button_big {
      border-radius: 52px;
    }

    &.ui-button_large {
      border-radius: 30px;
    }
  }

  // elements

  &__text {
    flex: 0 0 auto;
  }

  &__loader {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border-radius: inherit;
  }
}
</style>
