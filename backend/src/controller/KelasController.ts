import { KelasService } from "../service/KelasService"

export const KelasController = {
  getAll: async () => {
    try {
      const kelas = await KelasService.getAll()
      return {
        status: 200,
        message: "Data kelas berhasil diambil",
        data: kelas,
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
      if (!params?.id_kelas) {
        return {
          status: 400,
          message: "ID kelas wajib diisi",
        }
      }
      const kelas = await KelasService.getById(params.id_kelas)
      if (!kelas) {
        return {
          status: 404,
          message: "Data kelas tidak ditemukan",
        }
      }
      return {
        status: 200,
        message: "Data kelas berhasil ditemukan",
        data: kelas,
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
      const idJurusanInput = body?.id_jurusan?.trim()
      const namaKelasInput = body?.nama_kelas?.trim()
      if (
        !idJurusanInput ||
        !namaKelasInput
      ) {
        return {
          status: 400,
          message:
            "Semua field (id_kelas, id_jurusan, nama_kelas) wajib diisi",
        }
      }
      const allKelas = await KelasService.getAll()
      const isNameExist = allKelas.some(
        (k: any) => k.nama_kelas.toLowerCase() === namaKelasInput.toLowerCase(),
      )
      if (isNameExist) {
        return {
          status: 409,
          message: `Nama kelas '${namaKelasInput}' sudah terdaftar`,
        }
      }
      const kelas = await KelasService.create(
        idJurusanInput,
        namaKelasInput,
      )
      return {
        status: 201,
        message: "Data kelas berhasil ditambahkan",
        data: kelas,
      }
    } catch (error: any) {
      return {
        status: 400,
        message: error.message || "Data kelas gagal ditambahkan",
      }
    }
  },

  update: async ({ params, body }: any) => {
    try {
      if (!params?.id_kelas) {
        return {
          status: 400,
          message: "ID kelas wajib diisi",
        }
      }
      const idJurusanInput = body?.id_jurusan?.trim()
      const namaKelasInput = body?.nama_kelas?.trim()
      const statusDeleteInput = body?.status_delete
      if (
        !idJurusanInput ||
        !namaKelasInput ||
        statusDeleteInput === undefined
      ) {
        return {
          status: 400,
          message: "Semua field wajib diisi termasuk status_delete",
        }
      }
      const existingData = await KelasService.getById(params.id_kelas)
      if (!existingData) {
        return {
          status: 404,
          message: "Data kelas tidak ditemukan",
        }
      }
      if (
        namaKelasInput.toLowerCase() !== existingData.nama_kelas.toLowerCase()
      ) {
        const allKelas = await KelasService.getAll()
        const isNameTaken = allKelas.some(
          (k: any) =>
            k.nama_kelas.toLowerCase() === namaKelasInput.toLowerCase() &&
            k.id_kelas !== params.id_kelas,
        )
        if (isNameTaken) {
          return {
            status: 409,
            message: `Nama kelas '${namaKelasInput}' sudah digunakan oleh data lain`,
          }
        }
      }
      const kelas = await KelasService.update(
        params.id_kelas,
        idJurusanInput,
        namaKelasInput,
        Number(statusDeleteInput),
      )
      return {
        status: 200,
        message: "Data kelas berhasil diperbarui",
        data: kelas,
      }
    } catch (error: any) {
      return {
        status: 400,
        message: error.message || "Data kelas gagal diperbarui",
      }
    }
  },

  delete: async ({ params }: any) => {
    try {
      if (!params?.id_kelas) {
        return {
          status: 400,
          message: "ID kelas wajib diisi",
        }
      }
      const existingData = await KelasService.getById(params.id_kelas)
      if (!existingData) {
        return {
          status: 404,
          message: "Data kelas tidak ditemukan",
        }
      }
      const kelas = await KelasService.delete(params.id_kelas)
      return {
        status: 200,
        message: "Data kelas berhasil dihapus",
        data: kelas,
      }
    } catch (error: any) {
      return {
        status: 400,
        message: error.message || "Data kelas gagal dihapus",
      }
    }
  },
}
