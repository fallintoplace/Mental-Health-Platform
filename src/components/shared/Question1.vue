<template>
  <section v-if="value" :class="classes">
    <div class="question__box">
      <header class="question__header">
        <small class="question__number">{{ ownIndex + 1 }}</small>
        <p v-if="value.description" class="question__description">
          {{ value.description }}
        </p>
        <!-- <div>Decision Changes: {{ getDecisionChanges }}</div> -->
        <h2 class="question__title" :style="{ color: 'turquoise' }">
          <template v-if="value.question_type === 'final'">
            <!-- <h1>
              {{ finalText }}
            </h1>
            ⌛ Time elapsed: {{ getSeconds() }} seconds -->
            <h2>Metadata collected</h2>
            <div>Email: {{ getEmail }}</div>
            <div>Results: {{ getResults }}</div>
            <div>Time Completion: {{ getTimeCompletion }}</div>
            <div>Time each Question: {{ getTimeForEach }}</div>
            <div>Device: {{ getDevice }}</div>
            <div>Location: {{ getLocation }}</div>
            <div>Language: {{ getLanguage }}</div>
            <div>City: {{ getCity }}</div>
            <div>Operating System: {{ getOperatingSystem }}</div>
            <div>User Agent: {{ getUserAgent }}</div>
            <div>Decision Changes: {{ getDecisionChanges }}</div>
            <p></p>
            <router-link to="/result">
              <!-- <button class="button-33" role="button" @click="uploadResponse">Upload Response</button> -->
              <button
                class="button-82-pushable"
                role="button"
                @click="uploadResponse"
              >
                <span class="button-82-shadow"></span>
                <span class="button-82-edge"></span>
                <span class="button-82-front text"> Submit </span>
              </button>
            </router-link>
          </template>
          <template v-else>
            {{ value.headline }}
          </template>
          <sup v-if="value.required" class="question__required">*</sup>
        </h2>
      </header>

      <div class="question__form">
        <div
          v-if="value.question_type === 'multiple-choice'"
          :class="[
            'question__options',
            'question__options_multiple',
            { 'question__options_with-columns': hasColumns },
          ]"
          v-shortkey="hotKeys"
          @shortkey="navigate"
        >
          <ui-variant
            v-for="(option, index) in value.choices"
            :key="index"
            :type="typeOfControl"
            :name="value.identifier"
            :value="option.value"
            :label="option.label"
            :variant="getCharNum(index)"
            :checked="option.selected"
            :active="activeVariantIndex === index"
            @change="change"
          />
        </div>

        <div
          v-else-if="value.question_type === 'text'"
          class="question__options"
        >
          <component
            ref="input"
            :is="'ui-' + typeOfControl"
            :value="value.text"
            @input="inputText"
            @submit="submitText"
          />
        </div>

        <div v-else class="question__options">
          Something wrong with the question :(
        </div>
      </div>

      <footer class="question__footer">
        <div class="question__note">
          {{ noteText }}
        </div>
        <!-- <div class="question__submit">
          <ui-button
            type="warning"
            outlined
            :disabled="!canSubmit"
            @click="submit(0)"
          >
            Enter <span class="question__enter-icon">↵</span>
          </ui-button>
        </div> -->
      </footer>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import * as TYPES from "@/store/modules/questionnaire/types";
import { getCharsList, getCharByIndex } from "@/libs/utils";

import { supabase } from "@/supabase/init";

const CHARS_TO_COLUMNS = 20;

export default {
  name: "Question",

  props: {
    value: {
      type: Object,
      required: true,
    },
    number: {
      type: Number,
      required: true,
    },
    ownIndex: {
      type: Number,
      required: true,
    },
    activeIndex: {
      type: Number,
      required: true,
    },
    wrong: Boolean,
  },

  data() {
    return {
      activeVariantIndex: null,
      startDate: null,
      totalScore: 0,
    };
  },

  computed: {
    ...mapGetters(["getTimeCompletion"]),
    ...mapGetters(["getResults"]),
    ...mapGetters(["getEmail"]),
    ...mapGetters(["getDevice"]),
    ...mapGetters(["getLocation"]),
    ...mapGetters(["getDatestamp"]),
    ...mapGetters(["getTimestamp"]),
    ...mapGetters(["getTimeForEach"]),
    ...mapGetters(["getLanguage"]),
    ...mapGetters(["getCity"]),
    ...mapGetters(["getOperatingSystem"]),
    ...mapGetters(["getUserAgent"]),
    ...mapGetters(["getDecisionChanges"]),

    classes() {
      const result = [
        "question",
        { question_wrong: this.wrong },
        { question_active: this.ownIndex === this.activeIndex },
        { question_final: this.value.question_type === "final" },
      ];

      if (this.ownIndex < this.activeIndex) {
        result.push(`question_prev`);
        result.push(`question_prev-${this.activeIndex - this.ownIndex}`);
      }

      if (this.ownIndex > this.activeIndex) {
        result.push(`question_next`);
        result.push(`question_next-${this.ownIndex - this.activeIndex}`);
      }

      return result;
    },

    typeOfControl() {
      if (!this.value) {
        return;
      }
      if (this.value.question_type === "text") {
        if (!this.value.multiline) {
          return "input";
        }
        return "textarea";
      }
      if (this.value.question_type === "multiple-choice") {
        if (!this.value.multiple) {
          return "radio";
        }
        return "checkbox";
      }
      return "unknown";
    },

    hasColumns() {
      if (
        !this.value ||
        !this.value.choices ||
        this.value.choices.length === 0
      ) {
        return;
      }

      return (
        this.value.choices.every(
          (choice) => choice.label.length < CHARS_TO_COLUMNS
        ) && this.value.choices.length > 2
      );
    },

    noteText() {
      if (!this.typeOfControl || !this.value) {
        return;
      }

      if (!this.value.required) {
        if (this.typeOfControl === "radio") {
          return (this.getLanguage === "English"? "You can choose any option or skip" : "Sie können jede Option wählen oder überspringen");
        }

        if (this.typeOfControl === "checkbox") {
          return "You can choose any or more options or skip";
        }

        return "Enter something or skip";
      } else {
        if (this.typeOfControl === "radio") {
          return (this.getLanguage === "English"? "* You may use mouse click; key 0, 1, 2, 3; or ←, →" : "* Sie können Mausklick; Taste 0, 1, 2, 3; oder ←, → verwenden.");
        }

        if (this.typeOfControl === "checkbox") {
          return "You may use 🖱️; key 0, 1, 2, 3, 4; or ←, →";
        }

        return "* This option is required";
      }
    },

    canSubmit() {
      if (!this.typeOfControl || !this.value) {
        return;
      }

      if (!this.value.required) {
        return true;
      }

      if (this.value.choices && this.value.choices.length > 0) {
        return this.value.choices.some((item) => item.selected);
      }

      return this.value.text && this.value.text.length > 0;
    },

    jumpingStepId() {
      if (!this.value || !this.value.jumps || this.value.jumps.length === 0) {
        return;
      }

      const choice = this.value.choices.find((item) => item.selected);

      const jump = this.value.jumps.find((item) => {
        return item.conditions[0].value === choice.value;
      });

      return jump.destination.id;
    },

    hotChars() {
      if (!this.value || this.value.question_type === "text") {
        return;
      }
      const chars = getCharsList().slice(0, this.value.choices.length);
      return chars.map((char) => char.toLowerCase());
    },

    hotKeys() {
      if (
        !this.value ||
        this.value.question_type === "text" ||
        this.activeIndex !== this.ownIndex
      ) {
        return;
      }

      const result = {
        up: ["arrowup"],
        down: ["arrowdown"],
        enter: ["enter"],
      };

      this.hotChars.forEach((char) => {
        result[char] = [char];
      });

      return result;
    },

    finalText() {
      if (this.ownIndex !== this.activeIndex) {
        return "You are almost done!";
      }
      return "The result has been sent to the server";
    },
  },

  watch: {
    activeIndex: {
      immediate: true,
      handler(val) {
        if (val === this.ownIndex) {
          if (
            this.typeOfControl &&
            (this.typeOfControl === "input" ||
              this.typeOfControl === "textarea")
          ) {
            this.$refs.input.focus();
          }

          return;
        }
        this.activeVariantIndex = null;
      },
    },
  },

  mounted() {
    this.startDate = new Date();
  },

  methods: {
    ...mapMutations(["setTimeCompletion"]),
    ...mapMutations(["setResults"]),
    ...mapMutations(["setTimeForEach"]),

    async uploadResponse() {
      const { data, error } = await supabase.from("gad7").insert([
        {
          email: this.getEmail,
          time_completion: this.getTimeCompletion,
          q0: this.getResults[0],
          q1: this.getResults[1],
          q2: this.getResults[2],
          q3: this.getResults[3],
          q4: this.getResults[4],
          q5: this.getResults[5],
          q6: this.getResults[6],
          q7: this.getResults[7],
          total_score:
            +this.getResults[0] +
            +this.getResults[1] +
            +this.getResults[2] +
            +this.getResults[3] +
            +this.getResults[4] +
            +this.getResults[5] +
            +this.getResults[6],
          device: this.getDevice,
          location: this.getLocation,
          datestamp: this.getDatestamp,
          timestamp: this.getTimestamp,
          t0: this.getTimeForEach[0],
          t1: this.getTimeForEach[1],
          t2: this.getTimeForEach[2],
          t3: this.getTimeForEach[3],
          t4: this.getTimeForEach[4],
          t5: this.getTimeForEach[5],
          t6: this.getTimeForEach[6],
          t7: this.getTimeForEach[7],
          language: this.getLanguage,
          answer_changes: this.getDecisionChanges,
          city: this.getCity,
          operating_system: this.getOperatingSystem,
          user_agent: this.getUserAgent
        },
      ]);
      console.log(data);
      console.log(error);
    },

    ...mapMutations("questionnaire", {
      setText: TYPES.SET_QUESTION_TEXT,
      setVariant: TYPES.SET_QUESTION_VARIANT,
    }),

    deduct() {},

    getSeconds() {
      if (this.startDate === null) {
        this.startDate = new Date();
      }
      const current = new Date();
      this.setTimeCompletion(
        Math.floor((current.getTime() - this.startDate.getTime()) / 1000)
      );
      return Math.floor((current.getTime() - this.startDate.getTime()) / 1000);
    },

    getCharNum(index) {
      return getCharByIndex(index);
    },

    change(val) {
      this.setVariant({
        identifier: this.value.identifier,
        variant: val,
      });

      if (val.type === "radio") {
        this.submit();
      }
    },

    inputText(val) {
      this.setText({
        identifier: this.value.identifier,
        text: val,
      });
    },

    submitText(val) {
      this.setText({
        identifier: this.value.identifier,
        text: val,
      });
      this.submit(0);
    },

    navigate(val) {
      if (val.srcKey === "down") {
        if (
          this.activeVariantIndex === null ||
          this.activeVariantIndex === this.value.choices.length - 1
        ) {
          this.activeVariantIndex = 0;
          return;
        }

        this.activeVariantIndex++;
        return;
      }

      if (val.srcKey === "up") {
        if (!this.activeVariantIndex) {
          this.activeVariantIndex = this.value.choices.length;
        }

        this.activeVariantIndex--;
        return;
      }

      if (val.srcKey === "enter") {
        if (!this.activeVariantIndex) {
          this.$emit("submit");
        }
        return;
      }

      if (this.hotChars.includes(val.srcKey)) {
        const index = this.hotChars.findIndex((char) => char === val.srcKey);

        if (this.typeOfControl === "radio") {
          this.value.choices.forEach((item) => {
            item.selected = false;
          });
          this.value.choices[index].selected = true;

          this.submit();
        }

        if (this.typeOfControl === "checkbox") {
          this.value.choices[index].selected = !this.value.choices[index]
            .selected;
        }
      }
    },

    submit(pause = 700) {
      const value = this.value.choices.find((item) => item.selected).value;

      const payload = {
        index: this.activeIndex,
        value: value,
      };
      this.setResults(payload);

      const sec = this.getSeconds();
      const payload_timeForEach = {
        index: this.activeIndex,
        value: sec,
      };
      this.setTimeForEach(payload_timeForEach);

      setTimeout(() => {
        this.$emit("submit", this.jumpingStepId);
      }, pause);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/_mixins.scss";

$block: ".question";

#{$block} {
  position: absolute;
  top: 50%;
  right: 0;
  left: 0;
  background: var(--color-text);
  color: var(--color-light);
  line-height: 1.25;
  text-align: left;
  transition: transform 0.4s ease-in-out, opacity 0.4s ease-in-out;
  will-change: transform, opacity;

  &_wrong {
    @include display(tablet) {
      animation: 0.5s ease-in-out 0s alternate shake;
    }
  }

  &:not(#{$block}_active) {
    pointer-events: none;
  }

  @include display-less(tablet) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    &_active {
      opacity: 1;
      transform: translate(0, 0);
    }

    &_prev {
      transform: translate(-100%, 0);
    }

    &_next {
      transform: translate(100%, 0);
    }
  }

  @include display(tablet) {
    opacity: 0;

    &_active {
      opacity: 1;
      transform: translate(0, -50%) rotate3d(100, 0, 0, 0deg) scale(1);
    }

    &_prev {
      transform: translate(-110%, -50%) rotateY(-40deg) scale(0.4);

      &-1 {
        opacity: 0.5;
        transform: translate(-86%, -50%) rotateY(-25deg) scale(0.8);
      }

      &-2 {
        opacity: 0.1;
      }
    }

    &_next {
      transform: translate(110%, -50%) rotateY(40deg) scale(0.4);

      &-1 {
        opacity: 0.5;
        transform: translate(86%, -50%) rotateY(25deg) scale(0.8);
      }

      &-2 {
        opacity: 0.1;
      }
    }
  }

  &__box {
    @include display-less(tablet) {
      flex: 1;
      display: flex;
      flex-direction: column;
      width: 100%;
      padding: var(--gap);
    }

    @include display(tablet) {
      padding: var(--gap) calc(var(--gap) * 4);
    }
  }

  &__header {
    position: relative;
    margin: 0 0 var(--gap);

    #{$block}_final & {
      margin: 0;
      padding: 60px 0;
      text-align: center;
    }
  }

  &__number {
    display: inline;
    font-size: var(--font-size-big);
    font-weight: 500;
    color: var(--color-light);

    #{$block}_final & {
      display: none;
    }

    &::after {
      content: ".";
      display: inline;
    }

    @include display(tablet) {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: 2px;
      right: calc(100% + (var(--gap) / 2));
    }
  }

  &__title {
    margin: 0;
    font-size: var(--font-size-bigger);
    font-weight: 500;

    @include display-less(tablet) {
      display: inline;
    }
  }

  &__description {
    margin: calc(var(--gap) / 2) 0 0;
    font-size: var(--font-size-small);
  }

  &__options {
    &_multiple {
      display: grid;
      grid-row-gap: calc(var(--gap) / 2);
      grid-column-gap: calc(var(--gap) * 1.5);

      @media screen and (max-height: 500px) {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        white-space: nowrap;
      }
    }

    @include display(tablet) {
      &_multiple {
        width: max-content;
      }

      &_with-columns {
        grid-template-columns: 1fr 1fr;
      }
    }
  }

  &__form {
    #{$block}_final & {
      display: none;
    }

    @include display-less(tablet) {
      flex: 1;
    }
  }

  &__footer {
    display: grid;
    align-items: center;
    grid-column-gap: var(--gap);
    grid-template-columns: 1fr auto;
    margin-top: calc(var(--gap) * 2);

    #{$block}_final & {
      display: none;
    }

    @include display-less(tablet) {
      margin-left: calc(96px + var(--gap));
    }
  }

  &__note {
    font-size: var(--font-size-small);
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
    transition: color 0.2s;

    #{$block}_wrong & {
      color: var(--color-danger);
    }
  }

  &__enter-icon {
    @include display-less(tablet) {
      display: none;
    }
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translate(0, -50%);
  }
  20%,
  60% {
    transform: translate(-10px, -50%);
  }
  40%,
  80% {
    transform: translate(10px, -50%);
  }
}

/* CSS */
.button-82-pushable {
  position: relative;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  outline-offset: 4px;
  transition: filter 250ms;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}

.button-82-shadow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  background: hsl(0deg 0% 0% / 0.25);
  will-change: transform;
  transform: translateY(2px);
  transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
}

.button-82-edge {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  background: linear-gradient(
    to left,
    hsl(340deg 100% 16%) 0%,
    hsl(340deg 100% 32%) 8%,
    hsl(340deg 100% 32%) 92%,
    hsl(340deg 100% 16%) 100%
  );
}

.button-82-front {
  display: block;
  position: relative;
  padding: 12px 27px;
  border-radius: 12px;
  font-size: 1.1rem;
  color: white;
  background: hsl(345deg 100% 47%);
  will-change: transform;
  transform: translateY(-4px);
  transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
}

@media (min-width: 768px) {
  .button-82-front {
    font-size: 1.25rem;
    padding: 12px 42px;
  }
}

.button-82-pushable:hover {
  filter: brightness(110%);
}

.button-82-pushable:hover .button-82-front {
  transform: translateY(-6px);
  transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
}

.button-82-pushable:active .button-82-front {
  transform: translateY(-2px);
  transition: transform 34ms;
}

.button-82-pushable:hover .button-82-shadow {
  transform: translateY(4px);
  transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
}

.button-82-pushable:active .button-82-shadow {
  transform: translateY(1px);
  transition: transform 34ms;
}

.button-82-pushable:focus:not(:focus-visible) {
  outline: none;
}
</style>
