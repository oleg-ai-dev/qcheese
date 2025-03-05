import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "QCheese.com - The Ultimate Cheese Directory",
    template: "%s | QCheese.com",
  },
  description:
    "Explore our comprehensive cheese directory with detailed information on flavors, origins, and pairings for cheese lovers.",
  keywords: ["cheese", "cheese types", "cheese guide", "cheese directory", "cheese pairings"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://qcheese.com",
    siteName: "QCheese.com",
    title: "QCheese.com - The Ultimate Cheese Directory",
    description:
      "Explore our comprehensive cheese directory with detailed information on flavors, origins, and pairings for cheese lovers.",
    images: [
      {
        url: "https://qcheese.com/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "QCheese.com - The Ultimate Cheese Directory",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "QCheese.com - The Ultimate Cheese Directory",
    description:
      "Explore our comprehensive cheese directory with detailed information on flavors, origins, and pairings for cheese lovers.",
    images: ["https://qcheese.com/images/twitter-image.jpg"],
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Script
        src="https://cloud.umami.is/script.js"
        data-website-id="e87e2e0a-2dcc-47c8-8889-a7b89a136d3d"
        strategy="afterInteractive"
      />
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
