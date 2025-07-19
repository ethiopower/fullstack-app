'use client';

import Image from 'next/image';

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

export default function InstagramGallery() {
  const handleFollowClick = () => {
    window.open('https://www.instagram.com/fafresh.cultural.fashion/', '_blank');
  };

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-yellow-400/5 to-red-500/5" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Follow Us on{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 via-yellow-500 to-red-500">
              Instagram
            </span>
          </h2>
          <p className="text-lg text-gray-600">
            @fafresh.cultural.fashion - Experience our latest designs and cultural inspirations
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {instagramImages.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square group overflow-hidden rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105 cursor-pointer"
              onClick={() => window.open('https://www.instagram.com/fafresh.cultural.fashion/', '_blank')}
            >
              <Image
                src={image}
                alt={`Instagram Image ${index + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-sm font-medium">View on Instagram</p>
              </div>
            </div>
          ))}
        </div>
        
 
      </div>
    </section>
  );
} 