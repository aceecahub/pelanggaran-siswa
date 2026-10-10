<script setup lang="ts">
import type { User } from '~/types'

const api = useApi()
const store = useDataStore()

const searchQuery = ref('')
const isEditModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const editingUser = ref<User | null>(null)
const targetDeleteId = ref<number | null>(null)

const form = ref<{
  username: string
  role: string
  password?: string
}>({
  username: '',
  role: 'petugas',
  password: '',
})

onMounted(async () => {
  await api.getUsers()
})

const filteredUsers = computed(() => {
  return store.users.value.filter((u) => {
    return (
      !searchQuery.value ||
      u.username.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })
})

const openEditModal = (u: User) => {
  editingUser.value = u
  form.value = {
    username: u.username,
    role: u.role,
    password: '',
  }
  isEditModalOpen.value = true
}

const confirmDelete = (id: number) => {
  targetDeleteId.value = id
  isDeleteModalOpen.value = true
}

const handleDelete = async () => {
  if (targetDeleteId.value !== null) {
    await api.deleteUser(targetDeleteId.value)
    isDeleteModalOpen.value = false
    targetDeleteId.value = null
  }
}

const handleSave = async () => {
  if (editingUser.value) {
    const payload: any = { role: form.value.role, username: form.value.username }
    if (form.value.password) payload.password = form.value.password
    await api.updateUser(editingUser.value.id_user, payload)
    isEditModalOpen.value = false
  }
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
          <span class="text-[#164E3D] font-semibold">Manajemen User</span>
        </div>
        <h1 class="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
          Manajemen Akun & Petugas
        </h1>
        <p class="text-sm text-gray-500 mt-0.5">
          Kelola hak akses dan akun guru BK, wali kelas, serta administrator sistem.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <span class="px-4 py-2 rounded-full bg-emerald-50 text-[#164E3D] text-xs font-semibold">
          Role-Based Access Control
        </span>
      </div>
    </div>

    <!-- Filter Card -->
    <div class="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
      <div class="relative w-full md:w-80">
        <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
          <AppIcon name="search" size="17" />
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari username atau role..."
          class="w-full pl-10 pr-4 py-2 rounded-full bg-[#F8F9FA] border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#164E3D]/20 focus:border-[#164E3D]"
        />
      </div>

      <span class="text-xs text-gray-400 font-medium">
        Total: {{ filteredUsers.length }} User
      </span>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-100 bg-[#F9FAFB]/70 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              <th class="py-3.5 px-6">ID</th>
              <th class="py-3.5 px-6">Username</th>
              <th class="py-3.5 px-6">Hak Akses / Role</th>
              <th class="py-3.5 px-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 text-sm">
            <tr
              v-for="u in filteredUsers"
              :key="u.id_user"
              class="hover:bg-gray-50/70 transition-colors group"
            >
              <td class="py-3.5 px-6 font-mono text-xs text-gray-400">
                #{{ u.id_user }}
              </td>
              <td class="py-3.5 px-6">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#164E3D] to-[#2B7A5F] text-white font-bold text-xs flex items-center justify-center">
                    {{ u.username.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <h4 class="font-bold text-gray-900 group-hover:text-[#164E3D] transition-colors">
                      {{ u.username }}
                    </h4>
                    <p class="text-xs text-gray-400">
                      Terdaftar: {{ u.created_at ? new Date(u.created_at).toLocaleDateString('id-ID') : 'Aktif' }}
                    </p>
                  </div>
                </div>
              </td>
              <td class="py-3.5 px-6">
                <span
                  class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                  :class="[
                    u.role === 'admin'
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : u.role === 'guru_bk'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200',
                  ]"
                >
                  <AppIcon name="settings" size="13" />
                  {{ u.role }}
                </span>
              </td>
              <td class="py-3.5 px-6 text-right">
                <div class="inline-flex items-center gap-1">
                  <button
                    type="button"
                    @click="openEditModal(u)"
                    class="p-1.5 rounded-lg text-gray-400 hover:text-[#164E3D] hover:bg-emerald-50 transition-colors"
                  >
                    <AppIcon name="edit" size="16" />
                  </button>
                  <button
                    type="button"
                    @click="confirmDelete(u.id_user)"
                    class="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <AppIcon name="trash" size="16" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Edit User Modal -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isEditModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
      >
        <div class="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-gray-100">
          <div class="flex items-center justify-between pb-4 border-b border-gray-100">
            <h3 class="text-lg font-bold text-gray-900">
              Edit Pengguna: {{ editingUser?.username }}
            </h3>
            <button
              type="button"
              @click="isEditModalOpen = false"
              class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center"
            >
              <AppIcon name="x" size="16" />
            </button>
          </div>

          <form @submit.prevent="handleSave" class="mt-6 space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1.5">Username *</label>
              <input
                v-model="form.username"
                type="text"
                required
                class="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#164E3D]"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1.5">Role / Peran *</label>
              <select
                v-model="form.role"
                class="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#164E3D]"
              >
                <option value="admin">Administrator (admin)</option>
                <option value="guru_bk">Guru BK (guru_bk)</option>
                <option value="wali_kelas">Wali Kelas (wali_kelas)</option>
                <option value="petugas">Petugas Piket (petugas)</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1.5">Reset Password Baru (Opsional)</label>
              <input
                v-model="form.password"
                type="password"
                placeholder="Kosongkan jika tidak ingin merubah"
                class="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#164E3D]"
              />
            </div>

            <div class="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
              <button
                type="button"
                @click="isEditModalOpen = false"
                class="px-5 py-2.5 rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                class="px-6 py-2.5 rounded-full bg-[#164E3D] hover:bg-[#113D2F] text-white text-sm font-medium shadow-sm"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <ModalConfirm
      :is-open="isDeleteModalOpen"
      title="Hapus Akun Pengguna"
      message="Apakah Anda yakin ingin menonaktifkan atau menghapus akun pengguna ini?"
      @confirm="handleDelete"
      @cancel="isDeleteModalOpen = false"
    />
  </div>
</template>

