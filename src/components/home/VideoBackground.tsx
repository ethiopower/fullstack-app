'use client';

export default function VideoBackground() {
  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      className="absolute top-1/2 left-1/2 w-full h-full object-cover -translate-x-1/2 -translate-y-1/2"
    >
      <source src="/images/BANNERFAFRESH2.mp4" type="video/mp4" />
    </video>
  );
} 