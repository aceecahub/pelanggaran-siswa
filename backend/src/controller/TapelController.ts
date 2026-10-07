import { TapelService } from "../service/TapelService"

export const TapelController = {
  getAll: async () => {
    try {
      const tapel = await TapelService.getAll()
      return {
        status: 200,
        message: "Data tahun ajaran berhasil diambil",
        data: tapel,
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
      if (!params?.id_tahun_ajaran) {
        return {
          status: 400,
          message: "ID tahun ajaran wajib diisi",
        }
      }

      const tapel = await TapelService.getById(params.id_tahun_ajaran)
      if (!tapel) {
        return {
          status: 404,
          message: "Data tahun ajaran tidak ditemukan",
        }
      }
      return {
        status: 200,
        message: "Data tahun ajaran berhasil ditemukan",
        data: tapel,
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
      const namaInput = body?.nama?.trim()

      if (!namaInput) {
        return {
          status: 400,
          message: "Nama tahun ajaran tidak boleh kosong",
        }
      }

      const allTapel = await TapelService.getAll()
      const isExist = allTapel.some(
        (t: any) => t.nama.toLowerCase() === namaInput.toLowerCase(),
      )

      if (isExist) {
        return {
          status: 409,
          message: `Tahun ajaran '${namaInput}' sudah terdaftar`,
        }
      }

      const tapel = await TapelService.create(namaInput)
      return {
        status: 201,
        message: "Data tahun ajaran berhasil ditambahkan",
        data: tapel,
      }
    } catch (error: any) {
      return {
        status: 400,
        message: error.message || "Data tahun ajaran gagal ditambahkan",
      }
    }
  },

  update: async ({ params, body }: any) => {
    try {
      if (!params?.id_tahun_ajaran) {
        return {
          status: 400,
          message: "ID tahun ajaran wajib diisi",
        }
      }

      const namaInput = body?.nama?.trim()
      const statusInput = body?.status?.trim()
      const statusDeleteInput = body?.status_delete

      if (!namaInput || !statusInput || statusDeleteInput === undefined) {
        return {
          status: 400,
          message: "Nama, status, dan status_delete wajib diisi",
        }
      }

      const existingData = await TapelService.getById(params.id_tahun_ajaran)
      if (!existingData) {
        return {
          status: 404,
          message: "Data tahun ajaran tidak ditemukan",
        }
      }

      if (namaInput.toLowerCase() !== existingData.nama.toLowerCase()) {
        const allTapel = await TapelService.getAll()
        const isNameTaken = allTapel.some(
          (t: any) =>
            t.nama.toLowerCase() === namaInput.toLowerCase() &&
            t.id_tahun_ajaran !== params.id_tahun_ajaran,
        )
        if (isNameTaken) {
          return {
            status: 409,
            message: `Nama tahun ajaran '${namaInput}' sudah digunakan oleh data lain`,
          }
        }
      }

      const tapel = await TapelService.update(
        params.id_tahun_ajaran,
        namaInput,
        statusInput,
        statusDeleteInput,
      )
      return {
        status: 200,
        message: "Data tahun ajaran berhasil diperbarui",
        data: tapel,
      }
    } catch (error: any) {
      return {
        status: 400,
        message: error.message || "Data tahun ajaran gagal diperbarui",
      }
    }
  },

  delete: async ({ params }: any) => {
    try {
      if (!params?.id_tahun_ajaran) {
        return {
          status: 400,
          message: "ID tahun ajaran wajib diisi",
        }
      }

      const existingData = await TapelService.getById(params.id_tahun_ajaran)
      if (!existingData) {
        return {
          status: 404,
          message: "Data tahun ajaran tidak ditemukan",
        }
      }

      await TapelService.delete(params.id_tahun_ajaran)
      return {
        status: 200,
        message: "Data tahun ajaran berhasil dihapus",
      }
    } catch (error: any) {
      return {
        status: 500,
        message: "Terjadi kesalahan pada server",
      }
    }
  },
}