'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Stack,
  Alert,
  Snackbar,
  Link as MuiLink
} from '@mui/material';
import { 
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  WhatsApp as WhatsAppIcon
} from '@mui/icons-material';
import { THEME, BUSINESS_INFO } from '@/lib/constants';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setSnackbar({
        open: true,
        message: 'Message sent successfully! We will get back to you soon.',
        severity: 'success'
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to send message. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ py: THEME.spacing.section, minHeight: '100vh', mt: 8 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '2rem', md: '2.5rem' },
            fontFamily: THEME.typography.headingFamily,
            fontWeight: 500,
            mb: 2
          }}
        >
          Contact Us
        </Typography>

        <Typography variant="h6" color="text.secondary" sx={{ mb: 6 }}>
          We'd love to hear from you
        </Typography>

        <Grid container spacing={4}>
          {/* Contact Form */}
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ p: 3 }}>
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="name"
                      label="Your Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="email"
                      label="Email Address"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="phone"
                      label="Phone Number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="message"
                      label="Message"
                      multiline
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      sx={{
                        bgcolor: THEME.colors.primary,
                        color: 'white',
                        '&:hover': {
                          bgcolor: THEME.colors.secondary
                        }
                      }}
                    >
                      Send Message
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <PhoneIcon sx={{ color: THEME.colors.primary }} />
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">Phone</Typography>
                    <MuiLink
                      component="a"
                      href={`tel:${BUSINESS_INFO.phone}`}
                      sx={{ color: 'inherit', textDecoration: 'none' }}
                    >
                      {BUSINESS_INFO.phone}
                    </MuiLink>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                  <EmailIcon sx={{ color: THEME.colors.primary }} />
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">Email</Typography>
                    <MuiLink
                      component="a"
                      href={`mailto:${BUSINESS_INFO.contactEmail}`}
                      sx={{ color: 'inherit', textDecoration: 'none' }}
                    >
                      {BUSINESS_INFO.contactEmail}
                    </MuiLink>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <LocationIcon sx={{ color: THEME.colors.primary }} />
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">Address</Typography>
                    <Typography>
                      {BUSINESS_INFO.address.full}<br />
                      {BUSINESS_INFO.location}
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                  <TimeIcon sx={{ color: THEME.colors.primary }} />
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">Store Hours</Typography>
                    <Typography>
                      Weekdays: {BUSINESS_INFO.storeHours.weekdays}<br />
                      Saturday: {BUSINESS_INFO.storeHours.saturday}<br />
                      Sunday: {BUSINESS_INFO.storeHours.sunday}
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                  <WhatsAppIcon sx={{ color: THEME.colors.primary }} />
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">WhatsApp</Typography>
                    <MuiLink
                      component="a"
                      href={BUSINESS_INFO.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: 'inherit',
                        textDecoration: 'none',
                        '&:hover': { color: THEME.colors.primary }
                      }}
                    >
                      Message us on WhatsApp
                    </MuiLink>
                  </Box>
                </Stack>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

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
      </Container>
    </Box>
  );
} 