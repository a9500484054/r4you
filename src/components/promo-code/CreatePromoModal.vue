<template>
  <Modal
    :is-open="isOpen"
    title="Создание промокода"
    @close="handleClose"
  >
    <div class="create-promo-form">
      <StepIndicator
        :current-step="currentStep"
        :clickable="true"
        @step-click="handleStepClick"
      />

      <div class="promo-form">
        <PromoStep1
          v-if="currentStep === 1"
          :key="1"
        />

        <PromoStep2
          v-if="currentStep === 2"
          :key="2"
        />

        <div class="form-footer">
          <div v-if="currentStep === 1" class="form-footer__actions">
            <Button
              type="button"
              variant="outline"
              @click="handleClose"
            >
              Отмена
            </Button>

            <Button
              type="button"
              variant="secondary"
              @click="handleNextStep"
              :loading="isValidating"
              :disabled="!isStep1Valid"
            >
              Далее
            </Button>
          </div>

          <div v-else class="form-footer__actions">
            <Button
              type="button"
              variant="outline"
              @click="prevStep"
              :disabled="isSubmitting"
              :fullWidth=true
            >
              Назад
            </Button>

            <Button
              type="button"
              variant="secondary"
              @click="onSubmit"
              :loading="isSubmitting"
              :disabled="!isFormValid"
              :fullWidth=true
            >
              Создать
            </Button>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import Modal from '@/components/ui/Modal.vue';
import Button from '@/components/ui/Button.vue';
import PromoStep1 from './PromoStep1.vue';
import PromoStep2 from './PromoStep2.vue';
import StepIndicator from './StepIndicator.vue';
import { usePromoCodeStore } from '@/stores/promoCodeStore';
import type { PromoCodeStep } from '@/types/promoCode';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  close: [];
  created: [];
}>();

const promoStore = usePromoCodeStore();

const currentStep = computed(() => promoStore.currentStep);
const isSubmitting = computed(() => promoStore.isSubmitting);
const isStep1Valid = computed(() => promoStore.isStep1Valid);
const isFormValid = computed(() => promoStore.isFormValid);

const {
  validationErrors,
  nextStep,
  prevStep,
  goToStep,
  createPromoCode,
  resetForm
} = promoStore;

const isValidating = ref(false);

const handleClose = () => {
  resetForm();
  emit('close');
};

const handleNextStep = async () => {
  console.log('Текущий шаг перед nextStep:', currentStep.value);
  isValidating.value = true;
  try {
    const success = await nextStep();
    console.log('Результат nextStep:', success);
    console.log('Текущий шаг после nextStep:', currentStep.value);

    if (!success) {
      console.log('Валидация не пройдена, ошибки:', validationErrors);
    }
  } finally {
    isValidating.value = false;
  }
};

const handleStepClick = (step: number) => {
  if (step < currentStep.value) {
    goToStep(step as PromoCodeStep);
  }
};

const onSubmit = async () => {
  const result = await createPromoCode();
  console.log('result', result)
  if (result.success) {
    resetForm();
    emit('created');
    emit('close');
  } else {
    console.log('Ошибки при создании промокода:', result.errors);
  }
};

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    resetForm();
  }
});
</script>

<style scoped>


.promo-form {
  width: 100%;
}


.form-footer__spacer {
  width: 0;
  height: 0;
}

.form-footer__actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto;
  gap: 0.5rem;
}
</style>
