import { AuthService } from "../service/AuthService"

export const AuthController = {
  register: async ({ body }: any) => {
    try {
      const user = await AuthService.register(body.username, body.password)

      return {
        message: "Registrasi berhasil",
        data: user,
      }
    } catch (error) {
      throw error
    }
  },

  login: async ({ body }: any) => {
    const result = await AuthService.login(body.username, body.password)

    return {
      message: "Login berhasil",
      data: result,
    }
  },
}
