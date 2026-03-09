import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DeleteSnippetButton } from '@/components/snippets/delete-snippet-button';
import { ApiError, getSnippetById } from '@/lib/api';
import { formatDate } from '@/lib/utils';

interface SnippetPageProps {
  params: Promise<{
    id: string;
  }>;
}

const SnippetPage = async ({ params }: SnippetPageProps): Promise<JSX.Element> => {
  const { id } = await params;

  let snippet = null;
  let errorText = '';

  try {
    snippet = await getSnippetById(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }

    if (error instanceof Error) {
      errorText = error.message;
    } else {
      errorText = 'Failed to load snippet';
    }
  }

  if (errorText) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <Link href="/" className="text-sm text-slate-600 hover:underline">
            ← Back
          </Link>

          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {errorText}
          </div>
        </div>
      </main>
    );
  }

  if (!snippet) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <Link href="/" className="text-sm text-slate-600 hover:underline">
            ← Back
          </Link>

          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Failed to load snippet
          </div>
        </div>
      </main>
    );
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
