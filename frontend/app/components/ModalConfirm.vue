<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    isOpen: boolean
    title?: string
    message?: string
    confirmText?: string
    cancelText?: string
    isDanger?: boolean
  }>(),
  {
    title: 'Konfirmasi Tindakan',
    message: 'Apakah Anda yakin ingin melanjutkan tindakan ini?',
    confirmText: 'Ya, Lanjutkan',
    cancelText: 'Batal',
    isDanger: true,
  }
)

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()
</script>

<template>
  <transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs select-none"
    >
      <div
        class="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 transform transition-all"
      >
        <div class="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center mb-4" :class="isDanger ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-[#164E3D]'">
          <AppIcon :name="isDanger ? 'trash' : 'check'" size="22" />
        </div>

        <h3 class="text-lg font-bold text-gray-900 text-center mb-2">
          {{ title }}
        </h3>
        <p class="text-sm text-gray-500 text-center mb-6 leading-relaxed">
          {{ message }}
        </p>

        <div class="flex items-center gap-3">
          <button
            type="button"
            @click="emit('cancel')"
            class="flex-1 py-2.5 px-4 rounded-full border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {{ cancelText }}
          </button>
          <button
            type="button"
            @click="emit('confirm')"
            class="flex-1 py-2.5 px-4 rounded-full text-sm font-medium text-white shadow-sm transition-colors"
            :class="isDanger ? 'bg-red-600 hover:bg-red-700 shadow-red-600/20' : 'bg-[#164E3D] hover:bg-[#113D2F]'"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

