import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DeleteSnippetButton } from '@/components/snippets/delete-snippet-button';
import { getSnippetById } from '@/lib/api';
import { formatDate } from '@/lib/utils';

interface SnippetPageProps {
  params: Promise<{
    id: string;
  }>;
}

const SnippetPage = async ({ params }: SnippetPageProps): Promise<JSX.Element> => {
  const { id } = await params;

  let snippet = null;

  try {
    snippet = await getSnippetById(id);
  } catch {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="text-sm text-slate-600 hover:underline">
            ← Back
          </Link>

          <div className="flex gap-3">
            <Link
              href={`/snippets/${id}/edit`}
              className="rounded-md border px-4 py-2 text-sm hover:bg-slate-50"
            >
              Edit
            </Link>

            <DeleteSnippetButton id={id} />
          </div>
        </div>

        <article className="rounded-xl border bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold">{snippet.title}</h1>

          <p className="mt-2 text-sm text-slate-500">
            {snippet.type} · Updated {formatDate(snippet.updatedAt)}
          </p>

          <pre className="mt-6 whitespace-pre-wrap text-sm">{snippet.content}</pre>

          <div className="mt-6 flex flex-wrap gap-2">
            {snippet.tags.map((tag) => {
              return (
                <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs">
                  #{tag}
                </span>
              );
            })}
          </div>
        </article>
      </div>
    </main>
  );
};

export default SnippetPage;
