import { Elysia, t } from "elysia"
import { ActivityLogController } from "../controller/ActivityLogController"

const logParams = t.Object({
  id_activity_log: t.Number(),
})

export const ActivityLogRoutes = new Elysia({
  prefix: "/api/activity-log",
})
  .get("/", ActivityLogController.getAll)
  .get("/:id_activity_log", ActivityLogController.getById, {params: logParams})

export default ActivityLogRoutes
