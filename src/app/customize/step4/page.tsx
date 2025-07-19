'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type Design = {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  price: number;
};

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

export default function Step4() {
  const router = useRouter();
  const [selectedDesigns, setSelectedDesigns] = useState<Record<string, Design[]>>({});
  const [measurements, setMeasurements] = useState<Record<string, Measurements[]>>({});
  const [subtotal, setSubtotal] = useState(0);
  const [deposit, setDeposit] = useState(0);

  useEffect(() => {
    // Load data from session storage
    const storedDesigns = sessionStorage.getItem('selectedDesigns');
    const storedMeasurements = sessionStorage.getItem('measurements');

    if (!storedDesigns || !storedMeasurements) {
      router.push('/customize/step3');
      return;
    }

    try {
      const designs = JSON.parse(storedDesigns) as Record<string, Design[]>;
      const measurements = JSON.parse(storedMeasurements) as Record<string, Measurements[]>;
      setSelectedDesigns(designs);
      setMeasurements(measurements);

      // Calculate total
      const total = Object.values(designs).reduce((sum: number, categoryDesigns: Design[]) => {
        return sum + categoryDesigns.reduce((catSum: number, design: Design) => catSum + design.price, 0);
      }, 0);
      setSubtotal(total);
      setDeposit(total * 0.5); // 50% deposit required
    } catch (error) {
      console.error('Error parsing stored data:', error);
      router.push('/customize/step3');
    }
  }, [router]);

  const handleBack = () => {
    router.push('/customize/step3');
  };

  const handleNext = () => {
    // Store order summary in session storage
    sessionStorage.setItem('orderSummary', JSON.stringify({
      subtotal,
      deposit,
      balance: subtotal - deposit,
    }));
    router.push('/customize/step5');
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-medium text-slate-900 mb-2">Review Your Order</h2>
        <p className="text-slate-600">
          Please review your selections and measurements before proceeding to checkout
        </p>
      </div>

      {/* Order Summary */}
      <div className="space-y-8">
        {Object.entries(selectedDesigns).map(([category, designs]) => (
          designs.length > 0 && (
            <div key={category} className="bg-slate-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-slate-900 mb-4 capitalize">
                {category} Designs
              </h3>
              
              <div className="space-y-6">
                {designs.map((design, index) => (
                  <div key={`${design.id}-${index}`} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Design Info */}
                    <div className="flex space-x-4">
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={design.imageUrl}
                          alt={design.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900">{design.name}</h4>
                        <p className="text-slate-600 mt-1">${design.price.toFixed(2)}</p>
                      </div>
                    </div>

                    {/* Measurements */}
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(measurements[category]?.[index] || {}).map(([field, value]) => (
                        field !== 'inseam' || category.includes('men') || category.includes('boys') ? (
                          <div key={field} className="text-sm">
                            <span className="text-slate-600">{measurementLabels[field as keyof typeof measurementLabels].en}:</span>
                            <span className="text-slate-900 font-medium ml-2">{value}"</span>
                          </div>
                        ) : null
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}

        {/* Price Summary */}
        <div className="bg-slate-50 rounded-lg p-6">
          <div className="space-y-2">
            <div className="flex justify-between text-lg">
              <span className="text-slate-600">Subtotal:</span>
              <span className="font-medium text-slate-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg text-slate-900">
              <span>Required Deposit (50%):</span>
              <span className="font-medium">${deposit.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg border-t border-slate-200 pt-2 mt-2">
              <span className="text-slate-600">Balance Due at Pickup:</span>
              <span className="font-medium text-slate-900">${(subtotal - deposit).toFixed(2)}</span>
            </div>
          </div>
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
          className="px-6 py-2 rounded-lg text-white font-medium bg-slate-900 hover:bg-slate-800 transition-all"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
} 