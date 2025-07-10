'use client'

import { useState } from 'react'
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Paper,
  Grid,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useRouter } from 'next/navigation'
import { MeasurementGuide } from '@/components/measurements/MeasurementGuide'

const measurementFields = [
  { id: 'chest', label: { en: 'Chest', am: 'ደረት' }, min: 20, max: 200 },
  { id: 'waist', label: { en: 'Waist', am: 'ወገብ' }, min: 20, max: 200 },
  { id: 'hips', label: { en: 'Hips', am: 'ዳሌ' }, min: 20, max: 200 },
  { id: 'length', label: { en: 'Length', am: 'ርዝመት' }, min: 30, max: 200 },
  { id: 'shoulders', label: { en: 'Shoulders', am: 'ትከሻ' }, min: 20, max: 100 },
  { id: 'sleeves', label: { en: 'Sleeves', am: 'እጅጌ' }, min: 20, max: 100 },
]

const steps = ['Personal Info', 'Measurements', 'Review']

export default function MeasurementsPage() {
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [activeStep, setActiveStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeField, setActiveField] = useState<string>('')
  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
    },
    measurements: Object.fromEntries(
      measurementFields.map(field => [field.id, ''])
    ),
    notes: '',
  })

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      try {
        setIsSubmitting(true)
        // TODO: Submit measurements
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
        router.push('/thank-you')
      } catch (error) {
        console.error('Error submitting measurements:', error)
      } finally {
        setIsSubmitting(false)
      }
    } else {
      setActiveStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    setActiveStep((prev) => prev - 1)
  }

  const updatePersonalInfo = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      }
    }))
  }

  const updateMeasurement = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      measurements: {
        ...prev.measurements,
        [field]: value,
      }
    }))
  }

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.personalInfo.fullName}
                onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.personalInfo.email}
                onChange={(e) => updatePersonalInfo('email', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                type="tel"
                value={formData.personalInfo.phone}
                onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                required
              />
            </Grid>
          </Grid>
        )

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Grid container spacing={3}>
                {measurementFields.map((field) => (
                  <Grid item xs={12} key={field.id}>
                    <TextField
                      fullWidth
                      label={`${field.label.en} (${field.label.am})`}
                      type="number"
                      InputProps={{
                        inputProps: { min: field.min, max: field.max }
                      }}
                      value={formData.measurements[field.id]}
                      onChange={(e) => updateMeasurement(field.id, e.target.value)}
                      onFocus={() => setActiveField(field.id)}
                      required
                      helperText={`${field.min}cm - ${field.max}cm`}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid 
              item 
              xs={12} 
              md={6}
              sx={{
                display: { xs: activeField ? 'block' : 'none', md: 'block' },
                position: { xs: 'fixed', md: 'static' },
                bottom: { xs: 0, md: 'auto' },
                left: { xs: 0, md: 'auto' },
                right: { xs: 0, md: 'auto' },
                bgcolor: 'background.paper',
                p: { xs: 2, md: 0 },
                height: { xs: '40vh', md: 'auto' },
                zIndex: { xs: 1, md: 'auto' },
                boxShadow: { xs: '0px -2px 4px rgba(0,0,0,0.1)', md: 'none' },
              }}
            >
              <Box sx={{ height: '100%', minHeight: 400 }}>
                <MeasurementGuide field={activeField} />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Additional Notes"
                multiline
                rows={4}
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </Grid>
          </Grid>
        )

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography>Full Name: {formData.personalInfo.fullName}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>Email: {formData.personalInfo.email}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>Phone: {formData.personalInfo.phone}</Typography>
              </Grid>
            </Grid>

            <Typography variant="h6" sx={{ mt: 4 }} gutterBottom>
              Measurements
            </Typography>
            <Grid container spacing={2}>
              {measurementFields.map((field) => (
                <Grid item xs={12} sm={6} key={field.id}>
                  <Typography>
                    {field.label.en}: {formData.measurements[field.id]}cm
                  </Typography>
                </Grid>
              ))}
            </Grid>

            {formData.notes && (
              <>
                <Typography variant="h6" sx={{ mt: 4 }} gutterBottom>
                  Additional Notes
                </Typography>
                <Typography>{formData.notes}</Typography>
              </>
            )}
          </Box>
        )

      default:
        return null
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper sx={{ p: { xs: 2, sm: 4 } }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Your Measurements
        </Typography>

        <Stepper 
          activeStep={activeStep} 
          sx={{ my: 4 }}
          orientation={isMobile ? 'vertical' : 'horizontal'}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 4 }}>
          {renderStepContent(activeStep)}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
            {activeStep !== 0 && (
              <Button
                onClick={handleBack}
                disabled={isSubmitting}
              >
                Back
              </Button>
            )}
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : activeStep === steps.length - 1 ? (
                'Submit'
              ) : (
                'Next'
              )}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
} 