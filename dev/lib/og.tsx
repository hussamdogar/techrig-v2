import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * The per-page Open Graph image template (design-system §8): 1200x630, Ink
 * field, the mono wordmark lockup, a Plex Mono category tag, the page title in
 * Archivo, and a Signal rule. One template, per-page variants by title +
 * category. Every routable page renders its own via app/.../opengraph-image.tsx,
 * so no page ships a placeholder.
 *
 * Fonts are read from the vendored @fontsource woff files (satori supports woff),
 * so there is no build-time network call. Amber is the rule only, never text.
 */
const fontDir = join(process.cwd(), "node_modules", "@fontsource");
const archivo800 = readFileSync(
  join(fontDir, "archivo/files/archivo-latin-800-normal.woff"),
);
const plexMono600 = readFileSync(
  join(fontDir, "ibm-plex-mono/files/ibm-plex-mono-latin-600-normal.woff"),
);

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const ink = "#0E2233";
const cloud = "#FFFFFF";
const signal = "#E89A3C";

export function ogImage({
  title,
  category,
}: {
  title: string;
  category: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: ink,
          padding: "72px",
          fontFamily: "PlexMono",
        }}
      >
        {/* Wordmark lockup: TECH [amber tick] RIG in mono. */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            color: cloud,
            fontSize: 38,
            letterSpacing: 4,
          }}
        >
          <span>TECH</span>
          <div
            style={{
              width: 22,
              height: 22,
              background: signal,
              borderRadius: 3,
              margin: "0 12px",
            }}
          />
          <span>RIG</span>
        </div>

        {/* Category tag + title. */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              color: "rgba(255,255,255,0.7)",
              fontSize: 24,
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            {category}
          </div>
          {/* Signal rule. */}
          <div
            style={{
              width: 88,
              height: 6,
              background: signal,
              borderRadius: 3,
              margin: "20px 0 28px",
            }}
          />
          <div
            style={{
              display: "flex",
              fontFamily: "Archivo",
              fontWeight: 800,
              color: cloud,
              fontSize: 68,
              lineHeight: 1.05,
              maxWidth: 960,
            }}
          >
            {title}
          </div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Archivo", data: archivo800, weight: 800, style: "normal" },
        { name: "PlexMono", data: plexMono600, weight: 600, style: "normal" },
      ],
    },
  );
}
