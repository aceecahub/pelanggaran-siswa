import prisma from "../../prisma/client"

export const JurusanService = {
    getAll: async () => {
        return await prisma.jurusan.findMany()
    },
    getById: async (id_jurusan: string) => {
        return await prisma.jurusan.findUnique({
            where: {
                id_jurusan: id_jurusan
            }
        })
    },
    create: async (id_jurusan: string, nama_jurusan: string) => {
        return await prisma.jurusan.create({
            data: {
                id_jurusan: id_jurusan,
                nama_jurusan: nama_jurusan,
                status: "aktif",
            }
        })
    },
    update: async (id_jurusan: string, nama_jurusan: string, status: string, status_delete: number) => {
        return await prisma.jurusan.update({
            where: {
                id_jurusan: id_jurusan
            },
            data: {
                id_jurusan: id_jurusan,
                nama_jurusan: nama_jurusan,
                status: status,
                status_delete: status_delete
            }
        })
    },
    delete: async (id_jurusan: string) => {
        return await prisma.jurusan.delete({
            where: {
                id_jurusan: id_jurusan
            }
        })
    }
}