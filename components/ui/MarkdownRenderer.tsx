"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({
  content,
  className,
}: MarkdownRendererProps) {
  return (
    <div
      className={cn(
        "prose prose-lg dark:prose-invert max-w-none",
        "prose-headings:scroll-m-20 prose-headings:tracking-tight",
        "prose-h1:text-4xl prose-h1:font-extrabold prose-h1:lg:text-5xl",
        "prose-h2:text-3xl prose-h2:font-semibold prose-h2:mt-8 prose-h2:mb-4",
        "prose-h3:text-2xl prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-3",
        "prose-p:leading-7 prose-p:mt-6",
        "prose-blockquote:mt-6 prose-blockquote:border-l-2 prose-blockquote:pl-6 prose-blockquote:italic",
        "prose-code:relative prose-code:rounded prose-code:bg-muted prose-code:px-[0.3rem] prose-code:py-[0.2rem] prose-code:font-mono prose-code:text-sm",
        "prose-pre:overflow-x-auto prose-pre:rounded-lg prose-pre:bg-slate-950 prose-pre:p-4",
        "prose-ul:mt-6 prose-ul:ml-6 prose-ul:list-disc",
        "prose-ol:mt-6 prose-ol:ml-6 prose-ol:list-decimal",
        "prose-li:mt-2",
        "prose-table:border-collapse prose-table:border prose-table:border-border",
        "prose-th:border prose-th:border-border prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:font-bold",
        "prose-td:border prose-td:border-border prose-td:px-4 prose-td:py-2",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Personnalisation des composants si nécessaire
          h1: ({ children }) => (
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mt-8 mb-4">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-6 mb-3">
              {children}
            </h3>
          ),
          code: ({ className, children, ...props }) => (
            <code
              className={cn(
                "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
                className
              )}
              {...props}
            >
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="overflow-x-auto rounded-lg bg-slate-950 p-4 text-slate-50">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="mt-6 border-l-2 pl-6 italic">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="my-6 w-full overflow-y-auto">
              <table className="w-full border-collapse border border-border">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-border px-4 py-2 [&[align=center]]:text-center [&[align=right]]:text-right">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
