'use client';

import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Stack,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  DirectionsCar as DirectionsIcon,
  Train as TrainIcon,
  DirectionsBus as BusIcon,
  AccessTime as TimeIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { THEME, BUSINESS_INFO } from '@/lib/constants';

const transportOptions = [
  {
    mode: 'Car',
    icon: DirectionsIcon,
    directions: [
      'From I-495, take Exit 31A for Georgia Ave South',
      'Continue on Georgia Ave for 1.2 miles',
      'Turn right onto Colesville Road',
      'Our store will be on your left after 0.3 miles'
    ]
  },
  {
    mode: 'Metro',
    icon: TrainIcon,
    directions: [
      'Take Red Line to Silver Spring station',
      'Exit towards Colesville Road',
      'Walk 2 blocks north',
      'Our store will be on your right'
    ]
  },
  {
    mode: 'Bus',
    icon: BusIcon,
    directions: [
      'Routes 70, 79, and S2 stop nearby',
      'Get off at Georgia Ave & Colesville Rd',
      'Walk 1 block east on Colesville Road',
      'Our store will be on your left'
    ]
  }
];

export default function VisitPage() {
  return (
    <Box sx={{ py: THEME.spacing.section, minHeight: '100vh', mt: 8 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '2rem', md: '2.5rem' },
            fontFamily: THEME.typography.headingFamily,
            fontWeight: 500,
            mb: 3
          }}
        >
          Visit Our Store
        </Typography>

        <Typography
          variant="h5"
          sx={{
            color: 'text.secondary',
            maxWidth: '800px',
            mb: 6
          }}
        >
          Experience Ethiopian fashion in person at our Silver Spring location
        </Typography>

        <Grid container spacing={6}>
          {/* Store Information */}
          <Grid item xs={12} md={4}>
            <Stack spacing={4}>
              {/* Hours */}
              <Paper elevation={0} sx={{ p: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <TimeIcon sx={{ color: THEME.colors.primary }} />
                  <Typography variant="h6">Store Hours</Typography>
                </Stack>
                <Stack spacing={1}>
                  <Typography>
                    Weekdays: {BUSINESS_INFO.storeHours.weekdays}
                  </Typography>
                  <Typography>
                    Saturday: {BUSINESS_INFO.storeHours.saturday}
                  </Typography>
                  <Typography>
                    Sunday: {BUSINESS_INFO.storeHours.sunday}
                  </Typography>
                </Stack>
              </Paper>

              {/* Contact Info */}
              <Paper elevation={0} sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <PhoneIcon sx={{ color: THEME.colors.primary }} />
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">Phone</Typography>
                      <Typography>{BUSINESS_INFO.phone}</Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <EmailIcon sx={{ color: THEME.colors.primary }} />
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">Email</Typography>
                      <Typography>{BUSINESS_INFO.contactEmail}</Typography>
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
                </Stack>
              </Paper>

              {/* Get Directions Button */}
              <Button
                variant="contained"
                fullWidth
                size="large"
                href={BUSINESS_INFO.googleMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  bgcolor: THEME.colors.primary,
                  color: 'white',
                  py: 2,
                  '&:hover': {
                    bgcolor: THEME.colors.secondary
                  }
                }}
              >
                Get Directions
              </Button>
            </Stack>
          </Grid>

          {/* Map and Directions */}
          <Grid item xs={12} md={8}>
            {/* Map */}
            <Paper
              elevation={0}
              sx={{
                height: '400px',
                mb: 4,
                overflow: 'hidden'
              }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24934.19285055357!2d-77.03673668359375!3d38.99709!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89b7c6de5af6e45b%3A0xc2524522d4885d2a!2sSilver%20Spring%2C%20MD!5e0!3m2!1sen!2sus!4v1635959562000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Paper>

            {/* Transportation Options */}
            <Typography
              variant="h6"
              sx={{
                fontFamily: THEME.typography.headingFamily,
                mb: 3
              }}
            >
              Getting Here
            </Typography>
            <Stack spacing={3}>
              {transportOptions.map((option, index) => (
                <Paper key={index} elevation={0} sx={{ p: 3 }}>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <option.icon sx={{ color: THEME.colors.primary }} />
                    <Typography variant="h6">{option.mode}</Typography>
                  </Stack>
                  <List dense>
                    {option.directions.map((direction, idx) => (
                      <ListItem key={idx}>
                        <ListItemText primary={direction} />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
} 