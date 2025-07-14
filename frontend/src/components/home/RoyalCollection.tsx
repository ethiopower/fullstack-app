'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function RoyalCollection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Ethiopian-inspired background pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,#078930_25%,transparent_25%),linear-gradient(-45deg,#FDEF42_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#EF3340_75%),linear-gradient(-45deg,transparent_75%,#078930_75%)]" style={{ backgroundSize: '20px 20px', opacity: 0.05 }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            The Royal{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#078930] via-[#FDEF42] to-[#EF3340]">
              Collection
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Inspired by Ethiopian royalty, crafted for modern elegance
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Featured Image */}
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/images/instagram/imgi_11_278184439_698488201472262_8424562580223263652_n.webp"
              alt="Royal Collection Featured"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#078930]/20 via-[#FDEF42]/20 to-[#EF3340]/20" />
          </div>

          {/* Content */}
          <div className="space-y-8">
            <h3 className="text-3xl font-bold">Ethiopian Heritage Meets Modern Luxury</h3>
            <p className="text-lg text-gray-600">
              Our Royal Collection combines traditional Ethiopian craftsmanship with contemporary design elements. Each piece tells a story of heritage while embracing modern aesthetics.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/images/instagram/imgi_19_285025120_129252639746382_2835252277343536846_n.webp"
                  alt="Royal Collection Detail 1"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#078930]/20 via-transparent to-[#EF3340]/20" />
              </div>
              <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/images/instagram/imgi_9_278196211_1514753668920561_5538798167342816339_n.webp"
                  alt="Royal Collection Detail 2"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#FDEF42]/20 via-transparent to-[#078930]/20" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/collections/royal"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-[#078930] text-lg font-medium rounded-full text-white bg-[#078930] hover:bg-[#067825] transition-colors duration-300"
              >
                Explore Collection
              </Link>
              <Link
                href="/customize/royal"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-[#EF3340] text-lg font-medium rounded-full text-[#EF3340] hover:bg-[#EF3340] hover:text-white transition-colors duration-300"
              >
                Customize Royal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 