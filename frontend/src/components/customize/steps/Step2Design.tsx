'use client'

import { useState } from 'react'
import { z } from 'zod'
import Image from 'next/image'

const designSchema = z.object({
  designId: z.string().min(1, "Please select a design"),
  designName: z.string(),
  color: z.string(),
  embroideryStyle: z.enum(['traditional', 'modern', 'minimal']),
})

type Design = z.infer<typeof designSchema>

interface Step2DesignProps {
  onNext: (data: Design) => void
  onBack: () => void
  data?: Partial<Design>
  isFirstStep: boolean
  isLastStep: boolean
}

// Sample designs data - in production, this would come from an API
const sampleDesigns = [
  {
    id: 'modern-suit',
    name: 'Modern Ethiopian Suit',
    price: 249.99,
    image: '/designs/modern-suit.jpg',
    colors: ['white', 'ivory', 'gold'],
    embroideryStyles: ['traditional', 'modern', 'minimal'],
  },
  {
    id: 'traditional-kemis',
    name: 'Traditional Habesha Kemis',
    price: 199.99,
    image: '/designs/traditional-kemis.jpg',
    colors: ['white', 'ivory', 'gold'],
    embroideryStyles: ['traditional', 'modern', 'minimal'],
  },
  // Add more designs here
]

export function Step2Design({
  onNext,
  onBack,
  data = {},
  isFirstStep,
}: Step2DesignProps) {
  const [formData, setFormData] = useState<Partial<Design>>({
    designId: data.designId || '',
    designName: data.designName || '',
    color: data.color || 'white',
    embroideryStyle: data.embroideryStyle || 'traditional',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof Design, string>>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const validatedData = designSchema.parse(formData)
      onNext(validatedData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof Design, string>> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof Design] = err.message
          }
        })
        setErrors(fieldErrors)
      }
    }
  }

  const handleDesignSelect = (design: typeof sampleDesigns[0]) => {
    setFormData((prev) => ({
      ...prev,
      designId: design.id,
      designName: design.name,
    }))
    setErrors((prev) => ({ ...prev, designId: undefined }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-2xl font-heading font-semibold text-gray-900">
          Choose Your Design
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Select from our collection of traditional Ethiopian designs.
        </p>
      </div>

      {/* Design Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sampleDesigns.map((design) => (
          <div
            key={design.id}
            className={`relative rounded-lg border p-4 cursor-pointer transition-all ${
              formData.designId === design.id
                ? 'border-accent-DEFAULT ring-2 ring-accent-DEFAULT bg-accent-50'
                : 'border-gray-300 hover:border-accent-DEFAULT hover:bg-gray-50'
            }`}
            onClick={() => handleDesignSelect(design)}
          >
            <div className="aspect-w-3 aspect-h-4 overflow-hidden rounded-lg bg-gray-100">
              <div className="relative h-64 w-full">
                {/* Placeholder while image loads or if there's an error */}
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
                  <span className="text-sm">{design.name}</span>
                </div>
                {/* Image will be shown on top of placeholder when loaded */}
                <Image
                  src={design.image}
                  alt={design.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    // Hide the image on error
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <h3 className="text-sm font-medium text-gray-900">{design.name}</h3>
              <p className="text-sm font-medium text-accent-DEFAULT">
                ${design.price.toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {errors.designId && (
        <p className="text-sm text-red-600 text-center">{errors.designId}</p>
      )}

      {/* Color Selection */}
      <div>
        <label className="text-base font-medium text-gray-900">Color</label>
        <div className="mt-4 grid grid-cols-3 gap-4">
          {['white', 'ivory', 'gold'].map((color) => (
            <div
              key={color}
              className={`relative flex cursor-pointer items-center justify-center rounded-lg border p-4 transition-all ${
                formData.color === color
                  ? 'border-accent-DEFAULT ring-2 ring-accent-DEFAULT bg-accent-50'
                  : 'border-gray-300 hover:border-accent-DEFAULT hover:bg-gray-50'
              }`}
              onClick={() => setFormData((prev) => ({ ...prev, color }))}
            >
              <span className="capitalize">{color}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Embroidery Style */}
      <div>
        <label className="text-base font-medium text-gray-900">Embroidery Style</label>
        <div className="mt-4 grid grid-cols-3 gap-4">
          {['traditional', 'modern', 'minimal'].map((style) => (
            <div
              key={style}
              className={`relative flex cursor-pointer items-center justify-center rounded-lg border p-4 transition-all ${
                formData.embroideryStyle === style
                  ? 'border-accent-DEFAULT ring-2 ring-accent-DEFAULT bg-accent-50'
                  : 'border-gray-300 hover:border-accent-DEFAULT hover:bg-gray-50'
              }`}
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  embroideryStyle: style as Design['embroideryStyle'],
                }))
              }
            >
              <span className="capitalize">{style}</span>
            </div>
          ))}
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