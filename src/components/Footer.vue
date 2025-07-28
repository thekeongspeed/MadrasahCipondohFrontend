<template>
  <footer class="footer-container">
    <div class="wave-shape"></div>
    
    <div class="footer-content">
      <!-- Section About -->
      <div class="footer-section about">
        <div class="logo-container">
          <img :src="logoUrl" alt="Madrasah Cipondoh Logo" class="logo">
          <h4 class="footer-title">{{ institutionName }}</h4>
        </div>
        <p class="tagline">{{ tagline }}</p>
        </div>

      <!-- Quick Links -->
      <div class="footer-section links">
        <h4 class="footer-title">Tautan Cepat</h4>
        <ul>
          <li v-for="link in quickLinks" :key="link.text">
            <router-link :to="link.path">{{ link.text }}</router-link>
          </li>
        </ul>
      </div>

      <!-- Contact Info -->
      <div class="footer-section contact">
        <h4 class="footer-title">Hubungi Kami</h4>
        <div class="contact-item" v-for="item in contactInfo" :key="item.text">
          <i :class="item.icon"></i>
          <p>{{ item.text }}</p>
        </div>
        <button class="contact-button" @click="openWhatsApp">
          <i class="fab fa-whatsapp"></i> Chat via WhatsApp
        </button>
      </div>

    </div>

    <div class="footer-bottom">
      <p>&copy; {{ currentYear }} {{ institutionName }}. All Rights Reserved.</p>
      <div class="back-to-top" @click="scrollToTop" v-show="showBackToTop">
        <i class="fas fa-arrow-up"></i>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// Data dinamis
const institutionName = "Madrasah Cipondoh";
const tagline = "Mencetak Generasi Penerus dengan 29 Karakter dalam Jama'ah";
const logoUrl = "/logo-madrasah.png"; // Ganti dengan path logo Anda


const quickLinks = ref([
  { text: "Beranda", path: "/" },
  { text: "Kepengurusan", path: "/kepengurusan" },
  { text: "Instrumen Pembelajaran", path: "/instrumen-pembelajaran" },
  { text: "Profil Saya", path: "/profil" },
]);

const contactInfo = ref([
  { icon: "fas fa-map-marker-alt", text: "Jl. Irigasi Sipon RT.003/RW.008, Cipondoh, Kec. Cipondoh Kota Tangerang, Banten" },
  { icon: "fas fa-envelope", text: "madrasah.cipondoh2425@gmail.com" },
  { icon: "fas fa-phone-alt", text: "+62 838-7362-4774" }
]);

const email = ref("");
const showBackToTop = ref(false);
const currentYear = new Date().getFullYear();

// Methods
const openWhatsApp = () => {
  window.open(`https://wa.me/6283873624774?text=Halo%20${institutionName}%2C%20saya%20ingin%20bertanya...`, '_blank');
};

const subscribeNewsletter = () => {
  alert(`Terima kasih telah berlangganan dengan email: ${email.value}`);
  email.value = "";
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
};

const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300;
};

// Lifecycle hooks
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

.footer-container {
  background: linear-gradient(135deg, #01264a 0%, #001a33 100%);
  color: #f0f0f0;
  padding: 5rem 2rem 0;
  font-family: 'Poppins', sans-serif;
  position: relative;
  overflow: hidden;
}

.wave-shape {
  position: absolute;
  top: -50px;
  left: 0;
  width: 100%;
  height: 50px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23ffffff' fill-opacity='1' d='M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E") no-repeat;
  background-size: cover;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 3rem;
}

.footer-section {
  padding: 1rem;
  transition: transform 0.3s ease;
}

.footer-section:hover {
  transform: translateY(-5px);
}

.footer-title {
  font-size: 1.3rem;
  color: white;
  margin-bottom: 1.5rem;
  position: relative;
  font-weight: 600;
  
}

.footer-title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -8px;
  width: 50px;
  height: 3px;
  background: linear-gradient(90deg, #3498db, #2ecc71);
  border-radius: 3px;
}

/* About Section */
.about .logo-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.about .logo {
  width: 50px;
  height: auto;
}

.tagline {
  font-size: 0.95rem;
  line-height: 1.7;
  margin-bottom: 1.5rem;
}


/* Links Section */
.links ul {
  list-style: none;
  padding: 0;
}

.links li {
  margin-bottom: 0.8rem;
}

.links a {
  color: #ccc;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-block;
  position: relative;
}

.links a::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -3px;
  left: 0;
  background-color: #2ecc71;
  transition: width 0.3s ease;
}

.links a:hover {
  color: white;
  padding-left: 8px;
}

.links a:hover::after {
  width: 100%;
}

/* Contact Section */
.contact-item {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.2rem;
  align-items: flex-start;
}

.contact-item i {
  color: #3498db;
  margin-top: 3px;
  font-size: 1.1rem;
}

.contact-item p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
}

.contact-button {
  background: #25D366;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 30px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-top: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);
}

.contact-button:hover {
  background: #128C7E;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4);
}

/* Newsletter Section */
.newsletter p {
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.newsletter-form {
  display: flex;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 30px;
  overflow: hidden;
}

.newsletter-form input {
  flex: 1;
  padding: 0.8rem 1.2rem;
  border: none;
  background: transparent;
  color: white;
  outline: none;
}

.newsletter-form input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.newsletter-form button {
  background: #3498db;
  color: white;
  border: none;
  padding: 0 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.newsletter-form button:hover {
  background: #2980b9;
}

/* Footer Bottom */
.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  padding: 1.5rem 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  position: relative;
}

.back-to-top {
  position: absolute;
  right: 30px;
  bottom: 20px;
  width: 40px;
  height: 40px;
  background: #3498db;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.back-to-top:hover {
  background: #2980b9;
  transform: translateY(-3px);
}

/* Responsive */
@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .footer-section {
    text-align: center;
  }
  
  .footer-title::after {
    left: 50%;
    transform: translateX(-50%);
  }
  
  .social-links {
    justify-content: center;
  }
  
   .about .logo-container {
    justify-content: center;
  }

  .back-to-top {
    right: 15px;
    bottom: 15px;
    width: 35px;
    height: 35px;
  }

  .footer-section.contact {
    text-align: left; 
  }
  
  .footer-section.contact .footer-title {
    text-align: center;
  }

  .footer-section.contact .footer-title::after {
    left: 50%;
    transform: translateX(-50%);
  }

}
</style>