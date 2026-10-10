<script setup lang="ts">
const api = useApi()
const store = useDataStore()

const searchQuery = ref('')
const filterAksi = ref('all')

onMounted(async () => {
  await api.getActivityLog()
})

const filteredLogs = computed(() => {
  return store.logs.value.filter((l) => {
    const matchesSearch =
      !searchQuery.value ||
      l.deskripsi.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      l.nama_tabel.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      l.user?.username.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesAksi = filterAksi.value === 'all' || l.aksi === filterAksi.value

    return matchesSearch && matchesAksi
  })
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 text-xs text-gray-400 font-medium mb-1">
          <NuxtLink to="/" class="hover:text-gray-700">Dashboard</NuxtLink>
          <span>/</span>
          <span class="text-[#164E3D] font-semibold">Log Aktivitas</span>
        </div>
        <h1 class="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
          Audit Log & Riwayat Aktivitas
        </h1>
        <p class="text-sm text-gray-500 mt-0.5">
          Rekam jejak tindakan pengguna, manipulasi data master, dan pencatatan pelanggaran.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <span class="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200/60">
          ● Sistem Audit Aktif
        </span>
      </div>
    </div>

    <!-- Filter Card -->
    <div class="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
      <div class="relative w-full md:w-80">
        <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
          <AppIcon name="search" size="17" />
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari deskripsi, tabel, atau user..."
          class="w-full pl-10 pr-4 py-2 rounded-full bg-[#F8F9FA] border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#164E3D]/20 focus:border-[#164E3D]"
        />
      </div>

      <div class="flex items-center gap-3 w-full md:w-auto">
        <span class="text-xs font-medium text-gray-400">Aksi:</span>
        <select
          v-model="filterAksi"
          class="px-4 py-1.5 rounded-full bg-[#F8F9FA] border border-gray-200 text-xs font-medium text-gray-700 focus:outline-none focus:border-[#164E3D]"
        >
          <option value="all">Semua Aksi</option>
          <option value="CREATE">CREATE (Tambah)</option>
          <option value="UPDATE">UPDATE (Ubah)</option>
          <option value="DELETE">DELETE (Hapus)</option>
          <option value="RESTORE">RESTORE (Pulihkan)</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-100 bg-[#F9FAFB]/70 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              <th class="py-3.5 px-6">Waktu</th>
              <th class="py-3.5 px-4">User</th>
              <th class="py-3.5 px-4">Aksi</th>
              <th class="py-3.5 px-4">Tabel / Target</th>
              <th class="py-3.5 px-6">Deskripsi Aktivitas</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 text-sm">
            <tr
              v-for="l in filteredLogs"
              :key="l.id_activity_log"
              class="hover:bg-gray-50/70 transition-colors"
            >
              <td class="py-3.5 px-6 text-xs text-gray-400 font-mono whitespace-nowrap">
                {{ l.created_at ? new Date(l.created_at).toLocaleString('id-ID') : 'Baru saja' }}
              </td>
              <td class="py-3.5 px-4">
                <span class="inline-flex items-center gap-1.5 font-semibold text-gray-800 text-xs">
                  <span class="w-5 h-5 rounded-full bg-emerald-100 text-[#164E3D] text-[10px] flex items-center justify-center font-bold">
                    {{ (l.user?.username || 'U').charAt(0).toUpperCase() }}
                  </span>
                  {{ l.user?.username || 'admin' }}
                </span>
              </td>
              <td class="py-3.5 px-4">
                <span
                  class="inline-flex px-2 py-0.5 rounded text-[10px] font-bold font-mono"
                  :class="[
                    l.aksi === 'CREATE'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : l.aksi === 'UPDATE'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : l.aksi === 'DELETE'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-purple-50 text-purple-700 border border-purple-200',
                  ]"
                >
                  {{ l.aksi }}
                </span>
              </td>
              <td class="py-3.5 px-4 text-xs font-mono text-gray-600">
                {{ l.nama_tabel }} #{{ l.record_id }}
              </td>
              <td class="py-3.5 px-6 text-xs text-gray-800 font-medium">
                {{ l.deskripsi }}
              </td>
            </tr>

            <tr v-if="filteredLogs.length === 0">
              <td colspan="5" class="py-12 text-center text-gray-400 text-sm">
                Belum ada rekam jejak aktivitas.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

