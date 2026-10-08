import prisma from "../../prisma/client"

export const KelasService = {
  getAll: async () => {
    return await prisma.kelas.findMany()
  },

  getById: async (id_kelas: number) => {
    return await prisma.kelas.findUnique({
      where: {
        id_kelas: id_kelas,
      },
    })
  },

  create: async (
    id_jurusan: string,
    nama_kelas: string,
  ) => {
    return await prisma.kelas.create({
      data: {
        id_jurusan: id_jurusan,
        nama_kelas: nama_kelas,
      },
    })
  },

  update: async (
    id_kelas: number,
    id_jurusan: string,
    nama_kelas: string,
    status_delete: number,
  ) => {
    return await prisma.kelas.update({
      where: {
        id_kelas: id_kelas,
      },
      data: {
        id_jurusan: id_jurusan,
        nama_kelas: nama_kelas,
        status_delete: status_delete,
      },
    })
  },

  delete: async (id_kelas: number) => {
    return await prisma.kelas.delete({
      where: {
        id_kelas: id_kelas,
      },
    })
  },
}
