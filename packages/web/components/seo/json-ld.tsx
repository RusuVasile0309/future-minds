// Injectează date structurate JSON-LD în HTML-ul randat pe server.
// Acceptă un obiect sau mai multe (le grupează într-un singur <script>).

export function JsonLd({ data }: { data: object | object[] }) {
  const payload = Array.isArray(data) ? data : [data]
  return (
    <script
      type="application/ld+json"
      // Conținutul e generat de noi (lib/seo.ts), nu input de utilizator.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  )
}
