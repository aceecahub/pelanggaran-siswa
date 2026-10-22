import prisma from "../../prisma/client"

export const JurusanService = {
    getAll: async () => {
        return await prisma.jurusan.findMany({
            where: {
                status_delete: 0
            }
        })
    },
    getById: async (id_jurusan: number) => {
        return await prisma.jurusan.findFirst({
            where: {
                id_jurusan: id_jurusan,
            }
        })
    },
    create: async ( kd_jurusan: string, nama_jurusan: string) => {
        return await prisma.jurusan.create({
            data: {
                kd_jurusan: kd_jurusan,
                nama_jurusan: nama_jurusan,
                status: "aktif",
                status_delete: 0
            }
        })
    },
    update: async (
        id_jurusan: number,
        data: {
            kd_jurusan?: string
            nama_jurusan?: string
            status?: string
            status_delete?: number
        }
    ) => {
        return await prisma.jurusan.update({
            where: {
                id_jurusan: id_jurusan
            },
            data
        })
    },
    delete: async (id_jurusan: number) => {
        return await prisma.jurusan.update({
            where: {
                id_jurusan: id_jurusan
            },
            data: {
                status_delete: 1
            }
        })
    }
}