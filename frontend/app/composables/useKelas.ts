import type { Kelas, Sampah } from '~/types'

export const useKelas = () => {
  const { request } = useApiBase()
  const { addLog } = useActivityLog()

  const kelases = useState<Kelas[]>('db_kelases', () => [])
  const sampahs = useState<Sampah[]>('db_sampahs', () => [])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getCurrentUser = () => {
    if (import.meta.client) {
      try {
        const saved = localStorage.getItem('sikap_auth_user')
        if (saved) return JSON.parse(saved)
      } catch (e) {}
    }
    return { id_user: 1, username: 'Admin' }
  }

  const getKelas = async (): Promise<Kelas[]> => {
    loading.value = true
    error.value = null
    try {
      const res = await request<Kelas[]>('/api/kelas')
      if (res.data && Array.isArray(res.data)) {
        kelases.value = res.data
        return res.data
      }
      return kelases.value
    } catch (e: any) {
      error.value = e?.message || 'Gagal memuat data kelas'
      return kelases.value
    } finally {
      loading.value = false
    }
  }

  const createKelas = async (payload: {
    id_jurusan: number
    nama_kelas: string
  }): Promise<Kelas> => {
    loading.value = true
    error.value = null
    try {
      const res = await request<Kelas>('/api/kelas', {
        method: 'POST',
        body: payload,
      })
      const created: Kelas = res.data || { id_kelas: Date.now(), ...payload }
      kelases.value.push(created)
      addLog('CREATE', 'kelas', created.id_kelas, `Menambahkan kelas: ${created.nama_kelas}`)
      return created
    } catch (e: any) {
      error.value = e?.message || 'Gagal menambahkan kelas'
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateKelas = async (
    id_kelas: number,
    payload: Partial<Kelas>
  ): Promise<Kelas> => {
    loading.value = true
    error.value = null
    try {
      const res = await request<Kelas>(`/api/kelas/${id_kelas}`, {
        method: 'PATCH',
        body: payload,
      })
      const idx = kelases.value.findIndex((k) => k.id_kelas === id_kelas)
      if (idx !== -1) {
        kelases.value[idx] = { ...kelases.value[idx], ...payload }
      }
      addLog('UPDATE', 'kelas', id_kelas, `Memperbarui kelas: ${payload.nama_kelas || id_kelas}`)
      return res.data || kelases.value[idx]
    } catch (e: any) {
      error.value = e?.message || 'Gagal memperbarui kelas'
      throw e
    } finally {
      loading.value = false
    }
  }

  const deleteKelas = async (id_kelas: number): Promise<boolean> => {
    loading.value = true
    error.value = null
    const user = getCurrentUser()
    try {
      await request(`/api/kelas/${id_kelas}`, { method: 'DELETE' })
      const target = kelases.value.find((k) => k.id_kelas === id_kelas)
      if (target) {
        sampahs.value.unshift({
          id_sampah: Date.now(),
          id_user: user.id_user,
          nama_tabel: 'kelas',
          record_id: id_kelas,
          delete_data: JSON.stringify(target),
          aksi: 'soft_delete',
          delete_at: new Date().toISOString(),
          user: { id_user: user.id_user, username: user.username },
        })
        kelases.value = kelases.value.filter((k) => k.id_kelas !== id_kelas)
        addLog('DELETE', 'kelas', id_kelas, `Menghapus kelas: ${target.nama_kelas}`)
      }
      return true
    } catch (e: any) {
      error.value = e?.message || 'Gagal menghapus kelas'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    kelases,
    loading,
    error,
    getKelas,
    createKelas,
    updateKelas,
    deleteKelas,
  }
}
