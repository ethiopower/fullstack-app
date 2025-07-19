'use client';

import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Stack,
  Avatar,
  Divider
} from '@mui/material';
import Image from 'next/image';
import { THEME } from '@/lib/constants';

const teamMembers = [
  {
    name: 'Sami Fekadu',
    role: 'Founder & Creative Director',
    image: '/images/team/sami.jpg',
    bio: 'With over 10 years of experience in Ethiopian fashion, Sami brings traditional craftsmanship into the modern era.'
  },
  {
    name: 'Sarah Johnson',
    role: 'Lead Designer',
    image: '/images/team/sarah.jpg',
    bio: 'Sarah specializes in blending contemporary styles with traditional Ethiopian patterns and textiles.'
  },
  {
    name: 'Michael Haile',
    role: 'Master Tailor',
    image: '/images/team/michael.jpg',
    bio: 'A third-generation tailor, Michael ensures every garment meets our exacting standards of quality.'
  }
];

const values = [
  {
    title: 'Cultural Heritage',
    description: 'Preserving and celebrating Ethiopian fashion traditions while embracing modern innovation.'
  },
  {
    title: 'Quality Craftsmanship',
    description: 'Every piece is meticulously crafted using traditional techniques and premium materials.'
  },
  {
    title: 'Sustainable Fashion',
    description: 'Supporting local artisans and using eco-friendly practices in our production process.'
  },
  {
    title: 'Customer Experience',
    description: 'Providing personalized service and ensuring every customer feels confident and beautiful.'
  }
];

export default function AboutPage() {
  return (
    <Box sx={{ py: THEME.spacing.section, minHeight: '100vh', mt: 8 }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box sx={{ mb: 10, textAlign: 'center' }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontFamily: THEME.typography.headingFamily,
              fontWeight: 500,
              mb: 3
            }}
          >
            Our Story
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: 'text.secondary',
              maxWidth: '800px',
              mx: 'auto',
              mb: 6
            }}
          >
            Bridging traditional Ethiopian elegance with contemporary fashion
          </Typography>
          <Box
            sx={{
              position: 'relative',
              height: { xs: '300px', md: '400px' },
              borderRadius: 4,
              overflow: 'hidden'
            }}
          >
            <Image
              src="/images/instagram/imgi_1_278193034_380033810648589_636440153269846173_n.jpg"
              alt="Fafresh Fashion Workshop"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              style={{ objectFit: 'cover' }}
            />
          </Box>
        </Box>

        {/* Mission & Values */}
        <Grid container spacing={6} sx={{ mb: 10 }}>
          <Grid item xs={12} md={5}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.75rem', md: '2rem' },
                fontFamily: THEME.typography.headingFamily,
                fontWeight: 500,
                mb: 3
              }}
            >
              Our Mission
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              At Fafresh Fashion, we're dedicated to bringing the rich heritage of Ethiopian fashion to the modern world. Our mission is to create beautiful, handcrafted garments that honor traditional techniques while embracing contemporary styles.
            </Typography>
            <Typography variant="body1">
              We believe in the power of fashion to connect cultures and celebrate diversity. Every piece we create tells a story of Ethiopian craftsmanship and creativity, designed for the modern individual who appreciates both tradition and innovation.
            </Typography>
          </Grid>
          <Grid item xs={12} md={7}>
            <Grid container spacing={3}>
              {values.map((value, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      height: '100%',
                      bgcolor: 'background.default',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)'
                      }
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 2,
                        color: THEME.colors.primary,
                        fontFamily: THEME.typography.headingFamily
                      }}
                    >
                      {value.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {value.description}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

        {/* Team Section */}
        <Box sx={{ mb: 10 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.75rem', md: '2rem' },
              fontFamily: THEME.typography.headingFamily,
              fontWeight: 500,
              mb: 6,
              textAlign: 'center'
            }}
          >
            Meet Our Team
          </Typography>
          <Grid container spacing={4}>
            {teamMembers.map((member, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    height: '100%',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)'
                    }
                  }}
                >
                  <Avatar
                    src={member.image}
                    alt={member.name}
                    sx={{
                      width: 120,
                      height: 120,
                      mx: 'auto',
                      mb: 2,
                      border: `3px solid ${THEME.colors.primary}`
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: THEME.typography.headingFamily,
                      mb: 1
                    }}
                  >
                    {member.name}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="primary"
                    sx={{ mb: 2 }}
                  >
                    {member.role}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {member.bio}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Journey Section */}
        <Box>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.75rem', md: '2rem' },
              fontFamily: THEME.typography.headingFamily,
              fontWeight: 500,
              mb: 6,
              textAlign: 'center'
            }}
          >
            Our Journey
          </Typography>
          <Stack spacing={4}>
            <Paper elevation={0} sx={{ p: 4 }}>
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    From Tradition to Innovation
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Founded in Silver Spring, Maryland, Fafresh Fashion began with a vision to bring authentic Ethiopian fashion to a global audience. Our journey started with a small workshop and a team of skilled artisans dedicated to preserving traditional techniques.
                  </Typography>
                  <Typography variant="body1">
                    Today, we've grown into a destination for those seeking unique, culturally-rich fashion that bridges the gap between traditional and contemporary styles. Our commitment to quality and authenticity remains at the heart of everything we do.
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      position: 'relative',
                      height: '300px',
                      borderRadius: 2,
                      overflow: 'hidden'
                    }}
                  >
                    <Image
                      src="/images/instagram/imgi_3_353591052_285357163930407_5308760856456849800_n.jpg"
                      alt="Fafresh Fashion Journey"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{ objectFit: 'cover' }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
} 