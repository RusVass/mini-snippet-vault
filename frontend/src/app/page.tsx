import { Pagination } from '@/components/snippets/pagination';
import { SnippetForm } from '@/components/snippets/snippet-form';
import { SnippetList } from '@/components/snippets/snippet-list';
import { SnippetsToolbar } from '@/components/snippets/snippets-toolbar';
import { getSnippets } from '@/lib/api';

interface HomePageProps {
  searchParams: Promise<{
    q?: string;
    tag?: string;
    type?: 'link' | 'note' | 'command';
    page?: string;
  }>;
}

const HomePage = async ({ searchParams }: HomePageProps): Promise<JSX.Element> => {
  const params = await searchParams;

  const q = params.q || '';
  const tag = params.tag || '';
  const type = params.type || '';
  const page = Number(params.page || '1');

  let data = null;
  let errorText = '';

  try {
    data = await getSnippets({
      q,
      tag,
      type,
      page,
      limit: 6,
    });
  } catch (error) {
    if (error instanceof Error) {
      errorText = error.message;
    } else {
      errorText = 'Failed to load snippets';
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[380px_1fr]">
        <aside>
          <SnippetForm />
        </aside>

        <section className="grid gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Mini Snippet Vault</h1>
            <p className="mt-2 text-sm text-slate-600">
              Save useful links, notes, and commands in one place.
            </p>
          </div>

          <SnippetsToolbar />

          {errorText ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {errorText}
            </div>
          ) : null}

          {!errorText && data && data.items.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">No snippets found</h2>
              <p className="mt-2 text-sm text-slate-500">
                Create your first snippet or change the filters.
              </p>
            </div>
          ) : null}

          {!errorText && data && data.items.length > 0 ? (
            <>
              <SnippetList snippets={data.items} />
              <Pagination
                currentPage={data.meta.page}
                totalPages={data.meta.totalPages}
                q={q}
                tag={tag}
                type={type}
              />
            </>
          ) : null}
        </section>
      </div>
    </main>
  );
};

export default HomePage;
