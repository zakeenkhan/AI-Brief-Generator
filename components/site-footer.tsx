import { Sparkles } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="relative border-t border-border/60 bg-background/70">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-10 text-center sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Sparkles className="size-4" />
          </span>
          <span className="text-sm font-semibold tracking-tight">Brief Studio</span>
        </div>
        <p className="max-w-md text-pretty text-sm text-muted-foreground">
          Turn a single topic into a complete, ready-to-use content brief.
        </p>
        <div className="flex flex-col items-center gap-1 pt-2">
          <p className="text-sm">
            Made by <span className="font-semibold text-foreground">Zakeen Khan</span>
          </p>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Brief Studio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
