<script setup lang="ts">
const store = useDataStore()
const api = useApi()

const seconds = ref(5048) // 01:24:08
const isRunning = ref(true)
const selectedNis = ref<number | null>(null)
let timerInterval: any = null

const activeStudents = computed(() => {
  return store.pelanggaranSiswas.value.filter(
    (p) => p.status_sanksi === 'Pending' || p.status_sanksi === 'Dalam Proses'
  )
})

watch(activeStudents, (list) => {
  if (!selectedNis.value && list.length > 0) {
    selectedNis.value = list[0]?.nis || null
  }
}, { immediate: true })

const currentRecord = computed(() => {
  return store.pelanggaranSiswas.value.find((p) => p.nis === selectedNis.value)
})

const formattedTime = computed(() => {
  const hrs = Math.floor(seconds.value / 3600)
  const mins = Math.floor((seconds.value % 3600) / 60)
  const secs = seconds.value % 60
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
})

const toggleTimer = () => {
  isRunning.value = !isRunning.value
}

const resetTimer = () => {
  isRunning.value = false
  seconds.value = 0
}

const completeCounseling = async () => {
  if (currentRecord.value) {
    await api.updatePelanggaranSiswa(currentRecord.value.id_pelanggaran_siswa, {
      status_sanksi: 'Selesai',
    })
    alert(`Sesi bimbingan selesai untuk ${currentRecord.value.nama_siswa}! Kasus ditandai Selesai.`)
    resetTimer()
  }
}

onMounted(() => {
  timerInterval = setInterval(() => {
    if (isRunning.value) {
      seconds.value++
    }
  }, 1000)
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})
</script>

<template>
  <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#113D2F] via-[#0E3528] to-[#09241B] p-6 text-white shadow-lg shadow-[#113D2F]/20 flex flex-col justify-between select-none h-full">
    <!-- Subtle organic wavy lines (Matches screenshot background) -->
    <div class="absolute inset-0 opacity-15 pointer-events-none">
      <svg class="w-full h-full object-cover" viewBox="0 0 300 200" fill="none">
        <path d="M-20 180 C 60 120, 140 220, 320 80" stroke="#34D399" stroke-width="20" stroke-linecap="round" opacity="0.4" />
        <path d="M-40 120 C 80 40, 160 160, 340 40" stroke="#10B981" stroke-width="35" stroke-linecap="round" opacity="0.3" />
        <path d="M-10 60 C 100 0, 200 120, 360 20" stroke="#059669" stroke-width="25" stroke-linecap="round" opacity="0.25" />
      </svg>
    </div>

    <!-- Title Header -->
    <div class="relative z-10 flex items-center justify-between">
      <h3 class="text-sm font-semibold tracking-wide text-emerald-100/90">
        Time Tracker Konseling
      </h3>
      <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-800/60 text-emerald-300 text-[10px] font-medium border border-emerald-700/50">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        Live
      </span>
    </div>

    <!-- Student Selector -->
    <div class="relative z-10 my-1">
      <select
        v-model.number="selectedNis"
        class="w-full text-xs bg-black/30 border border-emerald-600/30 text-emerald-100 rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-400"
      >
        <option :value="null">-- Sesi Konseling Umum --</option>
        <option
          v-for="s in activeStudents"
          :key="s.id_pelanggaran_siswa"
          :value="s.nis"
        >
          {{ s.nama_siswa }} ({{ s.nama_kelas }})
        </option>
      </select>
    </div>

    <!-- Big Digital Timer Display -->
    <div class="relative z-10 my-2 text-center">
      <div class="text-4xl md:text-5xl font-mono font-bold tracking-wider text-white drop-shadow-sm">
        {{ formattedTime }}
      </div>
      <p class="text-xs text-emerald-200/70 mt-1 font-sans">
        {{ currentRecord ? `Sedang membina: ${currentRecord.nama_siswa}` : 'Sesi Bimbingan & Konseling Aktif' }}
      </p>
    </div>

    <!-- Action Buttons (Matches screenshot: pause and red stop buttons) -->
    <div class="relative z-10 flex items-center justify-center gap-3 pt-1">
      <!-- Pause / Play button -->
      <button
        type="button"
        @click="toggleTimer"
        class="w-10 h-10 rounded-full bg-white text-gray-900 flex items-center justify-center shadow-md hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all"
        :title="isRunning ? 'Jeda' : 'Lanjutkan'"
      >
        <AppIcon :name="isRunning ? 'pause' : 'play'" size="16" />
      </button>

      <!-- Stop / Reset button (Red circle with white square) -->
      <button
        type="button"
        @click="resetTimer"
        class="w-10 h-10 rounded-full bg-[#E53935] text-white flex items-center justify-center shadow-md hover:bg-[#D32F2F] hover:scale-105 active:scale-95 transition-all"
        title="Hentikan & Reset"
      >
        <AppIcon name="stop" size="14" />
      </button>

      <!-- Quick complete button if student is active -->
      <button
        v-if="currentRecord && currentRecord.status_sanksi !== 'Selesai'"
        type="button"
        @click="completeCounseling"
        class="px-3 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold transition-all shadow-sm"
        title="Tandai kasus ini selesai ditangani"
      >
        Tandai Tuntas
      </button>
    </div>
  </div>
</template>
