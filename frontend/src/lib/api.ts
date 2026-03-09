import {
  CreateSnippetPayload,
  GetSnippetsParams,
  Snippet,
  SnippetsResponse,
  UpdateSnippetPayload,
} from '@/types/snippet';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined');
}

export class ApiError extends Error {
  public readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const buildQueryString = (params: GetSnippetsParams): string => {
  const searchParams = new URLSearchParams();

  if (params.q) {
    searchParams.set('q', params.q);
  }

  if (params.tag) {
    searchParams.set('tag', params.tag);
  }

  if (params.type) {
    searchParams.set('type', params.type);
  }

  if (params.page) {
    searchParams.set('page', String(params.page));
  }

  if (params.limit) {
    searchParams.set('limit', String(params.limit));
  }

  return searchParams.toString();
};

const getErrorMessage = (errorData: unknown): string => {
  if (!errorData || typeof errorData !== 'object') {
    return '';
  }

  const candidate = (errorData as { message?: unknown }).message;

  if (Array.isArray(candidate) && candidate.length > 0) {
    return candidate.join(', ');
  }

  if (typeof candidate === 'string') {
    return candidate;
  }

  return '';
};

const parseResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    let errorMessage = 'Request failed';

    try {
      const errorData = await response.json();
      const parsedMessage = getErrorMessage(errorData);

      if (parsedMessage) {
        errorMessage = parsedMessage;
      }
    } catch {
      errorMessage = response.statusText || errorMessage;
    }

    throw new ApiError(errorMessage, response.status);
  }

  return response.json();
};

export const getSnippets = async (
  params: GetSnippetsParams = {},
): Promise<SnippetsResponse> => {
  const queryString = buildQueryString(params);
  const url = queryString
    ? `${API_URL}/snippets?${queryString}`
    : `${API_URL}/snippets`;

  const response = await fetch(url, {
    cache: 'no-store',
  });

  return parseResponse<SnippetsResponse>(response);
};

export const createSnippet = async (
  payload: CreateSnippetPayload,
): Promise<Snippet> => {
  const response = await fetch(`${API_URL}/snippets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<Snippet>(response);
};

export const getSnippetById = async (id: string): Promise<Snippet> => {
  const response = await fetch(`${API_URL}/snippets/${id}`, {
    cache: 'no-store',
  });

  return parseResponse<Snippet>(response);
};

export const updateSnippet = async (
  id: string,
  payload: UpdateSnippetPayload,
): Promise<Snippet> => {
  const response = await fetch(`${API_URL}/snippets/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<Snippet>(response);
};

export const deleteSnippet = async (
  id: string,
): Promise<{ message: string }> => {
  const response = await fetch(`${API_URL}/snippets/${id}`, {
    method: 'DELETE',
  });

  return parseResponse<{ message: string }>(response);
};
