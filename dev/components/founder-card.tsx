/**
 * The founder card (design-system §8): EXACTLY TWO are ever rendered (Adam Smith,
 * Robert Hooke), aliases only, never a third founder. A Plex Mono initial
 * monogram on an Ink tile stands in for a photo (photos need client approval, so
 * the page ships without them). The `id` is the stable anchor (#adam-smith /
 * #robert-hooke) that money-page and blog "Reviewed by" references land on.
 */
export function FounderCard({
  id,
  name,
  role,
  bio,
  initials,
}: {
  id: string;
  name: string;
  role: string;
  bio: string;
  initials: string;
}) {
  return (
    <div
      id={id}
      className="flex h-full scroll-mt-24 flex-col rounded-card border border-slate/15 bg-cloud p-6"
    >
      <span
        aria-hidden
        className="flex h-14 w-14 items-center justify-center rounded-full bg-ink font-mono text-lg font-semibold text-cloud"
      >
        {initials}
      </span>
      <h3 className="mt-4 font-display text-xl font-semibold text-ink">{name}</h3>
      <p className="font-mono text-sm text-slate">{role}</p>
      <p className="mt-3 text-slate">{bio}</p>
    </div>
  );
}
