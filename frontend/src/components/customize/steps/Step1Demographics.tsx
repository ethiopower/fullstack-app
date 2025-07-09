'use client'

import { useState } from 'react'
import { z } from 'zod'

const personSchema = z.object({
  gender: z.enum(['male', 'female']),
  occasion: z.enum(['wedding', 'festival', 'casual', 'other']),
})

const demographicsSchema = z.object({
  people: z.array(personSchema).min(1),
  preferredLanguage: z.enum(['english', 'amharic']),
})

type Demographics = z.infer<typeof demographicsSchema>

interface Step1DemographicsProps {
  onNext: (data: Demographics) => void
  onBack: () => void
  data?: Partial<Demographics>
  isFirstStep: boolean
  isLastStep: boolean
}

export function Step1Demographics({
  onNext,
  data = {},
  isFirstStep,
}: Step1DemographicsProps) {
  const [formData, setFormData] = useState<Partial<Demographics>>({
    people: data.people || [{ gender: 'male', occasion: 'casual' }],
    preferredLanguage: data.preferredLanguage || 'english',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof Demographics, string>>>({})

  const addPerson = () => {
    setFormData(prev => ({
      ...prev,
      people: [...(prev.people || []), { gender: 'male', occasion: 'casual' }]
    }))
  }

  const removePerson = (index: number) => {
    setFormData(prev => ({
      ...prev,
      people: prev.people?.filter((_, i) => i !== index) || []
    }))
  }

  const updatePerson = (index: number, field: keyof typeof personSchema.shape, value: string) => {
    setFormData(prev => ({
      ...prev,
      people: prev.people?.map((person, i) => 
        i === index ? { ...person, [field]: value } : person
      ) || []
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const validatedData = demographicsSchema.parse(formData)
      onNext(validatedData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof Demographics, string>> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof Demographics] = err.message
          }
        })
        setErrors(fieldErrors)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-heading font-semibold text-gray-900">
            Tell us about your order
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Add details for each person you're ordering for.
          </p>
        </div>

        {/* People List */}
        <div className="space-y-4">
          {formData.people?.map((person, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4 relative">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Person {index + 1}</h3>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removePerson(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>

              {/* Gender Selection */}
              <div>
                <label className="text-sm font-medium text-gray-900">Gender</label>
                <div className="mt-2 flex gap-4">
                  {['male', 'female'].map((option) => (
                    <div key={option} className="flex items-center">
                      <input
                        type="radio"
                        name={`gender-${index}`}
                        value={option}
                        checked={person.gender === option}
                        onChange={(e) => updatePerson(index, 'gender', e.target.value as 'male' | 'female')}
                        className="h-4 w-4 border-gray-300 text-accent-DEFAULT focus:ring-accent-DEFAULT"
                      />
                      <label className="ml-3 block text-sm font-medium text-gray-700 capitalize">
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Occasion Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Occasion
                </label>
                <select
                  value={person.occasion}
                  onChange={(e) => updatePerson(index, 'occasion', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-accent-DEFAULT focus:outline-none focus:ring-accent-DEFAULT sm:text-sm"
                >
                  <option value="wedding">Wedding</option>
                  <option value="festival">Festival</option>
                  <option value="casual">Casual</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addPerson}
            className="mt-4 w-full rounded-md border-2 border-dashed border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:border-accent-DEFAULT hover:text-accent-DEFAULT focus:outline-none focus:ring-2 focus:ring-accent-DEFAULT focus:ring-offset-2"
          >
            Add Another Person
          </button>
        </div>

        {/* Language Preference */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Preferred Language
          </label>
          <select
            value={formData.preferredLanguage}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                preferredLanguage: e.target.value as Demographics['preferredLanguage'],
              }))
            }
            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-accent-DEFAULT focus:outline-none focus:ring-accent-DEFAULT sm:text-sm"
          >
            <option value="english">English</option>
            <option value="amharic">አማርኛ (Amharic)</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        {!isFirstStep && (
          <button
            type="button"
            onClick={() => onBack()}
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