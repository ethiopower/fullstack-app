'use client';

import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Import the video component with no SSR
const VideoBackground = dynamic(() => import('./VideoBackground'), {
  ssr: false
});

export default function VideoBanner() {
  const router = useRouter();

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <VideoBackground />
      
      {/* Content Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center">
        <div className="text-center text-white space-y-6 px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 font-heading">
            FAFRESH FASHION
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Timeless Ethiopian elegance – made custom for you
          </p>
          <button
            onClick={() => router.push('/customize/step1')}
            className="px-8 py-4 bg-gradient-to-r from-slate-700 to-slate-900 text-white rounded-lg text-lg font-semibold hover:from-slate-800 hover:to-slate-950 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Customize Your Design
          </button>
        </div>
      </div>
    </div>
  );
} 