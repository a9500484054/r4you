import { defineStore } from 'pinia';
import { ref, reactive, computed } from 'vue';
import type { PromoCodeForm, PromoCodeStep, PromoCode } from '@/types/promoCode';
import { promoCodeStep1Schema, promoCodeStep2Schema } from '@/schemas/promoCodeSchema';

export const usePromoCodeStore = defineStore('promoCode', () => {
  // State
  const currentStep = ref<PromoCodeStep>(1);
  const validationErrors = reactive<Record<string, string>>({});
  const isLoading = ref(false);
  const isSubmitting = ref(false);
  const startTime = ref(null);
  const endTime = ref(null);
  const createdPromoCodes = ref<PromoCode[]>([]);

  const form = reactive<PromoCodeForm>({
    // Шаг 1
    name: '',
    title: '',
    description: '',
    points: null,

    // Шаг 2
    startDate: null,
    endDate: null,
    hasNoEndDate: false,
    activationLimit: null,
    receiveMethod: null,
  });

  // Getters
  const isStep1Valid = computed(() => {
    return Object.keys(validationErrors).filter(key =>
      ['name', 'title', 'description', 'points'].includes(key)
    ).length === 0;
  });

  const isStep2Valid = computed(() => {
    return Object.keys(validationErrors).filter(key =>
      ['startDate', 'endDate', 'activationLimit', 'receiveMethod'].includes(key)
    ).length === 0;
  });

  const isFormValid = computed(() => {
    return isStep1Valid.value && isStep2Valid.value;
  });

  const createdPromoCodesCount = computed(() => {
    return createdPromoCodes.value.length;
  });

  const activePromoCodes = computed(() => {
    const now = new Date();
    return createdPromoCodes.value.filter(promo => {
      const startDate = new Date(promo.startDate);
      const endDate = promo.endDate ? new Date(promo.endDate) : null;

      if (endDate) {
        return startDate <= now && now <= endDate;
      }
      return startDate <= now;
    });
  });

  const inactivePromoCodes = computed(() => {
    const now = new Date();
    return createdPromoCodes.value.filter(promo => {
      const startDate = new Date(promo.startDate);
      const endDate = promo.endDate ? new Date(promo.endDate) : null;

      if (endDate) {
        return now > endDate;
      }
      return now < startDate;
    });
  });

  // Actions
  const setFormField = <K extends keyof PromoCodeForm>(
    field: K,
    value: PromoCodeForm[K]
  ) => {
    form[field] = value;
    if (validationErrors[field]) {
      delete validationErrors[field];
    }
  };

  const validateStep1 = async (): Promise<boolean> => {
    try {
      console.log('Валидация шага 1, данные:', form);

      const dataToValidate = {
        name: form.name,
        title: form.title,
        description: form.description || '',
        points: form.points
      };

      await promoCodeStep1Schema.validate(dataToValidate, { abortEarly: false });
      clearStep1Errors();
      return true;
    } catch (error: any) {
      console.log('Ошибки валидации шага 1:', error);
      if (error.inner) {
        error.inner.forEach((err: any) => {
          validationErrors[err.path] = err.message;
        });
      }
      return false;
    }
  };

  const validateStep2 = async (): Promise<boolean> => {
    try {
      const dataToValidate = {
        startDate: form.startDate,
        endDate: form.hasNoEndDate ? null : form.endDate,
        hasNoEndDate: form.hasNoEndDate,
        activationLimit: form.activationLimit,
        receiveMethod: form.receiveMethod
      };

      await promoCodeStep2Schema.validate(dataToValidate, { abortEarly: false });
      clearStep2Errors();
      return true;
    } catch (error: any) {
      if (error.inner) {
        error.inner.forEach((err: any) => {
          validationErrors[err.path] = err.message;
        });
      }
      return false;
    }
  };

  const nextStep = async (): Promise<boolean> => {

    if (currentStep.value === 1) {
      const isValid = await validateStep1();

      if (isValid) {
        currentStep.value = 2;
        return true;
      } else {
        return false;
      }
    }
    return false;
  };

  const prevStep = (): void => {
    if (currentStep.value === 2) {
      currentStep.value = 1;
    }
  };

  const goToStep = (step: PromoCodeStep): void => {
    if (step < currentStep.value) {
      currentStep.value = step;
    }
  };

  const clearStep1Errors = (): void => {
    ['name', 'title', 'description', 'points'].forEach(key => {
      if (validationErrors[key]) {
        delete validationErrors[key];
      }
    });
  };

  const clearStep2Errors = (): void => {
    ['startDate', 'endDate', 'activationLimit', 'receiveMethod', 'hasNoEndDate'].forEach(key => {
      if (validationErrors[key]) {
        delete validationErrors[key];
      }
    });
  };

  const clearAllErrors = (): void => {
    Object.keys(validationErrors).forEach(key => {
      delete validationErrors[key];
    });
  };

  const resetForm = (): void => {
    form.name = '';
    form.title = '';
    form.description = '';
    form.points = null;
    form.startDate = null;
    form.endDate = null;
    form.hasNoEndDate = false;
    form.activationLimit = null;
    form.receiveMethod = null;

    startTime.value = null;
    endTime.value = null;

    currentStep.value = 1;
    clearAllErrors();
  };

  const addCreatedPromoCode = (promoCode: PromoCode): void => {
    createdPromoCodes.value.unshift(promoCode);
  };

  const removePromoCode = (promoCodeId: string): void => {
    const index = createdPromoCodes.value.findIndex(promo => promo.id === promoCodeId);
    if (index !== -1) {
      createdPromoCodes.value.splice(index, 1);
    }
  };

  const updatePromoCode = (updatedPromoCode: PromoCode): void => {
    const index = createdPromoCodes.value.findIndex(promo => promo.id === updatedPromoCode.id);
    if (index !== -1) {
      createdPromoCodes.value[index] = updatedPromoCode;
    }
  };

  const getPromoCodeById = (promoCodeId: string): PromoCode | undefined => {
    return createdPromoCodes.value.find(promo => promo.id === promoCodeId);
  };

  const createPromoCode = async (): Promise<{ success: boolean; data?: PromoCode; errors?: Record<string, string> }> => {
    isSubmitting.value = true;
    try {

      const step1Valid = await validateStep1();
      const step2Valid = await validateStep2();


      if (!step1Valid || !step2Valid) {
        return {
          success: false,
          errors: { ...validationErrors }
        };
      }

      const promoCodeId = generatePromoCodeId();

      const startDate = combineDateTime(form.startDate.split('T')[0], startTime.value);
      const endDate = form.endDate ? combineDateTime(form.endDate.split('T')[0], endTime.value) : null;

      const newPromoCode: PromoCode = {
        id: promoCodeId,
        name: form.name,
        title: form.title,
        description: form.description || '',
        points: form.points || 0,
        startDate: startDate,
        endDate: endDate,
        hasNoEndDate: form.hasNoEndDate,
        activationLimit: form.activationLimit,
        receiveMethod: form.receiveMethod,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
        usedCount: 0,
        remainingUses: form.activationLimit || 0
      };


      addCreatedPromoCode(newPromoCode);

      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Промокод создан успешно', {
        success: true,
        data: newPromoCode
      });

      resetForm();

      return {
        success: true,
        data: newPromoCode
      };

    } catch (error: any) {
      console.error('Ошибка создания промокода:', error);
      return {
        success: false,
        errors: {
          general: error.message || 'Произошла ошибка при создании промокода'
        }
      };
    } finally {
      isSubmitting.value = false;
    }
  };

  const generatePromoCodeId = (): string => {
    return 'promo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  const onNameInput = (value: string): void => {
    setFormField('name', value.toUpperCase().trim());
  };

  const setHasNoEndDate = (value: boolean): void => {
    form.hasNoEndDate = value;

    if (value) {
      form.endDate = null;
      if (validationErrors.endDate) {
        delete validationErrors.endDate;
      }
    }
  };

  const setStartTime = (time: string | null) => {
    startTime.value = time;
  };

  const setEndTime = (time: string | null) => {
    endTime.value = time;
  };

  function combineDateTime(dateString: string, timeString: string | null): string {
    if (!timeString) {
      const date = new Date(dateString);
      return date.toISOString();
    }

    const date = new Date(dateString);
    const [hours, minutes] = timeString.split(':');
    const newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), parseInt(hours), parseInt(minutes));

    return newDate.toISOString();
  }

  return {
    // State
    form,
    currentStep,
    validationErrors,
    isLoading,
    isSubmitting,
    startTime,
    endTime,
    createdPromoCodes,

    // Getters
    isStep1Valid,
    isStep2Valid,
    isFormValid,
    createdPromoCodesCount,
    activePromoCodes,
    inactivePromoCodes,

    // Actions
    setFormField,
    validateStep1,
    validateStep2,
    nextStep,
    prevStep,
    goToStep,
    createPromoCode,
    resetForm,
    onNameInput,
    clearAllErrors,
    setHasNoEndDate,
    setEndTime,
    setStartTime,
    addCreatedPromoCode,
    removePromoCode,
    updatePromoCode,
    getPromoCodeById
  };
});
