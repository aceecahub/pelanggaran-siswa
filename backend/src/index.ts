import { Elysia } from "elysia"
import JurusanRoutes from "./routes/JurusanRoutes"
import TapelRoutes from "./routes/TapelRoutes"
import KategoriPelanggaranRoutes from "./routes/KategoriPelanggaranRoutes"

const app = new Elysia()
.get("/", () => "Hello Anjay")
.use(JurusanRoutes)
.use(TapelRoutes)
.use(KategoriPelanggaranRoutes)
.listen(5000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
