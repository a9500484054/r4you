<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
    @click="handleClick"
    @keydown.space.enter="handleKeydown"
  >
    <span v-if="loading" class="button__spinner" />
    <span class="button__content">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  rounded?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  fullWidth: false,
  rounded: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const buttonClasses = computed(() => [
  'button',
  `button--${props.variant}`,
  `button--${props.size}`,
  {
    'button--disabled': props.disabled,
    'button--loading': props.loading,
    'button--full': props.fullWidth,
    'button--rounded': props.rounded,
  }
]);

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event);
  }
};

const handleKeydown = (event: KeyboardEvent) => {
  if ((event.key === 'Enter' || event.key === ' ') && !props.disabled && !props.loading) {
    event.preventDefault();
    emit('click', event as unknown as MouseEvent);
  }
};
</script>

<style scoped>
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
  outline: none;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
  border-radius: 12px;
}

/* Variants */
.button--primary {
  background-color: var(--color-primary);
  color: var(--text-white);
}

.button--primary:hover:not(.button--disabled):not(.button--loading) {
  background-color: var(--color-primary-hover);
}

.button--secondary {
  background-color: var(--color-secondary);
  color: var(--text-white);
}

.button--secondary:hover:not(.button--disabled):not(.button--loading) {
  background-color: var(--color-secondary-hover);
}

.button--danger {
  background-color: var(--color-danger);
  color: var(--text-white);
}

.button--danger:hover:not(.button--disabled):not(.button--loading) {
  background-color: var(--color-danger-hover);
}

.button--outline {
  background-color: var(--bg-gray-100);
  color: var(--text-outline);
}

.button--outline:hover:not(.button--disabled):not(.button--loading) {
  background-color: var(--bg-gray-50);
}

.button--ghost {
  background-color: transparent;
  color: var(--text-primary);
}

.button--ghost:hover:not(.button--disabled):not(.button--loading) {
  background-color: var(--bg-gray-100);
}

/* Sizes */
.button--sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  height: 2rem;
}

.button--md {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  height: 2.5rem;
}

.button--lg {
  padding: 0.625rem 1.25rem;
  font-size: 1.125rem;
  height: 3rem;
}

/* States */
.button--disabled,
.button--loading {
  opacity: 0.5;
  cursor: not-allowed;
}

.button--full {
  width: 100%;
}

.button--rounded {
  border-radius: 9999px;
}

/* Loading Spinner */
.button__spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}

.button__content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Focus states */
.button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
