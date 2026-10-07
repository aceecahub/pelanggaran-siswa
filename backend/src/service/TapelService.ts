import prisma from "../../prisma/client";

export const TapelService = {
  getAll: async () => {
    return await prisma.tahunAjaran.findMany();
  },

  getById: async (id_tahun_ajaran: number) => {
    return await prisma.tahunAjaran.findUnique({
      where: {
        id_tahun_ajaran: id_tahun_ajaran,
      },
    });
  },

  create: async (nama: string) => {
    return await prisma.tahunAjaran.create({
      data: {
        nama: nama,
        status: "aktif",
      },
    });
  },

  update: async (
    id_tahun_ajaran: number,
    nama: string,
    status: string,
    status_delete: number,
  ) => {
    return await prisma.tahunAjaran.update({
      where: {
        id_tahun_ajaran: id_tahun_ajaran,
      },
      data: {
        nama: nama,
        status: status,
        status_delete: status_delete,
      },
    });
  },

  delete: async (id_tahun_ajaran: number) => {
    return await prisma.tahunAjaran.delete({
      where: {
        id_tahun_ajaran: id_tahun_ajaran,
      },
    });
  },
};
