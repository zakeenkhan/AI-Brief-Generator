import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { webhookUrl, topic, contentType, tone } = body ?? {}

    if (!webhookUrl || typeof webhookUrl !== "string") {
      return NextResponse.json({ error: "Missing generate webhook URL." }, { status: 400 })
    }
    if (!topic) {
      return NextResponse.json({ error: "Topic is required." }, { status: 400 })
    }

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, contentType, tone }),
    })

    const text = await res.text()
    if (!res.ok) {
      return NextResponse.json(
        { error: `Webhook responded with ${res.status}`, detail: text.slice(0, 500) },
        { status: 502 },
      )
    }

    let data: unknown
    try {
      data = JSON.parse(text)
    } catch {
      data = { raw: text }
    }

    return NextResponse.json({ data })
  } catch (err) {
    console.log("[v0] generate route error:", (err as Error).message)
    return NextResponse.json({ error: "Failed to reach the webhook." }, { status: 500 })
  }
}
