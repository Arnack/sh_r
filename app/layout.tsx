import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageProvider } from "@/context/language-provider"
import { ThemeProvider } from "next-themes"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const inter = Inter({ subsets: ["latin", "cyrillic"] })

export const metadata: Metadata = {
  title: "Project Mate",
  description: "Ваш надежный помощник в управлении проектами",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            <div className="relative flex min-h-screen flex-col">
              {/* <Header /> */}
              <main className="flex-1">{children}</main>
              {/* <Footer /> */}
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
