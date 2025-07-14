'use client';

import Image from 'next/image';
import Link from 'next/link';

interface CollectionItem {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
}

const collections: CollectionItem[] = [
  {
    id: '1',
    name: 'Traditional Habesha Dress',
    description: 'Modern take on traditional Ethiopian dress',
    price: '$199',
    imageUrl: '/images/instagram/imgi_13_278392924_109404108407718_3275092387011595748_n.webp'
  },
  {
    id: '2',
    name: 'Ethiopian Modern Suit',
    description: 'Contemporary suit with Ethiopian details',
    price: '$299',
    imageUrl: '/images/instagram/imgi_18_285489417_338460055105426_9071859713693865775_n.webp'
  },
  {
    id: '3',
    name: 'Fusion Collection',
    description: 'Where tradition meets modern style',
    price: '$249',
    imageUrl: '/images/instagram/imgi_12_278236374_709188663444049_484472670772547167_n.webp'
  }
];

const ethiopianColors = {
  green: '#078930',  // Ethiopian flag green
  yellow: '#FDEF42', // Ethiopian flag yellow
  red: '#EF3340',    // Ethiopian flag red
};

export default function ShopCollection() {
  return (
    <section className="relative py-16">
      {/* Ethiopian-inspired background pattern */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,#078930_25%,transparent_25%),linear-gradient(-45deg,#FDEF42_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#EF3340_75%),linear-gradient(-45deg,transparent_75%,#078930_75%)]" style={{ backgroundSize: '20px 20px' }}></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#078930] via-[#FDEF42] to-[#EF3340]">
            Ethiopian Collection
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our unique pieces that blend Ethiopian heritage with contemporary fashion
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((item) => (
            <div 
              key={item.id}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-96 w-full overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                {/* Ethiopian colors gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#078930]/20 via-[#FDEF42]/20 to-[#EF3340]/20" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white backdrop-blur-sm bg-black/30">
                <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                <p className="text-sm opacity-90 mb-3">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">{item.price}</span>
                  <Link 
                    href={`/shop/${item.id}`}
                    className="relative overflow-hidden group-hover:scale-105 transition-transform px-4 py-2 rounded-full text-white border-2 border-[#FDEF42] hover:bg-[#FDEF42] hover:text-black"
                  >
                    View Details
                  </Link>
                </div>
              </div>

              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#FDEF42] text-black">
                  New Arrival
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/shop"
            className="relative inline-flex items-center px-8 py-4 border-2 border-[#078930] text-lg font-medium rounded-full text-white overflow-hidden group"
          >
            <span className="relative z-10">View All Collections</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#078930] via-[#FDEF42] to-[#EF3340] group-hover:animate-gradient-x"></div>
          </Link>
        </div>
      </div>
    </section>
  );
} 