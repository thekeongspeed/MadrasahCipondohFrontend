<template>
  <div class="profile-container" v-if="user">
    <div class="profile-card" :class="{'is-student': user.role === 'user', 'is-admin': user.role === 'admin'}">

      <div class="profile-background"></div>
      
      <div class="avatar-section">
        <div class="avatar-wrapper">
          <img 
            :src="serverUrl + user.profilePicture" 
            alt="Foto Profil" 
            class="profile-avatar"
            @error="handleImageError"
          >
          <div class="online-indicator" v-if="user.isOnline"></div>
        </div>
        <h2 class="user-name">{{ user.fullName }}</h2>
        <p class="user-handle">@{{ user.username }}</p>
        
        <div class="role-badge">
          {{ formatRole(user.role) }}
        </div>
      </div>
      
      <div class="details-section">
        <h3 class="section-title">
          <span class="title-icon">📋</span>
          <span>Detail Informasi</span>
        </h3>
        
        <div class="details-grid">
          <div class="detail-card" v-for="(detail, index) in filteredDetails" :key="index" 
               :class="{'full-width-card': detail.key === 'address'}">
            <div class="detail-icon">{{ detail.icon }}</div>
            <div class="detail-content">
              <h4 class="detail-label">{{ detail.label }}</h4>
              <p class="detail-value" :class="{'empty-value': !detail.value}">
                {{ detail.value || '-' }}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="stats-section" v-if="user.role === 'student'">
        <div class="stat-item">
          <div class="stat-value">{{ user.courseProgress || 0 }}%</div>
          <div class="stat-label">Progress Belajar</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ user.completedCourses || 0 }}</div>
          <div class="stat-label">Kelas Selesai</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ user.activeCourses || 0 }}</div>
          <div class="stat-label">Kelas Aktif</div>
        </div>
      </div>
  

  <div class="footer-actions">
        <button @click="goBack" class="back-to-page-button">
          <i class="fas fa-arrow-left"></i>
          <span>Kembali ke Kelas</span>
        </button>
      </div>
          </div>
  </div>
  
  
  <div v-else-if="loading" class="loading-container">
    <div class="loading-spinner"></div>
    <p>Memuat profil...</p>
  </div>
  
  <div v-else-if="error" class="error-container">
    <div class="error-icon">⚠️</div>
    <p>{{ error }}</p>
    <button @click="retryLoading" class="retry-button">Coba Lagi</button>
  </div>

</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios'; 

const route = useRoute();
const router = useRouter();
const user = ref(null);
const loading = ref(true);
const serverUrl = import.meta.env.VITE_API_BASE_URL; 
const token = localStorage.getItem('token');
const error = ref('');

const userDetails = computed(() => [
  { key: 'role', label: 'Peran', value: formatRole(user.value?.role), icon: '👤' },
  { key: 'createdAt', label: 'Bergabung Sejak', value: user.value?.createdAt ? new Date(user.value.createdAt).toLocaleDateString('id-ID') : null, icon: '📅' },
  { key: 'email', label: 'Email', value: user.value?.email, icon: '✉️' },
  { key: 'phone', label: 'Telepon', value: user.value?.phone, icon: '📱' },
  { key: 'dateOfBirth', label: 'Tanggal Lahir', value: user.value?.dateOfBirth ? new Date(user.value.dateOfBirth).toLocaleDateString('id-ID') : null, icon: '🎂' },
  { key: 'parentName', label: 'Orang Tua/Wali', value: user.value?.parentName, icon: '👪' },
  { key: 'address', label: 'Alamat', value: user.value?.address, icon: '🏠' }
]);

const filteredDetails = computed(() => {
  return userDetails.value.filter(detail => detail.value !== undefined);
});

function formatRole(role) {
  const roles = {
    'admin': 'Administrator',
    'user': 'Santri'
  };
  return roles[role] || role;
}

async function fetchUserProfile() {
  try {
    loading.value = true;
    error.value = '';
    const userId = route.params.id;
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/profil/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    user.value = response.data.data;
  } catch (err) {
    error.value = err.response?.data?.message || 'Gagal memuat profil.';
  } finally {
    loading.value = false;
  }
}

function retryLoading() {
  fetchUserProfile();
}

const handleImageError = (event) => {
  event.target.src = '/default-profile.png';
}

function goBack() {
  router.back();
}


onMounted(() => {
  fetchUserProfile();
});
</script>

<style scoped>
/* Base Styles */
.profile-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.profile-card {
  position: relative;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  padding-top: 70px;
}

.profile-card.is-teacher .profile-background,
.profile-card.is-teacher .role-badge,
.profile-card.is-teacher .retry-button,
.profile-card.is-teacher .section-title::after,
.profile-card.is-teacher .detail-icon,
.profile-card.is-teacher .stat-value {
  background: linear-gradient(135deg, #3a86ff, #4361ee);
  color: white;
}

.profile-card.is-student .profile-background,
.profile-card.is-student .role-badge,
.profile-card.is-student .retry-button,
.profile-card.is-student .section-title::after,
.profile-card.is-student .detail-icon,
.profile-card.is-student .stat-value {
  background: linear-gradient(135deg, #4cc9f0, #4895ef);
  color: white;
}

.profile-card.is-admin .profile-background,
.profile-card.is-admin .role-badge,
.profile-card.is-admin .retry-button,
.profile-card.is-admin .section-title::after,
.profile-card.is-admin .detail-icon,
.profile-card.is-admin .stat-value {
  background: linear-gradient(135deg, #f3bb14, #a56607);
  color: white;
}

.profile-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 150px;
  z-index: 1;
}

/* Avatar Section */
.avatar-section {
  position: relative;
  text-align: center;
  padding: 2rem 1rem 1rem;
  z-index: 2;
}

.avatar-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 1rem;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid #fff;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.profile-avatar:hover {
  transform: scale(1.05);
}

.online-indicator {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: #4caf50;
  border: 2px solid #fff;
}

.user-name {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: #333;
}

.user-handle {
  font-size: 1rem;
  color: #666;
  margin-bottom: 1rem;
}

.role-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-top: 0.5rem;
}

/* Details Section */
.details-section {
  padding: 1rem 2rem 2rem;
}

.section-title {
  display: flex;
  align-items: center;
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
  color: #333;
  position: relative;
  padding-bottom: 0.5rem;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 3px;
  border-radius: 3px;
}

.title-icon {
  margin-right: 0.5rem;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.detail-card {
  display: flex;
  align-items: flex-start;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.detail-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.detail-card.full-width-card {
  grid-column: 1 / -1;
}

.detail-icon {
  font-size: 1.5rem;
  margin-right: 1rem;
}

.detail-content {
  flex: 1;
}

.detail-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #666;
  margin-bottom: 0.25rem;
}

.detail-value {
  font-size: 1rem;
  font-weight: 500;
  color: #333;
}

.detail-value.empty-value {
  color: #999;
  font-style: italic;
}

/* Stats Section */
.stats-section {
  display: flex;
  justify-content: space-around;
  padding: 1.5rem;
  margin: 1rem 2rem;
  background-color: #f5f7ff;
  border-radius: 12px;
}

.stat-item {
  text-align: center;
  padding: 0 1rem;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.85rem;
  color: #666;
}

/* Loading State */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #4361ee;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error State */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  text-align: center;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #f44336;
}

.retry-button {
  margin-top: 1rem;
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-button:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}


.footer-actions {
  margin: 2.5rem 0;
  display: flex;
  justify-content: center;
  width: 100%;
}

.back-to-page-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.85rem 2rem;
  background: white;
  color: #4a4a4a; /* Warna hitam soft */
  border: 1px solid #e0e0e0;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.back-to-page-button i {
  margin-right: 0.8rem;
  color: #6b6b6b; /* Warna icon abu-abu medium */
  transition: all 0.3s ease;
}

.back-to-page-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #d0d0d0;
  color: #333333; /* Warna sedikit lebih gelap saat hover */
}

.back-to-page-button:hover i {
  color: #4a4a4a; /* Warna icon lebih gelap saat hover */
  transform: translateX(-3px);
}

.back-to-page-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* Efek garis bawah animasi */
.back-to-page-button::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: #4a4a4a;
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.back-to-page-button:hover::after {
  width: 70%;
}

/* Animasi untuk loading/klik */
@keyframes gentlePulse {
  0% { transform: scale(1); }
  50% { transform: scale(0.98); }
  100% { transform: scale(1); }
}

.back-to-page-button:focus {
  animation: gentlePulse 0.4s ease;
  outline: none;
}


/* Responsive Design */
@media (max-width: 768px) {
  .profile-container {
    padding: 0.5rem;
  }
  
  .details-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-section {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .user-name {
    font-size: 1.5rem;
  }
  
  .profile-avatar {
    width: 100px;
    height: 100px;
  }

 .back-to-page-button {
    padding: 0.7rem 1.5rem;
    font-size: 0.9rem;
  }
  
  .back-to-page-button i {
    margin-right: 0.6rem;
    font-size: 0.9rem;
  }

}
</style>