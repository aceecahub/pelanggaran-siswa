<script setup lang="ts">
import type { Kelas } from '~/types'

const api = useApi()
const store = useDataStore()

const searchQuery = ref('')
const filterJurusan = ref<number | 'all'>('all')

const isFormModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const editingKelas = ref<Kelas | null>(null)
const targetDeleteId = ref<number | null>(null)

const form = ref<{
  id_jurusan: number
  nama_kelas: string
}>({
  id_jurusan: 1,
  nama_kelas: '',
})

onMounted(async () => {
  await Promise.allSettled([api.getKelas(), api.getJurusan()])
})

const getJurusanName = (idJurusan: number) => {
  const j = store.jurusans.value.find((item) => item.id_jurusan === idJurusan)
  return j ? j.nama_jurusan : 'Tidak Diketahui'
}

const filteredKelas = computed(() => {
  return store.kelases.value.filter((k) => {
    const matchesSearch =
      !searchQuery.value ||
      k.nama_kelas.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesJurusan =
      filterJurusan.value === 'all' || k.id_jurusan === filterJurusan.value

    return matchesSearch && matchesJurusan
  })
})

const openCreateModal = () => {
  editingKelas.value = null
  form.value = {
    id_jurusan: store.jurusans.value[0]?.id_jurusan || 1,
    nama_kelas: '',
  }
  isFormModalOpen.value = true
}

const openEditModal = (kelas: Kelas) => {
  editingKelas.value = kelas
  form.value = {
    id_jurusan: kelas.id_jurusan,
    nama_kelas: kelas.nama_kelas,
  }
  isFormModalOpen.value = true
}

const confirmDelete = (id: number) => {
  targetDeleteId.value = id
  isDeleteModalOpen.value = true
}

const handleDelete = async () => {
  if (targetDeleteId.value !== null) {
    await api.deleteKelas(targetDeleteId.value)
    isDeleteModalOpen.value = false
    targetDeleteId.value = null
  }
}

const handleSave = async () => {
  if (!form.value.nama_kelas.trim()) {
    alert('Nama kelas wajib diisi')
    return
  }

  if (editingKelas.value) {
    await api.updateKelas(editingKelas.value.id_kelas, form.value)
  } else {
    await api.createKelas(form.value)
  }

  isFormModalOpen.value = false
}
</script>

<template>
  <div class="space-y-6">
    <!-- Breadcrumb & Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 text-xs text-gray-400 font-medium mb-1">
          <NuxtLink to="/" class="hover:text-gray-700">Dashboard</NuxtLink>
          <span>/</span>
          <span class="text-gray-500">Master Data</span>
          <span>/</span>
          <span class="text-[#164E3D] font-semibold">Data Kelas</span>
        </div>
        <h1 class="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
          Master Data Kelas
        </h1>
        <p class="text-sm text-gray-500 mt-0.5">
          Kelola data rombongan belajar dan pemetaan kelas ke program keahlian.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button
          type="button"
          @click="openCreateModal"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#164E3D] hover:bg-[#113D2F] text-white text-sm font-medium shadow-sm hover:shadow-md transition-all active:scale-95"
        >
          <AppIcon name="plus" size="16" />
          <span>Tambah Kelas</span>
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
          placeholder="Cari nama kelas..."
          class="w-full pl-10 pr-4 py-2 rounded-full bg-[#F8F9FA] border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#164E3D]/20 focus:border-[#164E3D]"
        />
      </div>

      <div class="flex items-center gap-3 w-full md:w-auto">
        <span class="text-xs font-medium text-gray-400">Jurusan:</span>
        <select
          v-model="filterJurusan"
          class="px-4 py-1.5 rounded-full bg-[#F8F9FA] border border-gray-200 text-xs font-medium text-gray-700 focus:outline-none focus:border-[#164E3D]"
        >
          <option value="all">Semua Jurusan</option>
          <option
            v-for="j in store.jurusans.value"
            :key="j.id_jurusan"
            :value="j.id_jurusan"
          >
            {{ j.nama_jurusan }}
          </option>
        </select>
      </div>
    </div>

    <!-- Table Card -->
    <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-100 bg-[#F9FAFB]/70 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              <th class="py-3.5 px-6">ID</th>
              <th class="py-3.5 px-6">Nama Kelas</th>
              <th class="py-3.5 px-6">Program Keahlian / Jurusan</th>
              <th class="py-3.5 px-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 text-sm">
            <tr
              v-for="k in filteredKelas"
              :key="k.id_kelas"
              class="hover:bg-gray-50/70 transition-colors group"
            >
              <td class="py-3.5 px-6 font-mono text-xs text-gray-400">
                #{{ k.id_kelas }}
              </td>
              <td class="py-3.5 px-6">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-2xl bg-emerald-50 text-[#164E3D] font-bold text-xs flex items-center justify-center">
                    <AppIcon name="kelas" size="17" />
                  </div>
                  <span class="font-bold text-gray-900 group-hover:text-[#164E3D] transition-colors">
                    {{ k.nama_kelas }}
                  </span>
                </div>
              </td>
              <td class="py-3.5 px-6">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  <AppIcon name="jurusan" size="13" class="text-gray-400" />
                  {{ getJurusanName(k.id_jurusan) }}
                </span>
              </td>
              <td class="py-3.5 px-6 text-right">
                <div class="inline-flex items-center gap-1">
                  <button
                    type="button"
                    @click="openEditModal(k)"
                    class="p-1.5 rounded-lg text-gray-400 hover:text-[#164E3D] hover:bg-emerald-50 transition-colors"
                    title="Edit Kelas"
                  >
                    <AppIcon name="edit" size="16" />
                  </button>
                  <button
                    type="button"
                    @click="confirmDelete(k.id_kelas)"
                    class="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Hapus Kelas"
                  >
                    <AppIcon name="trash" size="16" />
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="filteredKelas.length === 0">
              <td colspan="4" class="py-12 text-center text-gray-400 text-sm">
                Belum ada data kelas yang terdaftar.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Form Modal -->
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
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
      >
        <div class="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-gray-100">
          <div class="flex items-center justify-between pb-4 border-b border-gray-100">
            <h3 class="text-lg font-bold text-gray-900">
              {{ editingKelas ? 'Edit Data Kelas' : 'Tambah Kelas Baru' }}
            </h3>
            <button
              type="button"
              @click="isFormModalOpen = false"
              class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center"
            >
              <AppIcon name="x" size="16" />
            </button>
          </div>

          <form @submit.prevent="handleSave" class="mt-6 space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1.5">Nama Kelas *</label>
              <input
                v-model="form.nama_kelas"
                type="text"
                required
                placeholder="Misal: X RPL 1, XI TKJ 2"
                class="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#164E3D]/20 focus:border-[#164E3D]"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1.5">Jurusan / Program Keahlian *</label>
              <select
                v-model.number="form.id_jurusan"
                required
                class="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#164E3D]"
              >
                <option
                  v-for="j in store.jurusans.value"
                  :key="j.id_jurusan"
                  :value="j.id_jurusan"
                >
                  {{ j.nama_jurusan }}
                </option>
              </select>
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
                {{ editingKelas ? 'Simpan' : 'Tambahkan' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <ModalConfirm
      :is-open="isDeleteModalOpen"
      title="Hapus Data Kelas"
      message="Apakah Anda yakin ingin menghapus kelas ini? Tindakan ini akan memindahkan data kelas ke sampah."
      @confirm="handleDelete"
      @cancel="isDeleteModalOpen = false"
    />
  </div>
</template>

