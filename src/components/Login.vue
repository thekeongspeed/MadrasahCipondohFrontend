<template>
  <div class="auth-container" :style="backgroundStyle">
    <div class="auth-overlay"></div>
    
    <div class="auth-content">
      <transition name="bounce" appear>
         <router-link to="/">
            <img src="/logo-madrasah.png" alt="Logo Madrasah" class="login-logo" />
          </router-link>
      </transition>
      
      <transition name="slide-fade" appear>
        <div class="auth-card">
          <h2>Selamat Datang</h2>
          <p class="auth-subtitle">Silakan masuk untuk melanjutkan</p>
          
          <form @submit.prevent="handleLogin">
            <div class="input-group" :class="{ 'input-error': error }">
              <label for="username">Username</label>
              <div class="input-wrapper">
                <input 
                  id="username" 
                  v-model="username" 
                  type="text" 
                  placeholder="Masukkan username" 
                  required 
                  @focus="resetError"
                />
                <span class="input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                  </svg>
                </span>
              </div>
            </div>
            
            <div class="input-group" :class="{ 'input-error': error }">
              <label for="password">Password</label>
              <div class="input-wrapper">
                <input 
                  id="password" 
                  v-model="password" 
                  :type="showPassword ? 'text' : 'password'" 
                  placeholder="Masukkan password" 
                  required 
                  @focus="resetError"
                />
                <span class="input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                  </svg>
                </span>
                <span class="password-toggle" @click="togglePasswordVisibility">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                  </svg>
                </span>
              </div>
            </div>
            
            <div class="auth-options">
              <label class="remember-me">
                <input type="checkbox" v-model="rememberMe" />
                <span>Ingat saya</span>
              </label>
            </div>
            
            <transition name="fade">
              <p v-if="error" class="error-message">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                </svg>
                {{ error }}
              </p>
            </transition>
            
            <button type="submit" :disabled="isLoading" class="auth-button">
              <span v-if="!isLoading">Login</span>
              <span v-else class="loading-spinner"></span>
            </button>
          </form>
          
        
          
          <p class="redirect-link">
            Belum punya akun? <router-link to="/register">Daftar di sini</router-link>
          </p>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';


const username = ref('');
const password = ref('');
const error = ref('');
const showPassword = ref(false);
const rememberMe = ref(false);
const isLoading = ref(false);
const router = useRouter();

// Dynamic background colors
const backgroundColors = ['#4a6fa5', '#3a5a8a', '#5a7ab5'];
const currentColorIndex = ref(0);

const backgroundStyle = computed(() => {
  return {
    background: `linear-gradient(135deg, ${backgroundColors[currentColorIndex.value]} 0%, #2c3e50 100%)`
  };
});

// Rotate background colors every 10 seconds
setInterval(() => {
  currentColorIndex.value = (currentColorIndex.value + 1) % backgroundColors.length;
}, 10000);

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value;
}

function resetError() {
  error.value = '';
}

async function handleLogin() {
  
  error.value = '';
  isLoading.value = true;
  
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/login`, {
      username: username.value,
      password: password.value,
      remember:rememberMe.value
    });

    // Ambil token dan user langsung dari respons
    const { token, user } = response.data; 
   
  

    // Simpan semua data dari server ke localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('userId', user.id);
    localStorage.setItem('userRole', user.role);
    localStorage.setItem('userFullName', user.fullName);
    localStorage.setItem('userKelas', user.kelas);
    localStorage.setItem('userProfilePicture', user.profilePicture);
    localStorage.setItem('userParentName', user.parentName); 

    // Arahkan ke halaman utama
   router.push('/');

  } catch (err) {
    error.value = err.response?.data?.message || 'Username atau password salah.';
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
/* Base styles */
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  transition: background 1s ease;
  position: relative;
  overflow: hidden;
  padding-top: 70px;
}

.auth-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 0;
}

.auth-content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1200px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login-logo {
  width: 180px;
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  height: auto;
  transition: all 0.3s ease-in-out;
  display: block;
}

.login-logo:hover {
  transform: scale(1.1);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
}

.auth-card {
  padding: 2.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 420px;
  transition: all 0.3s ease;
}

.auth-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}

h2 {
  text-align: center;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-size: 1.8rem;
  font-weight: 700;
}

.auth-subtitle {
  text-align: center;
  color: #7f8c8d;
  margin-bottom: 2rem;
  font-size: 0.95rem;
}

.input-group {
  margin-bottom: 1.25rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #34495e;
  font-size: 0.9rem;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #7f8c8d;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #7f8c8d;
  cursor: pointer;
}

input {
  width: 100%;
  padding: 0.85rem 1rem 0.85rem 2.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-sizing: border-box;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

input:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
  outline: none;
}

.input-error input {
  border-color: #e74c3c;
}

.input-error input:focus {
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.2);
}

.auth-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0;
  font-size: 0.85rem;
}

.remember-me {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.remember-me input {
  width: auto;
  margin-right: 0.5rem;
}


.error-message {
  color: #e74c3c;
  text-align: center;
  margin: 1rem 0;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: rgba(231, 76, 60, 0.1);
  border-radius: 6px;
}

.auth-button {
  width: 100%;
  padding: 1rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 48px;
}

.auth-button:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
}

.auth-button:active {
  transform: translateY(0);
}

.auth-button:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.auth-divider {
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  color: #95a5a6;
  font-size: 0.8rem;
}

.auth-divider::before,
.auth-divider::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid #ecf0f1;
}

.auth-divider::before {
  margin-right: 1rem;
}

.auth-divider::after {
  margin-left: 1rem;
}


.redirect-link {
  text-align: center;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.redirect-link a {
  color: #3498db;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.redirect-link a:hover {
  color: #2980b9;
  text-decoration: underline;
}

/* Animations */
.bounce-enter-active {
  animation: bounce-in 0.8s;
}

@keyframes bounce-in {
  0% {
    transform: scale(0.9);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.slide-fade-enter-active {
  transition: all 0.5s ease-out;
}

.slide-fade-enter-from {
  transform: translateY(20px);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .auth-content {
    padding: 1rem;
  }
  
  .auth-card {
    padding: 1.5rem;
  }
  
  .social-login {
    flex-direction: column;
  }
}
</style>