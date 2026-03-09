import Link from 'next/link';

export default function NotFound(): JSX.Element {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">Snippet not found</h1>

      <Link href="/" className="text-blue-600 hover:underline">
        Go home
      </Link>
    </div>
  );
}
