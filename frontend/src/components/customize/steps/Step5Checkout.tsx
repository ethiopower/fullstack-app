'use client'

import { useState } from 'react'
import { z } from 'zod'

const checkoutSchema = z.object({
  customerInfo: z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    address: z.string().min(10, 'Address must be at least 10 characters'),
    city: z.string().min(2, 'City must be at least 2 characters'),
  }),
  paymentMethod: z.enum(['bank_transfer', 'chapa', 'cash']),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
})

type Checkout = z.infer<typeof checkoutSchema>

interface Step5CheckoutProps {
  onNext: (data: Checkout) => void
  onBack: () => void
  data?: Partial<Checkout>
  isFirstStep: boolean
  isLastStep: boolean
  isSubmitting?: boolean
}

export function Step5Checkout({
  onNext,
  onBack,
  data = {},
  isFirstStep,
  isLastStep,
  isSubmitting = false,
}: Step5CheckoutProps) {
  const [formData, setFormData] = useState<Partial<Checkout>>({
    customerInfo: {
      firstName: data.customerInfo?.firstName || '',
      lastName: data.customerInfo?.lastName || '',
      email: data.customerInfo?.email || '',
      phone: data.customerInfo?.phone || '',
      address: data.customerInfo?.address || '',
      city: data.customerInfo?.city || '',
    },
    paymentMethod: data.paymentMethod || 'bank_transfer',
    termsAccepted: data.termsAccepted || false,
  })
  const [errors, setErrors] = useState<{
    customerInfo?: Record<string, string>
    paymentMethod?: string
    termsAccepted?: string
  }>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    try {
      const validatedData = checkoutSchema.parse(formData)
      await onNext(validatedData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: typeof errors = {}
        error.errors.forEach((err) => {
          const path = err.path
          if (path[0] === 'customerInfo' && path[1]) {
            fieldErrors.customerInfo = {
              ...fieldErrors.customerInfo,
              [path[1]]: err.message,
            }
          } else if (path[0]) {
            fieldErrors[path[0] as keyof typeof errors] = err.message
          }
        })
        setErrors(fieldErrors)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-2xl font-heading font-semibold text-gray-900">
          Checkout
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Please provide your contact information and select a payment method.
        </p>
      </div>

      <div className="space-y-8">
        {/* Customer Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Customer Information
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={formData.customerInfo?.firstName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    customerInfo: {
                      ...prev.customerInfo,
                      firstName: e.target.value,
                    },
                  }))
                }
                disabled={isSubmitting}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-DEFAULT focus:ring-accent-DEFAULT sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              {errors.customerInfo?.firstName && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.customerInfo.firstName}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={formData.customerInfo?.lastName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    customerInfo: {
                      ...prev.customerInfo,
                      lastName: e.target.value,
                    },
                  }))
                }
                disabled={isSubmitting}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-DEFAULT focus:ring-accent-DEFAULT sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              {errors.customerInfo?.lastName && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.customerInfo.lastName}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.customerInfo?.email}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    customerInfo: {
                      ...prev.customerInfo,
                      email: e.target.value,
                    },
                  }))
                }
                disabled={isSubmitting}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-DEFAULT focus:ring-accent-DEFAULT sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              {errors.customerInfo?.email && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.customerInfo.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.customerInfo?.phone}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    customerInfo: {
                      ...prev.customerInfo,
                      phone: e.target.value,
                    },
                  }))
                }
                disabled={isSubmitting}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-DEFAULT focus:ring-accent-DEFAULT sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              {errors.customerInfo?.phone && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.customerInfo.phone}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                value={formData.customerInfo?.address}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    customerInfo: {
                      ...prev.customerInfo,
                      address: e.target.value,
                    },
                  }))
                }
                disabled={isSubmitting}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-DEFAULT focus:ring-accent-DEFAULT sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              {errors.customerInfo?.address && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.customerInfo.address}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700"
              >
                City
              </label>
              <input
                type="text"
                id="city"
                value={formData.customerInfo?.city}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    customerInfo: {
                      ...prev.customerInfo,
                      city: e.target.value,
                    },
                  }))
                }
                disabled={isSubmitting}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-DEFAULT focus:ring-accent-DEFAULT sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              {errors.customerInfo?.city && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.customerInfo.city}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Payment Method
          </h3>
          <div className="space-y-4">
            {[
              { id: 'bank_transfer', label: 'Bank Transfer' },
              { id: 'chapa', label: 'Chapa (Online Payment)' },
              { id: 'cash', label: 'Cash on Delivery' },
            ].map((method) => (
              <div key={method.id} className="flex items-center">
                <input
                  id={method.id}
                  name="payment-method"
                  type="radio"
                  checked={formData.paymentMethod === method.id}
                  onChange={() =>
                    setFormData((prev) => ({
                      ...prev,
                      paymentMethod: method.id as Checkout['paymentMethod'],
                    }))
                  }
                  disabled={isSubmitting}
                  className="h-4 w-4 border-gray-300 text-accent-DEFAULT focus:ring-accent-DEFAULT disabled:cursor-not-allowed"
                />
                <label
                  htmlFor={method.id}
                  className="ml-3 block text-sm font-medium text-gray-700"
                >
                  {method.label}
                </label>
              </div>
            ))}
          </div>
          {errors.paymentMethod && (
            <p className="mt-2 text-sm text-red-600">{errors.paymentMethod}</p>
          )}
        </div>

        {/* Terms and Conditions */}
        <div className="relative flex items-start">
          <div className="flex h-5 items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              checked={formData.termsAccepted}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  termsAccepted: e.target.checked,
                }))
              }
              disabled={isSubmitting}
              className="h-4 w-4 rounded border-gray-300 text-accent-DEFAULT focus:ring-accent-DEFAULT disabled:cursor-not-allowed"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="terms" className="font-medium text-gray-700">
              Terms and Conditions
            </label>
            <p className="text-gray-500">
              I agree to the terms and conditions of service.
            </p>
          </div>
        </div>
        {errors.termsAccepted && (
          <p className="mt-2 text-sm text-red-600">{errors.termsAccepted}</p>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-accent-DEFAULT focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="relative rounded-md bg-accent-DEFAULT px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-accent-DEFAULT focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <span className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="h-5 w-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </span>
              <span className="opacity-0">Submit Order</span>
            </>
          ) : (
            'Submit Order'
          )}
        </button>
      </div>
    </form>
  )
} 