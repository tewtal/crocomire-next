import { NextApiResponse } from 'next';
import { withSession, NextApiSessionRequest } from '../../../lib/session'
import prisma from '../../../lib/prisma'
import Pbkdf2 from 'pbkdf2'
import crypto from 'crypto'


async function hashPassword(password: string) {
  return new Promise<string>(async (resolve, reject) => {
    
    const salt = crypto.randomBytes(4).toString('hex');
    const digest = 'sha1';
    const iterations = 1000;

    await Pbkdf2.pbkdf2(password, salt, iterations, 32, digest, (e, k) => {
      if(e) {
        reject(e);
      } else {
        const newHash = k.toString('hex').substring(0, 40);
        resolve(`pbkdf2:${digest}:${iterations}$${salt}$${newHash}`);
      }      
    });
  })
}

interface SignupFormData {
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
    security: string
}

export default withSession(async (req: NextApiSessionRequest, res: NextApiResponse) => {
    try {
        const form = await req.body as SignupFormData

        if(form.email === "" || form.username === "" || form.password === "") {
            return res.status(422).json({
                status: "error",
                error: "All fields must be properly filled in."
            });      
        }

        if(!form.security.toLowerCase().includes("samus")) {
            return res.status(422).json({
                status: "error",
                error: "The security question answer is invalid."
            });
        }

        const checkUser = await prisma.user.findFirst({ where: { username: form.username }});
        if(checkUser) {
            return res.status(422).json({
                status: "error",
                error: "A user with this username already exists."
            })
        }

        const checkEmail = await prisma.user.findFirst({ where: { email: form.email }});
        if(checkEmail) {
            return res.status(422).json({
                status: "error",
                error: "A user with this email already exists."
            })
        }

        const user = await prisma.user.create({
            data: {
                username: form.username,
                password: await hashPassword(form.password),
                email: form.email,
                flags: "",                    
            }
        });

        const sessionUser = { ...user, password: "", isLoggedIn: true };
        req.session.set('user', sessionUser);
        await req.session.save();
        return res.json(sessionUser);
        
    } catch (error) {
        res.status(500).json({
            status: "error",
            error: error})
    }
})