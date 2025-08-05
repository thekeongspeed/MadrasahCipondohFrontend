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
  { path: '/login', name: 'Login', component: Login }, 
  { path: '/register', name: 'Register', component: Register },
  { path: '/', name: 'Beranda', component: TaskList },
  { path: '/profil', name: 'Profil', component: ProfilePage, meta: { requiresAuth: true } },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  { path: '/kepengurusan', name: 'Kepengurusan', component: Kepengurusan },
  { path: '/instrumen-pembelajaran', name: 'instrumen-pembelajaran', component: InstrumenPembelajaran, meta: { requiresAuth: true } },
  {
    path: '/kelas/:namaKelas',
    name: 'KelasDetail',
    component: KelasDetailPage,
    meta: { requiresAuth: true }
  },
  { path: '/kelola-template', name: 'KelolaTemplate', component: KelolaTemplate },
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
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  const userKelas = localStorage.getItem('userKelas');

  if (to.meta.requiresAuth && !token) {
    return next({ name: 'Login' });
  }

 
  if (to.meta.requiresAdmin && userRole !== 'admin') {
     return next({ name: 'Beranda' });
  }


  if (to.name === 'KelasDetail' && userRole !== 'admin') {
    if (to.params.namaKelas === userKelas) {
    
      return next();
    } else {
         if (userKelas) {
        return next({ name: 'KelasDetail', params: { namaKelas: userKelas } });
      } else {
        return next({ name: 'Beranda' });
      }
    }
  }

  next();
});

export default router;