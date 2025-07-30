<template>
  <nav class="navbar-container" :class="{ 'scrolled': isScrolled }">
    <div class="navbar-content">
      <router-link to="/" class="navbar-logo">
        <img src="/logo-madrasah.png" alt="Logo Madrasah" class="logo-img" />
        <span class="logo-text">Madrasah<span class="logo-highlight">Cipondoh</span></span>
      </router-link>

      <div class="navbar-left">
        <ul class="navbar-links-desktop">
          <li v-if="isAdmin"><router-link to="/admin/dashboard" class="admin-link">Admin</router-link></li>
          <li><router-link to="/">Beranda</router-link></li>
          <li class="has-dropdown" ref="dropdownref" :class="{ 'dropdown-active': isDesktopDropdownOpen }">
            <a href="#" @click.prevent="toggleDesktopDropdown">
              Kelas <span class="arrow-desktop">▼</span>
            </a>
            <ul class="dropdown-menu">
              <li v-for="kelas in kelasList" :key="kelas.path">
                <a
                  href="#" 
                  @click.prevent="handleKelasClick(kelas)"
                  :class="{ 'active-submenu': $route.path.includes(`/kelas/${kelas.path}`)       
                   }"  @click="navigateAndClose(`/kelas/${kelas.path}`)"
                >
                  <i :class="kelas.icon"></i> {{ kelas.name }}
                  </a>
              </li>
            </ul>
          </li>
          <li><router-link to="/kepengurusan">Kepengurusan</router-link></li>
          <li><router-link to="/instrumen-pembelajaran">Instrumen</router-link></li>
        </ul>
      </div>

      <div class="navbar-right">
      
        
        <div v-if="isLoggedIn" class="user-profile-desktop">
          <div class="profile-dropdown">
            <router-link to="/profil" class="profile-link">
              <div class="profile-picture-container">
                <img :src="profilePictureUrl" alt="Foto Profil" class="profile-picture" />
                <span class="online-indicator" :class="{ 'online': isUserOnline }"></span>
              </div>
              <div class="profile-info">
                <span class="profile-name">{{ userName }}</span>
                <span class="profile-role">{{ userRoleDisplay }}</span>
              </div>
            </router-link>
            <div class="profile-dropdown-menu">
              <router-link to="/profil" class="dropdown-item">
                <i class="fas fa-user"></i> Profil Saya
              </router-link>
              <a href="#" @click.prevent="logout" class="dropdown-item logout-item">
                <i class="fas fa-sign-out-alt"></i> Logout
              </a>
            </div>
          </div>
        </div>
        <div v-else class="auth-links-desktop">
          <router-link to="/login" class="login-button">
            <i class="fas fa-sign-in-alt"></i> Masuk
          </router-link>
          <router-link to="/register" class="register-button">
            <i class="fas fa-user-plus"></i> Daftar
          </router-link>
        </div>

        <!-- Mobile -->
        <div v-if="isLoggedIn" class="user-profile-mobile">
          <router-link to="/profil">
            <div class="profile-picture-container">
              <img :src="profilePictureUrl" alt="Foto Profil" class="profile-picture-mobile" />
              <span class="online-indicator" :class="{ 'online': isUserOnline }"></span>
            </div>
          </router-link>
        </div>
        
        <button 
          @click="toggleMobileMenu" 
          class="hamburger-button" 
          :aria-label="hamburgerLabel" 
          :class="{ 'is-active': isMobileMenuOpen }"
        >
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </button>
      </div>
    </div>

    <div class="mobile-menu" :class="{ 'is-active': isMobileMenuOpen }" 
     :style="{ 
    top: isScrolled ? '70px' : '80px',
    height: `calc(100vh - ${isScrolled ? 70 : 80}px)` }">
    
      
      <ul class="mobile-links">
        <li><router-link to="/" @click="closeMobileMenu"><i class="fas fa-home"></i> Beranda</router-link></li>
        <li class="has-dropdown-mobile">
          <div @click.prevent="toggleKelasSubmenu" class="dropdown-trigger">
            <span><i class="fas fa-chalkboard-teacher"></i> Kelas</span>
            <span class="arrow" :class="{ open: isKelasSubmenuOpen }">▼</span>
          </div>
          <ul v-show="isKelasSubmenuOpen" class="submenu-mobile">
            <li v-for="kelas in kelasList" :key="kelas.path">
              <a 
                href="#" 
                @click.prevent="handleKelasClick(kelas)"
                :class="{ 'active-submenu': $route.path.includes(`/kelas/${kelas.path}`) }"
              >
                <i :class="kelas.icon"></i> {{ kelas.name }}
            </a>
            </li>
          </ul>
        </li>
        <li><router-link to="/kepengurusan" @click="closeMobileMenu"><i class="fas fa-users"></i> Kepengurusan</router-link></li>
        <li><router-link to="/instrumen-pembelajaran" @click="closeMobileMenu"><i class="fas fa-book"></i> Instrumen</router-link></li>
        <li v-if="isAdmin"><router-link to="/admin/dashboard" @click="closeMobileMenu"><i class="fas fa-tools"></i> Admin Panel</router-link></li>
        <li class="separator"></li>
        <li v-if="isLoggedIn"><router-link to="/profil" @click="closeMobileMenu"><i class="fas fa-user"></i> Profil Saya</router-link></li>
        <li v-if="isLoggedIn"><a href="#" @click.prevent="logoutAndCloseMenu"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
        <li v-else><router-link to="/login" @click="closeMobileMenu"><i class="fas fa-sign-in-alt"></i> Login</router-link></li>
        <li v-if="!isLoggedIn"><router-link to="/register" @click="closeMobileMenu"><i class="fas fa-user-plus"></i> Daftar</router-link></li>
      </ul>
      <div class="footer-mobile-dropdown">
      <p>© 2025 Madrasah Cipondoh. All Rights Reserved.</p>
      </div>
    </div>
    
  
  </nav>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, inject } from 'vue';
import { useRouter } from 'vue-router';



// Mobile menu logic
const isMobileMenuOpen = ref(false);
const hamburgerLabel = computed(() => isMobileMenuOpen.value ? 'Tutup menu' : 'Buka menu');
const isKelasSubmenuOpen = ref(false);
const isDesktopDropdownOpen = ref(false);
const dropdownRef = ref(null);
const isScrolled = ref(false);
const userKelas = ref(localStorage.getItem('userKelas'));
const showNotification = inject('showNotification');



// Kelas data
const kelasList = [
  { path: 'paud', name: 'Paud', icon: 'fas fa-baby' },
  { path: 'caberawit', name: 'Caberawit', icon: 'fas fa-child' },
  { path: 'pra-remaja', name: 'Pra Remaja', icon: 'fas fa-user-astronaut' },
  { path: 'remaja', name: 'Remaja', icon: 'fas fa-user-graduate' },
  { path: 'pra-nikah', name: 'Pra Nikah', icon: 'fas fa-heart' }
];

// User data
const userName = computed(() => localStorage.getItem('userName') || 'Profil');
const isUserOnline = ref(true); // In a real app, this would come from a presence system

const userRoleDisplay = computed(() => {
  const role = localStorage.getItem('userRole');
  switch(role) {
    case 'admin': return 'Administrator';
    case 'teacher': return 'Pengajar';
    case 'student': return 'Siswa';
    default: return 'Pengguna';
  }
});

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  if (isMobileMenuOpen.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
    
  }
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false;
  isKelasSubmenuOpen.value = false;
  document.body.style.overflow = '';
}

function toggleKelasSubmenu() {
  isKelasSubmenuOpen.value = !isKelasSubmenuOpen.value;
}

function toggleDesktopDropdown() { 
  isDesktopDropdownOpen.value = !isDesktopDropdownOpen.value;
}

function closeAllMenus() {
  isMobileMenuOpen.value = false;
  isKelasSubmenuOpen.value = false;
  isDesktopDropdownOpen.value = false;
  document.body.style.overflow = '';
}

function navigateAndClose(path) {
  router.push(path); 
  isDesktopDropdownOpen.value = false;
  ; 
}

function handleClickOutside(event) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isDesktopDropdownOpen.value = false;
  }
}


function handleScroll() {
  isScrolled.value = window.scrollY > 10;
}


function handleKelasClick(kelas) {
  // Jika user adalah admin ATAU kelas yang diklik sama dengan kelas user
  if (isAdmin.value || userKelas.value === kelas.path) {
    // Lanjutkan navigasi
    router.push(`/kelas/${kelas.path}`);
    closeMobileMenu();
  } else {
   showNotification('Anda tidak memiliki akses ke kelas ini.', 'error');
  }
}


// Auth logic
const router = useRouter();
const isLoggedIn = computed(() => !!localStorage.getItem('token'));
const isAdmin = computed(() => localStorage.getItem('userRole') === 'admin');

const profilePictureUrl = computed(() => {
  const filename = userProfilePic.value;
  if (filename && filename !== 'null' && filename !== 'undefined') {
    const baseURL = import.meta.env.VITE_API_BASE_URL;

    return `${baseURL}/uploads/profiles/${filename}`;
  }

  return '/default-profile.png'; 
});

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userProfilePicture');
  localStorage.removeItem('userName');
  router.push('/login').then(() => window.location.reload());
  userProfilePic.value = null;
}

function logoutAndCloseMenu() {
  logout();
  closeMobileMenu();
}

// Event listeners
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllMenus();
  });
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('scroll', handleScroll);
  document.body.style.overflow = '';
});

watch(isMobileMenuOpen, (newValue) => {
  if (!newValue) { 
    isKelasSubmenuOpen.value = false;
  }
});
</script>

<style scoped>
/* ===== BASE STYLES ===== */
.navbar-container {
  background: linear-gradient(135deg, #01264a, #1c5b85);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 80px;
  display: flex;
  justify-content: center;
  transition: all 0.3s ease;
}

.navbar-container.scrolled {
  height: 70px;
  background: rgba(1, 38, 74, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.2);
}

.navbar-content {
  width: 100%;
  max-width: 1400px;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

/* ===== LOGO ===== */
.navbar-logo {
  display: flex;
  align-items: center;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  text-decoration: none;
  gap: 12px;
}

.navbar-logo:hover {
  transform: scale(1.03);
}

.logo-img {
  height: 50px;
  transition: height 0.3s ease;
}

.logo-text {
  font-family: 'Poppins', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  letter-spacing: 0.5px;
}

.logo-highlight {
  color: #f39c12;
}

.navbar-container.scrolled .logo-img {
  height: 45px;
}

/* ===== NAVIGATION LINKS ===== */
.navbar-left {
  display: flex;
  align-items: center;
  height: 100%;
}

.navbar-links-desktop {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 0.5rem;
  height: 100%;
}

.navbar-links-desktop li {
  height: 100%;
  display: flex;
  align-items: center;
  position: relative;
}

.navbar-links-desktop li a {
  display: flex;
  align-items: center;
  padding: 0 1.25rem;
  color: white;
  text-decoration: none;
  font-weight: 500;
  height: 100%;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  font-size: 0.95rem;
  gap: 8px;
}

.navbar-links-desktop li a i {
  font-size: 0.9em;
  opacity: 0.7;
}

.navbar-links-desktop li a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 3px;
  background-color: #f39c12;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border-radius: 3px 3px 0 0;
}

.navbar-links-desktop li a:hover::after,
.navbar-links-desktop li .router-link-active::after {
  width: 80%;
}

.navbar-links-desktop li a:hover,
.navbar-links-desktop li .router-link-active {
  background-color: rgba(255, 255, 255, 0.08);
}

.navbar-links-desktop li a:hover i,
.navbar-links-desktop li .router-link-active i {
  opacity: 1;
}

.admin-link {
  color: #f1c40f !important;
  font-weight: 600 !important;
}

.admin-link::after {
  background-color: #f1c40f !important;
}


.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translate(-50%, -10px);
}

/* ===== NAVBAR RIGHT CONTAINER ===== */
.navbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* ===== DROPDOWN MENU ===== */
.has-dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: linear-gradient(to bottom, #1c5b85, #01264a);
  list-style: none;
  padding: 0.5rem 0;
  margin: 0;
  min-width: 220px;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  z-index: 100;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border-top: 2px solid #f39c12;
}

.has-dropdown:hover .dropdown-menu,
.has-dropdown.dropdown-active .dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-menu li a {
  padding: 0.75rem 1.5rem;
  white-space: nowrap;
  color: white;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  display: flex;
  align-items: center;
  gap: 10px;
}

.dropdown-menu li a i {
  width: 18px;
  text-align: center;
  font-size: 0.9em;
}

.dropdown-menu li a:hover {
  background-color: rgba(52, 152, 219, 0.3);
  padding-left: 1.75rem;
}

.active-submenu {
  background-color: rgba(243, 156, 18, 0.2) !important;
  border-left: 3px solid #f39c12;
}

.arrow-desktop {
  font-size: 0.7em;
  margin-left: 0.25rem;
  display: inline-block;
  transition: transform 0.3s ease;
}

.has-dropdown.dropdown-active .arrow-desktop {
  transform: rotate(180deg);
}

.footer-mobile-dropdown{
   border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  padding: 1.5rem 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  position: relative;
}

/* ===== USER PROFILE ===== */
.user-profile-desktop {
  height: 100%;
  display: flex;
  align-items: center;
  position: relative;
}

.profile-dropdown {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
}

.profile-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  height: 100%;
  padding: 0 1rem;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.profile-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.profile-picture-container {
  position: relative;
}

.profile-picture {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid rgba(243, 156, 18, 0.5);
  object-fit: cover;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.online-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  background-color: #95a5a6;
  border-radius: 50%;
  border: 2px solid #01264a;
  transition: all 0.3s ease;
}

.online-indicator.online {
  background-color: #2ecc71;
}

.profile-link:hover .profile-picture {
  border-color: #f39c12;
  transform: scale(1.05);
}

.profile-info {
  display: flex;
  flex-direction: column;
}

.profile-name {
  color: white;
  font-weight: 500;
  font-size: 0.95rem;
  line-height: 1.2;
}

.profile-role {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.75rem;
  font-weight: 400;
}

.profile-dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #1c5b85;
  min-width: 220px;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  z-index: 100;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid rgba(52, 152, 219, 0.5);
  padding: 0.5rem 0;
}

.profile-dropdown:hover .profile-dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  color: white;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  gap: 10px;
  font-size: 0.9rem;
}

.dropdown-item i {
  width: 18px;
  text-align: center;
  font-size: 0.9em;
}

.dropdown-item:hover {
  background-color: rgba(52, 152, 219, 0.3);
  padding-left: 1.75rem;
}

.logout-item {
  color: #e74c3c !important;
}

.logout-item:hover {
  background-color: rgba(231, 76, 60, 0.1) !important;
}

/* ===== AUTH BUTTONS ===== */
.auth-links-desktop {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.login-button,
.register-button {
  padding: 0.5rem 1.25rem;
  border-radius: 6px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
}

.login-button {
  background-color: transparent;
  color: #f39c12;
  border: 1px solid #f39c12;
}

.login-button:hover {
  background-color: rgba(243, 156, 18, 0.1);
  border-color: #f1c40f;
  transform: translateY(-2px);
}

.register-button {
  background-color: #f39c12;
  color: #2c3e50;
}

.register-button:hover {
  background-color: #e67e22;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(243, 156, 18, 0.3);
}

/* ===== HAMBURGER BUTTON ===== */
.hamburger-button {
  display: none;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 1001;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
}

.hamburger-button .bar {
  display: block;
  width: 25px;
  height: 3px;
  margin: 5px auto;
  background-color: #f39c12;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border-radius: 3px;
}

.hamburger-button.is-active .bar:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
  background-color: #e74c3c;
}

.hamburger-button.is-active .bar:nth-child(2) {
  opacity: 0;
}

.hamburger-button.is-active .bar:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
  background-color: #e74c3c;
}

/* ===== MOBILE MENU ===== */
.mobile-menu {
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, #01264a, #1c5b85);
  z-index: 9990;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  transform: translateX(100%);
  overflow-y: auto;
  padding-bottom: 2rem;
  display: flex;
  flex-direction: column;
}

.navbar-container.scrolled .mobile-menu {
  top: 70px;
}

.mobile-menu.is-active {
  transform: translateX(0);
}
.mobile-links {
  list-style: none;
  margin: 1rem 0 0;
  padding: 0;
  flex: 1;
}

.mobile-links li {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-links li a {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  color: white;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  gap: 12px;
}

.mobile-links li a i {
  width: 20px;
  text-align: center;
  font-size: 1.1em;
}

.mobile-links li a:hover {
  background-color: rgba(52, 152, 219, 0.2);
  color: #f39c12;
  padding-left: 2rem;
}

.user-profile-mobile {
  display: none;
  margin-right: 1rem;
}

.profile-picture-mobile {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid rgba(243, 156, 18, 0.5);
  object-fit: cover;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.profile-picture-mobile:hover {
  border-color: #f39c12;
  transform: scale(1.05);
}

/* Submenu Kelas di Mobile */
.dropdown-trigger {
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  color: white;
  font-weight: 500;
  gap: 12px;
}

.dropdown-trigger i {
  width: 20px;
  text-align: center;
  font-size: 1.1em;
}

.dropdown-trigger .arrow {
  transition: transform 0.3s ease;
  font-size: 0.7em;
}

.dropdown-trigger .arrow.open {
  transform: rotate(180deg);
}



.submenu-mobile {
  list-style: none;
  padding: 0;
  background-color: rgba(0, 0, 0, 0.15);
}

.submenu-mobile li a {
  padding-left: 3.5rem;
}

.submenu-mobile li a i {
  font-size: 0.9em;
}

.separator {
  height: 1px;
  background-color: rgba(255, 255, 255, 0.2);
  margin: 0.5rem 0;
}



/* ===== RESPONSIVE ===== */
@media (max-width: 1024px) {
  .navbar-content {
    padding: 0 1.5rem;
  }
  
  .navbar-links-desktop li a {
    padding: 0 1rem;
  }
  
  .profile-name {
    display: none;
  }
  
  .profile-link {
    padding: 0 0.5rem;
  }
}

@media (max-width: 900px) {
  .navbar-content {
    padding: 0 1rem;
  }
  
  .hamburger-button {
    display: block;
  }

  .navbar-links-desktop,
  .user-profile-desktop,
  .auth-links-desktop,
  .search-container {
    display: none;
  }

  .user-profile-mobile {
    display: block;
    order: 1;
  }

  .hamburger-button {
    display: block;
    order: 2;
    position: relative;
    right: auto;
  }
  
  .navbar-right {
    margin-left: auto;
    padding-right: 10px;
  }
  
  .logo-img {
    height: 45px;
  }
  
  .logo-text {
    display: none;
  }
  
  .mobile-search {
    display: flex;
  }
}

@media (max-width: 480px) {
  .navbar-container {
    height: 70px;
   
  }
  
  .logo-img {
    height: 40px;
  }
  
  .mobile-menu {
    top: 70px;
  }
}
</style>