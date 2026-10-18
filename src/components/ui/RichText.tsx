import ReactMarkdown, { type Components } from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/cn";

// Site styling for each element the Strapi Markdown editor can produce
const components: Components = {
  h1: (props) => <h4 className="mt-5 mb-2 font-heading text-xl font-bold text-ink uppercase first:mt-0" {...props} />,
  h2: (props) => <h4 className="mt-5 mb-2 font-heading text-lg font-bold text-ink uppercase first:mt-0" {...props} />,
  h3: (props) => <h5 className="mt-4 mb-2 font-heading text-base font-bold text-ink uppercase first:mt-0" {...props} />,
  h4: (props) => <h6 className="mt-4 mb-1.5 font-heading text-sm font-bold text-ink uppercase first:mt-0" {...props} />,
  h5: (props) => <h6 className="mt-4 mb-1.5 font-heading text-sm font-bold text-ink uppercase first:mt-0" {...props} />,
  h6: (props) => <h6 className="mt-4 mb-1.5 font-heading text-sm font-bold text-ink uppercase first:mt-0" {...props} />,
  p: (props) => <p className="mb-3 last:mb-0" {...props} />,
  ul: (props) => <ul className="mb-3 list-disc space-y-1.5 pl-5 marker:text-accent-700 last:mb-0" {...props} />,
  ol: (props) => <ol className="mb-3 list-decimal space-y-1.5 pl-5 marker:text-accent-700 last:mb-0" {...props} />,
  strong: (props) => <strong className="font-semibold text-ink" {...props} />,
  a: (props) => (
    <a className="text-brand-blue underline underline-offset-2 hover:text-accent-700" target="_blank" rel="noopener noreferrer" {...props} />
  ),
  blockquote: (props) => (
    <blockquote className="mb-3 border-l-2 border-accent-700 pl-4 text-ink/70 italic" {...props} />
  ),
  code: (props) => <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-[0.9em]" {...props} />,
  hr: () => <hr className="my-4 border-divider" />,
};

/** Renders Markdown from a Strapi "Rich text (Markdown)" field. Raw HTML is not rendered. */
export function RichText({ content, className }: { content: string; className?: string }) {
  return (
    <div className={cn("text-sm leading-relaxed text-ink/80", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

/** Markdown → plain text, for short previews (cards, search). */
export function markdownToPlainText(markdown: string): string {
  return markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links → their text
    .replace(/<[^>]+>/g, "") // inline HTML such as <u>
    .replace(/^\s{0,3}(#{1,6}\s+|>\s?|[-*+]\s+|\d+\.\s+)/gm, "") // headings, quotes, list markers
    .replace(/(\*\*|__|~~|\*|_|`)/g, "") // emphasis + code
    .replace(/\s+/g, " ")
    .trim();
}
