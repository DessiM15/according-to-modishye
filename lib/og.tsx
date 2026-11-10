import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

async function loadFraunces(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch("https://fonts.googleapis.com/css2?family=Fraunces:wght@600", {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 6.1; rv:40.0) Gecko/20100101 Firefox/40.0" },
    }).then((r) => r.text());
    const url = css.match(/src: url\(([^)]+)\) format\('(?:truetype|woff)'\)/)?.[1];
    if (!url) return null;
    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export async function brandImage({ eyebrow, title, footer, colour }: { eyebrow: string; title: string; footer: string; colour: string }) {
  const font = await loadFraunces();
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#fbf7ee", color: "#1a1917", fontFamily: font ? "Fraunces" : "Georgia, serif" }}>
        <div style={{ width: 28, height: "100%", background: colour }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "56px 64px", flex: 1 }}>
          <div style={{ fontSize: 24, letterSpacing: 4, textTransform: "uppercase", color: "#6b665e", fontFamily: "monospace" }}>{eyebrow}</div>
          <div style={{ fontSize: title.length > 70 ? 56 : 72, lineHeight: 1.02, fontWeight: 600, maxWidth: 1000 }}>{title}</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 26, color: "#4b4740", fontFamily: "monospace" }}>
            <span>{footer}</span>
            <span style={{ background: "#1a1917", color: "#fbf7ee", padding: "10px 18px", borderRadius: 999 }}>Modishye</span>
          </div>
        </div>
      </div>
    ),
    { ...ogSize, fonts: font ? [{ name: "Fraunces", data: font, weight: 600, style: "normal" }] : undefined }
  );
}
