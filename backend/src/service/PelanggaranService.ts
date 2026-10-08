import prisma from "../../prisma/client"

export const PelanggaranService = {
  getAll: async () => {
    return await prisma.pelanggaran.findMany()
  },

  getById: async (id_pelanggaran: number) => {
    return await prisma.pelanggaran.findUnique({
      where: {
        id_pelanggaran: id_pelanggaran,
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
      },
    })
  },

  update: async (
    id_pelanggaran: number,
    id_kategori_pelanggaran: number,
    nama_pelanggaran: string,
    tingkatan: string,
    bobot_point: number,
    status_delete: number,
  ) => {
    return await prisma.pelanggaran.update({
      where: {
        id_pelanggaran: id_pelanggaran,
      },
      data: {
        id_kategori_pelanggaran: id_kategori_pelanggaran,
        nama_pelanggaran: nama_pelanggaran,
        tingkatan: tingkatan,
        bobot_point: bobot_point,
        status_delete: status_delete,
      },
    })
  },

  delete: async (id_pelanggaran: number) => {
    return await prisma.pelanggaran.delete({
      where: {
        id_pelanggaran: id_pelanggaran,
      },
    })
  },
}
