import { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  IconButton,
  Link,
  Stack,
  InputAdornment,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon,
  MusicNote as TikTokIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { colors } from '@/lib/theme';

const INSTAGRAM_URL = 'https://www.instagram.com/fafresh.cultural.fashion/';

const socialLinks = [
  {
    label: 'Instagram',
    href: INSTAGRAM_URL,
    icon: <InstagramIcon />,
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@fafreshfashion505',
    icon: <YouTubeIcon />,
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@fafresh.cultural.fashion',
    icon: <TikTokIcon />,
  },
];

const quickLinks = [
  { title: 'About Us', href: '/about' },
  { title: 'Shop', href: '/shop' },
  { title: 'Customize', href: '/customize' },
  { title: 'Contact', href: '/contact' },
  { title: 'Visit Store', href: '/visit' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      setSnackbar({
        open: true,
        message: 'Thank you for subscribing!',
        severity: 'success',
      });
      setEmail('');
    } catch (error) {
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Failed to subscribe',
        severity: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: colors.black,
        color: colors.white,
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Social Links */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Connect With Us
            </Typography>
            <Stack direction="row" spacing={1}>
              {socialLinks.map((social) => (
                <IconButton
                  key={social.label}
                  component="a"
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: colors.white,
                    '&:hover': {
                      color: colors.yellow,
                    },
                  }}
                  aria-label={social.label}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Quick Links
            </Typography>
            <Stack spacing={1}>
              {quickLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  sx={{
                    color: colors.white,
                    textDecoration: 'none',
                    '&:hover': {
                      color: colors.yellow,
                    },
                  }}
                >
                  {link.title}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Newsletter */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Stay Updated
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
                placeholder="Enter email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                size="small"
                fullWidth
                required
                disabled={isSubmitting}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: colors.white,
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: colors.yellow,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: colors.yellow,
                    },
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        type="submit"
                        edge="end"
                        disabled={isSubmitting}
                        sx={{
                          color: colors.yellow,
                          '&:hover': {
                            color: colors.white,
                          },
                        }}
                      >
                        <ArrowForwardIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Typography
          variant="body2"
          align="center"
          sx={{ mt: 4, opacity: 0.7 }}
        >
          © {new Date().getFullYear()} Fafresh Fashion. All rights reserved.
        </Typography>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
} 