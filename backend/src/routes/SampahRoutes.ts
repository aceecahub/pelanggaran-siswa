import { Elysia, t } from "elysia"
import { SampahController } from "../controller/SampahController"

const params = t.Object({
  id_sampah: t.Numeric({ minimum: 1 })
})

export const SampahRoutes = new Elysia({
  prefix: "/api/sampah"
})
  .get("/", SampahController.getAll)
  .get("/:id_sampah", SampahController.getById, {
    params
  })
  .patch("/:id_sampah", SampahController.restore, {
    params
  })
  .delete("/:id_sampah", SampahController.delete, {
    params
  })

export default SampahRoutes