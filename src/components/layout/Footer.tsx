'use client';

import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Stack,
  Link as MuiLink
} from '@mui/material';
import NextLink from 'next/link';
import {
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon,
  WhatsApp as WhatsAppIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { THEME, BUSINESS_INFO } from '@/lib/constants';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        py: 6,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: THEME.typography.headingFamily,
                mb: 2
              }}
            >
              Contact Us
            </Typography>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <PhoneIcon sx={{ color: THEME.colors.primary }} />
                <MuiLink
                  component="a"
                  href={`tel:${BUSINESS_INFO.phone}`}
                  sx={{ color: 'inherit', textDecoration: 'none' }}
                >
                  {BUSINESS_INFO.phone}
                </MuiLink>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <EmailIcon sx={{ color: THEME.colors.primary }} />
                <MuiLink
                  component="a"
                  href={`mailto:${BUSINESS_INFO.contactEmail}`}
                  sx={{ color: 'inherit', textDecoration: 'none' }}
                >
                  {BUSINESS_INFO.contactEmail}
                </MuiLink>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="flex-start">
                <LocationIcon sx={{ color: THEME.colors.primary }} />
                <Typography>
                  123 Fashion Street<br />
                  Silver Spring, MD 20910
                </Typography>
              </Stack>
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: THEME.typography.headingFamily,
                mb: 2
              }}
            >
              Quick Links
            </Typography>
            <Stack spacing={1}>
              <NextLink href="/about" passHref legacyBehavior>
                <MuiLink
                  component="a"
                  sx={{
                    color: 'inherit',
                    textDecoration: 'none',
                    '&:hover': { color: THEME.colors.primary }
                  }}
                >
                  About Us
                </MuiLink>
              </NextLink>
              <NextLink href="/shop" passHref legacyBehavior>
                <MuiLink
                  component="a"
                  sx={{
                    color: 'inherit',
                    textDecoration: 'none',
                    '&:hover': { color: THEME.colors.primary }
                  }}
                >
                  Shop
                </MuiLink>
              </NextLink>
              <NextLink href="/customize" passHref legacyBehavior>
                <MuiLink
                  component="a"
                  sx={{
                    color: 'inherit',
                    textDecoration: 'none',
                    '&:hover': { color: THEME.colors.primary }
                  }}
                >
                  Customize
                </MuiLink>
              </NextLink>
              <NextLink href="/contact" passHref legacyBehavior>
                <MuiLink
                  component="a"
                  sx={{
                    color: 'inherit',
                    textDecoration: 'none',
                    '&:hover': { color: THEME.colors.primary }
                  }}
                >
                  Contact
                </MuiLink>
              </NextLink>
            </Stack>
          </Grid>

          {/* Store Hours */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: THEME.typography.headingFamily,
                mb: 2
              }}
            >
              Store Hours
            </Typography>
            <Stack spacing={1}>
              <Typography>
                <strong>Weekdays:</strong> {BUSINESS_INFO.storeHours.weekdays}
              </Typography>
              <Typography>
                <strong>Saturday:</strong> {BUSINESS_INFO.storeHours.saturday}
              </Typography>
              <Typography>
                <strong>Sunday:</strong> {BUSINESS_INFO.storeHours.sunday}
              </Typography>
            </Stack>

            {/* Social Links */}
            <Stack direction="row" spacing={1} sx={{ mt: 4 }}>
              <IconButton
                component="a"
                href={BUSINESS_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: THEME.colors.primary,
                  '&:hover': {
                    color: THEME.colors.secondary
                  }
                }}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                component="a"
                href={BUSINESS_INFO.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: THEME.colors.primary,
                  '&:hover': {
                    color: THEME.colors.secondary
                  }
                }}
              >
                <YouTubeIcon />
              </IconButton>
              <IconButton
                component="a"
                href={BUSINESS_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: THEME.colors.primary,
                  '&:hover': {
                    color: THEME.colors.secondary
                  }
                }}
              >
                <WhatsAppIcon />
              </IconButton>
            </Stack>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Typography
          variant="body2"
          align="center"
          sx={{ mt: 4, color: 'text.secondary' }}
        >
                        © 2024 {BUSINESS_INFO.brandName}. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
} 