<template>
  <div class="page-container">
    <!-- Animated Background Elements -->
    <div class="floating-elements">
      <div v-for="i in 8" :key="i" class="floating-element" :style="floatingElementStyle(i)"></div>
    </div>

    <!-- Header Section -->
    <header class="page-header">
      <div class="header-image-container">
        <img src="/foto-pengurus.jpeg" alt="Jajaran Pengurus Madrasah" class="header-image">
        <div class="header-overlay"></div>
        <div class="header-content">
          <h1>Struktur Kepengurusan</h1>
          <p class="header-subtitle">5 Unsur Madrasah Cipondoh</p>
        </div>
      </div>
    </header>

    <main class="content-section">
      <!-- Description Section -->
      <transition name="fade-up" appear>
        <section class="description-section">
          <div class="section-inner">
            <p>
              Struktur kepengurusan Madrasah Cipondoh disusun untuk memastikan proses belajar mengajar dan kegiatan santri berjalan dengan baik, terarah, dan sesuai dengan visi misi kami. Setiap anggota memiliki peran dan tanggung jawab yang jelas untuk mendukung kemajuan pendidikan dan pembinaan karakter para santri.
            </p>
          </div>
        </section>
      </transition>

      <!-- Organization Chart Section -->
      <transition name="fade-up" appear>
        <section class="org-chart-section">
          <div class="section-inner">
            <h2><span class="heading-underline">Struktur Kepengurusan Madrasah</span></h2>
            <div class="chart-container">
              <img src="/bagan-organisasi.png" alt="Bagan Struktur Organisasi" class="org-chart-image" @load="chartLoaded = true" :class="{ 'loaded': chartLoaded }">
              <div v-if="!chartLoaded" class="chart-loading">
                <div class="loading-spinner"></div>
                <p>Memuat bagan organisasi...</p>
              </div>
            </div>
          </div>
        </section>
      </transition>
      
      <!-- Members Section -->
      <section class="members-section">
        <div class="section-inner">
          <h2><span class="heading-underline">Jajaran Pengurus</span></h2>
          
          <div class="filter-controls">
            <button 
              v-for="filter in filters" 
              :key="filter.value"
              @click="activeFilter = filter.value"
              :class="{ 'active': activeFilter === filter.value }"
            >
              {{ filter.label }}
            </button>
          </div>
          
          <div class="members-grid">
            <div 
              v-for="pengurus in filteredPengurus" 
              :key="pengurus.nama" 
              class="member-card"
              @mouseenter="hoverMember(pengurus.nama)"
              @mouseleave="hoveredMember = null"
            >
              <div class="photo-container">
                <img 
                  :src="pengurus.fotoUrl" 
                  :alt="'Foto ' + pengurus.nama" 
                  class="member-photo"
                  :class="{ 'hovered': hoveredMember === pengurus.nama }"
                >
                <div class="photo-overlay">
                  <span class="view-text">Profil</span>
                </div>
              </div>
              <div class="member-info">
                <h3>{{ pengurus.nama }}</h3>
                <p class="member-role">{{ pengurus.jabatan }}</p>
                <div v-if="pengurus.kontak" class="member-contact">
                  <a :href="'tel:' + pengurus.kontak">
                    <span class="contact-icon">📞</span> {{ formatPhoneNumber(pengurus.kontak) }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const jajaranPengurus = ref([
  {
    nama: 'Sujimin',
    jabatan: 'Dewan Pembina',
    fotoUrl: '/default-profile.png',
    kontak: '+62 825-8971-1330',
    kategori: 'pembina'
  },
  {
    nama: 'Mutoyo',
    jabatan: 'Wakil Pembina',
    fotoUrl: '/default-profile.png',
    kontak: '+62 822-3445-2489',
    kategori: 'pembina'
  },
  {
    nama: 'Syamsudin',
    jabatan: 'Wakil Pembina',
    fotoUrl: '/default-profile.png',
    kontak: '+62 812-9609-4965',
    kategori: 'pembina'
  },
  {
    nama: 'Ahmad Dani Fadlan',
    jabatan: 'Penanggungjawab Program Tingkat Kelompok',
    fotoUrl: '/foto-profil-dani.png',
    kontak: '+62 853-2163-1281',
    kategori: ['manajemen', 'pengajar']
  },
  {
    nama: 'Lulia Nurul Khoiri',
    jabatan: 'Bendahara',
    fotoUrl: '/foto-profil-lulia.png',
    kontak: '+62 822-8119-6934',
    kategori: ['manajemen','pengajar']
  },
  {
    nama: 'Lurian Nurnuha',
    jabatan: 'Sekretaris',
    fotoUrl: '/foto-profil-lurian.png',
    kontak: '+62 895-4015-68552',
    kategori: 'manajemen'
  },
  {
    nama: 'Yasser',
    jabatan: 'Pakar Pendidik (Putra)',
    fotoUrl: '/default-profile.png',
    kontak: '+62 852-8201-1118',
    kategori: 'pendidik'
  },
  {
    nama: 'Retno Nur Handayani',
    jabatan: 'Pakar Pendidik (Putri)',
    fotoUrl: '/default-profile.png',
    kontak: '+62 857-7926-8211',
    kategori: 'pendidik'
  },
  {
    nama: 'Ririn Ambarwati',
    jabatan: 'Wali Orang Tua (Usia PAUD-Caberawit)',
    fotoUrl: '/default-profile.png',
    kontak: '+62 821-1492-3858',
    kategori: 'wali'
  },
  {
    nama: 'Nurul Farisa',
    jabatan: 'Wali Orang Tua (Usia SMP-SMA)',
    fotoUrl: '/default-profile.png',
    kontak: '+62 856-4963-3335',
    kategori: 'wali'
  },
  {
    nama: 'Muhammad Diyan Permadi',
    jabatan: 'Koordinator Guru',
    fotoUrl: '/foto-profil-diyan.png',
    kontak: '+62 858-8940-9822',
    kategori: ['pendidik', 'pengajar']
  },
]);

const filters = [
  { label: 'Semua', value: 'semua' },
  { label: 'Pembina', value: 'pembina' },
  { label: 'Manajemen', value: 'manajemen' },
  { label: 'Pendidik', value: 'pendidik' },
  { label: 'Wali', value: 'wali' },
  { label: 'Pengajar', value: 'pengajar' }
];

const activeFilter = ref('semua');
const hoveredMember = ref(null);
const chartLoaded = ref(false);

const floatingElementStyle = (i) => {
  const size = Math.random() * 20 + 10;
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDuration: `${Math.random() * 30 + 20}s`,
    animationDelay: `${Math.random() * 5}s`,
    opacity: Math.random() * 0.3 + 0.1,
  };
};

const filteredPengurus = computed(() => {
  if (activeFilter.value === 'semua') return jajaranPengurus.value;
  return jajaranPengurus.value.filter(p => 
    Array.isArray(p.kategori) 
      ? p.kategori.includes(activeFilter.value)
      : p.kategori === activeFilter.value
  );
});

const hoverMember = (nama) => {
  hoveredMember.value = nama;
};

const formatPhoneNumber = (phone) => {
  return phone.replace(/(\d{2})(\d{3})(\d{4})(\d{4})/, '$1 $2-$3-$4');
};
</script>

<style scoped>
/* Base Styles */
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem 3rem;
  font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  position: relative;
  padding-top: 70px;
}

/* Floating Elements Animation */
.floating-elements {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.floating-element {
  position: absolute;
  background: linear-gradient(135deg, #014283, #0277bd);
  border-radius: 50%;
  filter: blur(2px);
  animation: float linear infinite;
  z-index: -1;
}

@keyframes float {
  0% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-100px) rotate(180deg);
  }
  100% {
    transform: translateY(0) rotate(360deg);
  }
}

/* Header Styles */
.page-header {
  position: relative;
  margin-bottom: 3rem;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.header-image-container {
  position: relative;
  height: 400px;
}

.header-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.header-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(1, 38, 74, 0.2) 0%, rgba(1, 38, 74, 0.7) 100%);
}

.header-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  color: white;
  text-align: center;
}

.page-header h1 {
  font-size: 3rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}

.header-subtitle {
  font-size: 1.3rem;
  margin: 0;
  opacity: 0.9;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

/* Content Sections */
.content-section {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  position: relative;
  z-index: 1;
}

.section-inner {
  max-width: 1100px;
  margin: 0 auto;
  width: 100%;
  padding: 0 1rem;
}

/* Description Section */
.description-section {
  background-color: #f8fafc;
  border-radius: 12px;
  padding: 3rem 2rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border: 1px solid #e1e8ed;
}

.description-section p {
  font-size: 1.15rem;
  line-height: 1.8;
  text-align: center;
  color: #444;
  margin: 0 auto;
  max-width: 800px;
}

/* Organization Chart Section */
.org-chart-section {
  background-color: white;
  border-radius: 12px;
  padding: 3rem 1rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border: 1px solid #e1e8ed;
}

h2 {
  text-align: center;
  font-size: 2.2rem;
  color: #01264a;
  margin-bottom: 2.5rem;
  position: relative;
}

.heading-underline {
  position: relative;
  padding-bottom: 0.5rem;
}

.heading-underline::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background-color: #0566a6;
  border-radius: 2px;
}

.chart-container {
  display: flex;
  justify-content: center;
  padding: 1.5rem;
  background-color: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e1e8ed;
  min-height: 300px;
  position: relative;
}

.org-chart-image {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.org-chart-image.loaded {
  opacity: 1;
}

.chart-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(1, 66, 131, 0.1);
  border-top-color: #0566a6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Members Section */
.members-section {
  background-color: white;
  border-radius: 12px;
  padding: 3rem 1rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border: 1px solid #e1e8ed;
}

.filter-controls {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-bottom: 2.5rem;
}

.filter-controls button {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 50px;
  background-color: #e1e8ed;
  color: #01264a;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-controls button:hover {
  background-color: #0566a6;
  color: white;
}

.filter-controls button.active {
  background-color: #0566a6;
  color: white;
  box-shadow: 0 4px 12px rgba(5, 102, 166, 0.3);
}

.members-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.member-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.8rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  background-color: #ffffff;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  border: 1px solid #e1e8ed;
  position: relative;
  overflow: hidden;
}

.member-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
  border-color: #0566a6;
}

.member-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #014283, #0566a6);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.member-card:hover::before {
  opacity: 1;
}

.photo-container {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  margin-bottom: 1.8rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.member-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.5s ease;
  transform: scale(1);
}

.member-photo.hovered {
  transform: scale(1.1);
}

.photo-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(1, 66, 131, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 50%;
}

.member-card:hover .photo-overlay {
  opacity: 1;
}

.view-text {
  color: white;
  font-weight: 500;
  font-size: 0.9rem;
}

.member-info {
  text-align: center;
  width: 100%;
}

.member-card h3 {
  margin: 0 0 0.6rem;
  font-size: 1.35rem;
  color: #01264a;
  font-weight: 600;
}

.member-role {
  margin: 0 0 1.2rem;
  color: #0566a6;
  font-weight: 500;
  font-size: 0.95rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e1e8ed;
}

.member-contact {
  margin-top: auto;
}

.member-contact a {
  color: #414a54;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  transition: color 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.member-contact a:hover {
  color: #0566a6;
}

.contact-icon {
  font-size: 1.1rem;
}

/* Animations */
.fade-up-enter-active,
.fade-up-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .header-content {
    padding: 1.5rem;
  }
  
  .page-header h1 {
    font-size: 2.5rem;
  }
  
  .header-subtitle {
    font-size: 1.1rem;
  }
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }
  
  .members-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
  
  h2 {
    font-size: 1.8rem;
  }
  
  .description-section p {
    font-size: 1rem;
  }
  
  .photo-container {
    width: 140px;
    height: 140px;
  }
}

@media (max-width: 480px) {
  .page-header h1 {
    font-size: 1.6rem;
  }
  
  .header-subtitle {
    font-size: 1rem;
  }
  
  .photo-container {
    width: 120px;
    height: 120px;
  }
  
  .member-card {
    padding: 1.5rem;
  }
  
  .filter-controls {
    gap: 0.5rem;
  }
  
  .filter-controls button {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }
}
</style>