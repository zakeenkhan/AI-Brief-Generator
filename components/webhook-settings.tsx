"use client"

import { useEffect, useState } from "react"
import { Settings2, Check, Webhook, Trash2 } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { WebhookConfig } from "@/hooks/use-webhook-config"

type Props = {
  config: WebhookConfig
  onSave: (config: WebhookConfig) => void
}

export function WebhookSettings({ config, onSave }: Props) {
  const [open, setOpen] = useState(false)
  const [generateUrl, setGenerateUrl] = useState(config.generateUrl)
  const [historyUrl, setHistoryUrl] = useState(config.historyUrl)
  const [saved, setSaved] = useState(false)

  // Keep the local inputs in sync with the saved config (e.g. once it loads
  // from localStorage, or when reopening the popover) so values never appear
  // to vanish on their own.
  useEffect(() => {
    setGenerateUrl(config.generateUrl)
    setHistoryUrl(config.historyUrl)
  }, [config.generateUrl, config.historyUrl, open])

  function handleSave() {
    onSave({ generateUrl: generateUrl.trim(), historyUrl: historyUrl.trim() })
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
    if (generateUrl.trim()) setTimeout(() => setOpen(false), 600)
  }

  function handleClear() {
    setGenerateUrl("")
    setHistoryUrl("")
    onSave({ generateUrl: "", historyUrl: "" })
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="inline-flex h-8 items-center gap-2 rounded-md border border-border bg-card/60 px-3 text-xs font-medium transition-colors hover:bg-secondary">
        <Settings2 className="size-3.5" />
        Webhooks
        <span
          className={`flex size-1.5 rounded-full ${config.generateUrl ? "bg-primary" : "bg-muted-foreground"}`}
        />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[340px] p-0">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <Webhook className="size-4 text-primary" />
          <span className="text-sm font-medium">Webhook configuration</span>
        </div>
        <div className="flex flex-col gap-4 p-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="generate-url" className="text-xs text-muted-foreground">
              Generate URL (POST)
            </Label>
            <Input
              id="generate-url"
              type="url"
              placeholder="https://your-automation.com/generate"
              value={generateUrl}
              onChange={(e) => setGenerateUrl(e.target.value)}
              className="h-9 bg-background/60 text-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="history-url" className="text-xs text-muted-foreground">
              History URL (GET)
            </Label>
            <Input
              id="history-url"
              type="url"
              placeholder="https://your-automation.com/history"
              value={historyUrl}
              onChange={(e) => setHistoryUrl(e.target.value)}
              className="h-9 bg-background/60 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" onClick={handleSave} size="sm" className="flex-1 gap-2">
              {saved ? <Check className="size-4" /> : null}
              {saved ? "Saved" : "Save URLs"}
            </Button>
            <Button
              type="button"
              onClick={handleClear}
              size="sm"
              variant="outline"
              disabled={!config.generateUrl && !config.historyUrl}
              className="gap-2 bg-transparent"
            >
              <Trash2 className="size-4" />
              Clear
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            URLs are saved in this browser and stay until you clear them.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  )
}
