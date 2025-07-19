'use client';

import { usePathname } from 'next/navigation';
import { Box, Container, Typography, Stepper, Step, StepLabel } from '@mui/material';
import { THEME } from '@/lib/constants';

const steps = [
  { id: 1, name: 'Demographics', path: '/customize/step1' },
  { id: 2, name: 'Design', path: '/customize/step2' },
  { id: 3, name: 'Measurements', path: '/customize/step3' },
  { id: 4, name: 'Review', path: '/customize/step4' },
  { id: 5, name: 'Checkout', path: '/customize/step5' },
];

export default function CustomizeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const currentStep = steps.findIndex(step => step.path === pathname) + 1;

  return (
    <Box sx={{ py: THEME.spacing.section, minHeight: '100vh', mt: 8, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '2rem', md: '2.5rem' },
            fontFamily: THEME.typography.headingFamily,
            fontWeight: 500,
            mb: 6,
            textAlign: 'center'
          }}
        >
          Customize Your Design
        </Typography>

        {/* Progress Steps */}
        <Stepper activeStep={currentStep - 1} alternativeLabel sx={{ mb: 6 }}>
          {steps.map((step) => (
            <Step key={step.name}>
              <StepLabel>{step.name}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Content */}
        <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, p: 4, mb: 4 }}>
          {children}
        </Box>
      </Container>
    </Box>
  );
} 