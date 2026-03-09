import { notFound } from 'next/navigation';
import { EditSnippetForm } from '@/components/snippets/edit-snippet-form';
import { getSnippetById } from '@/lib/api';

interface EditSnippetPageProps {
  params: Promise<{ id: string }>;
}

const EditSnippetPage = async ({ params }: EditSnippetPageProps): Promise<JSX.Element> => {
  const { id } = await params;

  let snippet = null;

  try {
    snippet = await getSnippetById(id);
  } catch {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-xl px-4 py-10">
        <h1 className="mb-6 text-2xl font-bold">Edit snippet</h1>

        <EditSnippetForm snippet={snippet} />
      </div>
    </main>
  );
};

export default EditSnippetPage;
