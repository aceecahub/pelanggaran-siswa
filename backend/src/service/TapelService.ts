import prisma from "../../prisma/client";

export const TapelService = {
  getAll: async () => {
    return await prisma.tahunAjaran.findMany({
      where: {
        status_delete: 0,
      },
    });
  },

  getById: async (id_tahun_ajaran: number) => {
    return await prisma.tahunAjaran.findFirst({
      where: {
        id_tahun_ajaran: id_tahun_ajaran,
        status_delete: 0,
      },
    });
  },

  create: async (nama: string) => {
    return await prisma.tahunAjaran.create({
      data: {
        nama: nama,
        status: "aktif",
        status_delete: 0,
      },
    });
  },

  update: async (
    id_tahun_ajaran: number,
    data: {
      nama?: string;
      status?: string;
      status_delete?: number;
    },
  ) => {
    return await prisma.tahunAjaran.update({
      where: {
        id_tahun_ajaran: id_tahun_ajaran,
      },
      data,
    });
  },

  delete: async (id_tahun_ajaran: number) => {
    return await prisma.tahunAjaran.update({
      where: {
        id_tahun_ajaran: id_tahun_ajaran,
      },
      data: {
        status_delete: 1,
      },
    });
  },
};
