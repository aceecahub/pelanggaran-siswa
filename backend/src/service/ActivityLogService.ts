
import prisma from "../../prisma/client"

export const ActivityLogService = {
  getAll: async () => {
    return await prisma.activityLog.findMany({
      where: {
        satatus_delete: 0,
      },
      include: {
        user: {
          select: {
            id_user: true,
            username: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    })
  },

  getById: async (id_activity_log: number) => {
    return await prisma.activityLog.findFirst({
      where: {
        id_activity_log,
      },
      include: {
        user: {
          select: {
            id_user: true,
            username: true,
          },
        },
      },
    })
  },

  create: async (data: {
    id_user: number
    aksi: string
    nama_tabel: string
    record_id: number
    deskripsi: string
  }) => {
    return await prisma.activityLog.create({
      data: {
        ...data,
        satatus_delete: 0,
      },
    })
  },
}
