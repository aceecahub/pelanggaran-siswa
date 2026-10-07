import prisma from "../../prisma/client";

export const KategoriPelanggaranService = {
  getAll: async () => {
    return await prisma.kategoriPelanggaran.findMany();
  },

  getById: async (id_kategori_pelanggaran: number) => {
    return await prisma.kategoriPelanggaran.findUnique({
      where: {
        id_kategori_pelanggaran: id_kategori_pelanggaran,
      },
    });
  },

  create: async (nama: string) => {
    return await prisma.kategoriPelanggaran.create({
      data: {
        nama: nama,
      },
    });
  },

  update: async (
    id_kategori_pelanggaran: number,
    nama: string,
    status_delete: number,
  ) => {
    return await prisma.kategoriPelanggaran.update({
      where: {
        id_kategori_pelanggaran: id_kategori_pelanggaran,
      },
      data: {
        nama: nama,
        status_delete: status_delete,
      },
    });
  },

  delete: async (id_kategori_pelanggaran: number) => {
    return await prisma.kategoriPelanggaran.delete({
      where: {
        id_kategori_pelanggaran: id_kategori_pelanggaran,
      },
    });
  },
};
