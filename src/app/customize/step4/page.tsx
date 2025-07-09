'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface Design {
  id: string
  name: string
  category: 'men' | 'women' | 'boys' | 'girls'
  imageUrl: string
  price: number
}

interface Measurements {
  shoulder: number
  length: number
  bust: number
  waist: number
  hip: number
  sleeve: number
  neck: number
  hem: number
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

export default function Step4() {
  const router = useRouter()
  const [selectedDesigns, setSelectedDesigns] = useState<Record<string, Design[]>>({})
  const [measurements, setMeasurements] = useState<Record<string, Measurements[]>>({})
  const [subtotal, setSubtotal] = useState(0)
  const [deposit, setDeposit] = useState(0)

  useEffect(() => {
    // Load selected designs and measurements from session storage
    const storedDesigns = sessionStorage.getItem('selectedDesigns')
    const storedMeasurements = sessionStorage.getItem('measurements')

    if (!storedDesigns || !storedMeasurements) {
      router.push('/customize/step3')
      return
    }

    try {
      const designs = JSON.parse(storedDesigns) as Record<string, Design[]>
      const measurements = JSON.parse(storedMeasurements) as Record<string, Measurements[]>
      setSelectedDesigns(designs)
      setMeasurements(measurements)

      // Calculate total
      const total = Object.values(designs).reduce((sum, categoryDesigns) => {
        return sum + categoryDesigns.reduce((catSum, design) => catSum + design.price, 0)
      }, 0)
      setSubtotal(total)
      setDeposit(total * 0.5) // 50% deposit required
    } catch (error) {
      console.error('Error parsing stored data:', error)
      router.push('/customize/step3')
    }
  }, [router])

  const handleNext = () => {
    // Store order summary in session storage
    sessionStorage.setItem('orderSummary', JSON.stringify({
      subtotal,
      deposit,
      balance: subtotal - deposit,
    }))
    router.push('/customize/step5')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-8">Review Your Order</h2>

        {Object.entries(selectedDesigns).map(([category, designs]) => (
          designs.length > 0 && (
            <div key={category} className="mb-8">
              <h3 className="text-xl font-semibold capitalize mb-4">{category}</h3>
              {designs.map((design, index) => (
                <div
                  key={`${design.id}-${index}`}
                  className="bg-white rounded-lg shadow-sm mb-4 p-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="relative h-48 md:h-full">
                      <Image
                        src={design.imageUrl}
                        alt={design.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-lg font-medium">{design.name}</h4>
                          <p className="text-gray-600">Item {index + 1}</p>
                        </div>
                        <p className="text-lg font-medium">${design.price.toFixed(2)}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(measurementLabels).map(([key, label]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-600">{label}:</span>
                            <span className="font-medium">
                              {measurements[category]?.[index]?.[key as keyof Measurements]}cm
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4">
                        <Link
                          href="/customize/step3"
                          className="text-indigo-600 hover:text-indigo-800 text-sm"
                        >
                          Edit Measurements
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ))}

        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <div className="space-y-2">
            <div className="flex justify-between text-lg">
              <span>Subtotal:</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg text-indigo-600">
              <span>Required Deposit (50%):</span>
              <span className="font-medium">${deposit.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg border-t pt-2">
              <span>Balance Due at Pickup:</span>
              <span className="font-medium">${(subtotal - deposit).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          <Link
            href="/customize/step3"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Back
          </Link>
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  )
} 