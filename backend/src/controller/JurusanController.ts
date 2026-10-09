import { JurusanService } from "../service/JurusanService"

const parseId = (value: unknown): number | null => {
  if (
    (typeof value !== "string" && typeof value !== "number") ||
    String(value).trim() === ""
  ) {
    return null
  }

  const id = Number(value)

  return Number.isSafeInteger(id) && id > 0 ? id : null
}

export const JurusanController = {
  getAll: async () => {
    try {
      const jurusan = await JurusanService.getAll()

      return {
        status: 200,
        message: "Data jurusan berhasil diambil",
        data: jurusan,
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
      const id = parseId(params?.id_jurusan)

      if (id === null) {
        return {
          status: 400,
          message: "ID jurusan harus berupa angka positif",
        }
      }

      const jurusan = await JurusanService.getById(id)

      if (!jurusan) {
        return {
          status: 404,
          message: "Data jurusan tidak ditemukan",
        }
      }

      return {
        status: 200,
        message: "Data jurusan berhasil ditemukan",
        data: jurusan,
      }
    } catch {
      return {
        status: 500,
        message: "Terjadi kesalahan pada server",
      }
    }
  },

  create: async ({ body }: any) => {
    try {
      const namaInput =
        typeof body?.nama_jurusan === "string"
          ? body.nama_jurusan.trim()
          : ""

      if (!namaInput) {
        return {
          status: 400,
          message: "Nama jurusan tidak boleh kosong",
        }
      }

      const allJurusan = await JurusanService.getAll()

      const isNameExist = allJurusan.some(
        (j: any) =>
          j.nama_jurusan.toLowerCase() === namaInput.toLowerCase()
      )

      if (isNameExist) {
        return {
          status: 409,
          message: `Nama jurusan '${namaInput}' sudah terdaftar`,
        }
      }

      const jurusan = await JurusanService.create(namaInput)

      return {
        status: 201,
        message: "Data jurusan berhasil ditambahkan",
        data: jurusan,
      }
    } catch (error: any) {
      return {
        status: 400,
        message: error.message || "Data jurusan gagal ditambahkan",
      }
    }
  },

  update: async ({ params, body }: any) => {
    try {
      const id = parseId(params?.id_jurusan)

      if (id === null) {
        return {
          status: 400,
          message: "ID jurusan harus berupa angka positif",
        }
      }

      if (!body || Object.keys(body).length === 0) {
        return {
          status: 400,
          message: "Minimal satu field harus diisi untuk diperbarui",
        }
      }

      const existingData = await JurusanService.getById(id)

      if (!existingData) {
        return {
          status: 404,
          message: "Data jurusan tidak ditemukan",
        }
      }

      const dataToUpdate: Record<string, any> = {}

      if (body.nama_jurusan !== undefined) {
        if (typeof body.nama_jurusan !== "string") {
          return {
            status: 400,
            message: "Nama jurusan harus berupa teks",
          }
        }

        const namaInput = body.nama_jurusan.trim()

        if (!namaInput) {
          return {
            status: 400,
            message: "Nama jurusan tidak boleh kosong",
          }
        }

        if (
          namaInput.toLowerCase() !==
          existingData.nama_jurusan.toLowerCase()
        ) {
          const allJurusan = await JurusanService.getAll()

          const isNameTaken = allJurusan.some(
            (j: any) =>
              j.nama_jurusan.toLowerCase() === namaInput.toLowerCase() &&
              j.id_jurusan !== id
          )

          if (isNameTaken) {
            return {
              status: 409,
              message: `Nama jurusan '${namaInput}' sudah digunakan oleh data lain`,
            }
          }
        }

        dataToUpdate.nama_jurusan = namaInput
      }

      if (body.status !== undefined) {
        if (typeof body.status !== "string" || !body.status.trim()) {
          return {
            status: 400,
            message: "Status tidak boleh kosong",
          }
        }

        dataToUpdate.status = body.status.trim()
      }

      if (body.status_delete !== undefined) {
        const statusDelete = Number(body.status_delete)

        if (![0, 1].includes(statusDelete)) {
          return {
            status: 400,
            message: "status_delete hanya boleh bernilai 0 atau 1",
          }
        }

        dataToUpdate.status_delete = statusDelete
      }

      if (Object.keys(dataToUpdate).length === 0) {
        return {
          status: 400,
          message: "Tidak ada field valid untuk diperbarui",
        }
      }

      const jurusan = await JurusanService.update(id, dataToUpdate)

      return {
        status: 200,
        message: "Data jurusan berhasil diperbarui",
        data: jurusan,
      }
    } catch (error: any) {
      return {
        status: 400,
        message: error.message || "Data jurusan gagal diperbarui",
      }
    }
  },

  delete: async ({ params }: any) => {
    try {
      const id = parseId(params?.id_jurusan)

      if (id === null) {
        return {
          status: 400,
          message: "ID jurusan harus berupa angka positif",
        }
      }

      const existingData = await JurusanService.getById(id)

      if (!existingData) {
        return {
          status: 404,
          message: "Data jurusan tidak ditemukan",
        }
      }

      const jurusan = await JurusanService.delete(id)

      return {
        status: 200,
        message: "Data jurusan berhasil dihapus",
        data: jurusan,
      }
    } catch (error: any) {
      return {
        status: 400,
        message: error.message || "Data jurusan gagal dihapus",
      }
    }
  },
}