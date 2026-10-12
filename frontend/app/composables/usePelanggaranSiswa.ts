import type { PelanggaranSiswa, Sampah } from '~/types'

export const usePelanggaranSiswa = () => {
  const { request } = useApiBase()
  const { addLog } = useActivityLog()

  const pelanggaranSiswas = useState<PelanggaranSiswa[]>('db_pelanggaranSiswas', () => [])
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

  const getPelanggaranSiswa = async (): Promise<PelanggaranSiswa[]> => {
    loading.value = true
    error.value = null
    try {
      const res = await request<PelanggaranSiswa[]>('/api/pelanggaran-siswa')
      if (res.data && Array.isArray(res.data)) {
        pelanggaranSiswas.value = res.data
        return res.data
      }
      return pelanggaranSiswas.value
    } catch (e: any) {
      error.value = e?.message || 'Gagal memuat catatan pelanggaran siswa'
      return pelanggaranSiswas.value
    } finally {
      loading.value = false
    }
  }

  const createPelanggaranSiswa = async (
    payload: Omit<PelanggaranSiswa, 'id_pelanggaran_siswa'>
  ): Promise<PelanggaranSiswa> => {
    loading.value = true
    error.value = null
    try {
      const res = await request<PelanggaranSiswa>('/api/pelanggaran-siswa', {
        method: 'POST',
        body: payload,
      })
      const created: PelanggaranSiswa = res.data || {
        id_pelanggaran_siswa: Date.now(),
        ...payload,
      }
      pelanggaranSiswas.value.unshift(created)
      addLog(
        'CREATE',
        'pelanggaran_siswas',
        created.id_pelanggaran_siswa,
        `Catat pelanggaran ${payload.nama_siswa}: ${payload.nama_pelanggaran}`
      )
      return created
    } catch (e: any) {
      error.value = e?.message || 'Gagal mencatat pelanggaran siswa'
      throw e
    } finally {
      loading.value = false
    }
  }

  const updatePelanggaranSiswa = async (
    id: number,
    payload: Partial<PelanggaranSiswa>
  ): Promise<PelanggaranSiswa> => {
    loading.value = true
    error.value = null
    try {
      const res = await request<PelanggaranSiswa>(`/api/pelanggaran-siswa/${id}`, {
        method: 'PATCH',
        body: payload,
      })
      const idx = pelanggaranSiswas.value.findIndex(
        (p) => p.id_pelanggaran_siswa === id
      )
      if (idx !== -1) {
        pelanggaranSiswas.value[idx] = {
          ...pelanggaranSiswas.value[idx],
          ...payload,
        }
      }
      addLog('UPDATE', 'pelanggaran_siswas', id, `Update status pelanggaran siswa ID: ${id}`)
      return res.data || pelanggaranSiswas.value[idx]
    } catch (e: any) {
      error.value = e?.message || 'Gagal memperbarui catatan pelanggaran'
      throw e
    } finally {
      loading.value = false
    }
  }

  const deletePelanggaranSiswa = async (id: number): Promise<boolean> => {
    loading.value = true
    error.value = null
    const user = getCurrentUser()
    try {
      await request(`/api/pelanggaran-siswa/${id}`, { method: 'DELETE' })
      const target = pelanggaranSiswas.value.find(
        (p) => p.id_pelanggaran_siswa === id
      )
      if (target) {
        sampahs.value.unshift({
          id_sampah: Date.now(),
          id_user: user.id_user,
          nama_tabel: 'pelanggaran_siswas',
          record_id: id,
          delete_data: JSON.stringify(target),
          aksi: 'soft_delete',
          delete_at: new Date().toISOString(),
          user: { id_user: user.id_user, username: user.username },
        })
        pelanggaranSiswas.value = pelanggaranSiswas.value.filter(
          (p) => p.id_pelanggaran_siswa !== id
        )
        addLog(
          'DELETE',
          'pelanggaran_siswas',
          id,
          `Menghapus catatan pelanggaran ${target.nama_siswa}`
        )
      }
      return true
    } catch (e: any) {
      error.value = e?.message || 'Gagal menghapus catatan pelanggaran'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    pelanggaranSiswas,
    loading,
    error,
    getPelanggaranSiswa,
    createPelanggaranSiswa,
    updatePelanggaranSiswa,
    deletePelanggaranSiswa,
  }
}
