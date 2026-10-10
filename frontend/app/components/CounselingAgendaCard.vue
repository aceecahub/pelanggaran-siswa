<script setup lang="ts">
import type { PelanggaranSiswa } from '~/types'

const store = useDataStore()
const api = useApi()

// Find the most urgent violation (Pending status, sorted by highest points)
const urgentCase = computed<PelanggaranSiswa | null>(() => {
  const pendingCases = store.pelanggaranSiswas.value.filter((p) => p.status_sanksi === 'Pending')
  if (pendingCases.length === 0) {
    // If no pending, find cases currently in progress
    const inProgressCases = store.pelanggaranSiswas.value.filter((p) => p.status_sanksi === 'Dalam Proses')
    return inProgressCases[0] || null
  }
  // Sort by point descending (highest point = most severe)
  return [...pendingCases].sort((a, b) => b.point - a.point)[0] || null
})

const handleStartCounseling = async () => {
  if (urgentCase.value) {
    if (urgentCase.value.status_sanksi === 'Pending') {
      await api.updatePelanggaranSiswa(urgentCase.value.id_pelanggaran_siswa, {
        status_sanksi: 'Dalam Proses',
      })
      alert(`Sesi konseling untuk ${urgentCase.value.nama_siswa} telah dimulai! Status sanksi diperbarui ke "Dalam Proses".`)
    } else {
      navigateTo('/pelanggaran-siswa')
    }
  } else {
    navigateTo('/pelanggaran-siswa')
  }
}
</script>

<template>
  <div class="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-full select-none">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
        <AppIcon name="calendar" size="14" class="text-gray-400" />
        Agenda Konseling BK
      </span>
      <span
        class="w-2.5 h-2.5 rounded-full"
        :class="urgentCase ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'"
      />
    </div>

    <!-- Dynamic Content based on urgentCase -->
    <div v-if="urgentCase" class="my-auto space-y-2.5">
      <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
        Kasus Butuh Tindakan Segera
      </div>
      <h3 class="text-xl font-bold text-gray-900 leading-snug">
        {{ urgentCase.nama_siswa }}
        <span class="text-sm font-normal text-gray-500 block font-mono">
          {{ urgentCase.nama_kelas }} • NIS {{ urgentCase.nis }}
        </span>
      </h3>
      <p class="text-xs text-gray-600 line-clamp-2">
        <span class="font-semibold text-gray-800">Pelanggaran:</span> {{ urgentCase.nama_pelanggaran }}
        <span class="font-bold text-rose-600 font-mono">(+{{ urgentCase.point }} Poin)</span>
      </p>
      <div class="p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-[11px] text-gray-600">
        <span class="text-gray-400 block text-[10px]">Tindak Lanjut / Sanksi:</span>
        <span class="font-medium text-gray-800">{{ urgentCase.sanksi || 'Pembinaan guru BK & wali kelas' }}</span>
      </div>
      <p class="text-[11px] text-gray-400 font-medium">
        Jadwal : Hari ini • Ruang Konseling BK
      </p>
    </div>

    <!-- Empty / All clear state -->
    <div v-else class="my-auto py-4 text-center space-y-2">
      <div class="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
        <AppIcon name="check" size="24" />
      </div>
      <h4 class="text-base font-bold text-gray-900">
        Semua Kasus Tertangani!
      </h4>
      <p class="text-xs text-gray-400 max-w-xs mx-auto">
        Tidak ada pelanggaran pending yang membutuhkan pemanggilan orang tua saat ini.
      </p>
    </div>

    <!-- Action Button -->
    <div class="pt-4 border-t border-gray-50">
      <button
        type="button"
        @click="handleStartCounseling"
        class="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-[#164E3D] hover:bg-[#113D2F] text-white text-sm font-medium shadow-sm hover:shadow-md transition-all active:scale-95"
      >
        <AppIcon name="video" size="18" />
        <span>{{ urgentCase ? 'Mulai Sesi Konseling' : 'Lihat Data Pelanggaran' }}</span>
      </button>
    </div>
  </div>
</template>

