import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import TikTokIcon from '@mui/icons-material/MusicNote'; // Using MusicNote as TikTok icon
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { colors } from '@/lib/theme';

const quickLinks = [
  { title: 'FAQs', href: '/faqs' },
  { title: 'About Us', href: '/about' },
  { title: 'Terms', href: '/terms' },
  { title: 'Shipping', href: '/shipping' },
  { title: 'Returns', href: '/returns' },
];

const socialLinks = [
  {
    icon: <InstagramIcon />,
    href: 'https://instagram.com/fafresh',
    label: 'Instagram',
  },
  {
    icon: <TikTokIcon />,
    href: 'https://tiktok.com/@fafresh',
    label: 'TikTok',
  },
  {
    icon: <YouTubeIcon />,
    href: 'https://youtube.com/@fafresh',
    label: 'YouTube',
  },
];

export default function Footer() {
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
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
                variant="outlined"
                size="small"
                fullWidth
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
          sx={{ mt: 4, color: 'rgba(255, 255, 255, 0.7)' }}
        >
          © {new Date().getFullYear()} Fafresh Fashion. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
} 