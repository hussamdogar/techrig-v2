/**
 * Renders a JSON-LD block. The data is app-controlled (never user input), so the
 * dangerouslySetInnerHTML is safe; it avoids React escaping the JSON.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
