import prisma from "../../prisma/client"
export const SiswaService = {
  getAll: async () => {
    return await prisma.siswa.findMany({
      where: {
        status_delete: 0,
      },
    })
  },
  getById: async (nis: number) => {
    return await prisma.siswa.findFirst({
      where: {
        nis: nis,
        status_delete: 0,
      },
    })
  },
  create: async (
    nis: number,
    nama_siswa: string,
    tgl_lahir: Date,
    tempat_lahir: string,
    jk: string,
    no_hp: string,
    agama: string,
    no_hp_ortu: string,
    nama_ayah: string,
    pekerjaan_ayah: string,
    nama_ibu: string,
    pekerjaan_ibu: string,
    alamat_ortu: string,
    alamat: string,
    status_aktif: string,
  ) => {
    return await prisma.siswa.create({
      data: {
        nis,
        nama_siswa,
        tgl_lahir,
        tempat_lahir,
        jk,
        no_hp,
        agama,
        no_hp_ortu,
        nama_ayah,
        pekerjaan_ayah,
        nama_ibu,
        pekerjaan_ibu,
        alamat_ortu,
        alamat,
        status_aktif: status_aktif || "aktif",
        status_delete: 0,
      },
    })
  },
  update: async (
    nis: number,
    data: {
      nama_siswa?: string
      tgl_lahir?: Date
      tempat_lahir?: string
      jk?: string
      no_hp?: string
      agama?: string
      no_hp_ortu?: string
      nama_ayah?: string
      pekerjaan_ayah?: string
      nama_ibu?: string
      pekerjaan_ibu?: string
      alamat_ortu?: string
      alamat?: string
      status_aktif?: string
      status_delete?: number
    },
  ) => {
    return await prisma.siswa.update({
      where: { nis: nis },
      data,
    })
  },
  delete: async (nis: number) => {
    return await prisma.siswa.update({
      where: { nis: nis },
      data: {
        status_delete: 1,
      },
    })
  },
}
