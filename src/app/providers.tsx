'use client'

import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import { initAnalytics } from '../lib/analytics'

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initAnalytics()
  }, [])

  return (
    <SessionProvider>
      {children}
      <Toaster />
    </SessionProvider>
  )
} 