'use client'

import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { AppBar, Toolbar, Button, Box, Container, IconButton, useScrollTrigger, Fab, Zoom } from '@mui/material'
import { KeyboardArrowUp } from '@mui/icons-material'
import { SessionProvider } from 'next-auth/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Toaster } from 'react-hot-toast'
import { Logo } from '@/components/Logo'
import { Footer } from '@/components/Footer'
import dynamic from 'next/dynamic'

const ClientThemeProvider = dynamic(
  () => import('@/components/ClientThemeProvider'),
  { ssr: false }
)

// Create a client
const queryClient = new QueryClient()

function ScrollTop() {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  })

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <Zoom in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 1000,
        }}
      >
        <Fab color="primary" size="small" aria-label="scroll back to top">
          <KeyboardArrowUp />
        </Fab>
      </Box>
    </Zoom>
  )
}

function Header() {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  })

  return (
    <AppBar 
      position="fixed" 
      elevation={trigger ? 4 : 0}
      sx={{
        transition: 'all 0.3s ease-in-out',
        bgcolor: trigger ? 'background.paper' : 'transparent',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Logo sx={{ height: 40, color: trigger ? 'text.primary' : 'white' }} />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              color="inherit" 
              href="#shop"
              sx={{ color: trigger ? 'text.primary' : 'white' }}
            >
              Shop
            </Button>
            <Button 
              color="inherit" 
              href="#contact"
              sx={{ color: trigger ? 'text.primary' : 'white' }}
            >
              Contact Us
            </Button>
            <Button 
              variant="contained" 
              color="primary"
              href="/customize"
              sx={{ ml: 2 }}
            >
              Customize
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export function RootClientWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClientThemeProvider>
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          <Box sx={{ 
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Header />
            <Box 
              component="main" 
              sx={{ 
                pt: { xs: 7, sm: 8 },
                flex: '1 0 auto'
              }}
            >
              {children}
            </Box>
            <Footer />
            <ScrollTop />
            <Toaster position="bottom-right" />
          </Box>
        </QueryClientProvider>
      </SessionProvider>
    </ClientThemeProvider>
  )
} 