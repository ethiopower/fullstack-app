'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type Design = {
  id: string;
  name: string;
  category: 'men' | 'women';
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
  const [selectedGender, setSelectedGender] = useState<Design['category'] | null>(null);
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);

  useEffect(() => {
    // Load gender from session storage
    const storedGender = sessionStorage.getItem('selectedGender');
    if (storedGender) {
      setSelectedGender(storedGender as Design['category']);
    } else {
      router.push('/customize/step1');
    }

    // Load selected design if exists
    const storedDesign = sessionStorage.getItem('selectedDesign');
    if (storedDesign) {
      setSelectedDesign(JSON.parse(storedDesign));
    }
  }, [router]);

  const handleDesignSelect = (design: Design) => {
    setSelectedDesign(design);
  };

  const handleNext = () => {
    if (selectedDesign) {
      sessionStorage.setItem('selectedDesign', JSON.stringify(selectedDesign));
      router.push('/customize/step3');
    }
  };

  const handleBack = () => {
    router.push('/customize/step1');
  };

  const filteredDesigns = mockDesigns.filter(design => design.category === selectedGender);

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-medium text-slate-900 mb-2">Select Your Design</h2>
        <p className="text-slate-600">
          Choose a design that matches your style
        </p>
      </div>

      {/* Design Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredDesigns.map((design) => (
          <div
            key={design.id}
            className={`border rounded-lg overflow-hidden transition-all ${
              selectedDesign?.id === design.id
                ? 'ring-2 ring-slate-900 shadow-md'
                : 'shadow-sm hover:shadow-md'
            }`}
            onClick={() => handleDesignSelect(design)}
            role="button"
            tabIndex={0}
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
            </div>
          </div>
        ))}
      </div>

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
          disabled={!selectedDesign}
          className={`px-6 py-2 rounded-lg text-white font-medium transition-all ${
            selectedDesign
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