import { SiswaService } from "../service/SiswaService"
export const SiswaController = {
  getAll: async () => {
    try {
      const siswa = await SiswaService.getAll()
      return {
        status: 200,
        message: "Data siswa berhasil diambil",
        data: siswa,
      }
    } catch (error) {
      return { status: 500, message: "Terjadi kesalahan pada server" }
    }
  },

  getById: async ({ params }: any) => {
    try {
      if (!params?.nis) return { status: 400, message: "NIS wajib diisi" }
      const nisInput = Number(params.nis)
      if (isNaN(nisInput))
        return { status: 400, message: "NIS harus berupa angka" }
      const siswa = await SiswaService.getById(nisInput)
      if (!siswa) return { status: 404, message: "Data siswa tidak ditemukan" }
      return {
        status: 200,
        message: "Data siswa berhasil ditemukan",
        data: siswa,
      }
    } catch (error) {
      return { status: 500, message: "Terjadi kesalahan pada server" }
    }
  },

  create: async ({ body }: any) => {
    try {
      const {
        nis,
        nama_siswa,
        tgl_lahir,
        tempat_lahir,
        jk,
        no_hp,
        agama,
        no_hp_ortu,
        nama_ayah,
        pekerjaan_ayah,
        nama_ibu,
        pekerjaan_ibu,
        alamat_ortu,
        alamat,
        status_aktif,
      } = body
      if (
        !nis ||
        !nama_siswa ||
        !tgl_lahir ||
        !tempat_lahir ||
        !jk ||
        !status_aktif
      )
        return { status: 400, message: "Field utama siswa wajib diisi" }
      const nisInput = Number(nis)
      if (isNaN(nisInput))
        return { status: 400, message: "NIS harus berupa angka" }
      const existingData = await SiswaService.getById(nisInput)
      if (existingData)
        return {
          status: 409,
          message: `Siswa dengan NIS '${nis}' sudah terdaftar`,
        }
      const siswa = await SiswaService.create(
        nisInput,
        nama_siswa?.trim(),
        new Date(tgl_lahir),
        tempat_lahir?.trim(),
        jk?.trim(),
        no_hp?.trim(),
        agama?.trim(),
        no_hp_ortu?.trim(),
        nama_ayah?.trim(),
        pekerjaan_ayah?.trim(),
        nama_ibu?.trim(),
        pekerjaan_ibu?.trim(),
        alamat_ortu?.trim(),
        alamat?.trim(),
        status_aktif?.trim(),
      )
      return {
        status: 201,
        message: "Data siswa berhasil ditambahkan",
        data: siswa,
      }
    } catch (error: any) {
      return {
        status: 400,
        message: error.message || "Data siswa gagal ditambahkan",
      }
    }
  },

  update: async ({ params, body }: any) => {
    try {
      if (!params?.nis)
        return { status: 400, message: "NIS pada parameter wajib diisi" }
      const nisParam = Number(params.nis)
      if (isNaN(nisParam))
        return { status: 400, message: "NIS harus berupa angka" }

      if (!body || Object.keys(body).length === 0) {
        return {
          status: 400,
          message: "Minimal satu field harus diisi untuk diperbarui",
        }
      }

      const existingData = await SiswaService.getById(nisParam)
      if (!existingData)
        return { status: 404, message: "Data siswa tidak ditemukan" }

      const dataToUpdate: any = {}
      if (body.nama_siswa !== undefined) dataToUpdate.nama_siswa = body.nama_siswa.trim()
      if (body.tgl_lahir !== undefined) dataToUpdate.tgl_lahir = new Date(body.tgl_lahir)
      if (body.tempat_lahir !== undefined) dataToUpdate.tempat_lahir = body.tempat_lahir.trim()
      if (body.jk !== undefined) dataToUpdate.jk = body.jk.trim()
      if (body.no_hp !== undefined) dataToUpdate.no_hp = body.no_hp.trim()
      if (body.agama !== undefined) dataToUpdate.agama = body.agama.trim()
      if (body.no_hp_ortu !== undefined) dataToUpdate.no_hp_ortu = body.no_hp_ortu.trim()
      if (body.nama_ayah !== undefined) dataToUpdate.nama_ayah = body.nama_ayah.trim()
      if (body.pekerjaan_ayah !== undefined) dataToUpdate.pekerjaan_ayah = body.pekerjaan_ayah.trim()
      if (body.nama_ibu !== undefined) dataToUpdate.nama_ibu = body.nama_ibu.trim()
      if (body.pekerjaan_ibu !== undefined) dataToUpdate.pekerjaan_ibu = body.pekerjaan_ibu.trim()
      if (body.alamat_ortu !== undefined) dataToUpdate.alamat_ortu = body.alamat_ortu.trim()
      if (body.alamat !== undefined) dataToUpdate.alamat = body.alamat.trim()
      if (body.status_aktif !== undefined) dataToUpdate.status_aktif = body.status_aktif.trim()
      if (body.status_delete !== undefined) dataToUpdate.status_delete = Number(body.status_delete)

      const siswa = await SiswaService.update(nisParam, dataToUpdate)
      return {
        status: 200,
        message: "Data siswa berhasil diperbarui",
        data: siswa,
      }
    } catch (error: any) {
      return {
        status: 400,
        message: error.message || "Data siswa gagal diperbarui",
      }
    }
  },

  delete: async ({ params }: any) => {
    try {
      if (!params?.nis) return { status: 400, message: "NIS wajib diisi" }
      const nisParam = Number(params.nis)
      const existingData = await SiswaService.getById(nisParam)
      if (!existingData)
        return { status: 404, message: "Data siswa tidak ditemukan" }
      const siswa = await SiswaService.delete(nisParam)
      return {
        status: 200,
        message: "Data siswa berhasil dihapus",
        data: siswa,
      }
    } catch (error: any) {
      return {
        status: 400,
        message: error.message || "Data siswa gagal dihapus",
      }
    }
  },
}
