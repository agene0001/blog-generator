import { marked } from "marked";

/** Turn arbitrary text into a filename-safe slug. */
export function slugify(input: string, fallback = "blog-post"): string {
    const slug = input
        .toLowerCase()
        .replace(/[`*_#>[\]()]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 60);
    return slug || fallback;
}

/** Derive a slug from the first markdown H1, otherwise from a fallback string. */
export function titleSlug(markdown: string, fallback: string): string {
    const match = markdown.match(/^#\s+(.+)$/m);
    return slugify(match ? match[1] : fallback);
}

function triggerDownload(filename: string, content: string, mime: string) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

export function downloadMarkdown(markdown: string, name: string) {
    triggerDownload(`${name}.md`, markdown, "text/markdown;charset=utf-8");
}

export function downloadHtml(markdown: string, name: string) {
    const bodyHtml = marked.parse(markdown, { async: false }) as string;
    const doc = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${name}</title>
<style>
  body { max-width: 720px; margin: 3rem auto; padding: 0 1.25rem;
         font-family: system-ui, -apple-system, sans-serif; line-height: 1.7; color: #1a1a1a; }
  h1, h2, h3 { line-height: 1.25; }
  pre { background: #f4f4f5; padding: 1rem; border-radius: 8px; overflow: auto; }
  code { font-family: ui-monospace, monospace; }
</style>
</head>
<body>
${bodyHtml}
</body>
</html>`;
    triggerDownload(`${name}.html`, doc, "text/html;charset=utf-8");
}

/** Fetch a remote file (e.g. a generated video) and download it locally. */
export async function downloadFromUrl(url: string, filename: string) {
    const res = await fetch(url);
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(objectUrl);
}
