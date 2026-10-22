
import prisma from "../../prisma/client"

export const PelanggaranSiswaService = {
  getAll: async () => {
    return await prisma.pelanggaranSiswa.findMany({
      where: { status_delete: 0 },
      orderBy: { id_pelanggaran_siswa: "desc" },
    })
  },

  getById: async (id_pelanggaran_siswa: number) => {
    return await prisma.pelanggaranSiswa.findFirst({
      where: {
        id_pelanggaran_siswa,
      },
    })
  },

  create: async (data: {
    tgl: Date
    id_tahun_ajaran: number
    id_user: number
    nama_pelapor: string
    nis: number
    nama_siswa: string
    id_kelas: number
    nama_kelas: string
    id_kategori_pelanggaran: number
    id_pelanggaran: number
    nama_pelanggaran: string
    point: number
    catatan: string
    sanksi: string
    status_sanksi: string
  }) => {
    return await prisma.pelanggaranSiswa.create({
      data: {
        ...data,
        status_delete: 0,
      },
    })
  },

  update: async (
    id_pelanggaran_siswa: number,
    data: {
      tgl?: Date
      id_tahun_ajaran?: number
      id_user?: number
      nama_pelapor?: string
      nis?: number
      nama_siswa?: string
      id_kelas?: number
      nama_kelas?: string
      id_kategori_pelanggaran?: number
      id_pelanggaran?: number
      nama_pelanggaran?: string
      point?: number
      catatan?: string
      sanksi?: string
      status_sanksi?: string
      status_delete?: number
    },
  ) => {
    return await prisma.pelanggaranSiswa.update({
      where: { id_pelanggaran_siswa },
      data,
    })
  },

  delete: async (id_pelanggaran_siswa: number) => {
    return await prisma.pelanggaranSiswa.update({
      where: { id_pelanggaran_siswa },
      data: { status_delete: 1 },
    })
  },
}
