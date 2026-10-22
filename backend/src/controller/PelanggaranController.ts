import { PelanggaranService } from "../service/PelanggaranService"

export const PelanggaranController = {
  getAll: async () => {
    try {
      const pelanggaran = await PelanggaranService.getAll()
      return {
        status: 200,
        message: "Data pelanggaran berhasil diambil",
        data: pelanggaran,
      }
    } catch (error) {
      return {
        status: 500,
        message: "Terjadi kesalahan pada server",
      }
    }
  },

  getById: async ({ params }: any) => {
    try {
      if (!params?.id_pelanggaran) {
        return {
          status: 400,
          message: "ID pelanggaran wajib diisi",
        }
      }
      const idNumber = Number(params.id_pelanggaran)
      const pelanggaran = await PelanggaranService.getById(idNumber)
      if (!pelanggaran) {
        return {
          status: 404,
          message: "Data pelanggaran tidak ditemukan",
        }
      }
      return {
        status: 200,
        message: "Data pelanggaran berhasil ditemukan",
        data: pelanggaran,
      }
    } catch (error) {
      return {
        status: 500,
        message: "Terjadi kesalahan pada server",
      }
    }
  },

  create: async ({ body }: any) => {
    try {
      const idKategori = body?.id_kategori_pelanggaran
      const namaInput = body?.nama_pelanggaran?.trim()
      const tingkatanInput = body?.tingkatan?.trim()
      const bobotPointInput = body?.bobot_point
      if (
        !idKategori ||
        !namaInput ||
        !tingkatanInput ||
        bobotPointInput === undefined
      ) {
        return {
          status: 400,
          message: "Semua field wajib diisi",
        }
      }
      const allPelanggaran = await PelanggaranService.getAll()
      const isExist = allPelanggaran.some(
        (p: any) =>
          p.nama_pelanggaran.toLowerCase() === namaInput.toLowerCase(),
      )
      if (isExist) {
        return {
          status: 409,
          message: `Nama pelanggaran '${namaInput}' sudah terdaftar`,
        }
      }
      const pelanggaran = await PelanggaranService.create(
        Number(idKategori),
        namaInput,
        tingkatanInput,
        Number(bobotPointInput),
      )
      return {
        status: 201,
        message: "Data pelanggaran berhasil ditambahkan",
        data: pelanggaran,
      }
    } catch (error: any) {
      return {
        status: 400,
        message: error.message || "Data pelanggaran gagal ditambahkan",
      }
    }
  },

  update: async ({ params, body }: any) => {
    try {
      if (!params?.id_pelanggaran) {
        return {
          status: 400,
          message: "ID pelanggaran wajib diisi",
        }
      }
      const idNumber = Number(params.id_pelanggaran)
      if (isNaN(idNumber)) {
        return {
          status: 400,
          message: "ID pelanggaran tidak valid",
        }
      }

      if (!body || Object.keys(body).length === 0) {
        return {
          status: 400,
          message: "Minimal satu field harus diisi untuk diperbarui",
        }
      }

      const existingData = await PelanggaranService.getById(idNumber)
      if (!existingData) {
        return {
          status: 404,
          message: "Data pelanggaran tidak ditemukan",
        }
      }

      const dataToUpdate: any = {}
      if (body.id_kategori_pelanggaran !== undefined) {
        dataToUpdate.id_kategori_pelanggaran = Number(body.id_kategori_pelanggaran)
      }

      if (body.nama_pelanggaran !== undefined) {
        const namaInput = body.nama_pelanggaran.trim()
        if (!namaInput) {
          return {
            status: 400,
            message: "Nama pelanggaran tidak boleh kosong",
          }
        }
        if (
          namaInput.toLowerCase() !== existingData.nama_pelanggaran.toLowerCase()
        ) {
          const allPelanggaran = await PelanggaranService.getAll()
          const isNameTaken = allPelanggaran.some(
            (p: any) =>
              p.nama_pelanggaran.toLowerCase() === namaInput.toLowerCase() &&
              p.id_pelanggaran !== idNumber,
          )
          if (isNameTaken) {
            return {
              status: 409,
              message: `Nama pelanggaran '${namaInput}' sudah digunakan oleh data lain`,
            }
          }
        }
        dataToUpdate.nama_pelanggaran = namaInput
      }

      if (body.tingkatan !== undefined) {
        dataToUpdate.tingkatan = body.tingkatan.trim()
      }

      if (body.bobot_point !== undefined) {
        dataToUpdate.bobot_point = Number(body.bobot_point)
      }

      if (body.status_delete !== undefined) {
        dataToUpdate.status_delete = Number(body.status_delete)
      }

      const pelanggaran = await PelanggaranService.update(
        idNumber,
        dataToUpdate,
      )
      return {
        status: 200,
        message: "Data pelanggaran berhasil diperbarui",
        data: pelanggaran,
      }
    } catch (error: any) {
      return {
        status: 400,
        message: error.message || "Data pelanggaran gagal diperbarui",
      }
    }
  },

  delete: async ({ params }: any) => {
    try {
      if (!params?.id_pelanggaran) {
        return {
          status: 400,
          message: "ID pelanggaran wajib diisi",
        }
      }
      const idNumber = Number(params.id_pelanggaran)
      const existingData = await PelanggaranService.getById(idNumber)
      if (!existingData) {
        return {
          status: 404,
          message: "Data pelanggaran tidak ditemukan",
        }
      }
      const pelanggaran = await PelanggaranService.delete(idNumber)
      return {
        status: 200,
        message: "Data pelanggaran berhasil dihapus",
        data: pelanggaran,
      }
    } catch (error: any) {
      return {
        status: 400,
        message: error.message || "Data pelanggaran gagal dihapus",
      }
    }
  },
}
