import { syncToConvex } from '../endpoints/syncToConvex';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeFetchMock(status: number, ok: boolean) {
  return jest.fn().mockResolvedValue({
    ok,
    status,
    statusText: ok ? 'OK' : 'Internal Server Error',
  } satisfies Partial<Response>);
}

// ---------------------------------------------------------------------------
// Setup / teardown
// ---------------------------------------------------------------------------

const ORIGINAL_ENV = process.env;

beforeEach(() => {
  jest.resetAllMocks();
  process.env = {
    ...ORIGINAL_ENV,
    CONVEX_HTTP_URL: 'https://example-convex.site',
    CONVEX_SYNC_SECRET: 'test-secret-abcdefgh',  // ≥ 16 chars
  };
});

afterEach(() => {
  process.env = ORIGINAL_ENV;
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('syncToConvex', () => {
  it('calls fetch with the correct URL, method, headers, and body', async () => {
    const mockFetch = makeFetchMock(200, true);
    global.fetch = mockFetch as unknown as typeof fetch;

    const doc = { id: 'lang-1', name: 'Python' };
    await syncToConvex('language', doc);

    expect(mockFetch).toHaveBeenCalledTimes(1);

    const [url, init] = mockFetch.mock.calls[0] as [string, RequestInit];

    // URL
    expect(url).toBe('https://example-convex.site/sync');

    // Method
    expect(init.method).toBe('POST');

    // Headers
    const headers = init.headers as Record<string, string>;
    expect(headers['Content-Type']).toBe('application/json');
    expect(headers['x-sync-secret']).toBe('test-secret-abcdefgh');

    // Body — new shape: { collection, operation, data }
    expect(JSON.parse(init.body as string)).toEqual({
      collection: 'language',
      operation:  'update',
      data:        doc,
    });
  });

  it('does NOT throw when fetch returns a non-200 response', async () => {
    const mockFetch = makeFetchMock(500, false);
    global.fetch = mockFetch as unknown as typeof fetch;

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    await expect(syncToConvex('language', { id: 'lang-1' })).resolves.toBeUndefined();

    // Should log the error rather than throwing
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Sync failed'));
  });

  it('does NOT throw when fetch rejects with a network error', async () => {
    const networkError = new Error('Network failure');
    global.fetch = jest.fn().mockRejectedValue(networkError) as unknown as typeof fetch;

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    await expect(syncToConvex('language', { id: 'lang-1' })).resolves.toBeUndefined();

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Network error'),
      networkError,
    );
  });

  it('skips the fetch call and warns when CONVEX_HTTP_URL is not set', async () => {
    delete process.env.CONVEX_HTTP_URL;

    const mockFetch = makeFetchMock(200, true);
    global.fetch = mockFetch as unknown as typeof fetch;

    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);

    await syncToConvex('language', { id: 'lang-1' });

    expect(mockFetch).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('CONVEX_HTTP_URL'));
  });
});
