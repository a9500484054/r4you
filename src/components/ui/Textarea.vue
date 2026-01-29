<template>
  <div :class="containerClasses">
    <label
      v-if="label"
      :for="id"
      :class="labelClasses"
    >
      {{ label }}
      <span v-if="required" class="textarea__required">*</span>
    </label>

    <div :class="wrapperClasses">
      <textarea
        :id="id"
        ref="textareaRef"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :maxlength="maxLength"
        :rows="rows"
        :class="textareaClasses"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
      />

      <div
        v-if="hasSuffix"
        class="textarea__suffix"
      >
        <slot name="suffix" />
      </div>
    </div>

    <div class="textarea__footer">
      <p
        v-if="error"
        class="textarea__error"
      >
        {{ error }}
      </p>
      <p
        v-else-if="hint"
        class="textarea__hint"
      >
        {{ hint }}
      </p>
      <p
        v-if="showCounter"
        class="textarea__counter"
      >
        {{ currentLength }}/{{ maxLength }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nanoid } from 'nanoid';
import { computed, useSlots, ref, onMounted, nextTick } from 'vue';

interface Props {
  modelValue: string | number;
  label?: string;
  placeholder?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
  maxLength?: number;
  rows?: number;
  autoresize?: boolean;
  minHeight?: number;
  maxHeight?: number;
  size?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  placeholder: '',
  error: '',
  hint: '',
  disabled: false,
  required: false,
  maxLength: undefined,
  rows: 4,
  autoresize: false,
  minHeight: 60,
  maxHeight: 300,
  size: 'md',
});

const emit = defineEmits<{
  'update:modelValue': [value: string | number];
  focus: [];
  blur: [];
}>();

const slots = useSlots();
const textareaRef = ref<HTMLTextAreaElement>();
const id = nanoid();

const hasSuffix = computed(() => !!slots.suffix);
const currentLength = computed(() => String(props.modelValue).length);
const showCounter = computed(() => props.maxLength !== undefined);

const containerClasses = computed(() => [
  'textarea',
  `textarea--${props.size}`,
]);

const labelClasses = computed(() => [
  'textarea__label',
  props.disabled && 'textarea__label--disabled',
]);

const wrapperClasses = computed(() => [
  'textarea__wrapper',
  hasSuffix.value && 'textarea__wrapper--has-suffix',
  props.error && 'textarea__wrapper--error',
  props.disabled && 'textarea__wrapper--disabled',
]);

const textareaClasses = computed(() => [
  'textarea__field',
  props.autoresize && 'textarea__field--autoresize',
  props.disabled && 'textarea__field--disabled',
]);

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement;
  emit('update:modelValue', target.value);

  if (props.autoresize && textareaRef.value) {
    nextTick(() => {
      autoResizeTextarea(textareaRef.value!);
    });
  }
};

const handleFocus = () => {
  emit('focus');
};

const handleBlur = () => {
  emit('blur');
};

const handleKeydown = (event: KeyboardEvent) => {
  if (props.maxLength && currentLength.value >= props.maxLength && event.key !== 'Backspace') {
    event.preventDefault();
  }
};

const autoResizeTextarea = (textarea: HTMLTextAreaElement) => {
  textarea.style.height = 'auto';
  const contentHeight = textarea.scrollHeight;

  let newHeight = contentHeight;
  if (props.minHeight && newHeight < props.minHeight) {
    newHeight = props.minHeight;
  }
  if (props.maxHeight && newHeight > props.maxHeight) {
    newHeight = props.maxHeight;
    textarea.style.overflowY = 'auto';
  } else {
    textarea.style.overflowY = 'hidden';
  }

  textarea.style.height = `${newHeight}px`;
};

onMounted(() => {
  if (props.autoresize && textareaRef.value) {
    autoResizeTextarea(textareaRef.value);
  }
});

const focus = () => textareaRef.value?.focus();
const blur = () => textareaRef.value?.blur();
const resize = () => textareaRef.value && autoResizeTextarea(textareaRef.value);

defineExpose({ focus, blur, resize });
</script>

<style scoped>
.textarea {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.textarea__label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.textarea__label--disabled {
  color: var(--text-tertiary);
}

.textarea__required {
  color: var(--color-danger);
  margin-left: 0.25rem;
}

.textarea__wrapper {
  position: relative;
}

.textarea__wrapper--has-suffix .textarea__field {
  padding-right: 2.5rem;
}

.textarea__suffix {
  position: absolute;
  right: 0.75rem;
  top: 0.75rem;
  display: flex;
  align-items: center;
  color: var(--text-tertiary);
}

.textarea__field {
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--text-primary);
  background-color: var(--bg-gray-50);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
  resize: vertical;
  font-family: inherit;
  min-height: 2.5rem;
  padding-right: 34px;
}

.textarea__field--autoresize {
  resize: none;
  overflow-y: hidden;
}

.textarea__field:focus {
  outline: none;
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.textarea__field--disabled {
  background-color: var(--bg-gray-50);
  opacity: 0.5;
  cursor: not-allowed;
}

.textarea__field::placeholder {
  color: var(--text-tertiary);
}

.textarea__wrapper--error .textarea__field {
  border-color: var(--border-error);
}

.textarea__wrapper--error .textarea__field:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.textarea__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 1.25rem;
  margin-top: 0.25rem;
}

.textarea__error {
  font-size: 0.75rem;
  color: var(--color-danger);
  flex: 1;
}

.textarea__hint {
  font-size: 0.75rem;
  color: var(--text-secondary);
  flex: 1;
}

.textarea__counter {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  text-align: right;
  margin-left: auto;
}

/* Sizes */
.textarea--sm .textarea__field {
  padding: 0.375rem 0.625rem;
  font-size: 0.75rem;
  min-height: 2rem;
}

.textarea--lg .textarea__field {
  padding: 0.625rem 0.875rem;
  font-size: 1rem;
  min-height: 3rem;
}

/* Scrollbar styling */
.textarea__field::-webkit-scrollbar {
  width: 8px;
}

.textarea__field::-webkit-scrollbar-track {
  background: var(--bg-gray-100);
  border-radius: 4px;
}

.textarea__field::-webkit-scrollbar-thumb {
  background: var(--text-tertiary);
  border-radius: 4px;
}

.textarea__field::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}
</style>
