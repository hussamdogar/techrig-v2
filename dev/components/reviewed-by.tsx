/**
 * The "Reviewed by" credibility line for money and expert pages (author E-E-A-T).
 * A mono label plus the reviewer's published alias and role. The matching Person
 * entity is added to the page's JSON-LD graph (see lib/schema personNode).
 * `tone="dark"` is for the dark (Ink) page heroes.
 */
export function ReviewedBy({
  name,
  role = "Co-Founder",
  tone = "light",
}: {
  name: string;
  role?: string;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <p className={`font-mono text-sm ${dark ? "text-cloud/70" : "text-slate"}`}>
      <span className="uppercase tracking-[0.08em]">Reviewed by</span>{" "}
      <span className={dark ? "text-cloud" : "text-ink"}>{name}</span>, {role}.
    </p>
  );
}
