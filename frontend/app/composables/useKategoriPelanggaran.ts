import type { KategoriPelanggaran, Sampah } from '~/types'

export const useKategoriPelanggaran = () => {
  const { request } = useApiBase()
  const { addLog } = useActivityLog()

  const kategoris = useState<KategoriPelanggaran[]>('db_kategoris', () => [])
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

  const getKategori = async (): Promise<KategoriPelanggaran[]> => {
    loading.value = true
    error.value = null
    try {
      const res = await request<KategoriPelanggaran[]>('/api/kategori-pelanggaran')
      if (res.data && Array.isArray(res.data)) {
        kategoris.value = res.data
        return res.data
      }
      return kategoris.value
    } catch (e: any) {
      error.value = e?.message || 'Gagal memuat kategori pelanggaran'
      return kategoris.value
    } finally {
      loading.value = false
    }
  }

  const createKategori = async (payload: {
    nama: string
  }): Promise<KategoriPelanggaran> => {
    loading.value = true
    error.value = null
    try {
      const res = await request<KategoriPelanggaran>('/api/kategori-pelanggaran', {
        method: 'POST',
        body: payload,
      })
      const created: KategoriPelanggaran = res.data || {
        id_kategori_pelanggaran: Date.now(),
        ...payload,
      }
      kategoris.value.push(created)
      addLog('CREATE', 'kategori_pelanggaran', created.id_kategori_pelanggaran, `Menambahkan kategori: ${created.nama}`)
      return created
    } catch (e: any) {
      error.value = e?.message || 'Gagal menambahkan kategori pelanggaran'
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateKategori = async (
    id: number,
    payload: Partial<KategoriPelanggaran>
  ): Promise<KategoriPelanggaran> => {
    loading.value = true
    error.value = null
    try {
      const res = await request<KategoriPelanggaran>(`/api/kategori-pelanggaran/${id}`, {
        method: 'PATCH',
        body: payload,
      })
      const idx = kategoris.value.findIndex((k) => k.id_kategori_pelanggaran === id)
      if (idx !== -1) {
        kategoris.value[idx] = { ...kategoris.value[idx], ...payload }
      }
      addLog('UPDATE', 'kategori_pelanggaran', id, `Memperbarui kategori: ${payload.nama || id}`)
      return res.data || kategoris.value[idx]
    } catch (e: any) {
      error.value = e?.message || 'Gagal memperbarui kategori pelanggaran'
      throw e
    } finally {
      loading.value = false
    }
  }

  const deleteKategori = async (id: number): Promise<boolean> => {
    loading.value = true
    error.value = null
    const user = getCurrentUser()
    try {
      await request(`/api/kategori-pelanggaran/${id}`, { method: 'DELETE' })
      const target = kategoris.value.find((k) => k.id_kategori_pelanggaran === id)
      if (target) {
        sampahs.value.unshift({
          id_sampah: Date.now(),
          id_user: user.id_user,
          nama_tabel: 'kategori_pelanggarans',
          record_id: id,
          delete_data: JSON.stringify(target),
          aksi: 'soft_delete',
          delete_at: new Date().toISOString(),
          user: { id_user: user.id_user, username: user.username },
        })
        kategoris.value = kategoris.value.filter((k) => k.id_kategori_pelanggaran !== id)
        addLog('DELETE', 'kategori_pelanggaran', id, `Menghapus kategori: ${target.nama}`)
      }
      return true
    } catch (e: any) {
      error.value = e?.message || 'Gagal menghapus kategori pelanggaran'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    kategoris,
    loading,
    error,
    getKategori,
    createKategori,
    updateKategori,
    deleteKategori,
  }
}
