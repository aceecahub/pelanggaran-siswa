<script setup lang="ts">
import type { KategoriPelanggaran } from '~/types'

const api = useApi()
const store = useDataStore()

const searchQuery = ref('')
const isFormModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const editingKategori = ref<KategoriPelanggaran | null>(null)
const targetDeleteId = ref<number | null>(null)

const form = ref<{
  nama: string
}>({
  nama: '',
})

onMounted(async () => {
  await api.getKategori()
})

const filteredKategori = computed(() => {
  return store.kategoris.value.filter((k) => {
    return (
      !searchQuery.value ||
      k.nama.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })
})

const openCreateModal = () => {
  editingKategori.value = null
  form.value = { nama: '' }
  isFormModalOpen.value = true
}

const openEditModal = (k: KategoriPelanggaran) => {
  editingKategori.value = k
  form.value = { nama: k.nama }
  isFormModalOpen.value = true
}

const confirmDelete = (id: number) => {
  targetDeleteId.value = id
  isDeleteModalOpen.value = true
}

const handleDelete = async () => {
  if (targetDeleteId.value !== null) {
    await api.deleteKategori(targetDeleteId.value)
    isDeleteModalOpen.value = false
    targetDeleteId.value = null
  }
}

const handleSave = async () => {
  if (!form.value.nama.trim()) {
    alert('Nama kategori wajib diisi')
    return
  }

  if (editingKategori.value) {
    await api.updateKategori(editingKategori.value.id_kategori_pelanggaran, form.value)
  } else {
    await api.createKategori(form.value)
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
          <span class="text-[#164E3D] font-semibold">Kategori Pelanggaran</span>
        </div>
        <h1 class="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
          Master Kategori Pelanggaran
        </h1>
        <p class="text-sm text-gray-500 mt-0.5">
          Klasifikasi jenis pelanggaran tata tertib sekolah untuk rekapitulasi poin.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button
          type="button"
          @click="openCreateModal"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#164E3D] hover:bg-[#113D2F] text-white text-sm font-medium shadow-sm hover:shadow-md transition-all active:scale-95"
        >
          <AppIcon name="plus" size="16" />
          <span>Tambah Kategori</span>
        </button>
      </div>
    </div>

    <!-- Filter & Search -->
    <div class="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
      <div class="relative w-full md:w-80">
        <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
          <AppIcon name="search" size="17" />
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari kategori..."
          class="w-full pl-10 pr-4 py-2 rounded-full bg-[#F8F9FA] border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#164E3D]/20 focus:border-[#164E3D]"
        />
      </div>

      <span class="text-xs text-gray-400 font-medium">
        Total: {{ filteredKategori.length }} Kategori
      </span>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-100 bg-[#F9FAFB]/70 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              <th class="py-3.5 px-6">ID</th>
              <th class="py-3.5 px-6">Nama Kategori</th>
              <th class="py-3.5 px-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 text-sm">
            <tr
              v-for="k in filteredKategori"
              :key="k.id_kategori_pelanggaran"
              class="hover:bg-gray-50/70 transition-colors group"
            >
              <td class="py-3.5 px-6 font-mono text-xs text-gray-400">
                #{{ k.id_kategori_pelanggaran }}
              </td>
              <td class="py-3.5 px-6">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-2xl bg-amber-50 text-amber-700 font-bold text-xs flex items-center justify-center">
                    <AppIcon name="kategori" size="16" />
                  </div>
                  <span class="font-bold text-gray-900 group-hover:text-[#164E3D] transition-colors">
                    {{ k.nama }}
                  </span>
                </div>
              </td>
              <td class="py-3.5 px-6 text-right">
                <div class="inline-flex items-center gap-1">
                  <button
                    type="button"
                    @click="openEditModal(k)"
                    class="p-1.5 rounded-lg text-gray-400 hover:text-[#164E3D] hover:bg-emerald-50 transition-colors"
                  >
                    <AppIcon name="edit" size="16" />
                  </button>
                  <button
                    type="button"
                    @click="confirmDelete(k.id_kategori_pelanggaran)"
                    class="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <AppIcon name="trash" size="16" />
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="filteredKategori.length === 0">
              <td colspan="3" class="py-12 text-center text-gray-400 text-sm">
                Belum ada data kategori pelanggaran.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form -->
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
              {{ editingKategori ? 'Edit Kategori' : 'Tambah Kategori Baru' }}
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
              <label class="block text-xs font-semibold text-gray-700 mb-1.5">Nama Kategori *</label>
              <input
                v-model="form.nama"
                type="text"
                required
                placeholder="Misal: Kedisiplinan & Kehadiran"
                class="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#164E3D]/20 focus:border-[#164E3D]"
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
                {{ editingKategori ? 'Simpan' : 'Tambahkan' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <ModalConfirm
      :is-open="isDeleteModalOpen"
      title="Hapus Kategori Pelanggaran"
      message="Apakah Anda yakin ingin menghapus kategori ini?"
      @confirm="handleDelete"
      @cancel="isDeleteModalOpen = false"
    />
  </div>
</template>

