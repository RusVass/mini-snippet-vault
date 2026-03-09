'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteSnippet } from '@/lib/api';

interface DeleteSnippetButtonProps {
  id: string;
}

export const DeleteSnippetButton = ({ id }: DeleteSnippetButtonProps): JSX.Element => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorText, setErrorText] = useState('');

  const handleDelete = async (): Promise<void> => {
    const isConfirmed = window.confirm('Delete this snippet?');

    if (!isConfirmed) {
      return;
    }

    try {
      setErrorText('');
      setIsDeleting(true);
      await deleteSnippet(id);
      router.push('/');
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        setErrorText(error.message);
      } else {
        setErrorText('Delete failed');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="grid gap-2">
      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="rounded-md border border-red-300 px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isDeleting ? 'Deleting...' : 'Delete'}
      </button>

      {errorText ? <p className="text-xs text-red-600">{errorText}</p> : null}
    </div>
  );
};
