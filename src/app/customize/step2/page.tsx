'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

interface Design {
  id: string
  name: string
  category: 'men' | 'women' | 'boys' | 'girls'
  imageUrl: string
  price: number
}

// Temporary mock data - replace with API call
const mockDesigns: Design[] = [
  {
    id: 'design1',
    name: 'Traditional Habesha Kemis',
    category: 'women',
    imageUrl: '/designs/habesha-kemis.jpg',
    price: 199.99,
  },
  {
    id: 'design2',
    name: 'Modern Ethiopian Suit',
    category: 'men',
    imageUrl: '/designs/ethiopian-suit.jpg',
    price: 249.99,
  },
  // Add more mock designs...
]

export default function Step2() {
  const router = useRouter()
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [selectedDesigns, setSelectedDesigns] = useState<Record<string, Design[]>>({})
  const [activeCategory, setActiveCategory] = useState<Design['category']>('men')

  useEffect(() => {
    // Load quantities from session storage
    const storedQuantities = sessionStorage.getItem('orderQuantities')
    if (storedQuantities) {
      setQuantities(JSON.parse(storedQuantities))
    } else {
      router.push('/customize/step1')
    }

    // Initialize selected designs
    const storedDesigns = sessionStorage.getItem('selectedDesigns')
    if (storedDesigns) {
      setSelectedDesigns(JSON.parse(storedDesigns))
    }
  }, [router])

  const handleDesignSelect = (design: Design) => {
    const currentSelected = selectedDesigns[design.category] || []
    const maxAllowed = quantities[design.category] || 0

    if (currentSelected.length < maxAllowed) {
      setSelectedDesigns(prev => ({
        ...prev,
        [design.category]: [...(prev[design.category] || []), design],
      }))
    }
  }

  const handleDesignRemove = (design: Design, index: number) => {
    setSelectedDesigns(prev => ({
      ...prev,
      [design.category]: prev[design.category].filter((_, i) => i !== index),
    }))
  }

  const handleNext = () => {
    // Check if all required designs are selected
    const allSelected = Object.entries(quantities).every(
      ([category, qty]) => (selectedDesigns[category] || []).length === qty
    )

    if (allSelected) {
      sessionStorage.setItem('selectedDesigns', JSON.stringify(selectedDesigns))
      router.push('/customize/step3')
    }
  }

  const filteredDesigns = mockDesigns.filter(design => design.category === activeCategory)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex space-x-4 mb-6">
          {Object.entries(quantities).map(([category, qty]) => (
            qty > 0 && (
              <button
                key={category}
                onClick={() => setActiveCategory(category as Design['category'])}
                className={`px-4 py-2 rounded-md ${
                  activeCategory === category
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
                {' '}
                ({(selectedDesigns[category] || []).length}/{qty})
              </button>
            )
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDesigns.map((design) => (
            <div
              key={design.id}
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative h-64">
                <Image
                  src={design.imageUrl}
                  alt={design.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold">{design.name}</h3>
                <p className="text-gray-600">${design.price.toFixed(2)}</p>
                <button
                  onClick={() => handleDesignSelect(design)}
                  disabled={
                    (selectedDesigns[design.category] || []).length >=
                    (quantities[design.category] || 0)
                  }
                  className="mt-2 w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
                >
                  Select Design
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Selected Designs</h3>
        {Object.entries(selectedDesigns).map(([category, designs]) => (
          <div key={category} className="mb-4">
            <h4 className="font-medium capitalize mb-2">{category}</h4>
            <div className="space-y-2">
              {designs.map((design, index) => (
                <div
                  key={`${design.id}-${index}`}
                  className="flex items-center justify-between bg-gray-50 p-2 rounded"
                >
                  <span>{design.name}</span>
                  <button
                    onClick={() => handleDesignRemove(design, index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between">
        <Link
          href="/customize/step1"
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Back
        </Link>
        <button
          onClick={handleNext}
          disabled={!Object.entries(quantities).every(
            ([category, qty]) => (selectedDesigns[category] || []).length === qty
          )}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
        >
          Next Step
        </button>
      </div>
    </div>
  )
} 