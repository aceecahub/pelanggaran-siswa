import { Elysia, t } from "elysia"
import { UserController } from "../controller/UserController"
import { password } from "bun"

const userParams = t.Object({
  id_user: t.Number(),
})

const userBody = t.Object({
  username: t.Optional(t.String({ minLength: 3 })),
  password: t.Optional(t.String({ minLength: 8 })),
  role: t.Optional(t.String({ minLength: 1 })),
  status_delete: t.Optional(t.Number()),
})

export const userRoutes = new Elysia({ prefix: "api/user" })
  .get("/", UserController.getAll)
  .get("/:id_user", UserController.getById, { params: userParams })
  .patch("/:id_user", UserController.update, {
    params: userParams,
    body: userBody,
  })
  .delete("/:id_user", UserController.delete, { params: userParams })

export default userRoutes