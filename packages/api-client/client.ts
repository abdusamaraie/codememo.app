/**
 * Typed fetch wrapper used by all client apps.
 */
export function createApiClient(baseUrl: string) {
  return {
    get: <T>(path: string) =>
      fetch(`${baseUrl}${path}`).then((r) => r.json() as Promise<T>),
    post: <T>(path: string, body: unknown) =>
      fetch(`${baseUrl}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }).then((r) => r.json() as Promise<T>),
  };
}
