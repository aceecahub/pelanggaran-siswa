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

export const useApi = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase || 'http://localhost:5000'
  const store = useDataStore()

  // Helper request
  const request = async <T>(path: string, options: any = {}): Promise<{ data: T; isFallback?: boolean }> => {
    const url = `${apiBase}${path}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(store.currentUser.value?.token ? { Authorization: `Bearer ${store.currentUser.value.token}` } : {}),
      ...options.headers,
    }

    try {
      const response = await $fetch<any>(url, {
        ...options,
        headers,
      })

      // Backend returns { status, message, data }
      if (response && response.data !== undefined) {
        return { data: response.data }
      }
      return { data: response }
    } catch (err: any) {
      console.warn(`[SIKAP API] Backend unreachable or returned error at ${path}. Using local reactive store.`, err?.message)
      return { data: null as any, isFallback: true }
    }
  }

  // --- SISWA ---
  const getSiswa = async (): Promise<Siswa[]> => {
    const res = await request<Siswa[]>('/api/siswa')
    if (res.data && Array.isArray(res.data)) {
      store.siswas.value = res.data
      return res.data
    }
    return store.siswas.value
  }

  const getSiswaByNis = async (nis: number): Promise<Siswa | null> => {
    const res = await request<Siswa>(`/api/siswa/${nis}`)
    if (res.data) return res.data
    return store.siswas.value.find((s) => s.nis === nis) || null
  }

  const createSiswa = async (payload: Omit<Siswa, 'created_at' | 'updated_at'>): Promise<Siswa> => {
    const res = await request<Siswa>('/api/siswa', {
      method: 'POST',
      body: {
        ...payload,
        nis: String(payload.nis), // backend route expects string for body nis
      },
    })
    const created: Siswa = res.data || { ...payload, created_at: new Date().toISOString() }
    store.siswas.value.unshift(created)
    addLog('CREATE', 'siswas', payload.nis, `Menambahkan siswa baru: ${payload.nama_siswa}`)
    return created
  }

  const updateSiswa = async (nis: number, payload: Partial<Siswa>): Promise<Siswa> => {
    const res = await request<Siswa>(`/api/siswa/${nis}`, {
      method: 'PATCH',
      body: payload,
    })
    const idx = store.siswas.value.findIndex((s) => s.nis === nis)
    if (idx !== -1) {
      store.siswas.value[idx] = { ...store.siswas.value[idx], ...payload }
    }
    addLog('UPDATE', 'siswas', nis, `Memperbarui data siswa: ${payload.nama_siswa || nis}`)
    return res.data || store.siswas.value[idx]
  }

  const deleteSiswa = async (nis: number): Promise<boolean> => {
    await request(`/api/siswa/${nis}`, { method: 'DELETE' })
    const target = store.siswas.value.find((s) => s.nis === nis)
    if (target) {
      store.sampahs.value.unshift({
        id_sampah: Date.now(),
        id_user: store.currentUser.value.id_user,
        nama_tabel: 'siswas',
        record_id: nis,
        delete_data: JSON.stringify(target),
        aksi: 'soft_delete',
        delete_at: new Date().toISOString(),
        user: { id_user: store.currentUser.value.id_user, username: store.currentUser.value.username },
      })
      store.siswas.value = store.siswas.value.filter((s) => s.nis !== nis)
      addLog('DELETE', 'siswas', nis, `Menghapus siswa: ${target.nama_siswa}`)
    }
    return true
  }

  // --- KELAS ---
  const getKelas = async (): Promise<Kelas[]> => {
    const res = await request<Kelas[]>('/api/kelas')
    if (res.data && Array.isArray(res.data)) {
      store.kelases.value = res.data
      return res.data
    }
    return store.kelases.value
  }

  const createKelas = async (payload: { id_jurusan: number; nama_kelas: string }): Promise<Kelas> => {
    const res = await request<Kelas>('/api/kelas', { method: 'POST', body: payload })
    const created: Kelas = res.data || { id_kelas: Date.now(), ...payload }
    store.kelases.value.push(created)
    addLog('CREATE', 'kelas', created.id_kelas, `Menambahkan kelas: ${created.nama_kelas}`)
    return created
  }

  const updateKelas = async (id_kelas: number, payload: Partial<Kelas>): Promise<Kelas> => {
    const res = await request<Kelas>(`/api/kelas/${id_kelas}`, { method: 'PATCH', body: payload })
    const idx = store.kelases.value.findIndex((k) => k.id_kelas === id_kelas)
    if (idx !== -1) {
      store.kelases.value[idx] = { ...store.kelases.value[idx], ...payload }
    }
    addLog('UPDATE', 'kelas', id_kelas, `Memperbarui kelas: ${payload.nama_kelas || id_kelas}`)
    return res.data || store.kelases.value[idx]
  }

  const deleteKelas = async (id_kelas: number): Promise<boolean> => {
    await request(`/api/kelas/${id_kelas}`, { method: 'DELETE' })
    const target = store.kelases.value.find((k) => k.id_kelas === id_kelas)
    if (target) {
      store.kelases.value = store.kelases.value.filter((k) => k.id_kelas !== id_kelas)
      addLog('DELETE', 'kelas', id_kelas, `Menghapus kelas: ${target.nama_kelas}`)
    }
    return true
  }

  // --- JURUSAN ---
  const getJurusan = async (): Promise<Jurusan[]> => {
    const res = await request<Jurusan[]>('/api/jurusan')
    if (res.data && Array.isArray(res.data)) {
      store.jurusans.value = res.data
      return res.data
    }
    return store.jurusans.value
  }

  const createJurusan = async (payload: { nama_jurusan: string; status?: string }): Promise<Jurusan> => {
    const res = await request<Jurusan>('/api/jurusan', { method: 'POST', body: payload })
    const created: Jurusan = res.data || { id_jurusan: Date.now(), ...payload, status: payload.status || 'Aktif' }
    store.jurusans.value.push(created)
    addLog('CREATE', 'jurusans', created.id_jurusan, `Menambahkan jurusan: ${created.nama_jurusan}`)
    return created
  }

  const updateJurusan = async (id_jurusan: number, payload: Partial<Jurusan>): Promise<Jurusan> => {
    const res = await request<Jurusan>(`/api/jurusan/${id_jurusan}`, { method: 'PATCH', body: payload })
    const idx = store.jurusans.value.findIndex((j) => j.id_jurusan === id_jurusan)
    if (idx !== -1) {
      store.jurusans.value[idx] = { ...store.jurusans.value[idx], ...payload }
    }
    addLog('UPDATE', 'jurusans', id_jurusan, `Memperbarui jurusan: ${payload.nama_jurusan || id_jurusan}`)
    return res.data || store.jurusans.value[idx]
  }

  const deleteJurusan = async (id_jurusan: number): Promise<boolean> => {
    await request(`/api/jurusan/${id_jurusan}`, { method: 'DELETE' })
    const target = store.jurusans.value.find((j) => j.id_jurusan === id_jurusan)
    if (target) {
      store.jurusans.value = store.jurusans.value.filter((j) => j.id_jurusan !== id_jurusan)
      addLog('DELETE', 'jurusans', id_jurusan, `Menghapus jurusan: ${target.nama_jurusan}`)
    }
    return true
  }

  // --- TAPEL ---
  const getTapel = async (): Promise<TahunAjaran[]> => {
    const res = await request<TahunAjaran[]>('/api/tapel')
    if (res.data && Array.isArray(res.data)) {
      store.tapels.value = res.data
      return res.data
    }
    return store.tapels.value
  }

  const createTapel = async (payload: { nama: string; status?: string }): Promise<TahunAjaran> => {
    const res = await request<TahunAjaran>('/api/tapel', { method: 'POST', body: payload })
    const created: TahunAjaran = res.data || { id_tahun_ajaran: Date.now(), ...payload, status: payload.status || 'Aktif' }
    store.tapels.value.push(created)
    addLog('CREATE', 'tahun_ajaran', created.id_tahun_ajaran, `Menambahkan tahun ajaran: ${created.nama}`)
    return created
  }

  const updateTapel = async (id_tahun_ajaran: number, payload: Partial<TahunAjaran>): Promise<TahunAjaran> => {
    const res = await request<TahunAjaran>(`/api/tapel/${id_tahun_ajaran}`, { method: 'PATCH', body: payload })
    const idx = store.tapels.value.findIndex((t) => t.id_tahun_ajaran === id_tahun_ajaran)
    if (idx !== -1) {
      store.tapels.value[idx] = { ...store.tapels.value[idx], ...payload }
    }
    addLog('UPDATE', 'tahun_ajaran', id_tahun_ajaran, `Memperbarui tahun ajaran: ${payload.nama || id_tahun_ajaran}`)
    return res.data || store.tapels.value[idx]
  }

  const deleteTapel = async (id_tahun_ajaran: number): Promise<boolean> => {
    await request(`/api/tapel/${id_tahun_ajaran}`, { method: 'DELETE' })
    const target = store.tapels.value.find((t) => t.id_tahun_ajaran === id_tahun_ajaran)
    if (target) {
      store.tapels.value = store.tapels.value.filter((t) => t.id_tahun_ajaran !== id_tahun_ajaran)
      addLog('DELETE', 'tahun_ajaran', id_tahun_ajaran, `Menghapus tahun ajaran: ${target.nama}`)
    }
    return true
  }

  // --- KATEGORI PELANGGARAN ---
  const getKategori = async (): Promise<KategoriPelanggaran[]> => {
    const res = await request<KategoriPelanggaran[]>('/api/kategori-pelanggaran')
    if (res.data && Array.isArray(res.data)) {
      store.kategoris.value = res.data
      return res.data
    }
    return store.kategoris.value
  }

  const createKategori = async (payload: { nama: string }): Promise<KategoriPelanggaran> => {
    const res = await request<KategoriPelanggaran>('/api/kategori-pelanggaran', { method: 'POST', body: payload })
    const created: KategoriPelanggaran = res.data || { id_kategori_pelanggaran: Date.now(), ...payload }
    store.kategoris.value.push(created)
    addLog('CREATE', 'kategori_pelanggaran', created.id_kategori_pelanggaran, `Menambahkan kategori: ${created.nama}`)
    return created
  }

  const updateKategori = async (id: number, payload: Partial<KategoriPelanggaran>): Promise<KategoriPelanggaran> => {
    const res = await request<KategoriPelanggaran>(`/api/kategori-pelanggaran/${id}`, { method: 'PATCH', body: payload })
    const idx = store.kategoris.value.findIndex((k) => k.id_kategori_pelanggaran === id)
    if (idx !== -1) {
      store.kategoris.value[idx] = { ...store.kategoris.value[idx], ...payload }
    }
    addLog('UPDATE', 'kategori_pelanggaran', id, `Memperbarui kategori: ${payload.nama || id}`)
    return res.data || store.kategoris.value[idx]
  }

  const deleteKategori = async (id: number): Promise<boolean> => {
    await request(`/api/kategori-pelanggaran/${id}`, { method: 'DELETE' })
    const target = store.kategoris.value.find((k) => k.id_kategori_pelanggaran === id)
    if (target) {
      store.kategoris.value = store.kategoris.value.filter((k) => k.id_kategori_pelanggaran !== id)
      addLog('DELETE', 'kategori_pelanggaran', id, `Menghapus kategori: ${target.nama}`)
    }
    return true
  }

  // --- PELANGGARAN ---
  const getPelanggaran = async (): Promise<Pelanggaran[]> => {
    const res = await request<Pelanggaran[]>('/api/pelanggaran')
    if (res.data && Array.isArray(res.data)) {
      store.pelanggarans.value = res.data
      return res.data
    }
    return store.pelanggarans.value
  }

  const createPelanggaran = async (payload: {
    id_kategori_pelanggaran: number
    nama_pelanggaran: string
    tingkatan: string
    bobot_point: number
  }): Promise<Pelanggaran> => {
    const res = await request<Pelanggaran>('/api/pelanggaran', { method: 'POST', body: payload })
    const created: Pelanggaran = res.data || { id_pelanggaran: Date.now(), ...payload }
    store.pelanggarans.value.push(created)
    addLog('CREATE', 'pelanggarans', created.id_pelanggaran, `Menambahkan pelanggaran: ${created.nama_pelanggaran}`)
    return created
  }

  const updatePelanggaran = async (id: number, payload: Partial<Pelanggaran>): Promise<Pelanggaran> => {
    const res = await request<Pelanggaran>(`/api/pelanggaran/${id}`, { method: 'PATCH', body: payload })
    const idx = store.pelanggarans.value.findIndex((p) => p.id_pelanggaran === id)
    if (idx !== -1) {
      store.pelanggarans.value[idx] = { ...store.pelanggarans.value[idx], ...payload }
    }
    addLog('UPDATE', 'pelanggarans', id, `Memperbarui pelanggaran: ${payload.nama_pelanggaran || id}`)
    return res.data || store.pelanggarans.value[idx]
  }

  const deletePelanggaran = async (id: number): Promise<boolean> => {
    await request(`/api/pelanggaran/${id}`, { method: 'DELETE' })
    const target = store.pelanggarans.value.find((p) => p.id_pelanggaran === id)
    if (target) {
      store.pelanggarans.value = store.pelanggarans.value.filter((p) => p.id_pelanggaran !== id)
      addLog('DELETE', 'pelanggarans', id, `Menghapus pelanggaran: ${target.nama_pelanggaran}`)
    }
    return true
  }

  // --- PELANGGARAN SISWA (TRANSAKSI) ---
  const getPelanggaranSiswa = async (): Promise<PelanggaranSiswa[]> => {
    const res = await request<PelanggaranSiswa[]>('/api/pelanggaran-siswa')
    if (res.data && Array.isArray(res.data)) {
      store.pelanggaranSiswas.value = res.data
      return res.data
    }
    return store.pelanggaranSiswas.value
  }

  const createPelanggaranSiswa = async (payload: Omit<PelanggaranSiswa, 'id_pelanggaran_siswa'>): Promise<PelanggaranSiswa> => {
    const res = await request<PelanggaranSiswa>('/api/pelanggaran-siswa', { method: 'POST', body: payload })
    const created: PelanggaranSiswa = res.data || { id_pelanggaran_siswa: Date.now(), ...payload }
    store.pelanggaranSiswas.value.unshift(created)
    addLog('CREATE', 'pelanggaran_siswas', created.id_pelanggaran_siswa, `Catat pelanggaran ${payload.nama_siswa}: ${payload.nama_pelanggaran}`)
    return created
  }

  const updatePelanggaranSiswa = async (id: number, payload: Partial<PelanggaranSiswa>): Promise<PelanggaranSiswa> => {
    const res = await request<PelanggaranSiswa>(`/api/pelanggaran-siswa/${id}`, { method: 'PATCH', body: payload })
    const idx = store.pelanggaranSiswas.value.findIndex((p) => p.id_pelanggaran_siswa === id)
    if (idx !== -1) {
      store.pelanggaranSiswas.value[idx] = { ...store.pelanggaranSiswas.value[idx], ...payload }
    }
    addLog('UPDATE', 'pelanggaran_siswas', id, `Update status pelanggaran siswa ID: ${id}`)
    return res.data || store.pelanggaranSiswas.value[idx]
  }

  const deletePelanggaranSiswa = async (id: number): Promise<boolean> => {
    await request(`/api/pelanggaran-siswa/${id}`, { method: 'DELETE' })
    const target = store.pelanggaranSiswas.value.find((p) => p.id_pelanggaran_siswa === id)
    if (target) {
      store.pelanggaranSiswas.value = store.pelanggaranSiswas.value.filter((p) => p.id_pelanggaran_siswa !== id)
      addLog('DELETE', 'pelanggaran_siswas', id, `Menghapus catatan pelanggaran ${target.nama_siswa}`)
    }
    return true
  }

  // --- RIWAYAT KELAS ---
  const getRiwayatKelas = async (): Promise<RiwayatKelas[]> => {
    const res = await request<RiwayatKelas[]>('/api/riwayat-kelas')
    if (res.data && Array.isArray(res.data)) {
      store.riwayatKelases.value = res.data
      return res.data
    }
    return store.riwayatKelases.value
  }

  const createRiwayatKelas = async (payload: { id_tahun_ajaran: number; id_kelas: number; nis: number }): Promise<RiwayatKelas> => {
    const res = await request<RiwayatKelas>('/api/riwayat-kelas', { method: 'POST', body: payload })
    const created: RiwayatKelas = res.data || { id_riwayat_kelas: Date.now(), ...payload }
    store.riwayatKelases.value.unshift(created)
    addLog('CREATE', 'riwayat_kelas', created.id_riwayat_kelas, `Penempatan kelas siswa NIS: ${payload.nis}`)
    return created
  }

  const deleteRiwayatKelas = async (id: number): Promise<boolean> => {
    await request(`/api/riwayat-kelas/${id}`, { method: 'DELETE' })
    store.riwayatKelases.value = store.riwayatKelases.value.filter((r) => r.id_riwayat_kelas !== id)
    addLog('DELETE', 'riwayat_kelas', id, `Menghapus riwayat kelas ID: ${id}`)
    return true
  }

  // --- SAMPAH ---
  const getSampah = async (): Promise<Sampah[]> => {
    const res = await request<Sampah[]>('/api/sampah')
    if (res.data && Array.isArray(res.data)) {
      store.sampahs.value = res.data
      return res.data
    }
    return store.sampahs.value
  }

  const restoreSampah = async (id: number): Promise<boolean> => {
    await request(`/api/sampah/${id}`, { method: 'PATCH' })
    const target = store.sampahs.value.find((s) => s.id_sampah === id)
    if (target) {
      // If was siswa, restore back to siswa list
      if (target.nama_tabel === 'siswas') {
        try {
          const parsed = JSON.parse(target.delete_data)
          if (!store.siswas.value.some((s) => s.nis === parsed.nis)) {
            store.siswas.value.unshift(parsed)
          }
        } catch {}
      }
      store.sampahs.value = store.sampahs.value.filter((s) => s.id_sampah !== id)
      addLog('RESTORE', target.nama_tabel, target.record_id, `Memulihkan data dari sampah: ${target.nama_tabel}`)
    }
    return true
  }

  const deletePermanentSampah = async (id: number): Promise<boolean> => {
    await request(`/api/sampah/${id}`, { method: 'DELETE' })
    store.sampahs.value = store.sampahs.value.filter((s) => s.id_sampah !== id)
    addLog('DELETE_PERMANENT', 'sampah', id, `Menghapus permanen data sampah ID: ${id}`)
    return true
  }

  // --- ACTIVITY LOG ---
  const getActivityLog = async (): Promise<ActivityLog[]> => {
    const res = await request<ActivityLog[]>('/api/activity-log')
    if (res.data && Array.isArray(res.data)) {
      store.logs.value = res.data
      return res.data
    }
    return store.logs.value
  }

  const addLog = (aksi: string, nama_tabel: string, record_id: number, deskripsi: string) => {
    store.logs.value.unshift({
      id_activity_log: Date.now(),
      id_user: store.currentUser.value.id_user,
      aksi,
      nama_tabel,
      record_id,
      deskripsi,
      created_at: new Date().toISOString(),
      user: {
        id_user: store.currentUser.value.id_user,
        username: store.currentUser.value.username,
      },
    })
  }

  // --- USERS ---
  const getUsers = async (): Promise<User[]> => {
    const res = await request<User[]>('/api/user')
    if (res.data && Array.isArray(res.data)) {
      store.users.value = res.data
      return res.data
    }
    return store.users.value
  }

  const updateUser = async (id: number, payload: Partial<User>): Promise<User> => {
    const res = await request<User>(`/api/user/${id}`, { method: 'PATCH', body: payload })
    const idx = store.users.value.findIndex((u) => u.id_user === id)
    if (idx !== -1) {
      store.users.value[idx] = { ...store.users.value[idx], ...payload }
    }
    return res.data || store.users.value[idx]
  }

  const deleteUser = async (id: number): Promise<boolean> => {
    await request(`/api/user/${id}`, { method: 'DELETE' })
    store.users.value = store.users.value.filter((u) => u.id_user !== id)
    return true
  }

  return {
    // Siswa
    getSiswa,
    getSiswaByNis,
    createSiswa,
    updateSiswa,
    deleteSiswa,
    // Kelas
    getKelas,
    createKelas,
    updateKelas,
    deleteKelas,
    // Jurusan
    getJurusan,
    createJurusan,
    updateJurusan,
    deleteJurusan,
    // Tapel
    getTapel,
    createTapel,
    updateTapel,
    deleteTapel,
    // Kategori
    getKategori,
    createKategori,
    updateKategori,
    deleteKategori,
    // Pelanggaran
    getPelanggaran,
    createPelanggaran,
    updatePelanggaran,
    deletePelanggaran,
    // Pelanggaran Siswa
    getPelanggaranSiswa,
    createPelanggaranSiswa,
    updatePelanggaranSiswa,
    deletePelanggaranSiswa,
    // Riwayat Kelas
    getRiwayatKelas,
    createRiwayatKelas,
    deleteRiwayatKelas,
    // Sampah
    getSampah,
    restoreSampah,
    deletePermanentSampah,
    // Activity Log
    getActivityLog,
    // Users
    getUsers,
    updateUser,
    deleteUser,
  }
}

