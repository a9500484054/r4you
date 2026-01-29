<template>
  <div :class="containerClasses">
    <label
      v-if="label"
      :for="id"
      :class="labelClasses"
    >
      {{ label }}
      <span v-if="required" class="datepicker__required">*</span>
    </label>

    <div class="datepicker__input-wrapper" :class="{ 'no-icon-default': noDefaultIcon }">
      <div
        v-if="icon"
        class="datepicker__icon"
        :class="{ 'datepicker__icon--disabled': disabled }"
      >
        <slot name="icon">
          
        </slot>
      </div>

      <div
        v-if="showFloatingLabel"
        class="datepicker__floating-label"
        :class="floatingLabelClasses"
      >
        {{ floatingLabelText }}
      </div>

      <VueDatePicker
        :id="id"
        v-model="dateValue"
        :locale="russianLocale"
        :enable-time-picker="isTimePicker"
        :format="formatDate"
        :disabled="disabled"
        :placeholder="floatingPlaceholder ? '' : placeholder"
        :input-class-name="inputClasses"
        :time-picker="timePickerConfig"
        auto-apply
        :teleport-center="true"
        @open="onDatePickerOpen"
        @close="onDatePickerClose"
        @internal-model-change="onDateChange"
      />
    </div>

    <div class="datepicker__footer">
      <!-- <p
        v-if="error"
        class="datepicker__error"
      >
        {{ error }}
      </p> -->
      <p
        v-if="hint"
        class="datepicker__hint"
      >
        {{ hint }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useSlots, watch } from 'vue';
import { VueDatePicker } from '@vuepic/vue-datepicker';
import { ru } from 'date-fns/locale';
import '@vuepic/vue-datepicker/dist/main.css';
import type { ITimePickerProps } from '@vuepic/vue-datepicker';

interface Props {
  modelValue: Date | string | null;
  label?: string;
  placeholder?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
  size?: 'sm' | 'md' | 'lg';
  icon?: boolean; // Показывать иконку
  floatingPlaceholder?: boolean; // Включать плавающий плейсхолдер
  isTimePicker?: boolean;
  timeFormat?: 'HH:mm' | 'hh:mm a' | 'hh:mm A'; // Формат времени
  timePickerIncrement?: number; // Шаг времени в минутах
  noDefaultIcon: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  label: '',
  placeholder: 'Выберите дату',
  error: '',
  hint: '',
  disabled: false,
  required: false,
  size: 'md',
  icon: false,
  floatingPlaceholder: false,
  isTimePicker: false,
  timeFormat: 'HH:mm',
  timePickerIncrement: 30,
  noDefaultIcon: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: Date | null];
}>();

const slots = useSlots();
const hasIconSlot = computed(() => !!slots.icon);

// Состояния для плавающего плейсхолдера
const isFocused = ref(false);
const hasValue = ref(false);
const isPickerOpen = ref(false);

// Генерируем уникальный ID для input
const id = `datepicker-${Math.random().toString(36).substr(2, 9)}`;

const russianLocale = {
  ...ru,
  months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
  monthsShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
  weekdays: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
  weekdaysShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
  weekdaysMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
  format: 'dd.MM.yyyy',
  firstDayOfWeek: 1,
};

// Конфигурация для time-picker (только если isTimePicker = true)
const timePickerConfig = computed<ITimePickerProps | undefined>(() => {
  if (!props.isTimePicker) return undefined;

  return {
    hoursIncrement: 1,
    minutesIncrement: props.timePickerIncrement,
    format: props.timeFormat,
    ampm: props.timeFormat.includes('a') || props.timeFormat.includes('A'),
    locale: {
      am: 'AM',
      pm: 'PM'
    }
  };
});

const containerClasses = computed(() => [
  'datepicker',
  `datepicker--${props.size}`,
  {
    'datepicker--has-icon': props.icon,
    'datepicker--floating': props.floatingPlaceholder,
    'datepicker--time': props.isTimePicker,
  }
]);

const labelClasses = computed(() => [
  'datepicker__label',
  props.disabled && 'datepicker__label--disabled',
]);

const inputClasses = computed(() => [
  'datepicker__input',
  props.error && 'datepicker__input--error',
  props.disabled && 'datepicker__input--disabled',
  props.icon && 'datepicker__input--has-icon',
  props.floatingPlaceholder && 'datepicker__input--floating',
  props.isTimePicker && 'datepicker__input--time',
]);

// Логика плавающего плейсхолдера
const showFloatingLabel = computed(() =>
  props.floatingPlaceholder && (isFocused.value || hasValue.value || isPickerOpen.value)
);

const floatingLabelText = computed(() => {
  if (props.placeholder) return props.placeholder;
  return props.isTimePicker ? 'Выберите дату и время' : 'Выберите дату';
});

const floatingLabelClasses = computed(() => [
  'datepicker__floating-label',
  {
    'datepicker__floating-label--active': isFocused.value || hasValue.value || isPickerOpen.value,
    'datepicker__floating-label--error': props.error,
    'datepicker__floating-label--disabled': props.disabled,
  }
]);

const formatDate = (date: Date) => {
  if (!date) return '';
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  if (props.isTimePicker) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }

  return `${day}.${month}.${year}`;
};



const dateValue = computed({
  get: () => {
    if (!props.modelValue) return null;
    if (props.modelValue instanceof Date) return props.modelValue;
    return new Date(props.modelValue);
  },
  set: (value: Date | null) => {
    emit('update:modelValue', value);
    hasValue.value = !!value;
  }
});

// Отслеживаем изменения значения
watch(() => props.modelValue, (newValue) => {
  hasValue.value = !!newValue;
}, { immediate: true });

// Обработчики событий DatePicker
const onDatePickerOpen = () => {
  isPickerOpen.value = true;
  isFocused.value = true;
};

const onDatePickerClose = () => {
  isPickerOpen.value = false;
  isFocused.value = false;
};

const onDateChange = () => {
  hasValue.value = !!dateValue.value;
};
</script>

<style scoped>
.datepicker {
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
}

.datepicker__label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.datepicker__label--disabled {
  color: var(--text-tertiary);
}

.datepicker__required {
  color: var(--color-danger);
  margin-left: 0.25rem;
}

.datepicker__input-wrapper {
  position: relative;
}

.datepicker__icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  color: var(--text-tertiary);
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color var(--transition-base);
}

.datepicker__icon--disabled {
  color: var(--text-quaternary);
}

.datepicker--has-icon :deep(.datepicker__input) {
  padding-left: 2.5rem;
}

/* Плавающий лейбл */
.datepicker__floating-label {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  transform-origin: left top;
  z-index: 2;
  color: var(--text-tertiary);
  pointer-events: none;
  transition: all var(--transition-base);
  font-size: 0.875rem;
  background-color: var(--bg-white);
  padding: 0 0.25rem;
  line-height: 1;
}

.datepicker--has-icon .datepicker__floating-label {
  left: 2.5rem;
}

.datepicker__floating-label--active {
  top: 0;
  transform: translateY(-50%) scale(0.85);
  color: var(--color-primary);
}

.datepicker__floating-label--error {
  color: var(--color-danger);
}

.datepicker__floating-label--disabled {
  color: var(--text-quaternary);
}

.datepicker__floating-label--active.datepicker__floating-label--error {
  color: var(--color-danger);
}

.datepicker__input--floating:placeholder-shown:not(:focus) + .datepicker__floating-label {
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.875rem;
}

/* При фокусе с иконкой */
.datepicker--has-icon .datepicker__input:focus:not(:placeholder-shown) + .datepicker__floating-label,
.datepicker--has-icon .datepicker__input--floating:focus + .datepicker__floating-label {
  left: 0.75rem;
}

.datepicker__footer {
  /* min-height: 1.25rem; */
  margin-top: 0.25rem;
}

.datepicker__error {
  font-size: 0.75rem;
  color: var(--color-danger);
}

.datepicker__hint {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

/* DatePicker custom styles */
:deep(.datepicker__input) {
  width: 100%;
  height: 2.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--text-primary);
  background-color: var(--bg-white);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
  position: relative;
  z-index: 1;
}

.datepicker--floating :deep(.datepicker__input) {
  padding-top: 0.75rem;
}

.datepicker--time :deep(.datepicker__input) {
  cursor: pointer;
}

:deep(.datepicker__input:hover:not(:disabled)) {
  border-color: var(--border-focus);
}

:deep(.datepicker__input:focus) {
  outline: none;
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

:deep(.datepicker__input--error) {
  border-color: var(--border-error);
}

:deep(.datepicker__input--error:focus) {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

:deep(.datepicker__input--disabled) {
  background-color: var(--bg-gray-50);
  opacity: 0.5;
  cursor: not-allowed;
}

:deep(.datepicker__input::placeholder) {
  color: var(--text-tertiary);
  opacity: 0;
  transition: opacity var(--transition-base);
}

.datepicker--floating :deep(.datepicker__input:not(:focus):placeholder-shown)::placeholder {
  opacity: 1;
}

/* Sizes */
.datepicker--sm :deep(.datepicker__input) {
  height: 2rem;
  padding: 0.375rem 0.625rem;
  font-size: 0.75rem;
}

.datepicker--sm.datepicker--floating :deep(.datepicker__input) {
  padding-top: 0.625rem;
}

.datepicker--sm .datepicker__icon {
  left: 0.625rem;
}

.datepicker--sm .datepicker__floating-label {
  font-size: 0.75rem;
}

.datepicker--sm.datepicker--has-icon :deep(.datepicker__input) {
  padding-left: 2.25rem;
}

.datepicker--lg :deep(.datepicker__input) {
  height: 3rem;
  padding: 0.625rem 0.875rem;
  font-size: 1rem;
}

.datepicker--lg.datepicker--floating :deep(.datepicker__input) {
  padding-top: 1rem;
}

.datepicker--lg .datepicker__icon {
  left: 0.875rem;
}

.datepicker--lg .datepicker__floating-label {
  font-size: 1rem;
}

.datepicker--lg.datepicker--has-icon :deep(.datepicker__input) {
  padding-left: 2.75rem;
}

/* DatePicker menu styles */
:deep(.dp__menu) {
  font-family: inherit;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
}

:deep(.dp__today) {
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
}

:deep(.dp__active_date) {
  background-color: var(--color-primary) !important;
  color: var(--text-white) !important;
}

:deep(.dp__action_select) {
  background-color: var(--color-primary) !important;
  color: var(--text-white) !important;
}

/* Time picker specific styles */
:deep(.dp__time_col) {
  border-left: 1px solid var(--border-default);
}

:deep(.dp__time_display) {
  color: var(--text-primary);
}

:deep(.dp__clock) {
  background: var(--bg-white);
}

:deep(.dp__clock_hand) {
  background-color: var(--color-primary);
}

:deep(.dp__clock_hand_ring) {
  border: 2px solid var(--color-primary);
}

:deep(.dp__clock_item_selected) {
  background-color: var(--color-primary) !important;
  color: var(--text-white) !important;
}


</style>
