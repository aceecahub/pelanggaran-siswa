<script setup lang="ts">
const store = useDataStore()
const emit = defineEmits<{
  (e: 'toggleSidebar'): void
}>()

const searchQuery = ref('')
const unreadNotifications = ref(3)

const handleSearch = () => {
  if (!searchQuery.value) return
  // Navigate or search
  const q = searchQuery.value.toLowerCase()
  if (q.includes('siswa')) {
    navigateTo('/master/siswa')
  } else if (q.includes('pelanggaran')) {
    navigateTo('/pelanggaran-siswa')
  } else if (q.includes('kelas')) {
    navigateTo('/master/kelas')
  }
}
</script>

<template>
  <header class="sticky top-0 z-20 h-20 bg-white/95 backdrop-blur-md border-b border-gray-100 px-6 lg:px-8 flex items-center justify-between select-none">
    <!-- Left: Mobile Hamburger & Search Bar -->
    <div class="flex items-center gap-4 flex-1 max-w-xl">
      <!-- Mobile sidebar button -->
      <button
        type="button"
        @click="emit('toggleSidebar')"
        class="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
      >
        <AppIcon name="menu" size="22" />
      </button>

      <!-- Search bar (Donezo style with ⌘F) -->
      <div class="relative w-full max-w-md">
        <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
          <AppIcon name="search" size="18" />
        </div>
        <input
          v-model="searchQuery"
          @keydown.enter="handleSearch"
          type="text"
          placeholder="Search siswa, kelas, pelanggaran..."
          class="w-full pl-10 pr-12 py-2.5 rounded-full bg-[#F8F9FA] border border-gray-200/70 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#164E3D]/20 focus:border-[#164E3D] transition-all"
        />
        <div class="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
          <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-500 border border-gray-200">
            ⌘F
          </span>
        </div>
      </div>
    </div>

    <!-- Right: Message, Notification, Profile Avatar (Matches screenshot) -->
    <div class="flex items-center gap-3">
      <!-- Message / Email Icon Button -->
      <NuxtLink
        to="/activity-log"
        class="relative w-10 h-10 rounded-full border border-gray-200/80 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
        title="Pesan & Log"
      >
        <AppIcon name="mail" size="18" />
      </NuxtLink>

      <!-- Notification Bell Icon Button -->
      <div class="relative">
        <button
          type="button"
          class="relative w-10 h-10 rounded-full border border-gray-200/80 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
          title="Notifikasi"
        >
          <AppIcon name="bell" size="18" />
          <span
            v-if="unreadNotifications > 0"
            class="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-white"
          />
        </button>
      </div>

      <!-- User Profile (Totok Michael style) -->
      <div class="flex items-center gap-3 pl-3 border-l border-gray-100">
        <!-- Avatar with picture/illustration -->
        <div class="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-emerald-600/20 bg-[#F1E5D1] flex items-center justify-center shadow-inner">
          <!-- Stylized avatar SVG -->
          <svg class="w-8 h-8 text-amber-800" viewBox="0 0 36 36" fill="currentColor">
            <path d="M18 4a7 7 0 0 0-7 7v2a7 7 0 0 0 14 0v-2a7 7 0 0 0-7-7z" fill="#D4A373" />
            <path d="M18 20c-6.627 0-12 4.03-12 9v3h24v-3c0-4.97-5.373-9-12-9z" fill="#164E3D" />
            <!-- Hair -->
            <path d="M12 9c0-3 2.5-6 6-6s6 3 6 6c-2 0-3-2-6-2s-4 2-6 2z" fill="#4A3525" />
          </svg>
        </div>

        <div class="hidden sm:block text-left">
          <h4 class="text-sm font-semibold text-gray-900 leading-tight">
            {{ store.currentUser.value?.username || 'Admin' }}
          </h4>
          <p class="text-xs text-gray-400 font-normal leading-tight capitalize">
            {{ store.currentUser.value?.role || 'Administrator' }}
          </p>
        </div>
      </div>
    </div>
  </header>
</template>

