import prisma from "../../prisma/client"

export const JurusanService = {
    getAll: async () => {
        return await prisma.jurusan.findMany()
    },
    getById: async (id_jurusan: number) => {
        return await prisma.jurusan.findUnique({
            where: {
                id_jurusan: id_jurusan
            }
        })
    },
    create: async (nama_jurusan: string) => {
        return await prisma.jurusan.create({
            data: {
                nama_jurusan,
                status: "aktif",
                status_delete: 0
            }
        })
    },
    update: async (id_jurusan: number, nama_jurusan: string, status_delete: number) => {
        return await prisma.jurusan.update({
            where: {
                id_jurusan
            },
            data: {
                nama_jurusan,
                status: "aktif",
                status_delete
            }
        })
    },
    delete: async (id_jurusan: number) => {
        return await prisma.jurusan.delete({
            where: {
                id_jurusan: id_jurusan
            }
        })
    }
}