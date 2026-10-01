// Renders the small Markdown subset the chatbot answers in (same as the website's chat widget):
// paragraphs, "- " bullets, **bold** and [links](url). Relative links point at the website.
const SITE_URL = (import.meta.env.VITE_SITE_URL || "https://www.techzarinfo.com").replace(/\/$/, "");

function Inline({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/g);
  return parts.map((part, i) => {
    const bold = part.match(/^\*\*([^*]+)\*\*$/);
    if (bold) return <strong key={i} className="font-semibold">{bold[1]}</strong>;
    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (link && /^(\/(?!\/)|https?:\/\/)/.test(link[2])) {
      const href = link[2].startsWith("/") ? SITE_URL + link[2] : link[2];
      return (
        <a
          key={i}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-brand underline underline-offset-2 hover:text-navy"
        >
          {link[1]}
        </a>
      );
    }
    return part;
  });
}

export default function RichText({ text }) {
  const blocks = [];
  for (const line of text.split("\n")) {
    const item = line.match(/^\s*[-*•]\s+(.*)/);
    const last = blocks[blocks.length - 1];
    if (item) {
      if (last?.type === "list") last.items.push(item[1]);
      else blocks.push({ type: "list", items: [item[1]] });
    } else if (line.trim()) {
      blocks.push({ type: "p", text: line });
    }
  }
  return blocks.map((b, i) =>
    b.type === "list" ? (
      <ul key={i} className="my-2 list-disc space-y-1 pl-5 first:mt-0 last:mb-0">
        {b.items.map((it, j) => (
          <li key={j}>
            <Inline text={it} />
          </li>
        ))}
      </ul>
    ) : (
      <p key={i} className="my-2 first:mt-0 last:mb-0">
        <Inline text={b.text} />
      </p>
    )
  );
}
