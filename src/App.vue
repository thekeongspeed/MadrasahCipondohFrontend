<template>
  <div id="app-wrapper"> 
    <Navbar v-if="showNavbar" />

    <main class="main-content">
      <router-view></router-view>
    </main>
    
     <Notification 
      :message="notification.message" 
      :type="notification.type"
      v-if="notification.show" 
    />

    <Footer v-if="showNavbar" />
  </div>
</template>

<script setup>
import { computed, ref, provide } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import Notification from './components/Notification.vue';

const route = useRoute();

const showNavbar = computed(() => {
  // Kondisi ini juga akan kita gunakan untuk footer
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
/* Style global tidak perlu diubah */
body {
  margin: 0;
  font-family: sans-serif;
  background-color: #f6f6f6;
}
.main-content {
  padding: 1.5rem;
  flex-grow: 1;
  padding: 2rem;
  margin: 1.5rem; /* Beri jarak antara konten dan tepi layar */
  background-color: #ffffff; /* Warna putih atau soft lainnya */
  border-radius: 12px;     /* Sudut membulat */
  box-shadow: 0 4px 12px rgba(0,0,0,0.05); /* Bayangan tipis (opsional) */
}
#app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh; 
}
/* Atasi padding berlebih saat navbar tidak ada */

#app:not(:has(.navbar-container)) .main-content {
  /* Hapus padding jika navbar tidak ada agar halaman login bisa full-screen */
  padding: 0;
}

@media (max-width: 768px) {
  .main-content {
    margin: 0; /* Hapus margin di mobile */
    padding: 1rem;  /* Perkecil padding */
    border-radius: 0; /* Opsional: buat ujungnya tidak rounded di mobile */
  }
}

</style>