import { Elysia, t } from "elysia"
import { JurusanController } from "../controller/JurusanController"

const jurusanParams= t.Object({
    id_jurusan: t.Number()
})

const jurusanBody = t.Object({
    nama_jurusan: t.String(),
    status_delete: t.Optional(t.Number())
})

const jurusanUpdateBody = t.Object({
    nama_jurusan: t.Optional(t.String()),
    status: t.Optional(t.String()),
    status_delete: t.Optional(t.Number())
})

export const JurusanRoutes = new Elysia({prefix: "api/jurusan"})
  .get("/", JurusanController.getAll)
  .get("/:id_jurusan", JurusanController.getById, {params: jurusanParams})
  .post("/", JurusanController.create, {body: jurusanBody})
  .patch("/:id_jurusan", JurusanController.update, {params: jurusanParams, body: jurusanUpdateBody})
  .delete("/:id_jurusan", JurusanController.delete, {params: jurusanParams})
export default JurusanRoutes