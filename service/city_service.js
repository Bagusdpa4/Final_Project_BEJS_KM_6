const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

const get = async (params) => {
    try {
        return await prisma.city.findMany(
            {
                where: {
                    name: {
                        contains: params
                    }
                },
                select: {
                    id: true,
                    name: true,
                    code: true,
                    airport_name: true,
                    country: {
                        select: {
                            name : true
                        }
                    }
                }

            }
        );
    } catch (error) {
        throw error
    }
}

module.exports = {
    get,
}