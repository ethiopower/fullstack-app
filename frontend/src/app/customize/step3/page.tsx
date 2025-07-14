'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type Measurements = {
  shoulder: number;
  chest: number;
  waist: number;
  hip: number;
  length: number;
  sleeve: number;
  neck: number;
  inseam?: number;
};

type Design = {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  price: number;
};

const measurementLabels = {
  shoulder: { en: 'Shoulder Width', am: 'ትከሻ ስፋት' },
  chest: { en: 'Chest/Bust', am: 'ደረት' },
  waist: { en: 'Waist', am: 'ወገብ' },
  hip: { en: 'Hip', am: 'ዳሌ' },
  length: { en: 'Length', am: 'ርዝመት' },
  sleeve: { en: 'Sleeve Length', am: 'እጅ ርዝመት' },
  neck: { en: 'Neck', am: 'አንገት' },
  inseam: { en: 'Inseam', am: 'የእግር ውስጥ ርዝመት' },
};

export default function Step3() {
  const router = useRouter();
  const [selectedDesigns, setSelectedDesigns] = useState<Record<string, Design[]>>({});
  const [measurements, setMeasurements] = useState<Record<string, Measurements[]>>({});
  const [activeCategory, setActiveCategory] = useState('');
  const [activeDesignIndex, setActiveDesignIndex] = useState(0);

  useEffect(() => {
    // Load selected designs from session storage
    const storedDesigns = sessionStorage.getItem('selectedDesigns');
    if (!storedDesigns) {
      router.push('/customize/step2');
      return;
    }

    const designs = JSON.parse(storedDesigns);
    setSelectedDesigns(designs);
    
    // Set initial active category
    const firstCategory = Object.keys(designs).find(cat => designs[cat].length > 0) || '';
    setActiveCategory(firstCategory);

    // Load existing measurements if any
    const storedMeasurements = sessionStorage.getItem('measurements');
    if (storedMeasurements) {
      setMeasurements(JSON.parse(storedMeasurements));
    }
  }, [router]);

  const handleMeasurementChange = (
    field: keyof Measurements,
    value: string
  ) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    setMeasurements(prev => {
      const categoryMeasurements = [...(prev[activeCategory] || [])];
      categoryMeasurements[activeDesignIndex] = {
        ...(categoryMeasurements[activeDesignIndex] || {
          shoulder: 0,
          chest: 0,
          waist: 0,
          hip: 0,
          length: 0,
          sleeve: 0,
          neck: 0,
        }),
        [field]: numValue,
      };
      return { ...prev, [activeCategory]: categoryMeasurements };
    });
  };

  const validateMeasurements = () => {
    for (const [category, designs] of Object.entries(selectedDesigns)) {
      const categoryMeasurements = measurements[category] || [];
      if (categoryMeasurements.length !== designs.length) return false;
      
      for (const measurement of categoryMeasurements) {
        if (!measurement || Object.values(measurement).some(v => v <= 0)) {
          return false;
        }
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateMeasurements()) {
      sessionStorage.setItem('measurements', JSON.stringify(measurements));
      router.push('/customize/step4');
    }
  };

  const handleBack = () => {
    router.push('/customize/step2');
  };

  const currentDesign = selectedDesigns[activeCategory]?.[activeDesignIndex];
  const currentMeasurements = measurements[activeCategory]?.[activeDesignIndex] || {
    shoulder: 0,
    chest: 0,
    waist: 0,
    hip: 0,
    length: 0,
    sleeve: 0,
    neck: 0,
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-medium text-slate-900 mb-2">Enter Measurements</h2>
        <p className="text-slate-600">
          Please provide accurate measurements for each selected design
        </p>
      </div>

      {/* Category and Design Selection */}
      <div className="flex space-x-4 mb-8">
        {Object.entries(selectedDesigns).map(([category, designs]) => (
          designs.length > 0 && (
            <button
              key={category}
              onClick={() => {
                setActiveCategory(category);
                setActiveDesignIndex(0);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeCategory === category
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          )
        ))}
      </div>

      {currentDesign && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Design Info */}
          <div>
            <div className="relative h-96 rounded-lg overflow-hidden mb-4">
              <Image
                src={currentDesign.imageUrl}
                alt={currentDesign.name}
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-lg font-medium text-slate-900">{currentDesign.name}</h3>
            {selectedDesigns[activeCategory].length > 1 && (
              <div className="flex space-x-2 mt-2">
                {selectedDesigns[activeCategory].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveDesignIndex(index)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index === activeDesignIndex
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Measurement Form */}
          <div className="space-y-4">
            {Object.entries(measurementLabels).map(([field, labels]) => (
              (!field.includes('inseam') || activeCategory.includes('men') || activeCategory.includes('boys')) && (
                <div key={field} className="space-y-2">
                  <label className="block">
                    <span className="text-slate-900 font-medium">{labels.en}</span>
                    <span className="text-slate-600 ml-2">({labels.am})</span>
                  </label>
                  <input
                    type="number"
                    value={currentMeasurements[field as keyof Measurements] || ''}
                    onChange={(e) => handleMeasurementChange(field as keyof Measurements, e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    placeholder="Enter measurement in inches"
                    step="0.1"
                  />
                </div>
              )
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={handleBack}
          className="px-6 py-2 text-slate-600 font-medium hover:text-slate-900"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!validateMeasurements()}
          className={`px-6 py-2 rounded-lg text-white font-medium transition-all ${
            validateMeasurements()
              ? 'bg-slate-900 hover:bg-slate-800'
              : 'bg-slate-400 cursor-not-allowed'
          }`}
        >
          Continue to Review
        </button>
      </div>
    </div>
  );
} 