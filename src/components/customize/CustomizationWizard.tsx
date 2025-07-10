'use client'

import { useState, useEffect, Suspense } from 'react'
import { Box, Stepper, Step, StepLabel, Paper, CircularProgress } from '@mui/material'
import dynamic from 'next/dynamic'

// Dynamically import step components
const Step1Demographics = dynamic(() => import('./steps/Step1Demographics'), {
  loading: () => <LoadingStep />,
  ssr: false
})

const Step2Design = dynamic(() => import('./steps/Step2Design'), {
  loading: () => <LoadingStep />,
  ssr: false
})

const Step3Measurements = dynamic(() => import('./steps/Step3Measurements'), {
  loading: () => <LoadingStep />,
  ssr: false
})

const Step4Review = dynamic(() => import('./steps/Step4Review'), {
  loading: () => <LoadingStep />,
  ssr: false
})

const Step5Checkout = dynamic(() => import('./steps/Step5Checkout'), {
  loading: () => <LoadingStep />,
  ssr: false
})

// Types
type Gender = 'male' | 'female'
type Occasion = 'wedding' | 'festival' | 'casual' | 'other'
type Language = 'english' | 'amharic'
type EmbroideryStyle = 'traditional' | 'modern' | 'minimal'
type PaymentMethod = 'bank_transfer' | 'chapa' | 'cash'

interface Person {
  gender: Gender
  occasion: Occasion
}

interface CustomerInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
}

interface FormData {
  demographics: {
    people: Person[]
    preferredLanguage: Language
  }
  design: {
    color: string
    designId: string
    designName: string
    embroideryStyle: EmbroideryStyle
  }
  measurements: Record<number, {
    chest: number
    waist: number
    hips: number
    length: number
    shoulders: number
    sleeves: number
  }>
  review: {
    notes: string
    termsAccepted: boolean
  }
  checkout: {
    customerInfo: CustomerInfo
    paymentMethod: PaymentMethod
  }
}

const initialFormData: FormData = {
  demographics: { 
    people: [{ gender: 'male', occasion: 'casual' }],
    preferredLanguage: 'english'
  },
  design: { 
    color: '',
    designId: '',
    designName: '',
    embroideryStyle: 'traditional'
  },
  measurements: {},
  review: {
    notes: '',
    termsAccepted: false
  },
  checkout: {
    customerInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: ''
    },
    paymentMethod: 'bank_transfer'
  },
}

const steps = [
  { id: 'demographics', name: 'Demographics' },
  { id: 'design', name: 'Design Selection' },
  { id: 'measurements', name: 'Measurements' },
  { id: 'review', name: 'Review' },
  { id: 'checkout', name: 'Checkout' },
] as const

// Loading component
const LoadingStep = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
    <CircularProgress />
  </Box>
)

export function CustomizationWizard() {
  const [mounted, setMounted] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>(initialFormData)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <LoadingStep />
  }

  const CurrentStepComponent = (() => {
    switch (currentStep) {
      case 0:
        return <Step1Demographics formData={formData} setFormData={setFormData} />
      case 1:
        return <Step2Design formData={formData} setFormData={setFormData} />
      case 2:
        return <Step3Measurements formData={formData} setFormData={setFormData} />
      case 3:
        return <Step4Review formData={formData} setFormData={setFormData} />
      case 4:
        return <Step5Checkout formData={formData} setFormData={setFormData} isSubmitting={isSubmitting} setIsSubmitting={setIsSubmitting} />
      default:
        return null
    }
  })()

  return (
    <Paper sx={{ p: 4 }}>
      <Stepper activeStep={currentStep} alternativeLabel>
        {steps.map((step) => (
          <Step key={step.id}>
            <StepLabel>{step.name}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ mt: 4 }}>
        <Suspense fallback={<LoadingStep />}>
          {CurrentStepComponent}
        </Suspense>
      </Box>
    </Paper>
  )
} 