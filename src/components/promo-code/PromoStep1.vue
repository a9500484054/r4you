<template>
  <div class="space-y-4">

    <Input
      v-model="localName"
      label="Название промокода"
      placeholder="Введи название"
      :error="getFieldError('name')"
      :required="true"
      :max-length="30"
      :show-counter="false"
      @update:model-value="handleNameInput"
      @blur="handleBlur('name')"
    />

    <Input
      v-model="form.title"
      label="Заголовок"
      placeholder="Введите заголовок"
      :error="getFieldError('title')"
      :required="true"
      :max-length="120"
      :show-counter="false"
      @blur="handleBlur('title')"
    />

    <Textarea
      v-model="form.description"
      label="Сопроводительный текст"
      placeholder="Например: «Ты попал в число счастливчиков! Дарим 300 баллов»"
      :rows="3"
      :autoresize="true"
      :maxLength="250"
      hint=""
      @blur="handleBlur('description')"
    />

    <Input
      v-model="form.points"
      label="Количество баллов"
      placeholder="Введите количество баллов"
      :error="getFieldError('points')"
      :required="true"
      type="number"
      min="1"
      @blur="handleBlur('points')"
    >
      <template #icon-left>
        <CoinIcon />
      </template>
    </Input>
  </div>
</template>

<script setup lang="ts">
import Input from '@/components/ui/Input.vue';
import { computed } from 'vue';
import { usePromoCodeStore } from '@/stores/promoCodeStore';
import Textarea from '../ui/Textarea.vue';
import CoinIcon from '@/components/ui/icon/CoinIcon.vue';

const promoStore = usePromoCodeStore();
const { form, validationErrors } = promoStore;

const localName = computed({
  get: () => form.name,
  set: (value) => promoStore.setFormField('name', value)
});

const getFieldError = (field: string) => {
  return validationErrors[field] || '';
};

const handleNameInput = (value: string) => {
  promoStore.onNameInput(value);
};

const handleBlur = (field: string) => {
  if (field === 'name') {
    return;
  }
  promoStore.setFormField(field as any, (form as any)[field]);
};
</script>
