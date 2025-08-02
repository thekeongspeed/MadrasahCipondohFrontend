<template>
  <div id="app-wrapper">
    <Navbar v-if="showNavbar" class="main-navbar" />
    
    <div class="page-transition">
      <main class="main-content">
        <router-view v-slot="{ Component }">
         <component :is="Component" v-if="Component">
        <template #default="{ Component: InnerComponent }">
          <transition name="fade" mode="out-in">
            <component :is="InnerComponent" v-if="InnerComponent" />
          </transition>
        </template>
      </component>
    </router-view>
      </main>
    </div>
    
    <Notification 
      :message="notification.message" 
      :type="notification.type"
      v-if="notification.show" 
    />
  </div>
</template>

<script setup>
import { computed, ref, provide } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from './components/Navbar.vue';
import Notification from './components/Notification.vue';

const route = useRoute();

const showNavbar = computed(() => {
  return route.path !== '/login' && route.path !== '/register';
});

const notification = ref({
  show: false,
  message: '',
  type: 'info' 
});

let notificationTimer;

function showNotification(message, type = 'info', duration = 3000) {
  clearTimeout(notificationTimer);
  notification.value = { show: true, message, type };
  notificationTimer = setTimeout(() => {
    notification.value.show = false;
  }, duration);
}

provide('showNotification', showNotification);
</script>

<style>
/* Base Styles */
body {
  margin: 0;
  font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f6f6f6;
  color: #333;
  line-height: 1.6;
}

#app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
}

.main-navbar {
  z-index: 1000;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
}

.page-transition {
  flex: 1;
  position: relative;
}

.main-content {
  padding: 0;
  flex-grow: 1;
  transition: all 0.3s ease;
}

/* Transition Effects */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Notification Styling */
.notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  z-index: 2000;
  animation: slideIn 0.3s ease-out;
}

.notification.info {
  background-color: #014283;
  color: white;
}

.notification.success {
  background-color: #4caf50;
  color: white;
}

.notification.error {
  background-color: #f44336;
  color: white;
}

.notification.warning {
  background-color: #ff9800;
  color: white;
}

@keyframes slideIn {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Floating Elements (to match home page) */
.floating-bg-elements {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.floating-bg-element {
  position: absolute;
  background: linear-gradient(135deg, #014283, #0277bd);
  border-radius: 50%;
  filter: blur(2px);
  animation: float linear infinite;
  z-index: -1;
}

/* Scrollbar Styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f6f6f6;
}

::-webkit-scrollbar-thumb {
  background: #014283;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #0277bd;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .main-content {
    padding: 0;
  }
  
  .notification {
    width: calc(100% - 40px);
    left: 20px;
    right: auto;
  }
}
</style>