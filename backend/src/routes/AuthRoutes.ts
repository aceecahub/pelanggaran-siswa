import { Elysia, t } from "elysia"
import { AuthController } from "../controller/AuthController"

const authBodySchema = t.Object({
  username: t.String({ minLength: 3, maxLength: 100 }),
  password: t.String({ minLength: 8, maxLength: 100 }),
})

export const AuthRoutes = new Elysia({ prefix: "api/auth" })
  .post("/register", AuthController.register, {
    body: authBodySchema,
  })
  .post("/login", AuthController.login, {
    body: authBodySchema,
  })
export default AuthRoutes
