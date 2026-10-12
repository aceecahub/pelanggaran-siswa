/**
 * useApi - Aggregator composable for backward compatibility.
 * Setiap modul sekarang memiliki composable independen di direktori composables/ :
 * - useJurusan.ts
 * - useKelas.ts
 * - useTapel.ts
 * - useKategoriPelanggaran.ts
 * - usePelanggaran.ts
 * - useSiswa.ts
 * - usePelanggaranSiswa.ts
 * - useRiwayatKelas.ts
 * - useSampah.ts
 * - useActivityLog.ts
 * - useUser.ts
 */
export const useApi = () => {
  const jurusan = useJurusan()
  const kelas = useKelas()
  const tapel = useTapel()
  const kategori = useKategoriPelanggaran()
  const pelanggaran = usePelanggaran()
  const siswa = useSiswa()
  const pelanggaranSiswa = usePelanggaranSiswa()
  const riwayatKelas = useRiwayatKelas()
  const sampah = useSampah()
  const activityLog = useActivityLog()
  const user = useUser()

  return {
    // Siswa
    getSiswa: siswa.getSiswa,
    getSiswaByNis: siswa.getSiswaByNis,
    createSiswa: siswa.createSiswa,
    updateSiswa: siswa.updateSiswa,
    deleteSiswa: siswa.deleteSiswa,

    // Kelas
    getKelas: kelas.getKelas,
    createKelas: kelas.createKelas,
    updateKelas: kelas.updateKelas,
    deleteKelas: kelas.deleteKelas,

    // Jurusan
    getJurusan: jurusan.getJurusan,
    getJurusanById: jurusan.getJurusanById,
    createJurusan: jurusan.createJurusan,
    updateJurusan: jurusan.updateJurusan,
    deleteJurusan: jurusan.deleteJurusan,

    // Tapel
    getTapel: tapel.getTapel,
    createTapel: tapel.createTapel,
    updateTapel: tapel.updateTapel,
    deleteTapel: tapel.deleteTapel,

    // Kategori
    getKategori: kategori.getKategori,
    createKategori: kategori.createKategori,
    updateKategori: kategori.updateKategori,
    deleteKategori: kategori.deleteKategori,

    // Pelanggaran
    getPelanggaran: pelanggaran.getPelanggaran,
    createPelanggaran: pelanggaran.createPelanggaran,
    updatePelanggaran: pelanggaran.updatePelanggaran,
    deletePelanggaran: pelanggaran.deletePelanggaran,

    // Pelanggaran Siswa
    getPelanggaranSiswa: pelanggaranSiswa.getPelanggaranSiswa,
    createPelanggaranSiswa: pelanggaranSiswa.createPelanggaranSiswa,
    updatePelanggaranSiswa: pelanggaranSiswa.updatePelanggaranSiswa,
    deletePelanggaranSiswa: pelanggaranSiswa.deletePelanggaranSiswa,

    // Riwayat Kelas
    getRiwayatKelas: riwayatKelas.getRiwayatKelas,
    createRiwayatKelas: riwayatKelas.createRiwayatKelas,
    deleteRiwayatKelas: riwayatKelas.deleteRiwayatKelas,

    // Sampah
    getSampah: sampah.getSampah,
    restoreSampah: sampah.restoreSampah,
    deletePermanentSampah: sampah.deletePermanentSampah,

    // Activity Log
    getActivityLog: activityLog.getActivityLog,
    addLog: activityLog.addLog,

    // Users
    getUsers: user.getUsers,
    updateUser: user.updateUser,
    deleteUser: user.deleteUser,
    login: user.login,
    logout: user.logout,
  }
}
