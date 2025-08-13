<template>
  <div class="auth-container" :style="backgroundStyle">
    <div class="auth-overlay"></div>
    
    <div class="auth-content">
      <transition name="bounce" appear>
        <div class="logo-container">
           <router-link to="/">
            <img src="/logo-madrasah.png" alt="Logo Madrasah" class="login-logo" />
          </router-link>
          <h1 class="institution-name">Madrasah Cipondoh</h1>
        </div>
      </transition>
      
      <transition name="slide-fade" appear>
        <div class="auth-card">
          <h2>Buat Akun Baru</h2>
          <p class="auth-subtitle">Amal Sholih Di isi dengan benar dan lengkap</p>
          
          <form @submit.prevent="handleRegister" class="registration-form">
            <div class="profile-picture-edit">
              <div class="profile-picture-wrapper">
                <img 
                  :src="imagePreview || '/default-profile.png'" 
                  alt="Preview Foto Profil" 
                  class="profile-picture-preview"
                  :class="{ 'has-image': imagePreview }"
                />
                <div class="upload-overlay">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                    <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
                  </svg>
                </div>
                <input 
                  id="file-upload" 
                  type="file" 
                  @change="handleFileChange" 
                  accept="image/*" 
                  class="file-input"
                />
              </div>
              <label for="file-upload" class="file-upload-label">
                {{ imagePreview ? 'Ganti Foto' : 'Pilih Foto Profil' }}
              </label>
            </div>

            <div class="form-grid">
              <div class="input-group" :class="{ 'input-error': fieldErrors.fullName }">
                <label for="fullName">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                  </svg>
                  Nama Lengkap
                </label>
                <input 
                  id="fullName" 
                  v-model="formData.fullName" 
                  type="text" 
                  placeholder="Masukkan nama lengkap"
                  @input="validateField('fullName')"
                  required 
                />
                <span class="error-text" v-if="fieldErrors.fullName">{{ fieldErrors.fullName }}</span>
              </div>

              <div class="input-group" :class="{ 'input-error': fieldErrors.username }">
                <label for="username">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                  </svg>
                  Username
                </label>
                <input 
                  id="username" 
                  v-model="formData.username" 
                  type="text" 
                  placeholder="Buat username unik"
                  @input="validateField('username')"
                  required 
                />
                <span class="error-text" v-if="fieldErrors.username">{{ fieldErrors.username }}</span>
              </div>

              <div class="input-group" :class="{ 'input-error': fieldErrors.email }">
                <label for="email">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z"/>
                  </svg>
                  Email
                </label>
                <input 
                  id="email" 
                  v-model="formData.email" 
                  type="email" 
                  placeholder="contoh@email.com"
                  @input="validateField('email')"
                  required 
                />
                <span class="error-text" v-if="fieldErrors.email">{{ fieldErrors.email }}</span>
              </div>

              <div class="input-group" :class="{ 'input-error': fieldErrors.password }">
                <label for="password">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                  </svg>
                  Password
                </label>
                <div class="password-input-wrapper">
                  <input 
                    id="password" 
                    v-model="formData.password" 
                    :type="showPassword ? 'text' : 'password'" 
                    placeholder="Buat password kuat"
                    @input="validatePassword"
                    required 
                  />
                  <span class="password-toggle" @click="togglePasswordVisibility">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                    </svg>
                  </span>
                </div>
                <div class="password-strength" :class="passwordStrengthClass">
                  Kekuatan password: {{ passwordStrengthText }}
                </div>
                <span class="error-text" v-if="fieldErrors.password">{{ fieldErrors.password }}</span>
              </div>

              <div class="input-group">
                <label for="phone">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h6zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H5z"/>
                    <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                  </svg>
                  Nomor Telepon
                </label>
                <input 
                  id="phone" 
                  v-model="formData.phone" 
                  type="tel" 
                  placeholder="0812-3456-7890"
                />
              </div>

              <div class="input-group">
                <label for="dateOfBirth">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                  </svg>
                  Tanggal Lahir
                </label>
                <input 
                  id="dateOfBirth" 
                  v-model="formData.dateOfBirth" 
                  type="date" 
                />
              </div>

              <div class="input-group">
                <label for="parentName">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                  </svg>
                  Nama Orang Tua/Wali
                </label>
                <input 
                  id="parentName" 
                  v-model="formData.parentName" 
                  type="text" 
                  placeholder="Nama lengkap orang tua/wali"
                />
              </div>

              <div class="input-group full-width">
                <label for="address">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                  </svg>
                  Alamat Lengkap
                </label>
                <textarea 
                  id="address" 
                  v-model="formData.address" 
                  rows="3" 
                  placeholder="Masukkan alamat lengkap"
                ></textarea>
              </div>
            </div>
            

            <transition name="fade">
              <div v-if="message" :class="['message-box', isSuccess ? 'success' : 'error']">
                <svg v-if="isSuccess" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                </svg>
                {{ message }}
              </div>
            </transition>
            
            <button type="submit" :disabled="isLoading" class="auth-button">
              <span v-if="!isLoading">Daftar Sekarang</span>
              <span v-else class="loading-spinner"></span>
            </button>
          </form>
          
          <p class="redirect-link">
            Sudah punya akun? <router-link to="/login" class="login-link">Login di sini</router-link>
          </p>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

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

const formData = reactive({ 
  fullName: '',  
  username: '', 
  password: '', 
  email: '', 
  phone: '',
  dateOfBirth: '', 
  parentName: '', 
  address: ''
});

const fieldErrors = reactive({
  fullName: '',
  username: '',
  email: '',
  password: ''
});

const selectedFile = ref(null);
const imagePreview = ref(null);
const showPassword = ref(false);
const message = ref('');
const isSuccess = ref(false);
const isLoading = ref(false);
const router = useRouter();

const passwordStrength = computed(() => {
  if (!formData.password) return 0;
  
  let strength = 0;
  
  // Length check
  if (formData.password.length >= 8) strength += 1;
  if (formData.password.length >= 12) strength += 1;
  
  // Character type checks
  if (/[A-Z]/.test(formData.password)) strength += 1;
  if (/[a-z]/.test(formData.password)) strength += 1;
  if (/\d/.test(formData.password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(formData.password)) strength += 1;
  
  return Math.min(strength, 5); // Cap at 5
});

const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value;
  if (strength <= 1) return 'Sangat Lemah';
  if (strength === 2) return 'Lemah';
  if (strength === 3) return 'Sedang';
  if (strength === 4) return 'Kuat';
  return 'Sangat Kuat';
});

const passwordStrengthClass = computed(() => {
  const strength = passwordStrength.value;
  if (strength <= 1) return 'very-weak';
  if (strength === 2) return 'weak';
  if (strength === 3) return 'medium';
  if (strength === 4) return 'strong';
  return 'very-strong';
});

function handleFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    // Validate file type
    if (!file.type.match('image.*')) {
      message.value = 'Hanya file gambar yang diperbolehkan';
      isSuccess.value = false;
      return;
    }
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      message.value = 'Ukuran file maksimal 2MB';
      isSuccess.value = false;
      return;
    }
    
    selectedFile.value = file;
    imagePreview.value = URL.createObjectURL(file);
    message.value = '';
  }
}

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value;
}

function validateField(fieldName) {
  if (fieldErrors[fieldName]) {
    fieldErrors[fieldName] = '';
  }
  
  // Basic validation for each field
  switch (fieldName) {
    case 'fullName':
      if (formData.fullName.length < 3) {
        fieldErrors.fullName = 'Nama minimal 3 karakter';
      }
      break;
    case 'username':
      if (formData.username.length < 4) {
        fieldErrors.username = 'Username minimal 4 karakter';
      } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
        fieldErrors.username = 'Hanya boleh huruf, angka, dan underscore';
      }
      break;
    case 'email':
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        fieldErrors.email = 'Email tidak valid';
      }
      break;
  }
}

function validatePassword() {
  fieldErrors.password = '';
  
  if (formData.password.length < 8) {
    fieldErrors.password = 'Password minimal 8 karakter';
  }
}

async function handleRegister() {
  // Validate all fields before submission
  validateField('fullName');
  validateField('username');
  validateField('email');
  validatePassword();
  
  // Check if there are any errors
  if (Object.values(fieldErrors).some(error => error)) {
    message.value = 'Harap perbaiki kesalahan pada form';
    isSuccess.value = false;
    return;
  }
  
  message.value = '';
  isSuccess.value = false;
  isLoading.value = true;

  const dataToSubmit = new FormData();
  
  // Add form data
  for (const key in formData) {
    if (formData[key]) {
      dataToSubmit.append(key, formData[key]);
    }
  }
  
  // Add profile image if selected
  if (selectedFile.value) {
    dataToSubmit.append('profileImage', selectedFile.value);
  }

  try {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/register`, dataToSubmit, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    message.value = response.data.message || 'Pendaftaran berhasil!';
    isSuccess.value = true;
    
    // Reset form on success
    if (isSuccess.value) {
      setTimeout(() => {
        Object.keys(formData).forEach(key => formData[key] = '');
        selectedFile.value = null;
        imagePreview.value = null;
        router.push('/login');
      }, 2000);
    }
  } catch (err) {
    const errorMessage = err.response?.data?.message;
    
    if (errorMessage) {
      // Handle specific field errors from server
      if (typeof errorMessage === 'object') {
        Object.keys(errorMessage).forEach(key => {
          if (fieldErrors[key] !== undefined) {
            fieldErrors[key] = errorMessage[key][0];
          }
        });
        message.value = 'Harap perbaiki kesalahan pada form';
      } else {
        message.value = errorMessage;
      }
    } else {
      message.value = 'Gagal mendaftar, terjadi kesalahan. Silakan coba lagi.';
    }
    
    isSuccess.value = false;
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

.logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
}

.institution-name {
  color: white;
  margin-top: 0.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.login-logo {
  width: 120px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  height:auto;
  transition: all 0.3s ease-in-out;
  display: block;
  margin: 0;
}

.login-logo:hover {
  transform: scale(1.1); 
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
}

.auth-card {
  padding: 2.5rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 800px;
  transition: all 0.3s ease;
}

.auth-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
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
  font-size: 1rem;
}

/* Profile picture styles */
.profile-picture-edit {
  text-align: center;
  margin-bottom: 2rem;
   display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-picture-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.profile-picture-wrapper:hover {
  transform: scale(1.05);
}

.profile-picture-preview {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #b1b1b1;
  transition: all 0.3s ease;
  display: block;
}

.profile-picture-preview.has-image {
  border-color: #4dabf7;
}

.upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.profile-picture-wrapper:hover .upload-overlay {
  opacity: 1;
}

.upload-overlay svg {
  color: white;
  width: 32px;
  height: 32px;
}

.file-input {
  display: none;
}

.file-upload-label {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #4dabf7;
  color: white;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(77, 171, 247, 0.3);
}

.file-upload-label:hover {
  background-color: #339af0;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(77, 171, 247, 0.4);
}

/* Form grid layout */
.registration-form {
  display: flex;
  flex-direction: column;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.full-width {
  grid-column: 1 / -1;
}

/* Input group styles */
.input-group {
  margin-bottom: 0;
  display: flex;
  flex-direction: column;
  min-height: 100px;
}

.input-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #495057;
  font-size: 0.9rem;
}

.input-group label svg {
  flex-shrink: 0;
}

.input-group input,
.input-group textarea {
  width: 100%;
  padding: 0.85rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #f8f9fa;
  box-sizing: border-box;
}

.input-group input:focus,
.input-group textarea:focus {
  border-color: #4dabf7;
  background-color: white;
  box-shadow: 0 0 0 4px rgba(77, 171, 247, 0.2);
  outline: none;
}

.input-group textarea {
  resize: vertical;
  min-height: 100px;
}

.password-input-wrapper {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #868e96;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.password-toggle:hover {
  background-color: #f1f3f5;
  color: #495057;
}

.password-toggle svg {
  display: block;
}

.password-strength {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  text-align: center;
}

.password-strength.very-weak {
  background-color: #ffe3e3;
  color: #fa5252;
}

.password-strength.weak {
  background-color: #ffec99;
  color: #f59f00;
}

.password-strength.medium {
  background-color: #a5d8ff;
  color: #1971c2;
}

.password-strength.strong {
  background-color: #b2f2bb;
  color: #2b8a3e;
}

.password-strength.very-strong {
  background-color: #96f2d7;
  color: #087f5b;
}

.error-text {
  display: block;
  margin-top: 0.25rem;
  color: #fa5252;
  font-size: 0.8rem;
}

.input-error input,
.input-error textarea {
  border-color: #ff6b6b;
  background-color: #fff5f5;
}

.input-error input:focus,
.input-error textarea:focus {
  box-shadow: 0 0 0 4px rgba(250, 82, 82, 0.2);
}


.checkbox-container {
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 2rem;
  cursor: pointer;
  font-size: 0.9rem;
  color: #495057;
  user-select: none;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  left: 0;
  top: 0;
  height: 1.25rem;
  width: 1.25rem;
  background-color: #f8f9fa;
  border: 2px solid #dee2e6;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.checkbox-container:hover input ~ .checkmark {
  background-color: #f1f3f5;
  border-color: #adb5bd;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: #4dabf7;
  border-color: #4dabf7;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-container .checkmark:after {
  left: 5px;
  top: 1px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.terms-link {
  color: #4dabf7;
  text-decoration: none;
  font-weight: 600;
}

.terms-link:hover {
  text-decoration: underline;
}

/* Message box */
.message-box {
  padding: 1rem;
  border-radius: 10px;
  margin: 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
}

.message-box.success {
  background-color: #ebfbee;
  color: #2b8a3e;
  border: 1px solid #b2f2bb;
}

.message-box.error {
  background-color: #fff5f5;
  color: #c92a2a;
  border: 1px solid #ffc9c9;
}

.message-box svg {
  flex-shrink: 0;
}

/* Button styles */
.auth-button {
  width: 100%;
  padding: 1rem;
  background-color: #4dabf7;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 52px;
  box-shadow: 0 4px 12px rgba(77, 171, 247, 0.3);
}

.auth-button:hover {
  background-color: #339af0;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(77, 171, 247, 0.4);
}

.auth-button:active {
  transform: translateY(0);
}

.auth-button:disabled {
  background-color: #adb5bd;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Redirect link */
.redirect-link {
  text-align: center;
  margin-top: 1.5rem;
  color: #868e96;
  font-size: 0.95rem;
}

.login-link {
  color: #4dabf7;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.login-link:hover {
  color: #339af0;
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
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .profile-picture-preview {
    width: 120px;
    height: 120px;
  }

  .input-group {
    min-height: 90px; 
  }
}

@media (max-width: 480px) {
  .auth-card {
    padding: 1.25rem;
  }
  
  h2 {
    font-size: 1.5rem;
  }
  
  .profile-picture-preview {
    width: 100px;
    height: 100px;
  }
  
  .file-upload-label {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }

   .input-group input,
  .input-group textarea {
    padding: 0.75rem;
  }
}
</style>