'use client'

import { Session } from 'next-auth'
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

interface TestProvidersProps {
  children: ReactNode
  session?: Session | null
}

export function TestProviders({ children, session = null }: TestProvidersProps) {
  return (
    <NextAuthSessionProvider session={session}>
      {children}
    </NextAuthSessionProvider>
  )
} 