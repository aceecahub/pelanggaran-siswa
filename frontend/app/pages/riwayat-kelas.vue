<script setup lang="ts">
import type { RiwayatKelas } from '~/types'

const api = useApi()
const store = useDataStore()

const searchQuery = ref('')
const filterTapel = ref<number | 'all'>('all')
const filterKelas = ref<number | 'all'>('all')

const isFormModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const targetDeleteId = ref<number | null>(null)

const form = ref<{
  id_tahun_ajaran: number
  id_kelas: number
  nis: number
}>({
  id_tahun_ajaran: 1,
  id_kelas: 1,
  nis: 20240101,
})

onMounted(async () => {
  await Promise.allSettled([
    api.getRiwayatKelas(),
    api.getSiswa(),
    api.getKelas(),
    api.getTapel(),
  ])
})

const getStudentName = (nis: number) => {
  const s = store.siswas.value.find((item) => item.nis === nis)
  return s ? s.nama_siswa : `Siswa NIS ${nis}`
}

const getClassName = (idKelas: number) => {
  const k = store.kelases.value.find((item) => item.id_kelas === idKelas)
  return k ? k.nama_kelas : `Kelas #${idKelas}`
}

const getTapelName = (idTapel: number) => {
  const t = store.tapels.value.find((item) => item.id_tahun_ajaran === idTapel)
  return t ? t.nama : `Tapel #${idTapel}`
}

const filteredList = computed(() => {
  return store.riwayatKelases.value.filter((r) => {
    const studentName = getStudentName(r.nis).toLowerCase()
    const matchesSearch =
      !searchQuery.value ||
      studentName.includes(searchQuery.value.toLowerCase()) ||
      String(r.nis).includes(searchQuery.value)

    const matchesTapel =
      filterTapel.value === 'all' || r.id_tahun_ajaran === filterTapel.value

    const matchesKelas =
      filterKelas.value === 'all' || r.id_kelas === filterKelas.value

    return matchesSearch && matchesTapel && matchesKelas
  })
})

const openCreateModal = () => {
  form.value = {
    id_tahun_ajaran: store.tapels.value[0]?.id_tahun_ajaran || 1,
    id_kelas: store.kelases.value[0]?.id_kelas || 1,
    nis: store.siswas.value[0]?.nis || 20240101,
  }
  isFormModalOpen.value = true
}

const confirmDelete = (id: number) => {
  targetDeleteId.value = id
  isDeleteModalOpen.value = true
}

const handleDelete = async () => {
  if (targetDeleteId.value !== null) {
    await api.deleteRiwayatKelas(targetDeleteId.value)
    isDeleteModalOpen.value = false
    targetDeleteId.value = null
  }
}

const handleSave = async () => {
  await api.createRiwayatKelas(form.value)
  isFormModalOpen.value = false
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
          <span class="text-[#164E3D] font-semibold">Riwayat Kelas</span>
        </div>
        <h1 class="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
          Riwayat & Penempatan Kelas Siswa
        </h1>
        <p class="text-sm text-gray-500 mt-0.5">
          Rekapitulasi riwayat penempatan kelas siswa pada tiap tahun ajaran dan semester.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button
          type="button"
          @click="openCreateModal"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#164E3D] hover:bg-[#113D2F] text-white text-sm font-medium shadow-sm hover:shadow-md transition-all active:scale-95"
        >
          <AppIcon name="plus" size="16" />
          <span>Tempatkan Siswa</span>
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
      <div class="relative w-full md:w-80">
        <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
          <AppIcon name="search" size="17" />
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari siswa atau NIS..."
          class="w-full pl-10 pr-4 py-2 rounded-full bg-[#F8F9FA] border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#164E3D]/20 focus:border-[#164E3D]"
        />
      </div>

      <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
        <div class="flex items-center gap-2">
          <span class="text-xs font-medium text-gray-400">Tapel:</span>
          <select
            v-model="filterTapel"
            class="px-3 py-1.5 rounded-full bg-[#F8F9FA] border border-gray-200 text-xs font-medium text-gray-700 focus:outline-none focus:border-[#164E3D]"
          >
            <option value="all">Semua Tahun Ajaran</option>
            <option
              v-for="t in store.tapels.value"
              :key="t.id_tahun_ajaran"
              :value="t.id_tahun_ajaran"
            >
              {{ t.nama }}
            </option>
          </select>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-xs font-medium text-gray-400">Kelas:</span>
          <select
            v-model="filterKelas"
            class="px-3 py-1.5 rounded-full bg-[#F8F9FA] border border-gray-200 text-xs font-medium text-gray-700 focus:outline-none focus:border-[#164E3D]"
          >
            <option value="all">Semua Kelas</option>
            <option
              v-for="k in store.kelases.value"
              :key="k.id_kelas"
              :value="k.id_kelas"
            >
              {{ k.nama_kelas }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-100 bg-[#F9FAFB]/70 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              <th class="py-3.5 px-6">ID</th>
              <th class="py-3.5 px-6">Siswa</th>
              <th class="py-3.5 px-4">Kelas</th>
              <th class="py-3.5 px-4">Tahun Ajaran</th>
              <th class="py-3.5 px-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 text-sm">
            <tr
              v-for="r in filteredList"
              :key="r.id_riwayat_kelas"
              class="hover:bg-gray-50/70 transition-colors group"
            >
              <td class="py-3.5 px-6 font-mono text-xs text-gray-400">
                #{{ r.id_riwayat_kelas }}
              </td>
              <td class="py-3.5 px-6">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-full bg-emerald-100 text-[#164E3D] font-bold text-xs flex items-center justify-center">
                    {{ getStudentName(r.nis).charAt(0) }}
                  </div>
                  <div>
                    <h4 class="font-bold text-gray-900 group-hover:text-[#164E3D] transition-colors">
                      {{ getStudentName(r.nis) }}
                    </h4>
                    <p class="text-xs text-gray-400 font-mono">
                      NIS: {{ r.nis }}
                    </p>
                  </div>
                </div>
              </td>
              <td class="py-3.5 px-4 font-semibold text-gray-800">
                {{ getClassName(r.id_kelas) }}
              </td>
              <td class="py-3.5 px-4 text-xs text-gray-600">
                <span class="px-2.5 py-1 rounded-full bg-gray-100 font-medium">
                  {{ getTapelName(r.id_tahun_ajaran) }}
                </span>
              </td>
              <td class="py-3.5 px-6 text-right">
                <button
                  type="button"
                  @click="confirmDelete(r.id_riwayat_kelas)"
                  class="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Hapus Penempatan"
                >
                  <AppIcon name="trash" size="16" />
                </button>
              </td>
            </tr>

            <tr v-if="filteredList.length === 0">
              <td colspan="5" class="py-12 text-center text-gray-400 text-sm">
                Belum ada data penempatan riwayat kelas.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isFormModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
      >
        <div class="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-gray-100">
          <div class="flex items-center justify-between pb-4 border-b border-gray-100">
            <h3 class="text-lg font-bold text-gray-900">
              Penempatan Kelas Siswa
            </h3>
            <button
              type="button"
              @click="isFormModalOpen = false"
              class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center"
            >
              <AppIcon name="x" size="16" />
            </button>
          </div>

          <form @submit.prevent="handleSave" class="mt-6 space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1.5">Pilih Siswa *</label>
              <select
                v-model.number="form.nis"
                required
                class="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#164E3D]"
              >
                <option
                  v-for="s in store.siswas.value"
                  :key="s.nis"
                  :value="s.nis"
                >
                  {{ s.nis }} - {{ s.nama_siswa }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1.5">Pilih Kelas *</label>
              <select
                v-model.number="form.id_kelas"
                required
                class="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#164E3D]"
              >
                <option
                  v-for="k in store.kelases.value"
                  :key="k.id_kelas"
                  :value="k.id_kelas"
                >
                  {{ k.nama_kelas }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1.5">Tahun Ajaran *</label>
              <select
                v-model.number="form.id_tahun_ajaran"
                required
                class="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#164E3D]"
              >
                <option
                  v-for="t in store.tapels.value"
                  :key="t.id_tahun_ajaran"
                  :value="t.id_tahun_ajaran"
                >
                  {{ t.nama }}
                </option>
              </select>
            </div>

            <div class="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
              <button
                type="button"
                @click="isFormModalOpen = false"
                class="px-5 py-2.5 rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                class="px-6 py-2.5 rounded-full bg-[#164E3D] hover:bg-[#113D2F] text-white text-sm font-medium shadow-sm"
              >
                Simpan Penempatan
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <ModalConfirm
      :is-open="isDeleteModalOpen"
      title="Hapus Penempatan Kelas"
      message="Apakah Anda yakin ingin menghapus data penempatan kelas siswa ini?"
      @confirm="handleDelete"
      @cancel="isDeleteModalOpen = false"
    />
  </div>
</template>

