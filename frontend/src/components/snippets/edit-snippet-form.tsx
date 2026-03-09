'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateSnippet } from '@/lib/api';
import { parseTagsInput } from '@/lib/utils';
import { Snippet, SnippetType } from '@/types/snippet';

interface EditSnippetFormProps {
  snippet: Snippet;
}

export const EditSnippetForm = ({ snippet }: EditSnippetFormProps): JSX.Element => {
  const router = useRouter();

  const [title, setTitle] = useState(snippet.title);
  const [content, setContent] = useState(snippet.content);
  const [tags, setTags] = useState(snippet.tags.join(', '));
  const [type, setType] = useState<SnippetType>(snippet.type);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setError('');

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    try {
      setIsSubmitting(true);
      await updateSnippet(snippet._id, {
        title: title.trim(),
        content: content.trim(),
        tags: parseTagsInput(tags),
        type,
      });

      router.push(`/snippets/${snippet._id}`);
      router.refresh();
    } catch {
      setError('Update failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 rounded-xl border bg-white p-6 shadow-sm"
    >
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        className="rounded border px-3 py-2"
      />

      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        rows={6}
        className="rounded border px-3 py-2"
      />

      <input
        value={tags}
        onChange={(event) => setTags(event.target.value)}
        placeholder="tags"
        className="rounded border px-3 py-2"
      />

      <select
        value={type}
        onChange={(event) => setType(event.target.value as SnippetType)}
        className="rounded border px-3 py-2"
      >
        <option value="note">Note</option>
        <option value="link">Link</option>
        <option value="command">Command</option>
      </select>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-slate-900 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
};
