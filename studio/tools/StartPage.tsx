import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { useClient, useCurrentUser } from "sanity";
import { useRouter } from "sanity/router";
import { brand } from "../brand";
import { shelves } from "../shelves";

type Recent = { _id: string; title?: string; publishedAt?: string; shelf?: string; hasDraft: boolean; isPublished: boolean };

const page: CSSProperties = { minHeight: "100%", background: brand.paper, color: brand.ink, fontFamily: brand.body, padding: "clamp(1.25rem, 4vw, 3rem)" };
const wrap: CSSProperties = { maxWidth: 880, margin: "0 auto" };
const h1: CSSProperties = { fontFamily: brand.display, fontSize: "clamp(1.9rem, 4vw, 2.6rem)", fontWeight: 600, lineHeight: 1.1, margin: "0.4rem 0 0" };
const hand: CSSProperties = { fontFamily: brand.hand, fontSize: "1.4rem", color: brand.coralDeep, margin: 0 };
const eyebrow: CSSProperties = { fontFamily: "'DM Mono', ui-monospace, monospace", fontSize: "0.72rem", letterSpacing: "0.16em", textTransform: "uppercase", color: brand.ink3, margin: 0 };
const card: CSSProperties = { background: "#fff", border: `2px solid ${brand.ink}`, borderRadius: 16, boxShadow: `4px 4px 0 ${brand.ink}`, padding: "1.25rem 1.4rem" };

function BigButton({ colour, title, body, onClick }: { colour: string; title: string; body: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ ...card, background: colour, color: colour === brand.magenta ? "#000" : brand.ink, textAlign: "left", cursor: "pointer", fontFamily: brand.body, width: "100%", transition: "transform 120ms" }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "translate(2px,2px)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
    >
      <span style={{ display: "block", fontFamily: brand.display, fontSize: "1.45rem", fontWeight: 600, lineHeight: 1.15 }}>{title}</span>
      <span style={{ display: "block", marginTop: 6, fontSize: "0.95rem", opacity: 0.9 }}>{body}</span>
    </button>
  );
}

function SmallButton({ children, onClick, primary }: { children: ReactNode; onClick: () => void; primary?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ fontFamily: brand.body, fontWeight: 600, fontSize: "0.9rem", padding: "0.45rem 0.9rem", borderRadius: 999, border: `2px solid ${brand.ink}`, background: primary ? brand.ink : "#fff", color: primary ? brand.paper : brand.ink, cursor: "pointer" }}
    >
      {children}
    </button>
  );
}

const steps = [
  ["Write", "Click Write a new article. The page opens already laid out. Replace the placeholder text with yours."],
  ["Fill the four boxes", "Title, shelf, cover image and a one-line description of the image. Everything else is generated."],
  ["Preview", "Preview on site shows it on the real website in a new tab. Nobody else can see it yet."],
  ["Publish", "Click Publish. It is live within a minute. Edit and publish again any time."],
];

// The first thing she sees. Two buttons, her recent articles, and the four steps.
export function StartPage() {
  const user = useCurrentUser();
  const router = useRouter();
  const client = useClient({ apiVersion: "2025-01-01" });
  const [recent, setRecent] = useState<Recent[] | null>(null);

  useEffect(() => {
    let live = true;
    client
      .fetch<Recent[]>(
        `*[_type == "article"] | order(_updatedAt desc) {
          "_id": select(_id in path("drafts.**") => string::split(_id, "drafts.")[1], _id),
          title, publishedAt, shelf,
          "hasDraft": _id in path("drafts.**"),
          "isPublished": !(_id in path("drafts.**"))
        }`
      )
      .then((rows) => {
        if (!live) return;
        const seen = new Map<string, Recent>();
        for (const r of rows) {
          const prev = seen.get(r._id);
          seen.set(r._id, { ...r, hasDraft: (prev?.hasDraft ?? false) || r.hasDraft, isPublished: (prev?.isPublished ?? false) || r.isPublished });
        }
        setRecent([...seen.values()].slice(0, 6));
      })
      .catch(() => live && setRecent([]));
    return () => {
      live = false;
    };
  }, [client]);

  const first = user?.name?.split(" ")[0] ?? "there";
  const newArticle = () => router.navigateIntent("create", { type: "article", template: "article-template" });
  const edit = (id: string) => router.navigateIntent("edit", { id, type: "article" });
  const go = (path: string) => router.navigateUrl({ path });
  const shelfName = (slug?: string) => shelves.find((s) => s.value === slug)?.title.replace(/^Chapter \w+: /, "") ?? "";

  return (
    <div style={page}>
      <div style={wrap}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <img src="/static/yeye-logo.png" alt="" style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", background: brand.gold, border: `2px solid ${brand.ink}` }} />
          <div>
            <p style={hand}>Your publishing desk</p>
            <h1 style={h1}>Hi {first}. What are we doing today?</h1>
          </div>
        </div>

        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", marginTop: "1.8rem" }}>
          <BigButton colour={brand.coral} title="Write a new article" body="Opens your blog post template, ready to fill in." onClick={newArticle} />
          <BigButton colour={brand.gold} title="Edit an article" body="Every article you have published, newest first." onClick={() => go("/content/articles")} />
        </div>

        <section style={{ marginTop: "2.4rem" }}>
          <p style={eyebrow}>Recently touched</p>
          <div style={{ ...card, padding: 0, marginTop: 10, overflow: "hidden" }}>
            {recent === null && <p style={{ margin: 0, padding: "1rem 1.4rem", color: brand.ink3 }}>Loading your articles…</p>}
            {recent?.length === 0 && <p style={{ margin: 0, padding: "1rem 1.4rem", color: brand.ink3 }}>No articles yet. Click Write a new article.</p>}
            {recent?.map((r, i) => (
              <div key={r._id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "0.8rem 1.4rem", borderTop: i ? `1px solid ${brand.line}` : "none" }}>
                <span style={{ ...hand, fontSize: "1.2rem", width: 28, color: brand.ink3 }}>{String(i + 1).padStart(2, "0")}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: brand.display, fontWeight: 600, fontSize: "1.05rem", lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.title || "Untitled"}</div>
                  <div style={{ fontSize: "0.8rem", color: brand.ink3, marginTop: 2 }}>
                    {[shelfName(r.shelf), r.hasDraft && r.isPublished ? "has unpublished changes" : r.hasDraft ? "draft, not published" : r.publishedAt ? new Date(r.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : null].filter(Boolean).join(" · ")}
                  </div>
                </div>
                <SmallButton onClick={() => edit(r._id)}>Edit</SmallButton>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12 }}>
            <SmallButton onClick={() => go("/content/articles")} primary>
              All articles
            </SmallButton>
            <SmallButton onClick={() => go("/content/guides")}>Guides (shop)</SmallButton>
            <SmallButton onClick={() => go("/content/legal")}>Legal pages</SmallButton>
          </div>
        </section>

        <section style={{ marginTop: "2.4rem" }}>
          <p style={eyebrow}>How publishing works</p>
          <ol style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", listStyle: "none", padding: 0, margin: "10px 0 0" }}>
            {steps.map(([title, body], i) => (
              <li key={title} style={{ ...card, boxShadow: "none", background: brand.paper2, borderColor: brand.line }}>
                <p style={{ ...hand, fontSize: "1.3rem" }}>0{i + 1}</p>
                <p style={{ fontFamily: brand.display, fontWeight: 600, fontSize: "1.1rem", margin: "4px 0 0" }}>{title}</p>
                <p style={{ margin: "6px 0 0", fontSize: "0.9rem", color: brand.ink2, lineHeight: 1.45 }}>{body}</p>
              </li>
            ))}
          </ol>
          <p style={{ marginTop: 14, fontSize: "0.85rem", color: brand.ink3 }}>Something looks wrong on the site? Use the contact form at smartscaleagent.com/contact and say which article.</p>
        </section>
      </div>
    </div>
  );
}
