'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { createSnippet } from '@/lib/api';
import { SnippetType } from '@/types/snippet';
import { parseTagsInput } from '@/lib/utils';

const INITIAL_VALUES = {
  title: '',
  content: '',
  tags: '',
  type: 'note' as SnippetType,
};

export const SnippetForm = (): JSX.Element => {
  const router = useRouter();

  const [title, setTitle] = useState(INITIAL_VALUES.title);
  const [content, setContent] = useState(INITIAL_VALUES.content);
  const [tags, setTags] = useState(INITIAL_VALUES.tags);
  const [type, setType] = useState<SnippetType>(INITIAL_VALUES.type);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): Record<string, string> => {
    const nextErrors: Record<string, string> = {};

    if (!title.trim()) {
      nextErrors.title = 'Title is required';
    }

    if (!content.trim()) {
      nextErrors.content = 'Content is required';
    }

    return nextErrors;
  };

  const resetForm = (): void => {
    setTitle(INITIAL_VALUES.title);
    setContent(INITIAL_VALUES.content);
    setTags(INITIAL_VALUES.tags);
    setType(INITIAL_VALUES.type);
    setErrors({});
    setServerError('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);
    setServerError('');

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);

      await createSnippet({
        title: title.trim(),
        content: content.trim(),
        tags: parseTagsInput(tags),
        type,
      });

      resetForm();
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        setServerError(error.message);
      } else {
        setServerError('Failed to create snippet');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Create snippet</h2>
        <p className="mt-1 text-sm text-slate-500">
          Add a useful link, note, or command.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-1">
          <label className="text-sm font-medium text-slate-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="For example, Nest docs"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
          />
          {errors.title ? (
            <p className="text-sm text-red-600">{errors.title}</p>
          ) : null}
        </div>

        <div className="grid gap-1">
          <label className="text-sm font-medium text-slate-700">Type</label>
          <select
            value={type}
            onChange={(event) => setType(event.target.value as SnippetType)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
          >
            <option value="note">Note</option>
            <option value="link">Link</option>
            <option value="command">Command</option>
          </select>
        </div>
      </div>

      <div className="grid gap-1">
        <label className="text-sm font-medium text-slate-700">Content</label>
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Paste text, command, or URL"
          rows={5}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
        />
        {errors.content ? (
          <p className="text-sm text-red-600">{errors.content}</p>
        ) : null}
      </div>

      <div className="grid gap-1">
        <label className="text-sm font-medium text-slate-700">
          Tags, separated by commas
        </label>
        <input
          type="text"
          value={tags}
          onChange={(event) => setTags(event.target.value)}
          placeholder="nestjs, backend, docs"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
        />
      </div>

      {serverError ? <p className="text-sm text-red-600">{serverError}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Saving...' : 'Create snippet'}
      </button>
    </form>
  );
};
