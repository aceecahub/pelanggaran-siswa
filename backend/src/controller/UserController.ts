import { UserService } from "../service/UserService"

export const UserController = {
  getAll: async () => {
    try {
      const users = await UserService.getAll()

      return {
        status: 200,
        message: "Data user berhasil diambil",
        data: users,
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
      const id_user = Number(params?.id_user)

      if (!params?.id_user || !Number.isInteger(id_user) || id_user <= 0) {
        return {
          status: 400,
          message: "ID user tidak valid",
        }
      }

      const user = await UserService.getById(id_user)

      if (!user) {
        return {
          status: 404,
          message: "Data user tidak ditemukan",
        }
      }

      return {
        status: 200,
        message: "Data user berhasil ditemukan",
        data: user,
      }
    } catch (error) {
      return {
        status: 500,
        message: "Terjadi kesalahan pada server",
      }
    }
  },

  update: async ({ params, body }: any) => {
    try {
      const id_user = Number(params?.id_user)

      if (!Number.isInteger(id_user) || id_user <= 0) {
        return {
          status: 400,
          message: "ID user tidak valid",
        }
      }

      if (Object.keys(body).length === 0) {
        return {
          status: 400,
          message: "Minimal satu field harus diisi",
        }
      }

      const existingUser = await UserService.getById(id_user)

      if (!existingUser) {
        return {
          status: 404,
          message: "Data user tidak ditemukan",
        }
      }

      const user = await UserService.update(id_user, body)

      return {
        status: 200,
        message: "Data user berhasil diperbarui",
        data: user,
      }
    } catch (error: any) {
      if (error.message === "Username sudah digunakan") {
        return {
          status: 409,
          message: error.message,
        }
      }

      return {
        status: 500,
        message: "Data user gagal diperbarui",
      }
    }
  },

  delete: async ({ params }: any) => {
    try {
      const id_user = Number(params?.id_user)

      if (!params?.id_user || !Number.isInteger(id_user) || id_user <= 0) {
        return {
          status: 400,
          message: "ID user tidak valid",
        }
      }

      const existingUser = await UserService.getById(id_user)

      if (!existingUser) {
        return {
          status: 404,
          message: "Data user tidak ditemukan",
        }
      }

      const user = await UserService.delete(id_user)

      return {
        status: 200,
        message: "User berhasil dipindahkan ke sampah",
        data: user,
      }
    } catch (error) {
      return {
        status: 500,
        message: "Data user gagal dihapus",
      }
    }
  },
}
