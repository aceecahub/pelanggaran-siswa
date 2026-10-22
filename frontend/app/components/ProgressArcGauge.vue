<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    percentage?: number
    title?: string
    subtitle?: string
    countSelesai?: number
    countProses?: number
    countPending?: number
  }>(),
  {
    percentage: 0,
    title: 'Tingkat Penyelesaian Sanksi',
    subtitle: 'Sanksi Tertangani',
    countSelesai: 0,
    countProses: 0,
    countPending: 0,
  }
)

// Arc circumference for r=60 is PI * 60 ~= 188.5
const arcLength = 188.5

// Calculate dashoffset for progress
const dashOffset = computed(() => {
  const p = Math.min(100, Math.max(0, props.percentage))
  return arcLength - (arcLength * (p / 100))
})
</script>

<template>
  <div class="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between select-none h-full">
    <div class="flex items-center justify-between mb-2">
      <h3 class="text-base font-bold text-gray-900 tracking-tight">
        {{ title }}
      </h3>
    </div>

    <!-- Arc Gauge SVG matching Donezo with dynamic stroke -->
    <div class="relative flex flex-col items-center justify-center my-auto py-2">
      <svg class="w-48 h-28 overflow-visible" viewBox="0 0 160 90">
        <!-- Background Arc Track -->
        <path
          d="M 20 80 A 60 60 0 0 1 140 80"
          fill="none"
          stroke="#F3F4F6"
          stroke-width="16"
          stroke-linecap="round"
        />
        <!-- In Progress Segment (Mint Background) -->
        <path
          d="M 20 80 A 60 60 0 0 1 140 80"
          fill="none"
          stroke="#A7F3D0"
          stroke-width="16"
          stroke-linecap="round"
          stroke-dasharray="188.5"
          :stroke-dashoffset="dashOffset > 0 ? Math.max(0, dashOffset - 30) : 0"
          class="transition-all duration-700 ease-out"
        />
        <!-- Completed Segment (Deep Forest Green) -->
        <path
          d="M 20 80 A 60 60 0 0 1 140 80"
          fill="none"
          stroke="#164E3D"
          stroke-width="16"
          stroke-linecap="round"
          stroke-dasharray="188.5"
          :stroke-dashoffset="dashOffset"
          class="transition-all duration-700 ease-out"
        />
      </svg>

      <!-- Center Number -->
      <div class="text-center -mt-6">
        <span class="text-4xl font-extrabold text-gray-900 tracking-tight">
          {{ percentage }}%
        </span>
        <p class="text-xs text-gray-400 font-medium">
          {{ subtitle }}
        </p>
      </div>
    </div>

    <!-- Legend matching screenshot with real counts -->
    <div class="flex items-center justify-center gap-3 text-xs font-medium text-gray-500 pt-2 border-t border-gray-50">
      <div class="flex items-center gap-1.5" title="Sanksi Selesai">
        <span class="w-2.5 h-2.5 rounded-full bg-[#164E3D]" />
        <span>Selesai ({{ countSelesai }})</span>
      </div>
      <div class="flex items-center gap-1.5" title="Dalam Pembinaan">
        <span class="w-2.5 h-2.5 rounded-full bg-[#368D6B]" />
        <span>Proses ({{ countProses }})</span>
      </div>
      <div class="flex items-center gap-1.5" title="Kasus Pending">
        <span class="w-2.5 h-2.5 rounded-full border border-gray-400 bg-[repeating-linear-gradient(45deg,#9CA3AF,#9CA3AF_1px,transparent_1px,transparent_3px)]" />
        <span>Pending ({{ countPending }})</span>
      </div>
    </div>
  </div>
</template>
