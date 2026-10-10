
import { ActivityLogService } from "../service/ActivityLogService"

export const ActivityLogController = {
  getAll: async () => {
    try {
      const logs = await ActivityLogService.getAll()

      return {
        status: 200,
        message: "Data activity log berhasil diambil",
        data: logs,
      }
    } catch (error: any) {
      console.error("Gagal mengambil activity log:", error)

      return {
        status: 500,
        message: "Terjadi kesalahan pada server",
      }
    }
  },

  getById: async ({ params }: any) => {
    try {
      const id = Number(params.id_activity_log)

      if (!Number.isSafeInteger(id) || id <= 0) {
        return {
          status: 400,
          message: "ID activity log tidak valid",
        }
      }

      const log = await ActivityLogService.getById(id)

      if (!log) {
        return {
          status: 404,
          message: "Data activity log tidak ditemukan",
        }
      }

      return {
        status: 200,
        message: "Data activity log berhasil ditemukan",
        data: log,
      }
    } catch (error: any) {
      console.error("Gagal mengambil activity log:", error)

      return {
        status: 500,
        message: "Terjadi kesalahan pada server",
      }
    }
  },
}
