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
}

.step-indicator__container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0 6px;
}

.step-indicator__item {
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-indicator__step {
  padding: 8px;
  border-radius: 8px;
  background-color: #f3f4f6;
  color: rgba(119, 119, 124, 1);
  font-weight: 500;
  font-size: 0.875rem;
  cursor: default;
  transition: all 0.3s ease;
  white-space: nowrap;
  user-select: none;
  width: 100%;
  text-align: center;
}

.step-indicator__step:first-child {
  background-color: transparent
}

.step-indicator__step--active {
  background-color: #ffffff;
  color: #107FD1;
  position: relative;
}
.step-indicator__step--active::after {
  content: "";
  width: 100%;
  height: 2px;
  background-color: #107FD1;
  display: block;
  position: absolute;
  bottom: -1px;
  left: 2px;
}


.step-indicator__step--active:hover {
  background-color: rgba(255, 255, 255, 0.768);
}

.step-indicator__step--inactive:hover {
  background-color: #e5e7eb;
  cursor: pointer;
}


.step-indicator__step[clickable] {
  cursor: pointer;
}
</style>
