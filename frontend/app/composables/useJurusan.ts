import type { Jurusan, Sampah } from '~/types'

export const useJurusan = () => {
  const { request } = useApiBase()
  const { addLog } = useActivityLog()

  const jurusans = useState<Jurusan[]>('db_jurusans', () => [])
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

  const getJurusan = async (): Promise<Jurusan[]> => {
    loading.value = true
    error.value = null
    try {
      const res = await request<Jurusan[]>('/api/jurusan')
      if (res.data && Array.isArray(res.data)) {
        jurusans.value = res.data
        return res.data
      }
      return jurusans.value
    } catch (e: any) {
      error.value = e?.message || 'Gagal memuat data jurusan'
      return jurusans.value
    } finally {
      loading.value = false
    }
  }

  const getJurusanById = async (id_jurusan: number): Promise<Jurusan | null> => {
    loading.value = true
    error.value = null
    try {
      const res = await request<Jurusan>(`/api/jurusan/${id_jurusan}`)
      if (res.data) return res.data
      return jurusans.value.find((j) => j.id_jurusan === id_jurusan) || null
    } catch (e: any) {
      error.value = e?.message || 'Gagal mengambil detail jurusan'
      return jurusans.value.find((j) => j.id_jurusan === id_jurusan) || null
    } finally {
      loading.value = false
    }
  }

  const createJurusan = async (payload: {
    kd_jurusan: string
    nama_jurusan: string
    status?: string
  }): Promise<Jurusan> => {
    loading.value = true
    error.value = null
    try {
      const res = await request<Jurusan>('/api/jurusan', {
        method: 'POST',
        body: payload,
      })

      const created: Jurusan = res.data || {
        id_jurusan: Date.now(),
        kd_jurusan: payload.kd_jurusan,
        nama_jurusan: payload.nama_jurusan,
        status: payload.status || 'Aktif',
      }

      jurusans.value.push(created)
      addLog(
        'CREATE',
        'jurusans',
        created.id_jurusan,
        `Menambahkan jurusan [${payload.kd_jurusan}]: ${payload.nama_jurusan}`
      )
      return created
    } catch (e: any) {
      error.value = e?.message || 'Gagal menambahkan jurusan'
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateJurusan = async (
    id_jurusan: number,
    payload: Partial<Jurusan>
  ): Promise<Jurusan> => {
    loading.value = true
    error.value = null
    try {
      const res = await request<Jurusan>(`/api/jurusan/${id_jurusan}`, {
        method: 'PATCH',
        body: payload,
      })

      const idx = jurusans.value.findIndex((j) => j.id_jurusan === id_jurusan)
      if (idx !== -1) {
        jurusans.value[idx] = { ...jurusans.value[idx], ...payload }
      }

      addLog(
        'UPDATE',
        'jurusans',
        id_jurusan,
        `Memperbarui jurusan: ${payload.nama_jurusan || payload.kd_jurusan || id_jurusan}`
      )
      return res.data || jurusans.value[idx]
    } catch (e: any) {
      error.value = e?.message || 'Gagal memperbarui jurusan'
      throw e
    } finally {
      loading.value = false
    }
  }

  const deleteJurusan = async (id_jurusan: number): Promise<boolean> => {
    loading.value = true
    error.value = null
    const user = getCurrentUser()
    try {
      await request(`/api/jurusan/${id_jurusan}`, { method: 'DELETE' })
      const target = jurusans.value.find((j) => j.id_jurusan === id_jurusan)
      if (target) {
        sampahs.value.unshift({
          id_sampah: Date.now(),
          id_user: user.id_user,
          nama_tabel: 'jurusans',
          record_id: id_jurusan,
          delete_data: JSON.stringify(target),
          aksi: 'soft_delete',
          delete_at: new Date().toISOString(),
          user: { id_user: user.id_user, username: user.username },
        })
        jurusans.value = jurusans.value.filter((j) => j.id_jurusan !== id_jurusan)
        addLog(
          'DELETE',
          'jurusans',
          id_jurusan,
          `Menghapus jurusan [${target.kd_jurusan}]: ${target.nama_jurusan}`
        )
      }
      return true
    } catch (e: any) {
      error.value = e?.message || 'Gagal menghapus jurusan'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    jurusans,
    loading,
    error,
    getJurusan,
    getJurusanById,
    createJurusan,
    updateJurusan,
    deleteJurusan,
  }
}
