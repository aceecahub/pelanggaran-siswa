import { KategoriPelanggaranService } from "../service/KategoriPelanggaranService"

export const KategoriPelanggaranController = {
  getAll: async () => {
    try {
      const kategori = await KategoriPelanggaranService.getAll()
      return {
        status: 200,
        message: "Data kategori pelanggaran berhasil diambil",
        data: kategori,
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
      if (!params?.id_kategori_pelanggaran) {
        return {
          status: 400,
          message: "ID kategori pelanggaran wajib diisi",
        }
      }

      const idNumber = Number(params.id_kategori_pelanggaran)
      const kategori = await KategoriPelanggaranService.getById(idNumber)

      if (!kategori) {
        return {
          status: 404,
          message: "Data kategori pelanggaran tidak ditemukan",
        }
      }
      return {
        status: 200,
        message: "Data kategori pelanggaran berhasil ditemukan",
        data: kategori,
      }
    } catch (error) {
      return {
        status: 500,
        message: "Terjadi kesalahan pada server atau format ID tidak valid",
      }
    }
  },

  create: async ({ body }: any) => {
    try {
      const namaInput = body?.nama?.trim()

      if (!namaInput) {
        return {
          status: 400,
          message: "Nama kategori pelanggaran tidak boleh kosong",
        }
      }

      const allKategori = await KategoriPelanggaranService.getAll()
      const isExist = allKategori.some(
        (k: any) => k.nama.toLowerCase() === namaInput.toLowerCase(),
      )

      if (isExist) {
        return {
          status: 409,
          message: `Kategori pelanggaran '${namaInput}' sudah terdaftar`,
        }
      }

      const kategori = await KategoriPelanggaranService.create(namaInput)
      return {
        status: 201,
        message: "Data kategori pelanggaran berhasil ditambahkan",
        data: kategori,
      }
    } catch (error: any) {
      return {
        status: 400,
        message: error.message || "Data kategori pelanggaran gagal ditambahkan",
      }
    }
  },

  update: async ({ params, body }: any) => {
    try {
      if (!params?.id_kategori_pelanggaran) {
        return {
          status: 400,
          message: "ID kategori pelanggaran wajib diisi",
        }
      }

      const idNumber = Number(params.id_kategori_pelanggaran)
      if (isNaN(idNumber)) {
        return {
          status: 400,
          message: "ID kategori pelanggaran tidak valid",
        }
      }

      if (!body || Object.keys(body).length === 0) {
        return {
          status: 400,
          message: "Minimal satu field harus diisi untuk diperbarui",
        }
      }

      const existingData = await KategoriPelanggaranService.getById(idNumber)
      if (!existingData) {
        return {
          status: 404,
          message: "Data kategori pelanggaran tidak ditemukan",
        }
      }

      const dataToUpdate: any = {}
      if (body.nama !== undefined) {
        const namaInput = body.nama.trim()
        if (!namaInput) {
          return {
            status: 400,
            message: "Nama kategori pelanggaran tidak boleh kosong",
          }
        }
        if (namaInput.toLowerCase() !== existingData.nama.toLowerCase()) {
          const allKategori = await KategoriPelanggaranService.getAll()
          const isNameTaken = allKategori.some(
            (k: any) =>
              k.nama.toLowerCase() === namaInput.toLowerCase() &&
              k.id_kategori_pelanggaran !== idNumber,
          )
          if (isNameTaken) {
            return {
              status: 409,
              message: `Nama kategori '${namaInput}' sudah digunakan oleh data lain`,
            }
          }
        }
        dataToUpdate.nama = namaInput
      }

      if (body.status_delete !== undefined) {
        dataToUpdate.status_delete = Number(body.status_delete)
      }

      const kategori = await KategoriPelanggaranService.update(
        idNumber,
        dataToUpdate,
      )

      return {
        status: 200,
        message: "Data kategori pelanggaran berhasil diperbarui",
        data: kategori,
      }
    } catch (error: any) {
      return {
        status: 400,
        message: error.message || "Data kategori pelanggaran gagal diperbarui",
      }
    }
  },

  delete: async ({ params }: any) => {
    try {
      if (!params?.id_kategori_pelanggaran) {
        return {
          status: 400,
          message: "ID kategori pelanggaran wajib diisi",
        }
      }

      const idNumber = Number(params.id_kategori_pelanggaran)
      const existingData = await KategoriPelanggaranService.getById(idNumber)

      if (!existingData) {
        return {
          status: 404,
          message: "Data kategori pelanggaran tidak ditemukan",
        }
      }

      const kategori = await KategoriPelanggaranService.delete(idNumber)
      return {
        status: 200,
        message: "Data kategori pelanggaran berhasil dihapus",
        data: kategori,
      }
    } catch (error: any) {
      return {
        status: 400,
        message: error.message || "Data kategori pelanggaran gagal dihapus",
      }
    }
  },
}
