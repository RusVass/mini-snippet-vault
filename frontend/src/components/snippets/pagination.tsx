import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  q: string;
  tag: string;
  type: string;
}

const buildPageHref = (
  page: number,
  q: string,
  tag: string,
  type: string,
): string => {
  const searchParams = new URLSearchParams();

  if (q) {
    searchParams.set('q', q);
  }

  if (tag) {
    searchParams.set('tag', tag);
  }

  if (type) {
    searchParams.set('type', type);
  }

  searchParams.set('page', String(page));

  return `/?${searchParams.toString()}`;
};

export const Pagination = ({
  currentPage,
  totalPages,
  q,
  tag,
  type,
}: PaginationProps): JSX.Element | null => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-6 flex items-center justify-center gap-3">
      <Link
        href={buildPageHref(Math.max(currentPage - 1, 1), q, tag, type)}
        className={`rounded-md border px-4 py-2 text-sm ${
          currentPage === 1
            ? 'pointer-events-none border-slate-200 text-slate-400'
            : 'border-slate-300 text-slate-700 hover:bg-slate-50'
        }`}
      >
        Previous
      </Link>

      <span className="text-sm text-slate-600">
        Page {currentPage} of {totalPages}
      </span>

      <Link
        href={buildPageHref(Math.min(currentPage + 1, totalPages), q, tag, type)}
        className={`rounded-md border px-4 py-2 text-sm ${
          currentPage === totalPages
            ? 'pointer-events-none border-slate-200 text-slate-400'
            : 'border-slate-300 text-slate-700 hover:bg-slate-50'
        }`}
      >
        Next
      </Link>
    </div>
  );
};
