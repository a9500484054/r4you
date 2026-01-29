<template>
  <div class="step-indicator">
    <div class="step-indicator__container">
      <div
        v-for="(step, index) in steps"
        :key="index"
        class="step-indicator__item"
      >
        <div
          :class="[
            'step-indicator__step',
            currentStep === step.step ? 'step-indicator__step--active' : '',
            clickable && currentStep !== step.step ? 'step-indicator__step--inactive' : ''
          ]"
          @click="onStepClick(step.step)"
        >
          <div class="step-indicator__number">{{ step.label }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Step {
  step: number;
  label: string;
}

interface Props {
  currentStep: number;
  steps?: Step[];
  clickable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  steps: () => [
    { step: 1, label: 'Шаг 1: Основное' },
    { step: 2, label: 'Шаг 2: Настройки промокода' }
  ],
  clickable: false
});

const emit = defineEmits<{
  'step-click': [step: number];
}>();

const onStepClick = (step: number) => {
  if (props.clickable) {
    emit('step-click', step);
  }
};
</script>

<style scoped>
.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  border-bottom: 1px solid #E5E5EA;
  width: 100%;
}

.step-indicator__container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0 6px;
  box-sizing: border-box;
}

.step-indicator__item {
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-indicator__step {
  padding: 8px 12px;
  border-radius: 8px;
  background-color: #f3f4f6;
  color: rgba(119, 119, 124, 1);
  font-weight: 500;
  font-size: clamp(0.75rem, 2vw, 0.875rem);
  cursor: default;
  transition: all 0.3s ease;
  white-space: nowrap;
  user-select: none;
  width: 100%;
  text-align: center;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.step-indicator__step:first-child {
  background-color: transparent;
}

.step-indicator__step--active {
  background-color: #ffffff;
  color: #107FD1;
  position: relative;
  font-weight: 600;
}

.step-indicator__step--active::after {
  content: "";
  width: calc(100% - 4px);
  height: 2px;
  background-color: #107FD1;
  display: block;
  position: absolute;
  bottom: -1px;
  left: 2px;
}

.step-indicator__step--active:hover {
  background-color: rgba(16, 127, 209, 0.08);
}

.step-indicator__step--inactive:hover {
  background-color: #e5e7eb;
  cursor: pointer;
}

.step-indicator__step[clickable] {
  cursor: pointer;
}

/* Адаптивные стили для разных размеров экрана */
@media (max-width: 768px) {
  .step-indicator__container {
    grid-template-columns: 1fr;
    gap: 0.25rem;
    padding: 0 4px;
  }

  .step-indicator__step {
    padding: 10px 8px;
    font-size: 0.8125rem;
    min-height: 40px;
    white-space: normal;
    line-height: 1.2;
  }

  .step-indicator__step--active::after {
    width: calc(100% - 8px);
    left: 4px;
  }
}

@media (max-width: 480px) {
  .step-indicator {
    margin-bottom: 0.75rem;
    padding: 0 8px;
  }

  .step-indicator__container {
    gap: 0.125rem;
  }

  .step-indicator__step {
    padding: 8px 6px;
    font-size: 0.75rem;
    min-height: 36px;
    border-radius: 6px;
  }

  .step-indicator__step--active::after {
    height: 1.5px;
    bottom: -2px;
  }
}

@media (min-width: 1024px) {
  .step-indicator__container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .step-indicator__step {
    font-size: 0.9375rem;
    padding: 10px 16px;
  }
}

/* Для очень маленьких экранов (например, iPhone SE) */
@media (max-width: 320px) {
  .step-indicator__step {
    font-size: 0.6875rem;
    padding: 6px 4px;
    min-height: 32px;
  }
}

/* Для планшетов в портретной ориентации */
@media (min-width: 769px) and (max-width: 1024px) {
  .step-indicator__container {
    grid-template-columns: repeat(2, 1fr);
  }

  .step-indicator__step {
    padding: 10px 12px;
  }
}
</style>
