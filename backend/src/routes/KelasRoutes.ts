import { Elysia, t } from "elysia"
import { KelasController } from "../controller/KelasController"

const kelasParams = t.Object({
  id_kelas: t.String(),
})

const kelasBody = t.Object({
  id_jurusan: t.String(),
  nama_kelas: t.String(),
  status_delete: t.Optional(t.Number()),
})

const kelasUpdateBody = t.Object({
  id_jurusan: t.Optional(t.String()),
  nama_kelas: t.Optional(t.String()),
  status_delete: t.Optional(t.Number()),
})

export const KelasRoutes = new Elysia({ prefix: "api/kelas" })
  .get("/", KelasController.getAll)
  .get("/:id_kelas", KelasController.getById, { params: kelasParams })
  .post("/", KelasController.create, { body: kelasBody })
  .patch("/:id_kelas", KelasController.update, {
    params: kelasParams,
    body: kelasUpdateBody,
  })
  .delete("/:id_kelas", KelasController.delete, { params: kelasParams })

export default KelasRoutes