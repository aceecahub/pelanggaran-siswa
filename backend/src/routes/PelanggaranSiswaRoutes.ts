
import { Elysia, t } from "elysia"
import { PelanggaranSiswaController } from "../controller/PelanggaranSiswaController"

const Params = t.Object({
  id_pelanggaran_siswa: t.Numeric(),
})

const Body = t.Object({
  tgl: t.String(),
  id_tahun_ajaran: t.Number(),
  id_user: t.Number(),
  nama_pelapor: t.String(),
  nis: t.Number(),
  nama_siswa: t.String(),
  id_kelas: t.Number(),
  nama_kelas: t.String(),
  id_kategori_pelanggaran: t.Number(),
  id_pelanggaran: t.Number(),
  nama_pelanggaran: t.String(),
  point: t.Number(),
  catatan: t.String(),
  sanksi: t.String(),
  status_sanksi: t.String(),
})

const UpdateBody = t.Object({
  tgl: t.Optional(t.String()),
  id_tahun_ajaran: t.Optional(t.Number()),
  id_user: t.Optional(t.Number()),
  nama_pelapor: t.Optional(t.String()),
  nis: t.Optional(t.Number()),
  nama_siswa: t.Optional(t.String()),
  id_kelas: t.Optional(t.Number()),
  nama_kelas: t.Optional(t.String()),
  id_kategori_pelanggaran: t.Optional(t.Number()),
  id_pelanggaran: t.Optional(t.Number()),
  nama_pelanggaran: t.Optional(t.String()),
  point: t.Optional(t.Number()),
  catatan: t.Optional(t.String()),
  sanksi: t.Optional(t.String()),
  status_sanksi: t.Optional(t.String()),
  status_delete: t.Optional(t.Number()),
})

export const PelanggaranSiswaRoutes = new Elysia({
  prefix: "/api/pelanggaran-siswa",
})
  .get("/", PelanggaranSiswaController.getAll)
  .get("/:id_pelanggaran_siswa", PelanggaranSiswaController.getById, {
    params: Params,
  })
  .post("/", PelanggaranSiswaController.create, {
    body: Body,
  })
  .patch("/:id_pelanggaran_siswa", PelanggaranSiswaController.update, {
    params: Params,
    body: UpdateBody,
  })
  .delete("/:id_pelanggaran_siswa", PelanggaranSiswaController.delete, {
    params: Params,
  })

export default PelanggaranSiswaRoutes
