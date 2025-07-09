'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Measurements {
  shoulder: number // ሽክለት ሰፈር
  length: number // የቅርጽ ቁመት
  bust: number // ቁራጭ አገኘ
  waist: number // የሰገነት ርዝመት
  hip: number // የመቃኛ ክፍል
  sleeve: number // የእጅ ርዝመት
  neck: number // የመቶ ጎን ጠቅላላ
  hem: number // የጥቅል ጎን ጠቅላላ
}

interface Design {
  id: string
  name: string
  category: 'men' | 'women' | 'boys' | 'girls'
  imageUrl: string
  price: number
}

const measurementLabels = {
  shoulder: 'ሽክለት ሰፈር (Shoulder)',
  length: 'የቅርጽ ቁመት (Length)',
  bust: 'ቁራጭ አገኘ (Bust)',
  waist: 'የሰገነት ርዝመት (Waist)',
  hip: 'የመቃኛ ክፍል (Hip)',
  sleeve: 'የእጅ ርዝመት (Sleeve)',
  neck: 'የመቶ ጎን ጠቅላላ (Neck)',
  hem: 'የጥቅል ጎን ጠቅላላ (Hem)',
}

export default function Step3() {
  const router = useRouter()
  const [selectedDesigns, setSelectedDesigns] = useState<Record<string, Design[]>>({})
  const [measurements, setMeasurements] = useState<Record<string, Measurements[]>>({})
  const [activeCategory, setActiveCategory] = useState<string>('')
  const [activeDesignIndex, setActiveDesignIndex] = useState<number>(0)

  useEffect(() => {
    // Load selected designs from session storage
    const storedDesigns = sessionStorage.getItem('selectedDesigns')
    if (storedDesigns) {
      const designs = JSON.parse(storedDesigns)
      setSelectedDesigns(designs)
      // Set initial active category
      const firstCategory = Object.keys(designs).find(cat => designs[cat].length > 0)
      if (firstCategory) {
        setActiveCategory(firstCategory)
      }
    } else {
      router.push('/customize/step2')
    }

    // Load measurements if they exist
    const storedMeasurements = sessionStorage.getItem('measurements')
    if (storedMeasurements) {
      setMeasurements(JSON.parse(storedMeasurements))
    }
  }, [router])

  const handleMeasurementChange = (
    category: string,
    designIndex: number,
    field: keyof Measurements,
    value: string
  ) => {
    const numValue = parseFloat(value)
    if (isNaN(numValue)) return

    setMeasurements(prev => {
      const categoryMeasurements = [...(prev[category] || [])]
      categoryMeasurements[designIndex] = {
        ...(categoryMeasurements[designIndex] || {
          shoulder: 0,
          length: 0,
          bust: 0,
          waist: 0,
          hip: 0,
          sleeve: 0,
          neck: 0,
          hem: 0,
        }),
        [field]: numValue,
      }
      return { ...prev, [category]: categoryMeasurements }
    })
  }

  const validateMeasurements = () => {
    for (const [category, designs] of Object.entries(selectedDesigns)) {
      const categoryMeasurements = measurements[category] || []
      if (categoryMeasurements.length !== designs.length) return false
      
      for (const measurement of categoryMeasurements) {
        if (!measurement || Object.values(measurement).some(v => v <= 0)) {
          return false
        }
      }
    }
    return true
  }

  const handleNext = () => {
    if (validateMeasurements()) {
      sessionStorage.setItem('measurements', JSON.stringify(measurements))
      router.push('/customize/step4')
    } else {
      toast.error('Please fill in all measurements')
    }
  }

  const currentDesigns = selectedDesigns[activeCategory] || []
  const currentMeasurements = measurements[activeCategory]?.[activeDesignIndex] || {
    shoulder: 0,
    length: 0,
    bust: 0,
    waist: 0,
    hip: 0,
    sleeve: 0,
    neck: 0,
    hem: 0,
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex space-x-4 mb-6">
          {Object.entries(selectedDesigns).map(([category, designs]) => (
            designs.length > 0 && (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory(category)
                  setActiveDesignIndex(0)
                }}
                className={`px-4 py-2 rounded-md ${
                  activeCategory === category
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            )
          ))}
        </div>

        {currentDesigns.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative">
              <h3 className="text-lg font-semibold mb-4">
                {currentDesigns[activeDesignIndex].name} - Item {activeDesignIndex + 1} of{' '}
                {currentDesigns.length}
              </h3>
              
              {/* SVG Measurement Overlay */}
              <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
                <svg
                  viewBox="0 0 300 400"
                  className="w-full h-full"
                  style={{ maxHeight: '600px' }}
                >
                  {/* Body outline based on category */}
                  {activeCategory === 'women' || activeCategory === 'girls' ? (
                    // Female silhouette
                    <path
                      d="M150,50 C180,50 200,70 200,100 C200,130 180,150 150,150 C120,150 100,130 100,100 C100,70 120,50 150,50 M150,150 L150,350 M100,200 L200,200"
                      stroke="black"
                      fill="none"
                      strokeWidth="2"
                    />
                  ) : (
                    // Male silhouette
                    <path
                      d="M150,50 C185,50 210,70 210,100 C210,130 185,150 150,150 C115,150 90,130 90,100 C90,70 115,50 150,50 M150,150 L150,350 M90,180 L210,180"
                      stroke="black"
                      fill="none"
                      strokeWidth="2"
                    />
                  )}
                  
                  {/* Measurement lines and labels */}
                  {/* Add measurement indicators here */}
                </svg>
              </div>
            </div>

            <div>
              <div className="grid gap-4">
                {Object.entries(measurementLabels).map(([key, label]) => (
                  <div key={key} className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      {label}
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={currentMeasurements[key as keyof Measurements] || ''}
                      onChange={(e) =>
                        handleMeasurementChange(
                          activeCategory,
                          activeDesignIndex,
                          key as keyof Measurements,
                          e.target.value
                        )
                      }
                      className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                ))}
              </div>

              {currentDesigns.length > 1 && (
                <div className="mt-6 flex justify-center space-x-4">
                  <button
                    onClick={() => setActiveDesignIndex(i => Math.max(0, i - 1))}
                    disabled={activeDesignIndex === 0}
                    className="px-4 py-2 border rounded-md disabled:opacity-50"
                  >
                    Previous Item
                  </button>
                  <button
                    onClick={() => setActiveDesignIndex(i => Math.min(currentDesigns.length - 1, i + 1))}
                    disabled={activeDesignIndex === currentDesigns.length - 1}
                    className="px-4 py-2 border rounded-md disabled:opacity-50"
                  >
                    Next Item
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-between">
        <Link
          href="/customize/step2"
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Back
        </Link>
        <button
          onClick={handleNext}
          disabled={!validateMeasurements()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
        >
          Next Step
        </button>
      </div>
    </div>
  )
} 