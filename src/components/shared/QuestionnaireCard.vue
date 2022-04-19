<template>
  <router-link v-if="value" :to="`startPHQ9`" class="card">
    <!-- <img :src="`/uploads/1.png`" alt="" class="card__icon" /> -->
    <div class="card__text">
      <h3 class="card__title">{{ value.name }}</h3>
      <p class="card__description">{{ value.description }}</p>
    </div>
    <div v-if="number" class="card__number">
      Number of questions: {{ number }}
    </div>
  </router-link>
</template>

<script>
export default {
  name: "QuestionnaireCard",

  props: {
    value: {
      type: Object,
      default: () => null,
    },
    number: {
      type: Number,
      default: () => undefined,
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/_mixins.scss";

$block: ".card";

#{$block} {
  flex: 1;
  display: block;
  position: relative;
  margin: auto;
  padding: calc(var(--gap) * 2);
  background: var(--color-dark);
  color: var(--color-light);
  text-decoration: none;

  @include display-less(tablet) {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  @include display(tablet) {
    display: block;
    width: 96%;
    max-width: 400px;
    height: 96vh;
    max-height: 400px;
  }

  &__icon {
    position: absolute;
    top: 5%;
    left: 5%;
    width: 90%;
    height: 90%;
    object-fit: contain;
    opacity: 0.1;
    pointer-events: none;
  }

  &__text {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  &__title {
    flex: 0 0 auto;
    font-size: var(--font-size-bigger);
    overflow-wrap: break-word;
    hyphens: auto;
  }

  &__description {
    flex: 1;
    font-size: var(--font-size-small);
    line-height: 1.45;
  }

  &__number {
    flex: 0 0 auto;
    font-size: var(--font-size-small);
    text-align: right;
    opacity: 0.7;
  }
}
</style>
