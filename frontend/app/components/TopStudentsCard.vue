<script setup lang="ts">
const store = useDataStore()

// Calculate students ranked by highest accumulated points
const rankedStudents = computed(() => {
  const records = store.pelanggaranSiswas.value
  const studentMap = new Map<number, {
    nis: number
    nama: string
    kelas: string
    totalPoints: number
    violationsCount: number
    latestStatus: string
  }>()

  // Aggregate points per student from violations
  records.forEach((r) => {
    const existing = studentMap.get(r.nis)
    const points = Number(r.point) || 0
    if (existing) {
      existing.totalPoints += points
      existing.violationsCount++
      if (r.status_sanksi === 'Pending') existing.latestStatus = 'Pending'
    } else {
      studentMap.set(r.nis, {
        nis: r.nis,
        nama: r.nama_siswa,
        kelas: r.nama_kelas,
        totalPoints: points,
        violationsCount: 1,
        latestStatus: r.status_sanksi,
      })
    }
  })

  // If no violations yet, show top registered students from store
  if (studentMap.size === 0) {
    return store.siswas.value.slice(0, 4).map((s, idx) => ({
      nis: s.nis,
      nama: s.nama_siswa,
      kelas: store.kelases.value[idx % store.kelases.value.length]?.nama_kelas || '-',
      totalPoints: 0,
      violationsCount: 0,
      latestStatus: 'Bersih',
    }))
  }

  // Convert map to array and sort by total points descending
  return Array.from(studentMap.values())
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .slice(0, 4)
})

const getStatusBadge = (points: number, status: string) => {
  if (points >= 100) {
    return { text: 'SP 3 (Skorsing)', class: 'bg-rose-100 text-rose-800 border-rose-300' }
  } else if (points >= 50) {
    return { text: 'SP 2 (Ortu)', class: 'bg-amber-100 text-amber-800 border-amber-300' }
  } else if (points >= 25) {
    return { text: 'SP 1 (Surat)', class: 'bg-yellow-100 text-yellow-800 border-yellow-300' }
  } else if (points > 0) {
    return { text: 'Teguran Lisan', class: 'bg-blue-50 text-blue-700 border-blue-200' }
  }
  return { text: 'Disiplin Baik', class: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
}
</script>

<template>
  <div class="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-full select-none">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-base font-bold text-gray-900 tracking-tight">
          Siswa Perlu Perhatian Khusus
        </h3>
        <p class="text-xs text-gray-400 mt-0.5">
          Akumulasi poin tertinggi & status surat peringatan
        </p>
      </div>
      <NuxtLink
        to="/master/siswa"
        class="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
      >
        + Data Siswa
      </NuxtLink>
    </div>

    <!-- Student List (Matches Donezo Team Collaboration style) -->
    <div v-if="rankedStudents.length > 0" class="space-y-4 my-auto">
      <div
        v-for="st in rankedStudents"
        :key="st.nis"
        class="flex items-center justify-between gap-3 group"
      >
        <div class="flex items-center gap-3 min-w-0">
          <!-- Avatar circle with initial -->
          <div
            class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0"
            :class="[
              st.totalPoints >= 50
                ? 'bg-rose-100 text-rose-800'
                : st.totalPoints > 0
                ? 'bg-amber-100 text-amber-800'
                : 'bg-emerald-100 text-[#164E3D]',
            ]"
          >
            {{ st.nama.charAt(0) }}
          </div>

          <div class="min-w-0">
            <h4 class="text-xs font-bold text-gray-900 truncate group-hover:text-[#164E3D] transition-colors">
              {{ st.nama }}
            </h4>
            <p class="text-[11px] text-gray-400 truncate">
              {{ st.kelas }} • <span class="font-mono text-gray-600 font-semibold">{{ st.totalPoints }} Poin</span>
              <span v-if="st.violationsCount > 0" class="text-gray-400 text-[10px]"> ({{ st.violationsCount }} kasus)</span>
            </p>
          </div>
        </div>

        <!-- Disciplinary Status Badge -->
        <span
          class="px-2.5 py-0.5 text-[10px] font-semibold rounded-full border shrink-0 font-sans"
          :class="getStatusBadge(st.totalPoints, st.latestStatus).class"
        >
          {{ getStatusBadge(st.totalPoints, st.latestStatus).text }}
        </span>
      </div>
    </div>
    <div v-else class="my-auto py-8 text-center text-xs text-gray-400">
      Belum ada data siswa atau kasus tercatat.
    </div>

    <!-- Bottom link -->
    <div class="pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500">
      <span>Lihat seluruh daftar siswa</span>
      <NuxtLink to="/master/siswa" class="text-[#164E3D] hover:underline font-semibold text-[11px]">
        Master Siswa →
      </NuxtLink>
    </div>
  </div>
</template>

