import type { Metadata } from 'next'
import './globals.css'
import { QueryProvider } from '../../providers/QueryProvider'

export const metadata: Metadata = {
  title: 'Feature Flag System',
  description: 'Production-ready feature flag system with Next.js and Supabase',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}