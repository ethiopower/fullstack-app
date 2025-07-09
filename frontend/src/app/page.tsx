import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

export default function Home() {
  return (
    <main>
      {/* Hero section */}
      <div className="relative isolate">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:gap-x-10 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
            <div className="flex">
              <div className="relative flex items-center gap-x-4 rounded-full px-4 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                <span className="font-semibold text-accent-DEFAULT">New</span>
                <span className="h-4 w-px bg-gray-900/10" aria-hidden="true" />
                <Link href="/designs" className="flex items-center gap-x-1">
                  See latest designs
                  <ArrowRightIcon className="h-5 w-5" aria-hidden="true" />
                </Link>
              </div>
            </div>
            <h1 className="mt-10 max-w-lg text-4xl font-heading font-bold tracking-tight text-gray-900 sm:text-6xl">
              Custom Ethiopian Cultural Fashion
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Experience the beauty of Ethiopian traditional clothing, tailored just for you. Our custom-made cultural fashion pieces blend authentic designs with modern comfort.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link
                href="/customize"
                className="rounded-md bg-accent-DEFAULT px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-accent-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-DEFAULT"
              >
                Start Customization
              </Link>
              <Link href="/about" className="text-sm font-semibold leading-6 text-gray-900">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow">
            {/* Add a placeholder for hero image - will be replaced with actual product image */}
            <div className="relative h-[600px] w-full rounded-2xl bg-gray-900/5 object-cover">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                Hero Image Placeholder
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-heading font-bold tracking-tight text-gray-900 sm:text-4xl">
              Featured Designs
            </h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              Discover our collection of handcrafted Ethiopian cultural fashion pieces.
            </p>
          </div>
          {/* Add featured products grid here */}
        </div>
      </div>
    </main>
  )
} 