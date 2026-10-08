import { Elysia } from "elysia"
import JurusanRoutes from "./routes/JurusanRoutes"
import TapelRoutes from "./routes/TapelRoutes"
import KategoriPelanggaranRoutes from "./routes/KategoriPelanggaranRoutes"
import PelanggaranRoutes from "./routes/PelanggaranRoutes"
import KelasRoutes from "./routes/KelasRoutes"
import RiwayatKelasRoutes from "./routes/RiwayatKelasRoutes"
import SiswaRoutes from "./routes/SiswaRoutes"

const app = new Elysia()
.get("/", () => "Hello Anjay")
.use(JurusanRoutes)
.use(TapelRoutes)
.use(SiswaRoutes)
.use(KelasRoutes)
.use(KategoriPelanggaranRoutes)
.use(PelanggaranRoutes)
.use(RiwayatKelasRoutes)
.listen(5000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
