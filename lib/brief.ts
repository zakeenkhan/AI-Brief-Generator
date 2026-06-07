export type ContentType = "Blog Post" | "Email" | "Social Media"
export type Tone = "Professional" | "Casual" | "Friendly"

export type BriefSection = {
  key: string
  title: string
}

export const BRIEF_SECTIONS: BriefSection[] = [
  { key: "targetAudience", title: "Target Audience" },
  { key: "seoKeywords", title: "SEO Keywords" },
  { key: "contentAngle", title: "Content Angle" },
  { key: "outline", title: "Outline" },
  { key: "toneGuide", title: "Tone Guide" },
  { key: "cta", title: "CTA" },
]

export const SECTION_KEYS = [
  "targetAudience",
  "seoKeywords",
  "contentAngle",
  "outline",
  "toneGuide",
  "cta",
] as const

// Possible alternate keys a webhook might return for each section.
const KEY_ALIASES: Record<string, string[]> = {
  targetAudience: ["targetAudience", "target_audience", "audience", "Target Audience"],
  seoKeywords: ["seoKeywords", "seo_keywords", "keywords", "SEO Keywords"],
  contentAngle: ["contentAngle", "content_angle", "angle", "Content Angle"],
  outline: ["outline", "Outline", "structure"],
  toneGuide: ["toneGuide", "tone_guide", "toneGuidance", "Tone Guide"],
  cta: ["cta", "CTA", "callToAction", "call_to_action"],
}

/** Format the whole brief as a clean plain-text document for "copy all". */
export function formatBriefForCopy(brief: Record<string, string>, meta?: { topic?: string; contentType?: string; tone?: string }): string {
  const lines: string[] = []
  lines.push("CONTENT BRIEF")
  if (meta?.topic) lines.push(`Topic: ${meta.topic}`)
  if (meta?.contentType) lines.push(`Content Type: ${meta.contentType}`)
  if (meta?.tone) lines.push(`Tone: ${meta.tone}`)
  lines.push("")
  BRIEF_SECTIONS.forEach((section, i) => {
    const content = brief[section.key]?.trim() || "—"
    lines.push(`${i + 1}. ${section.title.toUpperCase()}`)
    lines.push(content)
    lines.push("")
  })
  return lines.join("\n").trim()
}

export function normalizeContent(value: unknown): string {
  if (value == null) return ""
  if (typeof value === "string") return value
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? `• ${item}` : `• ${JSON.stringify(item)}`))
      .join("\n")
  }
  if (typeof value === "object") return JSON.stringify(value, null, 2)
  return String(value)
}

/** Pull the brief object out of various possible webhook response shapes. */
export function extractBrief(payload: unknown): Record<string, string> {
  let obj: Record<string, unknown> = {}
  if (payload && typeof payload === "object") {
    const p = payload as Record<string, unknown>
    if (p.data && typeof p.data === "object") obj = p.data as Record<string, unknown>
    else if (p.brief && typeof p.brief === "object") obj = p.brief as Record<string, unknown>
    else if (p.result && typeof p.result === "object") obj = p.result as Record<string, unknown>
    else obj = p
  }

  const result: Record<string, string> = {}
  for (const { key } of BRIEF_SECTIONS) {
    const aliases = KEY_ALIASES[key] ?? [key]
    const matchKey = aliases.find((a) => obj[a] !== undefined)
    result[key] = matchKey ? normalizeContent(obj[matchKey]) : ""
  }
  return result
}
