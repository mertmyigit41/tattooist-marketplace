import { NextResponse } from "next/server";

/**
 * Optional AI image generation. When OPENAI_API_KEY is set, generates concept art
 * with gpt-image-1; otherwise returns { source: "curated" } and the client falls
 * back to curated concept art + a CSS high-contrast stencil filter.
 */
export async function POST(req: Request) {
  const { prompt, style, placement } = (await req.json()) as { prompt: string; style: string; placement: string };
  const key = process.env.OPENAI_API_KEY;
  if (!key) return NextResponse.json({ source: "curated" });

  try {
    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt: `Tattoo concept art, ${style} style, designed for ${placement}. ${prompt}. High contrast, clean composition, studio reference quality, on skin.`,
        size: "1024x1024",
        quality: "medium",
      }),
    });
    if (!res.ok) throw new Error(await res.text());
    const data = (await res.json()) as { data: { b64_json?: string; url?: string }[] };
    const img = data.data?.[0];
    const concept = img?.url ?? (img?.b64_json ? `data:image/png;base64,${img.b64_json}` : null);
    if (!concept) throw new Error("No image returned");
    return NextResponse.json({ source: "ai", concept });
  } catch (e) {
    console.error("AI generation failed, falling back to curated", e);
    return NextResponse.json({ source: "curated" });
  }
}
