<script setup lang="ts">
const store = useDataStore()

const categoryStats = computed(() => {
  const records = store.pelanggaranSiswas.value
  const total = records.length || 1

  // Color & Icon themes for categories
  const themes = [
    { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'pelanggaran' },
    { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: 'check' },
    { bg: 'bg-purple-50', text: 'text-purple-600', icon: 'tag' },
    { bg: 'bg-rose-50', text: 'text-rose-600', icon: 'shield-alert' },
  ]

  // Map each category
  return store.kategoris.value.map((kat, idx) => {
    const theme = themes[idx % themes.length]
    // Filter records matching this category
    const matching = records.filter(
      (r) => r.id_kategori_pelanggaran === kat.id_kategori_pelanggaran
    )
    const count = matching.length
    const points = matching.reduce((sum, r) => sum + (Number(r.point) || 0), 0)
    const percent = Math.round((count / total) * 100)

    return {
      id: kat.id_kategori_pelanggaran,
      name: kat.nama,
      count,
      points,
      percent,
      ...theme,
    }
  })
})
</script>

<template>
  <div class="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-full select-none">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-base font-bold text-gray-900 tracking-tight">
          Kategori Pelanggaran
        </h3>
        <p class="text-xs text-gray-400 mt-0.5">
          Distribusi kasus berdasarkan tata tertib
        </p>
      </div>
      <NuxtLink
        to="/pelanggaran-siswa"
        class="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
      >
        + Catat
      </NuxtLink>
    </div>

    <!-- Category Distribution Items (Donezo project list style) -->
    <div class="space-y-3.5 my-auto">
      <div
        v-for="cat in categoryStats"
        :key="cat.id"
        class="flex items-center justify-between gap-3 group"
      >
        <div class="flex items-center gap-3 min-w-0">
          <!-- Icon badge matching screenshot -->
          <div
            class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
            :class="[cat.bg, cat.text]"
          >
            <AppIcon :name="cat.icon" size="16" />
          </div>

          <div class="min-w-0">
            <h4 class="text-xs font-bold text-gray-900 truncate">
              {{ cat.name }}
            </h4>
            <div class="flex items-center gap-2 text-[11px] text-gray-400">
              <span>{{ cat.count }} Kasus</span>
              <span>•</span>
              <span class="font-mono text-gray-600 font-medium">+{{ cat.points }} Poin</span>
            </div>
          </div>
        </div>

        <!-- Percentage bar / badge -->
        <div class="text-right shrink-0">
          <span class="text-xs font-bold text-gray-800 font-mono">
            {{ cat.percent }}%
          </span>
          <div class="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden mt-1">
            <div
              class="h-full rounded-full transition-all duration-500"
              :class="cat.count > 0 ? 'bg-[#164E3D]' : 'bg-gray-200'"
              :style="{ width: `${cat.percent}%` }"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom link -->
    <div class="pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500">
      <span>Kelola katalog tata tertib</span>
      <NuxtLink to="/master/kategori-pelanggaran" class="text-[#164E3D] hover:underline font-semibold text-[11px]">
        Master Kategori →
      </NuxtLink>
    </div>
  </div>
</template>

