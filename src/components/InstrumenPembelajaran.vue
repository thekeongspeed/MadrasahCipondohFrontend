<template>
  <div class="page-container">
    <!-- Animated Background Elements -->
    <div class="floating-elements">
      <div v-for="i in 8" :key="i" class="floating-element" :style="floatingElementStyle(i)"></div>
    </div>

    <!-- Header Section -->
    <header class="page-header">
      <div class="header-overlay"></div>
      <div class="header-content">
        <h1>Instrumen Pembelajaran</h1>
        <p class="subtitle">Kurikulum, Silabus, Rencana Pembelajaran, Laporan KBM dan Raport</p>
        <div class="header-decoration">
          <div class="decoration-circle"></div>
          <div class="decoration-pattern"></div>
        </div>
      </div>
    </header>

    <div class="content-layout">
      <!-- Desktop Sidebar -->
      <aside class="sidebar desktop-only">
        <div class="sidebar-header">
          <h3>Menu Instrumen</h3>
          <div class="sidebar-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>

        <ul class="sidebar-nav">
          <li v-for="(item, key) in instrumentMenu" :key="key">
            <button 
              :class="{ active: activeInstrument === key }" 
              @click="selectInstrument(key)"
              class="sidebar-btn"
            >
              <span class="btn-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path v-if="key === 'kurikulum'" d="M12 6.25278V19.2528M12 6.25278C10.8324 5.47686 9.24649 5 7.5 5C5.75351 5 4.16756 5.47686 3 6.25278V19.2528C4.16756 18.4769 5.75351 18 7.5 18C9.24649 18 10.8324 18.4769 12 19.2528M12 6.25278C13.1676 5.47686 14.7535 5 16.5 5C18.2465 5 19.8324 5.47686 21 6.25278V19.2528C19.8324 18.4769 18.2465 18 16.5 18C14.7535 18 13.1676 18.4769 12 19.2528" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path v-if="key === 'silabus'" d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path v-if="key === 'rpp'" d="M9 5H5V9H9V5ZM15 5H11V9H15V5ZM9 11H5V15H9V11ZM15 11H11V15H15V11ZM9 17H5V21H9V17ZM15 17H11V21H15V17Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path v-if="key === 'laporanKbm'" d="M9 12H15M9 8H15M11 16H13M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path v-if="key === 'raport'" d="M9 17H7C5.89543 17 5 16.1046 5 15V5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V15C19 16.1046 18.1046 17 17 17H15M9 17V21L12 19L15 21V17M9 17H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
              <span class="btn-text">{{ item.nama }}</span>
              <span v-if="activeInstrument === key" class="active-indicator"></span>
            </button>
          </li>
        </ul>
      </aside>

      <main class="main-panel">
        <!-- Mobile Dropdown Menu -->
        <div class="mobile-menu mobile-only">
          <div class="dropdown">
            <button class="dropdown-toggle" @click="isInstrumentMenuOpen = !isInstrumentMenuOpen">
              <span>{{ activeInstrumentInfo.nama }}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <transition name="slide-fade">
              <ul v-if="isInstrumentMenuOpen" class="dropdown-menu">
                <li v-for="(item, key) in instrumentMenu" :key="key">
                  <button 
                    :class="{ active: activeInstrument === key }" 
                    @click="selectInstrument(key)"
                  >
                    {{ item.nama }}
                  </button>
                </li>
              </ul>
            </transition>
          </div>
        </div>

        <nav class="tabs-nav">
          <div class="tabs-scroll">
            <button
              v-for="kelas in Object.keys(dataInstrumen)"
              :key="kelas"
              @click="handleKelasTabClick(kelas)"
              :class="{ 
                'active': activeKelas === kelas,
        
              }"
              
              class="tab-btn"
            >
              <span class="tab-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 8V12L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
              {{ dataInstrumen[kelas].nama }}
              <span v-if="activeKelas === kelas" class="tab-indicator"></span>
            </button>
          </div>
        </nav>

        <div class="tabs-content">
          <transition name="fade" mode="out-in">
            <div class="tab-panel" :key="activeKelas + activeInstrument">
              <section class="content-section">
                <div class="content-header">
                  <h2>{{ activeInstrumentInfo.nama }} - Kelas {{ dataInstrumen[activeKelas]?.nama || 'Kelas Tidak Ditemukan'}}</h2>
                  <div class="content-badge">{{ activeInstrumentInfo.nama }}</div>
                </div>

                <div class="content-body">
                  <transition name="fade" mode="out-in">
                    <div>
                    <template v-if="loadingState[`${activeKelas}-${activeInstrument}`]">
                      <div class="loading-indicator">
                        <div class="spinner"></div> Memuat...
                      </div>
                    </template>

  <template v-if="activeInstrument === 'raport'">                   
    <div class="raport-container">
    <router-link v-if="isAdmin" to="/kelola-template" class="btn-kelola-template">
      Kelola Template
    </router-link>
    
    <div v-else>
      <div v-if="isKelasValidForUser"></div>
      <div v-else class="empty-list-message">
        <p class="error-message">Anda bukan anggota dari kelas ini.</p>
      </div>
    </div>
    
    <!-- Header Raport yang Diperbaiki -->
    <div class="raport-header-container">
      <div class="raport-header-card">
        <div class="raport-identity">
          <h3>RAPORT BELAJAR</h3>
          <div class="raport-school-info">
            <p>Madrasah Cipondoh</p>
            <p>Jl. Irigasi Sipon RT.003/RW.008, Cipondoh, Kec. Cipondoh Kota Tangerang </p>
          </div>
        </div>
        
        <div class="student-photo-placeholder">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="#4A90E2" stroke-width="2"/>
            <path d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26003 15 3.41003 18.13 3.41003 22" stroke="#4A90E2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>

      <div class="student-info-grid">
        <div class="info-item">
          <span class="info-label">Nama Siswa</span>
          <span class="info-value">{{ selectedSiswaInfo?.fullName || userFullName }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Kelas</span>
          <span class="info-value">{{ dataInstrumen[activeKelas]?.nama }}</span>
        </div>
         <div class="info-item">
            <span class="info-label">Wali Kelas</span>
            <span class="info-value">{{ waliKelas || '-' }}</span>
          </div>
        <div class="info-item">
          <span class="info-label">Tahun Ajaran</span>
          <span class="info-value">{{ selectedTahun }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Semester</span>
          <span class="info-value">{{ selectedSemester == 1 ? 'Ganjil' : 'Genap' }}</span>
        </div>
      </div>
    </div>

    <div class="filter-group">
      <div v-if="isAdmin" class="student-selector">
        <label for="siswa-select">Pilih Siswa:</label>
        <select id="siswa-select" v-model="selectedSiswaId">
          <option :value="null" disabled>-- Pilih seorang siswa --</option>
          <option v-for="siswa in raportSiswaList" :key="siswa.id" :value="siswa.id">
            {{ siswa.fullName }}
          </option>
        </select>
      </div>

      <div v-else class="user-info">
        <label>Siswa</label>
        <span>{{ userFullName || 'Memuat...' }}</span>
      </div>

      <div class="filter-item">
        <label for="tahun-select">Tahun Ajaran:</label>
        <select id="tahun-select" v-model="selectedTahun">
          <option v-for="tahun in tahunAjaranList" :key="tahun" :value="tahun">{{ tahun }}</option>
        </select>
      </div>
      <div class="filter-item">
        <label for="semester-select">Semester:</label>
        <select id="semester-select" v-model="selectedSemester">
          <option value="1">Ganjil</option>
          <option value="2">Genap</option>
        </select>
      </div>
      <button v-if="isAdmin" @click="fetchRaportBySiswa" class="btn-primary" :disabled="!selectedSiswaId">
        Tampilkan Raport
      </button>
    </div>
    
    <button @click="handleCetakRaport" :disabled="!currentRaport" class="btn-secondary">
      Cetak Raport
    </button>

    <div v-if="raportLoading" class="loading-indicator">
      <div class="spinner"></div> Memuat data raport...
    </div>
    
    <div v-else-if="currentRaport" class="raport-content">
      <div class="raport-table-container">
        <div class="table-header">
          <h4>Nilai Pembelajaran</h4>
          <div class="table-summary">
            <span class="summary-item">
              <span class="summary-label">Jumlah Materi:</span>
              <span class="summary-value">{{ raportData.length }}</span>
            </span>
            <span class="summary-item">
              <span class="summary-label">Rata-rata:</span>
              <span class="summary-value">{{ calculateAverage() }}</span>
            </span>
          </div>
        </div>

        <div class="table-responsive">
          <table class="raport-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Materi Pokok</th>
                <th>Uraian Materi</th>
                <th>Nilai</th>
                <th>Keterangan</th>
                <th v-if="isAdmin">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="raportData.length === 0">
                <td :colspan="isAdmin ? 6 : 5" style="text-align: center;">Belum ada data nilai untuk semester ini.</td>
              </tr>
              <tr v-for="(item, index) in raportData" :key="item.id">
                <td>{{ index + 1 }}</td>
                <td>{{ item.materi }}</td>
                <td>{{ item.uraianMateri }}</td>
                <td>
                  <span v-if="item.nilaiAngka != null">
                    {{ item.nilaiHuruf }} ({{ item.nilaiAngka.toFixed(2) }})
                  </span>
                  <span v-else>-</span>
                </td>
                <td>{{ item.keterangan }}</td>
                <td v-if="isAdmin">
                  <button @click="bukaModalEdit(item)" class="edit-btn-small" title="Edit Nilai">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.5 2.5C18.8978 2.10218 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10218 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10218 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </button>
                  <button @click="hapusNilaiRaport(item.id)" class="delete-btn-small" title="Hapus Nilai">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
      
        <div class="rekap-absensi-section">
            <h4 class="section-title">
              <span class="title-icon">📊</span>
              <span>Rekapitulasi Absensi</span>
            </h4>
            
            <div class="absensi-summary">
              <!-- Attendance Status Cards -->
              <div class="summary-grid">
                <div class="status-card hadir">
                  <div class="status-icon">✅</div>
                  <div class="status-info">
                    <div class="status-label">Hadir</div>
                    <div class="status-value">{{ summaryAbsensi.hadir || 0 }} <span class="unit">hari</span></div>
                    <div class="status-percentage" v-if="summaryAbsensi.totalPertemuan > 0">
                      {{ calculatePercentage(summaryAbsensi.hadir) }}%
                    </div>
                  </div>
                </div>
                
                <div class="status-card sakit">
                  <div class="status-icon">🤒</div>
                  <div class="status-info">
                    <div class="status-label">Sakit</div>
                    <div class="status-value">{{ summaryAbsensi.sakit || 0 }} <span class="unit">hari</span></div>
                    <div class="status-percentage" v-if="summaryAbsensi.totalPertemuan > 0">
                      {{ calculatePercentage(summaryAbsensi.sakit) }}%
                    </div>
                  </div>
                </div>
                
                <div class="status-card izin">
                  <div class="status-icon">📝</div>
                  <div class="status-info">
                    <div class="status-label">Izin</div>
                    <div class="status-value">{{ summaryAbsensi.izin || 0 }} <span class="unit">hari</span></div>
                    <div class="status-percentage" v-if="summaryAbsensi.totalPertemuan > 0">
                      {{ calculatePercentage(summaryAbsensi.izin) }}%
                    </div>
                  </div>
                </div>
                
                <div class="status-card alpa">
                  <div class="status-icon">❌</div>
                  <div class="status-info">
                    <div class="status-label">Alpa</div>
                    <div class="status-value">{{ summaryAbsensi.alpa || 0 }} <span class="unit">hari</span></div>
                    <div class="status-percentage" v-if="summaryAbsensi.totalPertemuan > 0">
                      {{ calculatePercentage(summaryAbsensi.alpa) }}%
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Total Meetings and Progress Bar -->
              <div class="total-section">
                <div class="total-header">
                  <span class="total-label">Total Pertemuan:</span>
                  <span class="total-value">{{ summaryAbsensi.totalPertemuan || 0 }} kali</span>
                </div>
                
                <div class="progress-container">
                  <div class="progress-bar" :style="{ width: attendanceRate + '%' }"></div>
                  <div class="progress-labels">
                    <span>Kehadiran: {{ attendanceRate }}%</span>
                    <span>{{ summaryAbsensi.hadir || 0 }}/{{ summaryAbsensi.totalPertemuan || 0 }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        

      <!-- Grafik Kemajuan Belajar -->
      <div class="progress-chart" v-if="raportData.length > 0">
        <h4>Grafik Kemajuan Belajar</h4>
        <div class="chart-container">
          <canvas ref="progressChart"></canvas>
        </div>
        <div class="chart-legend">
          <div class="legend-item">
            <span class="legend-color" style="background-color: rgba(74, 144, 226, 1)"></span>
            <span class="legend-label">Nilai Pembelajaran</span>
          </div>
        </div>
      </div>

      <div class="catatan-guru-section" v-if="isAdmin">
        <h4>Catatan Guru</h4>
        <textarea v-model="catatanGuru" placeholder="Tuliskan catatan atau feedback umum untuk siswa..."></textarea>
        <button @click="saveCatatanGuru" class="btn-primary">Simpan Catatan</button>
      </div>
      <div class="catatan-guru-display" v-else-if="catatanGuru">
        <h4>Catatan Guru</h4>
        <p>{{ catatanGuru }}</p>
      </div>

      <form v-if="isAdmin" @submit.prevent="tambahNilaiRaport" class="admin-actions">
        <h4>Tambah Data Nilai Baru</h4>
        <div class="form-content">
          <div class="form-grid">
            <div class="form-group">
              <label>Materi Pokok</label>
              <select v-model="newNilai.materi" required>
                <option disabled value="">-- Pilih Materi --</option>
                <option v-for="materi in materiList" :key="materi.id" :value="materi.nama">
                  {{ materi.nama }}
                </option>
              </select>
            </div>
            
            <div class="form-group">
              <label>Uraian Materi</label>
              <input type="text" v-model="newNilai.uraianMateri" placeholder="e.g., Hafalan Surat An-Naas" required>
            </div>
            
            <div class="form-group">
              <label>Nilai</label>
              <select v-model="newNilai.nilaiAngka">
                <option :value="null" disabled>-- Pilih Nilai --</option>
                <option value="4.00">4.00 (A)</option>
                <option value="3.00">3.00 (B)</option>
                <option value="2.00">2.00 (C)</option>
                <option value="1.00">1.00 (D)</option>
                <option value="0.00">0.00 (E)</option>
              </select>
            </div>
                                                          
            <div class="form-group">
              <label>Keterangan</label>
              <input type="text" v-model="newNilai.keterangan" placeholder="e.g., Perlu bimbingan">
            </div>
          </div>
        </div>
        
        <div class="form-actions">
          <button type="submit" class="submit-btn">Tambah Nilai</button>
        </div>
      </form>
                        
                        
      <div v-else class="empty-list-message">
        <p>Silakan pilih siswa, tahun ajaran, dan semester, lalu klik "Tampilkan Raport".</p>
      </div>
    </div>
  </div>
    </div>
  </template>
  

                    <template v-else>
                      <div class="pdf-content" :key="currentContent.value">
                        <div class="uploaded-files-list">
                          <h4>Daftar File Tersedia:</h4>
                          <div v-if="uploadedFiles.length === 0" class="empty-list-message">
                            <p>Belum ada {{ activeInstrumentInfo.nama.toLowerCase() }} yang diunggah untuk kelas ini.</p>
                          </div>

                          <ul v-else>
                            <li v-for="(file, index) in uploadedFiles" :key="index" class="file-item">
                              <a :href="getFullFileUrl(file.path)" target="_blank" rel="noopener noreferrer" class="file-link">
                                <span class="file-icon">
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M14 2V8H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                  </svg>
                                
                                </span>    
                               <div class="file-details">
                                 <span class="file-date">{{ formatSimpleDate(file.uploadedAt) }}</span>   
                                 <span class="file-name">{{ file.name }}</span>                  
                                <span class="file-size">({{ formatFileSize(file.size) }})</span>
                               </div>

                              </a>

                              
                              <span v-if="isAdmin" class="file-actions">
                                <button @click="deleteFile(file.id)" class="delete-btn-small">
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                  </svg>
                                </button>
                              </span>
                            </li>
                          </ul>
                        </div>

                        <div v-if="isAdmin" class="admin-actions">
                          <input
                            type="file"
                            id="fileUpload"
                            ref="fileInput"
                            @change="handleFileUpload"
                            accept=".pdf,.doc,.docx"
                            style="display: none;" />
                          <button @click="$refs.fileInput.click()" class="upload-btn">
                            {{ currentContent.value ? 'Upload File' : 'Upload File' }}
                          </button>
                        </div>
                      </div>
                    </template>
                    </div>
                  </transition>
                </div>
              </section>
            </div>
          </transition>
        </div>
      </main>

      <div v-if="showEditModal" class="modal-overlay" @click.self="tutupModalEdit">
        <div class="modal-content">
          <h3>Edit Nilai Penilaian</h3>
          <form @submit.prevent="simpanPerubahan">
            <div class="form-grid">
              <div class="form-group">
                <label>Materi Pokok</label>
                <select v-model="editingNilai.materi" required>
                  <option v-for="materi in materiList" :key="materi.id" :value="materi.nama">
                    {{ materi.nama }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label>Uraian Materi</label>
                <input type="text" v-model="editingNilai.uraianMateri" required>
              </div>
              <div class="form-group">
                  <label>Nilai</label>
                  <select v-model="newNilai.nilaiAngka">
                      <option :value="null" disabled>-- Pilih Nilai --</option>
                      <option value="4.00">4.00 (A)</option>
                      <option value="3.00">3.00 (B)</option>
                      <option value="2.00">2.00 (C)</option>
                      <option value="1.00">1.00 (D)</option>
                      <option value="0.00">0.00 (E)</option>
                  </select>
                </div>
              <div class="form-group">
                <label>Keterangan</label>
                <input type="text" v-model="editingNilai.keterangan">
              </div>
            </div>
            <div class="modal-actions">
              <button type="button" @click="tutupModalEdit" class="btn-secondary">Batal</button>
              <button type="submit" class="btn-primary">Simpan Perubahan</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick, watchEffect, inject } from 'vue';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

// State untuk melacak tab mana yang sedang aktif
const activeKelas = ref('paud');
const activeInstrument = ref('kurikulum');
const isInstrumentMenuOpen = ref(false);
const fileInput = ref(null);
const uploadedFiles = ref([]);
const isAdmin = ref(localStorage.getItem('userRole') === 'admin');
const token = ref(localStorage.getItem('token') || '');
const raportSiswaList = ref([]); 
const selectedSiswaId = ref(null); 
const raportData = ref([]);
const raportLoading = ref(false); 
const currentRaport = ref(null);
const materiList = ref([]);
const selectedTahun = ref(new Date().getFullYear());
const selectedSemester = ref(new Date().getMonth() >= 6 ? 1 : 2); // 1: Ganjil, 2: Genap
const tahunAjaranList = ref([]);
const catatanGuru = ref('');
const showEditModal = ref(false);
const editingNilai = ref(null);
const newNilai = ref({
  materi: '',
  uraianMateri: '',
  nilaiAngka: null,
  keterangan: ''
});

const userId = ref(localStorage.getItem('userId'))
const userFullName = ref(localStorage.getItem('userFullName'));
const userKelas = ref(localStorage.getItem('userKelas'));
const isKelasValidForUser = ref(true);
const progressChart = ref(null);
const rekapAbsensiBulanIni = ref([]);
const waliKelas = ref('');
const userParentName = ref(localStorage.getItem('userParentName'));
const showNotification = inject('showNotification');




// Data default
const dataInstrumen = ref({
  paud: {
    nama: 'Paud',
    kurikulum: { type: 'pdf', value: '' },
    silabus: { type: 'pdf', value: '' },
    rpp: { type: 'pdf', value: ''},
    laporanKbm: { type: 'pdf', value: '' },
    raport: { type: 'text', value: 'Contoh raport untuk kelas PAUD akan ditampilkan di sini.' }
  },
  caberawit: {
    nama: 'Caberawit',
    kurikulum: { type: 'pdf', value: '' },
    silabus: { type: 'pdf', value: '' },
    rpp: { type: 'pdf', value: '' },
    laporanKbm: { type: 'pdf', value: '' },
    raport: { type: 'text', value: 'Contoh raport untuk kelas Caberawit akan ditampilkan di sini.' }
  },
  'pra-remaja': {
    nama: 'Pra Remaja',
    kurikulum: { type: 'pdf', value: '' },
    silabus: { type: 'pdf', value: '' },
    rpp: { type: 'pdf', value: ''},
    laporanKbm: { type: 'pdf', value: ''},
    raport: { type: 'text', value: 'Contoh raport untuk Pra Remaja akan ditampilkan di sini.' }
  },
  'remaja': {
    nama: 'Remaja',
    kurikulum: { type: 'pdf', value: '' },
    silabus: { type: 'pdf', value: '' },
    rpp: { type: 'pdf', value: '' },
    laporanKbm: { type: 'pdf', value: ''},
    raport: { type: 'text', value: 'Contoh raport untuk Remaja akan ditampilkan di sini.' }
  },
  'pra-nikah': {
    nama: 'Pra Nikah',
    kurikulum: { type: 'pdf', value: '' },
    silabus: { type: 'pdf', value: ''},
    rpp: { type: 'pdf', value: ''},
    laporanKbm: { type: 'pdf', value: ''},
    raport: { type: 'text', value: 'Contoh raport untuk Pra Nikah akan ditampilkan di sini.' }
  },
});

const instrumentMenu = {
  kurikulum: { nama: 'Kurikulum' },
  silabus: { nama: 'Silabus' },
  rpp: { nama: 'Rencana Pembelajaran' },
  laporanKbm: { nama: 'Laporan KBM' },
  raport: { nama: 'Raport' },
};

// Computed properties
const currentContent = computed(() => {
  const key = `${activeKelas.value}-${activeInstrument.value}`;
  
  // Coba ambil data dari server terlebih dahulu
  if (instrumentData.value[key]) {
    return instrumentData.value[key];
  }
  
  // Jika tidak ada, gunakan data default (yang sekarang valuenya kosong)
  const defaultData = dataInstrumen.value[activeKelas.value]?.[activeInstrument.value];
  if (defaultData) {
    return defaultData;
  }

  return { 
    type: isPdfType(activeInstrument.value) ? 'pdf' : 'text', 
    value: 'Data tidak tersedia' 
  };
});

const selectedSiswaInfo = computed(() => {
  if (!selectedSiswaId.value) return null;
  return raportSiswaList.value.find(s => s.id === selectedSiswaId.value);
});

const activeInstrumentInfo = computed(() => {
  return instrumentMenu[activeInstrument.value] || { nama: 'Menu Tidak Ditemukan' };
});

// State untuk data dari API
const instrumentData = ref({});
const loadingState = ref({});

// Methods
function isPdfType(instrument) {
  return ['kurikulum', 'silabus', 'rpp', 'laporanKbm'].includes(instrument);
}

function selectInstrument(instrumentKey) {
  activeInstrument.value = instrumentKey;
  isInstrumentMenuOpen.value = false;
}

const floatingElementStyle = (i) => ({
  width: `${Math.random() * 20 + 10}px`,
  height: `${Math.random() * 20 + 10}px`,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  animationDuration: `${Math.random() * 30 + 20}s`,
  animationDelay: `${Math.random() * 5}s`,
  opacity: Math.random() * 0.3 + 0.1,
});

// Fungsi untuk memformat ukuran file
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};


function formatSimpleDate(tanggal) {
  if (!tanggal) return '';
  return new Date(tanggal).toLocaleDateString('id-ID', {
    day: 'numeric', 
    month: 'long', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}


// Fungsi untuk mendapatkan daftar file
const fetchUploadedFiles = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/instrumen/${activeKelas.value}/${activeInstrument.value}/files`, {
      headers: { 
        'Authorization': `Bearer ${token.value}` 
      }
    });
    
    if (response.status === 200) {
      const files = response.data.data || response.data;
      uploadedFiles.value = files.map(file => ({
        id: file.id,
        name: file.fileName,
        path: file.filePath,
        size: file.fileSize || 0,
        uploadedAt: file.createdAt
      }));
    }
  } catch (error) {
    console.error('Error mengambil daftar file:', error);
    if (error.response?.status !== 404) {
      showNotification('Gagal memuat daftar file', 'error');
    } else {
      uploadedFiles.value = [];
    }
  }
};


function getFullFileUrl(filePath) {

  const baseURL = import.meta.env.VITE_API_BASE_URL; 
  return `${baseURL}/${filePath}`; 
}



async function fetchInstrumentData(kelas, jenis) {
  if (!isPdfType(jenis)) return;
  
  const key = `${kelas}-${jenis}`;
  
  if (instrumentData.value[key]) return;

  loadingState.value[key] = true;
  
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/instrumen/${kelas}/${jenis}`, {
      headers: { 
        'Authorization': `Bearer ${token.value}` 
      }
    });
    
    if (response.data && response.data.value) {
      instrumentData.value[key] = response.data;
    } else {
      instrumentData.value[key] = null;
    }
  } catch (error) {
    console.warn(`File untuk ${key} tidak ditemukan di server. Menggunakan data default jika tersedia.`);
    instrumentData.value[key] = null; 
  } finally {
    loadingState.value[key] = false;
  }
}

function handleClickOutside(event) {
  const dropdown = document.querySelector('.dropdown');
  if (dropdown && !dropdown.contains(event.target)) {
    isInstrumentMenuOpen.value = false;
  }
}


function handleKelasTabClick(kelas) {


 if (isAdmin.value || (userKelas.value && userKelas.value.trim().toLowerCase() === kelas.trim().toLowerCase())) {
    activeKelas.value = kelas;
  } else {
   
    showNotification('Anda tidak memiliki akses ke kelas ini.', 'error');
  }
}


const handleFileUpload = async (event) => {
  if (!event.target.files[0]) return;

  const file = event.target.files[0];
  const key = `${activeKelas.value}-${activeInstrument.value}`;
  
  loadingState.value[key] = true;

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('kelas', activeKelas.value);
    formData.append('jenis', activeInstrument.value);

    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/instrumen`, formData, {
      headers: { 
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    if (!response.data || !response.data.filePath) {
      throw new Error('Respons server tidak valid setelah upload.');
    }

    // Update data dan daftar file
    instrumentData.value[key] = {
      type: 'pdf',
      value: response.data.filePath,
      id: response.data.id
    };
    
    // Muat ulang daftar file
    await fetchUploadedFiles();
    
    showNotification('File berhasil diupload!', 'success');
  } catch (error) {
    console.error('Upload gagal:', error);
    showNotification(`Error: ${error.response?.data?.message || error.message}`);
  } finally {
    loadingState.value[key] = false;
    if (event.target) {
      event.target.value = '';
    }
  }
};

const deleteFile = async (id) => {
  if (!id || !confirm('Anda yakin ingin menghapus file ini?')) return;
  
  try {
    await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/instrumen/${id}`, {
      headers: { 'Authorization': `Bearer ${token.value}` }
    });
    
    // Clear the current content jika file yang dihapus adalah yang sedang aktif
    const key = `${activeKelas.value}-${activeInstrument.value}`;
    if (instrumentData.value[key]?.id === id) {
      instrumentData.value[key] = { type: 'pdf', value: '' };
    }
    
    // Muat ulang daftar file
    await fetchUploadedFiles();
    
    showNotification('File berhasil dihapus!', 'success');
  } catch (error) {
    console.error('Delete error:', error);
    showNotification('Gagal menghapus file: ' + (error.response?.data?.message || error.message));
  }
};

function cetakRaport(dataSiswa, dataNilai, catatan, dataAbsensi) {
  const doc = new jsPDF();

  // ---- Header Dokumen ----
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text(`RAPORT BELAJAR`, 105, 20, { align: 'center' });
  
  // ---- Informasi Siswa ----
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  doc.text(`Nama Siswa`, 14, 35);
  doc.text(`: ${dataSiswa.nama}`, 50, 35);
  doc.text(`Kelas`, 14, 42);
  doc.text(`: ${dataSiswa.kelas}`, 50, 42);
  doc.text(`Periode`, 14, 49);
  doc.text(`: ${dataSiswa.periode}`, 50, 49);

  // ---- Tabel Nilai ----
  const tableData = dataNilai.map((item, index) => [
    index + 1,
    item.materi,
    item.uraianMateri,
    item.nilaiAngka != null ? `${item.nilaiHuruf} (${item.nilaiAngka.toFixed(2)})` : '-',
    item.keterangan
  ]);

  autoTable(doc, {
    startY: 55,
    head: [['No', 'Materi Pokok', 'Uraian Materi', 'Nilai', 'Keterangan']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185], halign: 'center' },
    styles: { fontSize: 9, cellPadding: 3 },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      3: { halign: 'center', cellWidth: 20 },
    }
  });
  

  let finalY = doc.lastAutoTable.finalY + 10;

  if (dataAbsensi) {
    const hadir = dataAbsensi.filter(a => a.status === 'Hadir').length;
    const sakit = dataAbsensi.filter(a => a.status === 'Sakit').length;
    const izin = dataAbsensi.filter(a => a.status === 'Izin').length;
    const alpa = dataAbsensi.filter(a => a.status === 'Alpa').length;
    const totalPertemuan = hadir + sakit + izin + alpa;
    const tingkatKehadiran = totalPertemuan > 0 ? Math.round((hadir / totalPertemuan) * 100) : 0;

    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('Rekapitulasi Absensi:', 14, finalY);
    
    autoTable(doc, {
      startY: finalY + 2,
      body: [
        ['Hadir', `${hadir} hari`, 'Izin', `${izin} hari`],
        ['Sakit', `${sakit} hari`, 'Alpa', `${alpa} hari`],
      ],
      theme: 'grid',
      styles: { fontSize: 9 },
    });


     autoTable(doc, {
      startY: doc.lastAutoTable.finalY,
      body: [
        [`Total Pertemuan: ${totalPertemuan} kali`, `Tingkat Kehadiran: ${tingkatKehadiran}%`]
      ],
      theme: 'grid',
      styles: { fontSize: 9, fontStyle: 'bold' },
    });

    finalY = doc.lastAutoTable.finalY;
  
  }



    // ---- Catatan Guru ----
     finalY += 10;
  if (catatan) {
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('Catatan Guru:', 14, finalY + 10);
    
    doc.setFont(undefined, 'normal');
    const splitCatatan = doc.splitTextToSize(catatan, 120);
    doc.text(splitCatatan, 14, finalY + 16);
    finalY += (splitCatatan.length * 5) + 5;
  }
  

   // ---- FOOTER TANDA TANGAN (BARU) ----
  const tanggalCetak = new Date().toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
  });

  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(`Ditetapkan di: Tangerang`, 130, finalY + 10);
  doc.text(`Pada tanggal: ${tanggalCetak}`, 130, finalY + 16);

  let mengetahuiY = finalY + 30;
  doc.text('Mengetahui,', 20, mengetahuiY);

  // Tanda tangan
  let signatureY = mengetahuiY + 5;
  doc.text('Orang Tua/Wali', 20, signatureY, );
  doc.text('PJPTK,', 105, signatureY, { align: 'center' });
  doc.text('Wali Kelas,', 180, signatureY, { align: 'center' });

  signatureY += 25; // Spasi untuk tanda tangan
  doc.text(`( ${dataSiswa.orangTua || '.........................'} )`, 20, signatureY);
  doc.text(`( ${dataSiswa.pjptk || '.........................'} )`, 105, signatureY, { align: 'center' });
  doc.text(`( ${dataSiswa.waliKelas || '.........................'} )`, 180, signatureY, { align: 'center' });




  // ---- Simpan PDF ----
  doc.save(`Raport-${dataSiswa.nama}-${dataSiswa.periode}.pdf`);
}



const summaryAbsensi = computed(() => {
  const summary = { hadir: 0, sakit: 0, izin: 0, alpa: 0, totalPertemuan: 0 };
  
  // Pastikan rekapAbsensiBulanIni.value adalah array
  if (!Array.isArray(rekapAbsensiBulanIni.value)) {
    return summary;
  }
  
  rekapAbsensiBulanIni.value.forEach(absen => {
    if (absen.status === 'Hadir') summary.hadir++;
    else if (absen.status === 'Sakit') summary.sakit++;
    else if (absen.status === 'Izin') summary.izin++;
    else if (absen.status === 'Alpa') summary.alpa++;
  });

   summary.totalPertemuan = summary.hadir + summary.sakit + summary.izin + summary.alpa;
  
  return summary;
});


const calculatePercentage = (value) => {

  if (!summaryAbsensi.value || summaryAbsensi.value.totalPertemuan === 0) {
    return 0;
  }
  const percentage = (value / summaryAbsensi.value.totalPertemuan) * 100;
  return Math.round(percentage);
};

const attendanceRate = computed(() => {
  return calculatePercentage(summaryAbsensi.value.hadir);
});


async function fetchSiswaByKelas(kelas) {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/kelas/${kelas}`, { 
      headers: { 'Authorization': `Bearer ${token.value}` }
    });
    raportSiswaList.value = response.data.map(user => ({ ...user, id: user.id }));
  } catch (error) {
    console.error('Gagal mengambil daftar siswa:', error);
    raportSiswaList.value = [];
  }
}



async function fetchRaportBySiswa() {
  const siswaId = selectedSiswaId.value;
  if (!siswaId) return;

  raportLoading.value = true;
  // Reset state
  currentRaport.value = null;
  raportData.value = [];
  catatanGuru.value = '';
  rekapAbsensiBulanIni.value = [];
  

  try {
    const token = localStorage.getItem('token');
    const tahun = selectedTahun.value;
    const semester = selectedSemester.value;
    const periode = `${tahun}-${semester}`;
    const startDate = semester === 1 ? `${tahun}-07-01` : `${tahun}-01-01`;
    const endDate = semester === 1 ? `${tahun}-12-31` : `${tahun}-06-30`;

    // PERBAIKAN: Hapus panggilan ke /api/template dari Promise.all
    const [absensiResponse, raportResponse, templateResponse] = await Promise.all([
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/absensi/rekap/rentang`, {
        params: { kelas: activeKelas.value, startDate, endDate },
        headers: { 'Authorization': `Bearer ${token}` }
      }),
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/raport/${siswaId}/${activeKelas.value}/${periode}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).catch(err => err.response),

      axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/template/public/${activeKelas.value}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
    ]);

    // Proses data absensi
    const semuaAbsensi = absensiResponse.data.data || [];
    rekapAbsensiBulanIni.value = semuaAbsensi.filter(absen => absen.userId == siswaId);

    // Proses data raport
    if (raportResponse.status === 404) {
      currentRaport.value = { id: null, siswaId, kelas: activeKelas.value, periode, nilai: [], catatanGuru: '' };
    } else if (raportResponse.data?.data) {
      const raport = raportResponse.data.data;
      currentRaport.value = raport;
      raportData.value = raport.nilai || [];
      catatanGuru.value = raport.catatanGuru || '';
    }
    
    if (templateResponse.data?.data) {
      waliKelas.value = templateResponse.data.data.waliKelas || '';
    }

  } catch (error) {
    console.error('ERROR TERJADI DI DALAM FUNGSI:', error);
    showNotification('Terjadi kesalahan saat mengambil data.', 'error');
  } finally {
    raportLoading.value = false;
  }
}


async function tambahNilaiRaport() {
  if (!selectedSiswaId.value || !newNilai.value.materi || !newNilai.value.uraianMateri) {
    showNotification('Harap pilih materi pokok dan isi uraian materi.', 'info');
    return;
  }
  try {
    const periode = `${selectedTahun.value}-${selectedSemester.value}`;

    const payload = {
      siswaId: selectedSiswaId.value,
      kelas: activeKelas.value,
      periode: periode,
      materi: newNilai.value.materi,
      uraianMateri: newNilai.value.uraianMateri,
      nilaiAngka: newNilai.value.nilaiAngka,
      keterangan: newNilai.value.keterangan
    };

    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/raport`, payload, {
      headers: { 'Authorization': `Bearer ${token.value}` }
    });
    
    const updatedRaport = response.data;
    currentRaport.value = updatedRaport;
    raportData.value = updatedRaport.nilai || [];
    
    newNilai.value.uraianMateri = '';
    newNilai.value.nilai = '';
    newNilai.value.keterangan = '';

  
  } catch (error) {
    console.error('Gagal menambah nilai raport:', error);
    showNotification('Gagal menyimpan data baru: ' + (error.response?.data?.message || error.message));
  }
}

async function hapusNilaiRaport(nilaiId) {
  if (!currentRaport.value?.id || !nilaiId) {
    showNotification('Data raport tidak aktif untuk menghapus nilai.', 'error');
    return;
  }
  if (!confirm('Anda yakin ingin menghapus data nilai ini?', 'info')) return;

  try {
    await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/raport/${currentRaport.value.id}/nilai/${nilaiId}`, {
      headers: { 'Authorization': `Bearer ${token.value}` }
    });
    
    raportData.value = raportData.value.filter(item => item.id !== nilaiId);
    
    showNotification('Data nilai berhasil dihapus.', 'success');

    // Render ulang chart setelah menghapus data
    nextTick(() => {
      renderChart();
    });
  } catch (error) {
    console.error('Gagal menghapus nilai:', error);
    showNotification('Gagal menghapus data: ' + (error.response?.data?.message || error.message), 'error');
  }
}



function handleCetakRaport() {
  if (!currentRaport.value) {
    showNotification("Tampilkan data raport terlebih dahulu sebelum mencetak.", 'info');
    return;
  }

  let siswaNama;
  let siswaId;
  let orangTuaNama;

  const siswaIdUntukCetak = selectedSiswaId.value;
  const siswaInfo = raportSiswaList.value.find(s => s.id == siswaIdUntukCetak);



  if (isAdmin.value) {
    if (!selectedSiswaInfo.value) {
      showNotification("Pilih siswa terlebih dahulu.", 'info');
      return;
    }
    siswaNama = selectedSiswaInfo.value.fullName;
    siswaId = siswaInfo.id;
    orangTuaNama = siswaInfo.parentName;
  } else {
    siswaNama = userFullName.value;
    siswaId = userId.value;
    orangTuaNama = userParentName.value;
  }

  // Siapkan data lengkap untuk dikirim ke fungsi cetak
  const dataUntukCetak = {
    nama: siswaNama,
    kelas: dataInstrumen.value[activeKelas.value]?.nama || 'Tidak diketahui',
    periode: `Semester ${selectedSemester.value == 1 ? 'Ganjil' : 'Genap'} Tahun ${selectedTahun.value}`,
    orangTua: orangTuaNama || '________________',
    pjptk: 'Ahmad Dani Fadlan', // Ganti dengan data PJPTK Anda
    waliKelas: waliKelas.value // Ganti dengan data wali kelas Anda
  };
  
  
  cetakRaport(dataUntukCetak, raportData.value, catatanGuru.value, rekapAbsensiBulanIni.value);
}




const fetchMateriForKelas = async (kelas) => {

   if (!isAdmin.value) {
    materiList.value = []; 
    return; 
  }

  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/template/${kelas}`, {
      headers: { 'Authorization': `Bearer ${token.value}` }
    });
    materiList.value = response.data;
  } catch (error) {
    console.error(`Gagal memuat materi untuk kelas ${kelas}:`, error);
    materiList.value = [];
  }
};

const generateTahunAjaran = () => {
  const tahunSekarang = new Date().getFullYear();
  const list = [];
  for (let i = tahunSekarang + 1; i >= tahunSekarang - 5; i--) {
    list.push(i);
  }
  tahunAjaranList.value = list;
};

const saveCatatanGuru = async () => {
  if (!currentRaport.value?.id) {
    showNotification('Tidak ada data raport yang aktif untuk disimpan. Tampilkan raport terlebih dahulu.', 'info');
    return;
  }
  try {
    await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/raport/${currentRaport.value.id}/catatan`, 
      { catatanGuru: catatanGuru.value },
      { headers: { 'Authorization': `Bearer ${token.value}` } }
    );
    showNotification('Catatan guru berhasil disimpan!', 'success');
  } catch (error) {
    console.error('Gagal menyimpan catatan guru:', error);
    showNotification('Gagal menyimpan catatan.', 'error');
  }
};

const bukaModalEdit = (item) => {
  editingNilai.value = JSON.parse(JSON.stringify(item));
  showEditModal.value = true;
};

const tutupModalEdit = () => {
  showEditModal.value = false;
  editingNilai.value = null;
};

const simpanPerubahan = async () => {
  if (!editingNilai.value) return;
  
  try {
    const raportId = currentRaport.value.id;
    const nilaiId = editingNilai.value.id;
    
    const response = await axios.put(
      `${import.meta.env.VITE_API_BASE_URL}/api/raport/${raportId}/nilai/${nilaiId}`,
      editingNilai.value,
      { headers: { 'Authorization': `Bearer ${token.value}` } }
    );
    
    const index = raportData.value.findIndex(item => item.id === nilaiId);
    if (index !== -1) {
      raportData.value[index] = response.data;
    }
    
    showNotification('Perubahan berhasil disimpan!', 'success');
    tutupModalEdit();

   
  } catch (error) {
    console.error('Gagal menyimpan perubahan:', error);
    showNotification('Gagal menyimpan perubahan: ' + (error.response?.data?.message || error.message), 'error');
  }
};

// Method untuk menghitung rata-rata
const calculateAverage = () => {
  if (!raportData.value || raportData.value.length === 0) return 'N/A';
  
  // Ubah item.nilai menjadi item.nilaiAngka
  const numericValues = raportData.value
    .map(item => item.nilaiAngka)
    .filter(val => typeof val === 'number'); // Filter nilai yang valid
    
  if (numericValues.length === 0) return 'N/A';
  
  const avg = numericValues.reduce((a, b) => a + b, 0) / numericValues.length;
  return avg.toFixed(2);
};


// Method untuk menyiapkan data chart
const prepareChartData = () => {

  const labels = raportData.value.map(item => item.uraianMateri); 
  
  
  const data = raportData.value.map(item => item.nilaiAngka || 0);
  
  return {
    labels,
    datasets: [{
      label: 'Nilai (Skala 4.00)', // Label yang lebih sesuai
      data,
      backgroundColor: 'rgba(74, 144, 226, 0.2)',
      borderColor: 'rgba(74, 144, 226, 1)',
      borderWidth: 2,
      tension: 0.3,
      fill: true
    }]
  };
};

// Method untuk render chart
const renderChart = () => {
  
  if (progressChart.value) { 
    const ctx = progressChart.value.getContext('2d');
    
  
    if (progressChart.value.chart) {
      progressChart.value.chart.destroy();
    }
    

    progressChart.value.chart = new Chart(ctx, {
      type: 'line',
      data: prepareChartData(),
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.parsed.y || 0;
                return `Nilai: ${value.toFixed(2)}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 4.0, 
            ticks: { stepSize: 1 }
          }
        }
      }
    });
  } else {
      console.error("Fungsi renderChart dipanggil, tetapi elemen canvas belum siap di DOM.");
  }
};


// Lifecycle hooks
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  generateTahunAjaran();

  const defaultTab = sessionStorage.getItem('defaultInstrumentTab');
  if (defaultTab) {
    activeInstrument.value = defaultTab;
    sessionStorage.removeItem('defaultInstrumentTab');
  }

  if (isAdmin.value) {
    // Jika user adalah admin, atur tab default ke 'paud'
    activeKelas.value = 'paud';
  } else {
    // Jika user biasa, atur tab aktif sesuai kelasnya dari localStorage
    activeKelas.value = userKelas.value;
  }
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});




// Watchers
watch([activeKelas, activeInstrument], async ([newKelas, newInstrument]) => {
  // Reset semua state yang relevan
  selectedSiswaId.value = null;
  raportData.value = [];
  currentRaport.value = null;
  waliKelas.value = '';
  uploadedFiles.value = [];

  if (!isAdmin.value && userKelas.value && newKelas.toLowerCase() !== userKelas.value.toLowerCase()) {
    isKelasValidForUser.value = false;
    return;
  }
  isKelasValidForUser.value = true;
  
  if (newInstrument === 'raport') {

    try {
      if (isAdmin.value) {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("Token tidak ditemukan, tidak bisa mengambil data.");
        return;
      }

      const templateResponse = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/template/${newKelas}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      waliKelas.value = templateResponse.data.data?.waliKelas || '';

     

      await fetchMateriForKelas(newKelas);
      await fetchSiswaByKelas(newKelas);
      } else {
        if (userKelas.value && newKelas.toLowerCase() === userKelas.value.toLowerCase()) {
          isKelasValidForUser.value = true;
          selectedSiswaId.value = userId.value;
          if (selectedSiswaId.value) {
            await fetchRaportBySiswa();
          }
        } else {
          isKelasValidForUser.value = false;
        }
      }
    } catch (error) {
      console.error("Gagal memuat data awal untuk raport:", error);
    }
  } else {
    if (isPdfType(newInstrument)) {
      await fetchUploadedFiles();
    }
  }
}, { immediate: true });



watch([selectedTahun, selectedSemester], () => {
  if (!isAdmin.value && selectedSiswaId.value) {
    fetchRaportBySiswa();
  }
});



watchEffect(() => {
   if (raportData.value && raportData.value.length > 0 && progressChart.value) {
  
    renderChart();
  }
});

</script>

<style scoped>
/* Base Styles */
.page-container {
  font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #2d3748;
  background-color: #f7fafc;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
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
  background: linear-gradient(135deg, #4299e1, #3182ce);
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
  background: linear-gradient(135deg, #014283, #0277bd);
  color: #ffffff;
  padding: 4rem 1rem;
  position: relative;
  overflow: hidden;
  margin-bottom: 2rem;
  text-align: center;
}

.header-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to right, #014283, #014283);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  padding: 0 1rem;
}

.page-header h1 {
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
  color: #ebf8ff;
}

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
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, #ffffff 0%, transparent 70%);
  border-radius: 50%;
  top: -100px;
  right: -100px;
}

.decoration-pattern {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54 50.41a5.4 5.4 0 0 1-5.4 5.4H11.4a5.4 5.4 0 0 1-5.4-5.4V9.59A5.4 5.4 0 0 1 11.4 4.2h37.2a5.4 5.4 0 0 1 5.4 5.4v40.81z' fill='none' stroke='%23ffffff' stroke-width='1' opacity='0.2'/%3E%3C/svg%3E");
}

/* Layout Styles */
.content-layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem 3rem;
}

/* Sidebar Styles (Desktop Only) */
.sidebar.desktop-only {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 1.5rem 0;
  position: sticky;
  top: 1rem;
  height: fit-content;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.5rem 1rem;
  border-bottom: 1px solid #edf2f7;
  margin-bottom: 0.5rem;
}

.sidebar-header h3 {
  font-size: 1.1rem;
  color: #2d3748;
  font-weight: 600;
  margin: 0;
}

.sidebar-icon {
  color: #718096;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-nav {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
}

.sidebar-btn {
  width: 100%;
  text-align: left;
  padding: 0.85rem 1.5rem;
  border: none;
  background: none;
  color: #4a5568;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
}

.sidebar-btn:hover {
  background-color: #ebf8ff;
  color: #3182ce;
}

.sidebar-btn.active {
  background-color: #ebf8ff;
  color: #2b6cb0;
  font-weight: 600;
}

.sidebar-btn.active .btn-icon {
  color: #2b6cb0;
}

.btn-icon {
  color: #718096;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;
}

.btn-text {
  flex: 1;
}

.active-indicator {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: #3182ce;
  border-radius: 0 4px 4px 0;
}

/* Mobile Dropdown Menu */
.mobile-menu.mobile-only {
  display: none;
  margin-bottom: 1.5rem;
}

.dropdown {
  position: relative;
  width: 100%;
}

.dropdown-toggle {
  width: 100%;
  padding: 0.85rem 1.5rem;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #2d3748;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.dropdown-toggle:hover {
  border-color: #bee3f8;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  width: 100%;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
  overflow: hidden;
}

.dropdown-menu li button {
  width: 100%;
  padding: 0.75rem 1.5rem;
  text-align: left;
  border: none;
  background: none;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dropdown-menu li button:hover {
  background-color: #ebf8ff;
}

.dropdown-menu li button.active {
  color: #3182ce;
  font-weight: 600;
}

/* Animation for dropdown */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

/* Main Panel Styles */
.main-panel {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

/* Tabs Navigation */
.tabs-nav {
  border-bottom: 1px solid #edf2f7;
  padding: 0 1.5rem;
  position: relative;
}

.tabs-scroll {
  display: flex;
  overflow-x: auto;
  scrollbar-width: none;
  padding-bottom: 2px;
}

.tabs-scroll::-webkit-scrollbar {
  display: none;
}

.tab-btn {
  padding: 1rem 1.25rem;
  border: none;
  background: none;
  color: #718096;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  white-space: nowrap;
  flex-shrink: 0;
}

.tab-btn:hover {
  color: #3182ce;
}

.tab-btn.active {
  color: #2b6cb0;
  font-weight: 600;
}

.tab-btn.active .tab-icon {
  color: #3182ce;
}

.tab-icon {
  color: #a0aec0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;
}

.tab-indicator {
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 3px;
  background-color: #3182ce;
  border-radius: 3px 3px 0 0;
}

/* Content Section */
.content-section {
  padding: 1.5rem;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #edf2f7;
}

.content-header h2 {
  font-size: 1.5rem;
  color: #2d3748;
  margin: 0;
}

.content-badge {
  background-color: #ebf8ff;
  color: #2b6cb0;
  padding: 0.35rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.text-content {
  line-height: 1.8;
  color: #4a5568;
}

.text-content p {
  margin-bottom: 1rem;
}

.text-content strong {
  color: #2d3748;
}

.loading-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: #718096;
}

.loading-indicator .spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #3182ce;
  animation: spin 1s ease-in-out infinite;
  margin-right: 8px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.admin-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px dashed #e2e8f0;
}

.upload-btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  background-color: #4299e1;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.upload-btn:hover {
  background-color: #3182ce;
}

.delete-btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  background-color: #fff5f5;
  color: #e53e3e;
  cursor: pointer;
  transition: background-color 0.3s;
}

.delete-btn:hover {
  background-color: #fed7d7;
}

/* PDF Content Styles */
.pdf-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  background-color: #f8fafc;
  border-radius: 8px;
  text-align: center;
  border: 1px dashed #cbd5e0;
}

.pdf-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.pdf-icon {
  width: 80px;
  height: 80px;
  background-color: #fff5f5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.pdf-preview h3 {
  color: #2d3748;
  margin: 0;
  font-size: 1.25rem;
}

.pdf-preview p {
  color: #718096;
  font-size: 0.95rem;
  margin: 0;
}

.pdf-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #e53e3e;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.pdf-link:hover {
  background-color: #c53030;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.pdf-link[disabled] {
  background-color: #a0aec0;
  cursor: not-allowed;
}

.pdf-link[disabled]:hover {
  transform: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Animation for content */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Uploaded Files List Styles */
.uploaded-files-list {
  width: 100%;
  margin-top: 1.5rem;
  border-top: 1px dashed #e2e8f0;
  padding-top: 1.5rem;
}

.uploaded-files-list h4 {
  color: #2d3748;
  font-size: 1rem;
  margin-bottom: 0.75rem;
  text-align: left;
}

.uploaded-files-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #edf2f7;
   border-radius: 8px; 
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
}

.file-item:hover {
  background-color: #e2f0ff; 
  box-shadow: 0 2px 8px rgba(0,0,0,0.05); 
}

.file-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.file-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #3182ce;
  text-decoration: none;
  flex-grow: 1;
}

.file-name {
  font-weight: 500;
}

.file-size {
  color: #718096;
  font-size: 0.85rem;
}

.file-actions {
  margin-left: 1rem;
}

.file-date {
  margin-left: 8px;
  font-size: 0.8rem;
  color: #6c757d;
}

.delete-btn-small {
  background: none;
  border: none;
  color: #e53e3e;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-btn-small:hover {
  color: #c53030;
}

.file-icon {
  flex-shrink: 0;
  color: #555;
}

.empty-list-message {
  text-align: center;
  padding: 20px;
  color: #888;
  border: 1px dashed #ddd;
  border-radius: 8px;
  margin-top: 15px;
}

/* Raport Container Styles */
.raport-container {
  --primary-blue: #4A90E2;
  --light-blue: #EAF2FD;
  --dark-blue: #357ABD;
  --text-dark: #2c3e50;
  --text-light: #7f8c8d;
  --bg-light: #F9FAFB;
  --border-color: #E5E7EB;
  --success-color: #28a745;
  --danger-color: #e74c3c;
  --white-color: #ffffff;
}

/* Raport Header Styles */
.raport-header-container {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  animation: fadeInUp 0.6s ease-out forwards;
}

.raport-header-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1.5rem;
  border-bottom: 1px dashed #c3cfe2;
  margin-bottom: 1.5rem;
}

.raport-identity h3 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
  font-weight: 700;
}

.raport-school-info p {
  margin: 0.2rem 0;
  font-size: 0.9rem;
  color: #7f8c8d;
}

.student-photo-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #ebf5ff;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #4A90E2;
}

.student-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 0.8rem;
  color: #7f8c8d;
  font-weight: 500;
  margin-bottom: 0.3rem;
}

.info-value {
  font-size: 1rem;
  color: #2c3e50;
  font-weight: 600;
}

/* Filter Group Styles */
.filter-group {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: var(--bg-light);
  border-radius: 8px;
  flex-wrap: wrap;
}

.filter-item, .student-selector {
  display: flex;
  flex-direction: column;
}

.filter-item label, .student-selector label, .user-info label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-light);
  margin-bottom: 0.5rem;
  text-transform: uppercase;
}

.user-info span {
  font-weight: 600;
  color: var(--text-dark);
  padding: 0.75rem 0;
}

select, input[type="text"] {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--bg-light);
  transition: all 0.3s ease;
  min-width: 180px;
}

select:focus, input[type="text"]:focus {
  outline: none;
  border-color: var(--primary-blue);
  background-color: var(--white-color);
  box-shadow: 0 0 0 3px var(--light-blue);
}

/* Button Styles */
.btn-primary, .btn-secondary {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.btn-primary { 
  background-color: var(--primary-blue); 
  color: white; 
  flex-shrink: 0; 
}

.btn-secondary { 
  background-color: var(--text-light); 
  color: white; 
}

.btn-primary:hover { 
  background-color: var(--dark-blue); 
  transform: translateY(-2px); 
  box-shadow: 0 4px 8px rgba(0,0,0,0.15); 
}

.btn-secondary:hover { 
  background-color: var(--text-dark); 
  transform: translateY(-2px); 
  box-shadow: 0 4px 8px rgba(0,0,0,0.15); 
}

button:disabled { 
  background-color: #ccc; 
  cursor: not-allowed; 
  transform: none; 
  box-shadow: none; 
}

/* Table Container Styles */
.raport-table-container {
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  margin-bottom: 2rem;
  animation: fadeInUp 0.6s ease-out forwards;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.table-header h4 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.2rem;
}

.table-summary {
  display: flex;
  gap: 1.5rem;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.summary-label {
  font-size: 0.85rem;
  color: #7f8c8d;
}

.summary-value {
  font-weight: 600;
  color: #4A90E2;
  font-size: 1.1rem;
}

.table-responsive {
  overflow-x: auto;
}

/* Raport Table Styles */
.raport-table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  border-radius: 12px;
  overflow: hidden;
  animation: fadeIn 0.5s ease-out;
}

.raport-table th, .raport-table td {
  padding: 1rem 1.25rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.raport-table thead th {
  background-color: var(--bg-light);
  color: var(--text-dark);
  font-weight: 600;
  font-size: 0.85rem;
}

.raport-table tbody tr {
  transition: background-color 0.3s ease;
}

.raport-table tbody tr:hover {
  background-color: var(--light-blue);
  transform: translateX(5px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.raport-table td:first-child { 
  font-weight: 600; 
  color: var(--primary-blue); 
}

.raport-table td:nth-child(2) { 
  font-weight: 500; 
}

.raport-table td { 
  color: var(--text-light); 
}

/* Action Buttons */
.delete-btn-small, .edit-btn-small {
  background: none;
  border: none;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  line-height: 0;
  margin: 0 4px;
  transition: all 0.2s ease;
}

.delete-btn-small { 
  color: var(--danger-color); 
}

.edit-btn-small { 
  color: var(--primary-blue); 
}

.delete-btn-small:hover { 
  background-color: #FEECEB; 
  transform: scale(1.1); 
}

.edit-btn-small:hover { 
  background-color: var(--light-blue); 
  transform: scale(1.1); 
}

/* Progress Chart Styles */
.progress-chart {
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  margin-bottom: 2rem;
  animation: fadeInUp 0.6s ease-out forwards;
}

.progress-chart h4 {
  margin: 0 0 1.5rem 0;
  color: #2c3e50;
  font-size: 1.2rem;
}

.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}

.chart-legend {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1.5rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-color {
  width: 15px;
  height: 15px;
  border-radius: 3px;
}

.legend-label {
  font-size: 0.85rem;
  color: #7f8c8d;
}

/* Catatan Guru Styles */
.catatan-guru-section, .catatan-guru-display {
  margin-top: 2.5rem;
  padding: 2rem;
  background-color: var(--bg-light);
  border-radius: 12px;
  border-top: 1px solid var(--border-color);
  animation: fadeInUp 0.6s ease-out forwards;
}

.admin-actions {
  margin-top: 2rem;
  padding: 1.5rem;
  background-color: var(--bg-light);
  border-radius: 12px;
  border-top: 1px solid var(--border-color);
  animation: fadeInUp 0.6s ease-out forwards;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.admin-actions h4, .catatan-guru-section h4 {
  width: 100%;
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: var(--text-dark);
  font-weight: 600;
  text-align: left;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.8rem;
  color: var(--text-light);
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input, .form-group select {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--white-color);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #e2e8f0;
  padding-top: 1.5rem;
}

.submit-btn {
  padding: 0.75rem 1.5rem;
  background-color: #4299e1;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #3182ce;
}



.catatan-guru-section textarea {
  width: 100%;
  min-height: 100px;
  padding: 0.8rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-bottom: 1rem;
}

.catatan-guru-display p {
  background-color: var(--light-blue);
  border-left: 4px solid var(--primary-blue);
  padding: 1rem;
  border-radius: 4px;
  white-space: pre-wrap;
  color: var(--text-dark);
}

.empty-list-message p, .raport-content > h4 {
  text-align: center;
  color: var(--text-light);
  padding: 2rem;
  font-size: 1.1rem;
}

.raport-content > h4 {
  color: var(--text-dark);
  font-weight: 600;
  padding-bottom: 1rem;
}

/* Pesan Khusus */
p.error-message {
  font-size: 1.2rem;
  color: var(--danger-color);
  font-weight: 500;
  text-align: center;
  background-color: #FEECEB;
  padding: 1.5rem;
  border-radius: 12px;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 700px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

.modal-actions {
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn-kelola-template {
  display: inline-block;
  padding: 10px 18px;
  margin-left: 1rem;
  background-color: #28a745;
  color: white;
  border-radius: 6px;
  text-decoration: none;
  font-weight: bold;
  font-size: 0.9rem;
  transition: background-color 0.3s, transform 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-kelola-template:hover {
  background-color: #218838;
  transform: translateY(-2px);
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}


.rekap-absensi-section {
  margin-top: 2rem;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
}

.rekap-absensi-section h4 {
  margin-top: 0;
  margin-bottom: 1rem;
  border-bottom: 1px solid #dee2e6;
  padding-bottom: 0.5rem;
  font-size: 1.1rem;
  color: #343a40;
}

.absensi-summary {
  display: grid;
  /* 2 kolom di desktop */
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem 1.5rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 0.25rem 0;
}

.summary-item .label {
  color: #6c757d;
}

.summary-item .value {
  font-weight: 600;
  color: #212529;
}


/* Section Styles */
.rekap-absensi-section {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.section-title {
  display: flex;
  align-items: center;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f0f2f5;
}

.title-icon {
  margin-right: 0.75rem;
  font-size: 1.2em;
}

/* Status Cards Grid */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.status-card {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.status-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.status-icon {
  font-size: 1.8rem;
  margin-right: 1rem;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
}

.status-info {
  flex: 1;
}

.status-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #555;
  margin-bottom: 0.25rem;
}

.status-value {
  font-size: 1.4rem;
  font-weight: 700;
  color: #2c3e50;
}

.status-value .unit {
  font-size: 0.8rem;
  font-weight: 400;
  color: #7f8c8d;
}

.status-percentage {
  font-size: 0.85rem;
  font-weight: 500;
  margin-top: 0.25rem;
}

/* Card Colors */
.hadir {
  background: linear-gradient(135deg, #e3f9ee, #d0f2e1);
  border-left: 4px solid #2ecc71;
}

.hadir .status-icon {
  background: rgba(46, 204, 113, 0.2);
}

.hadir .status-percentage {
  color: #27ae60;
}

.sakit {
  background: linear-gradient(135deg, #fff4e5, #ffe8cc);
  border-left: 4px solid #e67e22;
}

.sakit .status-icon {
  background: rgba(230, 126, 34, 0.2);
}

.sakit .status-percentage {
  color: #d35400;
}

.izin {
  background: linear-gradient(135deg, #e8f4fc, #d4e9fa);
  border-left: 4px solid #3498db;
}

.izin .status-icon {
  background: rgba(52, 152, 219, 0.2);
}

.izin .status-percentage {
  color: #2980b9;
}

.alpa {
  background: linear-gradient(135deg, #fdeded, #fad9d9);
  border-left: 4px solid #e74c3c;
}

.alpa .status-icon {
  background: rgba(231, 76, 60, 0.2);
}

.alpa .status-percentage {
  color: #c0392b;
}

/* Total Section */
.total-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px dashed #e0e0e0;
}

.total-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.total-label {
  font-size: 1rem;
  font-weight: 500;
  color: #555;
}

.total-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
}

/* Progress Bar */
.progress-container {
  width: 100%;
  height: 10px;
  background: #f0f2f5;
  border-radius: 5px;
  margin-top: 0.5rem;
  position: relative;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #2ecc71, #27ae60);
  border-radius: 5px;
  transition: width 0.5s ease;
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: #7f8c8d;
}


/* Responsive Styles */
@media (max-width: 1024px) {
  .content-layout {
    grid-template-columns: 1fr;
  }
  
  .sidebar.desktop-only {
    display: none;
  }
  
  .mobile-menu.mobile-only {
    display: block;
  }
  
  .page-header h1 {
    font-size: 2.2rem;
  }
  
  .subtitle {
    font-size: 1.1rem;
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 3rem 1rem;
  }
  
  .content-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .content-header h2 {
    font-size: 1.3rem;
  }

  .filter-group {
    flex-direction: column; 
    align-items: stretch;   
    gap: 15px;    
  }
  
  .pdf-content {
    padding: 1.5rem;
  }
  
  .admin-actions {
    flex-direction: column;
  }
  
  .raport-header-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
  
  .student-photo-placeholder {
    align-self: center;
  }
  
  .table-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .table-summary {
    width: 100%;
    justify-content: space-between;
  }
  
  .form-grid {
    grid-template-columns: 1fr 1fr;
  }

  .file-details .file-name {
  text-align: left;
  width: 100%; 
}

.absensi-summary {
    
    grid-template-columns: 1fr;
  }


.summary-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .status-card {
    padding: 0.75rem;
  }
  
  .status-icon {
    width: 40px;
    height: 40px;
    font-size: 1.5rem;
  }
  
  .status-value {
    font-size: 1.2rem;
  }  

}

@media (max-width: 480px) {
  .page-header {
    padding: 2.5rem 1rem;
  }
  
  .page-header h1 {
    font-size: 1.8rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
  
  .content-section {
    padding: 1rem;
  }
  
  .pdf-link {
    width: 100%;
    justify-content: center;
  }
  
  .student-info-grid {
    grid-template-columns: 1fr;
  }
  
  .raport-identity h3 {
    font-size: 1.5rem;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }
  
  .rekap-absensi-section {
    padding: 1rem;
  }
}

/* Utility Classes */
.desktop-only {
  display: block;
}

.mobile-only {
  display: none;
}



@media (max-width: 1024px) {
  .desktop-only {
    display: none;
  }
  
  .mobile-only {
    display: block;
  }
}
</style>