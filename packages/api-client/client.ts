/**
 * Typed fetch wrapper used by all client apps.
 */
export class ApiClientError extends Error {
  readonly status: number;
  readonly statusText: string;
  readonly body: unknown;

  constructor(status: number, statusText: string, body: unknown) {
    super(`API request failed (${status} ${statusText})`);
    this.name = 'ApiClientError';
    this.status = status;
    this.statusText = statusText;
    this.body = body;
  }
}

async function parseJsonSafely(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function requestJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  const payload = await parseJsonSafely(response);

  if (!response.ok) {
    throw new ApiClientError(response.status, response.statusText, payload);
  }

  return payload as T;
}

export function createApiClient(baseUrl: string) {
  return {
    get: <T>(path: string) => requestJson<T>(`${baseUrl}${path}`),
    post: <T>(path: string, body: unknown) =>
      requestJson<T>(`${baseUrl}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }),
  };
}
