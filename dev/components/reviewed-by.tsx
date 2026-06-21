/**
 * The "Reviewed by" credibility line for money and expert pages (author E-E-A-T).
 * A mono label plus the reviewer's published alias and role. The matching Person
 * entity is added to the page's JSON-LD graph (see lib/schema personNode).
 */
export function ReviewedBy({
  name,
  role = "Co-Founder",
}: {
  name: string;
  role?: string;
}) {
  return (
    <p className="font-mono text-sm text-slate">
      <span className="uppercase tracking-[0.08em]">Reviewed by</span>{" "}
      <span className="text-ink">{name}</span>, {role}.
    </p>
  );
}
