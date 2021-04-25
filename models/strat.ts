import prisma, { ReturnTypeAsync } from '../lib/prisma'

export async function getAllStrats() {
    const allStrats = await prisma.strat.findMany({
        include: {
            area: true,
            room: true,
            category: true,
            user: {
                select: {
                    username: true
                }
            }
        }
    });
    
    return allStrats;
}

export async function getStratById(id: number) {    
    
    if(isNaN(id)) {
        return null;
    }

    const strat = await prisma.strat.findUnique({
        where: {
            id: id
        },
        include: {
            area: true,
            room: true,
            category: true,
            user: {
                select: {
                    username: true
                }
            }
        }
    });
    
    return strat;
}

export type GetAllStrats = ReturnTypeAsync<typeof getAllStrats>
export type GetStratById = ReturnTypeAsync<typeof getStratById>

