'use client';

import VideoBanner from '@/components/home/VideoBanner';
import CustomizeSection from '@/components/home/CustomizeSection';
import RoyalCollection from '@/components/home/RoyalCollection';
import ShopCollection from '@/components/home/ShopCollection';
import InstagramGallery from '@/components/home/InstagramGallery';
import YouTubeEmbed from '@/components/home/YouTubeEmbed';

export default function HomePage() {
  return (
    <main>
      <VideoBanner />
      <CustomizeSection />
      <YouTubeEmbed />
      <RoyalCollection />
      <ShopCollection />
      <InstagramGallery />
    </main>
  );
} 