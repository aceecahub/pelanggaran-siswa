import type { Siswa, Sampah } from '~/types'

export const useSiswa = () => {
  const { request } = useApiBase()
  const { addLog } = useActivityLog()

  const siswas = useState<Siswa[]>('db_siswas', () => [])
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

  const getSiswa = async (): Promise<Siswa[]> => {
    loading.value = true
    error.value = null
    try {
      const res = await request<Siswa[]>('/api/siswa')
      if (res.data && Array.isArray(res.data)) {
        siswas.value = res.data
        return res.data
      }
      return siswas.value
    } catch (e: any) {
      error.value = e?.message || 'Gagal memuat data siswa'
      return siswas.value
    } finally {
      loading.value = false
    }
  }

  const getSiswaByNis = async (nis: number): Promise<Siswa | null> => {
    loading.value = true
    error.value = null
    try {
      const res = await request<Siswa>(`/api/siswa/${nis}`)
      if (res.data) return res.data
      return siswas.value.find((s) => s.nis === nis) || null
    } catch (e: any) {
      error.value = e?.message || 'Gagal mengambil detail siswa'
      return siswas.value.find((s) => s.nis === nis) || null
    } finally {
      loading.value = false
    }
  }

  const createSiswa = async (
    payload: Omit<Siswa, 'created_at' | 'updated_at'>
  ): Promise<Siswa> => {
    loading.value = true
    error.value = null
    try {
      const res = await request<Siswa>('/api/siswa', {
        method: 'POST',
        body: {
          ...payload,
          nis: String(payload.nis),
        },
      })
      const created: Siswa = res.data || {
        ...payload,
        created_at: new Date().toISOString(),
      }
      siswas.value.unshift(created)
      addLog('CREATE', 'siswas', payload.nis, `Menambahkan siswa baru: ${payload.nama_siswa}`)
      return created
    } catch (e: any) {
      error.value = e?.message || 'Gagal menambahkan siswa'
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateSiswa = async (
    nis: number,
    payload: Partial<Siswa>
  ): Promise<Siswa> => {
    loading.value = true
    error.value = null
    try {
      const res = await request<Siswa>(`/api/siswa/${nis}`, {
        method: 'PATCH',
        body: payload,
      })
      const idx = siswas.value.findIndex((s) => s.nis === nis)
      if (idx !== -1) {
        siswas.value[idx] = { ...siswas.value[idx], ...payload }
      }
      addLog('UPDATE', 'siswas', nis, `Memperbarui data siswa: ${payload.nama_siswa || nis}`)
      return res.data || siswas.value[idx]
    } catch (e: any) {
      error.value = e?.message || 'Gagal memperbarui data siswa'
      throw e
    } finally {
      loading.value = false
    }
  }

  const deleteSiswa = async (nis: number): Promise<boolean> => {
    loading.value = true
    error.value = null
    const user = getCurrentUser()
    try {
      await request(`/api/siswa/${nis}`, { method: 'DELETE' })
      const target = siswas.value.find((s) => s.nis === nis)
      if (target) {
        sampahs.value.unshift({
          id_sampah: Date.now(),
          id_user: user.id_user,
          nama_tabel: 'siswas',
          record_id: nis,
          delete_data: JSON.stringify(target),
          aksi: 'soft_delete',
          delete_at: new Date().toISOString(),
          user: { id_user: user.id_user, username: user.username },
        })
        siswas.value = siswas.value.filter((s) => s.nis !== nis)
        addLog('DELETE', 'siswas', nis, `Menghapus siswa: ${target.nama_siswa}`)
      }
      return true
    } catch (e: any) {
      error.value = e?.message || 'Gagal menghapus data siswa'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    siswas,
    loading,
    error,
    getSiswa,
    getSiswaByNis,
    createSiswa,
    updateSiswa,
    deleteSiswa,
  }
}

