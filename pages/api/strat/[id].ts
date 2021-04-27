import { NextApiResponse } from 'next';
import { withSession, NextApiSessionRequest } from '../../../lib/session'
import { LoggedInUser } from '../../../lib/useUser'
import { validateForm, validateAndCreateRoom } from './index'
import prisma from '../../../lib/prisma';

async function validateUserAndStrat(stratId: number, userId: number) {
    const user = await prisma.user.findUnique({ where: { id: userId }});
    const strat = await prisma.strat.findUnique({ where: { id: stratId }});

    if(!user) {
        return {
            code: 401,
            status: "error",
            error: "No such user exists."
        };
    }

    if(!strat) {
        return {
            code: 404,
            status: "error",
            error: "There is no such strategy to modify."
        };
    }

    if(user.id !== strat.userId && !user.flags.includes("m")) {
        return {
            code: 403,
            status: "error",
            error: "You are not allowed to modify this strategy."
        };
    }

    return null;
}

export default withSession(async (req: NextApiSessionRequest, res: NextApiResponse) => {
    const stratId = parseInt(req.query.id as string);
    const sessionUser: LoggedInUser = req.session.get("user");
        
    if(isNaN(stratId)) {
        return res.status(404).end();
    }

    if(req.method === 'POST') {
        if(sessionUser && sessionUser.isLoggedIn) {
            
            const form = validateForm(req);
            if(form.status === "error") {
                return res.status(form.code).send(form);
            }

            const error = await validateUserAndStrat(stratId, sessionUser.id);
            if(error) {
                return res.status(error.code).send(error);
            }

            let roomId = parseInt(form.roomId);
            if(roomId === 0) {
                const newRoom = await validateAndCreateRoom(form);
                if(newRoom) {
                    roomId = newRoom.id;
                } else {
                    return res.status(500).json({
                        code: 500,
                        status: "error",
                        error: "Could not create new room"
                    });
                }
            }

            try {
                await prisma.strat.update({
                    where: { id: stratId },
                    data: {
                        userId: sessionUser.id,
                        gameId: 1,
                        areaId: parseInt(form.areaId),
                        roomId: parseInt(form.roomId),
                        categoryId: parseInt(form.categoryId),
                        name: form.name,
                        description: form.description,
                        difficulty: parseInt(form.difficulty),
                        link: form.link    
                    }
                });

                return res.status(200).json({
                    code: 200,
                    status: "ok"
                });

            } catch (e) {
                return res.status(500).json({
                    code: 500,
                    status: "error",
                    error: "An error occured when saving the strategy."
                });
            }

        } else {
            return res.status(401).end();
        }
    } else if(req.method === "DELETE") {
        if(sessionUser && sessionUser.isLoggedIn) {        
            
            const error = await validateUserAndStrat(stratId, sessionUser.id);
            if(error) {
                return res.status(error.code).send(error);
            }

            try {
                await prisma.strat.delete({ where: { id: stratId } });
                return res.status(200).json({
                    code: 200,
                    status: "ok"
                });                
            } catch (e) {
                return res.status(500).json({
                    code: 500,
                    status: "error",
                    error: "An error occured when deleting the strategy."
                });
            }
        }
    } else {
        const strat = await prisma.strat.findUnique({ where: { id: stratId }});
        if(strat) {
            return res.status(200).send(strat);
        } else {
            return res.status(404).end();
        }
    }
})
