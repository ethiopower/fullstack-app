'use client'

import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

interface TestProvidersProps {
  children: ReactNode
  session?: Session | null
}

export function TestProviders({ children, session = null }: TestProvidersProps) {
  return (
    <SessionProvider session={session} refetchInterval={0}>
      {children}
    </SessionProvider>
  )
} 