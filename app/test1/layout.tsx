import React from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function TestLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1" style={{ height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
        <div className="container mx-auto max-w-5xl px-4"  style={{ height: 'calc(100vh - 65px)', overflowY: 'auto' }}>
          {children}
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  )
}
