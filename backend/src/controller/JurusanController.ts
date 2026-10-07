import { JurusanService } from "../service/JurusanService";

export const JurusanController = {
  getAll: async () => {
    try {
      const jurusan = await JurusanService.getAll();
      return {
        status: 200,
        message: "Data jurusan berhasil diambil",
        data: jurusan,
      };
    } catch (error) {
      return {
        status: 500,
        message: "Terjadi kesalahan pada server",
      };
    }
  },

  getById: async ({ params }: any) => {
    try {
      if (!params?.id_jurusan) {
        return {
          status: 400,
          message: "ID jurusan wajib diisi",
        };
      }

      const idNumber = Number(params.id_jurusan);
      const jurusan = await JurusanService.getById(idNumber);

      if (!jurusan) {
        return {
          status: 404,
          message: "Data jurusan tidak ditemukan",
        };
      }
      return {
        status: 200,
        message: "Data jurusan berhasil ditemukan",
        data: jurusan,
      };
    } catch (error) {
      return {
        status: 500,
        message: "Terjadi kesalahan pada server",
      };
    }
  },

  create: async ({ body }: any) => {
    try {
      const namaInput = body?.nama_jurusan?.trim();

      if (!namaInput) {
        return {
          status: 400,
          message: "Nama jurusan tidak boleh kosong",
        };
      }

      const allJurusan = await JurusanService.getAll();
      const isExist = allJurusan.some(
        (j: any) => j.nama_jurusan.toLowerCase() === namaInput.toLowerCase(),
      );

      if (isExist) {
        return {
          status: 409,
          message: `Jurusan '${namaInput}' sudah terdaftar`,
        };
      }

      const jurusan = await JurusanService.create(namaInput);
      return {
        status: 201,
        message: "Data jurusan berhasil ditambahkan",
        data: jurusan,
      };
    } catch (error: any) {
      return {
        status: 400,
        message: error.message || "Data jurusan gagal ditambahkan",
      };
    }
  },

  update: async ({ params, body }: any) => {
    try {
      if (!params?.id_jurusan) {
        return {
          status: 400,
          message: "ID jurusan wajib diisi",
        };
      }

      const idNumber = Number(params.id_jurusan);
      const namaInput = body?.nama_jurusan?.trim();
      const statusDeleteInput = body?.status_delete;

      if (!namaInput || statusDeleteInput === undefined) {
        return {
          status: 400,
          message: "Nama jurusan dan status_delete wajib diisi",
        };
      }

      const existingData = await JurusanService.getById(idNumber);
      if (!existingData) {
        return {
          status: 404,
          message: "Data jurusan tidak ditemukan",
        };
      }

      if (namaInput.toLowerCase() !== existingData.nama_jurusan.toLowerCase()) {
        const allJurusan = await JurusanService.getAll();
        const isNameTaken = allJurusan.some(
          (j: any) =>
            j.nama_jurusan.toLowerCase() === namaInput.toLowerCase() &&
            j.id_jurusan !== idNumber,
        );
        if (isNameTaken) {
          return {
            status: 409,
            message: `Nama jurusan '${namaInput}' sudah digunakan oleh data lain`,
          };
        }
      }

      const jurusan = await JurusanService.update(
        idNumber,
        namaInput,
        Number(statusDeleteInput),
      );

      return {
        status: 200,
        message: "Data jurusan berhasil diperbarui",
        data: jurusan,
      };
    } catch (error: any) {
      return {
        status: 400,
        message: error.message || "Data jurusan gagal diperbarui",
      };
    }
  },

  delete: async ({ params }: any) => {
    try {
      if (!params?.id_jurusan) {
        return {
          status: 400,
          message: "ID jurusan wajib diisi",
        };
      }

      const idNumber = Number(params.id_jurusan);
      const existingData = await JurusanService.getById(idNumber);

      if (!existingData) {
        return {
          status: 404,
          message: "Data jurusan tidak ditemukan",
        };
      }

      const jurusan = await JurusanService.delete(idNumber);
      return {
        status: 200,
        message: "Data jurusan berhasil dihapus",
        data: jurusan,
      };
    } catch (error: any) {
      return {
        status: 400,
        message: error.message || "Data jurusan gagal dihapus",
      };
    }
  },
};
