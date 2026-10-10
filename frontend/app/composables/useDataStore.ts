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

// Initial Seed Data for Instant Preview & Offline Resilience
const initialJurusan: Jurusan[] = [
  { id_jurusan: 1, nama_jurusan: 'Rekayasa Perangkat Lunak', status: 'Aktif' },
  { id_jurusan: 2, nama_jurusan: 'Teknik Komputer & Jaringan', status: 'Aktif' },
  { id_jurusan: 3, nama_jurusan: 'Desain Komunikasi Visual', status: 'Aktif' },
  { id_jurusan: 4, nama_jurusan: 'Akuntansi & Keuangan', status: 'Aktif' },
]

const initialKelas: Kelas[] = [
  { id_kelas: 1, id_jurusan: 1, nama_kelas: 'X RPL 1' },
  { id_kelas: 2, id_jurusan: 1, nama_kelas: 'XI RPL 2' },
  { id_kelas: 3, id_jurusan: 2, nama_kelas: 'X TKJ 1' },
  { id_kelas: 4, id_jurusan: 2, nama_kelas: 'XII TKJ 1' },
  { id_kelas: 5, id_jurusan: 3, nama_kelas: 'X DKV 1' },
]

const initialTapel: TahunAjaran[] = [
  { id_tahun_ajaran: 1, nama: '2024/2025 - Ganjil', status: 'Aktif' },
  { id_tahun_ajaran: 2, nama: '2023/2024 - Genap', status: 'Tidak Aktif' },
  { id_tahun_ajaran: 3, nama: '2023/2024 - Ganjil', status: 'Tidak Aktif' },
]

const initialKategori: KategoriPelanggaran[] = [
  { id_kategori_pelanggaran: 1, nama: 'Kedisiplinan & Kehadiran' },
  { id_kategori_pelanggaran: 2, nama: 'Kerapihan & Seragam' },
  { id_kategori_pelanggaran: 3, nama: 'Ketertiban Lingkungan' },
  { id_kategori_pelanggaran: 4, nama: 'Pelanggaran Berat & Asusila' },
]

const initialPelanggaran: Pelanggaran[] = [
  { id_pelanggaran: 1, id_kategori_pelanggaran: 1, nama_pelanggaran: 'Terlambat Masuk Sekolah (>15 Menit)', tingkatan: 'Ringan', bobot_point: 5 },
  { id_pelanggaran: 2, id_kategori_pelanggaran: 1, nama_pelanggaran: 'Membolos Jam Pelajaran', tingkatan: 'Sedang', bobot_point: 15 },
  { id_pelanggaran: 3, id_kategori_pelanggaran: 2, nama_pelanggaran: 'Tidak Memakai Atribut / Dasi / Ikat Pinggang', tingkatan: 'Ringan', bobot_point: 5 },
  { id_pelanggaran: 4, id_kategori_pelanggaran: 2, nama_pelanggaran: 'Rambut Tidak Sesuai Ketentuan (Putra)', tingkatan: 'Ringan', bobot_point: 10 },
  { id_pelanggaran: 5, id_kategori_pelanggaran: 3, nama_pelanggaran: 'Membawa / Merokok di Lingkungan Sekolah', tingkatan: 'Berat', bobot_point: 50 },
  { id_pelanggaran: 6, id_kategori_pelanggaran: 4, nama_pelanggaran: 'Berkelahi / Terlibat Tawuran', tingkatan: 'Berat', bobot_point: 100 },
]

const initialSiswa: Siswa[] = [
  {
    nis: 20240101,
    nama_siswa: 'Muhammad Farhan',
    tgl_lahir: '2008-04-12',
    tempat_lahir: 'Jakarta',
    jk: 'L',
    no_hp: '081234567890',
    agama: 'Islam',
    no_hp_ortu: '081298765432',
    nama_ayah: 'Ahmad Subagyo',
    pekerjaan_ayah: 'Wiraswasta',
    nama_ibu: 'Siti Aminah',
    pekerjaan_ibu: 'Ibu Rumah Tangga',
    alamat_ortu: 'Jl. Melati Raya No. 14, Jakarta Selatan',
    alamat: 'Jl. Melati Raya No. 14, Jakarta Selatan',
    status_aktif: 'Aktif',
  },
  {
    nis: 20240102,
    nama_siswa: 'Alexandra Deff',
    tgl_lahir: '2008-08-20',
    tempat_lahir: 'Bandung',
    jk: 'P',
    no_hp: '08567891234',
    agama: 'Kristen',
    no_hp_ortu: '08567891299',
    nama_ayah: 'David Deff',
    pekerjaan_ayah: 'Karyawan Swasta',
    nama_ibu: 'Sarah Deff',
    pekerjaan_ibu: 'Guru',
    alamat_ortu: 'Jl. Kenanga Indah No. 5, Jakarta Selatan',
    alamat: 'Jl. Kenanga Indah No. 5, Jakarta Selatan',
    status_aktif: 'Aktif',
  },
  {
    nis: 20240103,
    nama_siswa: 'Edwin Adenike',
    tgl_lahir: '2007-11-15',
    tempat_lahir: 'Surabaya',
    jk: 'L',
    no_hp: '081399887766',
    agama: 'Islam',
    no_hp_ortu: '081399887700',
    nama_ayah: 'Bambang Adenike',
    pekerjaan_ayah: 'PNS',
    nama_ibu: 'Rahmawati',
    pekerjaan_ibu: 'PNS',
    alamat_ortu: 'Komplek Permata Hijau B3/12',
    alamat: 'Komplek Permata Hijau B3/12',
    status_aktif: 'Aktif',
  },
  {
    nis: 20240104,
    nama_siswa: 'Isaac Oluwatemilorun',
    tgl_lahir: '2008-02-05',
    tempat_lahir: 'Medan',
    jk: 'L',
    no_hp: '087811223344',
    agama: 'Katolik',
    no_hp_ortu: '087811223300',
    nama_ayah: 'Michael Peter',
    pekerjaan_ayah: 'Arsitek',
    nama_ibu: 'Theresia Maria',
    pekerjaan_ibu: 'Dokter',
    alamat_ortu: 'Jl. Flamboyan No. 22',
    alamat: 'Jl. Flamboyan No. 22',
    status_aktif: 'Aktif',
  },
  {
    nis: 20240105,
    nama_siswa: 'David Oshodi',
    tgl_lahir: '2008-09-18',
    tempat_lahir: 'Semarang',
    jk: 'L',
    no_hp: '08990011223',
    agama: 'Islam',
    no_hp_ortu: '08990011220',
    nama_ayah: 'Joko Widodo S.',
    pekerjaan_ayah: 'Pedagang',
    nama_ibu: 'Sri Wahyuni',
    pekerjaan_ibu: 'Wiraswasta',
    alamat_ortu: 'Jl. Anggrek No. 8',
    alamat: 'Jl. Anggrek No. 8',
    status_aktif: 'Aktif',
  },
]

const getDaysAgo = (days: number) => {
  const d = new Date()
  d.setDate(d.getDate() - days)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

const initialPelanggaranSiswa: PelanggaranSiswa[] = [
  {
    id_pelanggaran_siswa: 1,
    tgl: getDaysAgo(0),
    id_tahun_ajaran: 1,
    id_user: 1,
    nama_pelapor: 'Drs. Hendro Wibowo (Guru Piket)',
    nis: 20240101,
    nama_siswa: 'Muhammad Farhan',
    id_kelas: 1,
    nama_kelas: 'X RPL 1',
    id_kategori_pelanggaran: 1,
    id_pelanggaran: 1,
    nama_pelanggaran: 'Terlambat Masuk Sekolah (>15 Menit)',
    point: 5,
    catatan: 'Terlambat 25 menit karena macet jalanan',
    sanksi: 'Teguran lisan & menyiram tanaman sekolah',
    status_sanksi: 'Selesai',
  },
  {
    id_pelanggaran_siswa: 2,
    tgl: getDaysAgo(1),
    id_tahun_ajaran: 1,
    id_user: 1,
    nama_pelapor: 'Ibu Ratna, M.Pd (Guru BK)',
    nis: 20240103,
    nama_siswa: 'Edwin Adenike',
    id_kelas: 2,
    nama_kelas: 'XI RPL 2',
    id_kategori_pelanggaran: 1,
    id_pelanggaran: 2,
    nama_pelanggaran: 'Membolos Jam Pelajaran',
    point: 15,
    catatan: 'Berada di kantin saat jam pelajaran Fisika',
    sanksi: 'Tugas resume materi di perpustakaan',
    status_sanksi: 'Dalam Proses',
  },
  {
    id_pelanggaran_siswa: 3,
    tgl: getDaysAgo(2),
    id_tahun_ajaran: 1,
    id_user: 1,
    nama_pelapor: 'Pak Bambang (Satpam)',
    nis: 20240105,
    nama_siswa: 'David Oshodi',
    id_kelas: 3,
    nama_kelas: 'X TKJ 1',
    id_kategori_pelanggaran: 3,
    id_pelanggaran: 5,
    nama_pelanggaran: 'Membawa / Merokok di Lingkungan Sekolah',
    point: 50,
    catatan: 'Ditemukan korek dan rokok di belakang toilet siswa',
    sanksi: 'Pemanggilan orang tua & Surat Peringatan (SP 1)',
    status_sanksi: 'Pending',
  },
  {
    id_pelanggaran_siswa: 4,
    tgl: getDaysAgo(3),
    id_tahun_ajaran: 1,
    id_user: 1,
    nama_pelapor: 'Ibu Ratna, M.Pd (Guru BK)',
    nis: 20240102,
    nama_siswa: 'Alexandra Deff',
    id_kelas: 1,
    nama_kelas: 'X RPL 1',
    id_kategori_pelanggaran: 2,
    id_pelanggaran: 3,
    nama_pelanggaran: 'Tidak Memakai Atribut / Dasi / Ikat Pinggang',
    point: 5,
    catatan: 'Tidak memakai dasi saat upacara bendera hari Senin',
    sanksi: 'Peringatan & membeli atribut di koperasi',
    status_sanksi: 'Selesai',
  },
  {
    id_pelanggaran_siswa: 5,
    tgl: getDaysAgo(2),
    id_tahun_ajaran: 1,
    id_user: 1,
    nama_pelapor: 'Drs. Hendro Wibowo (Guru Piket)',
    nis: 20240104,
    nama_siswa: 'Isaac Oluwatemilorun',
    id_kelas: 2,
    nama_kelas: 'XI RPL 2',
    id_kategori_pelanggaran: 2,
    id_pelanggaran: 4,
    nama_pelanggaran: 'Rambut Tidak Sesuai Ketentuan (Putra)',
    point: 10,
    catatan: 'Rambut melebihi kerah baju sekolah',
    sanksi: 'Merapi rambut dalam batas waktu 2 hari',
    status_sanksi: 'Dalam Proses',
  },
  {
    id_pelanggaran_siswa: 6,
    tgl: getDaysAgo(4),
    id_tahun_ajaran: 1,
    id_user: 1,
    nama_pelapor: 'Ibu Ratna, M.Pd (Guru BK)',
    nis: 20240105,
    nama_siswa: 'David Oshodi',
    id_kelas: 3,
    nama_kelas: 'X TKJ 1',
    id_kategori_pelanggaran: 4,
    id_pelanggaran: 6,
    nama_pelanggaran: 'Berkelahi / Terlibat Tawuran',
    point: 100,
    catatan: 'Terlibat perkelahian di luar gerbang sekolah',
    sanksi: 'Skorsing 3 hari & perjanjian tertulis bermaterai',
    status_sanksi: 'Selesai',
  },
]

const initialRiwayatKelas: RiwayatKelas[] = [
  { id_riwayat_kelas: 1, id_tahun_ajaran: 1, id_kelas: 1, nis: 20240101 },
  { id_riwayat_kelas: 2, id_tahun_ajaran: 1, id_kelas: 1, nis: 20240102 },
  { id_riwayat_kelas: 3, id_tahun_ajaran: 1, id_kelas: 2, nis: 20240103 },
  { id_riwayat_kelas: 4, id_tahun_ajaran: 1, id_kelas: 2, nis: 20240104 },
  { id_riwayat_kelas: 5, id_tahun_ajaran: 1, id_kelas: 3, nis: 20240105 },
]

const initialLogs: ActivityLog[] = [
  {
    id_activity_log: 1,
    id_user: 1,
    aksi: 'CREATE',
    nama_tabel: 'pelanggaran_siswas',
    record_id: 3,
    deskripsi: 'Menambahkan pelanggaran David Oshodi (Membawa / Merokok)',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    user: { id_user: 1, username: 'admin' },
  },
  {
    id_activity_log: 2,
    id_user: 1,
    aksi: 'UPDATE',
    nama_tabel: 'pelanggaran_siswas',
    record_id: 1,
    deskripsi: 'Memperbarui status sanksi Muhammad Farhan menjadi Selesai',
    created_at: new Date(Date.now() - 7200000).toISOString(),
    user: { id_user: 1, username: 'admin' },
  },
  {
    id_activity_log: 3,
    id_user: 1,
    aksi: 'CREATE',
    nama_tabel: 'siswas',
    record_id: 20240105,
    deskripsi: 'Pendaftaran siswa baru David Oshodi',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    user: { id_user: 1, username: 'admin' },
  },
]

const initialSampah: Sampah[] = [
  {
    id_sampah: 1,
    id_user: 1,
    nama_tabel: 'siswas',
    record_id: 20230099,
    delete_data: JSON.stringify({ nis: 20230099, nama_siswa: 'Rian Pratama', jk: 'L', status_aktif: 'Pindah' }),
    aksi: 'soft_delete',
    delete_at: new Date(Date.now() - 172800000).toISOString(),
    user: { id_user: 1, username: 'admin' },
  },
  {
    id_sampah: 2,
    id_user: 1,
    nama_tabel: 'pelanggarans',
    record_id: 99,
    delete_data: JSON.stringify({ nama_pelanggaran: 'Membawa kartu permainan', bobot_point: 10 }),
    aksi: 'soft_delete',
    delete_at: new Date(Date.now() - 259200000).toISOString(),
    user: { id_user: 1, username: 'admin' },
  },
]

const initialUsers: User[] = [
  { id_user: 1, username: 'admin', role: 'admin', created_at: '2026-01-01' },
  { id_user: 2, username: 'ratna_bk', role: 'guru_bk', created_at: '2026-01-05' },
  { id_user: 3, username: 'hendro_piket', role: 'petugas', created_at: '2026-01-10' },
]

export const useDataStore = () => {
  const jurusans = useState<Jurusan[]>('db_jurusans', () => [...initialJurusan])
  const kelases = useState<Kelas[]>('db_kelases', () => [...initialKelas])
  const tapels = useState<TahunAjaran[]>('db_tapels', () => [...initialTapel])
  const kategoris = useState<KategoriPelanggaran[]>('db_kategoris', () => [...initialKategori])
  const pelanggarans = useState<Pelanggaran[]>('db_pelanggarans', () => [...initialPelanggaran])
  const siswas = useState<Siswa[]>('db_siswas', () => [...initialSiswa])
  const pelanggaranSiswas = useState<PelanggaranSiswa[]>('db_pelanggaranSiswas', () => [...initialPelanggaranSiswa])
  const riwayatKelases = useState<RiwayatKelas[]>('db_riwayatKelases', () => [...initialRiwayatKelas])
  const logs = useState<ActivityLog[]>('db_logs', () => [...initialLogs])
  const sampahs = useState<Sampah[]>('db_sampahs', () => [...initialSampah])
  const users = useState<User[]>('db_users', () => [...initialUsers])

  const currentUser = useState<{ id_user: number; username: string; role: string; token: string }>('current_user', () => ({
    id_user: 1,
    username: 'Totok Michael',
    role: 'admin',
    token: 'mock-jwt-token-sikap',
  }))

  const seedDemoData = () => {
    pelanggaranSiswas.value = [...initialPelanggaranSiswa]
    siswas.value = [...initialSiswa]
    kelases.value = [...initialKelas]
    jurusans.value = [...initialJurusan]
    tapels.value = [...initialTapel]
    kategoris.value = [...initialKategori]
    pelanggarans.value = [...initialPelanggaran]
  }

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
    seedDemoData,
  }
}

