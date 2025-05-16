import Link from 'next/link'
import { ThemeToggle } from './theme-toggle'
import { LanguageSwitcher } from './language-switcher'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 pr-4">
          <Link href="/" className="flex pl-4 items-center space-x-2">
            <span className="text-xl font-bold">Project Mate</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/projects" className="text-sm font-medium transition-colors hover:text-primary">
              Проекты
            </Link>
            <Link href="/demo" className="text-sm font-medium transition-colors hover:text-primary">
              Примеры
            </Link>
            <Link href="/test1" className="text-sm font-medium transition-colors hover:text-primary">
              Тесты
            </Link>
          </nav>
        </div>
        <div className="flex items-right gap-4 pr-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
} 