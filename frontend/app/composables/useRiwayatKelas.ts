import type { RiwayatKelas, Sampah } from '~/types'

export const useRiwayatKelas = () => {
  const { request } = useApiBase()
  const { addLog } = useActivityLog()

  const riwayatKelases = useState<RiwayatKelas[]>('db_riwayatKelases', () => [])
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

  const getRiwayatKelas = async (): Promise<RiwayatKelas[]> => {
    loading.value = true
    error.value = null
    try {
      const res = await request<RiwayatKelas[]>('/api/riwayat-kelas')
      if (res.data && Array.isArray(res.data)) {
        riwayatKelases.value = res.data
        return res.data
      }
      return riwayatKelases.value
    } catch (e: any) {
      error.value = e?.message || 'Gagal memuat riwayat penempatan kelas'
      return riwayatKelases.value
    } finally {
      loading.value = false
    }
  }

  const createRiwayatKelas = async (payload: {
    id_tahun_ajaran: number
    id_kelas: number
    nis: number
  }): Promise<RiwayatKelas> => {
    loading.value = true
    error.value = null
    try {
      const res = await request<RiwayatKelas>('/api/riwayat-kelas', {
        method: 'POST',
        body: payload,
      })
      const created: RiwayatKelas = res.data || {
        id_riwayat_kelas: Date.now(),
        ...payload,
      }
      riwayatKelases.value.unshift(created)
      addLog(
        'CREATE',
        'riwayat_kelas',
        created.id_riwayat_kelas,
        `Penempatan kelas siswa NIS: ${payload.nis}`
      )
      return created
    } catch (e: any) {
      error.value = e?.message || 'Gagal menempatkan siswa ke kelas'
      throw e
    } finally {
      loading.value = false
    }
  }

  const deleteRiwayatKelas = async (id: number): Promise<boolean> => {
    loading.value = true
    error.value = null
    const user = getCurrentUser()
    try {
      await request(`/api/riwayat-kelas/${id}`, { method: 'DELETE' })
      const target = riwayatKelases.value.find((r) => r.id_riwayat_kelas === id)
      if (target) {
        sampahs.value.unshift({
          id_sampah: Date.now(),
          id_user: user.id_user,
          nama_tabel: 'riwayat_kelas',
          record_id: id,
          delete_data: JSON.stringify(target),
          aksi: 'soft_delete',
          delete_at: new Date().toISOString(),
          user: { id_user: user.id_user, username: user.username },
        })
        riwayatKelases.value = riwayatKelases.value.filter(
          (r) => r.id_riwayat_kelas !== id
        )
        addLog('DELETE', 'riwayat_kelas', id, `Menghapus riwayat kelas ID: ${id}`)
      }
      return true
    } catch (e: any) {
      error.value = e?.message || 'Gagal menghapus riwayat kelas'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    riwayatKelases,
    loading,
    error,
    getRiwayatKelas,
    createRiwayatKelas,
    deleteRiwayatKelas,
  }
}
