// client/src/router.js
import { createRouter, createWebHistory } from 'vue-router';

// Impor semua komponen halaman Anda
import Login from './components/Login.vue';
import Register from './components/Register.vue';
import TaskList from './components/TaskList.vue';
import ProfilePage from './components/ProfilePage.vue';
import AdminDashboard from './components/AdminDashboard.vue'; 
import Kepengurusan from './components/Kepengurusan.vue';
import InstrumenPembelajaran from './components/InstrumenPembelajaran.vue';
import KelasDetailPage from './components/KelasDetailPage.vue'; 
import KelolaTemplate from './components/KelolaTemplate.vue';
import UserProfilePage from './components/UserProfilePage.vue';




const routes = [
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/', name: 'Beranda', component: TaskList, meta: { requiresAuth: true } },
  { path: '/profil', name: 'Profil', component: ProfilePage, meta: { requiresAuth: true } },
  { 
    path: '/admin/dashboard', 
    name: 'AdminDashboard',
    component: AdminDashboard, 
    meta: { requiresAuth: true, requiresAdmin: true } 
  },
  { path: '/kepengurusan', name: 'Kepengurusan', component: Kepengurusan },
{ path: '/instrumen-pembelajaran', name: 'instrumen-pembelajaran', component: InstrumenPembelajaran },

 {path: '/kelas/:namaKelas', // :namaKelas adalah parameter yang bisa berubah
    name: 'KelasDetail',
    component: KelasDetailPage,
    meta: { requiresAuth: true }},
   
  { path: '/kelola-template', component: KelolaTemplate },
  
 {
    path: '/profil/:id',
    name: 'UserProfile',
    component: UserProfilePage,
    meta: { requiresAuth: true } 
  }


  
];



const router = createRouter({
  history: createWebHistory(),
  routes,
});


router.beforeEach((to, from, next) => {
  // Ambil data dari localStorage
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  // Cek 1: Apakah rute tujuan memerlukan login?
  if (to.meta.requiresAuth && !token) {
    // Jika butuh login tapi tidak ada token, arahkan ke halaman login
    return next('/login');
  }
  
  // Cek 2: Apakah rute tujuan memerlukan akses admin?
  if (to.meta.requiresAdmin && userRole !== 'admin') {
    // Jika butuh akses admin tapi role bukan admin, arahkan ke halaman utama
    return next('/');
  }

  // Jika semua pengecekan lolos, lanjutkan navigasi
  next();
});




router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  const userKelas = localStorage.getItem('userKelas');

  // Cek apakah halaman yang dituju memerlukan login
  if (to.meta.requiresAuth && !isLoggedIn) {
    // Jika butuh login tapi belum login, arahkan ke halaman login
    next({ name: 'Login' });
  } 
  // Cek apakah user mencoba mengakses halaman detail kelas
  else if (to.name === 'KelasDetail') {
    // Jika user adalah admin, izinkan akses ke kelas mana pun
    if (userRole === 'admin') {
      next();
    } 
    // Jika user biasa, periksa kelasnya
    else {
      if (to.params.namaKelas === userKelas) {
        // Jika kelas yang diakses sama dengan kelas milik user, izinkan
        next();
      } else {
        // Jika tidak sama, alihkan user ke halaman kelasnya sendiri
        // atau ke halaman utama jika kelasnya tidak ada
        if (userKelas) {
          next({ name: 'KelasDetail', params: { namaKelas: userKelas } });
        } else {
          next({ name: 'Home' });
        }
      }
    }
  } 
  // Untuk semua halaman lain yang tidak memiliki aturan khusus
  else {
    next();
  }
});



export default router;