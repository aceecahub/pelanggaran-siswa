import type { TahunAjaran, Sampah } from '~/types'

export const useTapel = () => {
  const { request } = useApiBase()
  const { addLog } = useActivityLog()

  const tapels = useState<TahunAjaran[]>('db_tapels', () => [])
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

  const getTapel = async (): Promise<TahunAjaran[]> => {
    loading.value = true
    error.value = null
    try {
      const res = await request<TahunAjaran[]>('/api/tapel')
      if (res.data && Array.isArray(res.data)) {
        tapels.value = res.data
        return res.data
      }
      return tapels.value
    } catch (e: any) {
      error.value = e?.message || 'Gagal memuat tahun ajaran'
      return tapels.value
    } finally {
      loading.value = false
    }
  }

  const createTapel = async (payload: {
    nama: string
    status?: string
  }): Promise<TahunAjaran> => {
    loading.value = true
    error.value = null
    try {
      const res = await request<TahunAjaran>('/api/tapel', {
        method: 'POST',
        body: payload,
      })
      const created: TahunAjaran = res.data || {
        id_tahun_ajaran: Date.now(),
        ...payload,
        status: payload.status || 'Aktif',
      }
      tapels.value.push(created)
      addLog('CREATE', 'tahun_ajaran', created.id_tahun_ajaran, `Menambahkan tahun ajaran: ${created.nama}`)
      return created
    } catch (e: any) {
      error.value = e?.message || 'Gagal menambahkan tahun ajaran'
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateTapel = async (
    id_tahun_ajaran: number,
    payload: Partial<TahunAjaran>
  ): Promise<TahunAjaran> => {
    loading.value = true
    error.value = null
    try {
      const res = await request<TahunAjaran>(`/api/tapel/${id_tahun_ajaran}`, {
        method: 'PATCH',
        body: payload,
      })
      const idx = tapels.value.findIndex((t) => t.id_tahun_ajaran === id_tahun_ajaran)
      if (idx !== -1) {
        tapels.value[idx] = { ...tapels.value[idx], ...payload }
      }
      addLog('UPDATE', 'tahun_ajaran', id_tahun_ajaran, `Memperbarui tahun ajaran: ${payload.nama || id_tahun_ajaran}`)
      return res.data || tapels.value[idx]
    } catch (e: any) {
      error.value = e?.message || 'Gagal memperbarui tahun ajaran'
      throw e
    } finally {
      loading.value = false
    }
  }

  const deleteTapel = async (id_tahun_ajaran: number): Promise<boolean> => {
    loading.value = true
    error.value = null
    const user = getCurrentUser()
    try {
      await request(`/api/tapel/${id_tahun_ajaran}`, { method: 'DELETE' })
      const target = tapels.value.find((t) => t.id_tahun_ajaran === id_tahun_ajaran)
      if (target) {
        sampahs.value.unshift({
          id_sampah: Date.now(),
          id_user: user.id_user,
          nama_tabel: 'tahun_ajarans',
          record_id: id_tahun_ajaran,
          delete_data: JSON.stringify(target),
          aksi: 'soft_delete',
          delete_at: new Date().toISOString(),
          user: { id_user: user.id_user, username: user.username },
        })
        tapels.value = tapels.value.filter((t) => t.id_tahun_ajaran !== id_tahun_ajaran)
        addLog('DELETE', 'tahun_ajaran', id_tahun_ajaran, `Menghapus tahun ajaran: ${target.nama}`)
      }
      return true
    } catch (e: any) {
      error.value = e?.message || 'Gagal menghapus tahun ajaran'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    tapels,
    loading,
    error,
    getTapel,
    createTapel,
    updateTapel,
    deleteTapel,
  }
}
