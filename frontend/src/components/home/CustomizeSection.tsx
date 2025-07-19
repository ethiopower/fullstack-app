'use client';

import { Box, Container, Typography, Button, Grid } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { BUSINESS_INFO } from '@/lib/constants';
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
});

const CustomizeSection = () => {
  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        py: { xs: 12, md: 16 },
        overflow: 'hidden',
        bgcolor: '#FCFCFC',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent)'
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent)'
        }
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23078930' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <Container maxWidth="lg">
        <Grid container spacing={8} alignItems="center">
          {/* Left side - Image */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: 'relative',
                height: { xs: '500px', md: '700px' },
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
                transform: 'perspective(1000px) rotateY(-5deg)',
                transition: 'transform 0.5s ease',
                '&:hover': {
                  transform: 'perspective(1000px) rotateY(0deg)',
                }
              }}
            >
              <Image
                src="/images/instagram/imgi_1_278193034_380033810648589_636440153269846173_n.jpg"
                alt="Ethiopian Traditional Dress"
                fill
                style={{ objectFit: 'cover' }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.3), transparent)',
                }}
              />
            </Box>
          </Grid>

          {/* Right side - Content */}
          <Grid item xs={12} md={6}>
            <Box sx={{ maxWidth: 520 }}>
              <Typography
                component="h2"
                className={playfair.className}
                sx={{
                  fontSize: { xs: '3.5rem', md: '4.5rem' },
                  lineHeight: 1.1,
                  mb: 4,
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #078930 0%, #2C3E50 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Create Your Perfect Look
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  color: '#078930',
                  fontWeight: 500,
                  mb: 6,
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                }}
              >
                TRADITIONAL. TRENDY. TAILORED.
              </Typography>

              {/* Marketing Points */}
              <Box sx={{ mb: 8 }}>
                {[
                  {
                    title: 'Easy Customization',
                    description: 'Choose your style, fabric, and get your perfect fit'
                  },
                  {
                    title: '3 WEEK FREE DELIVERY TO STORE',
                    description: 'Quick turnaround time for your custom pieces'
                  },
                  {
                    title: 'OVER 1000 DESIGNS TO CHOOSE FROM',
                    description: 'Extensive collection of traditional and modern designs'
                  }
                ].map((point, index) => (
                  <Box
                    key={index}
                    sx={{
                      mb: 4,
                      p: 3,
                      borderRadius: 2,
                      background: 'rgba(255,255,255,0.8)',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'translateX(10px)',
                      }
                    }}
                  >
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        fontWeight: 600,
                        color: '#2C3E50',
                      }}
                    >
                      {point.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'text.secondary',
                        fontSize: '1.1rem',
                      }}
                    >
                      {point.description}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Button
                component={Link}
                href="/customize"
                variant="contained"
                size="large"
                sx={{
                  bgcolor: '#078930',
                  color: 'white',
                  px: 6,
                  py: 2.5,
                  fontSize: '1.2rem',
                  borderRadius: '50px',
                  boxShadow: '0 10px 20px rgba(7,137,48,0.2)',
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    bgcolor: '#067825',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 15px 25px rgba(7,137,48,0.3)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Start Customizing
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CustomizeSection; 