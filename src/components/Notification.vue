<template>
  <transition name="toast-slide">
    <div 
      v-if="visible" 
      class="notification-toast top-center" 
      :class="type"
      :style="{
        '--progress-duration': `${duration}ms`,
        '--toast-color': toastColor
      }"
    >
      <div class="toast-content">
        <span class="toast-icon">
          <component :is="iconComponent" v-if="iconComponent" />
          <span v-else>{{ icon }}</span>
        </span>
        <p class="toast-message">{{ message }}</p>
        <button v-if="closable" class="toast-close" @click="dismiss">
          &times;
        </button>
      </div>
      <div v-if="showProgress" class="toast-progress"></div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { CheckCircle, XCircle, Info } from 'lucide-vue-next';

const props = defineProps({
  message: String,
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  duration: {
    type: Number,
    default: 5000
  },
  closable: {
    type: Boolean,
    default: true
  },
  showProgress: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['dismissed']);

const visible = ref(false);
let timeoutId = null;

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  warning: Info,
  info: Info
};

const colorMap = {
  success: '#4ade80',
  error: '#f87171',
  warning: '#fbbf24',
  info: '#60a5fa'
};

const iconComponent = computed(() => iconMap[props.type]);
const toastColor = computed(() => colorMap[props.type]);

const icon = computed(() => {
  const icons = {
    success: '✓',
    error: '✗',
    warning: '⚠️',
    info: 'ℹ️'
  };
  return icons[props.type];
});

const showToast = () => {
  visible.value = true;
  if (props.duration > 0) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(dismiss, props.duration);
  }
};

const dismiss = () => {
  visible.value = false;
  emit('dismissed');
};

watch(() => props.message, (newMessage) => {
  if (newMessage) {
    showToast();
  }
}, { immediate: true });

onMounted(() => {
  if (props.message) {
    showToast();
  }
});
</script>

<style scoped>
.notification-toast {
  position: fixed;
  padding: 1rem;
  border-radius: 0.75rem;
  background-color: white;
  color: #1f2937;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  z-index: 9999;
  min-width: 300px;
  max-width: 90vw;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border-left: 4px solid var(--toast-color);
}

.top-center {
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.toast-icon {
  color: var(--toast-color);
  font-size: 1.25rem;
  display: flex;
}

.toast-icon svg {
  width: 1.25rem;
  height: 1.25rem;
}

.toast-message {
  margin: 0;
  flex-grow: 1;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.toast-close {
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  font-size: 1.25rem;
  line-height: 1;
  padding: 0.25rem;
  margin-left: 0.5rem;
  transition: color 0.2s;
}

.toast-close:hover {
  color: #6b7280;
}

.toast-progress {
  height: 3px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  overflow: hidden;
  position: relative;
}

.toast-progress::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: var(--toast-color);
  animation: progress var(--progress-duration) linear forwards;
}

@keyframes progress {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

.toast-slide-enter-active {
  animation: slide-in 0.3s ease-out;
}
.toast-slide-leave-active {
  animation: slide-out 0.3s ease-in;
}
@keyframes slide-in {
  from {
    transform: translateX(-50%) translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
}
@keyframes slide-out {
  from {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
  to {
    transform: translateX(-50%) translateY(-100%);
    opacity: 0;
  }
}
</style>