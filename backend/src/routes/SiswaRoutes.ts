import { Elysia, t } from "elysia"
import { SiswaController } from "../controller/SiswaController"

const siswaParams = t.Object({
  nis: t.String(),
})

const siswaBody = t.Object({
  nis: t.String(),
  nama_siswa: t.String(),
  tgl_lahir: t.String(),
  tempat_lahir: t.String(),
  jk: t.String(),
  no_hp: t.String(),
  agama: t.String(),
  no_hp_ortu: t.String(),
  nama_ayah: t.String(),
  pekerjaan_ayah: t.String(),
  nama_ibu: t.String(),
  pekerjaan_ibu: t.String(),
  alamat_ortu: t.String(),
  alamat: t.String(),
  status_aktif: t.String(),
  status_delete: t.Optional(t.Number())
})

const siswaUpdateBody = t.Object({
  nama_siswa: t.Optional(t.String()),
  tgl_lahir: t.Optional(t.String()),
  tempat_lahir: t.Optional(t.String()),
  jk: t.Optional(t.String()),
  no_hp: t.Optional(t.String()),
  agama: t.Optional(t.String()),
  no_hp_ortu: t.Optional(t.String()),
  nama_ayah: t.Optional(t.String()),
  pekerjaan_ayah: t.Optional(t.String()),
  nama_ibu: t.Optional(t.String()),
  pekerjaan_ibu: t.Optional(t.String()),
  alamat_ortu: t.Optional(t.String()),
  alamat: t.Optional(t.String()),
  status_aktif: t.Optional(t.String()),
  status_delete: t.Optional(t.Number())
})

export const SiswaRoutes = new Elysia({ prefix: "api/siswa" })
  .get("/", SiswaController.getAll)
  .get("/:nis", SiswaController.getById, { params: siswaParams })
  .post("/", SiswaController.create, { body: siswaBody })
  .patch("/:nis", SiswaController.update, {
    params: siswaParams,
    body: siswaUpdateBody,
  })
  .delete("/:nis", SiswaController.delete, { params: siswaParams })

export default SiswaRoutes