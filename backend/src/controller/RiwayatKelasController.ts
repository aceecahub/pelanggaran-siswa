import { RiwayatKelasService } from "../service/RiwayatKelasService"
export const RiwayatKelasController = {

  getAll: async () => {
    try {
      const riwayatKelas = await RiwayatKelasService.getAll()
      return {
        status: 200,
        message: "Data riwayat kelas berhasil diambil",
        data: riwayatKelas,
      }
    } catch (error) {
      return { status: 500, message: "Terjadi kesalahan pada server" }
    }
  },

  getById: async ({ params }: any) => {
    try {
      if (!params?.id_riwayat_kelas)
        return { status: 400, message: "ID riwayat kelas wajib diisi" }
      const idInput = Number(params.id_riwayat_kelas)
      if (isNaN(idInput))
        return { status: 400, message: "ID riwayat kelas harus berupa angka" }
      const riwayatKelas = await RiwayatKelasService.getById(idInput)
      if (!riwayatKelas)
        return { status: 404, message: "Data riwayat kelas tidak ditemukan" }
      return {
        status: 200,
        message: "Data riwayat kelas berhasil ditemukan",
        data: riwayatKelas,
      }
    } catch (error) {
      return { status: 500, message: "Terjadi kesalahan pada server" }
    }
  },

  create: async ({ body }: any) => {
    try {
      const idTahunAjaranInput = body?.id_tahun_ajaran
      const idKelasInput = body?.id_kelas
      const nisInput = body?.nis
      if (
        idTahunAjaranInput === undefined ||
        idKelasInput === undefined ||
        nisInput === undefined
      ) {
        return {
          status: 400,
          message:
            "Field id_tahun_ajaran, id_kelas, dan nis tidak boleh kosong",
        }
      }
      const riwayatKelas = await RiwayatKelasService.create(
        Number(idTahunAjaranInput),
        Number(idKelasInput),
        Number(nisInput),
      )
      return {
        status: 201,
        message: "Data riwayat kelas berhasil ditambahkan",
        data: riwayatKelas,
      }
    } catch (error: any) {
      return {
        status: 400,
        message: error.message || "Data riwayat kelas gagal ditambahkan",
      }
    }
  },

  update: async ({ params, body }: any) => {
    try {
      if (!params?.id_riwayat_kelas)
        return { status: 400, message: "ID riwayat kelas wajib diisi" }
      const idParam = Number(params.id_riwayat_kelas)
      if (isNaN(idParam))
        return { status: 400, message: "ID riwayat kelas harus berupa angka" }

      if (!body || Object.keys(body).length === 0) {
        return {
          status: 400,
          message: "Minimal satu field harus diisi untuk diperbarui",
        }
      }

      const existingData = await RiwayatKelasService.getById(idParam)
      if (!existingData)
        return { status: 404, message: "Data riwayat kelas tidak ditemukan" }

      const dataToUpdate: any = {}
      if (body.id_tahun_ajaran !== undefined) dataToUpdate.id_tahun_ajaran = Number(body.id_tahun_ajaran)
      if (body.id_kelas !== undefined) dataToUpdate.id_kelas = Number(body.id_kelas)
      if (body.nis !== undefined) dataToUpdate.nis = Number(body.nis)
      if (body.status_delete !== undefined) dataToUpdate.status_delete = Number(body.status_delete)

      const riwayatKelas = await RiwayatKelasService.update(
        idParam,
        dataToUpdate,
      )
      return {
        status: 200,
        message: "Data riwayat kelas berhasil diperbarui",
        data: riwayatKelas,
      }
    } catch (error: any) {
      return {
        status: 400,
        message: error.message || "Data riwayat kelas gagal diperbarui",
      }
    }
  },

  delete: async ({ params }: any) => {
    try {
      if (!params?.id_riwayat_kelas)
        return { status: 400, message: "ID riwayat kelas wajib diisi" }
      const idParam = Number(params.id_riwayat_kelas)
      if (isNaN(idParam))
        return { status: 400, message: "ID riwayat kelas harus berupa angka" }

      const existingData = await RiwayatKelasService.getById(idParam)
      if (!existingData)
        return { status: 404, message: "Data riwayat kelas tidak ditemukan" }

      const riwayatKelas = await RiwayatKelasService.delete(idParam)
      return {
        status: 200,
        message: "Data riwayat kelas berhasil dihapus",
        data: riwayatKelas,
      }
    } catch (error: any) {
      return {
        status: 400,
        message: error.message || "Data riwayat kelas gagal dihapus",
      }
    }
  },
}
