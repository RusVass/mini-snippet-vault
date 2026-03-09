import { Snippet } from '@/types/snippet';
import { SnippetCard } from './snippet-card';

interface SnippetListProps {
  snippets: Snippet[];
}

export const SnippetList = ({ snippets }: SnippetListProps): JSX.Element => {
  return (
    <div className="grid gap-4">
      {snippets.map((snippet) => {
        return <SnippetCard key={snippet._id} snippet={snippet} />;
      })}
    </div>
  );
};
