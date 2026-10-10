
import { PelanggaranSiswaService } from "../service/PelanggaranSiswaService"

const requiredFields = [
  "tgl",
  "id_tahun_ajaran",
  "id_user",
  "nama_pelapor",
  "nis",
  "nama_siswa",
  "id_kelas",
  "nama_kelas",
  "id_kategori_pelanggaran",
  "id_pelanggaran",
  "nama_pelanggaran",
  "point",
  "catatan",
  "sanksi",
  "status_sanksi",
]

const stringFields = [
  "nama_pelapor",
  "nama_siswa",
  "nama_kelas",
  "nama_pelanggaran",
  "catatan",
  "sanksi",
  "status_sanksi",
]

const numberFields = [
  "id_tahun_ajaran",
  "id_user",
  "nis",
  "id_kelas",
  "id_kategori_pelanggaran",
  "id_pelanggaran",
  "point",
]

const prepareData = (body: any, isCreate = false) => {
  const data: any = {}

  for (const field of stringFields) {
    if (body[field] !== undefined) {
      if (typeof body[field] !== "string" || !body[field].trim()) {
        throw new Error(`${field} tidak boleh kosong`)
      }
      data[field] = body[field].trim()
    }
  }

  for (const field of numberFields) {
    if (body[field] !== undefined) {
      const value = Number(body[field])
      if (!Number.isSafeInteger(value) || value < 0) {
        throw new Error(`${field} harus berupa bilangan bulat yang valid`)
      }
      data[field] = value
    }
  }

  if (body.tgl !== undefined) {
    const date = new Date(body.tgl)
    if (
      typeof body.tgl !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(body.tgl) ||
      Number.isNaN(date.getTime()) ||
      date.toISOString().slice(0, 10) !== body.tgl
    ) {
      throw new Error("Tanggal harus menggunakan format YYYY-MM-DD")
    }
    data.tgl = date
  }

  if (body.status_delete !== undefined && !isCreate) {
    const statusDelete = Number(body.status_delete)
    if (![0, 1].includes(statusDelete)) {
      throw new Error("status_delete hanya boleh bernilai 0 atau 1")
    }
    data.status_delete = statusDelete
  }

  return data
}

export const PelanggaranSiswaController = {
  getAll: async () => {
    try {
      const data = await PelanggaranSiswaService.getAll()
      return {
        status: 200,
        message: "Data pelanggaran siswa berhasil diambil",
        data,
      }
    } catch {
      return {
        status: 500,
        message: "Terjadi kesalahan pada server",
      }
    }
  },

  getById: async ({ params }: any) => {
    try {
      const id = Number(params.id_pelanggaran_siswa)
      if (!Number.isSafeInteger(id) || id <= 0) {
        return { status: 400, message: "ID pelanggaran siswa tidak valid" }
      }

      const data = await PelanggaranSiswaService.getById(id)
      if (!data) {
        return { status: 404, message: "Data pelanggaran siswa tidak ditemukan" }
      }

      return {
        status: 200,
        message: "Data pelanggaran siswa berhasil ditemukan",
        data,
      }
    } catch {
      return { status: 500, message: "Terjadi kesalahan pada server" }
    }
  },

  create: async ({ body }: any) => {
    try {
      for (const field of requiredFields) {
        if (
          body[field] === undefined ||
          body[field] === null ||
          body[field] === ""
        ) {
          return {
            status: 400,
            message: `Field ${field} wajib diisi`,
          }
        }
      }

      const data = await PelanggaranSiswaService.create(prepareData(body, true))

      return {
        status: 201,
        message: "Data pelanggaran siswa berhasil ditambahkan",
        data,
      }
    } catch (error: any) {
      return {
        status: 400,
        message: error.message || "Data pelanggaran siswa gagal ditambahkan",
      }
    }
  },

  update: async ({ params, body }: any) => {
    try {
      const id = Number(params.id_pelanggaran_siswa)
      if (!Number.isSafeInteger(id) || id <= 0) {
        return { status: 400, message: "ID pelanggaran siswa tidak valid" }
      }

      if (!body || Object.keys(body).length === 0) {
        return {
          status: 400,
          message: "Minimal satu field harus diisi untuk diperbarui",
        }
      }

      const existing = await PelanggaranSiswaService.getById(id)
      if (!existing) {
        return { status: 404, message: "Data pelanggaran siswa tidak ditemukan" }
      }

      const dataToUpdate = prepareData(body)
      if (Object.keys(dataToUpdate).length === 0) {
        return { status: 400, message: "Tidak ada field valid untuk diperbarui" }
      }

      const data = await PelanggaranSiswaService.update(id, dataToUpdate)

      return {
        status: 200,
        message: "Data pelanggaran siswa berhasil diperbarui",
        data,
      }
    } catch (error: any) {
      return {
        status: 400,
        message: error.message || "Data pelanggaran siswa gagal diperbarui",
      }
    }
  },

  delete: async ({ params }: any) => {
    try {
      const id = Number(params.id_pelanggaran_siswa)
      if (!Number.isSafeInteger(id) || id <= 0) {
        return { status: 400, message: "ID pelanggaran siswa tidak valid" }
      }

      const existing = await PelanggaranSiswaService.getById(id)
      if (!existing) {
        return { status: 404, message: "Data pelanggaran siswa tidak ditemukan" }
      }

      const data = await PelanggaranSiswaService.delete(id)

      return {
        status: 200,
        message: "Data pelanggaran siswa berhasil dihapus",
        data,
      }
    } catch {
      return { status: 500, message: "Terjadi kesalahan pada server" }
    }
  },
}
