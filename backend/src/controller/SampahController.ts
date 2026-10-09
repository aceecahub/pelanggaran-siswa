import { SampahService } from "../service/SampahService"

const parseId = (value: unknown): number | null => {
  const id = Number(value)

  return Number.isSafeInteger(id) && id > 0 ? id : null
}

export const SampahController = {
  getAll: async () => {
    try {
      const data = await SampahService.getAll()

      return {
        status: 200,
        message: "Data sampah berhasil diambil",
        data
      }
    } catch {
      return {
        status: 500,
        message: "Gagal mengambil data sampah"
      }
    }
  },

  getById: async ({ params }: any) => {
    try {
      const id = parseId(params?.id_sampah)

      if (id === null) {
        return {
          status: 400,
          message: "ID sampah harus berupa angka positif"
        }
      }

      const data = await SampahService.getById(id)

      if (!data) {
        return {
          status: 404,
          message: "Data sampah tidak ditemukan"
        }
      }

      return {
        status: 200,
        message: "Data sampah berhasil ditemukan",
        data
      }
    } catch {
      return {
        status: 500,
        message: "Terjadi kesalahan pada server"
      }
    }
  },

  restore: async ({ params }: any) => {
    try {
      const id = parseId(params?.id_sampah)

      if (id === null) {
        return {
          status: 400,
          message: "ID sampah tidak valid"
        }
      }

      const data = await SampahService.getById(id)

      if (!data) {
        return {
          status: 404,
          message: "Data sampah tidak ditemukan"
        }
      }

      if (data.aksi !== "pending") {
        return {
          status: 400,
          message: "Hanya data pending yang dapat direstore"
        }
      }

      const result = await SampahService.restore(id)

      return {
        status: 200,
        message: "Data berhasil direstore",
        data: result
      }
    } catch (error: any) {
      return {
        status: 500,
        message: error.message || "Gagal merestore data"
      }
    }
  },

  delete: async ({ params }: any) => {
    try {
      const id = parseId(params?.id_sampah)

      if (id === null) {
        return {
          status: 400,
          message: "ID sampah tidak valid"
        }
      }

      const data = await SampahService.getById(id)

      if (!data) {
        return {
          status: 404,
          message: "Data sampah tidak ditemukan"
        }
      }

      if (data.aksi !== "pending") {
        return {
          status: 400,
          message: "Hanya data pending yang dapat dihapus permanen"
        }
      }

      const result = await SampahService.delete(id)

      return {
        status: 200,
        message: "Data sampah dan data terkait berhasil dihapus permanen",
        data: result
      }
    } catch (error: any) {
      return {
        status: 500,
        message: error.message || "Gagal menghapus data permanen"
      }
    }
  }
}