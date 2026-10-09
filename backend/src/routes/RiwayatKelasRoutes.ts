import { Elysia, t } from "elysia"
import { RiwayatKelasController } from "../controller/RiwayatKelasController"

const riwayatKelasParams = t.Object({
  id_riwayat_kelas: t.String(),
})

const riwayatKelasBody = t.Object({
  id_tahun_ajaran: t.Number(),
  id_kelas: t.Number(),
  nis: t.Number(),
  status_delete: t.Optional(t.Number()),
})

const riwayatKelasUpdateBody = t.Object({
  id_tahun_ajaran: t.Optional(t.Number()),
  id_kelas: t.Optional(t.Number()),
  nis: t.Optional(t.Number()),
  status_delete: t.Optional(t.Number()),
})

export const RiwayatKelasRoutes = new Elysia({ prefix: "api/riwayat-kelas" })
  .get("/", RiwayatKelasController.getAll)
  .get("/:id_riwayat_kelas", RiwayatKelasController.getById, {
    params: riwayatKelasParams,
  })
  .post("/", RiwayatKelasController.create, { body: riwayatKelasBody })
  .patch("/:id_riwayat_kelas", RiwayatKelasController.update, {
    params: riwayatKelasParams,
    body: riwayatKelasUpdateBody,
  })
  .delete("/:id_riwayat_kelas", RiwayatKelasController.delete, {
    params: riwayatKelasParams,
  })

export default RiwayatKelasRoutes