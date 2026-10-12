<script setup lang="ts">
import type { Sampah } from "~/types";

const { sampahs, getSampah, restoreSampah, deletePermanentSampah, loading } =
  useSampah();

const searchQuery = ref("");
const isDetailModalOpen = ref(false);
const isConfirmModalOpen = ref(false);
const selectedSampah = ref<Sampah | null>(null);
const confirmActionType = ref<"restore" | "delete">("restore");
const targetId = ref<number | null>(null);
const activeTab = ref<"formatted" | "raw">("formatted");
const copied = ref(false);

const loadData = async () => {
  await getSampah();
};

onMounted(() => {
  loadData();
});

const parseData = (rawJson: string): Record<string, any> => {
  try {
    return JSON.parse(rawJson || "{}");
  } catch {
    return {};
  }
};

// Helper to provide human readable concise summary for each table type
const getSummary = (s: Sampah) => {
  const data = parseData(s.delete_data);
  const tbl = s.nama_tabel.toLowerCase();

  if (tbl.includes("siswa") && !tbl.includes("pelanggaran")) {
    return {
      title: data.nama_siswa || `NIS: ${data.nis || s.record_id}`,
      subtitle: data.nis ? `NIS: ${data.nis}` : undefined,
      tag: data.status_aktif || "Siswa",
    };
  }
  if (tbl.includes("jurusan")) {
    return {
      title: data.nama_jurusan || data.kd_jurusan || `ID: ${s.record_id}`,
      subtitle: data.kd_jurusan ? `Kode: ${data.kd_jurusan}` : undefined,
      tag: "Jurusan",
    };
  }
  if (tbl.includes("kelas")) {
    return {
      title: data.nama_kelas || `ID: ${s.record_id}`,
      subtitle:
        data.jurusan?.nama_jurusan ||
        (data.id_jurusan ? `Jurusan #${data.id_jurusan}` : undefined),
      tag: "Kelas",
    };
  }
  if (tbl.includes("pelanggaran_siswa") || tbl.includes("pelanggaransiswa")) {
    return {
      title: data.nama_siswa || `NIS: ${data.nis || s.record_id}`,
      subtitle: data.nama_pelanggaran
        ? `${data.nama_pelanggaran} (${data.point || 0} Poin)`
        : undefined,
      tag: data.status_sanksi || "Pelanggaran",
    };
  }
  if (tbl.includes("kategori")) {
    return {
      title: data.nama || `ID: ${s.record_id}`,
      subtitle: undefined,
      tag: "Kategori",
    };
  }
  if (tbl.includes("pelanggaran")) {
    return {
      title: data.nama_pelanggaran || `ID: ${s.record_id}`,
      subtitle: data.tingkatan
        ? `Tingkat: ${data.tingkatan} (${data.bobot_point || 0} Poin)`
        : undefined,
      tag: data.tingkatan || "Pelanggaran",
    };
  }
  if (tbl.includes("tahun")) {
    return {
      title: data.nama || `ID: ${s.record_id}`,
      subtitle: undefined,
      tag: "Tahun Ajaran",
    };
  }

  // Fallback for unknown / general table
  const fallbackTitle =
    data.nama ||
    data.nama_siswa ||
    data.nama_jurusan ||
    data.nama_kelas ||
    data.nama_pelanggaran ||
    data.title ||
    Object.values(data)[0] ||
    `Record #${s.record_id}`;
  return {
    title: String(fallbackTitle),
    subtitle: undefined,
    tag: s.nama_tabel,
  };
};

const copyJson = async () => {
  if (!selectedSampah.value) return;
  try {
    const formatted = JSON.stringify(
      parseData(selectedSampah.value.delete_data),
      null,
      2,
    );
    await navigator.clipboard.writeText(formatted);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (e) {
    console.error("Failed to copy", e);
  }
};

const filteredSampah = computed(() => {
  return sampahs.value.filter((s) => {
    return (
      !searchQuery.value ||
      s.nama_tabel.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      s.delete_data.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });
});

const openDetailModal = (s: Sampah) => {
  selectedSampah.value = s;
  isDetailModalOpen.value = true;
};

const confirmRestore = (id: number) => {
  targetId.value = id;
  confirmActionType.value = "restore";
  isConfirmModalOpen.value = true;
};

const confirmDeletePermanent = (id: number) => {
  targetId.value = id;
  confirmActionType.value = "delete";
  isConfirmModalOpen.value = true;
};

const handleConfirm = async () => {
  if (targetId.value !== null) {
    if (confirmActionType.value === "restore") {
      await restoreSampah(targetId.value);
    } else {
      await deletePermanentSampah(targetId.value);
    }
    isConfirmModalOpen.value = false;
    targetId.value = null;
  }
};
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div>
        <div
          class="flex items-center gap-2 text-xs text-gray-400 font-medium mb-1"
        >
          <NuxtLink to="/" class="hover:text-gray-700">Dashboard</NuxtLink>
          <span>/</span>
          <span class="text-[#164E3D] font-semibold">Kotak Sampah</span>
        </div>
        <h1
          class="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight"
        >
          Kotak Sampah (Recycle Bin)
        </h1>
        <p class="text-sm text-gray-500 mt-0.5">
          Data yang telah dihapus dapat dipulihkan kembali atau dibersihkan
          secara permanen.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button
          type="button"
          @click="loadData"
          class="w-10 h-10 rounded-full bg-white border border-gray-200/90 text-gray-600 hover:text-gray-900 flex items-center justify-center hover:bg-gray-50 shadow-2xs transition-colors"
          title="Refresh Data"
        >
          <AppIcon name="refresh" size="16" />
        </button>

        <span
          class="px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200/60"
        >
          {{ filteredSampah.length }} Item Tersimpan
        </span>
      </div>
    </div>

    <!-- Filter Card -->
    <div
      class="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex items-center justify-between"
    >
      <div class="relative w-full md:w-80">
        <div
          class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400"
        >
          <AppIcon name="search" size="17" />
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari tabel atau isi data..."
          class="w-full pl-10 pr-4 py-2 rounded-full bg-[#F8F9FA] border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#164E3D]/20 focus:border-[#164E3D]"
        />
      </div>

      <span class="text-xs text-gray-400 font-medium">
        Penghapusan Aman (Soft Delete)
      </span>
    </div>

    <!-- Table -->
    <div
      class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr
              class="border-b border-gray-100 bg-[#F9FAFB]/70 text-[11px] font-semibold text-gray-400 uppercase tracking-wider"
            >
              <th class="py-3.5 px-6">ID</th>
              <th class="py-3.5 px-6">Tabel Sumber</th>
              <th class="py-3.5 px-4">Record ID</th>
              <th class="py-3.5 px-6">Pratinjau Data</th>
              <th class="py-3.5 px-4">Waktu Dihapus</th>
              <th class="py-3.5 px-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 text-sm">
            <tr
              v-for="s in filteredSampah"
              :key="s.id_sampah"
              class="hover:bg-gray-50/70 transition-colors group"
            >
              <td class="py-3.5 px-6 font-mono text-xs text-gray-400">
                #{{ s.id_sampah }}
              </td>
              <td class="py-3.5 px-6">
                <span
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800 font-mono"
                >
                  {{ s.nama_tabel }}
                </span>
              </td>
              <td class="py-3.5 px-4 font-mono font-semibold text-gray-700">
                #{{ s.record_id }}
              </td>
              <td class="py-3.5 px-6 max-w-sm">
                <div class="flex items-center gap-3">
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2">
                      <span
                        class="font-semibold text-gray-800 text-sm truncate"
                      >
                        {{ getSummary(s).title }}
                      </span>
                      <span
                        v-if="getSummary(s).tag"
                        class="px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-50 text-[#164E3D] border border-emerald-100 uppercase tracking-wider shrink-0"
                      >
                        {{ getSummary(s).tag }}
                      </span>
                      <button
                        type="button"
                        @click="openDetailModal(s)"
                        class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-gray-600 bg-gray-50 hover:bg-[#164E3D] hover:text-white border border-gray-200/80 transition-all shadow-2xs shrink-0"
                        title="Lihat Detail Snapshot"
                      >
                        <AppIcon name="eye" size="13" />
                        <span>Detail</span>
                      </button>
                    </div>
                    <p
                      v-if="getSummary(s).subtitle"
                      class="text-xs text-gray-400 truncate mt-0.5"
                    >
                      {{ getSummary(s).subtitle }}
                    </p>
                  </div>
                </div>
              </td>
              <td
                class="py-3.5 px-4 text-xs text-gray-400 font-mono whitespace-nowrap"
              >
                {{
                  s.delete_at
                    ? new Date(s.delete_at).toLocaleDateString("id-ID")
                    : "Hari ini"
                }}
              </td>
              <td class="py-3.5 px-6 text-right">
                <div class="inline-flex items-center gap-2">
                  <!-- Restore -->
                  <button
                    type="button"
                    @click="confirmRestore(s.id_sampah)"
                    class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition-colors"
                  >
                    <AppIcon name="restore" size="14" />
                    <span>Pulihkan</span>
                  </button>

                  <!-- Delete Permanent -->
                  <button
                    type="button"
                    @click="confirmDeletePermanent(s.id_sampah)"
                    class="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Hapus Permanen"
                  >
                    <AppIcon name="trash" size="16" />
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="filteredSampah.length === 0">
              <td colspan="6" class="py-12 text-center text-gray-400 text-sm">
                Kotak sampah kosong. Tidak ada data yang dihapus saat ini.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Detail Payload Modal -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isDetailModalOpen && selectedSampah"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
      >
        <div
          class="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]"
        >
          <!-- Modal Header -->
          <div
            class="flex items-center justify-between pb-4 border-b border-gray-100"
          >
            <div>
              <div class="flex items-center gap-2">
                <span
                  class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#164E3D]/10 text-[#164E3D] font-mono"
                >
                  {{ selectedSampah.nama_tabel }}
                </span>
                <span class="text-xs font-mono text-gray-400">
                  ID: #{{ selectedSampah.record_id }}
                </span>
              </div>
              <h3 class="text-lg font-bold text-gray-900 mt-1">
                Detail Data Terhapus
              </h3>
            </div>
            <button
              type="button"
              @click="isDetailModalOpen = false"
              class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors"
            >
              <AppIcon name="x" size="16" />
            </button>
          </div>

          <!-- Modal Body -->
          <div class="mt-2 overflow-y-auto flex-1 pr-1">
            <!-- Formatted Cards -->
            <div v-if="activeTab === 'formatted'" class="space-y-3">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div
                  v-for="(val, key) in parseData(selectedSampah.delete_data)"
                  :key="key"
                  class="p-3 rounded-2xl bg-[#F8F9FA] border border-gray-100/90 hover:border-gray-200 transition-colors"
                >
                  <p
                    class="text-[11px] font-mono font-medium text-gray-400 capitalize"
                  >
                    {{ String(key).replace(/_/g, " ") }}
                  </p>
                  <p
                    class="text-sm font-semibold text-gray-900 mt-1 break-words"
                  >
                    <template
                      v-if="val === null || val === undefined || val === ''"
                    >
                      <span class="text-gray-300 font-normal italic">-</span>
                    </template>
                    <template v-else-if="typeof val === 'object'">
                      <pre
                        class="text-xs font-mono bg-white p-2 rounded-lg border border-gray-100 mt-1"
                        >{{ JSON.stringify(val, null, 2) }}</pre
                      >
                    </template>
                    <template v-else>
                      {{ val }}
                    </template>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div
            class="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between"
          >
            <span class="text-xs text-gray-400">
              Snapshot disimpan otomatis saat soft-delete
            </span>
            <button
              type="button"
              @click="isDetailModalOpen = false"
              class="px-6 py-2 rounded-full bg-gray-900 text-white text-xs font-medium hover:bg-gray-800 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </transition>

    <ModalConfirm
      :is-open="isConfirmModalOpen"
      :title="
        confirmActionType === 'restore' ? 'Pulihkan Data' : 'Hapus Permanen'
      "
      :message="
        confirmActionType === 'restore'
          ? 'Apakah Anda yakin ingin memulihkan data ini kembali ke tabel asalnya?'
          : 'PERINGATAN: Tindakan ini akan menghapus data secara permanen dari basis data dan tidak dapat dibatalkan.'
      "
      :confirm-text="
        confirmActionType === 'restore' ? 'Ya, Pulihkan' : 'Hapus Permanen'
      "
      :is-danger="confirmActionType === 'delete'"
      @confirm="handleConfirm"
      @cancel="isConfirmModalOpen = false"
    />
  </div>
</template>
