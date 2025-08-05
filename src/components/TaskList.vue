<template>
  <div class="page-container">
    <!-- Animated Background Elements -->
    <div class="floating-elements">
      <div v-for="i in 12" :key="i" class="floating-element" :style="floatingElementStyle(i)"></div>
    </div>

    <!-- Header Section -->
    <header class="page-header">
      <div class="header-decoration">
        <div class="decoration-circle"></div>
        <div class="decoration-star">✧</div>
        <div class="islamic-pattern"></div>
      </div>
      
      <div class="header-content">
        <transition name="fade-down" appear>
          <div>
            <h1>Selamat Datang di <span class="highlight">Madrasah Cipondoh</span></h1>
            <p class="subtitle">Mencetak Generasi Penerus dengan 29 Karakter Luhur dalam Jama'ah</p>
          </div>
        </transition>
        
        <div class="scroll-down" @click="scrollToContent">
          <span>↓</span>
          <p>Jelajahi lebih lanjut</p>
        </div>
      </div>
    </header>
    
    <!-- Main Content -->
    <main class="content-section" ref="contentSection">
      <!-- Profile Section -->
      <section class="school-profile">
        <div class="section-decoration">
          <div class="arabic-pattern">﷽</div>
        </div>
        
        <transition name="fade-up" appear>
          <div>
            <h2><span class="title-icon">📜</span> Profil Singkat</h2>
            <p>
              Madrasah Cipondoh merupakan wadah dalam proses kegiatan belajar 
              mengajar generasi penerus Kelompok Cipondoh mulai dari usia PAUD hingga usia 
              Pra Nikah.
            </p>
            
            <div class="stats-container">
              <div class="stat-card" v-for="stat in stats" :key="stat.id">
                <div class="stat-number">{{ stat.value }}</div>
                <div class="stat-label">{{ stat.label }}</div>
              </div>
            </div>
          </div>
        </transition>
      </section>

      <!-- Location Section -->
       <section class="location-section">
    <transition name="fade-up" appear>
      <div>
        <h2><span class="title-icon">📍</span> Lokasi Kami</h2>
        <div class="location-content">
          <div class="address-details">
            <div class="floating-mosque-icon">🕌</div>
            <h3>Alamat Lengkap</h3>
            <p class="address-text">
              Jl. Irigasi Sipon RT.003/RW.008,
              Cipondoh, Kec. Cipondoh,
              Kota Tangerang, Banten 15146
            </p>
            <div class="contact-info">
              <p>
                <span class="contact-icon">📞</span> 
                <span class="contact-detail">
                  <strong>Telepon : </strong> 
                  <a>+62 838 - 7362 - 4774</a>
                </span>
              </p>
              <p>
                <span class="contact-icon">✉️</span> 
                <span class="contact-detail">
                  <strong>Email : </strong> 
                  <a>madrasah.cipondoh2425@gmail.com</a>
                </span>
              </p>
            </div>
            
            <div class="map-container">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15866.332704845705!2d106.66681746827743!3d-6.186496113232323!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f900a47ec923%3A0xa9b97d9f93033b16!2sMasjid%20Al%20Mubarokah%20Sipon%20(LDII)!5e0!3m2!1sid!2sid!4v1752637121750!5m2!1sid!2sid" 
                width="100%" 
                height="300" 
                style="border:0;" 
                allowfullscreen="" 
                loading="lazy"
                class="map-iframe"
                title="Peta Lokasi Madrasah Cipondoh">
              </iframe>
              <a href="https://maps.google.com/maps?q=Jl.+Irigasi+Sipon+RT.003/RW.008,+Cipondoh,+Kec.+Cipondoh,+Kota+Tangerang,+Banten+15146" 
                 class="map-link" 
                 target="_blank" 
                 rel="noopener noreferrer">
                Buka di Google Maps
              </a>
            </div>
          </div>
          
          <div class="location-image">
            <div class="image-frame">
              <img 
                src="/foto-lokasi.png" 
                alt="Foto Lokasi Madrasah Cipondoh">
            </div>
          </div>
        </div>
      </div>
    </transition>
  </section>


      <!-- Programs Section -->
      <section class="featured-programs">
        <transition name="fade-up" appear>
          <div>
            <h2><span class="title-icon">🌟</span> Program Unggulan Kami</h2>
            <div class="cards-container">
              <div 
                v-for="(program, index) in programs" 
                :key="program.id"
                class="program-card"
                :style="{ transitionDelay: `${index * 0.1}s` }"
                @mouseenter="hoverCard(index)"
                @mouseleave="unhoverCard(index)">
                <div class="card-icon">{{ program.icon }}</div>
                <h3>{{ program.title }}</h3>
                <p>{{ program.description }}</p>
                <div class="card-wave" :style="{ opacity: program.hover ? 1 : 0 }"></div>
              </div>
            </div>
          </div>
        </transition>
      </section>
      
      <!-- Gallery Section -->
      <section class="gallery-section">
        <h2><span class="title-icon">📷</span> Galeri</h2>
        <div class="gallery-container">
          <div 
            v-for="(image, index) in galleryImages" 
            :key="index"
            class="gallery-item"
            @click="openLightbox(index)"
            :style="{ backgroundImage: `url(${image.thumbnail})` }">
            <div class="gallery-overlay">
              <span class="zoom-icon">🔍</span>
            </div>
          </div>
        </div>
      </section>
    </main>
    
    <!-- Lightbox Modal -->
    <div class="lightbox" v-if="lightboxVisible" @click="closeLightbox">
      <div class="lightbox-content" @click.stop>
        <button class="lightbox-close" @click="closeLightbox">✕</button>
        <img :src="galleryImages[lightboxIndex].full" :alt="'Galeri ' + (lightboxIndex + 1)">
        <div class="lightbox-nav">
          <button @click.stop="prevImage">❮</button>
          <span>{{ lightboxIndex + 1 }} / {{ galleryImages.length }}</span>
          <button @click.stop="nextImage">❯</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const isLoggedIn = ref(false);
const userName = ref('');

// Floating elements animation
const floatingElementStyle = (i) => {
  const size = Math.random() * 20 + 10;
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDuration: `${Math.random() * 30 + 20}s`,
    animationDelay: `${Math.random() * 5}s`,
    opacity: Math.random() * 0.4 + 0.1,
  };
};

// Image hover animation
const imageRotation = ref(-2);
const imageScale = ref(1);
let hoverInterval;

const startImageHover = () => {
  let direction = 1;
  hoverInterval = setInterval(() => {
    imageRotation.value += direction * 0.2;
    if (imageRotation.value > 2 || imageRotation.value < -2) {
      direction *= -1;
    }
    imageScale.value = 1 + Math.sin(Date.now() / 300) * 0.02;
  }, 20);
};

const stopImageHover = () => {
  clearInterval(hoverInterval);
  imageRotation.value = -2;
  imageScale.value = 1;
};

// Program cards hover effect
const programs = ref([
  {
    id: 1,
    icon: '📖',
    title: 'Mengkaji Al-Qur\'an & Al-Hadist',
    description: 'Program intensif mengkaji Al-Qur\'an & Al-Hadist dengan metode Manqul oleh para Muballigh & Muballighot yang berpengalaman.',
    hover: false
  },
  {
    id: 2,
    icon: '📘',
    title: 'Hafalan Surat & Do\'a-do\'a Pilihan',
    description: 'Menghafalkan surat serta do\'a-do\'a yang sudah dipilih oleh para Muballigh & Muballighot untuk bekal kehidupan di masa mendatang',
    hover: false
  },
  {
    id: 3,
    icon: '⚽',
    title: 'Ekstrakurikuler',
    description: 'Beragam kegiatan seperti Memasak, Futsal, dan Badminton untuk mengembangkan bakat dan minat siswa.',
    hover: false
  }
]);

const hoverCard = (index) => {
  programs.value[index].hover = true;
};

const unhoverCard = (index) => {
  programs.value[index].hover = false;
};

// Stats data
const stats = ref([
  { id: 1, value: '5', label: 'Kelas' },
  { id: 2, value: '30+', label: 'Siswa' },
  { id: 3, value: '3', label: 'Pengajar' },
  { id: 4, value: '5+', label: 'Program' }
]);

// Gallery lightbox
const galleryImages = ref([
  { thumbnail: '/gallery1-thumb.jpg', full: '/gallery1-full.jpg' },
  { thumbnail: '/gallery2-thumb.jpg', full: '/gallery2-full.jpg' },
  { thumbnail: '/gallery3-thumb.jpg', full: '/gallery3-full.jpg' },
  { thumbnail: '/gallery4-thumb.jpg', full: '/gallery4-full.jpg' },
  { thumbnail: '/gallery5-thumb.JPG', full: '/gallery5-full.JPG' },
  { thumbnail: '/gallery6-thumb.JPG', full: '/gallery6-full.JPG' },
  { thumbnail: '/gallery7-thumb.JPG', full: '/gallery7-full.JPG' }
]);

const lightboxVisible = ref(false);
const lightboxIndex = ref(0);

const openLightbox = (index) => {
  lightboxIndex.value = index;
  lightboxVisible.value = true;
  document.body.style.overflow = 'hidden';
};

const closeLightbox = () => {
  lightboxVisible.value = false;
  document.body.style.overflow = '';
};

const nextImage = () => {
  lightboxIndex.value = (lightboxIndex.value + 1) % galleryImages.value.length;
};

const prevImage = () => {
  lightboxIndex.value = (lightboxIndex.value - 1 + galleryImages.value.length) % galleryImages.value.length;
};

// Scroll to content
const contentSection = ref(null);

const scrollToContent = () => {
  contentSection.value.scrollIntoView({ behavior: 'smooth' });
};

// On mounted
onMounted(() => {
  const token = localStorage.getItem('token');
  isLoggedIn.value = !!token; 

  if (isLoggedIn.value) {
    userName.value = localStorage.getItem('userName') || 'Pengguna';
  }

});
</script>

<style scoped>
/* Base Styles */
.page-container {
  max-width: 100%;
  margin: 0 auto;
  font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  overflow-x: hidden;
  position: relative;
  background-color: #ffffff;
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
  text-align: center;
  padding: 6rem 2rem 8rem;
  background: linear-gradient(135deg, #014283, #0277bd);
  color: #ffffff;
  position: relative;
  overflow: center;
  clip-path: ellipse(100% 100% at 50% 0%);
}

.header-content {
  position: relative;
  z-index: 3;
  max-width: 900px;
  margin: 0 auto;
  padding-top: 70px;
}

.page-header h1 {
  margin: 0;
  font-size: 3.2rem;
  font-weight: 700;
  line-height: 1.2;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.highlight {
  color: #ff9800;
}

.page-header .subtitle {
  font-size: 1.4rem;
  opacity: 0.9;
  margin-top: 1rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

/* Header Decoration */
.header-decoration {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
  opacity: 0.1;
}

.decoration-circle {
  position: absolute;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #ffffff 0%, transparent 70%);
  border-radius: 50%;
  top: -150px;
  right: -150px;
}

.decoration-star {
  position: absolute;
  font-size: 4rem;
  bottom: 40px;
  left: 40px;
  animation: twinkle 3s infinite alternate;
  color: #ff9800;
}

.islamic-pattern {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54 50.41a5.4 5.4 0 0 1-5.4 5.4H11.4a5.4 5.4 0 0 1-5.4-5.4V9.59A5.4 5.4 0 0 1 11.4 4.2h37.2a5.4 5.4 0 0 1 5.4 5.4v40.81z' fill='none' stroke='%23ffffff' stroke-width='1' opacity='0.2'/%3E%3C/svg%3E");
  opacity: 0.3;
}

.scroll-down {
  margin-top: 3rem;
  animation: bounce 2s infinite;
  cursor: pointer;
  display: inline-block;
}

.scroll-down span {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 0.5rem;
}

.scroll-down p {
  margin: 0;
  font-size: 1rem;
  opacity: 0.8;
}

/* Content Sections */
.content-section {
  padding: 4rem 2rem;
  position: relative;
  z-index: 2;
}

.content-section section {
  margin-bottom: 6rem;
  position: relative;
}

.section-decoration {
  position: absolute;
  right: 0;
  top: 0;
  opacity: 0.05;
  font-size: 12rem;
  z-index: -1;
  color: #014283;
}

h2 {
  font-size: 2.5rem;
  border-bottom: 3px solid #ff9800;
  padding-bottom: 1rem;
  margin-bottom: 3rem;
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  color: #014283;
  position: relative;
}

h2::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 100px;
  height: 3px;
  background-color: #014283;
}

.title-icon {
  font-size: 2rem;
}

/* School Profile */
.school-profile {
  text-align: center;
}

.school-profile p {
  line-height: 1.8;
  font-size: 1.2rem;
  max-width: 800px;
  margin: 0 auto 3rem;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.stat-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 2rem 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border-top: 4px solid #ff9800;
}

.stat-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #014283;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1.1rem;
  color: #333;
  opacity: 0.8;
}

/* Location Section */
.location-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.address-details {
  position: relative;
  background: #f9f9f9;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.floating-mosque-icon {
  position: absolute;
  font-size: 6rem;
  right: 2rem;
  top: -3rem;
  opacity: 0.1;
  z-index: 0;
  color: #014283;
}

.address-details h3 {
  margin-top: 0;
  font-size: 1.8rem;
  color: #014283;
  position: relative;
  z-index: 1;
}

.address-text {
  line-height: 1.8;
  font-size: 1.1rem;
  position: relative;
  z-index: 1;
  word-break: normal;
  overflow-wrap: break-word;
  hyphens: auto;
  text-align: left;
  margin-bottom: 1.5rem;
}

.contact-info {
  margin-top: 1.5rem;
  font-size: 1.1rem;
  position: relative;
  z-index: 1;
}

.contact-info p {
  margin: 1rem 0;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  line-height: 1.6;
}

.contact-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
  margin-top: 0.2rem;
}

.contact-link {
  color: #014283;
  text-decoration: none;
  transition: color 0.3s ease;
  word-break: break-all;
}

.contact-link:hover {
  color: #0277bd;
  text-decoration: underline;
}

.contact-detail {
  display: inline-block;
  word-break: break-word;
}

.map-container {
  margin-top: 2rem;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: relative;
}

.map-iframe {
  border: none;
  filter: grayscale(20%);
  transition: all 0.3s ease;
  min-height: 300px;
  width: 100%;
  display: block;
}

.map-link {
  display: block;
  margin-top: 1rem;
  padding: 0.8rem;
  background-color: #014283;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 1rem;
  transition: background-color 0.3s ease;
  text-align: center;
}

.map-link:hover {
  background-color: #0277bd;
}

.location-image {
  position: relative;
  perspective: 1000px;
}

.image-frame {
  border: 12px solid #ffffff;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  transition: transform 0.5s ease;
}

.image-frame img {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.5s ease;
}

/* Program Cards */
.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2.5rem;
  margin-top: 2rem;
}

.program-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 2.5rem 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  z-index: 1;
  border-left: 6px solid #ff9800;
}

.program-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(1, 66, 131, 0.05) 0%, rgba(255, 255, 255, 0) 100%);
  z-index: -1;
}

.program-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.program-card h3 {
  margin-top: 1.5rem;
  font-size: 1.5rem;
  color: #014283;
  position: relative;
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
  display: inline-block;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #014283, #0277bd);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.program-card:hover .card-icon {
  transform: scale(1.2) rotate(10deg);
}

.card-wave {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(90deg, #014283, #ff9800, #0277bd);
  transition: (all 0.3s ease);
}

/* Gallery Section */
.gallery-section {
  text-align: start;
}

.gallery-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.gallery-item {
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  background-size: cover;
  background-position: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.gallery-item:hover {
  transform: scale(1.03);
}

.gallery-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
}

.gallery-item:hover .gallery-overlay {
  opacity: 1;
}

.zoom-icon {
  font-size: 2rem;
  color: #ffffff;
  transform: scale(0.8);
  transition: all 0.3s ease;
}

.gallery-item:hover .zoom-icon {
  transform: scale(1);
}

/* Lightbox */
.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.lightbox-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
}

.lightbox-content img {
  max-width: 100%;
  max-height: 80vh;
  border-radius: 8px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.6);
}

.lightbox-close {
  position: absolute;
  top: -40px;
  right: 0;
  background: none;
  border: none;
  color: #ffffff;
  font-size: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.lightbox-close:hover {
  color: #ff9800;
}

.lightbox-nav {
  position: absolute;
  bottom: -50px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
}

.lightbox-nav button {
  background: none;
  border: none;
  color: #ffffff;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0.5rem 1rem;
}

.lightbox-nav button:hover {
  color: #ff9800;
  transform: scale(1.2);
}

.lightbox-nav span {
  color: #ffffff;
  font-size: 1.2rem;
}

/* Animations */
@keyframes twinkle {
  0% { opacity: 0.3; transform: scale(0.9); }
  100% { opacity: 0.8; transform: scale(1.1); }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-20px); }
  60% { transform: translateY(-10px); }
}

.fade-down-enter-active,
.fade-down-leave-active,
.fade-up-enter-active,
.fade-up-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-down-enter-from,
.fade-down-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .page-header h1 {
    font-size: 2.8rem;
  }
  
  .page-header .subtitle {
    font-size: 1.2rem;
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 4rem 1.5rem 6rem;
  }
  
  .page-header h1 {
    font-size: 2.2rem;
  }
  
  .page-header .subtitle {
    font-size: 1.1rem;
  }
  
  .location-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .address-details {
    padding: 1.5rem;
  }
  
  .floating-mosque-icon {
    font-size: 4rem;
    right: 1rem;
    top: -1.5rem;
  }
  
  .content-section {
    padding: 3rem 1.5rem;
  }
  
  h2 {
    font-size: 2rem;
  }
  
  .program-card {
    padding: 2rem 1.5rem;
  }

  .address-text {
    font-size: 1rem;
    line-height: 1.6;
    padding: 0 0.5rem;
  }
  
  .contact-info {
    font-size: 1rem;
  }
  
  .contact-info p {
    flex-wrap: wrap;
  }
  
  .map-iframe {
    min-height: 250px;
  }
  
  .map-link {
    padding: 0.8rem 0.5rem;
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: 3rem 1rem 5rem;
  }
  
  .page-header h1 {
    font-size: 1.8rem;
  }
  
  h2 {
    font-size: 1.6rem;
  }
  
  .title-icon {
    font-size: 1.5rem;
  }
  
  .stats-container {
    grid-template-columns: 1fr 1fr;
  }
  
  .address-details {
    padding: 1.5rem 1rem;
  }
  
  .address-text {
    font-size: 0.95rem;
    padding: 0;
  }
  
  .contact-info {
    font-size: 0.95rem;
  }
  
  .contact-link {
    word-break: break-word;
  }
  
  .map-iframe {
    min-height: 220px;
  }
  
  .map-link {
    font-size: 0.9rem;
    padding: 0.7rem 0.5rem;
  }
  
  .location-image {
    margin-top: 2rem;
  }
  
  .image-frame {
    border-width: 8px;
  }
}

@media (max-width: 360px) {
  .address-text {
    font-size: 0.9rem;
  }
  
  .contact-info {
    font-size: 0.9rem;
  }
  
  .map-iframe {
    min-height: 200px;
  }
  
  .map-link {
    font-size: 0.85rem;
  }
}
</style>