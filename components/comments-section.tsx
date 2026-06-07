"use client"

import { useEffect, useState } from "react"
import { MessageCircle, Send, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

type Comment = {
  id: string
  name: string
  body: string
  createdAt: number
}

const STORAGE_KEY = "brief-studio-comments"

function loadComments(): Comment[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Comment[]) : []
  } catch {
    return []
  }
}

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("") || "?"
}

function timeAgo(ts: number) {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

export function CommentsSection() {
  const [comments, setComments] = useState<Comment[]>([])
  const [name, setName] = useState("")
  const [body, setBody] = useState("")

  useEffect(() => {
    setComments(loadComments())
  }, [])

  function persist(next: Comment[]) {
    setComments(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // ignore
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!body.trim()) return
    const comment: Comment = {
      id: crypto.randomUUID(),
      name: name.trim() || "Anonymous",
      body: body.trim(),
      createdAt: Date.now(),
    }
    persist([comment, ...comments])
    setBody("")
  }

  function handleDelete(id: string) {
    persist(comments.filter((c) => c.id !== id))
  }

  return (
    <section className="mx-auto w-full max-w-3xl rounded-3xl border border-border bg-card/60 p-6 backdrop-blur sm:p-8">
      <div className="mb-6 flex items-center gap-2.5">
        <span className="flex size-9 items-center justify-center rounded-xl bg-secondary text-primary">
          <MessageCircle className="size-4" />
        </span>
        <div className="flex flex-col">
          <h2 className="text-base font-semibold leading-tight">Discussion</h2>
          <p className="text-xs text-muted-foreground">
            {comments.length === 0
              ? "Be the first to leave a comment"
              : `${comments.length} comment${comments.length === 1 ? "" : "s"}`}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mb-8 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="comment-name" className="text-xs text-muted-foreground">
            Name
          </Label>
          <Input
            id="comment-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (optional)"
            className="bg-background/60"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="comment-body" className="text-xs text-muted-foreground">
            Comment
          </Label>
          <Textarea
            id="comment-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Share your thoughts on this brief…"
            rows={3}
            className="resize-none bg-background/60"
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" size="sm" className="gap-2" disabled={!body.trim()}>
            <Send className="size-4" />
            Post comment
          </Button>
        </div>
      </form>

      <div className="flex flex-col gap-4">
        {comments.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">No comments yet.</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="group flex gap-3 rounded-2xl border border-border bg-background/40 p-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                {initials(c.name)}
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{c.name}</span>
                    <span className="text-xs text-muted-foreground">{timeAgo(c.createdAt)}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-7 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                    onClick={() => handleDelete(c.id)}
                    aria-label="Delete comment"
                  >
                    <Trash2 className="size-3.5 text-muted-foreground" />
                  </Button>
                </div>
                <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground/90">
                  {c.body}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
