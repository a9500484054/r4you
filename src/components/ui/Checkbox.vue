<template>
  <div :class="containerClasses">
    <label :class="labelClasses">
      <input
        :id="id"
        type="checkbox"
        :checked="modelValue"
        :disabled="disabled"
        :class="inputClasses"
        @change="handleChange"
      />

      <span :class="checkboxClasses">
        <svg
          v-if="modelValue"
          class="checkbox__checkmark"
          viewBox="0 0 12 10"
        >
          <path
            d="M10.28.28L3.989 6.575 1.695 4.28A1 1 0 00.28 5.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28.28z"
            fill="currentColor"
          />
        </svg>
      </span>

      <div class="checkbox__content">
        <span v-if="label" class="checkbox__label">
          {{ label }}
        </span>
        <span v-if="description" class="checkbox__description">
          {{ description }}
        </span>
      </div>
    </label>

    <div v-if="error" class="checkbox__error">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { nanoid } from 'nanoid';
import { computed } from 'vue';

interface Props {
  modelValue: boolean;
  label?: string;
  description?: string;
  disabled?: boolean;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  description: '',
  disabled: false,
  error: '',
  size: 'md',
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const id = nanoid();

const containerClasses = computed(() => [
  'checkbox',
  `checkbox--${props.size}`,
  props.disabled && 'checkbox--disabled',
]);

const labelClasses = computed(() => [
  'checkbox__container',
  !props.disabled && 'checkbox__container--interactive',
]);

const inputClasses = computed(() => [
  'checkbox__input',
]);

const checkboxClasses = computed(() => [
  'checkbox__box',
  props.modelValue && 'checkbox__box--checked',
  props.disabled && 'checkbox__box--disabled',
]);

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.checked);
};
</script>

<style scoped>
.checkbox {
  display: inline-flex;
  flex-direction: column;
}

.checkbox__container {
  display: inline-flex;
  align-items: flex-start;
  cursor: pointer;
}

.checkbox__container--interactive:hover .checkbox__box:not(.checkbox__box--disabled) {
  border-color: var(--color-primary);
}

.checkbox__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.checkbox__box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-default);
  border-radius: var(--radius-sm);
  background-color: var(--bg-white);
  transition: all var(--transition-base);
  margin-top: 0.125rem;
  margin-right: 0.25rem;
}

.checkbox__box--checked {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

.checkbox__box--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.checkbox__checkmark {
  width: 0.75rem;
  height: 0.75rem;
  color: var(--text-white);
}

.checkbox__content {
  display: flex;
  flex-direction: column;
}

.checkbox__label {
  color: var(--color-secondary);
  line-height: 1.5;
  font-weight: 500;
  font-size: 14px;
  margin-top: 2px;

}

.checkbox__description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.4;
  margin-top: 0.125rem;
}

.checkbox__error {
  font-size: 0.75rem;
  color: var(--color-danger);
  margin-top: 0.25rem;
  margin-left: 1.75rem;
}

.checkbox--sm .checkbox__box {
  width: 0.875rem;
  height: 0.875rem;
  margin-top: 0.0625rem;
}

.checkbox--sm .checkbox__checkmark {
  width: 0.625rem;
  height: 0.625rem;
}

.checkbox--sm .checkbox__label {
  font-size: 0.875rem;
}

.checkbox--sm .checkbox__description {
  font-size: 0.75rem;
}

.checkbox--lg .checkbox__box {
  width: 1.25rem;
  height: 1.25rem;
  margin-top: 0.1875rem;
}

.checkbox--lg .checkbox__checkmark {
  width: 1rem;
  height: 1rem;
}

.checkbox--lg .checkbox__label {
  font-size: 1.125rem;
}

.checkbox--lg .checkbox__description {
  font-size: 1rem;
}

/* Focus state */
.checkbox__input:focus-visible + .checkbox__box {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
</style>
