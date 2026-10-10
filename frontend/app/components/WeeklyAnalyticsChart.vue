<script setup lang="ts">
const days = [
  { label: 'S', height: '55%', type: 'striped' },
  { label: 'M', height: '78%', type: 'forest' },
  { label: 'T', height: '74%', type: 'mint', badge: '74%' },
  { label: 'W', height: '95%', type: 'forest' },
  { label: 'T', height: '65%', type: 'striped' },
  { label: 'F', height: '55%', type: 'striped' },
  { label: 'S', height: '42%', type: 'striped' },
]
</script>

<template>
  <div class="bg-white rounded-3xl p-6 border border-gray-100/90 shadow-sm flex flex-col justify-between h-full select-none">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-base font-bold text-gray-900 tracking-tight">
        Analisis Tren Mingguan
      </h3>
      <span class="text-xs text-gray-400 font-medium">7 Hari Terakhir</span>
    </div>

    <!-- The 7 Capsule Bars (Matches screenshot) -->
    <div class="flex items-end justify-between gap-3 h-48 pt-6 pb-2 px-2">
      <div
        v-for="(day, idx) in days"
        :key="idx"
        class="flex flex-col items-center flex-1 h-full justify-end group cursor-pointer"
      >
        <!-- Floating badge for highlight day e.g. '74%' -->
        <div
          v-if="day.badge"
          class="mb-1 px-1.5 py-0.5 rounded-full bg-emerald-100 text-[#164E3D] text-[10px] font-bold shadow-xs transition-transform group-hover:scale-110"
        >
          {{ day.badge }}
        </div>
        <div v-else class="h-5" />

        <!-- Vertical Pill Bar -->
        <div class="w-full max-w-[28px] h-36 flex items-end">
          <div
            class="w-full rounded-full transition-all duration-300 group-hover:opacity-90 relative overflow-hidden"
            :style="{ height: day.height }"
            :class="[
              day.type === 'forest'
                ? 'bg-[#164E3D]'
                : day.type === 'mint'
                ? 'bg-[#368D6B]'
                : 'border border-gray-300/80 bg-repeating-diagonal',
            ]"
          >
            <!-- Diagonal stripes pattern for striped days -->
            <div
              v-if="day.type === 'striped'"
              class="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(45deg,#9CA3AF,#9CA3AF_2px,transparent_2px,transparent_6px)]"
            />
          </div>
        </div>

        <!-- Day Label S, M, T, W, T, F, S -->
        <span class="mt-3 text-xs font-semibold text-gray-400 group-hover:text-gray-800 transition-colors">
          {{ day.label }}
        </span>
      </div>
    </div>
  </div>
</template>

