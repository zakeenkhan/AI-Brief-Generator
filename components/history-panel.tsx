"use client"

import type React from "react"
import useSWR from "swr"
import { Loader2, History, AlertCircle, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type HistoryItem = {
  id?: string | number
  topic?: string
  contentType?: string
  content_type?: string
  tone?: string
  createdAt?: string
  created_at?: string
  date?: string
  [key: string]: unknown
}

async function fetcher(url: string) {
  const res = await fetch(url)
  const json = await res.json()
  if (!res.ok) throw new Error(json?.error || "Failed to load history")
  return json
}

function normalizeItems(payload: unknown): HistoryItem[] {
  if (!payload) return []
  const p = payload as Record<string, unknown>
  const data = (p.data ?? p) as unknown
  if (Array.isArray(data)) return data as HistoryItem[]
  if (data && typeof data === "object") {
    const d = data as Record<string, unknown>
    for (const key of ["history", "items", "results", "records"]) {
      if (Array.isArray(d[key])) return d[key] as HistoryItem[]
    }
  }
  return []
}

function formatDate(item: HistoryItem): string {
  const raw = item.createdAt || item.created_at || item.date
  if (!raw) return ""
  const d = new Date(raw)
  if (Number.isNaN(d.getTime())) return String(raw)
  return d.toLocaleString()
}

export function HistoryPanel({ historyUrl }: { historyUrl: string }) {
  const key = historyUrl ? `/api/history?webhookUrl=${encodeURIComponent(historyUrl)}` : null
  const { data, error, isLoading } = useSWR(key, fetcher, {
    revalidateOnFocus: false,
  })

  if (!historyUrl) {
    return (
      <EmptyState
        icon={<History className="size-7 text-muted-foreground" />}
        text="Add a history webhook URL from the Webhooks menu to view past briefs."
      />
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card/40 py-16">
        <Loader2 className="size-7 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading history…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-destructive/40 bg-destructive/5 py-14 text-center">
        <AlertCircle className="size-7 text-destructive" />
        <p className="text-sm text-destructive">{(error as Error).message}</p>
      </div>
    )
  }

  const items = normalizeItems(data)

  if (items.length === 0) {
    return <EmptyState icon={<FileText className="size-7 text-muted-foreground" />} text="No briefs in history yet." />
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => {
        const type = item.contentType || item.content_type
        const date = formatDate(item)
        return (
          <div
            key={item.id ?? i}
            className="flex flex-col gap-3 rounded-2xl border border-border bg-card/60 p-5 transition-colors hover:border-primary/40 hover:bg-card"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h3 className="text-base font-semibold text-pretty">{item.topic || "Untitled brief"}</h3>
              {date && <span className="text-xs text-muted-foreground">{date}</span>}
            </div>
            <div className="flex flex-wrap gap-2">
              {type && <Badge variant="secondary">{String(type)}</Badge>}
              {item.tone && <Badge variant="outline">{String(item.tone)}</Badge>}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card/20 py-16 text-center">
      <span className="flex size-11 items-center justify-center rounded-xl bg-secondary">{icon}</span>
      <p className="max-w-xs text-sm text-muted-foreground">{text}</p>
    </div>
  )
}
