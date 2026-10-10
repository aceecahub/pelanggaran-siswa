<script setup lang="ts">
const isMobileSidebarOpen = ref(false)

const toggleSidebar = () => {
  isMobileSidebarOpen.value = !isMobileSidebarOpen.value
}

const closeMobileSidebar = () => {
  isMobileSidebarOpen.value = false
}
</script>

<template>
  <div class="min-h-screen w-full bg-[#F8F9FA] text-gray-900 flex antialiased font-sans">
    <!-- Desktop Sidebar: Docks edge-to-edge full height on the left -->
    <div class="hidden lg:block w-64 shrink-0 h-screen sticky top-0 z-30">
      <Sidebar />
    </div>

    <!-- Mobile Sidebar Drawer -->
    <transition
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isMobileSidebarOpen"
        class="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs lg:hidden"
        @click="closeMobileSidebar"
      >
        <div
          class="w-72 h-full bg-white shadow-2xl overflow-y-auto"
          @click.stop
        >
          <Sidebar />
        </div>
      </div>
    </transition>

    <!-- Main Content Area: Edge-to-Edge Full Screen -->
    <div class="flex-1 flex flex-col min-w-0 min-h-screen bg-[#F8F9FA]">
      <!-- Sticky Header -->
      <Header class="sticky top-0 z-20" @toggle-sidebar="toggleSidebar" />

      <!-- Page View Body: Full width responsive container -->
      <main class="flex-1 p-5 md:p-8 lg:p-10 w-full">
        <slot />
      </main>
    </div>
  </div>
</template>
