<template>
  <div class="profile-container">
    <div class="profile-header">
      <h1 class="profile-title">
        <span class="title-icon">👤</span>
        <span>Profil Saya</span>
      </h1>
      <div class="profile-status">
        <span class="status-badge" :class="profileStatusClass">
          {{ profileStatusText }}
        </span>
      </div>
    </div>

    <transition name="fade" mode="out-in">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Memuat data profil...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <div class="error-icon">⚠️</div>
        <p>{{ error }}</p>
        <button @click="fetchProfile" class="retry-button">
          Coba Lagi
        </button>
      </div>

      <div v-else class="profile-content">
        <transition name="slide" mode="out-in">
          <div v-if="!isEditing" class="profile-view">
            <div class="profile-card">
              <div class="avatar-section">
                <div class="avatar-wrapper">
                  <img 
                    :src="fullProfilePictureUrl" 
                    alt="Foto Profil" 
                    class="profile-avatar"
                    @error="handleImageError"
                  >
                  <div class="avatar-overlay" @click="toggleEditMode">
                    <span class="edit-icon">✏️</span>
                  </div>
                </div>
                <h2 class="user-name">{{ profileData.fullName || 'Nama Belum Diatur' }}</h2>
                <p class="user-handle">@{{ profileData.username }}</p>
                
                <div class="completion-meter">
                  <div class="meter-label">
                    <span>Kelengkapan Profil</span>
                    <span>{{ profileCompletion }}%</span>
                  </div>
                  <div class="meter-bar">
                    <div 
                      class="meter-progress" 
                      :style="{ width: profileCompletion + '%' }"
                      :class="completionClass"
                    ></div>
                  </div>
                </div>
              </div>

              <div class="details-section">
                <div class="details-grid">
                  <div 
                    v-for="(field, index) in profileFields" 
                    :key="index"
                    class="detail-card"
                    :class="{ 'empty-field': !profileData[field.key], 'full-width-card': field.fullWidth }"
                  >
                    <div class="detail-icon">
                      {{ field.icon }}
                    </div>
                    <div class="detail-content">
                      <h3 class="detail-label">{{ field.label }}</h3>
                      <p class="detail-value">
                         {{ field.key === 'dateOfBirth' ? formatSimpleDate(profileData[field.key]) : (profileData[field.key] || field.placeholder) }}
                      </p>
                    </div>
                  </div>
                </div>

                <button 
                  @click="toggleEditMode" 
                  class="edit-profile-button"
                >
                  <span class="button-icon">✏️</span>
                  <span>Edit Profil</span>
                </button>

                <button @click="handleLogout" class="logout-button">
                  <span class="button-icon">🚪</span>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>

          <div v-else class="profile-edit">
            <div class="edit-header">
              <h2>Edit Profil</h2>
              <button 
                @click="toggleEditMode" 
                class="close-edit-button"
              >
                &times;
              </button>
            </div>

            <div class="avatar-edit-section">
              <div class="avatar-edit-wrapper">
                <img 
                  :src="imagePreview || fullProfilePictureUrl"
                  alt="Preview Foto Profil" 
                  class="avatar-preview"
                >
                <div class="avatar-actions">
                  <label for="file-upload" class="upload-label">
                    <span class="upload-icon">📤</span>
                    <span>Pilih Foto</span>
                  </label>
                  <input 
                    id="file-upload" 
                    type="file" 
                    @change="handleFileChange" 
                    accept="image/*" 
                  />
                  <button 
                    @click="uploadProfilePicture" 
                    :disabled="!selectedFile" 
                    class="confirm-upload-button"
                    :class="{ 'disabled': !selectedFile }"
                  >
                    Upload
                  </button>
                </div>
              </div>
            </div>

            <form @submit.prevent="saveProfile" class="edit-form">
              <div class="form-grid">
                <div 
                  v-for="(field, index) in editableFields" 
                  :key="index"
                  class="form-group"
                  :class="{ 'full-width': field.fullWidth }"
                >
                  <label :for="field.id">
                    <span class="field-icon">{{ field.icon }}</span>
                    {{ field.label }}
                  </label>
                 <input
                      v-model="editableProfile[field.key]"
                      :type="field.type"
                      :placeholder="field.placeholder">
                </div>
              </div>

              <div class="form-actions">
                <button 
                  type="button" 
                  @click="cancelEdit" 
                  class="cancel-button"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  class="save-button"
                  :disabled="isSaving"
                >
                  <span v-if="isSaving" class="save-spinner"></span>
                  <span v-else>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </transition>
      </div>
    </transition>

    <transition name="fade">
      <div 
        v-if="showNotification" 
        class="notification"
        :class="notificationClass"
      >
        {{ notificationMessage }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, reactive } from 'vue';
import axios from 'axios';

const serverUrl = import.meta.env.VITE_API_BASE_URL;

// Data states
const profileData = ref({
  username: '',
  fullName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  parentName: '',
  address: '',
  profilePicture: '/default-profile.png',
  lastUpdated: null
});
const editableProfile = ref({});
const loading = ref(true);
const error = ref('');
const isEditing = ref(false);
const isSaving = ref(false);
const selectedFile = ref(null);
const imagePreview = ref(null);
const showNotification = ref(false);
const notificationMessage = ref('');
const notificationType = ref('');

// Profile field configurations
const profileFields = [
  { key: 'email', label: 'Email', icon: '✉️', placeholder: 'Belum diatur' },
  { key: 'phone', label: 'Telepon', icon: '📱', placeholder: 'Belum diatur' },
  { key: 'dateOfBirth', label: 'Tanggal Lahir', icon: '🎂', placeholder: 'Belum diatur' },
  { key: 'parentName', label: 'Orang Tua/Wali', icon: '👪', placeholder: 'Belum diatur' },
  { key: 'address', label: 'Alamat Lengkap', icon: '🏠', placeholder: 'Belum diatur', fullWidth: true }
];

const editableFields = [
  { key: 'fullName', id: 'fullName', label: 'Nama Lengkap', icon: '👤', type: 'text', component: 'input', placeholder: 'Masukkan nama lengkap' },
  { key: 'email', id: 'email', label: 'Email', icon: '✉️', type: 'email', component: 'input', placeholder: 'Masukkan email' },
  { key: 'phone', id: 'phone', label: 'Telepon', icon: '📱', type: 'tel', component: 'input', placeholder: 'Masukkan nomor telepon' },
  { key: 'dateOfBirth', id: 'dateOfBirth', label: 'Tanggal Lahir', icon: '🎂', type: 'date', component: 'input' },
  { key: 'parentName', id: 'parentName', label: 'Orang Tua/Wali', icon: '👪', type: 'text', component: 'input', placeholder: 'Nama orang tua/wali' },
  { key: 'address', id: 'address', label: 'Alamat Lengkap', icon: '🏠', component: 'textarea', placeholder: 'Alamat lengkap', fullWidth: true }
];



const profileCompletion = computed(() => {
  const fields = ['fullName', 'email', 'phone', 'dateOfBirth', 'parentName', 'address', 'profilePicture'];
  const completedFields = fields.filter(field => {
    if (field === 'profilePicture') {
      return profileData.value[field] && !profileData.value[field].includes('default-profile');
    }
    return !!profileData.value[field];
  });
  return Math.round((completedFields.length / fields.length) * 100);
});

const completionClass = computed(() => {
  if (profileCompletion.value < 30) return 'low';
  if (profileCompletion.value < 70) return 'medium';
  return 'high';
});

const profileStatusText = computed(() => {
  if (profileCompletion.value === 100) return 'Lengkap';
  if (profileCompletion.value > 50) return 'Cukup Lengkap';
  return 'Perlu Dilengkapi';
});

const profileStatusClass = computed(() => {
  if (profileCompletion.value === 100) return 'complete';
  if (profileCompletion.value > 50) return 'partial';
  return 'incomplete';
});

const notificationClass = computed(() => {
  return notificationType.value || 'info';
});

// Methods
function handleImageError(e) {
  e.target.src = serverUrl + '/default-profile.png';
}

function handleFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    if (file.size > 2 * 1024 * 1024) {
      showNotificationMessage('Ukuran file maksimal 2MB', 'error');
      return;
    }
    selectedFile.value = file;
    imagePreview.value = URL.createObjectURL(file);
  }
}

async function uploadProfilePicture() {
  if (!selectedFile.value) return;
  
  const formData = new FormData();
  formData.append('profileImage', selectedFile.value);
  const token = localStorage.getItem('token');
  
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/profile/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    });
    
    profileData.value = response.data.user;
    showNotificationMessage('Foto profil berhasil diupdate!', 'success');
    selectedFile.value = null;
    imagePreview.value = null;
  } catch (err) {
    console.error('Upload error:', err);
    showNotificationMessage('Gagal mengupload foto profil', 'error');
  }
}

async function fetchProfile() {
  loading.value = true;
  error.value = '';
  const token = localStorage.getItem('token');
  
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    // Simpan data mentah dari API
    profileData.value = response.data;
   


  } catch (err) {
    console.error('Fetch error:', err);
    error.value = 'Gagal memuat profil. Silakan coba lagi.';
  } finally {
    loading.value = false;
  }
}


function toggleEditMode() {
  if (!isEditing.value) {
    // Gunakan spread operator + JSON parse/stringify untuk bypass Proxy
    editableProfile.value = {
      ...JSON.parse(JSON.stringify(profileData.value)),
      dateOfBirth: formatDateForInput(profileData.value.dateOfBirth)
    };
  }
  isEditing.value = !isEditing.value;
}

const formatDateForInput = (date) => {
  if (!date) return '';
  // Jika sudah format YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  // Jika format ISO
  if (date.includes('T')) return date.split('T')[0];
  // Konversi dari format lain
  return new Date(date).toISOString().split('T')[0];
};


function cancelEdit() {
  toggleEditMode();
  selectedFile.value = null;
  imagePreview.value = null;
}


async function saveProfile() {
  isSaving.value = true; // Mulai loading
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/profile`, editableProfile.value, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    profileData.value = response.data;
    showNotificationMessage('Profil berhasil diperbarui!', 'success'); // Tampilkan notifikasi sukses
    isEditing.value = false;
  } catch (err) {
    showNotificationMessage('Gagal menyimpan profil.', 'error'); // Tampilkan notifikasi error
  } finally {
    isSaving.value = false; // Hentikan loading
  }
}

function showNotificationMessage(message, type = 'info') {
  notificationMessage.value = message;
  notificationType.value = type;
  showNotification.value = true;
  
  setTimeout(() => {
    showNotification.value = false;
  }, 3000);
}



function formatSimpleDate(tanggal) {
  if (!tanggal) return null;
  return new Date(tanggal).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
}


function handleLogout() {
  if (confirm('Anda yakin ingin keluar?')) {
   
    localStorage.clear();
    window.location.href = '/login';
  }
}


const fullProfilePictureUrl = computed(() => {
   if (profileData.value && profileData.value.profilePicture) {
        const baseUrl = serverUrl.endsWith('/') ? serverUrl.slice(0, -1) : serverUrl;
    return `${baseUrl}${profileData.value.profilePicture}`;
  }

  return ''; 
});


// Lifecycle hooks
onMounted(() => {
  fetchProfile();
});

// Watch for profile data changes to update the editable profile
watch(profileData, (newVal) => {
  if (isEditing.value) {
    editableProfile.value = JSON.parse(JSON.stringify(newVal));
  }
}, { deep: true });
</script>

<style scoped>
/* Base Styles */
.profile-container {
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  position: relative;
  overflow: hidden;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eaeaea;
  padding-top: 70px;
}

.profile-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.75rem;
  color: #2c3e50;
  margin: 0;
}

.title-icon {
  font-size: 1.5rem;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.complete {
  background-color: #e3f7e8;
  color: #27ae60;
}

.status-badge.partial {
  background-color: #fff8e1;
  color: #f39c12;
}

.status-badge.incomplete {
  background-color: #feecec;
  color: #e74c3c;
}

/* Loading and Error States */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  color: #7f8c8d;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  text-align: center;
  color: #e74c3c;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.retry-button {
  margin-top: 1.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.retry-button:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
}

/* Profile View Styles */
.profile-content {
  transition: all 0.3s ease;
}

.profile-card {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

@media (min-width: 768px) {
  .profile-card {
    flex-direction: row;
  }
}

.avatar-section {
  flex: 1;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.avatar-wrapper {
  position: relative;
  width: 180px;
  height: 180px;
  margin-bottom: 1.5rem;
  cursor: pointer;
}

.profile-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 5px solid white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
}

.avatar-wrapper:hover .avatar-overlay {
  opacity: 1;
}

.edit-icon {
  font-size: 1.5rem;
  color: white;
}

.user-name {
  font-size: 1.5rem;
  color: #2c3e50;
  margin: 0 0 0.25rem 0;
  text-align: center;
}

.user-handle {
  color: #7f8c8d;
  margin: 0 0 1.5rem 0;
  font-size: 0.95rem;
}

.completion-meter {
  width: 100%;
  margin-top: auto;
}

.meter-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #7f8c8d;
}

.meter-bar {
  height: 8px;
  background-color: #ecf0f1;
  border-radius: 4px;
  overflow: hidden;
}

.meter-progress {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.meter-progress.low {
  background-color: #e74c3c;
}

.meter-progress.medium {
  background-color: #f39c12;
}

.meter-progress.high {
  background-color: #27ae60;
}

.details-section {
  flex: 2;
  padding: 1rem;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2rem;
}

.detail-card {
  background-color: white;
  border-radius: 10px;
  padding: 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  grid-column: 1 / -1;
}

.detail-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.detail-card.empty-field {
  background-color: #f8f9fa;
}

.detail-icon {
  font-size: 1.25rem;
  color: #3498db;
  margin-top: 0.15rem;
}

.detail-content {
  flex: 1;
}

.detail-label {
  font-size: 0.85rem;
  color: #7f8c8d;
  margin: 0 0 0.25rem 0;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  font-size: 1.1rem;
  color: #2c3e50;
  margin: 0;
  word-break: break-word;
}

.edit-profile-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 1rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 10px;
}

.edit-profile-button:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(41, 128, 185, 0.3);
}


.logout-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 1rem;
  background-color: #db3434;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-button:hover {
  background-color: #b92929;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(41, 128, 185, 0.3);
}


.button-icon {
  font-size: 1.1rem;
}

/* Edit Profile Styles */
.profile-edit {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.edit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eaeaea;
}

.edit-header h2 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin: 0;
}

.close-edit-button {
  background: none;
  border: none;
  font-size: 1.75rem;
  color: #7f8c8d;
  cursor: pointer;
  transition: all 0.2s ease;
  line-height: 1;
  padding: 0 0.5rem;
}

.close-edit-button:hover {
  color: #e74c3c;
  transform: scale(1.1);
}

.avatar-edit-section {
  display: flex;
  justify-content: center;
  margin-bottom: 2.5rem;
}

.avatar-edit-wrapper {
  text-align: center;
}

.avatar-preview {
  width: 180px;
  height: 180px;
  object-fit: cover;
  border-radius: 50%;
  border: 5px solid white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

.avatar-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.upload-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background-color: #f1f1f1;
  color: #2c3e50;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.upload-label:hover {
  background-color: #e0e0e0;
}

.upload-icon {
  font-size: 1.1rem;
}

input[type="file"] {
  display: none;
}

.confirm-upload-button {
  padding: 0.75rem 1.5rem;
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.confirm-upload-button:hover:not(.disabled) {
  background-color: #219653;
  transform: translateY(-2px);
}

.confirm-upload-button.disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
  opacity: 0.7;
}

.edit-form {
  margin-top: 2rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.field-icon {
  font-size: 1.1rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.85rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background-color: #f9f9f9;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
  background-color: white;
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eaeaea;
}

.cancel-button {
  padding: 0.85rem 1.75rem;
  background-color: #e0e0e0;
  color: #2c3e50;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-button:hover {
  background-color: #d0d0d0;
  transform: translateY(-2px);
}

.save-button {
  padding: 0.85rem 1.75rem;
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 160px;
}

.save-button:hover:not(:disabled) {
  background-color: #219653;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(33, 150, 83, 0.3);
}

.save-button:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
  opacity: 0.7;
}

.save-spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Notification Styles */
.notification {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 1rem 1.5rem;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  animation: slideUp 0.3s ease;
}

.notification.success {
  background-color: #27ae60;
}

.notification.error {
  background-color: #e74c3c;
}

.notification.info {
  background-color: #3498db;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
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

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .profile-container {
    padding: 1.5rem;
    margin: 1rem;
  }
  
  .profile-card {
    flex-direction: column;
  }
  
  .avatar-section {
    max-width: 100%;
  }
  
  .details-grid {
    grid-template-columns: 1fr;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .save-button,
  .cancel-button {
    width: 100%;
  }
}
</style>