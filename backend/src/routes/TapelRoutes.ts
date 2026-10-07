import { Elysia, t } from "elysia";
import { TapelController } from "../controller/TapelController";

const TapelParams = t.Object({
  id_tahun_ajaran: t.Number(),
});

const TapelBody = t.Object({
  nama: t.String(),
  status: t.String(),
  status_delete: t.Number(),
});

export const TapelRoutes = new Elysia({ prefix: "api/tapel" })
  .get("/", TapelController.getAll)
  .get("/:id_tahun_ajaran", TapelController.getById, { params: TapelParams })
  .post("/", TapelController.create, { body: TapelBody })
  .put("/:id_tahun_ajaran", TapelController.update, {
    params: TapelParams,
    body: TapelBody,
  })
  .delete("/:id_tahun_ajaran", TapelController.delete, { params: TapelParams });

export default TapelRoutes;
