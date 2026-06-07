"use client"

import { useState } from "react"
import { Sparkles, History as HistoryIcon, Loader2, AlertCircle, ArrowRight } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { BriefForm, type BriefRequest } from "@/components/brief-form"
import { ResultsGrid } from "@/components/results-grid"
import { CommentsSection } from "@/components/comments-section"
import { SiteFooter } from "@/components/site-footer"
import { HistoryPanel } from "@/components/history-panel"
import { WebhookSettings } from "@/components/webhook-settings"
import { useWebhookConfig } from "@/hooks/use-webhook-config"
import { extractBrief } from "@/lib/brief"

export default function Page() {
  const { config, save, loaded } = useWebhookConfig()
  const [loading, setLoading] = useState(false)
  const [brief, setBrief] = useState<Record<string, string> | null>(null)
  const [meta, setMeta] = useState<BriefRequest | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleGenerate(req: BriefRequest) {
    if (!config.generateUrl) {
      toast.error("Add a generate webhook URL in the configuration first.")
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ webhookUrl: config.generateUrl, ...req }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "Failed to generate brief")
      setBrief(extractBrief(json))
      setMeta(req)
      toast.success("Brief generated")
    } catch (err) {
      const message = (err as Error).message
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background grid + glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 80% 50% at 50% 0%, black 40%, transparent 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]"
      />

      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Sparkles className="size-4" />
            </span>
            <span className="text-sm font-semibold tracking-tight">Brief Studio</span>
            <span className="ml-1 hidden rounded-full border border-border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:inline">
              AI
            </span>
          </div>
          {loaded && <WebhookSettings config={config} onSave={save} />}
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
        {/* Hero */}
        <section className="flex flex-col items-center gap-5 pt-16 pb-12 text-center sm:pt-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 text-xs text-muted-foreground">
            <span className="flex size-1.5 rounded-full bg-primary" />
            Powered by your webhook automation
          </div>
          <h1 className="max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-6xl">
            Turn one topic into a complete{" "}
            <span className="text-primary">content brief</span>
          </h1>
          <p className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Audience, SEO keywords, angle, outline, tone guide, and CTA — generated in seconds and
            saved to your history.
          </p>
        </section>

        <Tabs defaultValue="generate" className="w-full">
          <div className="flex justify-center">
            <TabsList className="h-10 rounded-full border border-border bg-card/60 p-1 backdrop-blur">
              <TabsTrigger value="generate" className="gap-2 rounded-full px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Sparkles className="size-4" />
                Generate
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-2 rounded-full px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <HistoryIcon className="size-4" />
                History
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="generate" className="mt-8 flex flex-col gap-8">
            <BriefForm loading={loading} onSubmit={handleGenerate} />

            {loading && (
              <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card/40 py-20">
                <div className="relative flex size-12 items-center justify-center">
                  <span className="absolute inline-flex size-12 animate-ping rounded-full bg-primary/20" />
                  <Loader2 className="size-7 animate-spin text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">Generating your content brief</p>
                  <p className="text-xs text-muted-foreground">Crafting six sections from your topic…</p>
                </div>
              </div>
            )}

            {!loading && error && (
              <div className="flex flex-col items-center gap-2 rounded-2xl border border-destructive/40 bg-destructive/5 py-14 text-center">
                <AlertCircle className="size-7 text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {!loading && !error && brief && (
              <section className="flex flex-col gap-5">
                <ResultsGrid
                  brief={brief}
                  meta={
                    meta
                      ? { topic: meta.topic, contentType: meta.contentType, tone: meta.tone }
                      : undefined
                  }
                />
              </section>
            )}

            {!loading && !error && !brief && (
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card/20 py-16 text-center">
                <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
                  <ArrowRight className="size-5" />
                </span>
                <p className="text-sm text-muted-foreground">
                  Fill in a topic above and generate to see your six-part brief here.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-8">
            <HistoryPanel historyUrl={config.historyUrl} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
