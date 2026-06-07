import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const webhookUrl = req.nextUrl.searchParams.get("webhookUrl")

    if (!webhookUrl) {
      return NextResponse.json({ error: "Missing history webhook URL." }, { status: 400 })
    }

    const res = await fetch(webhookUrl, { method: "GET" })
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
    console.log("[v0] history route error:", (err as Error).message)
    return NextResponse.json({ error: "Failed to reach the webhook." }, { status: 500 })
  }
}
