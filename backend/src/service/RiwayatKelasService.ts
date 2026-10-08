import prisma from "../../prisma/client"

export const RiwayatKelasService = {
  getAll: async () => {
    return await prisma.riwayatKelas.findMany()
  },

  getById: async (id_riwayat_kelas: number) => {
    return await prisma.riwayatKelas.findUnique({
      where: {
        id_riwayat_kelas: id_riwayat_kelas,
      },
    })
  },

  create: async (id_tahun_ajaran: number, id_kelas: number, nis: number) => {
    return await prisma.riwayatKelas.create({
      data: {
        id_tahun_ajaran: id_tahun_ajaran,
        id_kelas: id_kelas,
        nis: nis,
      },
    })
  },

  update: async (
    id_riwayat_kelas: number,
    id_tahun_ajaran: number,
    id_kelas: number,
    nis: number,
    status_delete: number,
  ) => {
    return await prisma.riwayatKelas.update({
      where: {
        id_riwayat_kelas: id_riwayat_kelas,
      },
      data: {
        id_tahun_ajaran: id_tahun_ajaran,
        id_kelas: id_kelas,
        nis: nis,
        status_delete: status_delete,
      },
    })
  },

  delete: async (id_riwayat_kelas: number) => {
    return await prisma.riwayatKelas.delete({
      where: {
        id_riwayat_kelas: id_riwayat_kelas,
      },
    })
  },
}
