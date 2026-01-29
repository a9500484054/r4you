<template>
  <div :class="containerClasses">
    <label :class="labelClasses">
      <input
        :id="id"
        type="radio"
        :name="name"
        :value="value"
        :checked="isChecked"
        :disabled="disabled"
        :class="inputClasses"
        @change="handleChange"
      />

      <span :class="radioClasses">
        <span class="radio__dot" />
      </span>

      <div class="radio__content">
        <span v-if="label" class="radio__label">
          {{ label }}
        </span>
        <span v-if="description" class="radio__description">
          {{ description }}
        </span>
      </div>
    </label>

    <div v-if="error" class="radio__error">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { nanoid } from 'nanoid';
import { computed } from 'vue';

interface Props {
  modelValue?: string | number | boolean;
  value?: string | number | boolean;
  name?: string;
  label?: string;
  description?: string;
  disabled?: boolean;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  value: undefined,
  name: '',
  label: '',
  description: '',
  disabled: false,
  error: '',
  size: 'md',
});

const emit = defineEmits<{
  'update:modelValue': [value: string | number | boolean];
  change: [value: string | number | boolean, event: Event];
}>();

const id = nanoid();

const isChecked = computed(() => props.modelValue === props.value);

const containerClasses = computed(() => [
  'radio',
  `radio--${props.size}`,
  props.disabled && 'radio--disabled',
]);

const labelClasses = computed(() => [
  'radio__container',
  !props.disabled && 'radio__container--interactive',
]);

const inputClasses = computed(() => [
  'radio__input',
]);

const radioClasses = computed(() => [
  'radio__circle',
  isChecked.value && 'radio__circle--checked',
  props.disabled && 'radio__circle--disabled',
]);

const handleChange = (event: Event) => {
  if (!props.disabled) {
    emit('update:modelValue', props.value);
    emit('change', props.value, event);
  }
};
</script>

<style scoped>
.radio {
  display: inline-flex;
  flex-direction: column;
}

.radio__container {
  display: inline-flex;
  align-items: flex-start;
  cursor: pointer;
}

.radio__container--interactive:hover .radio__circle:not(.radio__circle--disabled) {
  border-color: var(--color-primary);
}

.radio__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.radio__circle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 1rem;
  height: 1rem;
  border: 2px solid var(--border-default);
  border-radius: 50%;
  background-color: var(--bg-white);
  transition: all var(--transition-base);
  margin-top: 0.125rem;
  margin-right: 0.25rem;
}

.radio__circle--checked {
  border-color: var(--color-primary);
  background-color: #3b82f6

}

.radio__circle--checked .radio__dot {
  width: 0.5rem;
  height: 0.5rem;
  background-color: var(--bg-white);
  border-radius: 50%;
}

.radio__circle--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.radio__dot {
  transition: all var(--transition-base);
}

.radio__content {
  display: flex;
  flex-direction: column;
}

.radio__label {
  color: var(--color-secondary);
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0px;

}

.radio__description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.4;
  margin-top: 0.125rem;
}

.radio__error {
  font-size: 0.75rem;
  color: var(--color-danger);
  margin-top: 0.25rem;
  margin-left: 1.75rem;
}

/* Sizes */
.radio--sm .radio__circle {
  width: 0.875rem;
  height: 0.875rem;
  margin-top: 0.0625rem;
}

.radio--sm .radio__circle--checked .radio__dot {
  width: 0.375rem;
  height: 0.375rem;
}

.radio--sm .radio__label {
  font-size: 0.875rem;
}

.radio--sm .radio__description {
  font-size: 0.75rem;
}

.radio--lg .radio__circle {
  width: 1.25rem;
  height: 1.25rem;
  margin-top: 0.1875rem;
}

.radio--lg .radio__circle--checked .radio__dot {
  width: 0.625rem;
  height: 0.625rem;
}

.radio--lg .radio__label {
  font-size: 1.125rem;
}

.radio--lg .radio__description {
  font-size: 1rem;
}

/* Focus state */
.radio__input:focus-visible + .radio__circle {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
</style>
