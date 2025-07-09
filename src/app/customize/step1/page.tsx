'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface CategoryQuantity {
  men: number
  women: number
  boys: number
  girls: number
}

export default function Step1() {
  const router = useRouter()
  const [quantities, setQuantities] = useState<CategoryQuantity>({
    men: 0,
    women: 0,
    boys: 0,
    girls: 0,
  })

  const totalItems = Object.values(quantities).reduce((a, b) => a + b, 0)

  const handleQuantityChange = (category: keyof CategoryQuantity, value: number) => {
    setQuantities(prev => ({
      ...prev,
      [category]: Math.max(0, value), // Prevent negative values
    }))
  }

  const handleNext = () => {
    if (totalItems > 0) {
      // Store quantities in session storage for later steps
      sessionStorage.setItem('orderQuantities', JSON.stringify(quantities))
      router.push('/customize/step2')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Step 1: Select Quantities</h2>
            <p className="mt-2 text-sm text-gray-600">
              How many items would you like to customize for each category?
            </p>
          </div>

          <div className="space-y-6">
            {Object.entries(quantities).map(([category, quantity]) => (
              <div key={category} className="flex items-center justify-between">
                <label className="text-lg font-medium text-gray-900 capitalize">
                  {category}
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleQuantityChange(category as keyof CategoryQuantity, quantity - 1)}
                    className="rounded-full w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(category as keyof CategoryQuantity, quantity + 1)}
                    className="rounded-full w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}

            <div className="mt-8 border-t pt-6">
              <div className="flex justify-between items-center text-lg font-medium">
                <span>Total Items:</span>
                <span>{totalItems}</span>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300"
              >
                Back
              </Link>
              <button
                onClick={handleNext}
                disabled={totalItems === 0}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white
                  ${totalItems === 0 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
              >
                Next Step
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 