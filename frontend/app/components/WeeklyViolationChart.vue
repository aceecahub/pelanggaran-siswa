<script setup lang="ts">
const store = useDataStore()

// Days of week analysis (last 7 days)
const dayNamesShort = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

const weeklyStats = computed(() => {
  const records = store.pelanggaranSiswas.value
  const today = new Date()
  const days: Array<{
    dateStr: string
    dayLabel: string
    fullDate: string
    count: number
    points: number
    heightPercent: number
    isPeak: boolean
  }> = []

  // Generate 7 days back to today
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(today.getDate() - i)
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    const dateStr = `${yyyy}-${mm}-${dd}`
    const dayLabel = dayNamesShort[d.getDay()] || 'Sen'
    const fullDate = d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })

    // Count records matching this date
    const matching = records.filter((r) => {
      if (!r.tgl) return false
      return r.tgl.startsWith(dateStr) || r.tgl === dateStr
    })

    const count = matching.length
    const points = matching.reduce((sum, r) => sum + (Number(r.point) || 0), 0)

    days.push({
      dateStr,
      dayLabel,
      fullDate,
      count,
      points,
      heightPercent: 0,
      isPeak: false,
    })
  }

  const maxCount = Math.max(...days.map((d) => d.count), 1)

  days.forEach((d) => {
    if (d.count > 0) {
      d.heightPercent = Math.max(30, Math.round((d.count / maxCount) * 100))
    } else {
      d.heightPercent = 20 // baseline minimum height
    }
    if (d.count === maxCount && maxCount > 0) {
      d.isPeak = true
    }
  })

  return days
})

const totalWeekViolations = computed(() => {
  return weeklyStats.value.reduce((sum, d) => sum + d.count, 0)
})

const totalWeekPoints = computed(() => {
  return weeklyStats.value.reduce((sum, d) => sum + d.points, 0)
})

const peakDay = computed(() => {
  return weeklyStats.value.find((d) => d.isPeak && d.count > 0)
})
</script>

<template>
  <div class="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-full select-none">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-base font-bold text-gray-900 tracking-tight">
          Tren Pelanggaran Mingguan
        </h3>
        <p class="text-xs text-gray-400 mt-0.5">
          {{ totalWeekViolations }} Kasus tercatat ({{ totalWeekPoints }} Poin akumulasi)
        </p>
      </div>
      <span class="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-[#164E3D] border border-emerald-200/50">
        7 Hari Terakhir
      </span>
    </div>

    <!-- Capsule Bar Chart (Matches Donezo visual style with live data) -->
    <div class="flex items-end justify-between gap-2.5 h-48 pt-6 pb-2 px-2">
      <div
        v-for="d in weeklyStats"
        :key="d.dateStr"
        class="flex flex-col items-center flex-1 h-full justify-end group cursor-pointer relative"
      >
        <!-- Floating badge on peak day e.g. '3 Kasus' -->
        <div
          v-if="d.isPeak && d.count > 0"
          class="mb-1.5 px-2 py-0.5 rounded-full bg-emerald-100 text-[#164E3D] text-[10px] font-bold shadow-xs whitespace-nowrap animate-bounce"
        >
          Peak ({{ d.count }})
        </div>
        <div v-else-if="d.count > 0" class="mb-1.5 text-[10px] font-bold text-emerald-800 opacity-0 group-hover:opacity-100 transition-opacity">
          {{ d.count }}
        </div>
        <div v-else class="h-5" />

        <!-- Vertical Pill Bar -->
        <div class="w-full max-w-[32px] h-36 flex items-end">
          <div
            class="w-full rounded-full transition-all duration-300 group-hover:scale-105 relative overflow-hidden shadow-2xs"
            :style="{ height: `${d.heightPercent}%` }"
            :class="[
              d.isPeak && d.count > 0
                ? 'bg-[#164E3D]'
                : d.count > 0
                ? 'bg-[#368D6B]'
                : 'border border-gray-300/80 bg-repeating-diagonal opacity-60',
            ]"
            :title="`${d.fullDate}: ${d.count} Kasus (+${d.points} Poin)`"
          >
            <!-- Diagonal stripes pattern for zero days -->
            <div
              v-if="d.count === 0"
              class="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(45deg,#9CA3AF,#9CA3AF_2px,transparent_2px,transparent_6px)]"
            />
          </div>
        </div>

        <!-- Day Label -->
        <span
          class="mt-3 text-xs font-semibold transition-colors"
          :class="d.count > 0 ? 'text-gray-900 font-bold' : 'text-gray-400 group-hover:text-gray-700'"
        >
          {{ d.dayLabel }}
        </span>
      </div>
    </div>

    <!-- Bottom Summary Note -->
    <div class="pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500">
      <span>Hari terbanyak: <strong class="text-gray-900">{{ peakDay ? `${peakDay.dayLabel} (${peakDay.count} kasus)` : 'Tidak ada' }}</strong></span>
      <NuxtLink to="/pelanggaran-siswa" class="text-[#164E3D] hover:underline font-semibold text-[11px]">
        Lihat detail →
      </NuxtLink>
    </div>
  </div>
</template>

