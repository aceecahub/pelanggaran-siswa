import type { ActivityLog } from '~/types'

export const useActivityLog = () => {
  const { request } = useApiBase()
  const logs = useState<ActivityLog[]>('db_logs', () => [])
  const loading = ref(false)

  const getCurrentUser = () => {
    if (import.meta.client) {
      try {
        const saved = localStorage.getItem('sikap_auth_user')
        if (saved) return JSON.parse(saved)
      } catch (e) {}
    }
    return { id_user: 1, username: 'Admin' }
  }

  const getActivityLog = async (): Promise<ActivityLog[]> => {
    loading.value = true
    try {
      const res = await request<ActivityLog[]>('/api/activity-log')
      if (res.data && Array.isArray(res.data)) {
        logs.value = res.data
        return res.data
      }
      return logs.value
    } finally {
      loading.value = false
    }
  }

  const addLog = (aksi: string, nama_tabel: string, record_id: number, deskripsi: string) => {
    const user = getCurrentUser()
    logs.value.unshift({
      id_activity_log: Date.now(),
      id_user: user.id_user,
      aksi,
      nama_tabel,
      record_id,
      deskripsi,
      created_at: new Date().toISOString(),
      user: {
        id_user: user.id_user,
        username: user.username,
      },
    })
  }

  return {
    logs,
    loading,
    getActivityLog,
    addLog,
  }
}

