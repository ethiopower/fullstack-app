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
  category: 'men' | 'women';
  imageUrl: string;
  price: number;
  description: string;
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
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
  const [measurements, setMeasurements] = useState<Measurements>({
    shoulder: 0,
    chest: 0,
    waist: 0,
    hip: 0,
    length: 0,
    sleeve: 0,
    neck: 0,
  });

  useEffect(() => {
    // Load selected design from session storage
    const storedDesign = sessionStorage.getItem('selectedDesign');
    if (!storedDesign) {
      router.push('/customize/step2');
      return;
    }

    const design = JSON.parse(storedDesign);
    setSelectedDesign(design);

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

    setMeasurements(prev => ({
      ...prev,
      [field]: numValue,
    }));
  };

  const validateMeasurements = () => {
    return Object.values(measurements).every(value => value > 0);
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

  if (!selectedDesign) {
    return null;
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-medium text-slate-900 mb-2">Enter Measurements</h2>
        <p className="text-slate-600">
          Please provide accurate measurements for your selected design
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Design Info */}
        <div>
          <div className="relative h-96 rounded-lg overflow-hidden mb-4">
            <Image
              src={selectedDesign.imageUrl}
              alt={selectedDesign.name}
              fill
              className="object-cover"
            />
          </div>
          <h3 className="text-lg font-medium text-slate-900">{selectedDesign.name}</h3>
          <p className="text-slate-600 mt-2">{selectedDesign.description}</p>
        </div>

        {/* Measurement Form */}
        <div className="space-y-4">
          {Object.entries(measurementLabels).map(([field, labels]) => (
            (!field.includes('inseam') || selectedDesign.category === 'men') && (
              <div key={field} className="space-y-2">
                <label className="block">
                  <span className="text-slate-900 font-medium">{labels.en}</span>
                  <span className="text-slate-600 ml-2">({labels.am})</span>
                </label>
                <input
                  type="number"
                  value={measurements[field as keyof Measurements] || ''}
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