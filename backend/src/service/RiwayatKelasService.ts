import prisma from "../../prisma/client"

export const RiwayatKelasService = {
  getAll: async () => {
    return await prisma.riwayatKelas.findMany({
      where: {
        status_delete: 0,
      },
    })
  },

  getById: async (id_riwayat_kelas: number) => {
    return await prisma.riwayatKelas.findFirst({
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
        status_delete: 0,
      },
    })
  },

  update: async (
    id_riwayat_kelas: number,
    data: {
      id_tahun_ajaran?: number
      id_kelas?: number
      nis?: number
      status_delete?: number
    },
  ) => {
    return await prisma.riwayatKelas.update({
      where: {
        id_riwayat_kelas: id_riwayat_kelas,
      },
      data,
    })
  },

  delete: async (id_riwayat_kelas: number) => {
    return await prisma.riwayatKelas.update({
      where: {
        id_riwayat_kelas: id_riwayat_kelas,
      },
      data: {
        status_delete: 1,
      },
    })
  },
}
