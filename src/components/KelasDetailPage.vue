<template>
  <div class="page-container">
    <!-- Enhanced Header with Parallax Effect -->
    <header class="class-header" :style="{ 'background-image': `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${kelasInfo.fotoUrl})` }">
      <div class="header-content">
        <h1 class="animated-title">Kelas {{ kelasInfo.nama }}</h1>
        <p class="animated-subtitle">{{ kelasInfo.deskripsi }}</p>
        <div class="class-meta">
          <span class="meta-item">
            <i class="fas fa-users"></i> Usia {{ kelasInfo.rentangUsia.min }}-{{ kelasInfo.rentangUsia.max }} {{ kelasInfo.tahun }}
          </span>
          <span class="meta-item">
            <i class="fas fa-calendar-alt"></i> {{ jadwalList.length }} Jadwal
          </span>
        </div>
      </div>
    </header>

    <!-- Animated Navigation Tabs -->
    <nav class="content-nav">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        :class="{ active: activeView === tab.id, 'has-notification': tab.hasNotification }"
        @click="activeView = tab.id"
      >
        <i :class="tab.icon"></i>
        <span>{{ tab.label }}</span>
        <span v-if="tab.hasNotification" class="notification-badge"></span>
      </button>
    </nav>

    <!-- Main Content Area -->
    <main class="main-content">
      <!-- Loading Skeleton -->
      <div v-if="loading" class="skeleton-loader">
        <div class="skeleton-header"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
      </div>

      <!-- Jadwal Section -->
      <transition name="fade-slide" mode="out-in">
        <div v-if="activeView === 'jadwal' && !loading">
          <section class="content-section">
            <div class="section-header">
              <h2><i class="fas fa-calendar-alt"></i> Jadwal Pengajian</h2>
              <button v-if="isAdmin" @click="showAddSchedule = !showAddSchedule" class="add-button">
                <i :class="showAddSchedule ? 'fas fa-minus' : 'fas fa-plus'"></i>
                {{ showAddSchedule ? 'Batal' : 'Tambah' }}
              </button>
            </div>
            
            <div v-if="jadwalLoading" class="loading-spinner">
              <i class="fas fa-spinner fa-spin"></i> Memuat jadwal...
            </div>
            
            <div v-else>
              <div v-if="jadwalList.length === 0" class="empty-state">
                <i class="fas fa-calendar-times"></i>
                <p>Belum ada jadwal tersedia</p>
              </div>
              
              <div v-else class="schedule-cards">
                <div v-for="(item, index) in jadwalList" :key="item.id" class="schedule-card" :style="{ 'animation-delay': `${index * 0.1}s` }">
                  <div class="schedule-day">{{ item.hari }}</div>
                  <div class="schedule-time">
                    <i class="fas fa-clock"></i> {{ item.waktu }}
                  </div>
                  <div class="schedule-activity">{{ item.kegiatan }}</div>
                  <button v-if="isAdmin" @click="deleteJadwal(item.id)" class="delete-button">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
            
            <transition name="slide-down">
              <form v-if="isAdmin && showAddSchedule" @submit.prevent="addJadwal" class="add-form">
                <h3><i class="fas fa-plus-circle"></i> Tambah Jadwal Baru</h3>
                <div class="form-group">
                  <label><i class="fas fa-calendar-day"></i> Hari</label>
                  <select v-model="newJadwal.hari" required>
                    <option value="">Pilih Hari</option>
                    <option v-for="day in days" :value="day">{{ day }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label><i class="fas fa-clock"></i> Waktu</label>
                  <input type="time" v-model="newJadwal.waktu" required>
                </div>
                <div class="form-group">
                  <label><i class="fas fa-tasks"></i> Kegiatan</label>
                  <input v-model="newJadwal.kegiatan" placeholder="Apa yang akan dipelajari?" required>
                </div>
                <button type="submit" class="styled-button primary">
                  <i class="fas fa-save"></i> Simpan Jadwal
                </button>
              </form>
            </transition>
          </section>
        </div>
      </transition>

      <!-- Absensi Section -->
      <transition name="fade-slide" mode="out-in">
        <div v-if="activeView === 'absensi' && !loading">
          <section class="content-section">
            <div class="section-header">
              <h2><i class="fas fa-clipboard-check"></i> Absensi Santri</h2>
              <div class="view-switcher" v-if="isAdmin">
                 <button 
                    :class="{ active: absensiView === 'daftar' }" 
                    @click="absensiView = 'daftar'; fetchAbsensiBulanan()"
                  >
                    <i class="fas fa-list"></i> Rekap
                  </button>
                  <button 
                    :class="{ active: absensiView === 'form' }" 
                    @click="absensiView = 'form'; fetchAbsensi()"
                  >
                    <i class="fas fa-edit"></i> Edit
                  </button>
                      </div>
                    </div>



            <div v-if="!isAdmin" class="self-attendance-section">
          <h4><i class="fas fa-hand-pointer"></i> Absen Hari Ini</h4>

               <div class="date-picker-user">
                  <label for="self-attendance-date">Pilih Tanggal Absen:</label>
                  <input 
                    type="date" 
                    id="self-attendance-date"
                    v-model="selfAttendanceDate"
                  >
                </div>

          <div v-if="isCheckingAttendance" class="loading-spinner small">
            <i class="fas fa-spinner fa-spin"></i> Memeriksa status...
          </div>
          <div v-else class="attendance-status-box">
            <div v-if="attendanceToday">
              <p class="status-text">
                Anda tercatat <strong>{{ attendanceToday.status }}</strong> pada hari ini.
              </p>
              <p v-if="attendanceToday.keterangan" class="reason-text">
                Keterangan: {{ attendanceToday.keterangan }}
              </p>
              <div v-if="attendanceToday.markedBy === 'admin'" class="edited-by-admin">
                <i class="fas fa-user-shield"></i> Diubah oleh Admin
              </div>
            </div>
            <div v-else>
              <p v-if="!isSelectedDateAScheduleDay" class="status-text-muted">
                Tidak ada jadwal pengajian hari ini.
              </p>
              <div v-else class="attendance-options">
                <button @click="markSelfAttendance('Hadir')" class="styled-button present-btn">
                  <i class="fas fa-calendar-check"></i> Hadir
                </button>
                <button @click="openAttendanceForm('Izin')" class="styled-button excused-btn">
                  <i class="fas fa-envelope-open-text"></i> Izin
                </button>
                <button @click="openAttendanceForm('Sakit')" class="styled-button sick-btn">
                  <i class="fas fa-head-side-virus"></i> Sakit
                </button>
              </div>
            </div>
          </div>
        </div>

             <transition name="fade">
                <div v-if="showAttendanceModal" class="modal-overlay" @click.self="closeAttendanceModal">
                  <div class="modal-content">
                    <button @click="closeAttendanceModal" class="close-button">&times;</button>
                    <h3>Form Keterangan {{ selectedStatus }}</h3>
                    <p>Silakan isi alasan Anda tidak dapat hadir.</p>
                    <form @submit.prevent="markSelfAttendance(selectedStatus, attendanceReason)">
                      <div class="form-group">
                        <label for="keterangan">Keterangan</label>
                        <textarea 
                          id="keterangan"
                          v-model="attendanceReason"
                          rows="4"
                          placeholder="Contoh: Kurang enak badan"
                          required
                        ></textarea>
                      </div>
                      <button type="submit" class="styled-button primary" :disabled="isSubmittingAttendance">
                        <i v-if="isSubmittingAttendance" class="fas fa-spinner fa-spin"></i>
                        <span v-else>Kirim</span>
                      </button>
                    </form>
                  </div>
                </div>
              </transition>

            
            <div v-if="absensiView === 'daftar' || !isAdmin">
              <div class="month-selector">
                <button @click="prevMonth" class="nav-button">
                  <i class="fas fa-chevron-left"></i>
                </button>
                <h3>{{ formatBulan(selectedMonth) }}</h3>
                <button @click="nextMonth" class="nav-button">
                  <i class="fas fa-chevron-right"></i>
                </button>
              </div>
              
              <div v-if="absensiLoading" class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i> Memuat absensi...
              </div>
              
              <div v-else class="attendance-container">
                <div class="attendance-grid-wrapper">
                <div class="attendance-grid"
                :style="{ 'grid-template-columns': gridTemplateColumns }">
                  <div class="grid-header">
                    <div class="header-cell name-cell">Nama</div>
                    <div 
                      v-for="day in totalHari" 
                          :key="day" 
                          class="header-cell day-cell"
                        >
                          {{ day }}
                      </div>
                  </div>
                  
                  <div v-for="user in userList" :key="user.id" class="grid-row">
                    <div class="row-cell name-cell">
                      <img :src="`${apiBaseUrl}${user.profilePicture || '/default-profile.png'}`" 
                            class="author-avatar"
                            @error="handleImageError">
                     <span> {{ user.fullName }} </span>
                    </div>
                    <div 
                      v-for="day in totalHari" 
                      :key="day" 
                      :class="['row-cell', 'day-cell', getStatusClass(user.id, day)]"
                      :title="getAbsensiTooltip(user.id, day)"
                        @click="openEditModal(user, day)" >            
                      <i :class="getStatusIcon(user.id, day)"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
           </div>

            <div v-if="absensiView === 'form' && isAdmin">
              <div class="date-picker">
                <label><i class="fas fa-calendar-day"></i> Pilih Tanggal:</label>
                <input type="date" v-model="selectedDate" @change="fetchAbsensi">
              </div>
              
              <div v-if="absensiLoading" class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i> Memuat data...
              </div>
              
              <div v-else class="attendance-form">
                <div v-for="absen in absensiList" :key="absen.userId" class="attendance-item">
                  <div class="user-info">
                    <img
                    :src="`${apiBaseUrl}${absen.profilePicture || '/default-profile.png'}`" 
                            class="author-avatar"
                            @error="handleImageError">
                    <span>{{ absen.fullName }}</span>
                  </div>
                  <div class="status-selector">
                    <select v-model="absen.status" :class="absen.status.toLowerCase()">
                      <option value="Hadir">Hadir</option>
                      <option value="Izin">Izin</option>
                      <option value="Sakit">Sakit</option>
                      <option value="Alpa">Alpa</option>
                    </select>
                  </div>
                </div>
                
                <button @click="saveAbsensi" class="styled-button save-button">
                  <i class="fas fa-save"></i> Simpan Absensi
                </button>
              </div>
            </div>
          </section>
        </div>
      </transition>

      <transition name="fade">
  <div v-if="showEditModal" class="modal-overlay" @click.self="closeEditModal">
    <div class="modal-content" v-if="editingRecord">
      <button @click="closeEditModal" class="close-button">&times;</button>
      <h3>Edit Absensi</h3>
      <div class="edit-info">
        <span><i class="fas fa-user"></i> {{ editingRecord.fullName }}</span>
        <span><i class="fas fa-calendar-alt"></i> {{ new Date(editingRecord.tanggal).toLocaleDateString('id-ID', { dateStyle: 'full' }) }}</span>
      </div>
      
      <form @submit.prevent="saveAttendanceEdit">
        <div class="form-group">
          <label for="edit-status">Status</label>
          <select id="edit-status" v-model="editingRecord.status">
            <option v-for="stat in availableStatuses" :key="stat" :value="stat">
              {{ stat }}
            </option>
          </select>
        </div>
        
        <div class="form-group" v-if="editingRecord.status === 'Izin' || editingRecord.status === 'Sakit'">
          <label for="edit-keterangan">Keterangan</label>
          <textarea 
            id="edit-keterangan"
            v-model="editingRecord.keterangan"
            rows="4"
            placeholder="Isi alasan..."
          ></textarea>
        </div>

        <div class="form-actions">
              
              <button 
                v-if="isAdmin && editingRecord.id"
                type="button" 
                @click="handleDeleteAbsensi" 
                class="styled-button danger"
              >
                <i class="fas fa-trash"></i> Hapus Absensi
              </button>

              <button type="submit" class="styled-button primary">
                <i class="fas fa-save"></i> Simpan Perubahan
              </button>
              
            </div>

       
      </form>
    </div>
  </div>
</transition>


      <!-- Pengumuman Section -->
      <transition name="fade-slide" mode="out-in">
        <div v-if="activeView === 'pengumuman' && !loading">
          <section class="content-section">
            <div class="section-header">
              <h2><i class="fas fa-bullhorn"></i> Pengumuman & PR</h2>
              <button 
                v-if="isAdmin" 
                @click="pengumumanView = pengumumanView === 'list' ? 'form' : 'list'" 
                class="add-button"
              >
                <i :class="pengumumanView === 'list' ? 'fas fa-plus' : 'fas fa-list'"></i>
                {{ pengumumanView === 'list' ? 'Buat Baru' : 'Lihat Semua' }}
              </button>
            </div>
            
            <div v-if="pengumumanView === 'form' && isAdmin">
              <form @submit.prevent="addPengumuman" class="announcement-form">
                <div class="form-group">
                  <label><i class="fas fa-heading"></i> Judul</label>
                  <input v-model="newPengumuman.judul" placeholder="Judul pengumuman" required>
                </div>
                <div class="form-group">
                  <label><i class="fas fa-align-left"></i> Isi</label>
                  <textarea 
                    v-model="newPengumuman.isi" 
                    placeholder="Tulis pengumuman atau PR di sini..." 
                    rows="5" 
                    required
                  ></textarea>
                </div>
                <div class="form-actions">
                  <button type="button" @click="pengumumanView = 'list'" class="styled-button cancel-button">
                    <i class="fas fa-times"></i> Batal
                  </button>
                  <button type="submit" class="styled-button primary">
                    <i class="fas fa-paper-plane"></i> Kirim
                  </button>
                </div>
              </form>
            </div>
            
            <div v-else>
              <div v-if="pengumumanLoading" class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i> Memuat pengumuman...
              </div>
              
              <div v-else class="announcements-container">
                <div v-if="pengumumanList.length === 0" class="empty-state">
                  <i class="fas fa-bullhorn"></i>
                  <p>Belum ada pengumuman</p>
                </div>
                
               <transition-group name="staggered-fade" tag="div">
                  <template v-for="(item, index) in pengumumanList" :key="item.id">
                    
                    <div 
                      v-if="item && item.createdByUser"
                      class="announcement-card"
                      :style="{ 'transition-delay': `${index * 0.05}s` }"
                    >
                      <div v-if="editingPengumumanId !== item.id">
                        <div class="card-header">
                          <div class="author-info">
                            <img 
                              :src="`${apiBaseUrl}${item.createdByUser.profilePicture || '/default-profile.png'}`" 
                              class="author-avatar"
                              @error="handleImageError"
                            >
                            <div>
                              <div class="post-meta">
                                <router-link :to="`/profil/${item.createdByUser.id}`" class="author-name clickable">
                                  {{ item.createdByUser.fullName || 'Admin' }}
                                </router-link>
                                <span class="post-date">{{ formatTanggal(item.createdAt) }}</span>
                                <h3 class="announcement-title">{{ item.judul }}</h3>
                              </div>
                            </div>
                          </div>
                          <div v-if="isAdmin" class="card-actions">
                            <button @click="enterEditMode(item)" class="icon-button edit"><i class="fas fa-edit"></i></button>
                            <button @click="deletePengumuman(item.id)" class="icon-button delete"><i class="fas fa-trash"></i></button>
                          </div>
                        </div>
                        <div class="card-content">
                          <p class="announcement-text">{{ item.isi }}</p>
                        </div>
                        <div class="card-footer">
                          <div class="comment-count">
                            <i class="fas fa-comments"></i> {{ item.komentar.length }} Komentar
                          </div>
                          <button @click="toggleComments(item.id)" class="comment-toggle">
                            {{ showComments[item.id] ? 'Sembunyikan' : 'Lihat' }} Komentar
                          </button>
                        </div>
                      </div>
                      
                      <div v-else class="edit-view">
                        <input v-model="editablePengumuman.judul" class="edit-input">
                        <textarea v-model="editablePengumuman.isi" class="edit-textarea" rows="5"></textarea>
                        <div class="edit-actions">
                          <button @click="cancelEdit" class="styled-button cancel-button small">
                            <i class="fas fa-times"></i> Batal
                          </button>
                          <button @click="saveEdit(item.id)" class="styled-button save-button small">
                            <i class="fas fa-save"></i> Simpan
                          </button>
                        </div>
                      </div>
                      
                      <transition name="slide-down">
                        <div v-if="showComments[item.id]" class="comments-section">
                          <div class="comments-list">
                            <div 
                              v-for="komen in item.komentar" 
                              :key="komen.id" 
                              class="comment-item"
                            >
                              <div class="comment-header">
                                <div class="comment-user">
                                  <img 
                                    :src="`${apiBaseUrl}/default-profile.png`" 
                                    class="comment-avatar"
                                    @error="handleImageError"
                                  >
                                  <div class="comment-user-info">
                                    <router-link :to="`/profil/${komen.author?.id}`" class="comment-author-name clickable">
                                      <strong>{{ komen.author?.fullName || 'User Dihapus' }}</strong>
                                    </router-link>
                                    <span class="comment-time">{{ formatWaktuKomentar(komen.createdAt || komen.tanggal) }}</span>
                                  </div>
                                </div>
                                <button 
                                  v-if="isAdmin" 
                                  @click="deleteKomentar(item.id, komen.id)" 
                                  class="delete-comment-btn"
                                  title="Hapus Komentar"
                                >
                                  <i class="fas fa-times"></i>
                                </button>
                              </div>
                              <p class="comment-content">{{ komen.isi }}</p>
                            </div>
                          </div>
                          
                          <form @submit.prevent="addKomentar(item.id)" class="comment-form">
                            <div class="input-with-emoji">
                              <textarea 
                                v-model="newKomentar[item.id]" 
                                placeholder="Tulis komentar..."
                                rows="2"
                              ></textarea>
                              <button 
                                type="button" 
                                @click="toggleEmojiPicker(item.id)" 
                                class="emoji-button"
                              >
                                <i class="far fa-smile"></i>
                              </button>
                              <EmojiPicker 
                                v-if="showEmojiPicker[item.id]" 
                                :native="true" 
                                @select="(emoji) => onSelectEmoji(item.id, emoji)" 
                                class="emoji-picker"
                              />
                            </div>
                            <div class="comment-action">
                              <button type="submit" class="styled-button primary small">
                                <i class="fas fa-paper-plane"></i> Kirim
                              </button>
                            </div>
                          </form>
                        </div>
                      </transition>
                    </div>

                    <div 
                      v-else-if="item"
                      class="announcement-card"
                      :style="{ 'transition-delay': `${index * 0.05}s` }"
                    >
                      <div class="card-header">
                        <div class="author-info">
                          <img 
                            :src="`${apiBaseUrl}/default-profile.png`" 
                                    class="comment-avatar"
                                    @error="handleImageError"
                          >
                          <div>
                            <div class="post-meta">
                              <span class="author-name">Pengguna Dihapus</span>
                              <span class="post-date">{{ formatTanggal(item.createdAt) }}</span>
                              <h3 class="announcement-title">{{ item.judul }}</h3>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="card-content">
                        <p class="announcement-text">{{ item.isi }}</p>
                      </div>
                    </div>

                  </template>
                </transition-group>
              </div>
            </div>
          </section>
        </div>
      </transition>

      <!-- Jurnal Section -->
      <transition name="fade-slide" mode="out-in">
        <div v-if="activeView === 'jurnal' && !loading">
          <section class="content-section">
            <div class="section-header">
              <h2><i class="fas fa-book-open"></i> Jurnal KBM</h2>
              <div class="view-switcher" v-if="isAdmin">
                <button 
                  :class="{ active: jurnalView === 'laporan' }" 
                  @click="jurnalView = 'laporan'"
                >
                  <i class="fas fa-list"></i> Laporan
                </button>
                <button 
                  :class="{ active: jurnalView === 'form' }" 
                  @click="jurnalView = 'form'"
                >
                  <i class="fas fa-plus"></i> Tambah
                </button>
              </div>
            </div>
            
            <div v-if="!isAdmin || jurnalView === 'laporan'">
              <div class="month-selector">
                <button @click="prevJurnalMonth" class="nav-button">
                  <i class="fas fa-chevron-left"></i>
                </button>
                <h3>{{ formatBulan(selectedJurnalMonth) }}</h3>
                <button @click="nextJurnalMonth" class="nav-button">
                  <i class="fas fa-chevron-right"></i>
                </button>
              </div>
              
              <div v-if="jurnalLoading" class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i> Memuat jurnal...
              </div>
              
              <div v-else class="journal-container">
                <div v-if="jurnalList.length === 0" class="empty-state">
                  <i class="fas fa-book-open"></i>
                  <p>Belum ada entri jurnal</p>
                </div>
                
                <div v-else class="journal-entries">
                  <div 
                    v-for="jurnal in jurnalList" 
                    :key="jurnal.id" 
                    class="journal-card"
                  >
                    <template v-if="editingJurnalId !== jurnal.id">
                      <div class="journal-date">
                        <div class="day">{{ new Date(jurnal.tanggal).getDate() }}</div>
                        <div class="month">{{ formatShortMonth(jurnal.tanggal) }}</div>
                      </div>
                      <div class="journal-content">
                        <h3>{{ jurnal.namaGuru }}</h3>
                        <h3>{{ jurnal.materi }}</h3>
                        <p v-if="jurnal.keterangan">{{ jurnal.keterangan }}</p>
                        <p v-else class="no-desc">Tidak ada keterangan tambahan</p>
                      </div>
                      <div v-if="isAdmin" class="journal-actions">
                        <button @click="enterJurnalEditMode(jurnal)" class="icon-button edit">
                          <i class="fas fa-edit"></i>
                        </button>
                        <button @click="deleteJurnal(jurnal.id)" class="icon-button delete">
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </template>
                    
                    <template v-else>
                      <div class="journal-edit-form">
                        <div class="form-group">
                          <label><i class="fas fa-calendar-day"></i> Tanggal</label>
                          <input type="date" v-model="editableJurnal.tanggal">
                        </div>

                        <div class="form-group">
                          <label><i class="fas fa-user-tie"></i> Nama Guru</label>
                          <input type="text" v-model="editableJurnal.namaGuru">
                        </div>

                        <div class="form-group">
                          <label><i class="fas fa-book"></i> Materi</label>
                          <input type="text" v-model="editableJurnal.materi">
                        </div>
                        <div class="form-group">
                          <label><i class="fas fa-info-circle"></i> Keterangan</label>
                          <textarea v-model="editableJurnal.keterangan" rows="3"></textarea>
                        </div>
                        <div class="form-actions">
                          <button @click="cancelJurnalEdit" class="styled-button cancel-button small">
                            <i class="fas fa-times"></i> Batal
                          </button>
                          <button @click="saveJurnalEdit(jurnal.id)" class="styled-button save-button small">
                            <i class="fas fa-save"></i> Simpan
                          </button>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-if="isAdmin && jurnalView === 'form'">
              <form @submit.prevent="addJurnal" class="journal-form">
                <h3><i class="fas fa-plus-circle"></i> Tambah Jurnal Baru</h3>
                
                <div class="form-group">
                  <label><i class="fas fa-calendar-day"></i> Tanggal</label>
                  <input type="date" v-model="newJurnal.tanggal" required>
                </div>

                <div class="form-group">
                  <label for="jurnal-guru">
                    <i class="fas fa-user-tie"></i>Nama Guru</label>
                  <input id="jurnal-guru" type="text" v-model="newJurnal.namaGuru" placeholder="Nama pengajar" required />
                </div>
                
                <div class="form-group">
                  <label><i class="fas fa-book"></i> Materi yang Disampaikan</label>
                  <input 
                    type="text" 
                    v-model="newJurnal.materi" 
                    placeholder="Contoh: Al-Qur'an surat Al-Baqoroh ayat 1-5" 
                    required
                  >
                </div>
                
                <div class="form-group">
                  <label><i class="fas fa-info-circle"></i> Keterangan Tambahan</label>
                  <textarea 
                    v-model="newJurnal.keterangan" 
                    rows="4" 
                    placeholder="Contoh: Kendala atau masukan dari siswa"
                  ></textarea>
                </div>
                
                <button type="submit" class="styled-button save-button">
                  <i class="fas fa-save"></i> Simpan Jurnal
                </button>
              </form>
            </div>
          </section>
        </div>
      </transition>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, inject } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import EmojiPicker from 'vue3-emoji-picker';
import 'vue3-emoji-picker/css';



const route = useRoute();
const namaKelas = ref(route.params.namaKelas);
const isAdmin = computed(() => localStorage.getItem('userRole') === 'admin');
const token = localStorage.getItem('token');
const loading = ref(false);
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const showNotification = inject('showNotification');
const userId = localStorage.getItem('userId'); 
const isCheckingAttendance = ref(false);
const showAttendanceModal = ref(false);
const selectedStatus = ref('');
const attendanceReason = ref('');
const isSubmittingAttendance = ref(false);
const selfAttendanceDate = ref(new Date().toISOString().slice(0, 10));
const showEditModal = ref(false);
const editingRecord = ref(null);


// Enhanced class information
const dataInfoKelas = {
  paud: {
    nama: 'PAUD',
    deskripsi: 'Belajar sambil bermain untuk fondasi 29 Karakter Luhur Jama\'ah ',
    fotoUrl: '/foto-paud.jpg',
    rentangUsia: { min: 4, max: 6  },
    tahun: 'Tahun',
    icon: 'fas fa-child'
  },
  caberawit: {
    nama: 'Caberawit',
    deskripsi: 'Membaca, menghafal, dan memahami dasar-dasar 29 Karakter Luhur Jama\'ah',
    fotoUrl: '/foto-caberawit.jpg',
    rentangUsia: { min: 7, max: 12 },
    tahun: 'Tahun',
    icon: 'fas fa-quran'
  },
  'pra-remaja': {
    nama: 'Pra Remaja',
    deskripsi: 'Mengkaji Al-Qur\'an & Al-Hadits untuk membentuk 29 Karakter Luhur Jama\'ah',
    fotoUrl: '/foto-pra-remaja.jpg',
    rentangUsia: { min: 13, max: 15 },
    tahun: 'Tahun',
    icon: 'fas fa-mosque'
  },
  remaja: {
    nama: 'Remaja',
    deskripsi: 'Mengkaji Al-Qur\'an & Al-Hadits untuk menerapkan 29 Karakter Luhur Jama\'ah',
    fotoUrl: '/foto-remaja.jpg',
    rentangUsia: { min: 16, max: 18 },
    tahun: 'Tahun',
    icon: 'fas fa-users'
  },
  'pra-nikah': {
    nama: 'Pra Nikah',
    deskripsi: 'Membiasakan 29 Karakter Luhur Jama\'ah untuk Mempersiapkan bekal membangun keluarga sakinah mawaddah warohmah',
    fotoUrl: '/foto-pra-nikah.jpeg',
    rentangUsia: { min: "18+ ", max: " Belum Menikah" },
    icon: 'fas fa-heart'
  }
};

const kelasInfo = computed(() => {
  return dataInfoKelas[namaKelas.value] || {};
});

// Navigation tabs with icons and notifications
const tabs = ref([
  { id: 'jadwal', label: 'Jadwal', icon: 'fas fa-calendar-alt', hasNotification: false },
  { id: 'absensi', label: 'Absensi', icon: 'fas fa-clipboard-check', hasNotification: false },
  { id: 'pengumuman', label: 'Pengumuman', icon: 'fas fa-bullhorn', hasNotification: true },
  { id: 'jurnal', label: 'Jurnal', icon: 'fas fa-book-open', hasNotification: false }
]);

const activeView = ref('jadwal');
const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

// --- Jadwal Logic ---
const jadwalList = ref([]);
const jadwalLoading = ref(true);
const showAddSchedule = ref(false);
const newJadwal = ref({ 
  kelas: namaKelas.value, 
  hari: '', 
  waktu: '', 
  kegiatan: '' 
});

async function fetchJadwal() {
  jadwalLoading.value = true;
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/jadwal/${namaKelas.value}`, { 
      headers: { 'Authorization': `Bearer ${token}` } 
    });
    jadwalList.value = response.data;
  } catch (error) { 
    console.error('Gagal mengambil jadwal:', error);
    // Show error to user
  } finally { 
    jadwalLoading.value = false;
  }
}

async function addJadwal() {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/jadwal`, newJadwal.value, { 
      headers: { 'Authorization': `Bearer ${token}` } 
    });
    jadwalList.value.push(response.data);
    newJadwal.value = { 
      kelas: namaKelas.value, 
      hari: '', 
      waktu: '', 
      kegiatan: '' 
    };
    showAddSchedule.value = false;
    // Show success notification
    showNotification('Jadwal berhasil disimpan!', 'success');
  } catch (error) {
    console.error('Gagal menambah jadwal:', error);
    // Show error to user
  }
}

async function deleteJadwal(id) {
  if (!confirm('Anda yakin ingin menghapus jadwal ini?')) return;
  try {
    await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/jadwal/${id}`, { 
      headers: { 'Authorization': `Bearer ${token}` } 
    });
    jadwalList.value = jadwalList.value.filter(item => item.id !== id);
    // Show success notification
    showNotification('Jadwal berhasil dihapus!', 'success');
  } catch (error) {
    console.error('Gagal menghapus jadwal:', error);
    // Show error to user
  }
}

// --- Absensi Logic ---
const userList = ref([]);
const absensiList = ref([]);
const absensiLoading = ref(true);
const absensiView = ref('daftar');
const absensiData = ref([]);
const selectedDate = ref(new Date().toISOString().slice(0, 10));
const selectedMonth = ref(new Date().toISOString().slice(0, 7));
const showComments = ref({});

const totalHari = computed(() => {
  const [year, month] = selectedMonth.value.split("-");
  return new Date(year, month, 0).getDate();
});

async function fetchAllUsers() {
  try {
    const response = await axios.get(`${apiBaseUrl}/api/users/kelas/${namaKelas.value}`, { 
      headers: { 'Authorization': `Bearer ${token}` } 
    });
    
   if (Array.isArray(response.data)) {
        userList.value = response.data.filter(user => user && user.id);
    } else {
        userList.value = [];
    }

  } catch (error) { 
    console.error("Gagal mengambil daftar user:", error);
    userList.value = [];
  }
}



async function fetchAbsensi() {
  absensiLoading.value = true;
  try {
    await fetchAllUsers(); 

     const response = await axios.get(`${apiBaseUrl}/api/absensi/${namaKelas.value}/${selectedDate.value}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const existingAttendance = response.data;


    absensiList.value = userList.value.map(user => {

      const userAttendance = existingAttendance.find(att => {
       
        const userIdFromAtt = att.userId?.id || att.userId;
        return userIdFromAtt === user.id;
      });

      
      return {
        userId: user.id,
        fullName: user.fullName || user.username,
        profilePicture: user.profilePicture,
        tanggal: selectedDate.value,
      
        status: userAttendance ? userAttendance.status : 'Alpa'
      };
    });

  } catch (error) {
    console.error('Gagal mengambil data absensi:', error);

    absensiList.value = userList.value.map(user => ({
      userId: user.id,
      fullName: user.fullName || user.username,
      profilePicture: user.profilePicture,
      tanggal: selectedDate.value,
      status: 'Alpa'
    }));
  } finally {
    absensiLoading.value = false;
  }
}

async function fetchAbsensiBulanan() {
  absensiLoading.value = true;
  try {
      await fetchAllUsers();

       if (userList.value.length === 0) {
      absensiData.value = [];
      return; 
    }

   
      const cacheBuster = `?_t=${new Date().getTime()}`;
    const url = `${apiBaseUrl}/api/absensi/rekap/${namaKelas.value}/${selectedMonth.value}${cacheBuster}`;
    // =======================

    const response = await axios.get(url, { 
      headers: { 'Authorization': `Bearer ${token}` }
    });


    absensiData.value = response.data;

  } catch (error) {
    console.error('Gagal mengambil data absensi bulanan:', error);
   
    absensiData.value = []; 
    showNotification('Gagal memuat data rekap absensi.', 'error');
  } finally {
    absensiLoading.value = false;
  }
}




async function saveAbsensi() {
  try {
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/absensi`, {
      kelas: namaKelas.value,
      tanggal: selectedDate.value,
      absensi: absensiList.value 
    }, { headers: { 'Authorization': `Bearer ${token}` } });
    // Show success notification
    showNotification('Absensi berhasil disimpan!');
    await fetchAbsensiBulanan();
  } catch (error) { 
    console.error('Gagal menyimpan absensi:', error);
    // Show error to user
  }
}




async function handleDeleteAbsensi() {
 
  if (!editingRecord.value || !editingRecord.value.id) {
    showNotification('Record absensi tidak ditemukan untuk dihapus.', 'error');
    return;
  }


  if (!confirm('Anda yakin ingin menghapus data absensi ini? Aksi ini tidak dapat dibatalkan.')) {
    return;
  }

  try {
    
    await axios.delete(`${apiBaseUrl}/api/absensi/${editingRecord.value.id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

 
    showNotification('Absensi berhasil dihapus!', 'success');
    closeEditModal();
    
    
    await fetchAbsensiBulanan();

  } catch (error) {
    console.error('Gagal menghapus absensi:', error);
    showNotification(error.response?.data?.message || 'Gagal menghapus absensi.', 'error');
  }
}


function getAbsensiStatus(userId, day) {
  const [year, month] = selectedMonth.value.split('-').map(Number);
  const record = absensiData.value.find(absen => {
    if (!absen.userId) return false;
    const absenDate = new Date(absen.tanggal);
    return absen.userId === userId &&
           absenDate.getFullYear() === year &&
           absenDate.getMonth() + 1 === month &&
           absenDate.getDate() === day;
  });
  return record ? record.status : '';
}

function getAbsensiTooltip(userId, day) {
    const record = getAbsensiRecord(userId, day);
    if (!record) return '';

    let tooltipText = `${record.status} - ${day} ${formatBulan(selectedMonth.value)}`;
    
    // Tambahkan keterangan jika statusnya Izin atau Sakit dan keterangan ada
    if ((record.status === 'Izin' || record.status === 'Sakit') && record.keterangan) {
        tooltipText += `\nKeterangan: ${record.keterangan}`;
    }
    return tooltipText;
}


function getAbsensiRecord(userId, day) {
    const [year, month] = selectedMonth.value.split('-').map(Number);
    return absensiData.value.find(absen => {
        if (!absen.userId) return false;
        const absenDate = new Date(absen.tanggal);
        return absen.userId === userId &&
               absenDate.getUTCFullYear() === year &&
               absenDate.getUTCMonth() + 1 === month &&
               absenDate.getUTCDate() === day;
    }) || null;
}

function getStatusClass(userId, day) {
  const record = getAbsensiRecord(userId, day);
  return record ? record.status.toLowerCase() : '';
}


function getStatusIcon(userId, day) {
  const record = getAbsensiRecord(userId, day);
  if (!record) return 'fas fa-minus text-muted';
  switch(record.status) {
    case 'Hadir': return 'fas fa-check text-success';
    case 'Izin': return 'fas fa-envelope text-warning';
    case 'Sakit': return 'fas fa-procedures text-info';
    case 'Alpa': return 'fas fa-times text-danger';
    default: return 'fas fa-minus text-muted';
  }
}

function getUserAvatar(userId) {
  const user = userList.value.find(u => u.id === userId);
  if (!user) return '/default-profile.png';
  return user?.profilePicture || '/default-profile.png';
}

function prevMonth() {
  const [year, month] = selectedMonth.value.split('-').map(Number);
  const newMonth = month === 1 ? 12 : month - 1;
  const newYear = month === 1 ? year - 1 : year;
  selectedMonth.value = `${newYear}-${String(newMonth).padStart(2, '0')}`;
  fetchAbsensiBulanan();
}

function nextMonth() {
  const [year, month] = selectedMonth.value.split('-').map(Number);
  const newMonth = month === 12 ? 1 : month + 1;
  const newYear = month === 12 ? year + 1 : year;
  selectedMonth.value = `${newYear}-${String(newMonth).padStart(2, '0')}`;
  fetchAbsensiBulanan();
}


const isTodayAScheduleDay = computed(() => {
  const todayIndex = new Date().getDay();
  const todayDayName = days[todayIndex];
  return jadwalList.value.some(jadwal => jadwal.hari === todayDayName);
});


const attendanceToday = computed(() => {
   if (isAdmin.value || !selfAttendanceDate.value) {
    return null;
  }
  
  const currentUserId = localStorage.getItem('userId');
  const selectedDate = new Date(selfAttendanceDate.value);
  
 
  const targetDay = selectedDate.getUTCDate();
  const targetMonth = selectedDate.getUTCMonth() + 1; 
  const targetYear = selectedDate.getUTCFullYear();

    return absensiData.value.find(absen => {
    if (!absen.userId) return false;

    const absenDate = new Date(absen.tanggal);
    return absen.userId === currentUserId &&
           absenDate.getUTCDate() === targetDay &&
           absenDate.getUTCMonth() + 1 === targetMonth &&
           absenDate.getUTCFullYear() === targetYear;
  }) || null;
});


async function checkAttendanceToday() {
  if (!userId || isAdmin.value) return;
  isCheckingAttendance.value = true;
  try {
    const today = new Date().toISOString().slice(0, 10);

    const response = await axios.get(`${apiBaseUrl}/api/absensi/status/${userId}/${today}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    attendanceToday.value = response.data; 
  } catch (error) {
    if (error.response && error.response.status === 404) {
      attendanceToday.value = null;
    } else {
      console.error('Gagal memeriksa status absensi hari ini:', error);
    }
  } finally {
    isCheckingAttendance.value = false;
  }
}


async function checkSelfAttendanceStatus(date) {
  if (!userId || isAdmin.value || !date) return;
  isCheckingAttendance.value = true;
    
  setTimeout(() => {
    isCheckingAttendance.value = false;
  }, 200); 
}



async function markSelfAttendance(status, reason = null) {
  if (attendanceToday.value) {
    showNotification('Anda sudah melakukan absensi untuk tanggal ini.', 'info');
    return;
  }

  isSubmittingAttendance.value = true;
  try {

    const payload = { 
      tanggal: selfAttendanceDate.value,
      status: status,
      kelas: namaKelas.value,
      keterangan: reason
    };

    await axios.post(`${apiBaseUrl}/api/absensi/mandiri`, payload, { 
      headers: { 'Authorization': `Bearer ${token}` } 
    });
    
    showNotification('Kehadiran berhasil dicatat!', 'success');
    await checkSelfAttendanceStatus(selfAttendanceDate.value); 
    await fetchAbsensiBulanan(); 
    closeAttendanceModal();

  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Gagal mencatat kehadiran.';
    showNotification(errorMessage, 'error');
  } finally {
    isSubmittingAttendance.value = false;
  }
}



const isSelectedDateAScheduleDay = computed(() => {
  if (!selfAttendanceDate.value) return false;
 
  const date = new Date(selfAttendanceDate.value);
  const dayIndex = date.getUTCDay(); 
  const dayName = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][dayIndex];
  return jadwalList.value.some(jadwal => jadwal.hari === dayName);
});


function openAttendanceForm(status) {
  selectedStatus.value = status;
  attendanceReason.value = '';
  showAttendanceModal.value = true;
}


function closeAttendanceModal() {
  showAttendanceModal.value = false;
}


const availableStatuses = computed(() => {
  if (isAdmin.value) {
    return ['Hadir', 'Izin', 'Sakit', 'Alpa'];
  }
  // User tidak bisa menandai dirinya sendiri 'Alpa'
  return ['Hadir', 'Izin', 'Sakit'];
});


function openEditModal(user, day) {
   if (!user || !user.id) {
    console.error("Fungsi openEditModal dipanggil tanpa user yang valid.");
    return; 
  }

  const record = getAbsensiRecord(user.id, day);
   const canEdit = isAdmin.value || (record && record.userId === userId) || (!record && user.id === userId);
  
  if (!canEdit) {
      return;
  }


  const formattedDay = String(day).padStart(2, '0');
  const dateString = `${selectedMonth.value}-${formattedDay}`;
  
  editingRecord.value = record ? { ...record, fullName: user.fullName } : {
    id: null, 
    userId: user.id,
    fullName: user.fullName,
    tanggal: dateString,
    status: 'Hadir', 
    keterangan: ''
  };
  
  showEditModal.value = true;
}



function closeEditModal() {
  showEditModal.value = false;
  editingRecord.value = null;
}


async function saveAttendanceEdit() {
  if (!editingRecord.value) return;

    const payload = {
    status: editingRecord.value.status,
    keterangan: (editingRecord.value.status === 'Izin' || editingRecord.value.status === 'Sakit') 
                  ? editingRecord.value.keterangan 
                  : null,
    tanggal: editingRecord.value.tanggal,
    kelas: namaKelas.value,
    userId: editingRecord.value.userId 
  };

  try {
   
    await axios.post(`${apiBaseUrl}/api/absensi/admin`, payload, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    showNotification('Absensi berhasil disimpan oleh Admin!', 'success');
    closeEditModal();
   
    await fetchAbsensiBulanan();

  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Gagal menyimpan perubahan.';
    showNotification(errorMessage, 'error');
  }
}



// --- Pengumuman Logic ---
const pengumumanView = ref('list');
const pengumumanList = ref([]);
const pengumumanLoading = ref(true);
const newPengumuman = ref({ 
  kelas: namaKelas.value, 
  judul: '', 
  isi: '' 
});
const newKomentar = ref({});
const editingPengumumanId = ref(null);
const editablePengumuman = ref({ judul: '', isi: '' });
const showEmojiPicker = ref({});




async function fetchPengumuman() {
  pengumumanLoading.value = true;
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/pengumuman/${namaKelas.value}`, { 
      headers: { 'Authorization': `Bearer ${token}` } 
    });

    const dataYangValid = response.data.filter(item => {
     
      if (item && item.createdByUser) {
        return true;
      } else {
       
        console.warn('Data pengumuman tidak lengkap dan akan dilewati:', item);
        return false;
      }
    });

  
    pengumumanList.value = dataYangValid;
   
    pengumumanList.value.forEach(item => {
      showComments.value[item.id] = false;
    });

  } catch (error) { 
    console.error("Gagal mengambil pengumuman:", error);
    pengumumanList.value = []; 
  } finally { 
    pengumumanLoading.value = false;
  }
}





async function addKomentar(pengumumanId) {
  const isiKomentar = (newKomentar.value[pengumumanId] || '').trim();
  if (!isiKomentar) return;

  try {
    await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/pengumuman/${pengumumanId}/komentar`, 
      { isi: isiKomentar },
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    newKomentar.value[pengumumanId] = '';
    await fetchPengumuman();
  } catch (error) {
    console.error('Gagal mengirim komentar:', error);
    // Show error to user
  }
}



async function addPengumuman() {
  try {
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/pengumuman`, newPengumuman.value, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    newPengumuman.value.judul = '';
    newPengumuman.value.isi = '';
    pengumumanView.value = 'list';
    await fetchPengumuman();
    showNotification('Pengumuman berhasil disimpan!', 'success');
  } catch (error) {
    console.error('Gagal membuat pengumuman:', error);
    // Show error to user
  }
}



async function deletePengumuman(pengumumanId) {
  if (!confirm('Anda yakin ingin menghapus pengumuman ini?')) return;
  try {
    await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/pengumuman/${pengumumanId}`, { 
      headers: { 'Authorization': `Bearer ${token}` } 
    });
    await fetchPengumuman();
    showNotification('Pengumuman berhasil dihapus!', 'success');
  } catch (error) {
    console.error('Gagal menghapus pengumuman:', error);
    // Show error to user
  }
}



async function saveEdit(pengumumanId) {
  try {
    await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/pengumuman/${pengumumanId}`, editablePengumuman.value, { 
      headers: { 'Authorization': `Bearer ${token}` } 
    });
    cancelEdit();
    await fetchPengumuman();
    showNotification('Pengumuman berhasil diubah!', 'success');
  } catch (error) {
    console.error('Gagal menyimpan perubahan:', error);
    // Show error to user
  }
}



function enterEditMode(pengumuman) {
  editingPengumumanId.value = pengumuman.id;
  editablePengumuman.value = { ...pengumuman };
}

function cancelEdit() {
  editingPengumumanId.value = null;
}

function toggleComments(pengumumanId) {
  showComments.value[pengumumanId] = !showComments.value[pengumumanId];
}

function toggleEmojiPicker(pengumumanId) {
  showEmojiPicker.value[pengumumanId] = !showEmojiPicker.value[pengumumanId];
}

function onSelectEmoji(pengumumanId, emoji) {
  if (!newKomentar.value[pengumumanId]) {
    newKomentar.value[pengumumanId] = '';
  }
  newKomentar.value[pengumumanId] += emoji.i;
  showEmojiPicker.value[pengumumanId] = false;
}

async function deleteKomentar(pengumumanId, komentarId) {
  if (!confirm('Yakin ingin menghapus komentar ini?')) return;
  
  try {
    await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/pengumuman/${pengumumanId}/komentar/${komentarId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    await fetchPengumuman();
    showNotification('Komentar berhasil dihapus!', 'success');
  } catch (error) {
    console.error('Gagal menghapus komentar:', error);
    // Show error to user
  }
}

// --- Jurnal Logic ---
const jurnalList = ref([]);
const jurnalLoading = ref(true);
const selectedJurnalMonth = ref(new Date().toISOString().slice(0, 7));
const jurnalView = ref(isAdmin.value ? 'laporan' : 'laporan');
const newJurnal = ref({
  kelas: namaKelas.value,
  tanggal: new Date().toISOString().slice(0, 10),
  namaGuru: '',
  materi: '',
  keterangan: ''
});
const editingJurnalId = ref(null);
const editableJurnal = ref({ 
  tanggal: '', 
  namaGuru: '',
  materi: '', 
  keterangan: '' 
});

async function fetchJurnalBulanan() {
  jurnalLoading.value = true;

  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/jurnal/rekap/${namaKelas.value}/${selectedJurnalMonth.value}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const dataJurnal = response.data.data || []; 
    jurnalList.value = dataJurnal.sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));
   
  } catch (error) { 
    console.error("Gagal mengambil rekap jurnal:", error);
    jurnalList.value = [];
  } finally { 
    jurnalLoading.value = false;
  }
}

async function addJurnal() {
  try {
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/jurnal`, newJurnal.value, { 
      headers: { 'Authorization': `Bearer ${token}` } 
    });
    newJurnal.value.materi = '';
    newJurnal.value.keterangan = '';
    jurnalView.value = 'laporan';
    await fetchJurnalBulanan();
    showNotification('Jurnal berhasil disimpan!', 'success');
  } catch (error) {
    console.error('Gagal menyimpan jurnal:', error);
    // Show error to user
  }
}

function enterJurnalEditMode(jurnal) {
  editingJurnalId.value = jurnal.id;
  editableJurnal.value = { 
    ...jurnal,
    tanggal: new Date(jurnal.tanggal).toISOString().slice(0, 10)
  };
}

function cancelJurnalEdit() {
  editingJurnalId.value = null;
}

async function saveJurnalEdit(jurnalId) {
  try {
    await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/jurnal/${jurnalId}`, editableJurnal.value, { 
      headers: { 'Authorization': `Bearer ${token}` }
    });
    cancelJurnalEdit();
    await fetchJurnalBulanan();
    showNotification('Jurnal berhasil diubah!', 'success');
  } catch (error) {
    console.error('Gagal menyimpan perubahan jurnal:', error);
    // Show error to user
  }
}

async function deleteJurnal(jurnalId) {
  if (!confirm('Anda yakin ingin menghapus jurnal ini?')) return;
  try {
    await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/jurnal/${jurnalId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    await fetchJurnalBulanan();
    showNotification('Jurnal berhasil dihapus!', 'success');
  } catch (error) {
    console.error('Gagal menghapus jurnal:', error);
    // Show error to user
  }
}

function prevJurnalMonth() {
  const [year, month] = selectedJurnalMonth.value.split('-').map(Number);
  const newMonth = month === 1 ? 12 : month - 1;
  const newYear = month === 1 ? year - 1 : year;
  selectedJurnalMonth.value = `${newYear}-${String(newMonth).padStart(2, '0')}`;
  fetchJurnalBulanan();
}

function nextJurnalMonth() {
  const [year, month] = selectedJurnalMonth.value.split('-').map(Number);
  const newMonth = month === 12 ? 1 : month + 1;
  const newYear = month === 12 ? year + 1 : year;
  selectedJurnalMonth.value = `${newYear}-${String(newMonth).padStart(2, '0')}`;
  fetchJurnalBulanan();
}

// Helper functions
function formatBulan(yyyyMm) {
  const [year, month] = yyyyMm.split("-");
  const namaBulan = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  return `${namaBulan[parseInt(month, 10) - 1]} ${year}`;
}

function formatTanggal(tanggal) {
  return new Date(tanggal).toLocaleDateString('id-ID', {
    day: 'numeric', 
    month: 'long', 
    year: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit'
  });
}

function formatWaktuKomentar(tanggal) {
  if (!tanggal) return '';
  const dateObj = new Date(tanggal);
  return dateObj.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatSimpleDate(tanggal) {
  return new Date(tanggal).toLocaleDateString('id-ID', {
    day: 'numeric', 
    month: 'long', 
    year: 'numeric'
  });
}

function formatShortMonth(tanggal) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
  return months[new Date(tanggal).getMonth()];
}

function handleImageError(event) {
  event.target.src = '/default-profile.png';
}


const gridTemplateColumns = computed(() => {
  const baseWidth = window.innerWidth < 480 ? '120px' : 
                   window.innerWidth < 768 ? '140px' : '160px'
  const dayWidth = window.innerWidth < 480 ? '35px' : 
                  window.innerWidth < 768 ? '40px' : '50px'
  
  return `${baseWidth} repeat(${totalHari.value}, ${dayWidth})`
})


async function loadAllClassData() {
  loading.value = true;
  try {

      await Promise.all([
      fetchJadwal(),
      fetchAbsensiBulanan(), 
      fetchAbsensi(),         
      fetchPengumuman(),
      fetchJurnalBulanan()
    ]);
  } catch (error) {
      console.error("Gagal memuat semua data kelas:", error);
      showNotification('Gagal memuat data kelas.', 'error');
      
  }
  finally {
    loading.value = false;
  }
}



watch(selfAttendanceDate, (newDate) => {
  if (newDate) {
    checkSelfAttendanceStatus(newDate);
  }
});

watch(activeView, (newView) => {
  if (newView === 'absensi' && !isAdmin.value) {
    checkAttendanceToday();
  }
  
});


watch(() => route.params.namaKelas, (newKelas) => {
  if (newKelas && newKelas !== namaKelas.value) {
    namaKelas.value = newKelas;
    newJadwal.value.kelas = newKelas;
    newPengumuman.value.kelas = newKelas;
    newJurnal.value.kelas = newKelas;
    activeView.value = 'jadwal';
    loadAllClassData();
  }
}, { immediate: true });

onMounted(() => {
  loadAllClassData();
  if (!isAdmin.value) {
            checkSelfAttendanceStatus(selfAttendanceDate.value);
        }
});
</script>

<style scoped>
/* Base Styles */
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
  padding-top: 70px;
}

/* Header Styles */
.class-header {
  position: relative;
  height: 400px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  padding: 2rem;
  overflow: hidden;
}

.header-content {
  max-width: 800px;
  z-index: 2;
  animation: fadeIn 1s ease;
}

.animated-title {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  animation: slideDown 0.8s ease;
}

.animated-subtitle {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  animation: fadeIn 1.2s ease;
}

.class-meta {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1.5rem;
  animation: fadeIn 1.5s ease;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 50px;
  backdrop-filter: blur(5px);
}

/* Navigation Tabs */
.content-nav {
  display: flex;
  justify-content: center;
  background: white;
  padding: 1rem;
  border-bottom: 1px solid #ddd;
  position: sticky;
  top: 0;
  z-index: 100;
}

.content-nav button {
  padding: 0.8rem 1.5rem;
  margin: 0 0.5rem;
  border: none;
  border-radius: 50px;
  background: transparent;
  font-size: 1rem;
  font-weight: 600;
  color: #7f8c8d;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
}

.content-nav button:hover {
  color: #3498db;
  background: rgba(52, 152, 219, 0.1);
}

.content-nav button.active {
  color: white;
  background: #3498db;
  box-shadow: 0 4px 8px rgba(52, 152, 219, 0.3);
}

.content-nav button.has-notification::after {
  content: '';
  position: absolute;
  top: 5px;
  right: 5px;
  width: 8px;
  height: 8px;
  background: #e74c3c;
  border-radius: 50%;
}

/* Main Content */
.main-content {
  padding: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #ddd;
}

.section-header h2 {
  font-size: 1.8rem;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.view-switcher {
  display: flex;
  gap: 0.5rem;
}

.view-switcher button {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  background: white;
  color: #7f8c8d;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.view-switcher button.active {
  border-color: #3498db;
  background: rgba(52, 152, 219, 0.1);
  color: #3498db;
}

.add-button {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 5px;
  background: #3498db;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.add-button:hover {
  background: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* Loading States */
.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #7f8c8d;
  gap: 0.8rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #7f8c8d;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #bdc3c7;
}

/* Schedule Section */
.schedule-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.schedule-card {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  border-left: 5px solid #3498db;
  animation: fadeInUp 0.5s ease;
}

.schedule-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.schedule-day {
  font-size: 1.3rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.schedule-time {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #3498db;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.schedule-activity {
  color: #333;
  margin-bottom: 1rem;
}

.delete-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.delete-button:hover {
  background: rgba(231, 76, 60, 0.2);
}

/* Forms */
.add-form, .announcement-form, .journal-form {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
  animation: fadeIn 0.5s ease;
  
}

.add-form h3, .announcement-form h3, .journal-form h3 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.form-group {
  margin-bottom: 1.5rem;
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

.form-group input, 
.form-group select, 
.form-group textarea {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-group input:focus, 
.form-group select:focus, 
.form-group textarea:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}

.form-group textarea {
  min-height: 120px;
  resize: vertical;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

/* Buttons */
.styled-button {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.styled-button.primary {
  background: #3498db;
  color: white;
}

.styled-button.primary:hover {
  background: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 2px 10px rgba(52, 152, 219, 0.3);
}

.styled-button.save-button {
  background: #2ecc71;
  color: white;
}

.styled-button.save-button:hover {
  background: #27ae60;
  transform: translateY(-2px);
  box-shadow: 0 2px 10px rgba(46, 204, 113, 0.3);
}

.styled-button.cancel-button {
  background: #7f8c8d;
  color: white;
}

.styled-button.cancel-button:hover {
  background: #95a5a6;
  transform: translateY(-2px);
}

.styled-button.small {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.form-actions.spaced {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}


.styled-button.danger {
  background-color: #e74c3c;
  border-color: #c0392b;
  color: white;
}

.styled-button.danger:hover {
  background-color: #c0392b;
}

.icon-button {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: transparent;
}

.icon-button.edit {
  color: #f39c12;
}

.icon-button.edit:hover {
  background: rgba(243, 156, 18, 0.1);
}

.icon-button.delete {
  color: #e74c3c;
}

.icon-button.delete:hover {
  background: rgba(231, 76, 60, 0.1);
}

/* Attendance Section */
.month-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.month-selector h3 {
  font-size: 1.5rem;
  color: #2c3e50;
  min-width: 200px;
  text-align: center;
}

.nav-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #ddd;
  background: white;
  color: #7f8c8d;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-button:hover {
  border-color: #3498db;
  color: #3498db;
}

.attendance-container {
   width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch; 
  margin-bottom: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 10px 0;
}

.attendance-grid-wrapper {
  display: inline-block;
  min-width: 100%;
}


/* Style scrollbar */
.attendance-container::-webkit-scrollbar {
  height: 8px;
}

.attendance-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.attendance-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.attendance-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}


.attendance-grid {
  display: inline-grid;
  grid-template-columns: minmax(160px, 200px) repeat(var(--days-in-month), minmax(50px, 60px));
  border: 1px solid #e0e0e0;
}

.grid-header, .grid-row {
  display: contents;
}

.header-cell, .row-cell {
  padding: 0.8rem;
  border-right: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  padding: 10px 8px;
  text-align: center;
}

.header-cell {
  background: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
}

.name-cell {
  justify-content: flex-start;
  min-width: 200px;
  position: sticky;
  left: 0;
  z-index: 2;
  background: white;
  box-shadow: 2px 0 3px rgba(0,0,0,0.1);
}

.day-cell {
  min-width: 40px;
  height: 40px;
}

.row-cell.day-cell {
  font-size: 0.9rem;
}


.editable-cell {
  cursor: pointer;
  transition: background-color 0.2s;
}

.editable-cell:hover {
  background-color: #e9ecef; 
  border-radius: 4px;
}

.edit-info {
  display: flex;
  justify-content: space-between;
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 0.9em;
  color: #495057;
}

.edit-info span {
  display: flex;
  align-items: center;
  gap: 8px;
}


.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 0.8rem;
  border: 2px solid #ddd;
}

.date-picker-user {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.date-picker-user label {
  font-weight: 500;
  color: #555;
}

.date-picker-user input[type="date"] {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1em;
  max-width: 200px;
  text-align: center;
}


/* Attendance Status Colors */
.hadir { background: rgba(46, 204, 113, 0.1); color: #2ecc71; }
.izin { background: rgba(241, 196, 15, 0.1); color: #f39c12; }
.sakit { background: rgba(52, 152, 219, 0.1); color: #3498db; }
.alpa { background: rgba(231, 76, 60, 0.1); color: #e74c3c; }

.attendance-form {
  margin-top: 2rem;
}

.attendance-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #ddd;
}

.attendance-item:last-child {
  border-bottom: none;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.status-selector select {
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ddd;
  font-size: 1rem;
  cursor: pointer;
}



/* absen mandiri */

.self-attendance-section {
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 25px;
  text-align: center;
}
.attendance-options {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
}
.edited-by-admin {
  font-size: 0.8rem;
  color: #856404;
  background-color: #fff3cd;
  border: 1px solid #ffeeba;
  border-radius: 20px;
  padding: 3px 10px;
  display: inline-block;
  margin-top: 5px;
}
.modal-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background-color: white;
  padding: 25px 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 450px;
  position: relative;
}
.close-button {
  position: absolute;
  top: 10px; right: 15px;
  background: none; border: none;
  font-size: 2rem;
  color: #aaa;
  cursor: pointer;
}



/* Announcements Section */
.announcements-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.announcement-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  animation: fadeIn 0.5s ease;
}

.announcement-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem 1.5rem 0;
}

.author-info {
  display: flex;
  align-items: flex-start;
  gap: 1px;
  flex-grow: 1;
}

.author-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ddd;
}

.author-avatar, 
.comment-avatar {
  margin-right: 10px; 
}

.announcement-title {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 600;
}

.post-meta {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  font-size: 0.9rem;
  color: #7f8c8d;
  flex-direction: column;
  gap: 2px;
}

.author-name {
  font-weight: 600;
  color: #2c3e50;
}

.post-date {
  color: #7f8c8d;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}

.card-content {
  padding: 1rem 1.5rem;
}

.announcement-text {
  white-space: pre-wrap;
  line-height: 1.7;
}

.card-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comment-count {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.comment-toggle {
  background: transparent;
  border: none;
  color: #3498db;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.comment-toggle:hover {
  color: #2980b9;
}

/* Comments Section */
.comments-section {
  background: #f8f9fa;
  border-top: 1px solid #ddd;
  padding: 1.5rem;
}

.comments-list {
  margin-bottom: 1.5rem;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.comments-list::-webkit-scrollbar {
  width: 6px;
}

.comments-list::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.comments-list::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

.comment-item {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.comment-user {
  display: flex;
  align-items: center;
  gap: 1px;
}

.comment-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #ddd;
}

.comment-user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.comment-user-info strong {
  font-size: 0.9rem;
  font-weight: 700;
}

.comment-time {
  font-size: 0.8rem;
  color: #7f8c8d;
}

.comment-content {
  margin-top: 0.5rem;
  padding-left: 44px;
  font-size: 0.95rem;
  line-height: 1.6;
}


.clickable {
  color: #2563eb; /* Warna biru yang lebih modern */
  font-weight: 700; /* Lebih tebal */
  text-decoration: none;
  position: relative; /* Untuk efek underline animasi */
  padding-bottom: 3px; /* Ruang untuk underline animasi */
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); /* Animasi lebih smooth */
  display: inline-block; /* Agar efeknya tidak penuh lebar */
}

.clickable:hover {
  color: #1d4ed8; /* Warna lebih gelap saat hover */
  transform: translateY(-2px); /* Efek mengambang */
  text-shadow: 0 2px 4px rgba(29, 78, 216, 0.15); /* Bayangan teks halus */
}

/* Underline animasi */


.clickable:hover::after {
  width: 100%;
}

/* Efek saat aktif */
.clickable:active {
  transform: translateY(0);
  color: #1e40af;
}

.delete-comment-btn {
  background: transparent;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.delete-comment-btn:hover {
  background: rgba(231, 76, 60, 0.1);
}

.comment-form {
  margin-top: 1.5rem;
}

.input-with-emoji {
  position: relative;
  margin-bottom: 1rem;
}

.input-with-emoji textarea {
  width: 100%;
  min-height: 80px;
  padding: 0.8rem 3rem 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.9rem;
  resize: vertical;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.input-with-emoji textarea:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}

.emoji-button {
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  background: transparent;
  border: none;
  color: #7f8c8d;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.emoji-button:hover {
  color: #3498db;
}

.emoji-picker {
  position: absolute;
  right: 0;
  bottom: 50px;
  z-index: 10;
}

/* Journal Section */
.journal-container {
  margin-top: 1.5rem;
}

.journal-entries {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.journal-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  display: flex;
  gap: 1.5rem;
  position: relative;
  transition: all 0.3s ease;
}

.journal-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.journal-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 60px;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 0.5rem;
}

.journal-date .day {
  font-size: 1.8rem;
  font-weight: 700;
  color: #3498db;
}

.journal-date .month {
  font-size: 0.9rem;
  text-transform: uppercase;
  color: #7f8c8d;
}

.journal-content {
  flex-grow: 1;
}

.journal-content h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.journal-content p {
  color: #333;
  line-height: 1.6;
}


.no-desc {
  color: #7f8c8d;
  font-style: italic;
}

.journal-actions {
  display: flex;
  gap: 0.5rem;
}

.journal-edit-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Edit Views */
.edit-view {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.edit-input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.edit-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}

.edit-textarea {
  width: 100%;
  min-height: 150px;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  resize: vertical;
  transition: all 0.3s ease;
}

.edit-textarea:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}

.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
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

@keyframes slideDown {
  from { 
    opacity: 0;
    transform: translateY(-30px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

/* Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: opacity 0.3s, max-height 0.3s, transform 0.3s;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}

.staggered-fade-move,
.staggered-fade-enter-active,
.staggered-fade-leave-active {
  transition: all 0.5s ease;
}

.staggered-fade-enter-from,
.staggered-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.staggered-fade-leave-active {
  position: absolute;
}

/* Responsive Styles */
@media (max-width: 992px) {
  .class-header {
    height: 350px;
  }
  
  .animated-title {
    font-size: 2.8rem;
  }
  
  .animated-subtitle {
    font-size: 1.3rem;
  }
  
  .content-nav {
    flex-wrap: wrap;
  }
  
  .content-nav button {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
  }
  
  .schedule-cards {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

@media (max-width: 768px) {
  .class-header {
    height: 300px;
  }
  
  .animated-title {
    font-size: 2.2rem;
  }
  
  .animated-subtitle {
    font-size: 1.1rem;
  }
  
  .class-meta {
    flex-direction: column;
    gap: 0.8rem;
  }
  
  .meta-item {
    font-size: 0.9rem;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .view-switcher {
    width: 100%;
  }
  
  .view-switcher button {
    flex-grow: 1;
    justify-content: center;
  }
  
  .attendance-grid {
    grid-template-columns: minmax(140px, 160px) repeat(var(--days-in-month), minmax(40px, 50px));
  }

   .header-cell, .row-cell {
    min-width: 50px;
    padding: 8px 5px;
    font-size: 0.85rem;
  }
  
  .name-cell {
    min-width: 150px;
    padding-left: 10px;
  }
  
  .author-avatar {
    width: 24px;
    height: 24px;
    margin-right: 5px;
  }
  
  .journal-card {
    flex-direction: column;
  }
  
  .journal-date {
    flex-direction: row;
    justify-content: flex-start;
    gap: 1rem;
    padding: 0.8rem;
  }
  
  .journal-date .day {
    font-size: 1.5rem;
  }
}

@media (max-width: 576px) {
  .class-header {
    height: 250px;
    padding: 1rem;
  }
  
  .animated-title {
    font-size: 1.8rem;
  }
  
  .main-content {
    padding: 1rem;
  }
  
  .content-nav button {
    padding: 0.5rem 0.8rem;
    font-size: 0.8rem;
  }
  
  .section-header h2 {
    font-size: 1.5rem;
  }
  
  .schedule-cards {
    grid-template-columns: 1fr;
  }
  
  .attendance-grid {
   grid-template-columns: minmax(120px, 140px) repeat(var(--days-in-month), minmax(35px, 40px));
  }
  
  .name-cell {
    min-width: 10px;
    padding: 10px 8px 10px 5px;
  }
  
  .day-cell {
    min-width: 35px;
    padding: 8px 3px;
    font-size: 0.9em;
  }
}
</style>