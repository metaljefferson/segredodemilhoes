import { prisma } from '../lib/prisma.js'

export class Parceiro {
    async create(parceiro){

        await prisma.parceiro.create({
            data: {
                ...parceiro
            }
        })
    }

    async findAll() {
        // await prisma.parceiro.deleteMany()
        return await prisma.parceiro.findMany();
    }
}