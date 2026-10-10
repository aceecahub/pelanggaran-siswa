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
      const idNumber = Number(params.id_kelas)
      if (isNaN(idNumber)) {
        return {
          status: 400,
          message: "ID kelas tidak valid",
        }
      }
      const kelas = await KelasService.getById(idNumber)
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
      const namaKelasInput = body?.nama_kelas?.trim()
      if (
        !body?.id_jurusan ||
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
        Number(body.id_jurusan),
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
      const idNumber = Number(params.id_kelas)
      if (isNaN(idNumber)) {
        return {
          status: 400,
          message: "ID kelas tidak valid",
        }
      }
      if (!body || Object.keys(body).length === 0) {
        return {
          status: 400,
          message: "Minimal satu field harus diisi untuk diperbarui",
        }
      }

      const existingData = await KelasService.getById(idNumber)
      if (!existingData) {
        return {
          status: 404,
          message: "Data kelas tidak ditemukan",
        }
      }

      const dataToUpdate: any = {}
      if (body.id_jurusan !== undefined) {
        const idJurusanInput = body.id_jurusan.trim()
        if (!idJurusanInput) {
          return {
            status: 400,
            message: "id_jurusan tidak boleh kosong",
          }
        }
        dataToUpdate.id_jurusan = idJurusanInput
      }

      if (body.nama_kelas !== undefined) {
        const namaKelasInput = body.nama_kelas.trim()
        if (!namaKelasInput) {
          return {
            status: 400,
            message: "nama_kelas tidak boleh kosong",
          }
        }
        if (
          namaKelasInput.toLowerCase() !== existingData.nama_kelas.toLowerCase()
        ) {
          const allKelas = await KelasService.getAll()
          const isNameTaken = allKelas.some(
            (k: any) =>
              k.nama_kelas.toLowerCase() === namaKelasInput.toLowerCase() &&
              k.id_kelas !== idNumber,
          )
          if (isNameTaken) {
            return {
              status: 409,
              message: `Nama kelas '${namaKelasInput}' sudah digunakan oleh data lain`,
            }
          }
        }
        dataToUpdate.nama_kelas = namaKelasInput
      }

      if (body.status_delete !== undefined) {
        dataToUpdate.status_delete = Number(body.status_delete)
      }

      const kelas = await KelasService.update(idNumber, dataToUpdate)
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
      const idNumber = Number(params.id_kelas)
      if (isNaN(idNumber)) {
        return {
          status: 400,
          message: "ID kelas tidak valid",
        }
      }
      const existingData = await KelasService.getById(idNumber)
      if (!existingData) {
        return {
          status: 404,
          message: "Data kelas tidak ditemukan",
        }
      }
      const kelas = await KelasService.delete(idNumber)
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
