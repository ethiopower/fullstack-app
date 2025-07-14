'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
});

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center group">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <Image
          src="/images/instagram/imgi_13_278392924_109404108407718_3275092387011595748_n.webp"
          alt="Ethiopian Fashion Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[#2F3640]/90 mix-blend-soft-light" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="relative w-32 h-32 mx-auto mb-8 invert brightness-0">
          <Image
            src="/images/fafresh-logo.png"
            alt="Fafresh Fashion Logo"
            fill
            className="object-contain"
          />
        </div>
        <div className="mb-8">
          <h1 
            className={`text-6xl md:text-8xl text-white font-medium tracking-[0.2em] leading-tight ${playfair.className}`}
          >
            FAFRESH
          </h1>
          <h2 
            className={`text-5xl md:text-7xl text-white font-medium tracking-[0.2em] leading-tight mt-2 ${playfair.className}`}
          >
            FASHION
          </h2>
        </div>
        <p 
          className="text-2xl md:text-3xl text-white/90 font-light tracking-[0.15em] mb-16 relative inline-block"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          Timeless Ethiopian elegance – made custom for you.
          <div className="absolute -bottom-4 left-0 right-0 h-0.5 bg-gradient-to-r from-[#078930] via-slate-200 to-[#EF3340] opacity-60" />
        </p>

        {/* Customize Button */}
        <Link
          href="/customize"
          className="inline-block relative group/btn"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-700 to-slate-900 rounded-lg opacity-70 group-hover/btn:opacity-100 blur transition-all duration-500" />
          <div className="relative px-12 py-5 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 transition-all duration-500 group-hover/btn:bg-white/20">
            <span className="text-white text-lg font-medium tracking-[0.3em]">
              CUSTOMIZE NOW
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
} 