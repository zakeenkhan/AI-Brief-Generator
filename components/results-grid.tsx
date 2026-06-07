"use client"

import { useState } from "react"
import {
  Users,
  Search,
  Lightbulb,
  ListOrdered,
  MessageSquareQuote,
  MousePointerClick,
  Copy,
  Check,
  CopyCheck,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { BRIEF_SECTIONS, formatBriefForCopy } from "@/lib/brief"

const ICONS = {
  targetAudience: Users,
  seoKeywords: Search,
  contentAngle: Lightbulb,
  outline: ListOrdered,
  toneGuide: MessageSquareQuote,
  cta: MousePointerClick,
} as const

type Meta = { topic?: string; contentType?: string; tone?: string }

export function ResultsGrid({ brief, meta }: { brief: Record<string, string>; meta?: Meta }) {
  const [copiedAll, setCopiedAll] = useState(false)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      return false
    }
  }

  async function handleCopyAll() {
    const ok = await copyText(formatBriefForCopy(brief, meta))
    if (ok) {
      setCopiedAll(true)
      setTimeout(() => setCopiedAll(false), 1600)
    }
  }

  async function handleCopySection(key: string, content: string) {
    const ok = await copyText(content)
    if (ok) {
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 1500)
    }
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card/70 shadow-2xl shadow-black/20 backdrop-blur">
      {/* Card header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-secondary/30 px-6 py-5">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <FileText className="size-5" />
          </span>
          <div className="flex flex-col">
            <h2 className="text-base font-semibold leading-tight text-balance">
              {meta?.topic || "Content Brief"}
            </h2>
            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
              {meta?.contentType && (
                <span className="rounded-full bg-secondary px-2 py-0.5 font-medium text-foreground/80">
                  {meta.contentType}
                </span>
              )}
              {meta?.tone && (
                <span className="rounded-full bg-secondary px-2 py-0.5 font-medium text-foreground/80">
                  {meta.tone}
                </span>
              )}
              <span>6 sections</span>
            </div>
          </div>
        </div>
        <Button onClick={handleCopyAll} size="sm" className="gap-2">
          {copiedAll ? <CopyCheck className="size-4" /> : <Copy className="size-4" />}
          {copiedAll ? "Copied all" : "Copy all"}
        </Button>
      </div>

      {/* Sections */}
      <div className="divide-y divide-border">
        {BRIEF_SECTIONS.map((section, i) => {
          const Icon = ICONS[section.key as keyof typeof ICONS]
          const content = brief[section.key] ?? ""
          const isEmpty = !content.trim()
          const copied = copiedKey === section.key
          return (
            <div
              key={section.key}
              className="group grid grid-cols-1 gap-3 px-6 py-5 transition-colors hover:bg-secondary/20 sm:grid-cols-[200px_1fr]"
            >
              <div className="flex items-start gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Icon className="size-4" />
                </span>
                <div className="flex flex-col">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-sm font-semibold leading-tight text-pretty">{section.title}</h3>
                </div>
              </div>

              <div className="flex items-start justify-between gap-3">
                <p
                  className={cn(
                    "flex-1 whitespace-pre-wrap text-sm leading-relaxed",
                    isEmpty ? "italic text-muted-foreground/60" : "text-foreground/90",
                  )}
                >
                  {isEmpty ? "No content provided for this section." : content}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                  onClick={() => handleCopySection(section.key, content)}
                  disabled={isEmpty}
                  aria-label={`Copy ${section.title}`}
                >
                  {copied ? (
                    <Check className="size-4 text-primary" />
                  ) : (
                    <Copy className="size-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
