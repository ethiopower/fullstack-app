import { useState } from 'react'
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  IconButton,
  Link,
  Snackbar,
  Alert,
} from '@mui/material'
import {
  Instagram,
  Facebook,
  YouTube,
  Twitter,
} from '@mui/icons-material'

const socialLinks = [
  { icon: Instagram, url: 'https://instagram.com/fafresh', label: 'Instagram' },
  { icon: Facebook, url: 'https://facebook.com/fafresh', label: 'Facebook' },
  { icon: YouTube, url: 'https://youtube.com/fafresh', label: 'YouTube' },
  { icon: Twitter, url: 'https://twitter.com/fafresh', label: 'Twitter' },
]

const quickLinks = [
  { text: 'About Us', href: '/about' },
  { text: 'FAQs', href: '/faqs' },
  { text: 'Terms & Conditions', href: '/terms' },
  { text: 'Privacy Policy', href: '/privacy' },
  { text: 'Contact Us', href: '/contact' },
  { text: 'Visit Store', href: '/visit' },
]

export function Footer() {
  const [email, setEmail] = useState('')
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  })

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // TODO: Implement newsletter signup
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSnackbar({
        open: true,
        message: 'Thank you for subscribing!',
        severity: 'success',
      })
      setEmail('')
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to subscribe. Please try again.',
        severity: 'error',
      })
    }
  }

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        py: 6,
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand and Location */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              FAFRESH FASHION
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Bringing Ethiopian cultural fashion to Maryland with style and authenticity.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              <strong>Visit Us:</strong><br />
              Inside Global Foods<br />
              13814 Outlet Dr<br />
              Silver Spring, MD 20904
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              <strong>Phone:</strong> (240) 704-9915
            </Typography>
            <Box sx={{ mt: 2 }}>
              {socialLinks.map((social) => (
                <IconButton
                  key={social.label}
                  component="a"
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  sx={{ mr: 1 }}
                >
                  <social.icon />
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Grid container>
              {quickLinks.map((link) => (
                <Grid item xs={6} key={link.text}>
                  <Link
                    href={link.href}
                    color="inherit"
                    sx={{
                      display: 'block',
                      mb: 1,
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    {link.text}
                  </Link>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Newsletter Signup */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom>
              Newsletter
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Subscribe to receive updates about new collections and special offers.
            </Typography>
            <Box
              component="form"
              onSubmit={handleNewsletterSubmit}
              sx={{
                display: 'flex',
                gap: 1,
              }}
            >
              <TextField
                size="small"
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{ flexGrow: 1 }}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }}
              >
                Subscribe
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 4 }}
        >
          © {new Date().getFullYear()} Fafresh Fashion. All rights reserved.
        </Typography>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
} 