export type SnippetType = 'link' | 'note' | 'command';

export interface Snippet {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  type: SnippetType;
  createdAt: string;
  updatedAt: string;
}

export interface SnippetsMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SnippetsResponse {
  items: Snippet[];
  meta: SnippetsMeta;
}

export interface GetSnippetsParams {
  q?: string;
  tag?: string;
  type?: SnippetType | '';
  page?: number;
  limit?: number;
}

export interface CreateSnippetPayload {
  title: string;
  content: string;
  tags: string[];
  type: SnippetType;
}

export interface UpdateSnippetPayload {
  title?: string;
  content?: string;
  tags?: string[];
  type?: SnippetType;
}
