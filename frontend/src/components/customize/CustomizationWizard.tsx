'use client'

import { useState } from 'react'
import { Step1Demographics } from './steps/Step1Demographics'
import { Step2Design } from './steps/Step2Design'
import { Step3Measurements } from './steps/Step3Measurements'
import { Step4Review } from './steps/Step4Review'
import { Step5Checkout } from './steps/Step5Checkout'
import { toast } from 'react-hot-toast'

const steps = [
  { id: 'demographics', name: 'Demographics', component: Step1Demographics },
  { id: 'design', name: 'Design Selection', component: Step2Design },
  { id: 'measurements', name: 'Measurements', component: Step3Measurements },
  { id: 'review', name: 'Review', component: Step4Review },
  { id: 'checkout', name: 'Checkout', component: Step5Checkout },
]

export function CustomizationWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    demographics: {},
    design: {},
    measurements: {},
    review: {},
    checkout: {},
  })

  const CurrentStepComponent = steps[currentStep].component

  const submitOrder = async (orderData: any) => {
    try {
      setIsSubmitting(true)
      // TODO: Replace with your actual API endpoint
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...orderData,
          status: 'pending',
          orderDate: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit order')
      }

      const data = await response.json()
      toast.success('Order submitted successfully!')
      // TODO: Redirect to order confirmation page
      return data
    } catch (error) {
      console.error('Error submitting order:', error)
      toast.error('Failed to submit order. Please try again.')
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNext = async (stepData: any) => {
    try {
      setFormData(prev => ({
        ...prev,
        [steps[currentStep].id]: stepData,
      }))

      if (currentStep === steps.length - 1) {
        // This is the final step (checkout)
        const orderData = {
          customer: stepData.customerInfo,
          paymentMethod: stepData.paymentMethod,
          items: formData.demographics.people.map((person: any, index: number) => ({
            gender: person.gender,
            occasion: person.occasion,
            design: formData.design,
            measurements: formData.measurements[index],
          })),
          subtotal: calculateSubtotal(formData),
          deposit: calculateDeposit(formData),
        }

        await submitOrder(orderData)
      } else {
        setCurrentStep(prev => prev + 1)
      }
    } catch (error) {
      console.error('Error processing step:', error)
      // Error is already handled by submitOrder for the final step
      if (currentStep !== steps.length - 1) {
        toast.error('An error occurred. Please try again.')
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const calculateSubtotal = (data: any) => {
    const basePrice = 249.99 // Price per item
    return (data.demographics?.people?.length || 1) * basePrice
  }

  const calculateDeposit = (data: any) => {
    return calculateSubtotal(data) * 0.5 // 50% deposit
  }

  return (
    <div className="space-y-8">
      {/* Progress Steps */}
      <nav aria-label="Progress">
        <ol role="list" className="flex items-center">
          {steps.map((step, index) => (
            <li key={step.id} className={index !== 0 ? 'pl-6 sm:pl-8 flex-1' : 'flex-1'}>
              <div className="flex items-center">
                <div
                  className={`relative flex h-8 w-8 items-center justify-center rounded-full ${
                    index < currentStep
                      ? 'bg-accent-DEFAULT'
                      : index === currentStep
                      ? 'border-2 border-accent-DEFAULT'
                      : 'border-2 border-gray-300'
                  }`}
                >
                  <span
                    className={`text-sm font-medium ${
                      index < currentStep
                        ? 'text-white'
                        : index === currentStep
                        ? 'text-accent-DEFAULT'
                        : 'text-gray-500'
                    }`}
                  >
                    {index + 1}
                  </span>
                </div>
                {index !== steps.length - 1 && (
                  <div
                    className={`h-0.5 w-full ${
                      index < currentStep ? 'bg-accent-DEFAULT' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
              <div className="mt-2">
                <span
                  className={`text-sm font-medium ${
                    index <= currentStep ? 'text-gray-900' : 'text-gray-500'
                  }`}
                >
                  {step.name}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </nav>

      {/* Current Step */}
      <div className="mt-8">
        <CurrentStepComponent
          onNext={handleNext}
          onBack={handleBack}
          data={formData[steps[currentStep].id]}
          isFirstStep={currentStep === 0}
          isLastStep={currentStep === steps.length - 1}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  )
} 