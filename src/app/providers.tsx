'use client'

import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'react-hot-toast'
import { useEffect, useState } from 'react'
import { initAnalytics } from '../lib/analytics'
import CssBaseline from '@mui/material/CssBaseline'
import { StyledEngineProvider } from '@mui/material'

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    initAnalytics()
  }, [])

  return (
    <StyledEngineProvider injectFirst>
      <SessionProvider>
        <CssBaseline />
        {mounted ? children : null}
        <Toaster />
      </SessionProvider>
    </StyledEngineProvider>
  )
} 