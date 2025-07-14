'use client';

import Image from 'next/image';
import Link from 'next/link';

const customizationSteps = [
  {
    title: 'Choose Your Style',
    description: 'Select from our curated collection of Ethiopian-inspired designs',
    image: '/images/instagram/imgi_10_278191962_163408482736547_5896909086523474106_n.webp'
  },
  {
    title: 'Pick Your Fabric',
    description: 'Browse through our premium Ethiopian cotton and traditional textiles',
    image: '/images/instagram/imgi_6_278048893_1088525645049426_4195131893231909479_n.webp'
  },
  {
    title: 'Perfect Your Fit',
    description: 'Get your perfect measurements for a tailored experience',
    image: '/images/instagram/imgi_4_278292359_1873496682850196_1929999068388655626_n.webp'
  }
];

export default function CustomizeSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Ethiopian-inspired background pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,#078930_25%,transparent_25%),linear-gradient(-45deg,#FDEF42_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#EF3340_75%),linear-gradient(-45deg,transparent_75%,#078930_75%)]" style={{ backgroundSize: '20px 20px', opacity: 0.05 }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Customize Your{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#078930] via-[#FDEF42] to-[#EF3340]">
              Ethiopian Style
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create your perfect piece with our easy customization process
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {customizationSteps.map((step, index) => (
            <div
              key={index}
              className="relative group rounded-2xl overflow-hidden shadow-lg bg-white"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                
                {/* Ethiopian colors accent */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#078930] via-[#FDEF42] to-[#EF3340]" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-sm opacity-90">{step.description}</p>
              </div>

              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#FDEF42] text-black">
                  Step {index + 1}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/customize"
            className="relative inline-flex items-center px-8 py-4 border-2 border-[#078930] text-lg font-medium rounded-full text-white overflow-hidden group"
          >
            <span className="relative z-10">Start Customizing</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#078930] via-[#FDEF42] to-[#EF3340] group-hover:animate-gradient-x"></div>
          </Link>
        </div>
      </div>
    </section>
  );
} 