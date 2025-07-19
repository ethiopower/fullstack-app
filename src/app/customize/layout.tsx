import { Box, Container, Stepper, Step, StepLabel } from '@mui/material';
import { THEME } from '@/lib/constants';

const steps = [
  { id: 1, name: 'Style Selection' },
  { id: 2, name: 'Design' },
  { id: 3, name: 'Measurements' },
  { id: 4, name: 'Review' },
  { id: 5, name: 'Checkout' }
] as const;

// This is a server component that provides the layout structure
export default function CustomizeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box 
      component="main" 
      sx={{ 
        minHeight: '100vh',
        pt: { xs: 8, md: 10 },
        pb: { xs: 4, md: 6 },
        bgcolor: 'background.default'
      }}
    >
      <Container maxWidth="lg">
        {/* Stepper is static and can be rendered on server */}
        <Stepper 
          activeStep={0} 
          alternativeLabel 
          sx={{ 
            mb: { xs: 4, md: 6 },
            '& .MuiStepLabel-label': {
              color: 'text.secondary',
              fontFamily: THEME.typography.headingFamily,
              '&.Mui-active': {
                color: 'primary.main'
              }
            }
          }}
        >
          {steps.map((step) => (
            <Step key={step.id}>
              <StepLabel>{step.name}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Content area */}
        <Box 
          sx={{ 
            bgcolor: 'background.paper',
            borderRadius: 2,
            p: { xs: 2, md: 4 },
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
        >
          {children}
        </Box>
      </Container>
    </Box>
  );
} 