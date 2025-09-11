"use client";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Simple markdown-to-HTML converter for demo purposes
  const renderMarkdown = (text: string) => {
    return text
      .replace(
        /^# (.*$)/gim,
        '<h1 class="text-3xl font-bold mb-6 text-balance">$1</h1>'
      )
      .replace(
        /^## (.*$)/gim,
        '<h2 class="text-2xl font-semibold mb-4 mt-8 text-balance">$1</h2>'
      )
      .replace(
        /^### (.*$)/gim,
        '<h3 class="text-xl font-semibold mb-3 mt-6">$1</h3>'
      )
      .replace(/^\*\*(.*)\*\*/gim, '<strong class="font-semibold">$1</strong>')
      .replace(/^\*(.*)\*/gim, '<em class="italic">$1</em>')
      .replace(/^- (.*$)/gim, '<li class="ml-4">• $1</li>')
      .replace(/\n\n/g, '</p><p class="mb-4 leading-relaxed">')
      .replace(/\n/g, "<br />");
  };

  const htmlContent = `<p class="mb-4 leading-relaxed">${renderMarkdown(
    content
  )}</p>`;

  return (
    <div
      className="prose prose-lg max-w-none"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
