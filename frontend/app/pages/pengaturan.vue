<script setup lang="ts">
const sekolah = ref({
  nama_sekolah: 'SMK Negeri 1 Jakarta',
  npsn: '20101234',
  alamat: 'Jl. Budi Utomo No. 7, Jakarta Pusat',
  kepala_sekolah: 'Dr. H. Ahmad Fauzi, M.Pd',
  nip_kepsek: '19750812 199903 1 002',
  ambang_sp1: 30,
  ambang_sp2: 60,
  ambang_sp3: 100,
  notifikasi_wa_ortu: true,
})

const savedSuccess = ref(false)

const handleSave = () => {
  savedSuccess.value = true
  setTimeout(() => {
    savedSuccess.value = false
  }, 3000)
}
</script>

<template>
  <div class="space-y-6 max-w-4xl">
    <!-- Header -->
    <div>
      <div class="flex items-center gap-2 text-xs text-gray-400 font-medium mb-1">
        <NuxtLink to="/" class="hover:text-gray-700">Dashboard</NuxtLink>
        <span>/</span>
        <span class="text-[#164E3D] font-semibold">Pengaturan</span>
      </div>
      <h1 class="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
        Pengaturan Sistem SIKAP
      </h1>
      <p class="text-sm text-gray-500 mt-0.5">
        Konfigurasi data identitas sekolah, ambang batas poin sanksi SP, dan preferensi notifikasi.
      </p>
    </div>

    <!-- Alert Success -->
    <div
      v-if="savedSuccess"
      class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2"
    >
      <AppIcon name="check" size="16" class="text-emerald-600" />
      <span>Pengaturan berhasil disimpan!</span>
    </div>

    <!-- Form Settings Card -->
    <div class="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6">
      <form @submit.prevent="handleSave" class="space-y-6">
        <!-- Section: Identitas Sekolah -->
        <div>
          <h3 class="text-base font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
            Identitas Sekolah
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1.5">Nama Sekolah</label>
              <input
                v-model="sekolah.nama_sekolah"
                type="text"
                class="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#164E3D]"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1.5">NPSN</label>
              <input
                v-model="sekolah.npsn"
                type="text"
                class="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#164E3D]"
              />
            </div>
            <div class="sm:col-span-2">
              <label class="block text-xs font-semibold text-gray-700 mb-1.5">Alamat Sekolah</label>
              <input
                v-model="sekolah.alamat"
                type="text"
                class="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#164E3D]"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1.5">Nama Kepala Sekolah</label>
              <input
                v-model="sekolah.kepala_sekolah"
                type="text"
                class="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#164E3D]"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1.5">NIP Kepala Sekolah</label>
              <input
                v-model="sekolah.nip_kepsek"
                type="text"
                class="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#164E3D]"
              />
            </div>
          </div>
        </div>

        <!-- Section: Ambang Batas Poin Sanksi -->
        <div>
          <h3 class="text-base font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
            Ambang Batas Poin Surat Peringatan (SP)
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1.5">Batas Poin SP 1</label>
              <input
                v-model.number="sekolah.ambang_sp1"
                type="number"
                class="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#164E3D]"
              />
              <span class="text-[11px] text-gray-400 mt-1 block">Peringatan tertulis I</span>
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1.5">Batas Poin SP 2</label>
              <input
                v-model.number="sekolah.ambang_sp2"
                type="number"
                class="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#164E3D]"
              />
              <span class="text-[11px] text-gray-400 mt-1 block">Pemanggilan Orang Tua</span>
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1.5">Batas Poin SP 3 (Skorsing)</label>
              <input
                v-model.number="sekolah.ambang_sp3"
                type="number"
                class="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#164E3D]"
              />
              <span class="text-[11px] text-gray-400 mt-1 block">Skorsing / Tindakan Khusus</span>
            </div>
          </div>
        </div>

        <div class="pt-4 flex justify-end">
          <button
            type="submit"
            class="px-8 py-3 rounded-full bg-[#164E3D] hover:bg-[#113D2F] text-white text-sm font-medium shadow-md transition-all active:scale-95"
          >
            Simpan Pengaturan
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

