<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="modal-overlay"
        @click.self="handleOverlayClick"
      >
        <div
          :class="modalClasses"
          :style="modalStyle"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          ref="modalRef"
        >
          <div v-if="showHeader" class="modal-header">
            <slot name="header">
              <h2 v-if="title" :id="titleId" class="modal-title">
                {{ title }}
              </h2>
              <Button
                v-if="showCloseButton"
                class="modal-close-button"
                @click="close"
                aria-label="Закрыть"
                variant="outline"
              >
                  <CloseIcon
                    :size="24"
                    class="my-icon"
                  />
              </Button>
            </slot>
          </div>

          <div class="modal-content">
            <slot></slot>
          </div>

          <div v-if="showFooter" class="modal-footer">
            <slot name="footer">
              <Button @click="close">
                Закрыть
              </Button>
            </slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import Button from './Button.vue'
import CloseIcon from '@/components/ui/icon/СloseIcon.vue'

// Пропсы
interface Props {
  isOpen: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showCloseButton?: boolean
  showHeader?: boolean
  showFooter?: boolean
  closeOnOverlayClick?: boolean
  closeOnEsc?: boolean
  maxWidth?: string
  maxHeight?: string
}

interface Emits {
  (e: 'close'): void
  (e: 'open'): void
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
  size: 'md',
  showCloseButton: true,
  showHeader: true,
  showFooter: false,
  closeOnOverlayClick: true,
  closeOnEsc: true,
  maxWidth: undefined,
  maxHeight: undefined
})

const emit = defineEmits<Emits>()

const modalRef = ref<HTMLElement | null>(null)

const titleId = computed(() => `modal-title-${Math.random().toString(36).substr(2, 9)}`)

const modalClasses = computed(() => [
  'modal',
  `modal--${props.size}`
])

const modalStyle = computed(() => ({
  maxWidth: props.maxWidth,
  maxHeight: props.maxHeight
}))

const close = () => {
  emit('close')
}

const handleOverlayClick = () => {
  if (props.closeOnOverlayClick) {
    close()
  }
}

const handleEscKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.closeOnEsc && props.isOpen) {
    close()
  }
}

const trapFocus = (event: KeyboardEvent) => {
  if (!modalRef.value || event.key !== 'Tab') return

  const focusableElements = modalRef.value.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )

  const firstElement = focusableElements[0] as HTMLElement
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

  if (event.shiftKey) {
    if (document.activeElement === firstElement) {
      lastElement.focus()
      event.preventDefault()
    }
  } else {
    if (document.activeElement === lastElement) {
      firstElement.focus()
      event.preventDefault()
    }
  }
}

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    emit('open')
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onMounted(() => {
  document.addEventListener('keydown', handleEscKey)
  document.addEventListener('keydown', trapFocus)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscKey)
  document.removeEventListener('keydown', trapFocus)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal,
.modal-leave-active .modal {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal,
.modal-leave-to .modal {
  transform: translateY(-20px);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  overflow-y: auto;
}

.modal {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 100%;
  max-height: calc(100vh - 40px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal--sm {
  max-width: 400px;
}

.modal--md {
  max-width: 516px;
}

.modal--lg {
  max-width: 600px;
}

.modal--xl {
  max-width: 800px;
}

.modal--full {
  max-width: 95vw;
  width: 95vw;
  height: 95vh;
}

.modal-header {
  padding: 24px 24px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.modal-close-button {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #6b7280;
  cursor: pointer;
  border: none;
  background: none;
  transition: all 0.2s;
  position: relative;
  top: -6px;
  left: 13px;
  padding: 0;
}

.modal-close-button:hover {
  background-color: #f3f4f6;
  color: #374151;
}

.modal-content {
  padding: 0 24px 24px;
  flex: 1;
  overflow-y: auto;
  max-height: calc(100vh - 200px);
  overflow: hidden;
}

.modal-footer {
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  flex-shrink: 0;
}

@media (max-width: 640px) {
  .modal-overlay {
    padding: 10px;
  }

  .modal {
    border-radius: 8px;
    max-height: calc(100vh - 20px);
  }

  .modal-header,
  .modal-content,
  .modal-footer {
    padding: 16px;
  }

  .modal--sm,
  .modal--md,
  .modal--lg,
  .modal--xl {
    max-width: 100%;
  }
}
</style>
