'use client';

import Image from 'next/image';
import Link from 'next/link';
import { BUSINESS_INFO } from '@/lib/constants';

const instagramImages = [
  '/images/instagram/imgi_1_278193034_380033810648589_636440153269846173_n.jpg',
  '/images/instagram/imgi_3_353591052_285357163930407_5308760856456849800_n.jpg',
  '/images/instagram/imgi_7_278407559_1005903230031551_1377516088203914242_n.webp',
  '/images/instagram/imgi_8_278414402_4983576831731269_5207514082339612036_n.webp',
  '/images/instagram/imgi_13_278392924_109404108407718_3275092387011595748_n.webp',
  '/images/instagram/imgi_18_285489417_338460055105426_9071859713693865775_n.webp',
  '/images/instagram/imgi_12_278236374_709188663444049_484472670772547167_n.webp',
  '/images/instagram/imgi_5_278430911_5220485997974230_5223933189179464051_n.webp'
];

const INSTAGRAM_URL = 'https://www.instagram.com/fafresh.cultural.fashion/';

export default function InstagramGallery() {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Ethiopian-inspired background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#078930]/5 via-[#FDEF42]/5 to-[#EF3340]/5" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Follow Us on{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#078930] via-[#FDEF42] to-[#EF3340]">
              Instagram
            </span>
          </h2>
          <p className="text-lg text-gray-600">
            @fafresh.cultural.fashion - Experience our latest designs and cultural inspirations
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {instagramImages.map((image, index) => (
            <Link
              key={index}
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square group overflow-hidden rounded-xl shadow-lg cursor-pointer transform transition-transform duration-300 hover:scale-[1.02]"
            >
              <Image
                src={image}
                alt={`Instagram Image ${index + 1}`}
                fill
                className="object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Ethiopian colors overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#078930]/20 via-[#FDEF42]/20 to-[#EF3340]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-sm font-medium">View on Instagram</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-3 border-2 border-[#078930] text-lg font-medium rounded-full text-[#078930] hover:bg-[#078930] hover:text-white transition-colors duration-300"
          >
            Follow Us
          </Link>
        </div>
      </div>
    </section>
  );
} 