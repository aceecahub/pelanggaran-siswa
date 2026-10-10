import prisma from "../../prisma/client";

export const KategoriPelanggaranService = {
  getAll: async () => {
    return await prisma.kategoriPelanggaran.findMany({
      where: {
        status_delete: 0,
      },
    });
  },

  getById: async (id_kategori_pelanggaran: number) => {
    return await prisma.kategoriPelanggaran.findFirst({
      where: {
        id_kategori_pelanggaran: id_kategori_pelanggaran,
      },
    });
  },

  create: async (nama: string) => {
    return await prisma.kategoriPelanggaran.create({
      data: {
        nama: nama,
        status_delete: 0,
      },
    });
  },

  update: async (
    id_kategori_pelanggaran: number,
    data: {
      nama?: string;
      status_delete?: number;
    },
  ) => {
    return await prisma.kategoriPelanggaran.update({
      where: {
        id_kategori_pelanggaran: id_kategori_pelanggaran,
      },
      data,
    });
  },

  delete: async (id_kategori_pelanggaran: number) => {
    return await prisma.kategoriPelanggaran.update({
      where: {
        id_kategori_pelanggaran: id_kategori_pelanggaran,
      },
      data: {
        status_delete: 1,
      },
    });
  },
};
