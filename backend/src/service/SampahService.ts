import prisma from "../../prisma/client"

export const SampahService = {
  getAll: async () => {
    return await prisma.sampah.findMany()
  },

  getById: async (id_sampah: number) => {
    return await prisma.sampah.findUnique({
      where: { id_sampah }
    })
  },

  restore: async (id_sampah: number) => {
    return await prisma.sampah.update({
      where: { id_sampah },
      data: { aksi: "restore" }
    })
  },

  delete: async (id_sampah: number) => {
    return await prisma.sampah.delete({
      where: { id_sampah }
    })
  }
}