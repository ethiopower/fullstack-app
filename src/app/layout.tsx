import { Suspense } from 'react'
import { Providers } from './providers'
import { poppins, inter } from '@/lib/fonts'
import './globals.css'

export const metadata = {
  title: 'Fafresh Fashion - Ethiopian Cultural Fashion in Silver Spring, MD',
  description: 'Experience authentic Ethiopian cultural fashion at Fafresh Fashion, located in Silver Spring, MD. Traditional designs, modern styles, and custom tailoring services.',
  openGraph: {
    title: 'Fafresh Fashion - Ethiopian Cultural Fashion',
    description: 'Experience authentic Ethiopian cultural fashion at our store in Silver Spring, MD. Visit us at Global Foods, 13814 Outlet Dr.',
    type: 'website',
    locale: 'en_US',
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
  alternates: {
    canonical: 'https://www.fafreshfashion.com',
  },
}

function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${poppins.variable} ${inter.variable}`}>
      <body suppressHydrationWarning>
        <Providers>
          <Suspense fallback={<Loading />}>
            {children}
          </Suspense>
        </Providers>
      </body>
    </html>
  )
} 