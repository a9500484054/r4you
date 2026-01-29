<template>
  <div :class="containerClasses">
    <label
      v-if="label"
      :for="id"
      :class="labelClasses"
    >
      {{ label }}
      <span v-if="required" class="input__required">*</span>
    </label>

    <div :class="wrapperClasses">
      <div v-if="hasIconLeft" class="input__icon-left">
        <slot name="icon-left" />
      </div>

      <div v-if="hasPrefix" class="input__prefix">
        <slot name="prefix" />
      </div>

      <input
        :id="id"
        ref="inputRef"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :maxlength="maxLength"
        :class="inputClasses"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      />

      <div v-if="hasSuffix" class="input__suffix">
        <slot name="suffix" />
      </div>
    </div>

    <div class="input__footer">
      <p
        v-if="error"
        class="input__error"
      >
        {{ error }}
      </p>
      <p
        v-else-if="hint"
        class="input__hint"
      >
        {{ hint }}
      </p>
      <p
        v-if="showCounter"
        class="input__counter"
      >
        {{ currentLength }}/{{ maxLength }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nanoid } from 'nanoid';
import { computed, useSlots, ref } from 'vue';

interface Props {
  modelValue: string | number;
  type?: string;
  label?: string;
  placeholder?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
  maxLength?: number;
  size?: 'sm' | 'md' | 'lg';
  showCounter?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  label: '',
  placeholder: '',
  error: '',
  hint: '',
  disabled: false,
  required: false,
  maxLength: undefined,
  size: 'md',
  showCounter: undefined,
});

const emit = defineEmits<{
  'update:modelValue': [value: string | number];
  focus: [];
  blur: [];
}>();

const slots = useSlots();
const inputRef = ref<HTMLInputElement>();
const id = nanoid();

const hasPrefix = computed(() => !!slots.prefix);
const hasSuffix = computed(() => !!slots.suffix);
const hasIconLeft = computed(() => !!slots['icon-left']);
const currentLength = computed(() => String(props.modelValue).length);

const showCounter = computed(() => {
  if (props.showCounter !== undefined) {
    return props.showCounter;
  }
  return props.maxLength !== undefined;
});

const hasLeftContent = computed(() => hasIconLeft.value || hasPrefix.value);

const containerClasses = computed(() => [
  'input',
  `input--${props.size}`,
]);

const labelClasses = computed(() => [
  'input__label',
  props.disabled && 'input__label--disabled',
]);

const wrapperClasses = computed(() => [
  'input__wrapper',
  hasLeftContent.value && 'input__wrapper--has-left-content',
  hasSuffix.value && 'input__wrapper--has-suffix',
  props.error && 'input__wrapper--error',
  props.disabled && 'input__wrapper--disabled',
]);

const inputClasses = computed(() => [
  'input__field',
  props.disabled && 'input__field--disabled',
]);

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};

const handleFocus = () => {
  emit('focus');
};

const handleBlur = () => {
  emit('blur');
};

const focus = () => inputRef.value?.focus();
const blur = () => inputRef.value?.blur();

defineExpose({ focus, blur });
</script>

<style scoped>
.input {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 16px;
}

.input__label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.input__label--disabled {
  color: var(--text-tertiary);
}

.input__required {
  color: var(--color-danger);
}

.input__wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

/* Общие стили для левого контента */
.input__wrapper--has-left-content .input__field {
  padding-left: 2.5rem;
}

.input__wrapper--has-suffix .input__field {
  padding-right: 2.5rem;
}

/* Иконка слева */
.input__icon-left {
  position: absolute;
  left: 0.50rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  color: var(--text-tertiary);
  z-index: 1;
}

/* Префикс - теперь может быть рядом с иконкой */
.input__prefix {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  color: var(--text-tertiary);
  z-index: 1;
}

/* Если есть и иконка, и префикс, смещаем префикс */
.input__icon-left + .input__prefix {
  left: 2rem;
}

.input__suffix {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  color: var(--text-tertiary);
}

.input__field {
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--text-primary);
  background-color: var(--bg-gray-50);
  border: none;
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
}

.input__field:focus {
  outline: none;
  border: 1px solid var(--border-focus);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input__field--disabled {
  background-color: var(--bg-gray-50);
  cursor: not-allowed;
}

.input__field::placeholder {
  color: var(--text-tertiary);
}

.input__wrapper--error .input__field {
  border: 1px solid var(--border-error);
}

.input__wrapper--error .input__field:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.input__wrapper--disabled .input__field {
  opacity: 0.5;
}

/* Sizes */
.input--sm .input__field {
  padding: 0.375rem 0.625rem;
  font-size: 0.75rem;
}

.input--lg .input__field {
  padding: 0.625rem 0.875rem;
  font-size: 1rem;
}

/* Адаптация отступов для иконок в разных размерах */
.input--sm .input__icon-left,
.input--sm .input__prefix {
  left: 0.625rem;
}

.input--lg .input__icon-left,
.input--lg .input__prefix {
  left: 0.875rem;
}

.input__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* min-height: 1.25rem; */
  margin-top: 0.25rem;
}

.input__error {
  font-size: 0.75rem;
  color: var(--color-danger);
  flex: 1;
}

.input__hint {
  font-size: 0.75rem;
  color: var(--text-secondary);
  flex: 1;
}

.input__counter {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  text-align: right;
}
</style>
