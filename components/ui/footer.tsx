export function Footer() {
  return (
    <footer className="border-t pl-8 py-4 md:py-0">
      <div className="container flex flex-col items-center justify-end gap-4 md:h-24 md:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0 text-right">
          <p className="text-right text-sm leading-loose text-muted-foreground md:text-right">
            <span className="font-medium">Project Mate © {new Date().getFullYear()} All rights reserved</span>
          </p>
        </div>
      </div>
    </footer>
  )
} 