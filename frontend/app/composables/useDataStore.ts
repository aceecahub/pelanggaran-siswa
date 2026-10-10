import type {
  Siswa,
  Kelas,
  Jurusan,
  TahunAjaran,
  KategoriPelanggaran,
  Pelanggaran,
  PelanggaranSiswa,
  RiwayatKelas,
  Sampah,
  ActivityLog,
  User,
} from '~/types'

export const useDataStore = () => {
  const jurusans = useState<Jurusan[]>('db_jurusans', () => [])
  const kelases = useState<Kelas[]>('db_kelases', () => [])
  const tapels = useState<TahunAjaran[]>('db_tapels', () => [])
  const kategoris = useState<KategoriPelanggaran[]>('db_kategoris', () => [])
  const pelanggarans = useState<Pelanggaran[]>('db_pelanggarans', () => [])
  const siswas = useState<Siswa[]>('db_siswas', () => [])
  const pelanggaranSiswas = useState<PelanggaranSiswa[]>('db_pelanggaranSiswas', () => [])
  const riwayatKelases = useState<RiwayatKelas[]>('db_riwayatKelases', () => [])
  const logs = useState<ActivityLog[]>('db_logs', () => [])
  const sampahs = useState<Sampah[]>('db_sampahs', () => [])
  const users = useState<User[]>('db_users', () => [])

  const currentUser = useState<{ id_user: number; username: string; role: string; token: string }>('current_user', () => {
    if (import.meta.client) {
      try {
        const saved = localStorage.getItem('sikap_auth_user')
        if (saved) return JSON.parse(saved)
      } catch (e) {}
    }
    return {
      id_user: 1,
      username: 'Admin',
      role: 'admin',
      token: '',
    }
  })

  return {
    jurusans,
    kelases,
    tapels,
    kategoris,
    pelanggarans,
    siswas,
    pelanggaranSiswas,
    riwayatKelases,
    logs,
    sampahs,
    users,
    currentUser,
  }
}
