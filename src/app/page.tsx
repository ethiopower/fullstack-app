'use client';

import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Fafresh <span className="text-[hsl(280,100%,70%)]">Gift Shop</span>
        </h1>
        <div className="text-center text-white">
          <p className="text-2xl">Ethiopian Cultural Clothes</p>
          <p className="mt-2 text-lg">Always new models and fashion! Quality items at good price!</p>
          <p className="mt-1 text-sm">Inside Global Foods, Silver Spring, MD + Online</p>
        </div>
        <Link
          href="/customize/step1"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        >
          Customize Now
        </Link>
      </div>
    </main>
  )
} 