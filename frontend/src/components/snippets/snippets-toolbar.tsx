'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';

export const SnippetsToolbar = (): JSX.Element => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(searchParams.get('q') || '');
  const [tag, setTag] = useState(searchParams.get('tag') || '');
  const [type, setType] = useState(searchParams.get('type') || '');

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const params = new URLSearchParams();

    if (q.trim()) {
      params.set('q', q.trim());
    }

    if (tag.trim()) {
      params.set('tag', tag.trim());
    }

    if (type) {
      params.set('type', type);
    }

    params.set('page', '1');

    router.push(`/?${params.toString()}`);
  };

  const handleReset = (): void => {
    setQ('');
    setTag('');
    setType('');
    router.push('/');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-4"
    >
      <input
        type="text"
        value={q}
        onChange={(event) => setQ(event.target.value)}
        placeholder="Search by title or content"
        className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-0 focus:border-slate-500"
      />

      <input
        type="text"
        value={tag}
        onChange={(event) => setTag(event.target.value)}
        placeholder="Filter by tag"
        className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-0 focus:border-slate-500"
      />

      <select
        value={type}
        onChange={(event) => setType(event.target.value)}
        className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-0 focus:border-slate-500"
      >
        <option value="">All types</option>
        <option value="link">Link</option>
        <option value="note">Note</option>
        <option value="command">Command</option>
      </select>

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Apply
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="flex-1 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Reset
        </button>
      </div>
    </form>
  );
};
