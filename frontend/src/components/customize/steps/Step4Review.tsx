'use client'

import { useState } from 'react'
import { z } from 'zod'

const reviewSchema = z.object({
  confirmed: z.boolean(),
  additionalNotes: z.string().optional(),
})

type Review = z.infer<typeof reviewSchema>

interface Step4ReviewProps {
  onNext: (data: Review) => void
  onBack: () => void
  data?: Partial<Review>
  isFirstStep: boolean
  isLastStep: boolean
}

export function Step4Review({
  onNext,
  onBack,
  data = {},
  isFirstStep,
}: Step4ReviewProps) {
  const [formData, setFormData] = useState<Partial<Review>>({
    confirmed: data.confirmed || false,
    additionalNotes: data.additionalNotes || '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof Review, string>>>({})

  // Sample order data - in production, this would come from the wizard's context
  const orderSummary = {
    design: {
      name: 'Traditional Habesha Kemis',
      color: 'White',
      embroideryStyle: 'Traditional',
    },
    measurements: {
      chest: 90,
      waist: 75,
      hips: 95,
      length: 140,
      shoulders: 40,
      sleeves: 60,
    },
    quantity: 1,
    price: {
      basePrice: 2500,
      deposit: 1250,
      total: 2500,
    },
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const validatedData = reviewSchema.parse(formData)
      onNext(validatedData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof Review, string>> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof Review] = err.message
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
          Review Your Order
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Please review your customization details carefully before proceeding to checkout.
        </p>
      </div>

      <div className="space-y-6">
        {/* Design Details */}
        <div className="rounded-lg bg-white shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Design Details
            </h3>
            <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Design</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {orderSummary.design.name}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Color</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {orderSummary.design.color}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Embroidery Style
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {orderSummary.design.embroideryStyle}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Quantity</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {orderSummary.quantity}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Measurements */}
        <div className="rounded-lg bg-white shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Measurements
            </h3>
            <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {Object.entries(orderSummary.measurements).map(([key, value]) => (
                <div key={key}>
                  <dt className="text-sm font-medium text-gray-500 capitalize">
                    {key}
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">{value} cm</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="rounded-lg bg-white shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Price Breakdown
            </h3>
            <dl className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-600">Base Price</dt>
                <dd className="text-sm font-medium text-gray-900">
                  ETB {orderSummary.price.basePrice.toLocaleString()}
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="text-base font-medium text-gray-900">Total</dt>
                <dd className="text-base font-medium text-gray-900">
                  ETB {orderSummary.price.total.toLocaleString()}
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4 text-accent-DEFAULT">
                <dt className="text-sm">Required Deposit (50%)</dt>
                <dd className="text-sm font-medium">
                  ETB {orderSummary.price.deposit.toLocaleString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Confirmation */}
        <div className="space-y-4">
          <div className="relative flex items-start">
            <div className="flex h-5 items-center">
              <input
                id="confirmed"
                name="confirmed"
                type="checkbox"
                checked={formData.confirmed}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, confirmed: e.target.checked }))
                }
                className="h-4 w-4 rounded border-gray-300 text-accent-DEFAULT focus:ring-accent-DEFAULT"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="confirmed" className="font-medium text-gray-700">
                Confirm Measurements
              </label>
              <p className="text-gray-500">
                I confirm that all measurements are correct and accurate.
              </p>
            </div>
          </div>
          {errors.confirmed && (
            <p className="text-sm text-red-600">{errors.confirmed}</p>
          )}
        </div>

        {/* Additional Notes */}
        <div>
          <label
            htmlFor="additionalNotes"
            className="block text-sm font-medium text-gray-700"
          >
            Additional Notes
          </label>
          <div className="mt-1">
            <textarea
              id="additionalNotes"
              name="additionalNotes"
              rows={3}
              value={formData.additionalNotes}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  additionalNotes: e.target.value,
                }))
              }
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-DEFAULT focus:ring-accent-DEFAULT sm:text-sm"
              placeholder="Any special instructions or notes for your order..."
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        {!isFirstStep && (
          <button
            type="button"
            onClick={onBack}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-accent-DEFAULT focus:ring-offset-2"
          >
            Back
          </button>
        )}
        <button
          type="submit"
          className="rounded-md bg-accent-DEFAULT px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-accent-DEFAULT focus:ring-offset-2"
        >
          Continue to Payment
        </button>
      </div>
    </form>
  )
} 