"use client"

import type React from "react"

import { useState } from "react"
import { Sparkles, Loader2, PenLine } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { ContentType, Tone } from "@/lib/brief"

export type BriefRequest = {
  topic: string
  contentType: ContentType
  tone: Tone
}

type Props = {
  loading: boolean
  onSubmit: (req: BriefRequest) => void
}

const CONTENT_TYPES: ContentType[] = ["Blog Post", "Email", "Social Media"]
const TONES: Tone[] = ["Professional", "Casual", "Friendly"]

export function BriefForm({ loading, onSubmit }: Props) {
  const [topic, setTopic] = useState("")
  const [contentType, setContentType] = useState<ContentType>("Blog Post")
  const [tone, setTone] = useState<Tone>("Professional")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!topic.trim() || loading) return
    onSubmit({ topic: topic.trim(), contentType, tone })
  }

  return (
    <div className="relative rounded-2xl border border-border bg-card/60 p-6 shadow-2xl shadow-black/20 backdrop-blur-sm sm:p-8">
      <div className="mb-6 flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-lg bg-secondary text-primary">
          <PenLine className="size-4" />
        </span>
        <div>
          <h2 className="text-sm font-semibold leading-none">New brief</h2>
          <p className="mt-1 text-xs text-muted-foreground">Describe what you want to write about</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="topic" className="text-xs uppercase tracking-wider text-muted-foreground">
            Topic
          </Label>
          <Input
            id="topic"
            placeholder="e.g. The benefits of remote work for startups"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="h-11 bg-background/60"
            required
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="content-type" className="text-xs uppercase tracking-wider text-muted-foreground">
              Content type
            </Label>
            <Select value={contentType} onValueChange={(v) => setContentType(v as ContentType)}>
              <SelectTrigger id="content-type" className="h-11 w-full bg-background/60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CONTENT_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="tone" className="text-xs uppercase tracking-wider text-muted-foreground">
              Tone
            </Label>
            <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
              <SelectTrigger id="tone" className="h-11 w-full bg-background/60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TONES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <Button type="submit" disabled={loading || !topic.trim()} className="h-11 gap-2 px-6 font-medium">
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                Generate Brief
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
