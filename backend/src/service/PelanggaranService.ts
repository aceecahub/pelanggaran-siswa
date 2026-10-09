import prisma from "../../prisma/client"

export const PelanggaranService = {
  getAll: async () => {
    return await prisma.pelanggaran.findMany({
      where: {
        status_delete: 0,
      },
    })
  },

  getById: async (id_pelanggaran: number) => {
    return await prisma.pelanggaran.findFirst({
      where: {
        id_pelanggaran: id_pelanggaran,
        status_delete: 0,
      },
    })
  },

  create: async (
    id_kategori_pelanggaran: number,
    nama_pelanggaran: string,
    tingkatan: string,
    bobot_point: number,
  ) => {
    return await prisma.pelanggaran.create({
      data: {
        id_kategori_pelanggaran: id_kategori_pelanggaran,
        nama_pelanggaran: nama_pelanggaran,
        tingkatan: tingkatan,
        bobot_point: bobot_point,
        status_delete: 0,
      },
    })
  },

  update: async (
    id_pelanggaran: number,
    data: {
      id_kategori_pelanggaran?: number
      nama_pelanggaran?: string
      tingkatan?: string
      bobot_point?: number
      status_delete?: number
    },
  ) => {
    return await prisma.pelanggaran.update({
      where: {
        id_pelanggaran: id_pelanggaran,
      },
      data,
    })
  },

  delete: async (id_pelanggaran: number) => {
    return await prisma.pelanggaran.update({
      where: {
        id_pelanggaran: id_pelanggaran,
      },
      data: {
        status_delete: 1,
      },
    })
  },
}
