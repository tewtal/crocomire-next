import { NextApiResponse } from 'next';
import { withSession, NextApiSessionRequest } from '../../../lib/session'
import { LoggedInUser } from '../../../lib/useUser'
import prisma from '../../../lib/prisma';

export function validateForm(req: NextApiSessionRequest) {
    try {    
        const formData = JSON.parse(req.body);

        /* Validate name and description fields */
        ['name', 'description'].map(f => {
            if(formData[f] === "") {
                return {
                    code: 422,
                    status: "error",
                    error: `The '${f}' field is missing data.`
                };
            }
        });
        
        return formData;

    } catch (e) {
        return {
            code: 500,
            status: "error",
            error: "Posted data is not valid JSON"
        };
    }
}


export default withSession(async (req: NextApiSessionRequest, res: NextApiResponse) => {
    if(req.method === 'POST') {
        const sessionUser: LoggedInUser = req.session.get("user");
        if(sessionUser && sessionUser.isLoggedIn) { 
            const form = validateForm(req);
            
            const user = await prisma.user.findUnique({ where: { id: sessionUser.id }});
            if(!user) {
                return res.status(401).json({
                    code: 401,
                    status: "error",
                    error: "No such user exists"
                });
            }

            if(form.status === "error") {
                return res.status(form.code).send(form);
            }

            try {
                await prisma.strat.create({
                    data: {
                        userId: user.id,
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
                console.log(e);
                return res.status(500).json({
                    code: 500,
                    status: "error",
                    error: "An error occured when saving the strategy."
                });
            }

        } else {
            return res.status(401).end();
        }
    } else {
        return res.status(400).end();
    }
})
