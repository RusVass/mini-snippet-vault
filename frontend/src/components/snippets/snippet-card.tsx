import Link from 'next/link';
import { Snippet } from '@/types/snippet';
import { formatDate } from '@/lib/utils';

interface SnippetCardProps {
  snippet: Snippet;
}

export const SnippetCard = ({ snippet }: SnippetCardProps): JSX.Element => {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{snippet.title}</h3>
          <p className="mt-1 text-sm text-slate-500">
            {snippet.type} · Updated {formatDate(snippet.updatedAt)}
          </p>
        </div>

        <Link
          href={`/snippets/${snippet._id}`}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Open
        </Link>
      </div>

      <p className="mb-4 whitespace-pre-wrap break-words text-sm text-slate-700">
        {snippet.content}
      </p>

      <div className="flex flex-wrap gap-2">
        {snippet.tags.length > 0 ? (
          snippet.tags.map((tag) => {
            return (
              <span
                key={tag}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
              >
                #{tag}
              </span>
            );
          })
        ) : (
          <span className="text-xs text-slate-400">No tags</span>
        )}
      </div>
    </article>
  );
};
