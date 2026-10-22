import type { Pelanggaran, Sampah } from '~/types'

export const usePelanggaran = () => {
  const { request } = useApiBase()
  const { addLog } = useActivityLog()

  const pelanggarans = useState<Pelanggaran[]>('db_pelanggarans', () => [])
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

  const getPelanggaran = async (): Promise<Pelanggaran[]> => {
    loading.value = true
    error.value = null
    try {
      const res = await request<Pelanggaran[]>('/api/pelanggaran')
      if (res.data && Array.isArray(res.data)) {
        pelanggarans.value = res.data
        return res.data
      }
      return pelanggarans.value
    } catch (e: any) {
      error.value = e?.message || 'Gagal memuat data pelanggaran'
      return pelanggarans.value
    } finally {
      loading.value = false
    }
  }

  const createPelanggaran = async (payload: {
    id_kategori_pelanggaran: number
    nama_pelanggaran: string
    tingkatan: string
    bobot_point: number
  }): Promise<Pelanggaran> => {
    loading.value = true
    error.value = null
    try {
      const res = await request<Pelanggaran>('/api/pelanggaran', {
        method: 'POST',
        body: payload,
      })
      const created: Pelanggaran = res.data || {
        id_pelanggaran: Date.now(),
        ...payload,
      }
      pelanggarans.value.push(created)
      addLog('CREATE', 'pelanggarans', created.id_pelanggaran, `Menambahkan pelanggaran: ${created.nama_pelanggaran}`)
      return created
    } catch (e: any) {
      error.value = e?.message || 'Gagal menambahkan pelanggaran'
      throw e
    } finally {
      loading.value = false
    }
  }

  const updatePelanggaran = async (
    id: number,
    payload: Partial<Pelanggaran>
  ): Promise<Pelanggaran> => {
    loading.value = true
    error.value = null
    try {
      const res = await request<Pelanggaran>(`/api/pelanggaran/${id}`, {
        method: 'PATCH',
        body: payload,
      })
      const idx = pelanggarans.value.findIndex((p) => p.id_pelanggaran === id)
      if (idx !== -1) {
        pelanggarans.value[idx] = { ...pelanggarans.value[idx], ...payload }
      }
      addLog('UPDATE', 'pelanggarans', id, `Memperbarui pelanggaran: ${payload.nama_pelanggaran || id}`)
      return res.data || pelanggarans.value[idx]
    } catch (e: any) {
      error.value = e?.message || 'Gagal memperbarui data pelanggaran'
      throw e
    } finally {
      loading.value = false
    }
  }

  const deletePelanggaran = async (id: number): Promise<boolean> => {
    loading.value = true
    error.value = null
    const user = getCurrentUser()
    try {
      await request(`/api/pelanggaran/${id}`, { method: 'DELETE' })
      const target = pelanggarans.value.find((p) => p.id_pelanggaran === id)
      if (target) {
        sampahs.value.unshift({
          id_sampah: Date.now(),
          id_user: user.id_user,
          nama_tabel: 'pelanggarans',
          record_id: id,
          delete_data: JSON.stringify(target),
          aksi: 'soft_delete',
          delete_at: new Date().toISOString(),
          user: { id_user: user.id_user, username: user.username },
        })
        pelanggarans.value = pelanggarans.value.filter((p) => p.id_pelanggaran !== id)
        addLog('DELETE', 'pelanggarans', id, `Menghapus pelanggaran: ${target.nama_pelanggaran}`)
      }
      return true
    } catch (e: any) {
      error.value = e?.message || 'Gagal menghapus data pelanggaran'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    pelanggarans,
    loading,
    error,
    getPelanggaran,
    createPelanggaran,
    updatePelanggaran,
    deletePelanggaran,
  }
}
