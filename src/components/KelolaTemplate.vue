<template>
  <div class="page-container">
    <header class="page-header">
      <div class="header-content">
        <h1>Kelola Template Raport</h1>
        <p class="subtitle">Tambah, hapus, atau ubah komponen penilaian untuk setiap kelas</p>
      </div>
      
      <router-link to="/instrumen-pembelajaran" class="btn-kembali" @click="setRaportTab">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Kembali ke Raport
      </router-link>
    </header>

    <main class="content-area">
      <div class="card kelas-selector">
        <label for="kelas-select">Pilih Kelas</label>
        <div class="select-wrapper">
          <select id="kelas-select" v-model="selectedKelas" @change="fetchKolom">
            <option value="paud">Paud</option>
            <option value="caberawit">Caberawit</option>
            <option value="pra-remaja">Pra Remaja</option>
            <option value="remaja">Remaja</option>
            <option value="pra-nikah">Pra Nikah</option>
          </select>
          <div class="select-arrow"></div>
        </div>
      </div>

      <div class="card add-form-container">
        <h3 class="form-title">
          <span class="icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
          Tambah Materi Baru
        </h3>
        <form @submit.prevent="addKolom" class="add-form">
          <div class="form-group">
            <input type="text" v-model="newKolom.nama" placeholder="Nama Materi (contoh: Hafalan Surat)" required>
          </div>
          <button type="submit" class="btn-add">
            <span v-if="!adding">Tambah Materi</span>
            <span v-else class="loading-spinner"></span>
          </button>
        </form>
      </div>

       
      <div class="card wali-kelas-form">
  <h3 class="form-title">
    <span class="icon">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M12.5 11C14.7091 11 16.5 9.20914 16.5 7C16.5 4.79086 14.7091 3 12.5 3C10.2909 3 8.5 4.79086 8.5 7C8.5 9.20914 10.2909 11 12.5 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </span>
    Wali Kelas
  </h3>
  <div class="form-group">
    <input 
      type="text" 
      v-model="waliKelas" 
      placeholder="Masukkan nama wali kelas"
      class="wali-kelas-input"
    >
    <button @click="saveWaliKelas" class="btn-save">
      <span v-if="!savingWaliKelas">Simpan</span>
      <span v-else class="loading-spinner small"></span>
    </button>
  </div>
</div>
      
      <div class="card list-container">
        <div class="list-header">
          <h3>Daftar Materi untuk Kelas: <span class="kelas-name">{{ formatKelasName(selectedKelas) }}</span></h3>
          <div class="list-actions">
            <button @click="fetchKolom" class="btn-refresh" :class="{ refreshing: loading }">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C15.0396 2 17.7895 3.27675 19.7942 5.3125M19.7942 5.3125V2M19.7942 5.3125H16.9811" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
       

        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Memuat data materi...</p>
        </div>
        
        <div v-else-if="kolomList.length > 0" class="materi-list">
          <transition-group name="list">
            <div v-for="kolom in kolomList" :key="kolom.id" class="materi-item">
              <div class="materi-info">
                <span class="materi-name">{{ kolom.nama }}</span>
                <span class="materi-type" :class="{'teks': kolom.tipe === 'Teks', 'nilai': kolom.tipe === 'Nilai'}">
                  {{ kolom.tipe }}
                </span>
              </div>
              <button @click="deleteKolom(kolom.id)" class="btn-delete" :disabled="deleting === kolom.id">
                <span v-if="deleting !== kolom.id">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
                <span v-else class="loading-spinner small"></span>
              </button>
            </div>
          </transition-group>
        </div>
        
        <div v-else class="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M14 2V8H20" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 18V12" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9 15H15" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <h4>Belum ada materi untuk kelas ini</h4>
          <p>Mulai dengan menambahkan materi baru menggunakan form di atas</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const selectedKelas = ref('paud');
const kolomList = ref([]);
const newKolom = ref({ nama: ''});
const loading = ref(false);
const adding = ref(false);
const deleting = ref(null);
const token = localStorage.getItem('token');
const router = useRouter();
const waliKelas = ref(''); 
const activeKelas = ref('paud');
const savingWaliKelas = ref(false);



const formatKelasName = (kelas) => {
  const names = {
    'paud': 'Paud',
    'caberawit': 'Caberawit',
    'pra-remaja': 'Pra Remaja',
    'remaja': 'Remaja',
    'pra-nikah': 'Pra Nikah'
  };
  return names[kelas] || kelas;
};

const fetchKolom = async () => {
  if (!selectedKelas.value) return;
  loading.value = true;
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/template/${selectedKelas.value}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    kolomList.value = response.data;
  } catch (error) {
    console.error('Gagal mengambil data materi:', error);
    showToast('Gagal memuat data materi', 'error');
  } finally {
    loading.value = false;
  }
};



const addKolom = async () => {
  if (!newKolom.value.nama.trim()) return;
  adding.value = true;
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/template/${selectedKelas.value}/kolom`,
      newKolom.value,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    
    // Kode ini sekarang akan berhasil karena kolomList.value adalah sebuah array
    kolomList.value.push(response.data); // Asumsi respons langsung mengembalikan objek kolom baru
    
    newKolom.value.nama = '';
    showToast('Materi berhasil ditambahkan', 'success');
  } catch (error) {
    console.error('Gagal menambah materi:', error);
    showToast('Gagal menambah materi: ' + (error.response?.data?.message || error.message), 'error');
  } finally {
    adding.value = false;
  }
};



const deleteKolom = async (kolomId) => {
  if (!confirm('Anda yakin ingin menghapus materi ini?')) return;
  deleting.value = kolomId;
  try {
    await axios.delete(
      `${import.meta.env.VITE_API_BASE_URL}/api/template/${selectedKelas.value}/kolom/${kolomId}`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    kolomList.value = kolomList.value.filter(k => k.id !== kolomId);
    showToast('Materi berhasil dihapus', 'success');
  } catch (error) {
    console.error('Gagal menghapus materi:', error);
    showToast('Gagal menghapus materi', 'error');
  } finally {
    deleting.value = null;
  }
};


const showToast = (message, type) => {
  alert(`${type === 'success' ? '✓' : '✗'} ${message}`);
};

const setRaportTab = () => {
  sessionStorage.setItem('defaultInstrumentTab', 'raport');
};


const fetchTemplateData = async () => {
  if (!selectedKelas.value) return;
  loading.value = true;
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/template/${selectedKelas.value}`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    
    // PERBAIKAN UTAMA: Ambil array 'kolom' dari dalam data respons
    const template = response.data.data || {};
    kolomList.value = template.kolom || [];
    waliKelas.value = template.waliKelas || '';
  } catch (error) {
    console.error('Gagal mengambil data template:', error);
    showToast('Gagal memuat data template', 'error');
  } finally {
    loading.value = false;
  }
};


async function saveWaliKelas() {
  savingWaliKelas.value = true;
  try {
    await axios.put(
      `${import.meta.env.VITE_API_BASE_URL}/api/template/${selectedKelas.value}/walikelas`,
      { waliKelas: waliKelas.value },
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    showToast('Nama wali kelas berhasil disimpan', 'success');
  } catch (error) {
    console.error('Gagal menyimpan wali kelas:', error);
    showToast('Gagal menyimpan nama wali kelas', 'error');
  } finally {
    savingWaliKelas.value = false;
  }
}



watch(selectedKelas, fetchTemplateData);
onMounted(fetchTemplateData);
</script>

<style scoped>
.page-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  color: #2d3748;
  background-color: #f7fafc;
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
  padding-bottom: 1rem;
}

.header-content {
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  padding: 2rem;
  border-radius: 12px;
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.page-header h1 {
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
}

.btn-kembali {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: white;
  color: #3182ce;
  border: none;
  border-radius: 9999px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 10;
}

.btn-kembali:hover {
  background-color: #ebf8ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.btn-kembali svg {
  transition: transform 0.3s ease;
}

.btn-kembali:hover svg {
  transform: translateX(-3px);
}

.content-area {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
}

.card:hover {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.kelas-selector {
  background-color: #ebf8ff;
  border-color: #bee3f8;
}

.kelas-selector label {
  font-weight: 600;
  color: #2b6cb0;
  font-size: 0.95rem;
}

.select-wrapper {
  position: relative;
}

.select-wrapper select {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid #cbd5e0;
  background-color: #f8fafc;
  appearance: none;
  font-size: 1rem;
  color: #2d3748;
  transition: all 0.2s ease;
}

.select-wrapper select:focus {
  outline: none;
  border-color: #63b3ed;
  box-shadow: 0 0 0 3px rgba(99, 179, 237, 0.3);
  background-color: white;
}

.select-arrow {
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #4a5568;
  pointer-events: none;
}

.add-form-container {
  background: linear-gradient(135deg, #ebf8ff 0%, #bee3f8 100%);
  border: 1px solid #90cdf4;
}

.form-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  color: #2b6cb0;
  margin-bottom: 1.5rem;
}

.form-title .icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: #4299e1;
  border-radius: 50%;
  color: white;
}

.add-form {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.form-group {
  position: relative;
}

.form-group input {
  width: 350px;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid #cbd5e0;
  background-color: white;
  font-size: 1rem;
  transition: all 0.2s ease;
  color: #2d3748;
  box-sizing: border-box;
  
}

.form-group input:focus {
  outline: none;
  border-color: #63b3ed;
  box-shadow: 0 0 0 3px rgba(99, 179, 237, 0.3);
}

.btn-add {
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  width: 150px;
  margin-left: auto;
  box-shadow: 0 2px 4px rgba(66, 153, 225, 0.3);
}

.btn-add:hover {
  background: linear-gradient(135deg, #3182ce 0%, #2c5282 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(66, 153, 225, 0.4);
}

                                                                                                                    

.list-container {
  background-color: white;
  border: 1px solid #e2e8f0;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #edf2f7;
}

.list-header h3 {
  font-size: 1.25rem;
  color: #2b6cb0;
}

.kelas-name {
  color: #3182ce;
  font-weight: 600;
}

.list-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-refresh {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #ebf8ff;
  color: #3182ce;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-refresh:hover {
  background-color: #bee3f8;
}

.btn-refresh.refreshing {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 1rem;
}

.loading-state p {
  color: #718096;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  gap: 1rem;
  background-color: #f8fafc;
  border-radius: 8px;
  margin: 1rem 0;
}

.empty-state h4 {
  font-size: 1.125rem;
  color: #2d3748;
  font-weight: 600;
}

.empty-state p {
  color: #718096;
  max-width: 400px;
}

.materi-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.materi-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f8fafc;
  border-radius: 8px;
  transition: all 0.2s ease;
  border: 1px solid #e2e8f0;
  
}

.materi-item:hover {
  background-color: #ebf8ff;
  border-color: #bee3f8;
}

.materi-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  
}

.materi-name {
  font-weight: 500;
  color: #2d3748;
}

.materi-type {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 500;
  display: inline-block;
}

.materi-type.teks {
  background-color: #ebf8ff;
  color: #3182ce;
}

.materi-type.nilai {
  background-color: #fff5f5;
  color: #e53e3e;
}

.btn-delete {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #fff5f5;
  color: #e53e3e;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-delete:hover {
  background-color: #fed7d7;
}

.btn-delete:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

.loading-spinner.small {
  width: 16px;
  height: 16px;
  border-width: 2px;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.wali-kelas-form {
  background: linear-gradient(135deg, #e1f1fb 0%, #a4dbff 100%);
  border: 1px solid #5588f6;
}

.wali-kelas-form .form-title {
  color: #215a9c;
}

.wali-kelas-form .form-title .icon {
  background-color: #2088dd;
}

.form-group {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.wali-kelas-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid #cbd5e0;
  background-color: white;
  font-size: 1rem;
  transition: all 0.2s ease;
  color: #2d3748;
}

.wali-kelas-input:focus {
  outline: none;
  border-color: #f6ad55;
  box-shadow: 0 0 0 3px rgba(246, 173, 85, 0.3);
}

.btn-save {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  height: 44px;
  min-width: 100px;
  box-shadow: 0 2px 4px rgba(237, 137, 54, 0.3);
}

.btn-save:hover {
  background: linear-gradient(135deg, #3182ce 0%, #2c5282 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(237, 137, 54, 0.4);
}

.btn-save:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}


@media (min-width: 768px) {
  .add-form {
    grid-template-columns: 1fr 1fr auto;
  }
  
  .content-area {
    grid-template-columns: 1fr 1fr;
  }
  
  .list-container {
    grid-column: span 2;
  }
}
</style>