<script setup lang="ts">
import type { Siswa } from '~/types'

const api = useApi()
const store = useDataStore()

const loading = ref(false)
const searchQuery = ref('')
const filterStatus = ref('Semua')
const filterJk = ref('Semua')

// Modal states
const isFormModalOpen = ref(false)
const isDetailModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const editingSiswa = ref<Siswa | null>(null)
const selectedSiswa = ref<Siswa | null>(null)
const targetDeleteNis = ref<number | null>(null)

// Form data
const form = ref<Partial<Siswa>>({
  nis: undefined,
  nama_siswa: '',
  tgl_lahir: '2008-01-01',
  tempat_lahir: '',
  jk: 'L',
  no_hp: '',
  agama: 'Islam',
  no_hp_ortu: '',
  nama_ayah: '',
  pekerjaan_ayah: '',
  nama_ibu: '',
  pekerjaan_ibu: '',
  alamat_ortu: '',
  alamat: '',
  status_aktif: 'Aktif',
})

const loadData = async () => {
  loading.value = true
  try {
    await api.getSiswa()
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

const filteredSiswa = computed(() => {
  return store.siswas.value.filter((s) => {
    const matchesSearch =
      !searchQuery.value ||
      s.nama_siswa.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      String(s.nis).includes(searchQuery.value)

    const matchesStatus =
      filterStatus.value === 'Semua' || s.status_aktif === filterStatus.value

    const matchesJk = filterJk.value === 'Semua' || s.jk === filterJk.value

    return matchesSearch && matchesStatus && matchesJk
  })
})

const openCreateModal = () => {
  editingSiswa.value = null
  form.value = {
    nis: Math.floor(20240000 + Math.random() * 9999),
    nama_siswa: '',
    tgl_lahir: '2008-01-01',
    tempat_lahir: 'Jakarta',
    jk: 'L',
    no_hp: '08',
    agama: 'Islam',
    no_hp_ortu: '08',
    nama_ayah: '',
    pekerjaan_ayah: 'Wiraswasta',
    nama_ibu: '',
    pekerjaan_ibu: 'Ibu Rumah Tangga',
    alamat_ortu: '',
    alamat: '',
    status_aktif: 'Aktif',
  }
  isFormModalOpen.value = true
}

const openEditModal = (siswa: Siswa) => {
  editingSiswa.value = siswa
  form.value = { ...siswa }
  isFormModalOpen.value = true
}

const openDetailModal = (siswa: Siswa) => {
  selectedSiswa.value = siswa
  isDetailModalOpen.value = true
}

const confirmDelete = (nis: number) => {
  targetDeleteNis.value = nis
  isDeleteModalOpen.value = true
}

const handleDelete = async () => {
  if (targetDeleteNis.value !== null) {
    await api.deleteSiswa(targetDeleteNis.value)
    isDeleteModalOpen.value = false
    targetDeleteNis.value = null
  }
}

const handleSave = async () => {
  if (!form.value.nama_siswa || !form.value.nis) {
    alert('NIS dan Nama Siswa wajib diisi')
    return
  }

  if (editingSiswa.value) {
    await api.updateSiswa(editingSiswa.value.nis, form.value)
  } else {
    await api.createSiswa(form.value as Siswa)
  }

  isFormModalOpen.value = false
}
</script>

<template>
  <div class="space-y-6">
    <!-- Breadcrumb & Title -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 text-xs text-gray-400 font-medium mb-1">
          <NuxtLink to="/" class="hover:text-gray-700">Dashboard</NuxtLink>
          <span>/</span>
          <span class="text-gray-500">Master Data</span>
          <span>/</span>
          <span class="text-[#164E3D] font-semibold">Data Siswa</span>
        </div>
        <h1 class="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
          Master Data Siswa
        </h1>
        <p class="text-sm text-gray-500 mt-0.5">
          Kelola data induk siswa, identitas diri, dan kontak wali murid.
        </p>
      </div>

      <!-- Action Button -->
      <div class="flex items-center gap-3">
        <button
          type="button"
          @click="loadData"
          class="w-10 h-10 rounded-full bg-white border border-gray-200/90 text-gray-600 hover:text-gray-900 flex items-center justify-center hover:bg-gray-50 shadow-2xs transition-colors"
          title="Refresh Data"
        >
          <AppIcon name="refresh" size="16" />
        </button>

        <button
          type="button"
          @click="openCreateModal"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#164E3D] hover:bg-[#113D2F] text-white text-sm font-medium shadow-sm hover:shadow-md transition-all active:scale-95"
        >
          <AppIcon name="plus" size="16" />
          <span>Tambah Siswa</span>
        </button>
      </div>
    </div>

    <!-- Filter and Search Bar Card -->
    <div class="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
      <!-- Search Input -->
      <div class="relative w-full md:w-80">
        <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
          <AppIcon name="search" size="17" />
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari berdasarkan NIS atau Nama..."
          class="w-full pl-10 pr-4 py-2 rounded-full bg-[#F8F9FA] border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#164E3D]/20 focus:border-[#164E3D]"
        />
      </div>

      <!-- Filter Controls -->
      <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
        <!-- Status Filter -->
        <div class="flex items-center gap-2">
          <span class="text-xs font-medium text-gray-400">Status:</span>
          <select
            v-model="filterStatus"
            class="px-3 py-1.5 rounded-full bg-[#F8F9FA] border border-gray-200 text-xs font-medium text-gray-700 focus:outline-none focus:border-[#164E3D]"
          >
            <option value="Semua">Semua Status</option>
            <option value="Aktif">Aktif</option>
            <option value="Tidak Aktif">Tidak Aktif</option>
            <option value="Lulus">Lulus</option>
            <option value="Pindah">Pindah</option>
          </select>
        </div>

        <!-- Gender Filter -->
        <div class="flex items-center gap-2">
          <span class="text-xs font-medium text-gray-400">Gender:</span>
          <select
            v-model="filterJk"
            class="px-3 py-1.5 rounded-full bg-[#F8F9FA] border border-gray-200 text-xs font-medium text-gray-700 focus:outline-none focus:border-[#164E3D]"
          >
            <option value="Semua">Semua JK</option>
            <option value="L">Laki-laki (L)</option>
            <option value="P">Perempuan (P)</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Data Table Card -->
    <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-100 bg-[#F9FAFB]/70 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              <th class="py-3.5 px-6">Siswa</th>
              <th class="py-3.5 px-4">NIS</th>
              <th class="py-3.5 px-4">JK</th>
              <th class="py-3.5 px-4">Tempat, Tgl Lahir</th>
              <th class="py-3.5 px-4">No. HP</th>
              <th class="py-3.5 px-4">Status</th>
              <th class="py-3.5 px-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 text-sm">
            <tr
              v-for="siswa in filteredSiswa"
              :key="siswa.nis"
              class="hover:bg-gray-50/70 transition-colors group"
            >
              <!-- Avatar & Name -->
              <td class="py-3.5 px-6">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-full bg-[#164E3D]/10 text-[#164E3D] font-bold text-xs flex items-center justify-center shrink-0">
                    {{ siswa.nama_siswa.charAt(0) }}
                  </div>
                  <div>
                    <h4 class="font-bold text-gray-900 group-hover:text-[#164E3D] transition-colors">
                      {{ siswa.nama_siswa }}
                    </h4>
                    <p class="text-xs text-gray-400">
                      {{ siswa.agama }}
                    </p>
                  </div>
                </div>
              </td>

              <!-- NIS -->
              <td class="py-3.5 px-4 font-mono font-medium text-gray-700">
                {{ siswa.nis }}
              </td>

              <!-- Gender -->
              <td class="py-3.5 px-4">
                <span
                  class="inline-flex px-2 py-0.5 rounded text-[11px] font-semibold"
                  :class="siswa.jk === 'L' ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'"
                >
                  {{ siswa.jk === 'L' ? 'L' : 'P' }}
                </span>
              </td>

              <!-- TTL -->
              <td class="py-3.5 px-4 text-xs text-gray-600">
                {{ siswa.tempat_lahir }}, {{ siswa.tgl_lahir }}
              </td>

              <!-- No HP -->
              <td class="py-3.5 px-4 text-xs font-mono text-gray-600">
                {{ siswa.no_hp || '-' }}
              </td>

              <!-- Status -->
              <td class="py-3.5 px-4">
                <span
                  class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                  :class="[
                    siswa.status_aktif === 'Aktif'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                      : 'bg-gray-100 text-gray-600 border border-gray-200',
                  ]"
                >
                  <span
                    class="w-1.5 h-1.5 rounded-full"
                    :class="siswa.status_aktif === 'Aktif' ? 'bg-emerald-500' : 'bg-gray-400'"
                  />
                  {{ siswa.status_aktif }}
                </span>
              </td>

              <!-- Actions -->
              <td class="py-3.5 px-6 text-right">
                <div class="inline-flex items-center gap-1">
                  <!-- Detail -->
                  <button
                    type="button"
                    @click="openDetailModal(siswa)"
                    class="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    title="Detail Siswa"
                  >
                    <AppIcon name="eye" size="16" />
                  </button>

                  <!-- Edit -->
                  <button
                    type="button"
                    @click="openEditModal(siswa)"
                    class="p-1.5 rounded-lg text-gray-400 hover:text-[#164E3D] hover:bg-emerald-50 transition-colors"
                    title="Edit Data"
                  >
                    <AppIcon name="edit" size="16" />
                  </button>

                  <!-- Delete -->
                  <button
                    type="button"
                    @click="confirmDelete(siswa.nis)"
                    class="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Hapus Siswa"
                  >
                    <AppIcon name="trash" size="16" />
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="filteredSiswa.length === 0">
              <td colspan="7" class="py-12 text-center text-gray-400 text-sm">
                Tidak ada data siswa yang cocok dengan pencarian atau filter.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form (Tambah / Edit Siswa) -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isFormModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto"
      >
        <div class="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-gray-100 my-8">
          <div class="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h3 class="text-xl font-bold text-gray-900">
                {{ editingSiswa ? 'Edit Data Siswa' : 'Tambah Siswa Baru' }}
              </h3>
              <p class="text-xs text-gray-400 mt-0.5">
                Isi form identitas siswa dan wali di bawah ini.
              </p>
            </div>
            <button
              type="button"
              @click="isFormModalOpen = false"
              class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors"
            >
              <AppIcon name="x" size="16" />
            </button>
          </div>

          <form @submit.prevent="handleSave" class="mt-6 space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- NIS -->
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1.5">NIS (Nomor Induk Siswa) *</label>
                <input
                  v-model.number="form.nis"
                  type="number"
                  :disabled="!!editingSiswa"
                  required
                  placeholder="Contoh: 20240101"
                  class="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#164E3D]/20 focus:border-[#164E3D] disabled:opacity-60"
                />
              </div>

              <!-- Nama Siswa -->
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1.5">Nama Lengkap Siswa *</label>
                <input
                  v-model="form.nama_siswa"
                  type="text"
                  required
                  placeholder="Nama lengkap siswa"
                  class="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#164E3D]/20 focus:border-[#164E3D]"
                />
              </div>

              <!-- Jenis Kelamin -->
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1.5">Jenis Kelamin</label>
                <select
                  v-model="form.jk"
                  class="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#164E3D]"
                >
                  <option value="L">Laki-laki (L)</option>
                  <option value="P">Perempuan (P)</option>
                </select>
              </div>

              <!-- Agama -->
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1.5">Agama</label>
                <select
                  v-model="form.agama"
                  class="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#164E3D]"
                >
                  <option value="Islam">Islam</option>
                  <option value="Kristen">Kristen</option>
                  <option value="Katolik">Katolik</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Buddha">Buddha</option>
                  <option value="Konghucu">Konghucu</option>
                </select>
              </div>

              <!-- Tempat Lahir -->
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1.5">Tempat Lahir</label>
                <input
                  v-model="form.tempat_lahir"
                  type="text"
                  placeholder="Kota Lahir"
                  class="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#164E3D]"
                />
              </div>

              <!-- Tanggal Lahir -->
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1.5">Tanggal Lahir</label>
                <input
                  v-model="form.tgl_lahir"
                  type="date"
                  class="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#164E3D]"
                />
              </div>

              <!-- No HP Siswa -->
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1.5">No. HP Siswa</label>
                <input
                  v-model="form.no_hp"
                  type="text"
                  placeholder="08xxxxxxxxxx"
                  class="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#164E3D]"
                />
              </div>

              <!-- Status Siswa -->
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1.5">Status Siswa</label>
                <select
                  v-model="form.status_aktif"
                  class="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#164E3D]"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Tidak Aktif">Tidak Aktif</option>
                  <option value="Lulus">Lulus</option>
                  <option value="Pindah">Pindah</option>
                </select>
              </div>
            </div>

            <!-- Orang Tua Section -->
            <div class="pt-2 border-t border-gray-100">
              <h4 class="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
                Informasi Orang Tua / Wali
              </h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1.5">Nama Ayah</label>
                  <input
                    v-model="form.nama_ayah"
                    type="text"
                    placeholder="Nama Ayah"
                    class="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#164E3D]"
                  />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1.5">Nama Ibu</label>
                  <input
                    v-model="form.nama_ibu"
                    type="text"
                    placeholder="Nama Ibu"
                    class="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#164E3D]"
                  />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1.5">No. HP Orang Tua</label>
                  <input
                    v-model="form.no_hp_ortu"
                    type="text"
                    placeholder="08xxxxxxxxxx"
                    class="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#164E3D]"
                  />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1.5">Alamat</label>
                  <input
                    v-model="form.alamat"
                    type="text"
                    placeholder="Alamat domisili siswa"
                    class="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#164E3D]"
                  />
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
              <button
                type="button"
                @click="isFormModalOpen = false"
                class="px-5 py-2.5 rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                class="px-6 py-2.5 rounded-full bg-[#164E3D] hover:bg-[#113D2F] text-white text-sm font-medium shadow-sm transition-all"
              >
                {{ editingSiswa ? 'Simpan Perubahan' : 'Tambahkan Siswa' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- Modal Detail Siswa -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isDetailModalOpen && selectedSiswa"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
      >
        <div class="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-gray-100">
          <div class="flex items-center justify-between pb-4 border-b border-gray-100">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-[#164E3D] text-white font-bold text-lg flex items-center justify-center shadow-md shadow-[#164E3D]/20">
                {{ selectedSiswa.nama_siswa.charAt(0) }}
              </div>
              <div>
                <h3 class="text-lg font-bold text-gray-900 leading-tight">
                  {{ selectedSiswa.nama_siswa }}
                </h3>
                <p class="text-xs text-gray-400 font-mono">
                  NIS: {{ selectedSiswa.nis }}
                </p>
              </div>
            </div>
            <button
              type="button"
              @click="isDetailModalOpen = false"
              class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center"
            >
              <AppIcon name="x" size="16" />
            </button>
          </div>

          <div class="mt-6 space-y-4 text-xs">
            <div class="grid grid-cols-2 gap-4 bg-[#F8F9FA] p-4 rounded-2xl">
              <div>
                <span class="text-gray-400 font-medium">Jenis Kelamin</span>
                <p class="font-bold text-gray-900 mt-0.5">{{ selectedSiswa.jk === 'L' ? 'Laki-laki' : 'Perempuan' }}</p>
              </div>
              <div>
                <span class="text-gray-400 font-medium">Agama</span>
                <p class="font-bold text-gray-900 mt-0.5">{{ selectedSiswa.agama }}</p>
              </div>
              <div>
                <span class="text-gray-400 font-medium">TTL</span>
                <p class="font-bold text-gray-900 mt-0.5">{{ selectedSiswa.tempat_lahir }}, {{ selectedSiswa.tgl_lahir }}</p>
              </div>
              <div>
                <span class="text-gray-400 font-medium">Status</span>
                <p class="font-bold text-emerald-700 mt-0.5">{{ selectedSiswa.status_aktif }}</p>
              </div>
            </div>

            <div class="space-y-2 p-2">
              <div class="flex justify-between py-1 border-b border-gray-50">
                <span class="text-gray-400">No. HP Siswa:</span>
                <span class="font-semibold text-gray-800 font-mono">{{ selectedSiswa.no_hp || '-' }}</span>
              </div>
              <div class="flex justify-between py-1 border-b border-gray-50">
                <span class="text-gray-400">Orang Tua (Ayah / Ibu):</span>
                <span class="font-semibold text-gray-800">{{ selectedSiswa.nama_ayah }} / {{ selectedSiswa.nama_ibu }}</span>
              </div>
              <div class="flex justify-between py-1 border-b border-gray-50">
                <span class="text-gray-400">No. HP Orang Tua:</span>
                <span class="font-semibold text-gray-800 font-mono">{{ selectedSiswa.no_hp_ortu || '-' }}</span>
              </div>
              <div class="flex justify-between py-1 border-b border-gray-50">
                <span class="text-gray-400">Pekerjaan Ayah / Ibu:</span>
                <span class="font-semibold text-gray-800">{{ selectedSiswa.pekerjaan_ayah }} / {{ selectedSiswa.pekerjaan_ibu }}</span>
              </div>
              <div class="pt-1">
                <span class="text-gray-400 block mb-1">Alamat Domisili:</span>
                <p class="text-gray-700 bg-gray-50 p-2.5 rounded-xl">{{ selectedSiswa.alamat || selectedSiswa.alamat_ortu || '-' }}</p>
              </div>
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="button"
              @click="isDetailModalOpen = false"
              class="px-6 py-2 rounded-full bg-gray-900 hover:bg-black text-white text-xs font-medium"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Delete Confirmation Modal -->
    <ModalConfirm
      :is-open="isDeleteModalOpen"
      title="Hapus Data Siswa"
      message="Data siswa ini akan dipindahkan ke Kotak Sampah. Anda masih dapat memulihkannya nanti jika diperlukan."
      confirm-text="Ya, Pindahkan ke Sampah"
      @confirm="handleDelete"
      @cancel="isDeleteModalOpen = false"
    />
  </div>
</template>

