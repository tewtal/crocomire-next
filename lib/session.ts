import { withIronSession } from 'next-iron-session'
import { NextApiRequest, GetServerSidePropsContext } from 'next';
import { IncomingMessage } from 'http';
import { Session } from 'next-iron-session';

export type NextApiSessionRequest = NextApiRequest & {
  session: Session
}

export type GetServerSidePropsSessionContext = Omit<GetServerSidePropsContext, 'req'> & {
  req: IncomingMessage &
  {
    cookies: { [key: string]: string }
    session: Session
  }
}

export function withSession(handler: any) {
  return withIronSession(handler, {
    password: process.env.SECRET_COOKIE_PASSWORD || "",
    cookieName: 'crocomire-session-auth',
    cookieOptions: {
      // the next line allows to use the session in non-https environments like
      // Next.js dev mode (http://localhost:3000)
      secure: process.env.NODE_ENV === 'production' ? true : false,
    },
  })
}