'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type Design = {
  id: string;
  name: string;
  category: 'men' | 'women' | 'boys' | 'girls';
  imageUrl: string;
  price: number;
  description: string;
};

// Temporary mock data - replace with API call later
const mockDesigns: Design[] = [
  {
    id: 'design1',
    name: 'Traditional Habesha Kemis',
    category: 'women',
    imageUrl: '/designs/habesha-kemis.jpg',
    price: 199.99,
    description: 'Elegant white cotton dress with intricate embroidery',
  },
  {
    id: 'design2',
    name: 'Modern Ethiopian Suit',
    category: 'men',
    imageUrl: '/designs/ethiopian-suit.jpg',
    price: 249.99,
    description: 'Contemporary take on traditional Ethiopian formal wear',
  },
  // Add more designs here
];

export default function Step2() {
  const router = useRouter();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selectedDesigns, setSelectedDesigns] = useState<Record<string, Design[]>>({});
  const [activeCategory, setActiveCategory] = useState<Design['category']>('men');

  useEffect(() => {
    // Load quantities from session storage
    const storedQuantities = sessionStorage.getItem('orderQuantities');
    if (storedQuantities) {
      setQuantities(JSON.parse(storedQuantities));
    } else {
      router.push('/customize/step1');
    }

    // Initialize selected designs
    const storedDesigns = sessionStorage.getItem('selectedDesigns');
    if (storedDesigns) {
      setSelectedDesigns(JSON.parse(storedDesigns));
    }
  }, [router]);

  const handleDesignSelect = (design: Design) => {
    const currentSelected = selectedDesigns[design.category] || [];
    const maxAllowed = quantities[design.category] || 0;

    if (currentSelected.length < maxAllowed) {
      setSelectedDesigns(prev => ({
        ...prev,
        [design.category]: [...(prev[design.category] || []), design],
      }));
    }
  };

  const handleDesignRemove = (design: Design, index: number) => {
    setSelectedDesigns(prev => ({
      ...prev,
      [design.category]: prev[design.category].filter((_, i) => i !== index),
    }));
  };

  const handleNext = () => {
    // Check if all required designs are selected
    const allSelected = Object.entries(quantities).every(
      ([category, qty]) => (selectedDesigns[category] || []).length === qty
    );

    if (allSelected) {
      sessionStorage.setItem('selectedDesigns', JSON.stringify(selectedDesigns));
      router.push('/customize/step3');
    }
  };

  const handleBack = () => {
    router.push('/customize/step1');
  };

  const filteredDesigns = mockDesigns.filter(design => design.category === activeCategory);

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-medium text-slate-900 mb-2">Select Your Designs</h2>
        <p className="text-slate-600">
          Choose designs for each category based on your selections
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex space-x-4 mb-8">
        {Object.entries(quantities).map(([category, qty]) => (
          qty > 0 && (
            <button
              key={category}
              onClick={() => setActiveCategory(category as Design['category'])}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeCategory === category
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
              {' '}
              ({(selectedDesigns[category] || []).length}/{qty})
            </button>
          )
        ))}
      </div>

      {/* Design Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
              <h3 className="text-lg font-medium text-slate-900">{design.name}</h3>
              <p className="text-slate-600 text-sm mt-1">{design.description}</p>
              <p className="text-slate-900 font-medium mt-2">${design.price.toFixed(2)}</p>
              <button
                onClick={() => handleDesignSelect(design)}
                disabled={
                  (selectedDesigns[design.category] || []).length >=
                  (quantities[design.category] || 0)
                }
                className={`mt-4 w-full px-4 py-2 rounded-lg text-white font-medium transition-all ${
                  (selectedDesigns[design.category] || []).length >=
                  (quantities[design.category] || 0)
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-slate-900 hover:bg-slate-800'
                }`}
              >
                Select Design
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Designs */}
      {selectedDesigns[activeCategory]?.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-medium text-slate-900 mb-4">Selected Designs</h3>
          <div className="space-y-4">
            {selectedDesigns[activeCategory].map((design, index) => (
              <div
                key={`${design.id}-${index}`}
                className="flex items-center justify-between bg-slate-50 p-4 rounded-lg"
              >
                <div>
                  <p className="font-medium text-slate-900">{design.name}</p>
                  <p className="text-slate-600 text-sm">${design.price.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => handleDesignRemove(design, index)}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handleBack}
          className="px-6 py-2 text-slate-600 font-medium hover:text-slate-900"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!Object.entries(quantities).every(
            ([category, qty]) => (selectedDesigns[category] || []).length === qty
          )}
          className={`px-6 py-2 rounded-lg text-white font-medium transition-all ${
            Object.entries(quantities).every(
              ([category, qty]) => (selectedDesigns[category] || []).length === qty
            )
              ? 'bg-slate-900 hover:bg-slate-800'
              : 'bg-slate-400 cursor-not-allowed'
          }`}
        >
          Continue to Measurements
        </button>
      </div>
    </div>
  );
} 