'use client'

import { useState } from 'react'
import { z } from 'zod'

const measurementsSchema = z.object({
  chest: z.number().min(20).max(200),
  waist: z.number().min(20).max(200),
  hips: z.number().min(20).max(200),
  length: z.number().min(30).max(200),
  shoulders: z.number().min(20).max(100),
  sleeves: z.number().min(20).max(100),
  notes: z.string().optional(),
})

type Measurements = z.infer<typeof measurementsSchema>

interface Step3MeasurementsProps {
  onNext: (data: Measurements) => void
  onBack: () => void
  data?: Partial<Measurements>
  isFirstStep: boolean
  isLastStep: boolean
}

const measurementFields = [
  { id: 'chest', label: { en: 'Chest', am: 'ደረት' }, min: 20, max: 200 },
  { id: 'waist', label: { en: 'Waist', am: 'ወገብ' }, min: 20, max: 200 },
  { id: 'hips', label: { en: 'Hips', am: 'ዳሌ' }, min: 20, max: 200 },
  { id: 'length', label: { en: 'Length', am: 'ርዝመት' }, min: 30, max: 200 },
  { id: 'shoulders', label: { en: 'Shoulders', am: 'ትከሻ' }, min: 20, max: 100 },
  { id: 'sleeves', label: { en: 'Sleeves', am: 'እጅጌ' }, min: 20, max: 100 },
]

export function Step3Measurements({
  onNext,
  onBack,
  data = {},
  isFirstStep,
}: Step3MeasurementsProps) {
  const [formData, setFormData] = useState<Partial<Measurements>>({
    chest: data.chest || 0,
    waist: data.waist || 0,
    hips: data.hips || 0,
    length: data.length || 0,
    shoulders: data.shoulders || 0,
    sleeves: data.sleeves || 0,
    notes: data.notes || '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof Measurements, string>>>({})
  const [activeField, setActiveField] = useState<keyof Measurements | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const validatedData = measurementsSchema.parse(formData)
      onNext(validatedData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof Measurements, string>> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof Measurements] = err.message
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
          Your Measurements
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Enter your measurements in centimeters. Click on each field to see where to measure.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Measurement Form */}
        <div className="space-y-6">
          {measurementFields.map((field) => (
            <div key={field.id}>
              <label
                htmlFor={field.id}
                className="block text-sm font-medium text-gray-700"
              >
                {field.label.en}{' '}
                <span className="text-gray-500">({field.label.am})</span>
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name={field.id}
                  id={field.id}
                  min={field.min}
                  max={field.max}
                  value={formData[field.id as keyof Measurements] || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      [field.id]: parseFloat(e.target.value) || 0,
                    }))
                  }
                  onFocus={() => setActiveField(field.id as keyof Measurements)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-DEFAULT focus:ring-accent-DEFAULT sm:text-sm"
                />
                {errors[field.id as keyof Measurements] && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors[field.id as keyof Measurements]}
                  </p>
                )}
              </div>
            </div>
          ))}

          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700"
            >
              Additional Notes
            </label>
            <div className="mt-1">
              <textarea
                id="notes"
                name="notes"
                rows={3}
                value={formData.notes || ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, notes: e.target.value }))
                }
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-DEFAULT focus:ring-accent-DEFAULT sm:text-sm"
                placeholder="Any special requirements or notes about your measurements..."
              />
            </div>
          </div>
        </div>

        {/* SVG Measurement Guide */}
        <div className="relative h-[600px] rounded-lg border border-gray-200 bg-white p-4">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* This will be replaced with actual SVG measurement guides */}
            <div className="text-center text-gray-400">
              <p>Measurement Guide</p>
              <p className="text-sm">
                {activeField
                  ? `Showing guide for ${activeField}`
                  : 'Click on a measurement field to see guide'}
              </p>
            </div>
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
          Continue
        </button>
      </div>
    </form>
  )
} 