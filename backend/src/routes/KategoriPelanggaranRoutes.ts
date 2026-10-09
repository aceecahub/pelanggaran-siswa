import { Elysia, t } from "elysia";
import { KategoriPelanggaranController } from "../controller/KategoriPelanggaranController";

const KategoriPelanggaranParams = t.Object({
  id_kategori_pelanggaran: t.Number(),
});

const KategoriPelanggaranBody = t.Object({
  nama: t.String(),
  status_delete: t.Optional(t.Number()),
});

const KategoriPelanggaranUpdateBody = t.Object({
  nama: t.Optional(t.String()),
  status_delete: t.Optional(t.Number()),
});

export const KategoriPelanggaranRoutes = new Elysia({
  prefix: "api/kategori-pelanggaran",
})
  .get("/", KategoriPelanggaranController.getAll)
  .get("/:id_kategori_pelanggaran", KategoriPelanggaranController.getById, {
    params: KategoriPelanggaranParams,
  })
  .post("/", KategoriPelanggaranController.create, {
    body: KategoriPelanggaranBody,
  })
  .patch("/:id_kategori_pelanggaran", KategoriPelanggaranController.update, {
    params: KategoriPelanggaranParams,
    body: KategoriPelanggaranUpdateBody,
  })
  .delete("/:id_kategori_pelanggaran", KategoriPelanggaranController.delete, {
    params: KategoriPelanggaranParams,
  });

export default KategoriPelanggaranRoutes;
