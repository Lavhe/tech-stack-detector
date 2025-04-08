import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Tech Stack Detector | Identify Website Technologies",
  description:
    "Analyze any website to discover its tech stack, including frameworks, libraries, databases, and more. Detect Firebase, Supabase, React, Next.js and other technologies.",
  keywords:
    "tech stack detector, website technology analyzer, detect firebase, detect supabase, web technology scanner, framework detector",
  openGraph: {
    title: "Tech Stack Detector | Identify Website Technologies",
    description:
      "Analyze any website to discover its tech stack, including frameworks, libraries, databases, and more.",
    url: "https://tech-stack-detector.vercel.app",
    siteName: "Tech Stack Detector",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tech Stack Detector",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tech Stack Detector | Identify Website Technologies",
    description:
      "Analyze any website to discover its tech stack, including frameworks, libraries, databases, and more.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL("https://tech-stack-detector.vercel.app"),
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'