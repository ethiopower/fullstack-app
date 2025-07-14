'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled ? 'bg-slate-900/95 backdrop-blur-sm shadow-lg' : 'bg-slate-900/30 backdrop-blur-[2px]'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-3 group"
          >
            <div className="relative w-12 h-12 invert brightness-0">
              <Image
                src="/images/fafresh-logo.png"
                alt="Fafresh Fashion Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-white text-2xl font-medium tracking-[0.2em] group-hover:opacity-80 transition-opacity">
              FAFRESH
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex space-x-12">
            <Link 
              href="/shop" 
              className={`text-white/90 text-sm font-medium tracking-[0.15em] hover:text-white transition-all relative
                ${isActive('/shop') ? 'text-white' : ''}`}
            >
              SHOP
              {isActive('/shop') && (
                <div className="absolute -bottom-1 left-0 right-0 h-px bg-white/50" />
              )}
            </Link>
            <Link 
              href="/contact" 
              className={`text-white/90 text-sm font-medium tracking-[0.15em] hover:text-white transition-all relative
                ${isActive('/contact') ? 'text-white' : ''}`}
            >
              CONTACT US
              {isActive('/contact') && (
                <div className="absolute -bottom-1 left-0 right-0 h-px bg-white/50" />
              )}
            </Link>
            <Link 
              href="/customize" 
              className={`text-white/90 text-sm font-medium tracking-[0.15em] hover:text-white transition-all relative
                ${isActive('/customize') ? 'text-white' : ''}`}
            >
              CUSTOMIZE
              {isActive('/customize') && (
                <div className="absolute -bottom-1 left-0 right-0 h-px bg-white/50" />
              )}
            </Link>
          </div>
        </div>
      </nav>
      
      {/* Ethiopian flag colors bar */}
      <div className="h-0.5 w-full bg-gradient-to-r from-[#078930] via-slate-200 to-[#EF3340] opacity-60" />
    </header>
  );
} 