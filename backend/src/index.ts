import { Elysia } from "elysia"
import { jwt } from "@elysiajs/jwt"

import  AuthRoutes from "./routes/AuthRoutes"
import UserRoutes from "./routes/UserRoutes"
import JurusanRoutes from "./routes/JurusanRoutes"
import TapelRoutes from "./routes/TapelRoutes"
import KategoriPelanggaranRoutes from "./routes/KategoriPelanggaranRoutes"
import PelanggaranRoutes from "./routes/PelanggaranRoutes"
import KelasRoutes from "./routes/KelasRoutes"
import RiwayatKelasRoutes from "./routes/RiwayatKelasRoutes"
import SiswaRoutes from "./routes/SiswaRoutes"
import PelanggaranSiswaRoutes from "./routes/PelanggaranSiswaRoutes"

import SampahRoutes from "./routes/SampahRoutes"
import ActivityLogRoutes from "./routes/ActivityLogRoutes"

const app = new Elysia()
  .use(
    jwt({
      name: "jwtPlugin",
      secret: process.env.JWT_SECRET || "random-secret-key",
      exp: "1d",
    }),
  )

  .get("/", () => "Hello Anjay")
  .use(AuthRoutes)
  .use(UserRoutes)
  .use(JurusanRoutes)
  .use(TapelRoutes)
  .use(SiswaRoutes)
  .use(KelasRoutes)
  .use(KategoriPelanggaranRoutes)
  .use(PelanggaranRoutes)
  .use(RiwayatKelasRoutes)
  .use(PelanggaranSiswaRoutes)
  .use(SampahRoutes)
  .use(ActivityLogRoutes)
  .listen(5000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
)
