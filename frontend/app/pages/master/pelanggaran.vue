<script setup lang="ts">
import type { Pelanggaran } from '~/types'

const api = useApi()
const store = useDataStore()

const searchQuery = ref('')
const filterKategori = ref<number | 'all'>('all')
const filterTingkatan = ref('all')

const isFormModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const editingPelanggaran = ref<Pelanggaran | null>(null)
const targetDeleteId = ref<number | null>(null)

const form = ref<{
  id_kategori_pelanggaran: number
  nama_pelanggaran: string
  tingkatan: string
  bobot_point: number
}>({
  id_kategori_pelanggaran: 1,
  nama_pelanggaran: '',
  tingkatan: 'Ringan',
  bobot_point: 5,
})

onMounted(async () => {
  await Promise.allSettled([api.getPelanggaran(), api.getKategori()])
})

const getKategoriName = (idKategori: number) => {
  const k = store.kategoris.value.find((item) => item.id_kategori_pelanggaran === idKategori)
  return k ? k.nama : 'Lainnya'
}

const filteredPelanggaran = computed(() => {
  return store.pelanggarans.value.filter((p) => {
    const matchesSearch =
      !searchQuery.value ||
      p.nama_pelanggaran.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesKategori =
      filterKategori.value === 'all' ||
      p.id_kategori_pelanggaran === filterKategori.value

    const matchesTingkatan =
      filterTingkatan.value === 'all' || p.tingkatan === filterTingkatan.value

    return matchesSearch && matchesKategori && matchesTingkatan
  })
})

const openCreateModal = () => {
  editingPelanggaran.value = null
  form.value = {
    id_kategori_pelanggaran: store.kategoris.value[0]?.id_kategori_pelanggaran || 1,
    nama_pelanggaran: '',
    tingkatan: 'Ringan',
    bobot_point: 5,
  }
  isFormModalOpen.value = true
}

const openEditModal = (p: Pelanggaran) => {
  editingPelanggaran.value = p
  form.value = {
    id_kategori_pelanggaran: p.id_kategori_pelanggaran,
    nama_pelanggaran: p.nama_pelanggaran,
    tingkatan: p.tingkatan,
    bobot_point: p.bobot_point,
  }
  isFormModalOpen.value = true
}

const confirmDelete = (id: number) => {
  targetDeleteId.value = id
  isDeleteModalOpen.value = true
}

const handleDelete = async () => {
  if (targetDeleteId.value !== null) {
    await api.deletePelanggaran(targetDeleteId.value)
    isDeleteModalOpen.value = false
    targetDeleteId.value = null
  }
}

const handleSave = async () => {
  if (!form.value.nama_pelanggaran.trim()) {
    alert('Nama pelanggaran wajib diisi')
    return
  }

  if (editingPelanggaran.value) {
    await api.updatePelanggaran(editingPelanggaran.value.id_pelanggaran, form.value)
  } else {
    await api.createPelanggaran(form.value)
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
          <span class="text-gray-500">Master Data</span>
          <span>/</span>
          <span class="text-[#164E3D] font-semibold">Jenis Pelanggaran</span>
        </div>
        <h1 class="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
          Master Jenis Pelanggaran
        </h1>
        <p class="text-sm text-gray-500 mt-0.5">
          Kelola katalog pelanggaran kedisiplinan, tingkatan dan bobot poin sanksi.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button
          type="button"
          @click="openCreateModal"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#164E3D] hover:bg-[#113D2F] text-white text-sm font-medium shadow-sm hover:shadow-md transition-all active:scale-95"
        >
          <AppIcon name="plus" size="16" />
          <span>Tambah Pelanggaran</span>
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
          placeholder="Cari nama pelanggaran..."
          class="w-full pl-10 pr-4 py-2 rounded-full bg-[#F8F9FA] border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#164E3D]/20 focus:border-[#164E3D]"
        />
      </div>

      <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
        <div class="flex items-center gap-2">
          <span class="text-xs font-medium text-gray-400">Kategori:</span>
          <select
            v-model="filterKategori"
            class="px-3 py-1.5 rounded-full bg-[#F8F9FA] border border-gray-200 text-xs font-medium text-gray-700 focus:outline-none focus:border-[#164E3D]"
          >
            <option value="all">Semua Kategori</option>
            <option
              v-for="k in store.kategoris.value"
              :key="k.id_kategori_pelanggaran"
              :value="k.id_kategori_pelanggaran"
            >
              {{ k.nama }}
            </option>
          </select>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-xs font-medium text-gray-400">Tingkatan:</span>
          <select
            v-model="filterTingkatan"
            class="px-3 py-1.5 rounded-full bg-[#F8F9FA] border border-gray-200 text-xs font-medium text-gray-700 focus:outline-none focus:border-[#164E3D]"
          >
            <option value="all">Semua Tingkat</option>
            <option value="Ringan">Ringan</option>
            <option value="Sedang">Sedang</option>
            <option value="Berat">Berat</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-100 bg-[#F9FAFB]/70 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              <th class="py-3.5 px-6">ID</th>
              <th class="py-3.5 px-6">Nama Pelanggaran</th>
              <th class="py-3.5 px-4">Kategori</th>
              <th class="py-3.5 px-4">Tingkatan</th>
              <th class="py-3.5 px-4">Bobot Poin</th>
              <th class="py-3.5 px-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 text-sm">
            <tr
              v-for="p in filteredPelanggaran"
              :key="p.id_pelanggaran"
              class="hover:bg-gray-50/70 transition-colors group"
            >
              <td class="py-3.5 px-6 font-mono text-xs text-gray-400">
                #{{ p.id_pelanggaran }}
              </td>
              <td class="py-3.5 px-6">
                <div class="flex items-center gap-3">
                  <div
                    class="w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-xs"
                    :class="[
                      p.tingkatan === 'Berat'
                        ? 'bg-rose-50 text-rose-600'
                        : p.tingkatan === 'Sedang'
                        ? 'bg-amber-50 text-amber-600'
                        : 'bg-emerald-50 text-[#164E3D]',
                    ]"
                  >
                    <AppIcon name="shield-alert" size="17" />
                  </div>
                  <span class="font-bold text-gray-900 group-hover:text-[#164E3D] transition-colors">
                    {{ p.nama_pelanggaran }}
                  </span>
                </div>
              </td>
              <td class="py-3.5 px-4 text-xs text-gray-600">
                <span class="px-2.5 py-1 rounded-full bg-gray-100 font-medium">
                  {{ getKategoriName(p.id_kategori_pelanggaran) }}
                </span>
              </td>
              <td class="py-3.5 px-4">
                <span
                  class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                  :class="[
                    p.tingkatan === 'Berat'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                      : p.tingkatan === 'Sedang'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
                  ]"
                >
                  {{ p.tingkatan }}
                </span>
              </td>
              <td class="py-3.5 px-4 font-mono font-bold text-gray-900">
                +{{ p.bobot_point }} Poin
              </td>
              <td class="py-3.5 px-6 text-right">
                <div class="inline-flex items-center gap-1">
                  <button
                    type="button"
                    @click="openEditModal(p)"
                    class="p-1.5 rounded-lg text-gray-400 hover:text-[#164E3D] hover:bg-emerald-50 transition-colors"
                  >
                    <AppIcon name="edit" size="16" />
                  </button>
                  <button
                    type="button"
                    @click="confirmDelete(p.id_pelanggaran)"
                    class="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <AppIcon name="trash" size="16" />
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="filteredPelanggaran.length === 0">
              <td colspan="6" class="py-12 text-center text-gray-400 text-sm">
                Belum ada jenis pelanggaran yang cocok.
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
        <div class="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-gray-100">
          <div class="flex items-center justify-between pb-4 border-b border-gray-100">
            <h3 class="text-lg font-bold text-gray-900">
              {{ editingPelanggaran ? 'Edit Pelanggaran' : 'Tambah Jenis Pelanggaran' }}
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
              <label class="block text-xs font-semibold text-gray-700 mb-1.5">Nama Pelanggaran *</label>
              <input
                v-model="form.nama_pelanggaran"
                type="text"
                required
                placeholder="Misal: Terlambat Masuk Sekolah >15 Menit"
                class="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#164E3D]/20 focus:border-[#164E3D]"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1.5">Kategori Pelanggaran *</label>
              <select
                v-model.number="form.id_kategori_pelanggaran"
                required
                class="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#164E3D]"
              >
                <option
                  v-for="k in store.kategoris.value"
                  :key="k.id_kategori_pelanggaran"
                  :value="k.id_kategori_pelanggaran"
                >
                  {{ k.nama }}
                </option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1.5">Tingkatan *</label>
                <select
                  v-model="form.tingkatan"
                  class="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#164E3D]"
                >
                  <option value="Ringan">Ringan</option>
                  <option value="Sedang">Sedang</option>
                  <option value="Berat">Berat</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1.5">Bobot Poin *</label>
                <input
                  v-model.number="form.bobot_point"
                  type="number"
                  min="1"
                  required
                  placeholder="5"
                  class="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#164E3D]"
                />
              </div>
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
                {{ editingPelanggaran ? 'Simpan' : 'Tambahkan' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <ModalConfirm
      :is-open="isDeleteModalOpen"
      title="Hapus Jenis Pelanggaran"
      message="Apakah Anda yakin ingin menghapus jenis pelanggaran ini?"
      @confirm="handleDelete"
      @cancel="isDeleteModalOpen = false"
    />
  </div>
</template>

