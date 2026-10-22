import type { User } from '~/types'

export const useUser = () => {
  const { request, apiBase } = useApiBase()

  const users = useState<User[]>('db_users', () => [])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const currentUser = useState<{
    id_user: number
    username: string
    role: string
    token: string
  }>('current_user', () => {
    if (import.meta.client) {
      try {
        const saved = localStorage.getItem('sikap_auth_user')
        if (saved) return JSON.parse(saved)
      } catch (e) {}
    }
    return {
      id_user: 1,
      username: 'Admin',
      role: 'admin',
      token: '',
    }
  })

  const getUsers = async (): Promise<User[]> => {
    loading.value = true
    error.value = null
    try {
      const res = await request<User[]>('/api/user')
      if (res.data && Array.isArray(res.data)) {
        users.value = res.data
        return res.data
      }
      return users.value
    } catch (e: any) {
      error.value = e?.message || 'Gagal memuat data pengguna'
      return users.value
    } finally {
      loading.value = false
    }
  }

  const updateUser = async (
    id: number,
    payload: Partial<User>
  ): Promise<User> => {
    loading.value = true
    error.value = null
    try {
      const res = await request<User>(`/api/user/${id}`, {
        method: 'PATCH',
        body: payload,
      })
      const idx = users.value.findIndex((u) => u.id_user === id)
      if (idx !== -1) {
        users.value[idx] = { ...users.value[idx], ...payload }
      }
      return res.data || users.value[idx]
    } catch (e: any) {
      error.value = e?.message || 'Gagal memperbarui pengguna'
      throw e
    } finally {
      loading.value = false
    }
  }

  const deleteUser = async (id: number): Promise<boolean> => {
    loading.value = true
    error.value = null
    const sampahs = useState<any[]>('db_sampahs', () => [])
    try {
      await request(`/api/user/${id}`, { method: 'DELETE' })
      const target = users.value.find((u) => u.id_user === id)
      if (target) {
        sampahs.value.unshift({
          id_sampah: Date.now(),
          id_user: currentUser.value.id_user,
          nama_tabel: 'users',
          record_id: id,
          delete_data: JSON.stringify(target),
          aksi: 'soft_delete',
          delete_at: new Date().toISOString(),
          user: { id_user: currentUser.value.id_user, username: currentUser.value.username },
        })
        users.value = users.value.filter((u) => u.id_user !== id)
      }
      return true
    } catch (e: any) {
      error.value = e?.message || 'Gagal menghapus pengguna'
      throw e
    } finally {
      loading.value = false
    }
  }

  const login = async (username: string, password: string) => {
    loading.value = true
    error.value = null
    try {
      const res = await $fetch<any>(`${apiBase}/api/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { username, password },
      })

      const userData = res.data || res
      const session = {
        id_user: userData.id_user || userData.id || 1,
        username: userData.username || username,
        role: userData.role || 'admin',
        token: userData.token || '',
      }

      currentUser.value = session
      if (import.meta.client) {
        localStorage.setItem('sikap_auth_user', JSON.stringify(session))
      }
      return session
    } catch (e: any) {
      error.value = e?.data?.message || e?.message || 'Username atau password salah'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    currentUser.value = {
      id_user: 0,
      username: '',
      role: '',
      token: '',
    }
    if (import.meta.client) {
      localStorage.removeItem('sikap_auth_user')
    }
  }

  return {
    users,
    currentUser,
    loading,
    error,
    getUsers,
    updateUser,
    deleteUser,
    login,
    logout,
  }
}

