import { NextApiResponse } from 'next';
import { withSession, NextApiSessionRequest } from '../../../lib/session'
import prisma from '../../../lib/prisma'
import Pbkdf2 from 'pbkdf2'


async function checkPassword(password: string, hash: string) {
  return new Promise(async (resolve, reject) => {
    try {
      const [meta, salt, origHash] = hash.split("$");
      const [_, digest, iterations] = meta.split(":");
      
      await Pbkdf2.pbkdf2(password, salt, parseInt(iterations), 32, digest, (e, k) => {
        if(e) {
          reject(e);
        } else {
          const newHash = k.toString('hex').substring(0, 40);
          resolve(newHash === origHash);
        }      
      });
    } catch (e) {
      reject({message: "Error when hashing passwords, this should not happen..."});
    }
  })
}

export default withSession(async (req: NextApiSessionRequest, res: NextApiResponse) => {
  const { username, password } = await req.body

  try {
    const user = await prisma.user.findFirst({ where: { 
      username: {
          equals: username,
          mode: "insensitive"
      }
    }});
    
    if(user && (await checkPassword(password, user.password))) {
          const sessionUser = { ...user, password: "", isLoggedIn: true }
          req.session.set('user', sessionUser);
          await req.session.save();
          res.json(sessionUser)
    } else {
        res.status(403).json({message: "Invalid username or password"})
    }
  } catch (error) {
    res.status(500).json(error)
  }
})