<script setup lang="ts">
import type { Sampah } from '~/types'

const api = useApi()
const store = useDataStore()

const searchQuery = ref('')
const isDetailModalOpen = ref(false)
const isConfirmModalOpen = ref(false)
const selectedSampah = ref<Sampah | null>(null)
const confirmActionType = ref<'restore' | 'delete'>('restore')
const targetId = ref<number | null>(null)

onMounted(async () => {
  await api.getSampah()
})

const filteredSampah = computed(() => {
  return store.sampahs.value.filter((s) => {
    return (
      !searchQuery.value ||
      s.nama_tabel.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      s.delete_data.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })
})

const openDetailModal = (s: Sampah) => {
  selectedSampah.value = s
  isDetailModalOpen.value = true
}

const confirmRestore = (id: number) => {
  targetId.value = id
  confirmActionType.value = 'restore'
  isConfirmModalOpen.value = true
}

const confirmDeletePermanent = (id: number) => {
  targetId.value = id
  confirmActionType.value = 'delete'
  isConfirmModalOpen.value = true
}

const handleConfirm = async () => {
  if (targetId.value !== null) {
    if (confirmActionType.value === 'restore') {
      await api.restoreSampah(targetId.value)
    } else {
      await api.deletePermanentSampah(targetId.value)
    }
    isConfirmModalOpen.value = false
    targetId.value = null
  }
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
          <span class="text-[#164E3D] font-semibold">Kotak Sampah</span>
        </div>
        <h1 class="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
          Kotak Sampah (Recycle Bin)
        </h1>
        <p class="text-sm text-gray-500 mt-0.5">
          Data yang telah dihapus dapat dipulihkan kembali atau dibersihkan secara permanen.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <span class="px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200/60">
          {{ filteredSampah.length }} Item Tersimpan
        </span>
      </div>
    </div>

    <!-- Filter Card -->
    <div class="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
      <div class="relative w-full md:w-80">
        <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
          <AppIcon name="search" size="17" />
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari tabel atau isi data..."
          class="w-full pl-10 pr-4 py-2 rounded-full bg-[#F8F9FA] border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#164E3D]/20 focus:border-[#164E3D]"
        />
      </div>

      <span class="text-xs text-gray-400 font-medium">
        Penghapusan Aman (Soft Delete)
      </span>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-100 bg-[#F9FAFB]/70 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              <th class="py-3.5 px-6">ID</th>
              <th class="py-3.5 px-6">Tabel Sumber</th>
              <th class="py-3.5 px-4">Record ID</th>
              <th class="py-3.5 px-6">Pratinjau Data</th>
              <th class="py-3.5 px-4">Waktu Dihapus</th>
              <th class="py-3.5 px-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 text-sm">
            <tr
              v-for="s in filteredSampah"
              :key="s.id_sampah"
              class="hover:bg-gray-50/70 transition-colors group"
            >
              <td class="py-3.5 px-6 font-mono text-xs text-gray-400">
                #{{ s.id_sampah }}
              </td>
              <td class="py-3.5 px-6">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800 font-mono">
                  {{ s.nama_tabel }}
                </span>
              </td>
              <td class="py-3.5 px-4 font-mono font-semibold text-gray-700">
                #{{ s.record_id }}
              </td>
              <td class="py-3.5 px-6 max-w-xs">
                <button
                  type="button"
                  @click="openDetailModal(s)"
                  class="text-xs text-gray-600 hover:text-[#164E3D] truncate block text-left font-mono bg-gray-50 px-2 py-1 rounded-lg border border-gray-200/50"
                  title="Klik untuk melihat isi lengkap"
                >
                  {{ s.delete_data }}
                </button>
              </td>
              <td class="py-3.5 px-4 text-xs text-gray-400 font-mono whitespace-nowrap">
                {{ s.delete_at ? new Date(s.delete_at).toLocaleDateString('id-ID') : 'Hari ini' }}
              </td>
              <td class="py-3.5 px-6 text-right">
                <div class="inline-flex items-center gap-2">
                  <!-- Restore -->
                  <button
                    type="button"
                    @click="confirmRestore(s.id_sampah)"
                    class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition-colors"
                  >
                    <AppIcon name="restore" size="14" />
                    <span>Pulihkan</span>
                  </button>

                  <!-- Delete Permanent -->
                  <button
                    type="button"
                    @click="confirmDeletePermanent(s.id_sampah)"
                    class="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Hapus Permanen"
                  >
                    <AppIcon name="trash" size="16" />
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="filteredSampah.length === 0">
              <td colspan="6" class="py-12 text-center text-gray-400 text-sm">
                Kotak sampah kosong. Tidak ada data yang dihapus saat ini.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Detail Payload Modal -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isDetailModalOpen && selectedSampah"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
      >
        <div class="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-gray-100">
          <div class="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h3 class="text-lg font-bold text-gray-900">
                Isi Data Sampah (Snapshot)
              </h3>
              <p class="text-xs text-gray-400">
                Tabel: {{ selectedSampah.nama_tabel }} • ID: {{ selectedSampah.record_id }}
              </p>
            </div>
            <button
              type="button"
              @click="isDetailModalOpen = false"
              class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center"
            >
              <AppIcon name="x" size="16" />
            </button>
          </div>

          <div class="mt-4">
            <pre class="bg-[#F8F9FA] p-4 rounded-2xl text-xs font-mono text-gray-800 overflow-x-auto max-h-72 border border-gray-100 leading-relaxed">{{ JSON.stringify(JSON.parse(selectedSampah.delete_data || '{}'), null, 2) }}</pre>
          </div>

          <div class="mt-6 flex justify-end">
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
      :is-open="isConfirmModalOpen"
      :title="confirmActionType === 'restore' ? 'Pulihkan Data' : 'Hapus Permanen'"
      :message="confirmActionType === 'restore' ? 'Apakah Anda yakin ingin memulihkan data ini kembali ke tabel asalnya?' : 'PERINGATAN: Tindakan ini akan menghapus data secara permanen dari basis data dan tidak dapat dibatalkan.'"
      :confirm-text="confirmActionType === 'restore' ? 'Ya, Pulihkan' : 'Hapus Permanen'"
      :is-danger="confirmActionType === 'delete'"
      @confirm="handleConfirm"
      @cancel="isConfirmModalOpen = false"
    />
  </div>
</template>

