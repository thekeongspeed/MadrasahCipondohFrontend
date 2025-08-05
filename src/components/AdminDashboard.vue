<template>
  <div class="admin-dashboard">
    <!-- Animated Header with Gradient -->
    <header class="dashboard-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="animated-title">Admin Dashboard</h1>
          <p class="subtitle">Manajemen Database Berdasarkan Kelompok Usia</p>
        </div>
        <div class="search-container">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Cari nama/username/email..." 
            @input="handleSearch"
            class="search-input"
          >
          <span class="search-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
        </div>
      </div>
    </header>

    <!-- Loading State with Animation -->
    <div v-if="loading" class="loading-state">
      <div class="loader">
        <div class="loader-square"></div>
        <div class="loader-square"></div>
        <div class="loader-square"></div>
        <div class="loader-square"></div>
        <div class="loader-square"></div>
        <div class="loader-square"></div>
        <div class="loader-square"></div>
      </div>
      <p>Memuat data pengguna...</p>
    </div>

    <!-- Error State with Illustration -->
    <div v-else-if="error" class="error-state">
      <div class="error-illustration">
        <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#e53e3e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <h3 class="error-title">Terjadi Kesalahan</h3>
      <p class="error-message">{{ error }}</p>
      <button @click="fetchUsers" class="retry-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"></path>
        </svg>
        Coba Lagi
      </button>
    </div>

    <!-- Main Content with Floating Cards -->
    <main v-else class="user-groups">
      <transition-group name="fade-slide" tag="div">
        <section 
          v-for="(userList, categoryName) in groupedUsers" 
          :key="categoryName"
          class="category-section"
          v-show="userList.length > 0">

          <div class="category-header" @click="toggleCategory(categoryName)">
              <h2>{{ categoryName }}</h2>

              <div class="category-meta">
              <span class="badge">{{ userList.length }} orang</span>
              <div class="category-actions">
              </div>
              <div class="collapse-icon" :class="{ 'collapsed': collapsedCategories[categoryName] }">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>
          </div>
          
          
          <div class="category-content" v-show="!collapsedCategories[categoryName]">
            <div class="table-container">
              <table class="desktop-table">
                <thead>
                  <tr>
                    <th>No.</th> 
                    <th>Nama Lengkap</th>
                    <th>Username</th>
                    <th>Usia</th>
                    <th>Email</th>
                    <th>No. Telepon</th>
                    <th>Orang Tua/Wali</th>
                    <th>Alamat Lengkap</th> 
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(user, index) in userList" :key="user.id" @click="showUserDetail(user)">
                    <td data-label="No." class="index-cell">{{ index + 1 }}</td>
                    <td data-label="Nama Lengkap" class="name-cell">
                      <div class="user-avatar">
                     <img 
                          v-if="user.profilePicture && user.profilePicture !== '/default-profile.png'" 
                          :src="getProfilePictureUrl(user.profilePicture)" 
                          :alt="user.fullName">
                        <span v-else class="avatar-initial">{{ getInitials(user.fullName) }}</span>
                      </div>
                      {{ user.fullName || '-' }}
                    </td>
                    <td data-label="Username">{{ user.username }}</td>
                    <td data-label="Usia" class="age-cell">
                      <span class="age-badge">{{ calculateAge(user.dateOfBirth) }} Tahun</span>
                    </td>
                    <td data-label="Email" class="email-cell">{{ user.email }}</td>
                    <td data-label="No. Telepon">{{ formatPhoneNumber(user.phone) || '-' }}</td>
                    <td data-label="Orang Tua/Wali">{{ user.parentName || '-' }}</td>
                    <td data-label="Alamat" class="address-cell">{{ user.address || '-' }}</td>
                  </tr>
                </tbody>
              </table>

              <div class="mobile-cards">
                <div v-for="(user, index) in userList" :key="user.id" class="user-card" @click="showUserDetail(user)">
                  <div class="card-header">
                    <div class="user-avatar">
                      <img 
                          v-if="user.profilePicture && user.profilePicture !== '/default-profile.png' && !imageErrorState[user.id]" 
                          :src="getProfilePictureUrl(user.profilePicture)" 
                          @error="handleImageError ($event, user.id)"
                          :alt="user.fullName">
                        <span v-else class="avatar-initial">{{ getInitials(user.fullName) }}</span>
                      </div>
                    <div class="card-user-info">
                      <h3 class="card-name">{{ user.fullName || '-' }}</h3>
                      <span class="card-username">@{{ user.username }}</span>
                    </div>
                    <span class="card-number">{{ index + 1 }}</span>
                  </div>
                  
                  <div class="card-details">
                    <div class="detail-row">
                      <span class="detail-label">Usia</span>
                      <span class="detail-value age-value">{{ calculateAge(user.dateOfBirth) }} Tahun</span>
                    </div>
                    
                    <div class="detail-row">
                      <span class="detail-label">Email</span>
                      <span class="detail-value email-value">{{ user.email }}</span>
                    </div>
                    
                    <div class="detail-row">
                      <span class="detail-label">No. Telepon</span>
                      <span class="detail-value">{{ formatPhoneNumber(user.phone) || '-' }}</span>
                    </div>
                    
                    <div class="detail-row">
                      <span class="detail-label">Orang Tua/Wali</span>
                      <span class="detail-value">{{ user.parentName || '-' }}</span>
                    </div>
                    
                    <div class="detail-row">
                      <span class="detail-label">Alamat</span>
                      <span class="detail-value address-value">{{ user.address || '-' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </transition-group>
      
      <!-- Empty State with Illustration -->
      <div v-if="isEmpty" class="empty-state">
        <div class="empty-illustration">
          <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#718096" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
        <h3 class="empty-title">Tidak ada data yang ditemukan</h3>
        <p class="empty-message">Coba gunakan kata kunci pencarian yang berbeda</p>
        <button @click="resetSearch" class="reset-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
            <path d="M21 3v5h-5"></path>
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
            <path d="M8 16H3v5"></path>
          </svg>
          Reset Pencarian
        </button>
      </div>
    </main>

    <!-- User Detail Modal -->
    <div v-if="selectedUser" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <button class="modal-close" @click="closeModal">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div class="modal-header">
          <div class="modal-avatar">
            <span class="avatar-initial-large">
              <img 
                v-if="selectedUser.profilePicture && selectedUser.profilePicture !== '/default-profile.png'" 
                :src="getProfilePictureUrl(selectedUser.profilePicture)" 
                :alt="selectedUser.fullName">
              <span v-else>
                {{ getInitials(selectedUser.fullName) }}
              </span>
            </span>
          </div>
          <div class="modal-user-info">
            <h2>{{ selectedUser.fullName || '-' }}</h2>
            <p>@{{ selectedUser.username }}</p>
          </div>
        </div>
        
        <div class="modal-body">
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Usia</span>
              <span class="info-value">{{ calculateAge(selectedUser.dateOfBirth) }} Tahun</span>
            </div>
            <div class="info-item">
              <span class="info-label">Email</span>
              <span class="info-value">{{ selectedUser.email }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">No. Telepon</span>
              <span class="info-value">{{ formatPhoneNumber(selectedUser.phone) || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Orang Tua/Wali</span>
              <span class="info-value">{{ selectedUser.parentName || '-' }}</span>
            </div>
            <div class="info-item full-width">
              <span class="info-label">Alamat</span>
              <span class="info-value">{{ selectedUser.address || '-' }}</span>
            </div>
            <div class="info-item full-width">
              <span class="info-label">Tanggal Lahir</span>
              <span class="info-value">{{ formatDate(selectedUser.dateOfBirth) || '-' }}</span>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button  class="action-button delete" @click.stop="deleteUser($event, selectedUser)">Hapus</button>
          <button class="modal-button primary" @click="openEditModal(selectedUser)">Edit Data</button>
          <button class="modal-button secondary" @click="closeModal">Tutup</button>
        </div>
      </div>
    </div>
  </div>


  <div v-if="isEditModalOpen" class="modal-overlay" @click.self="closeEditModal">
  <div class="modal-content">
    <button @click="closeEditModal" class="modal-close">×</button>
    <h3>Edit Data: {{ userToEdit.fullName }}</h3>

   <form v-if="userToEdit" @submit.prevent="saveUserEdit" class="edit-form">
  <div class="input-group">
    <label>Nama Lengkap</label>
    <input v-model="userToEdit.fullName" type="text" />
  </div>
  
  <div class="input-group">
    <label>Username</label>
    <input v-model="userToEdit.username" type="text" required />
  </div>

  <div class="input-group">
    <label>Email</label>
    <input v-model="userToEdit.email" type="email" required />
  </div>
  <div class="input-group">
    <label>Peran (Role)</label>
    <select v-model="userToEdit.role">
      <option value="user">User</option>
      <option value="admin">Admin</option>
    </select>
  </div>
  <div class="input-group">
    <label>Password Baru (Opsional)</label>
    <input v-model="newPassword" type="password" placeholder="Isi hanya jika ingin mengubah" />
  </div>
  <div class="form-actions">
    <button type="button" @click="closeEditModal" class="styled-button cancel">Batal</button>
    <button type="submit" class="styled-button save">Simpan Perubahan</button>
  </div>
</form>
  </div>
</div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';



const users = ref([]);
const loading = ref(true);
const error = ref('');
const searchQuery = ref('');
const filteredUsers = ref([]);
const selectedUser = ref(null);
const collapsedCategories = reactive({});
const isEditModalOpen = ref(false);
const userToEdit = ref(null);
const newPassword = ref('');



// Initialize all categories as expanded
const initializeCollapsedCategories = () => {
  const categories = [
    'Paud (3-6 Tahun)',
    'Caberawit (7-12 Tahun)',
    'Pra Remaja (13-15 Tahun)',
    'Remaja (16-18 Tahun)',
    'Pra Nikah (18+ Tahun)',
    'Lainnya (Usia Belum Diisi)'
  ];
  
  categories.forEach(category => {
    collapsedCategories[category] = true;
  });
};

function getInitials(name) {
  if (!name) return '?';
  const parts = name.split(' ');
  let initials = parts[0].charAt(0).toUpperCase();
  if (parts.length > 1) {
    initials += parts[parts.length - 1].charAt(0).toUpperCase();
  }
  return initials;
}

function formatDate(dateString) {
  if (!dateString) return null;
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
}

function calculateAge(dobString) {
  if (!dobString || isNaN(new Date(dobString))) {
    return '?';
  }
  const today = new Date();
  const birthDate = new Date(dobString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

const formatPhoneNumber = (phone) => {
  if (!phone) return null;
  return phone.replace(/(\d{2})(\d{3})(\d{4})(\d{4})/, '$1 $2-$3-$4');
};

const groupedUsers = computed(() => {
  const groups = {
    'Paud (3-6 Tahun)': [],
    'Caberawit (7-12 Tahun)': [],
    'Pra Remaja (13-15 Tahun)': [],
    'Remaja (16-18 Tahun)': [],
    'Pra Nikah (18+ Tahun)': [],
    'Lainnya (Usia Belum Diisi)': []
  };

  const sourceUsers = searchQuery.value ? filteredUsers.value : users.value;

  if (sourceUsers && sourceUsers.length > 0) {
    sourceUsers.forEach(user => {
      const age = calculateAge(user.dateOfBirth);
      
      if (age === '?') {
        groups['Lainnya (Usia Belum Diisi)'].push(user);
      } else if (age >= 3 && age <= 6) {
        groups['Paud (3-6 Tahun)'].push(user);
      } else if (age >= 7 && age <= 12) {
        groups['Caberawit (7-12 Tahun)'].push(user);
      } else if (age >= 13 && age <= 15) {
        groups['Pra Remaja (13-15 Tahun)'].push(user);
      } else if (age >= 16 && age <= 18) {
        groups['Remaja (16-18 Tahun)'].push(user);
      } else if (age > 18) {
        groups['Pra Nikah (18+ Tahun)'].push(user);
      } else {
        groups['Lainnya (Usia Belum Diisi)'].push(user);
      }
    });
  }

  return groups;
});

const isEmpty = computed(() => {
  return Object.values(groupedUsers.value).every(group => group.length === 0);
});

async function fetchUsers() {
  loading.value = true;
  error.value = '';
  const token = localStorage.getItem('token');
  if (!token) {
    error.value = 'Otorisasi gagal. Silakan login kembali.';
    loading.value = false;
    return;
  }
  
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    users.value = response.data;
    filteredUsers.value = response.data;
    initializeCollapsedCategories();
  } catch (err) {
    error.value = 'Gagal mengambil data pengguna. Pastikan Anda adalah admin.';
    console.error('Error fetching users:', err);
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  if (!searchQuery.value) {
    filteredUsers.value = users.value;
    return;
  }

  const query = searchQuery.value.toLowerCase();
  filteredUsers.value = users.value.filter(user => {
    return (
      (user.fullName?.toLowerCase().includes(query)) ||
      (user.username?.toLowerCase().includes(query)) ||
      (user.email?.toLowerCase().includes(query))
    );
  });
}

function resetSearch() {
  searchQuery.value = '';
  filteredUsers.value = users.value;
}

function toggleCategory(categoryName) {
  collapsedCategories[categoryName] = !collapsedCategories[categoryName];
}

function showUserDetail(user) {
  selectedUser.value = user;
}

function closeModal() {
  selectedUser.value = null;
}

// --- FUNGSI BARU UNTUK MODAL ---
function openEditModal(user) {
  // Salin data user ke state baru agar tidak mengubah data asli di tabel secara langsung
  userToEdit.value = { ...user }; 
  newPassword.value = ''; // Reset field password
  isEditModalOpen.value = true;
}

function closeEditModal() {
  isEditModalOpen.value = false;
  userToEdit.value = null;
}

async function saveUserEdit() {
  if (!userToEdit.value) return;

  const dataToUpdate = { ...userToEdit.value };
  // Hanya tambahkan password ke data update jika field-nya diisi
  if (newPassword.value) {
    dataToUpdate.password = newPassword.value;
  }

  try {
    const token = localStorage.getItem('token');
    await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/users/${userToEdit.value.id}`, dataToUpdate, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    alert('Data pengguna berhasil diperbarui!');
    closeEditModal();
    fetchUsers(); // Refresh data di tabel utama
  } catch (err) {
    alert('Gagal memperbarui data.');
    console.error('Update user error:', err);
  }
}



async function deleteUser(event, user) {
  event.stopPropagation(); // Mencegah modal detail terbuka

  const userId = user.id;
  if (!confirm('Anda yakin ingin menghapus pengguna ini secara permanen?')) {
    return;
  }
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/users/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    alert('Pengguna berhasil dihapus.');
    fetchUsers();
  } catch (err) {
    alert('Gagal menghapus pengguna.');
    console.error('Delete user error:', err);
  }
}



function getProfilePictureUrl(picturePath) {

  if (!picturePath || picturePath === '/default-profile.png') {
    return null; 
  }

  if (picturePath.startsWith('http')) {
    return picturePath;
  }
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  return `${apiUrl.replace(/\/$/, '')}/${picturePath.replace(/^\//, '')}`;
}

const imageErrorState = ref({});
const handleImageError = (event, userId) => {
   if (event && event.target) {
    event.target.style.display = 'none';
  }

 imageErrorState.value[userId] = true;
};



const router = useRouter();
onMounted(fetchUsers);
</script>

<style scoped>

/* Base Styles */
.admin-dashboard {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 1.5rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background-color: #f5f7fa;
  color: #263238;
}

/* Header Styles */
.dashboard-header {
    background: linear-gradient(135deg, #00639c, #01457d);
  border-radius: 12px;
  margin: 1.5rem 0 3rem;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1), 0 5px 10px rgba(0,0,0,0.05);
  padding: 2rem 2.5rem;
  color: white;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  position: relative;
  z-index: 2;
  padding-top: 70px;
}



.animated-title {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(90deg, #fdfdfd, #fff0e4);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: gradient 3s ease infinite;
  background-size: 200% 200%;
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.subtitle {
  margin: 0.5rem 0 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  font-weight: 400;
}

/* Search Container */
.search-container {
  position: relative;
  flex-grow: 1;
  max-width: 500px;
  min-width: 250px;
}

.search-input {
  width: 100%;
  padding: 0.85rem 1.25rem 0.85rem 3rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  background-color: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(5px);
  color: rgb(255, 255, 255);
  box-sizing: border-box;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.search-input:focus {
  outline: none;
  background-color: rgba(255, 255, 255, 0.25);
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.2);
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color:  rgba(254, 254, 254, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  margin: 2rem 0;
}

.loader {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;
}

.loader-square {
  width: 12px;
  height: 24px;
  margin: 0 3px;
  background: #0277bd;
  animation: loaderAnimation 1.2s infinite ease-in-out;
}

.loader-square:nth-child(1) { animation-delay: 0s; }
.loader-square:nth-child(2) { animation-delay: 0.15s; }
.loader-square:nth-child(3) { animation-delay: 0.3s; }
.loader-square:nth-child(4) { animation-delay: 0.45s; }
.loader-square:nth-child(5) { animation-delay: 0.6s; }
.loader-square:nth-child(6) { animation-delay: 0.75s; }
.loader-square:nth-child(7) { animation-delay: 0.9s; }

@keyframes loaderAnimation {
  0%, 40%, 100% { transform: scaleY(0.6); }
  20% { transform: scaleY(1); }
}

.loading-state p {
  color: #546e7a;
  font-size: 1.1rem;
  margin-top: 1rem;
}

/* Error State */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  margin: 2rem 0;
}

.error-illustration {
  margin-bottom: 1.5rem;
}

.error-title {
  color: #c62828;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.error-message {
  color: #546e7a;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  max-width: 500px;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  margin: 2rem 0;
}

.empty-illustration {
  margin-bottom: 1.5rem;
}

.empty-title {
  color: #263238;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.empty-message {
  color: #546e7a;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  max-width: 500px;
}

/* Buttons */
.retry-button, .reset-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #0277bd;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
}

.retry-button:hover, .reset-button:hover {
  background-color: #004c8c;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08);
}

.retry-button:active, .reset-button:active {
  transform: translateY(0);
}

/* User Groups */
.user-groups {
  margin-bottom: 3rem;
}

/* Category Section */
.category-section {
  margin-bottom: 2rem;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.category-section:hover {
  box-shadow: 0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08);
  transform: translateY(-2px);
}

.category-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 2rem;
  background-color: rgba(2, 119, 189, 0.05);
  border-bottom: 1px solid #cfd8dc;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.category-header h2 {
  margin: 0;
  font-size: 1.4rem;
  color: #0277bd;
  font-weight: 600;
}

.category-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
}


.category-header:hover {
  background-color: rgba(2, 119, 189, 0.1);
}

.category-title {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.category-title h2 {
  margin: 0;
  font-size: 1.4rem;
  color: #0277bd;
  font-weight: 600;
}

.badge {
  background-color: #0277bd;
  color: white;
  padding: 0.35rem 0.75rem;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  min-width: 50px;
  text-align: center;
}

.category-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.action-button {
   padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.action-button:hover {
  background-color:  #c0392b;
  transform: scale(1.1);
}

.collapse-icon {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.collapse-icon.collapsed {
  transform: rotate(-90deg);
}

/* Table Container */
.table-container {
  overflow-x: auto;
  padding: 0 1rem;
}

/* Desktop Table */
.desktop-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: #ffffff;
  margin: 1rem 0;
}

.desktop-table th {
  background: rgba(2, 119, 189, 0.1);
  color: #0277bd;
  padding: 1rem 1.25rem;
  font-weight: 600;
  text-align: left;
  position: sticky;
  top: 0;
  z-index: 10;
  white-space: nowrap;
}

.desktop-table td {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #cfd8dc;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  vertical-align: middle;
}

.desktop-table tr:last-child td {
  border-bottom: none;
}

.desktop-table tr:hover td {
  background-color: rgba(2, 119, 189, 0.03);
}

.desktop-table tr:nth-child(even) {
  background-color: rgba(2, 119, 189, 0.02);
}

/* User Avatar */
.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0277bd, #004c8c);
  color: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  font-weight: 600;
  font-size: 0.9rem;
  object-fit: cover;
}

.user-avatar img {
 width: 100%;
 height: 100%;
 object-fit: cover; 
 border-radius: 50%;
}

.avatar-initial {
 line-height: 1;
 width: 100%;
 height: 100%;
 display: flex;
 justify-content: center;
 align-items: center;
 background-color: #f0f2f5;
 color: #495057;
 font-weight: bold;
 font-size: 0.9rem;
 border-radius: 50%;
}

/* Age Badge */
.age-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background-color: rgba(233, 30, 99, 0.1);
  color: #e91e63;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.85rem;
}

/* Mobile Cards */
.mobile-cards {
  display: none;
  gap: 1rem;
  padding: 1rem 0;
}

.user-card {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid #cfd8dc;
}

.user-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08);
  border-color: #58a5f0;
}

.card-header {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: rgba(2, 119, 189, 0.03);
  border-bottom: 1px solid #cfd8dc;
  position: relative;
}

.card-user-info {
  flex-grow: 1;
  margin-left: 1rem;
}

.card-name {
  margin: 0;
  font-size: 1.1rem;
  color: #263238;
  font-weight: 600;
}

.card-username {
  font-size: 0.85rem;
  color: #546e7a;
}

.card-number {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(2, 119, 189, 0.1);
  color: #0277bd;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
}

.card-details {
  padding: 1rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
}

.detail-label {
  font-weight: 500;
  color: #546e7a;
  font-size: 0.9rem;
}

.detail-value {
  color: #263238;
  text-align: right;
  font-weight: 500;
  max-width: 60%;
  word-break: break-word;
}

/* Special mobile value styling */
.age-value {
  color: #e91e63;
  font-weight: 600;
}

.email-value {
  color: #0277bd;
  word-break: break-all;
}

.address-value {
  color: #263238;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  position: relative;
  background: #ffffff;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1), 0 5px 10px rgba(0,0,0,0.05);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #546e7a;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #263238;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: center; /* Tambahkan ini untuk pusatkan horizontal */
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid #cfd8dc;
  text-align: center; /* Tambahkan ini untuk pusatkan teks */
  flex-direction: column; /* Ubah ke column layout */
}

.modal-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0277bd, #004c8c);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0; /* Hapus margin right karena sekarang column layout */
  margin-bottom: 1rem; /* Tambahkan margin bottom untuk jarak dengan teks */
  font-weight: 600;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.modal-user-info {
  flex-grow: 1;
  width: 100%; /* Pastikan mengambil lebar penuh */
  display: flex;
  flex-direction: column;
  align-items: center; /* Pusatkan konten secara horizontal */
}


.modal-user-info h2 {
  margin: 0;
  font-size: 1.75rem;
  color: #263238;
}

.modal-user-info p {
  margin: 0.25rem 0 0;
  color: #546e7a;
  font-size: 1rem;
}

.modal-body {
  padding: 1.5rem 2rem;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-item.full-width {
  grid-column: span 2;
}

.info-label {
  font-size: 0.85rem;
  color: #546e7a;
  margin-bottom: 0.25rem;
}

.info-value {
  font-size: 1rem;
  color: #263238;
  font-weight: 500;
  padding: 0.5rem 0;
  border-bottom: 1px solid #cfd8dc;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 1.5rem 2rem;
  gap: 1rem;
  border-top: 1px solid #cfd8dc;
}

.modal-button {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.modal-button.secondary {
  background: none;
  border: 1px solid #cfd8dc;
  color: #546e7a;
}

.modal-button.secondary:hover {
  background: rgba(0, 0, 0, 0.02);
  color: #263238;
}

.modal-button.primary {
  background: #0277bd;
  border: none;
  color: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
}

.modal-button.primary:hover {
  background: #004c8c;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08);
}


.action-button.delete {
  background-color: #e74c3c;
  color: white;
}
.action-button.delete:hover {
  background-color: #c0392b;
   transform: translateY(-2px);
}



/* Transition Effects */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}




/* Style untuk Modal Edit */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}
.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  position: relative;
}
.modal-close {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  font-size: 2rem;
  font-weight: 300;
  color: #aaa;
  cursor: pointer;
}
.modal-content h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
}
/* Tambahkan 'select' di akhir selector */

.edit-form .input-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  font-family: inherit;
  box-sizing: border-box;
}

.edit-form .form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}
.edit-form .styled-button {
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.edit-form .styled-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

/* Tombol Batal (sekunder) */
.styled-button.cancel {
  background-color: #6c757d;
  color: white;
}
.styled-button.cancel:hover {
  background-color: #5a6268;
}

/* Tombol Simpan (primer) */
.styled-button.save {
  background-color: #2d6ff3;
  color: white;
}
.styled-button.save:hover {
  background-color: #0952c7;
}





/* Style untuk grup input */
.input-group {
  margin-bottom: 1.5rem; /* Beri jarak lebih antar field */
  position: relative;
}

/* Style untuk label */
.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

/* Style untuk semua input dan textarea */
.input-group input, 
.input-group textarea {
  width: 100%; 
  padding: 0.8rem 1rem;
  border: 2px solid #ccc; /* Border lebih tebal */
  border-radius: 8px; /* Sudut lebih rounded */
  box-sizing: border-box; 
  font-family: inherit; 
  font-size: 1rem;      
  transition: border-color 0.2s ease, box-shadow 0.2s ease; /* Tambah transisi */
}


.input-group input:focus,
.input-group textarea:focus {
  outline: none;
  border-color: #007bff; /* Warna border berubah menjadi biru */
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25); /* Efek glow */
}





.avatar-initial-large {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
    border-radius: 50%;
  overflow: hidden;
  display: inline-block;
}


.avatar-initial-large img {
  width: 100%; 
  height: 100%;
  object-fit: cover; 
}






/* Responsive Design */
@media (max-width: 1200px) {
  .admin-dashboard {
    padding: 0 1.25rem;
  }
  
  .dashboard-header {
    padding: 1.75rem 2rem;
  }
  
  .animated-title {
    font-size: 2.2rem;
  }
}

@media (max-width: 992px) {
  .header-content {
    flex-direction: column;
    align-items: stretch;
    gap: 1.5rem;
  }
  
  .search-container {
    max-width: 100%;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .info-item.full-width {
    grid-column: span 1;
  }
}

@media (max-width: 768px) {
  .dashboard-header {
    padding: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .animated-title {
    font-size: 1.8rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
  
  .category-header {
    padding: 1rem 1.25rem;
  }
  
  .category-title h2 {
    font-size: 1.2rem;
  }
  
  .desktop-table {
    display: none;
  }
  
  .mobile-cards {
    display: grid;
  }
  
  .modal-header {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
  }
  
  .modal-avatar {
    margin-right: 0;
    margin-bottom: 1rem;
  }
  
  .modal-body {
    padding: 1rem 1.5rem;
  }
  
  .modal-footer {
    padding: 1rem 1.5rem;
  }
}

@media (max-width: 576px) {
  .admin-dashboard {
    padding: 0 1rem;
  }
  
  .dashboard-header {
    border-radius: 0;
    margin-left: -1rem;
    margin-right: -1rem;
    margin-top: 0;
  }
  
  .category-section {
    border-radius: 0;
    margin-left: -1rem;
    margin-right: -1rem;
  }
  
  .modal-content {
    width: 95%;
  }
  
  .modal-footer {
    flex-direction: column;
  }
  
  .modal-button {
    width: 100%;
  }
}

</style>