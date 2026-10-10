import prisma from "../../prisma/client"

export const UserService = {
  getAll: async () => {
    return await prisma.user.findMany({
      where: { status_delete: 0 },
      select: {
        id_user: true,
        username: true,
        role: true,
      },
    })
  },

  getById: async (id_user: number) => {
    return await prisma.user.findFirst({
      where: {
        id_user,
      },
      select: {
        id_user: true,
        username: true,
        role: true,
      },
    })
  },

  update: async (
    id_user: number,
    dataInput: {
      username?: string
      role?: string
      password?: string
      status_delete?: number
    },
  ) => {
    const existingUser = await prisma.user.findFirst({
      where: {
        id_user,
        status_delete: 0,
      },
    })

    if (!existingUser) {
      throw new Error("User tidak ditemukan")
    }

    if (dataInput.username && dataInput.username.trim() !== "") {
      const duplicateUsername = await prisma.user.findFirst({
        where: {
          username: dataInput.username.trim(),
          id_user: { not: id_user },
          status_delete: 0,
        },
      })

      if (duplicateUsername) {
        throw new Error("Username sudah digunakan")
      }
    }

    const dataToUpdate: any = {}
    if (dataInput.username !== undefined && dataInput.username.trim() !== "") {
      dataToUpdate.username = dataInput.username.trim()
    }
    if (dataInput.role !== undefined && dataInput.role.trim() !== "") {
      dataToUpdate.role = dataInput.role.trim()
    }
    if (dataInput.password !== undefined && dataInput.password.trim() !== "") {
      dataToUpdate.password = await Bun.password.hash(dataInput.password)
    }
    if (dataInput.status_delete !== undefined) {
      dataToUpdate.status_delete = Number(dataInput.status_delete)
    }

    return await prisma.user.update({
      where: { id_user },
      data: dataToUpdate,
      select: {
        id_user: true,
        username: true,
        role: true,
        status_delete: true,
      },
    })
  },

  delete: async (id_user: number) => {
    const existingUser = await prisma.user.findFirst({
      where: {
        id_user,
        status_delete: 0,
      },
    })

    if (!existingUser) {
      throw new Error("User tidak ditemukan")
    }

    return await prisma.user.update({
      where: { id_user },
      data: { status_delete: 1 },
    })
  },
}
