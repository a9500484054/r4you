<template>
  <div class="promo-management-page">
    <div class="promo-container">
      <h1 class="promo-title">Управление промокодами</h1>
      <p class="promo-subtitle">Создавайте и управляйте промокодами для вашей системы</p>

      <div class="promo-card">
        <div class="promo-card-header">
          <div>
            <h2 class="promo-card-title">Доступные промокоды</h2>
            <p class="promo-card-description">
              Всего промокодов: {{ createdPromoCodesCount }}
              <span v-if="activePromoCodesCount > 0">• Активных: {{ activePromoCodesCount }}</span>
              <span v-if="inactivePromoCodesCount > 0">• Неактивных: {{ inactivePromoCodesCount }}</span>
            </p>
          </div>

          <Button @click="isModalOpen = true" class="promo-button promo-button-primary">
            Создать промокод
          </Button>
        </div>

        <div v-if="createdPromoCodes.length > 0" class="promo-list">
          <div class="promo-list-header">
            <div class="promo-list-header-item promo-name">Название</div>
            <div class="promo-list-header-item promo-points">Баллы</div>
            <div class="promo-list-header-item promo-dates">Период действия</div>
            <div class="promo-list-header-item promo-status">Статус</div>
            <div class="promo-list-header-item promo-actions">Действия</div>
          </div>

          <div class="promo-list-body">
            <div
              v-for="promo in createdPromoCodes"
              :key="promo.id"
              class="promo-item"
              :class="{ 'promo-item-active': isPromoActive(promo), 'promo-item-inactive': !isPromoActive(promo) }"
            >
              <div class="promo-item-content">
                <div class="promo-name">
                  <div class="promo-code-name">{{ promo.name }}</div>
                  <div class="promo-code-title">{{ promo.title }}</div>
                  <div v-if="promo.description" class="promo-code-description">{{ promo.description }}</div>
                </div>

                <div class="promo-points">
                  <span class="promo-points-value">{{ promo.points }}</span>
                  <span class="promo-points-label">баллов</span>
                </div>

                <div class="promo-dates">
                  <div class="promo-date">
                    <span class="promo-date-label">Начало:</span>
                    <span class="promo-date-value">{{ formatDate(promo.startDate) }}</span>
                  </div>
                  <div class="promo-date">
                    <span class="promo-date-label">{{ promo.hasNoEndDate ? 'Без конца' : 'Конец:' }}</span>
                    <span v-if="!promo.hasNoEndDate && promo.endDate" class="promo-date-value">
                      {{ formatDate(promo.endDate) }}
                    </span>
                    <span v-else-if="promo.hasNoEndDate" class="promo-date-value">∞</span>
                  </div>
                </div>

                <div class="promo-status">
                  <span
                    class="promo-status-badge"
                    :class="{
                      'promo-status-active': isPromoActive(promo),
                      'promo-status-inactive': !isPromoActive(promo)
                    }"
                  >
                    {{ isPromoActive(promo) ? 'Активен' : 'Неактивен' }}
                  </span>
                  <div v-if="promo.activationLimit" class="promo-usage">
                    Использовано: {{ promo.usedCount }} / {{ promo.activationLimit }}
                  </div>
                </div>

                <div class="promo-actions">
                  <button
                    class="promo-action-btn promo-action-copy"
                    @click="copyPromoCode(promo.name)"
                    title="Скопировать код"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                    </svg>
                  </button>

                  <button
                    class="promo-action-btn promo-action-delete"
                    @click="deletePromoCode(promo.id)"
                    title="Удалить"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="promo-empty-state">
          <div class="promo-empty-icon">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h3 class="promo-empty-title">Промокоды не найдены</h3>
          <p class="promo-empty-description">Создайте ваш первый промокод, нажав на кнопку выше</p>
        </div>
      </div>
    </div>

    <CreatePromoModal
      :is-open="isModalOpen"
      @close="isModalOpen = false"
      @created="onPromoCodeCreated"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Button from '@/components/ui/Button.vue';
import CreatePromoModal from '@/components/promo-code/CreatePromoModal.vue';
import { usePromoCodeStore } from '@/stores/promoCodeStore';
import type { PromoCode } from '@/types/promoCode';

const isModalOpen = ref(false);
const promoCodeStore = usePromoCodeStore();

const createdPromoCodes = computed(() => promoCodeStore.createdPromoCodes);
const createdPromoCodesCount = computed(() => promoCodeStore.createdPromoCodesCount);
const activePromoCodesCount = computed(() => promoCodeStore.activePromoCodes.length);
const inactivePromoCodesCount = computed(() => promoCodeStore.inactivePromoCodes.length);

const onPromoCodeCreated = () => {
  console.log('Промокод успешно создан!');
  isModalOpen.value = false;
};

const isPromoActive = (promo: PromoCode): boolean => {
  const now = new Date();
  const startDate = new Date(promo.startDate);
  const endDate = promo.endDate ? new Date(promo.endDate) : null;

  if (endDate) {
    return startDate <= now && now <= endDate;
  }
  return startDate <= now && promo.isActive;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const copyPromoCode = async (code: string) => {
  try {
    await navigator.clipboard.writeText(code);
    alert(`Промокод "${code}" скопирован в буфер обмена`);
  } catch (err) {
    console.error('Ошибка копирования:', err);
    alert('Не удалось скопировать промокод');
  }
};

const deletePromoCode = (promoCodeId: string) => {
  if (confirm('Вы уверены, что хотите удалить этот промокод?')) {
    promoCodeStore.removePromoCode(promoCodeId);
  }
};
</script>

<style scoped>
.promo-management-page {
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 2rem;
}

.promo-container {
  max-width: 56rem;
  margin-left: auto;
  margin-right: auto;
}

/* Заголовки */
.promo-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
}

.promo-subtitle {
  color: #6b7280;
  margin-bottom: 2rem;
}

.promo-card {
  background-color: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
}

.promo-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.promo-card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.promo-card-description {
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.promo-card-description span {
  margin-left: 0.5rem;
  color: #4b5563;
}

.promo-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  outline: none;
}

.promo-button-primary {
  background-color: #3b82f6;
  color: white;
}

.promo-button-primary:hover {
  background-color: #2563eb;
}

.promo-button-primary:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 2px #fff, 0 0 0 4px #3b82f6;
}

.promo-list {
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
}

.promo-list-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr 1fr 0.5fr;
  background-color: #f9fafb;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.promo-list-body {
  max-height: 500px;
  overflow-y: auto;
}

.promo-item {
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.2s ease;
}

.promo-item:hover {
  background-color: #f9fafb;
}

.promo-item:last-child {
  border-bottom: none;
}

.promo-item-active {
  border-left: 4px solid #10b981;
}

.promo-item-inactive {
  border-left: 4px solid #6b7280;
}

.promo-item-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr 1fr 0.5fr;
  padding: 1rem;
  align-items: center;
}

.promo-name {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.promo-code-name {
  font-weight: 600;
  color: #111827;
  font-size: 1.125rem;
  font-family: monospace;
  letter-spacing: 0.05em;
}

.promo-code-title {
  color: #374151;
  font-weight: 500;
}

.promo-code-description {
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.promo-points {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.promo-points-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #f59e0b;
}

.promo-points-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.promo-dates {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.promo-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.promo-date-label {
  font-size: 0.875rem;
  color: #6b7280;
  min-width: 60px;
}

.promo-date-value {
  font-weight: 500;
  color: #374151;
}

.promo-status {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.promo-status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
  width: fit-content;
}

.promo-status-active {
  background-color: #d1fae5;
  color: #065f46;
}

.promo-status-inactive {
  background-color: #e5e7eb;
  color: #374151;
}

.promo-usage {
  font-size: 0.75rem;
  color: #6b7280;
}

.promo-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.promo-action-btn {
  padding: 0.375rem;
  border-radius: 0.375rem;
  border: none;
  background: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.promo-action-btn:hover {
  background-color: #f3f4f6;
}

.promo-action-copy {
  color: #3b82f6;
}

.promo-action-copy:hover {
  color: #2563eb;
  background-color: #dbeafe;
}

.promo-action-delete {
  color: #ef4444;
}

.promo-action-delete:hover {
  color: #dc2626;
  background-color: #fee2e2;
}

.promo-empty-state {
  border: 2px dashed #e5e7eb;
  border-radius: 0.5rem;
  padding: 3rem;
  text-align: center;
}

.promo-empty-icon {
  margin: 0 auto;
  width: 3rem;
  height: 3rem;
  color: #9ca3af;
}

.promo-empty-title {
  margin-top: 1rem;
  font-size: 1.125rem;
  font-weight: 500;
  color: #111827;
}

.promo-empty-description {
  margin-top: 0.25rem;
  color: #6b7280;
}

@media (max-width: 1024px) {
  .promo-item-content {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .promo-list-header {
    display: none;
  }

  .promo-name,
  .promo-points,
  .promo-dates,
  .promo-status,
  .promo-actions {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .promo-actions {
    justify-content: flex-start;
    gap: 1rem;
  }
}

@media (max-width: 640px) {
  .promo-management-page {
    padding: 1rem;
  }

  .promo-card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .promo-button {
    width: 100%;
  }

  .promo-item-content {
    padding: 1rem 0.5rem;
  }

  .promo-name,
  .promo-points,
  .promo-dates,
  .promo-status {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
}
</style>
