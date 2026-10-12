import type {
  Sampah,
  Siswa,
  Jurusan,
  Kelas,
  TahunAjaran,
  KategoriPelanggaran,
  Pelanggaran,
  PelanggaranSiswa,
  RiwayatKelas,
  User,
} from '~/types'

export const useSampah = () => {
  const { request } = useApiBase()
  const { addLog } = useActivityLog()

  const sampahs = useState<Sampah[]>('db_sampahs', () => [])
  const siswas = useState<Siswa[]>('db_siswas', () => [])
  const jurusans = useState<Jurusan[]>('db_jurusans', () => [])
  const kelases = useState<Kelas[]>('db_kelases', () => [])
  const tapels = useState<TahunAjaran[]>('db_tapels', () => [])
  const kategoris = useState<KategoriPelanggaran[]>('db_kategoris', () => [])
  const pelanggarans = useState<Pelanggaran[]>('db_pelanggarans', () => [])
  const pelanggaranSiswas = useState<PelanggaranSiswa[]>('db_pelanggaranSiswas', () => [])
  const riwayatKelases = useState<RiwayatKelas[]>('db_riwayatKelases', () => [])
  const users = useState<User[]>('db_users', () => [])

  const loading = ref(false)
  const error = ref<string | null>(null)

  const getSampah = async (): Promise<Sampah[]> => {
    loading.value = true
    error.value = null
    try {
      const res = await request<Sampah[]>('/api/sampah')
      if (res.data && Array.isArray(res.data)) {
        sampahs.value = res.data
        return res.data
      }
      return sampahs.value
    } catch (e: any) {
      error.value = e?.message || 'Gagal memuat data sampah'
      return sampahs.value
    } finally {
      loading.value = false
    }
  }

  const restoreSampah = async (id: number): Promise<boolean> => {
    loading.value = true
    error.value = null
    try {
      await request(`/api/sampah/${id}`, { method: 'PATCH' })
      const target = sampahs.value.find((s) => s.id_sampah === id)
      if (target) {
        try {
          const parsed = JSON.parse(target.delete_data)
          if (target.nama_tabel === 'siswas' && !siswas.value.some((s) => s.nis === parsed.nis)) {
            siswas.value.unshift(parsed)
          } else if (target.nama_tabel === 'jurusans' && !jurusans.value.some((j) => j.id_jurusan === parsed.id_jurusan)) {
            jurusans.value.push(parsed)
          } else if (target.nama_tabel === 'kelas' && !kelases.value.some((k) => k.id_kelas === parsed.id_kelas)) {
            kelases.value.push(parsed)
          } else if (target.nama_tabel === 'tahun_ajarans' && !tapels.value.some((t) => t.id_tahun_ajaran === parsed.id_tahun_ajaran)) {
            tapels.value.push(parsed)
          } else if (target.nama_tabel === 'kategori_pelanggarans' && !kategoris.value.some((k) => k.id_kategori_pelanggaran === parsed.id_kategori_pelanggaran)) {
            kategoris.value.push(parsed)
          } else if (target.nama_tabel === 'pelanggarans' && !pelanggarans.value.some((p) => p.id_pelanggaran === parsed.id_pelanggaran)) {
            pelanggarans.value.push(parsed)
          } else if (target.nama_tabel === 'pelanggaran_siswas' && !pelanggaranSiswas.value.some((p) => p.id_pelanggaran_siswa === parsed.id_pelanggaran_siswa)) {
            pelanggaranSiswas.value.unshift(parsed)
          } else if (target.nama_tabel === 'riwayat_kelas' && !riwayatKelases.value.some((r) => r.id_riwayat_kelas === parsed.id_riwayat_kelas)) {
            riwayatKelases.value.unshift(parsed)
          } else if (target.nama_tabel === 'users' && !users.value.some((u) => u.id_user === parsed.id_user)) {
            users.value.push(parsed)
          }
        } catch (parseErr) {
          console.warn('Failed to parse deleted data JSON on restore:', parseErr)
        }

        sampahs.value = sampahs.value.filter((s) => s.id_sampah !== id)
        addLog(
          'RESTORE',
          target.nama_tabel,
          target.record_id,
          `Memulihkan data dari sampah: ${target.nama_tabel}`
        )
      }
      return true
    } catch (e: any) {
      error.value = e?.message || 'Gagal memulihkan data sampah'
      throw e
    } finally {
      loading.value = false
    }
  }

  const deletePermanentSampah = async (id: number): Promise<boolean> => {
    loading.value = true
    error.value = null
    try {
      await request(`/api/sampah/${id}`, { method: 'DELETE' })
      sampahs.value = sampahs.value.filter((s) => s.id_sampah !== id)
      addLog('DELETE_PERMANENT', 'sampah', id, `Menghapus permanen data sampah ID: ${id}`)
      return true
    } catch (e: any) {
      error.value = e?.message || 'Gagal menghapus data sampah permanen'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    sampahs,
    loading,
    error,
    getSampah,
    restoreSampah,
    deletePermanentSampah,
  }
}
