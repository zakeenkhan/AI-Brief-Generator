"use client"

import { useEffect, useState } from "react"

export type WebhookConfig = {
  generateUrl: string
  historyUrl: string
}

const STORAGE_KEY = "ai-brief-webhooks"

export function useWebhookConfig() {
  const [config, setConfig] = useState<WebhookConfig>({ generateUrl: "", historyUrl: "" })
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setConfig(JSON.parse(raw))
    } catch {
      // ignore
    }
    setLoaded(true)
  }, [])

  function save(next: WebhookConfig) {
    setConfig(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // ignore
    }
  }

  return { config, save, loaded }
}
