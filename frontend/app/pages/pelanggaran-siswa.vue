<script setup lang="ts">
import type { PelanggaranSiswa } from '~/types'

const api = useApi()
const store = useDataStore()

const searchQuery = ref('')
const filterStatus = ref('all')
const isFormModalOpen = ref(false)
const isDetailModalOpen = ref(false)
const isDeleteModalOpen = ref(false)

const editingRecord = ref<PelanggaranSiswa | null>(null)
const selectedRecord = ref<PelanggaranSiswa | null>(null)
const targetDeleteId = ref<number | null>(null)

// Form state
const form = ref<Partial<PelanggaranSiswa>>({
  tgl: new Date().toISOString().split('T')[0],
  id_tahun_ajaran: 1,
  id_user: 1,
  nama_pelapor: 'Ibu Ratna, M.Pd (Guru BK)',
  nis: undefined,
  nama_siswa: '',
  id_kelas: 1,
  nama_kelas: '',
  id_kategori_pelanggaran: 1,
  id_pelanggaran: 1,
  nama_pelanggaran: '',
  point: 5,
  catatan: '',
  sanksi: '',
  status_sanksi: 'Pending',
})

onMounted(async () => {
  await Promise.allSettled([
    api.getPelanggaranSiswa(),
    api.getSiswa(),
    api.getKelas(),
    api.getPelanggaran(),
    api.getTapel(),
    api.getKategori(),
  ])
})

const filteredRecords = computed(() => {
  return store.pelanggaranSiswas.value.filter((r) => {
    const matchesSearch =
      !searchQuery.value ||
      r.nama_siswa.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      r.nama_pelanggaran.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      r.nama_kelas.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesStatus =
      filterStatus.value === 'all' || r.status_sanksi === filterStatus.value

    return matchesSearch && matchesStatus
  })
})

// Auto-fill student name when student is selected
const onStudentChange = () => {
  const s = store.siswas.value.find((item) => item.nis === form.value.nis)
  if (s) {
    form.value.nama_siswa = s.nama_siswa
  }
}

// Auto-fill class name when class is selected
const onClassChange = () => {
  const k = store.kelases.value.find((item) => item.id_kelas === form.value.id_kelas)
  if (k) {
    form.value.nama_kelas = k.nama_kelas
  }
}

// Auto-fill violation details and points when violation is selected
const onViolationChange = () => {
  const p = store.pelanggarans.value.find(
    (item) => item.id_pelanggaran === form.value.id_pelanggaran
  )
  if (p) {
    form.value.nama_pelanggaran = p.nama_pelanggaran
    form.value.id_kategori_pelanggaran = p.id_kategori_pelanggaran
    form.value.point = p.bobot_point
  }
}

const openCreateModal = () => {
  editingRecord.value = null
  const defaultSiswa = store.siswas.value[0]
  const defaultKelas = store.kelases.value[0]
  const defaultPelanggaran = store.pelanggarans.value[0]

  form.value = {
    tgl: new Date().toISOString().split('T')[0],
    id_tahun_ajaran: store.tapels.value[0]?.id_tahun_ajaran || 1,
    id_user: store.currentUser.value.id_user,
    nama_pelapor: 'Ibu Ratna, M.Pd (Guru BK)',
    nis: defaultSiswa?.nis,
    nama_siswa: defaultSiswa?.nama_siswa || '',
    id_kelas: defaultKelas?.id_kelas || 1,
    nama_kelas: defaultKelas?.nama_kelas || '',
    id_kategori_pelanggaran: defaultPelanggaran?.id_kategori_pelanggaran || 1,
    id_pelanggaran: defaultPelanggaran?.id_pelanggaran || 1,
    nama_pelanggaran: defaultPelanggaran?.nama_pelanggaran || '',
    point: defaultPelanggaran?.bobot_point || 5,
    catatan: '',
    sanksi: 'Teguran lisan dan pembinaan',
    status_sanksi: 'Pending',
  }
  isFormModalOpen.value = true
}

const openEditModal = (r: PelanggaranSiswa) => {
  editingRecord.value = r
  form.value = { ...r }
  isFormModalOpen.value = true
}

const openDetailModal = (r: PelanggaranSiswa) => {
  selectedRecord.value = r
  isDetailModalOpen.value = true
}

const confirmDelete = (id: number) => {
  targetDeleteId.value = id
  isDeleteModalOpen.value = true
}

const handleDelete = async () => {
  if (targetDeleteId.value !== null) {
    await api.deletePelanggaranSiswa(targetDeleteId.value)
    isDeleteModalOpen.value = false
    targetDeleteId.value = null
  }
}

const handleQuickStatusChange = async (r: PelanggaranSiswa, newStatus: string) => {
  await api.updatePelanggaranSiswa(r.id_pelanggaran_siswa, { status_sanksi: newStatus })
}

const handleSave = async () => {
  if (!form.value.nis || !form.value.nama_siswa || !form.value.nama_pelanggaran) {
    alert('Mohon lengkapi data siswa dan pelanggaran')
    return
  }

  if (editingRecord.value) {
    await api.updatePelanggaranSiswa(editingRecord.value.id_pelanggaran_siswa, form.value)
  } else {
    await api.createPelanggaranSiswa(form.value as any)
  }

  isFormModalOpen.value = false
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 text-xs text-gray-400 font-medium mb-1">
          <NuxtLink to="/" class="hover:text-gray-700">Dashboard</NuxtLink>
          <span>/</span>
          <span class="text-[#164E3D] font-semibold">Pelanggaran Siswa</span>
        </div>
        <h1 class="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
          Catatan Pelanggaran Siswa
        </h1>
        <p class="text-sm text-gray-500 mt-0.5">
          Pencatatan kasus indisipliner, pelaporan guru, akumulasi poin, dan tindak lanjut sanksi.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button
          type="button"
          @click="openCreateModal"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#164E3D] hover:bg-[#113D2F] text-white text-sm font-medium shadow-sm hover:shadow-md transition-all active:scale-95"
        >
          <AppIcon name="plus" size="16" />
          <span>+ Catat Pelanggaran</span>
        </button>
      </div>
    </div>

    <!-- Filter Card -->
    <div class="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
      <div class="relative w-full md:w-80">
        <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
          <AppIcon name="search" size="17" />
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari siswa, kelas, pelanggaran..."
          class="w-full pl-10 pr-4 py-2 rounded-full bg-[#F8F9FA] border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#164E3D]/20 focus:border-[#164E3D]"
        />
      </div>

      <div class="flex items-center gap-3 w-full md:w-auto">
        <span class="text-xs font-medium text-gray-400">Status Sanksi:</span>
        <select
          v-model="filterStatus"
          class="px-4 py-1.5 rounded-full bg-[#F8F9FA] border border-gray-200 text-xs font-medium text-gray-700 focus:outline-none focus:border-[#164E3D]"
        >
          <option value="all">Semua Status</option>
          <option value="Pending">Pending (Baru)</option>
          <option value="Dalam Proses">Dalam Proses</option>
          <option value="Selesai">Selesai</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-100 bg-[#F9FAFB]/70 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              <th class="py-3.5 px-6">Tanggal</th>
              <th class="py-3.5 px-6">Siswa & Kelas</th>
              <th class="py-3.5 px-6">Pelanggaran</th>
              <th class="py-3.5 px-4 text-center">Poin</th>
              <th class="py-3.5 px-6">Status Sanksi</th>
              <th class="py-3.5 px-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 text-sm">
            <tr
              v-for="r in filteredRecords"
              :key="r.id_pelanggaran_siswa"
              class="hover:bg-gray-50/70 transition-colors group"
            >
              <!-- Date -->
              <td class="py-3.5 px-6 text-xs text-gray-500 font-mono">
                {{ r.tgl }}
              </td>

              <!-- Siswa & Kelas -->
              <td class="py-3.5 px-6">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-full bg-emerald-100 text-[#164E3D] font-bold text-xs flex items-center justify-center shrink-0">
                    {{ r.nama_siswa.charAt(0) }}
                  </div>
                  <div>
                    <h4 class="font-bold text-gray-900 group-hover:text-[#164E3D] transition-colors">
                      {{ r.nama_siswa }}
                    </h4>
                    <p class="text-xs text-gray-400">
                      NIS: {{ r.nis }} • <span class="font-medium text-gray-600">{{ r.nama_kelas }}</span>
                    </p>
                  </div>
                </div>
              </td>

              <!-- Pelanggaran -->
              <td class="py-3.5 px-6">
                <div class="max-w-xs">
                  <p class="font-medium text-gray-800 line-clamp-1">
                    {{ r.nama_pelanggaran }}
                  </p>
                  <p class="text-xs text-gray-400 line-clamp-1">
                    Pelapor: {{ r.nama_pelapor }}
                  </p>
                </div>
              </td>

              <!-- Poin Badge -->
              <td class="py-3.5 px-4 text-center">
                <span class="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200/60 font-mono">
                  +{{ r.point }}
                </span>
              </td>

              <!-- Status Sanksi Pill (Donezo style) -->
              <td class="py-3.5 px-6">
                <div class="relative inline-block">
                  <select
                    :value="r.status_sanksi"
                    @change="handleQuickStatusChange(r, ($event.target as HTMLSelectElement).value)"
                    class="appearance-none pl-3 pr-7 py-1 text-xs font-semibold rounded-full border cursor-pointer focus:outline-none"
                    :class="[
                      r.status_sanksi === 'Selesai'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : r.status_sanksi === 'Pending'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200',
                    ]"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Dalam Proses">Dalam Proses</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>
              </td>

              <!-- Actions -->
              <td class="py-3.5 px-6 text-right">
                <div class="inline-flex items-center gap-1">
                  <button
                    type="button"
                    @click="openDetailModal(r)"
                    class="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    title="Detail Pelanggaran"
                  >
                    <AppIcon name="eye" size="16" />
                  </button>
                  <button
                    type="button"
                    @click="openEditModal(r)"
                    class="p-1.5 rounded-lg text-gray-400 hover:text-[#164E3D] hover:bg-emerald-50 transition-colors"
                    title="Edit Catatan"
                  >
                    <AppIcon name="edit" size="16" />
                  </button>
                  <button
                    type="button"
                    @click="confirmDelete(r.id_pelanggaran_siswa)"
                    class="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Hapus"
                  >
                    <AppIcon name="trash" size="16" />
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="filteredRecords.length === 0">
              <td colspan="6" class="py-12 text-center text-gray-400 text-sm">
                Belum ada catatan pelanggaran siswa.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Form Modal (Catat Pelanggaran Siswa) -->
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
                {{ editingRecord ? 'Edit Catatan Pelanggaran' : 'Catat Pelanggaran Siswa' }}
              </h3>
              <p class="text-xs text-gray-400 mt-0.5">
                Masukkan rincian pelanggaran dan tindak lanjut sanksi.
              </p>
            </div>
            <button
              type="button"
              @click="isFormModalOpen = false"
              class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center"
            >
              <AppIcon name="x" size="16" />
            </button>
          </div>

          <form @submit.prevent="handleSave" class="mt-6 space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Tanggal -->
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1.5">Tanggal Kejadian *</label>
                <input
                  v-model="form.tgl"
                  type="date"
                  required
                  class="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#164E3D]"
                />
              </div>

              <!-- Pelapor -->
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1.5">Nama Guru / Pelapor *</label>
                <input
                  v-model="form.nama_pelapor"
                  type="text"
                  required
                  placeholder="Nama guru piket / pelapor"
                  class="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#164E3D]"
                />
              </div>

              <!-- Siswa Dropdown -->
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1.5">Pilih Siswa *</label>
                <select
                  v-model.number="form.nis"
                  @change="onStudentChange"
                  required
                  class="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#164E3D]"
                >
                  <option
                    v-for="s in store.siswas.value"
                    :key="s.nis"
                    :value="s.nis"
                  >
                    {{ s.nis }} - {{ s.nama_siswa }}
                  </option>
                </select>
              </div>

              <!-- Kelas Dropdown -->
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1.5">Pilih Kelas *</label>
                <select
                  v-model.number="form.id_kelas"
                  @change="onClassChange"
                  required
                  class="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#164E3D]"
                >
                  <option
                    v-for="k in store.kelases.value"
                    :key="k.id_kelas"
                    :value="k.id_kelas"
                  >
                    {{ k.nama_kelas }}
                  </option>
                </select>
              </div>

              <!-- Jenis Pelanggaran Dropdown -->
              <div class="sm:col-span-2">
                <label class="block text-xs font-semibold text-gray-700 mb-1.5">Jenis Pelanggaran *</label>
                <select
                  v-model.number="form.id_pelanggaran"
                  @change="onViolationChange"
                  required
                  class="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#164E3D]"
                >
                  <option
                    v-for="p in store.pelanggarans.value"
                    :key="p.id_pelanggaran"
                    :value="p.id_pelanggaran"
                  >
                    [{{ p.tingkatan }} - {{ p.bobot_point }} Poin] {{ p.nama_pelanggaran }}
                  </option>
                </select>
              </div>

              <!-- Bobot Poin -->
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1.5">Bobot Poin</label>
                <input
                  v-model.number="form.point"
                  type="number"
                  required
                  class="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#164E3D]"
                />
              </div>

              <!-- Status Sanksi -->
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1.5">Status Penanganan Sanksi</label>
                <select
                  v-model="form.status_sanksi"
                  class="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#164E3D]"
                >
                  <option value="Pending">Pending</option>
                  <option value="Dalam Proses">Dalam Proses</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>
            </div>

            <!-- Catatan Kejadian -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1.5">Kronologi / Catatan Kejadian</label>
              <textarea
                v-model="form.catatan"
                rows="2"
                placeholder="Rincian kejadian pelanggaran..."
                class="w-full px-4 py-2 rounded-xl bg-[#F8F9FA] border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#164E3D]"
              />
            </div>

            <!-- Tindak Lanjut Sanksi -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1.5">Bentuk Sanksi / Tindak Lanjut</label>
              <input
                v-model="form.sanksi"
                type="text"
                placeholder="Misal: Panggilan orang tua, pembersihan lingkungan, dll."
                class="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#164E3D]"
              />
            </div>

            <div class="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
              <button
                type="button"
                @click="isFormModalOpen = false"
                class="px-5 py-2.5 rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                class="px-6 py-2.5 rounded-full bg-[#164E3D] hover:bg-[#113D2F] text-white text-sm font-medium shadow-sm"
              >
                {{ editingRecord ? 'Simpan' : 'Simpan Pelanggaran' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- Detail Modal -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isDetailModalOpen && selectedRecord"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
      >
        <div class="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-gray-100">
          <div class="flex items-center justify-between pb-4 border-b border-gray-100">
            <h3 class="text-lg font-bold text-gray-900">
              Rincian Pelanggaran Siswa
            </h3>
            <button
              type="button"
              @click="isDetailModalOpen = false"
              class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center"
            >
              <AppIcon name="x" size="16" />
            </button>
          </div>

          <div class="mt-6 space-y-3 text-xs">
            <div class="p-3 bg-[#F8F9FA] rounded-2xl flex justify-between items-center">
              <div>
                <span class="text-gray-400">Nama Siswa:</span>
                <h4 class="font-bold text-gray-900 text-sm">{{ selectedRecord.nama_siswa }}</h4>
              </div>
              <div class="text-right">
                <span class="text-gray-400">Kelas:</span>
                <p class="font-bold text-gray-800">{{ selectedRecord.nama_kelas }}</p>
              </div>
            </div>

            <div class="py-2 border-b border-gray-50 flex justify-between">
              <span class="text-gray-400">Pelanggaran:</span>
              <span class="font-bold text-gray-900">{{ selectedRecord.nama_pelanggaran }}</span>
            </div>

            <div class="py-2 border-b border-gray-50 flex justify-between">
              <span class="text-gray-400">Poin Pelanggaran:</span>
              <span class="font-bold text-rose-600 font-mono">+{{ selectedRecord.point }} Poin</span>
            </div>

            <div class="py-2 border-b border-gray-50 flex justify-between">
              <span class="text-gray-400">Pelapor:</span>
              <span class="font-medium text-gray-800">{{ selectedRecord.nama_pelapor }}</span>
            </div>

            <div class="py-2 border-b border-gray-50 flex justify-between">
              <span class="text-gray-400">Status Sanksi:</span>
              <span class="font-bold text-emerald-700">{{ selectedRecord.status_sanksi }}</span>
            </div>

            <div class="py-1">
              <span class="text-gray-400 block mb-1">Catatan Kejadian:</span>
              <p class="text-gray-700 bg-gray-50 p-2.5 rounded-xl">{{ selectedRecord.catatan || 'Tidak ada catatan khusus.' }}</p>
            </div>

            <div class="py-1">
              <span class="text-gray-400 block mb-1">Bentuk Sanksi:</span>
              <p class="text-gray-700 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100 text-emerald-950 font-medium">{{ selectedRecord.sanksi || 'Belum ditentukan' }}</p>
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="button"
              @click="isDetailModalOpen = false"
              class="px-6 py-2 rounded-full bg-gray-900 text-white text-xs font-medium"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </transition>

    <ModalConfirm
      :is-open="isDeleteModalOpen"
      title="Hapus Catatan Pelanggaran"
      message="Apakah Anda yakin ingin menghapus catatan pelanggaran siswa ini?"
      @confirm="handleDelete"
      @cancel="isDeleteModalOpen = false"
    />
  </div>
</template>

