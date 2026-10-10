<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const store = useDataStore()

// State for master dropdown: default open if current route is under /master
const isMasterOpen = ref(route.path.startsWith('/master'))

// Watch route to keep master open if navigating into master
watch(
  () => route.path,
  (newPath) => {
    if (newPath.startsWith('/master')) {
      isMasterOpen.value = true
    }
  }
)

const toggleMaster = () => {
  isMasterOpen.value = !isMasterOpen.value
}

const masterSubmenus = [
  { label: 'Tahun Ajaran', to: '/master/tapel', icon: 'tapel' },
  { label: 'Data Jurusan', to: '/master/jurusan', icon: 'jurusan' },
  { label: 'Data Kelas', to: '/master/kelas', icon: 'kelas' },
  { label: 'Data Siswa', to: '/master/siswa', icon: 'siswa' },
  { label: 'Kategori Pelanggaran', to: '/master/kategori-pelanggaran', icon: 'kategori' },
  { label: 'Jenis Pelanggaran', to: '/master/pelanggaran', icon: 'pelanggaran' },
]

const pendingViolationsCount = computed(() => {
  return store.pelanggaranSiswas.value.filter((p) => p.status_sanksi === 'Pending').length
})

const handleLogout = () => {
  if (confirm('Apakah Anda yakin ingin keluar dari sistem?')) {
    router.push('/login')
  }
}
</script>

<template>
  <aside class="w-64 h-full bg-white border-r border-gray-100 flex flex-col justify-between p-5 select-none overflow-y-auto">
    <div class="space-y-6">
      <!-- Logo Branding (Donezo / SIKAP style) -->
      <NuxtLink to="/" class="flex items-center gap-3 px-2 py-1 group">
        <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#164E3D] to-[#2B7A5F] flex items-center justify-center text-white shadow-md shadow-[#164E3D]/20 transition-transform group-hover:scale-105">
          <!-- Circular swirled emblem like Donezo -->
          <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-dasharray="32 16" />
            <circle cx="12" cy="12" r="4.5" fill="currentColor" opacity="0.9" />
          </svg>
        </div>
        <div>
          <div class="text-xl font-bold tracking-tight text-gray-900 flex items-center gap-1.5">
            Donezo <span class="text-xs px-1.5 py-0.5 rounded-full bg-[#164E3D]/10 text-[#164E3D] font-medium">SIKAP</span>
          </div>
          <p class="text-[11px] text-gray-400 font-normal">Disiplin & Konseling</p>
        </div>
      </NuxtLink>

      <!-- Section: MENU -->
      <div>
        <p class="px-3 mb-2.5 text-[11px] font-semibold text-gray-400 tracking-wider uppercase">
          Menu
        </p>
        <nav class="space-y-1">
          <!-- Dashboard Item -->
          <NuxtLink
            to="/"
            class="relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group"
            :class="route.path === '/' ? 'text-[#164E3D] font-semibold bg-[#164E3D]/5' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'"
          >
            <!-- Vertical pill marker on left edge when active (matches screenshot) -->
            <span
              v-if="route.path === '/'"
              class="absolute left-0 top-2 bottom-2 w-1.5 bg-[#164E3D] rounded-r-full"
            />
            <AppIcon
              name="dashboard"
              :class="route.path === '/' ? 'text-[#164E3D]' : 'text-gray-400 group-hover:text-gray-600'"
              size="19"
            />
            <span>Dashboard</span>
          </NuxtLink>

          <!-- Master Data Dropdown (The main requested feature!) -->
          <div>
            <button
              type="button"
              @click="toggleMaster"
              class="w-full relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group"
              :class="route.path.startsWith('/master') ? 'text-[#164E3D] font-semibold bg-[#164E3D]/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
            >
              <span
                v-if="route.path.startsWith('/master')"
                class="absolute left-0 top-2 bottom-2 w-1.5 bg-[#164E3D] rounded-r-full"
              />
              <div class="flex items-center gap-3">
                <AppIcon
                  name="master"
                  :class="route.path.startsWith('/master') ? 'text-[#164E3D]' : 'text-gray-400 group-hover:text-gray-600'"
                  size="19"
                />
                <span>Master Data</span>
              </div>
              <AppIcon
                :name="isMasterOpen ? 'chevron-up' : 'chevron-down'"
                size="16"
                class="text-gray-400 transition-transform duration-200"
              />
            </button>

            <!-- Dropdown Submenus -->
            <transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="opacity-0 -translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 -translate-y-1"
            >
              <div v-show="isMasterOpen" class="pl-7 pr-1 mt-1 space-y-1 border-l-2 border-gray-100 ml-5 my-1">
                <NuxtLink
                  v-for="sub in masterSubmenus"
                  :key="sub.to"
                  :to="sub.to"
                  class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-colors"
                  :class="route.path === sub.to ? 'text-[#164E3D] font-semibold bg-[#164E3D]/10' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'"
                >
                  <AppIcon :name="sub.icon" size="15" :class="route.path === sub.to ? 'text-[#164E3D]' : 'text-gray-400'" />
                  <span>{{ sub.label }}</span>
                </NuxtLink>
              </div>
            </transition>
          </div>

          <!-- Pelanggaran Siswa (Transaksi) with badge like 'Tasks 12+' in screenshot -->
          <NuxtLink
            to="/pelanggaran-siswa"
            class="relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group"
            :class="route.path === '/pelanggaran-siswa' ? 'text-[#164E3D] font-semibold bg-[#164E3D]/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
          >
            <span
              v-if="route.path === '/pelanggaran-siswa'"
              class="absolute left-0 top-2 bottom-2 w-1.5 bg-[#164E3D] rounded-r-full"
            />
            <div class="flex items-center gap-3">
              <AppIcon
                name="pelanggaran-siswa"
                :class="route.path === '/pelanggaran-siswa' ? 'text-[#164E3D]' : 'text-gray-400 group-hover:text-gray-600'"
                size="19"
              />
              <span>Pelanggaran Siswa</span>
            </div>
            <!-- Donezo style badge e.g. '12+' -->
            <span
              v-if="pendingViolationsCount > 0"
              class="px-2 py-0.5 text-[11px] font-semibold rounded-md bg-[#164E3D] text-white tracking-wide"
            >
              {{ pendingViolationsCount }}+
            </span>
          </NuxtLink>

          <!-- Riwayat Kelas -->
          <NuxtLink
            to="/riwayat-kelas"
            class="relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group"
            :class="route.path === '/riwayat-kelas' ? 'text-[#164E3D] font-semibold bg-[#164E3D]/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
          >
            <span
              v-if="route.path === '/riwayat-kelas'"
              class="absolute left-0 top-2 bottom-2 w-1.5 bg-[#164E3D] rounded-r-full"
            />
            <AppIcon
              name="riwayat-kelas"
              :class="route.path === '/riwayat-kelas' ? 'text-[#164E3D]' : 'text-gray-400 group-hover:text-gray-600'"
              size="19"
            />
            <span>Riwayat Kelas</span>
          </NuxtLink>

          <!-- Log Aktivitas -->
          <NuxtLink
            to="/activity-log"
            class="relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group"
            :class="route.path === '/activity-log' ? 'text-[#164E3D] font-semibold bg-[#164E3D]/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
          >
            <span
              v-if="route.path === '/activity-log'"
              class="absolute left-0 top-2 bottom-2 w-1.5 bg-[#164E3D] rounded-r-full"
            />
            <AppIcon
              name="activity-log"
              :class="route.path === '/activity-log' ? 'text-[#164E3D]' : 'text-gray-400 group-hover:text-gray-600'"
              size="19"
            />
            <span>Log Aktivitas</span>
          </NuxtLink>

          <!-- Kotak Sampah -->
          <NuxtLink
            to="/sampah"
            class="relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group"
            :class="route.path === '/sampah' ? 'text-[#164E3D] font-semibold bg-[#164E3D]/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
          >
            <span
              v-if="route.path === '/sampah'"
              class="absolute left-0 top-2 bottom-2 w-1.5 bg-[#164E3D] rounded-r-full"
            />
            <AppIcon
              name="sampah"
              :class="route.path === '/sampah' ? 'text-[#164E3D]' : 'text-gray-400 group-hover:text-gray-600'"
              size="19"
            />
            <span>Kotak Sampah</span>
          </NuxtLink>
        </nav>
      </div>

      <!-- Section: GENERAL -->
      <div>
        <p class="px-3 mb-2.5 text-[11px] font-semibold text-gray-400 tracking-wider uppercase">
          General
        </p>
        <nav class="space-y-1">
          <!-- Manajemen User -->
          <NuxtLink
            to="/users"
            class="relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group"
            :class="route.path === '/users' ? 'text-[#164E3D] font-semibold bg-[#164E3D]/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
          >
            <span
              v-if="route.path === '/users'"
              class="absolute left-0 top-2 bottom-2 w-1.5 bg-[#164E3D] rounded-r-full"
            />
            <AppIcon
              name="users"
              :class="route.path === '/users' ? 'text-[#164E3D]' : 'text-gray-400 group-hover:text-gray-600'"
              size="19"
            />
            <span>Manajemen User</span>
          </NuxtLink>

          <!-- Settings -->
          <NuxtLink
            to="/pengaturan"
            class="relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group"
            :class="route.path === '/pengaturan' ? 'text-[#164E3D] font-semibold bg-[#164E3D]/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
          >
            <span
              v-if="route.path === '/pengaturan'"
              class="absolute left-0 top-2 bottom-2 w-1.5 bg-[#164E3D] rounded-r-full"
            />
            <AppIcon
              name="settings"
              :class="route.path === '/pengaturan' ? 'text-[#164E3D]' : 'text-gray-400 group-hover:text-gray-600'"
              size="19"
            />
            <span>Pengaturan</span>
          </NuxtLink>

          <!-- Logout Button -->
          <button
            type="button"
            @click="handleLogout"
            class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors group"
          >
            <AppIcon name="logout" class="text-gray-400 group-hover:text-red-500" size="19" />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </div>

    <!-- Bottom Promo Banner Widget (Matches screenshot exactly: "Download our Mobile App") -->
    <div class="mt-6 relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#113D2F] to-[#0A261D] p-4 text-white shadow-lg shadow-[#113D2F]/20">
      <!-- Background subtle curves/waves -->
      <div class="absolute -right-6 -bottom-6 w-28 h-28 rounded-full border border-emerald-500/20 pointer-events-none" />
      <div class="absolute -right-2 -bottom-2 w-20 h-20 rounded-full border border-emerald-400/20 pointer-events-none" />
      
      <div class="relative z-10 space-y-2">
        <div class="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="5" y="2" width="14" height="20" rx="3" />
            <line x1="12" y1="18" x2="12" y2="18.01" />
          </svg>
        </div>
        <h4 class="text-sm font-semibold tracking-tight leading-snug">
          Download our<br />Mobile App
        </h4>
        <p class="text-[11px] text-emerald-100/70 leading-tight">
          Get easy in another way
        </p>
        <button
          type="button"
          class="w-full mt-2 py-2 px-3 rounded-full bg-[#1A5C47] hover:bg-[#206F55] text-white text-xs font-medium transition-colors shadow-sm"
        >
          Download
        </button>
      </div>
    </div>
  </aside>
</template>

