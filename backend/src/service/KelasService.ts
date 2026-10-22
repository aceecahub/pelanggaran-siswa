import prisma from "../../prisma/client"

export const KelasService = {
  getAll: async () => {
    return await prisma.kelas.findMany({
      where: {
        status_delete: 0,
      },
    })
  },

  getById: async (id_kelas: number) => {
    return await prisma.kelas.findFirst({
      where: {
        id_kelas: id_kelas,
      },
    })
  },

  create: async (
    id_jurusan: number,
    nama_kelas: string,
  ) => {
    return await prisma.kelas.create({
      data: {
        id_jurusan: id_jurusan,
        nama_kelas: nama_kelas,
        status_delete: 0,
      },
    })
  },

  update: async (
    id_kelas: number,
    data: {
      id_jurusan?: number
      nama_kelas?: string
      status_delete?: number
    },
  ) => {
    return await prisma.kelas.update({
      where: {
        id_kelas: id_kelas,
      },
      data,
    })
  },

  delete: async (id_kelas: number) => {
    return await prisma.kelas.update({
      where: {
        id_kelas: id_kelas,
      },
      data: {
        status_delete: 1,
      },
    })
  },
}
