import { Elysia, t } from "elysia"
import { PelanggaranController } from "../controller/PelanggaranController"

const pelanggaranParams = t.Object({
  id_pelanggaran: t.Number(),
})

const pelanggaranBody = t.Object({
  id_kategori_pelanggaran: t.Number(),
  nama_pelanggaran: t.String(),
  tingkatan: t.String(),
  bobot_point: t.Number(),
  status_delete: t.Number(),
})

export const PelanggaranRoutes = new Elysia({ prefix: "api/pelanggaran" })
  .get("/", PelanggaranController.getAll)
  .get("/:id_pelanggaran", PelanggaranController.getById, {
    params: pelanggaranParams,
  })
  .post("/", PelanggaranController.create, { body: pelanggaranBody })
  .patch("/:id_pelanggaran", PelanggaranController.update, {
    params: pelanggaranParams,
    body: pelanggaranBody,
  })
  .delete("/:id_pelanggaran", PelanggaranController.delete, {
    params: pelanggaranParams,
  })

export default PelanggaranRoutes