<template>
  <div class="date-section">
    <h3 class="section-title">Срок действия промокода <span>*</span></h3>
    <div class="date-row">
      <div class="date-group">
        <label class="date-label">
          Дата начала
        </label>
        <div class="datetime-container">
          <DatePicker
            v-model="startDateValue"
            :error="!!getFieldError('startDate')"
            placeholder="Дата"
            class="date-input"
            :isTimePicker="false"
          />

          <input
            v-model="startTimeDisplay"
            type="time"
            class="time-input"
            placeholder="00:00"
            @change="handleStartTimeInput"
          />
        </div>
        <p v-if="getFieldError('startDate')" class="error-message">
          {{ getFieldError('startDate') }}
        </p>
      </div>

      <div class="date-group">
        <label class="date-label">
          Дата конца
        </label>
        <div class="datetime-container">
          <DatePicker
            v-model="endDateValue"
            :error="!!getFieldError('endDate')"
            :disabled="form?.hasNoEndDate || false"
            placeholder="Дата"
            class="date-input"
          />

          <input
            v-model="endTimeDisplay"
            type="time"
            class="time-input"
            placeholder="00:00"
            :disabled="form?.hasNoEndDate || false"
            @change="handleEndTimeInput"
          />
        </div>
        <p v-if="getFieldError('endDate')" class="error-message">
          {{ getFieldError('endDate') }}
        </p>
      </div>
    </div>

    <div class="checkbox-wrapper">
      <Checkbox
        v-model="hasNoEndDateValue"
        label="Без даты конца"
        description=""
      />
    </div>

  </div>
  <div class="over-section">
    <div class="input-wrapper">
      <Input
        v-model="activationLimitValue"
        label="Введите лимит активаций (шт.)"
        type="number"
        :error="getFieldError('activationLimit')"
        :required="true"
        @blur="handleBlur('activationLimit')"
        min="1"
        placeholder="1000"
      />
    </div>

    <h3 class="section-title">Настроить получение промокода</h3>
    <div class="radio-group">
      <Radio
        v-model="receiveMethodValue"
        value="auto"
        name="receiveMethod"
        label="Создать промокод без отправки"
        variant="primary"
      />

      <Radio
        v-model="receiveMethodValue"
        value="manual"
        name="receiveMethod"
        label="Отправить промокод всем пользователям"
        variant="primary"
      />
    </div>
  </div>
</template>



<script setup lang="ts">
import Input from '@/components/ui/Input.vue';
import { computed, onMounted, ref, watch } from 'vue';
import { usePromoCodeStore } from '@/stores/promoCodeStore';
import Checkbox from '../ui/Checkbox.vue';
import Radio from '../ui/Radio.vue';
import DatePicker from '../ui/DatePicker.vue';

const promoStore = usePromoCodeStore();
const { form, startTime, endTime, validationErrors, setFormField, setHasNoEndDate, setStartTime, setEndTime } = promoStore;

const startTimeDisplay = ref('');
const endTimeDisplay = ref('');

const formatTimeForInput = (timeStr: string | null | undefined): string => {
  if (!timeStr) return '';

  if (/^\d{2}:\d{2}$/.test(timeStr)) {
    return timeStr;
  }

  try {
    const date = new Date(timeStr);
    if (!isNaN(date.getTime())) {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }
  } catch {
    console.log('не удалось распарсить, возвращаем пустую строку')
  }

  return '';
};

const combineDateTime = (datePart: Date | null, timeStr: string): string | null => {
  if (!datePart || !timeStr) return null;

  const date = new Date(datePart);
  const [hours, minutes] = timeStr.split(':').map(Number);

  if (isNaN(hours) || isNaN(minutes)) {
    date.setHours(0, 0, 0, 0);
    return date.toISOString();
  }

  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
};

const handleStartTimeInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const timeValue = target.value;

  if (timeValue) {
    setStartTime(timeValue);

    if (form?.startDate || startDateValue.value) {
      const datePart = startDateValue.value || new Date(form?.startDate || new Date());
      const combinedDateTime = combineDateTime(datePart, timeValue);
      setFormField('startDate', combinedDateTime);
    }
  }
};

const handleEndTimeInput = (event: Event) => {
  if (form?.hasNoEndDate) return;

  const target = event.target as HTMLInputElement;
  const timeValue = target.value;

  if (timeValue) {
    setEndTime(timeValue);

    if (form?.endDate || endDateValue.value) {
      const datePart = endDateValue.value || new Date(form?.endDate || new Date());
      const combinedDateTime = combineDateTime(datePart, timeValue);
      setFormField('endDate', combinedDateTime);
    }
  }
};

const startDateValue = computed({
  get: () => {
    if (!form?.startDate) return null;
    try {
      const d = new Date(form.startDate);
      return isNaN(d.getTime()) ? null : d;
    } catch {
      return null;
    }
  },
  set: (datePart: Date | null) => {
    const currentTime = startTimeDisplay.value || '00:00';
    const combinedDateTime = combineDateTime(datePart, currentTime);
    setFormField('startDate', combinedDateTime);
  }
});

const endDateValue = computed({
  get: () => {
    if (form?.hasNoEndDate || !form?.endDate) return null;
    try {
      const d = new Date(form.endDate);
      return isNaN(d.getTime()) ? null : d;
    } catch {
      return null;
    }
  },
  set: (datePart: Date | null) => {
    if (form?.hasNoEndDate) return;

    const currentTime = endTimeDisplay.value || '23:59';
    const combinedDateTime = combineDateTime(datePart, currentTime);
    setFormField('endDate', combinedDateTime);
  }
});

const activationLimitValue = computed({
  get: () => form?.activationLimit || '',
  set: (value) => setFormField('activationLimit', value)
});

const receiveMethodValue = computed({
  get: () => form?.receiveMethod || 'auto',
  set: (value) => setFormField('receiveMethod', value)
});

const hasNoEndDateValue = computed({
  get: () => form?.hasNoEndDate || false,
  set: (value) => {
    setHasNoEndDate(value);

    if (value) {
      const farFuture = new Date();
      farFuture.setFullYear(farFuture.getFullYear() + 100);
      farFuture.setHours(23, 59, 0, 0);
      setFormField('endDate', farFuture.toISOString());
      setEndTime('00:00');
      endTimeDisplay.value = '00:00';
    } else {
      setFormField('endDate', null);
      setEndTime(null);
    }
  }
});

const getFieldError = (field: string) => {
  return validationErrors?.[field] || '';
};

const handleBlur = (field: string) => {
  if (!form) return;
  promoStore.setFormField(field as any, (form as any)[field]);
};

watch(() => startTime, (newTime) => {
  startTimeDisplay.value = formatTimeForInput(newTime);
}, { immediate: true });

watch(() => endTime, (newTime) => {
  endTimeDisplay.value = formatTimeForInput(newTime);
}, { immediate: true });



onMounted(() => {
  if (!form?.receiveMethod) {
    setFormField('receiveMethod', 'auto');
  }

  if (form?.startDate && !startTime) {
    try {
      const date = new Date(form.startDate);
      if (!isNaN(date.getTime())) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const timeString = `${hours}:${minutes}`;
        setStartTime(timeString);
        startTimeDisplay.value = timeString;
      }
    } catch {
      setStartTime('00:00');
      startTimeDisplay.value = '00:00';
    }
  } else if (!startTime) {
    setStartTime('00:00');
    startTimeDisplay.value = '00:00';
  }

  if (form?.endDate && !form?.hasNoEndDate && !endTime) {
    try {
      const date = new Date(form.endDate);
      if (!isNaN(date.getTime())) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const timeString = `${hours}:${minutes}`;
        setEndTime(timeString);
        endTimeDisplay.value = timeString;
      }
    } catch {
      setEndTime('23:59');
      endTimeDisplay.value = '23:59';
    }
  } else if (!endTime && !form?.hasNoEndDate) {
    setEndTime('23:59');
    endTimeDisplay.value = '23:59';
  }
});
</script>


<style scoped>
.date-section {
  width: 100%;
  border-bottom: 1px solid #EBEBF0;
  margin-bottom: 20px;
}

.section-title {
  color: #111827;
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0px;
  margin-bottom: 12px;
}

.section-title span {
  color: var(--color-danger);
}

.date-row {
  display: flex;
  gap: 16px;
  margin-bottom: 8px;
  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.date-group {
  flex: 1;
}

.date-label {
  display: block;
  color: #797979;
  margin-bottom: 6px;
  font-weight: 500;
  font-style: Medium;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0px;
}

.datetime-container {
  display: flex;
  gap: 8px;
  align-items: center;
}

.datetime-container .datepicker:last-child {
  flex-basis: 40%;
}
.datetime-container .datepicker:first-child {
  flex-basis: 60%;
}

.date-input {
  flex: 1;
}

.time-input {
  width: 90px;
  height: 38px;
  padding: 8px 12px 8px 18px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  color: #111827;
  background-color: #f5f5f5;
  cursor: pointer;
  transition: border-color 0.15s ease-in-out;
  box-sizing: border-box;
  position: relative;
  bottom: 2px;
}

.time-input:focus {
  outline: none;
  border-color: #3B82F6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.time-input.error {
  border-color: #dc2626;
}
.time-input[disabled],
.time-input.disabled {
  background-color: #F3F4F6;
  color: #9CA3AF;
  cursor:default;
  border-color: #E5E7EB;
}

.required {
  color: #dc2626;
}

.error-message {
  margin-top: 4px;
  font-size: 13px;
  color: #dc2626;
}

.checkbox-wrapper {
  margin-bottom: 20px;
}

.input-wrapper {
  margin-bottom: 20px;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.time-input::-webkit-calendar-picker-indicator {
  background: none;
  cursor: pointer;
  opacity: 0.6;
  padding: 0;
  margin: 0;
}

.time-input::-webkit-calendar-picker-indicator:hover {
  opacity: 1;
}

.time-input::-webkit-datetime-edit-fields-wrapper {
  padding: 0;
}

.time-input::-webkit-datetime-edit-text {
  padding: 0 2px;
}

.time-input::-webkit-datetime-edit-hour-field,
.time-input::-webkit-datetime-edit-minute-field {
  padding: 0;
}
</style>
