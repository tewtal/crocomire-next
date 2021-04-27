import { useEffect } from 'react'
import { User } from '@prisma/client'
import Router from 'next/router'
import useSWR from 'swr'

export type LoggedInUser = User & { isLoggedIn: boolean }

export interface UserSession {
  user: LoggedInUser,
  mutateUser: any
}

export default function useUser({redirectTo = "", redirectIfFound = false} = {}): UserSession {  
  const { data: user, mutate: mutateUser } = useSWR('/api/auth/user')
  useEffect(() => {
    
    if (!redirectTo || !user) {
      return
    }

    if ((redirectTo !== "" && !redirectIfFound && (!user || !user.isLoggedIn)) || (redirectIfFound && user && user.isLoggedIn)) {
      Router.push(redirectTo)
    }

  }, [user, redirectIfFound, redirectTo])

  return { user, mutateUser }
}