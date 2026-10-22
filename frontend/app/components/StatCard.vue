<script setup lang="ts">
defineProps<{
  title: string
  value: string | number
  trendText?: string
  trendType?: 'primary' | 'neutral' | 'warning'
  isHighlight?: boolean
  to?: string
}>()
</script>

<template>
  <component
    :is="to ? 'NuxtLink' : 'div'"
    :to="to"
    class="relative h-full w-full rounded-3xl p-5 transition-all duration-200 select-none flex flex-col justify-between"
    :class="[
      isHighlight
        ? 'bg-[#164E3D] text-white shadow-lg shadow-[#164E3D]/25 hover:shadow-xl hover:shadow-[#164E3D]/30'
        : 'bg-white text-gray-900 border border-gray-100/90 shadow-sm hover:shadow-md',
      to ? 'cursor-pointer hover:-translate-y-0.5' : '',
    ]"
  >
    <!-- Top Row: Title & Circular Arrow Icon Button -->
    <div class="flex items-center justify-between">
      <span
        class="text-xs md:text-sm font-semibold tracking-tight line-clamp-1"
        :class="isHighlight ? 'text-emerald-100/90' : 'text-gray-500'"
      >
        {{ title }}
      </span>

      <!-- Circular Arrow Icon Button (Matches screenshot '↗') -->
      <div
        class="w-7 h-7 rounded-full flex items-center justify-center transition-colors shrink-0"
        :class="isHighlight ? 'bg-white text-gray-900' : 'border border-gray-200 text-gray-700 bg-white'"
      >
        <AppIcon name="arrow-up-right" size="13" />
      </div>
    </div>

    <!-- Big Bold Number -->
    <div class="my-2">
      <div
        class="text-3xl md:text-4xl font-extrabold tracking-tight"
        :class="isHighlight ? 'text-white' : 'text-gray-900'"
      >
        {{ value }}
      </div>
    </div>

    <!-- Bottom Trend / Subtitle Badge -->
    <div v-if="trendText" class="flex items-center gap-2">
      <span
        class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium"
        :class="[
          isHighlight
            ? 'bg-emerald-800/60 text-emerald-200 border border-emerald-700/50'
            : trendType === 'warning'
            ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
            : 'bg-gray-100 text-gray-600 border border-gray-200/60',
        ]"
      >
        <span class="text-[10px]">↗</span>
        <span>{{ trendText }}</span>
      </span>
    </div>
  </component>
</template>

