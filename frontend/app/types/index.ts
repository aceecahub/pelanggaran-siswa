export interface Siswa {
  nis: number
  nama_siswa: string
  tgl_lahir: string
  tempat_lahir: string
  jk: 'L' | 'P' | string
  no_hp: string
  agama: string
  no_hp_ortu: string
  nama_ayah: string
  pekerjaan_ayah: string
  nama_ibu: string
  pekerjaan_ibu: string
  alamat_ortu: string
  alamat: string
  status_aktif: 'Aktif' | 'Tidak Aktif' | 'Lulus' | 'Pindah' | string
  status_delete?: number
  created_at?: string
  updated_at?: string
}

export interface Jurusan {
  id_jurusan: number
  nama_jurusan: string
  status?: string
  status_delete?: number
  created_at?: string
  updated_at?: string
}

export interface Kelas {
  id_kelas: number
  id_jurusan: number
  nama_kelas: string
  status_delete?: number
  created_at?: string
  updated_at?: string
  jurusan?: Jurusan
}

export interface TahunAjaran {
  id_tahun_ajaran: number
  nama: string
  status?: string
  status_delete?: number
  created_at?: string
  updated_at?: string
}

export interface KategoriPelanggaran {
  id_kategori_pelanggaran: number
  nama: string
  status_delete?: number
  created_at?: string
  updated_at?: string
}

export interface Pelanggaran {
  id_pelanggaran: number
  id_kategori_pelanggaran: number
  nama_pelanggaran: string
  tingkatan: 'Ringan' | 'Sedang' | 'Berat' | string
  bobot_point: number
  status_delete?: number
  created_at?: string
  updated_at?: string
  kategori_pelanggaran?: KategoriPelanggaran
}

export interface PelanggaranSiswa {
  id_pelanggaran_siswa: number
  tgl: string
  id_tahun_ajaran: number
  id_user: number
  nama_pelapor: string
  nis: number
  nama_siswa: string
  id_kelas: number
  nama_kelas: string
  id_kategori_pelanggaran: number
  id_pelanggaran: number
  nama_pelanggaran: string
  point: number
  catatan: string
  sanksi: string
  status_sanksi: 'Pending' | 'Dalam Proses' | 'Selesai' | string
  status_delete?: number
  created_at?: string
  updated_at?: string
}

export interface RiwayatKelas {
  id_riwayat_kelas: number
  id_tahun_ajaran: number
  id_kelas: number
  nis: number
  status_delete?: number
  created_at?: string
  updated_at?: string
  tahun_ajaran?: TahunAjaran
  kelas?: Kelas
  siswa?: Siswa
}

export interface Sampah {
  id_sampah: number
  id_user: number
  nama_tabel: string
  record_id: number
  delete_data: string
  aksi: string
  delete_at?: string
  user?: {
    id_user: number
    username: string
  }
}

export interface ActivityLog {
  id_activity_log: number
  id_user: number
  aksi: string
  nama_tabel: string
  record_id: number
  deskripsi: string
  created_at?: string
  user?: {
    id_user: number
    username: string
  }
}

export interface User {
  id_user: number
  username: string
  role: string
  status_delete?: number
  created_at?: string
}

