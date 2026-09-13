import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  return (
    <div className={`prose-sm max-w-none text-slate-800 ${className}`}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ children }) => (
            <div className="overflow-x-auto my-3 max-w-full rounded-2xl border border-slate-200/90 bg-white shadow-2xs">
              <table className="w-full min-w-[500px] border-collapse text-left text-xs font-sans text-slate-800">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-slate-100/90 text-slate-800 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="px-3.5 py-2.5 font-bold border-r border-slate-200 last:border-r-0 whitespace-nowrap text-slate-800">
              {children}
            </th>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-slate-100 bg-white font-medium text-slate-700">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-indigo-50/40 transition-colors">
              {children}
            </tr>
          ),
          td: ({ children }) => (
            <td className="px-3.5 py-2 text-xs text-slate-700 border-r border-slate-100 last:border-r-0 whitespace-nowrap font-normal">
              {children}
            </td>
          ),
          h1: ({ children }) => (
            <h1 className="text-base font-extrabold text-slate-900 mt-4 mb-2 pb-1.5 border-b border-slate-200">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-sm font-bold text-slate-900 mt-3.5 mb-2">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm font-bold text-indigo-900 mt-3 mb-1.5">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-xs font-bold text-slate-900 mt-2.5 mb-1 tracking-wide uppercase text-indigo-900/90">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="mb-2 last:mb-0 leading-relaxed text-slate-800 text-xs sm:text-[13.5px]">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-5 my-2 space-y-1 text-slate-800 text-xs sm:text-[13px]">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 my-2 space-y-1 text-slate-800 text-xs sm:text-[13px]">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed">
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-indigo-500 pl-3 py-1 my-2.5 bg-indigo-50/50 rounded-r-lg text-slate-700 text-xs italic">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <code className="bg-slate-100 text-indigo-800 px-1.5 py-0.5 rounded font-mono text-[11.5px] border border-slate-200">
              {children}
            </code>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-slate-900">
              {children}
            </strong>
          )
        }}
      >
        {content}
      </Markdown>
    </div>
  );
};
