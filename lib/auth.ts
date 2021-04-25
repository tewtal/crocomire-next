import { NextApiSessionRequest } from './session'
import { LoggedInUser } from './useUser'
import { PrismaClient } from '@prisma/client'
import prisma from './prisma'

export default async function authenticate(req: NextApiSessionRequest): Promise<LoggedInUser | null> {    

    /* Check user cookie for user authentication */
    const user = await req.session.get('user') as LoggedInUser;    
    if(user && user.isLoggedIn) { 
        return user; 
    }

    return null;
}