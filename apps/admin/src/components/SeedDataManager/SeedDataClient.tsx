'use client';

import { useRef, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { SeedCollection } from '../../services/seedService';

type AppDataSource = 'real' | 'mock';
type RequestStatus = 'idle' | 'running' | 'ok' | 'error';
type UserOperationPath = '/api/seed-user-data' | '/api/reset-user-data';

interface StreamEvent {
  type?: string;
  message?: string;
}

interface ApiResponse {
  ok?: boolean;
  error?: string;
  message?: string;
}

const COLLECTIONS: { key: SeedCollection; label: string }[] = [
  { key: 'languages', label: 'Languages' },
  { key: 'sections', label: 'Sections' },
  { key: 'flashcards', label: 'Flashcards' },
  { key: 'exercises', label: 'Exercises' },
  { key: 'cheatSheetEntries', label: 'Cheat Sheets' },
];

const APP_DATA_SOURCE_OPTIONS: { value: AppDataSource; label: string }[] = [
  { value: 'real', label: 'Real Data' },
  { value: 'mock', label: 'Mock Seed Data' },
];

const CLEAR_ORDER: SeedCollection[] = ['cheatSheetEntries', 'exercises', 'flashcards', 'sections', 'languages'];

type Counts = Record<SeedCollection, number>;

interface Props {
  counts: Counts;
  appDataSource: string;
}

function normalizeAppDataSource(value: string): AppDataSource {
  return value === 'mock' ? 'mock' : 'real';
}

async function postJson(url: string, body: unknown): Promise<Response> {
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

async function readJsonSafe<T>(response: Response): Promise<T | null> {
  try {
    return await response.json() as T;
  } catch {
    return null;
  }
}

async function readErrorMessage(response: Response): Promise<string> {
  const text = await response.text();
  if (!text) return response.statusText;

  try {
    const parsed = JSON.parse(text) as ApiResponse;
    return parsed.error ?? parsed.message ?? text;
  } catch {
    return text;
  }
}

function formatStreamLine(line: string): string {
  try {
    const event = JSON.parse(line) as StreamEvent;
    if (event.type && event.message) {
      return `[${event.type}] ${event.message}`;
    }
    if (event.message) {
      return event.message;
    }
  } catch {
    // Keep raw line if it is not valid JSON.
  }

  return line;
}

function getLogLineColor(line: string): string {
  if (line.includes('[error]')) return '#ef4444';
  if (line.includes('[summary]')) return '#10b981';
  return 'inherit';
}

export function SeedDataClient({ counts: initialCounts, appDataSource: initialAppDataSource }: Props) {
  const [counts, setCounts] = useState(initialCounts);
  const [appDataSource, setAppDataSource] = useState<AppDataSource>(
    normalizeAppDataSource(initialAppDataSource),
  );
  const [dataSourceError, setDataSourceError] = useState('');
  const [selected, setSelected] = useState<Set<SeedCollection>>(
    new Set(COLLECTIONS.map((c) => c.key)),
  );
  const [log, setLog] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [clearConfirm, setClearConfirm] = useState(false);
  const [clerkUserId, setClerkUserId] = useState('');
  const [userSeedStatus, setUserSeedStatus] = useState<RequestStatus>('idle');
  const [userSeedError, setUserSeedError] = useState('');
  const [resetStatus, setResetStatus] = useState<RequestStatus>('idle');
  const [resetError, setResetError] = useState('');
  const logRef = useRef<HTMLDivElement>(null);
  const trimmedClerkUserId = clerkUserId.trim();
  const isCollectionSelectionEmpty = selected.size === 0;

  function toggleCollection(key: SeedCollection) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function appendLog(line: string) {
    setLog((prev) => [...prev, line]);
    // Scroll to bottom
    setTimeout(() => {
      if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
    }, 0);
  }

  async function updateAppDataSource(value: AppDataSource) {
    setDataSourceError('');
    try {
      const res = await postJson('/api/globals/site-settings', { appDataSource: value });
      if (!res.ok) {
        const errorMessage = await readErrorMessage(res);
        setDataSourceError(`Failed to save: ${res.status} ${errorMessage}`);
        return; // don't update UI if DB write failed
      }
      setAppDataSource(value);
    } catch (err) {
      setDataSourceError(`Network error: ${String(err)}`);
    }
  }

  async function refreshCounts() {
    try {
      const results = await Promise.all(
        COLLECTIONS.map(async (collection) => {
          const response = await fetch(`/api/${collection.key}?limit=0`);
          if (!response.ok) return null;
          return readJsonSafe<{ totalDocs?: number }>(response);
        }),
      );

      setCounts((prev) => {
        const next: Counts = { ...prev };
        COLLECTIONS.forEach((collection, index) => {
          const totalDocs = results[index]?.totalDocs;
          if (typeof totalDocs === 'number') {
            next[collection.key] = totalDocs;
          }
        });
        return next;
      });
    } catch {
      // Non-critical — counts just won't refresh
    }
  }

  async function streamOperation(url: string, body: unknown) {
    setIsRunning(true);
    setLog([]);
    setClearConfirm(false);

    try {
      const res = await postJson(url, body);

      if (!res.ok) {
        const errorMessage = await readErrorMessage(res);
        appendLog(`[error] ${res.status} ${errorMessage}`);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        appendLog('[error] Stream response is missing a body.');
        return;
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.trim()) continue;
          appendLog(formatStreamLine(line));
        }
      }

      buffer += decoder.decode();
      if (buffer.trim()) {
        appendLog(formatStreamLine(buffer.trim()));
      }
    } catch (err) {
      appendLog(`Network error: ${String(err)}`);
    } finally {
      setIsRunning(false);
      await refreshCounts();
    }
  }

  async function clearAll() {
    setIsRunning(true);
    setLog(['Clearing all content (reverse dependency order)…']);
    setClearConfirm(false);

    try {
      for (const slug of CLEAR_ORDER) {
        const res = await fetch(`/api/${slug}?where[id][exists][equals]=true`, {
          method: 'DELETE',
        });

        if (!res.ok) {
          const errorMessage = await readErrorMessage(res);
          appendLog(`[error] Failed to clear ${slug} (${res.status}): ${errorMessage}`);
          continue;
        }

        appendLog(`Cleared ${slug} (${res.status})`);
      }
    } catch (err) {
      appendLog(`Clear failed: ${String(err)}`);
    } finally {
      setIsRunning(false);
      await refreshCounts();
    }
  }

  async function runUserOperation(
    path: UserOperationPath,
    setStatus: Dispatch<SetStateAction<RequestStatus>>,
    setError: Dispatch<SetStateAction<string>>,
  ) {
    if (!trimmedClerkUserId) return;

    setStatus('running');
    setError('');

    try {
      const res = await postJson(path, { clerkUserId: trimmedClerkUserId });
      const json = await readJsonSafe<ApiResponse>(res);

      if (!res.ok) {
        setStatus('error');
        setError(json?.error ?? json?.message ?? res.statusText);
        return;
      }

      if (json?.ok === false) {
        setStatus('error');
        setError(json.error ?? json.message ?? 'Operation failed');
        return;
      }

      setStatus('ok');
    } catch (err) {
      setStatus('error');
      setError(String(err));
    }
  }

  async function seedUserData() {
    await runUserOperation('/api/seed-user-data', setUserSeedStatus, setUserSeedError);
  }

  async function resetUserData() {
    await runUserOperation('/api/reset-user-data', setResetStatus, setResetError);
  }

  const btnBase: React.CSSProperties = {
    padding: '8px 16px',
    borderRadius: 6,
    border: 'none',
    cursor: isRunning ? 'not-allowed' : 'pointer',
    fontWeight: 600,
    fontSize: 13,
    opacity: isRunning ? 0.5 : 1,
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 800, fontFamily: 'inherit' }} data-testid="seed-data-manager">
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>
        Seed Data Manager
      </h1>
      <p style={{ color: 'var(--theme-elevation-500)', marginBottom: '1.5rem', fontSize: 14 }}>
        Populate PayloadCMS with mock content and sync to Convex.
      </p>

      {/* App Data Source */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--theme-elevation-100)',
          border: '1px solid var(--theme-elevation-200)',
          borderRadius: 8,
          padding: '12px 16px',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <p style={{ fontWeight: 600, fontSize: 14, margin: 0 }}>App Data Source</p>
          <p style={{ fontSize: 12, color: 'var(--theme-elevation-500)', margin: '2px 0 0' }}>
            Controls streak, XP/progress, activity heatmap, and AI hint counters in the web app.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {APP_DATA_SOURCE_OPTIONS.map(({ value, label }) => {
            const isActive = appDataSource === value;
            return (
                <button
                  key={value}
                  data-testid={`app-data-source-${value}`}
                  onClick={() => updateAppDataSource(value)}
                  aria-pressed={isActive}
                  disabled={isActive}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 6,
                    border: '1px solid var(--theme-elevation-300)',
                    cursor: isActive ? 'default' : 'pointer',
                    fontSize: 13,
                    fontWeight: 500,
                    background: isActive ? (value === 'mock' ? '#8b5cf6' : '#10b981') : 'var(--theme-elevation-50)',
                    color: isActive ? '#fff' : 'var(--theme-elevation-700)',
                    opacity: isActive ? 0.9 : 1,
                  }}
                >
                  {label}
                </button>
            );
          })}
        </div>
      </div>
      {dataSourceError && (
        <p style={{ color: '#ef4444', fontSize: 12, marginTop: -12, marginBottom: '1.5rem' }}>{dataSourceError}</p>
      )}

      {/* Counts */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {COLLECTIONS.map((c) => (
          <span
            key={c.key}
            style={{
              background: 'var(--theme-elevation-100)',
              border: '1px solid var(--theme-elevation-200)',
              borderRadius: 20,
              padding: '4px 12px',
              fontSize: 13,
            }}
          >
            {c.label}: <strong>{counts[c.key]}</strong>
          </span>
        ))}
      </div>

      {/* Collection checkboxes */}
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Collections to seed:</p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {COLLECTIONS.map((c) => (
            <label
              key={c.key}
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, cursor: isRunning ? 'not-allowed' : 'pointer' }}
            >
              <input
                type="checkbox"
                checked={selected.has(c.key)}
                onChange={() => toggleCollection(c.key)}
                disabled={isRunning}
              />
              {c.label}
            </label>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <button
          data-testid="load-mock-data-btn"
          disabled={isRunning || isCollectionSelectionEmpty}
          style={{ ...btnBase, background: '#3b82f6', color: '#fff' }}
          onClick={() =>
            streamOperation('/api/seed-data', {
              mode: 'mock',
              collections: [...selected],
            })
          }
        >
          Load Mock Data
        </button>

        <button
          data-testid="load-production-data-btn"
          disabled={isRunning || isCollectionSelectionEmpty}
          style={{ ...btnBase, background: '#8b5cf6', color: '#fff' }}
          onClick={() =>
            streamOperation('/api/seed-data', {
              mode: 'production',
              collections: [...selected],
            })
          }
        >
          Load Production Data
        </button>

        <button
          data-testid="sync-to-convex-btn"
          disabled={isRunning}
          style={{ ...btnBase, background: '#10b981', color: '#fff' }}
          onClick={() => streamOperation('/api/sync-to-convex', {})}
        >
          Force Sync to Convex
        </button>

        {clearConfirm ? (
          <button
            data-testid="confirm-clear-all-btn"
            disabled={isRunning}
            style={{ ...btnBase, background: '#ef4444', color: '#fff' }}
            onClick={clearAll}
          >
            Confirm Clear All?
          </button>
        ) : (
          <button
            data-testid="clear-all-btn"
            disabled={isRunning}
            style={{ ...btnBase, background: 'var(--theme-elevation-150)', color: 'var(--theme-text)' }}
            onClick={() => setClearConfirm(true)}
          >
            Clear All Content
          </button>
        )}

        {clearConfirm && (
          <button
            style={{ ...btnBase, background: 'transparent', color: 'var(--theme-elevation-500)' }}
            onClick={() => setClearConfirm(false)}
          >
            Cancel
          </button>
        )}
      </div>

      {/* Seed User Data */}
      <div
        style={{
          border: '1px solid var(--theme-elevation-200)',
          borderRadius: 8,
          padding: '12px 16px',
          marginBottom: '1.5rem',
        }}
      >
        <p style={{ fontWeight: 600, fontSize: 14, margin: '0 0 4px' }}>User Progress (Convex)</p>
        <p style={{ fontSize: 12, color: 'var(--theme-elevation-500)', margin: '0 0 10px' }}>
          Seed mock streak data (streak=7, best=14, reviews=18) or reset progress to zero for a specific Clerk user.
        </p>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            data-testid="clerk-user-id-input"
            type="text"
            placeholder="Clerk User ID (user_xxxx)"
            value={clerkUserId}
            onChange={(e) => { setClerkUserId(e.target.value); setUserSeedStatus('idle'); setResetStatus('idle'); }}
            style={{
              flex: 1,
              padding: '6px 10px',
              borderRadius: 6,
              border: '1px solid var(--theme-elevation-300)',
              fontSize: 13,
              background: 'var(--theme-elevation-50)',
              color: 'var(--theme-text)',
            }}
          />
          <button
            data-testid="seed-user-data-btn"
            disabled={!trimmedClerkUserId || userSeedStatus === 'running'}
            onClick={seedUserData}
            style={{
              ...btnBase,
              background: '#f59e0b',
              color: '#fff',
              cursor: (!trimmedClerkUserId || userSeedStatus === 'running') ? 'not-allowed' : 'pointer',
              opacity: (!trimmedClerkUserId || userSeedStatus === 'running') ? 0.5 : 1,
            }}
          >
            {userSeedStatus === 'running' ? 'Seeding…' : 'Seed Mock Data'}
          </button>
          <button
            data-testid="reset-user-data-btn"
            disabled={!trimmedClerkUserId || resetStatus === 'running'}
            onClick={resetUserData}
            style={{
              ...btnBase,
              background: '#6b7280',
              color: '#fff',
              cursor: (!trimmedClerkUserId || resetStatus === 'running') ? 'not-allowed' : 'pointer',
              opacity: (!trimmedClerkUserId || resetStatus === 'running') ? 0.5 : 1,
            }}
          >
            {resetStatus === 'running' ? 'Resetting…' : 'Reset to Zero'}
          </button>
        </div>
        {userSeedStatus === 'ok' && (
          <p style={{ color: '#10b981', fontSize: 12, marginTop: 6 }}>Done — mock streak data applied.</p>
        )}
        {userSeedStatus === 'error' && (
          <p style={{ color: '#ef4444', fontSize: 12, marginTop: 6 }}>Error: {userSeedError}</p>
        )}
        {resetStatus === 'ok' && (
          <p style={{ color: '#10b981', fontSize: 12, marginTop: 6 }}>Done — progress reset to zero.</p>
        )}
        {resetStatus === 'error' && (
          <p style={{ color: '#ef4444', fontSize: 12, marginTop: 6 }}>Error: {resetError}</p>
        )}
      </div>

      {/* Progress log */}
      {log.length > 0 && (
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
            {isRunning ? 'Running…' : 'Done'}
          </p>
          <div
            ref={logRef}
            style={{
              background: 'var(--theme-elevation-50)',
              border: '1px solid var(--theme-elevation-200)',
              borderRadius: 6,
              padding: '12px 16px',
              fontFamily: 'monospace',
              fontSize: 12,
              lineHeight: 1.6,
              maxHeight: 320,
              overflowY: 'auto',
              whiteSpace: 'pre-wrap',
            }}
          >
            {log.map((line, i) => (
              <div
                key={i}
                style={{
                  color: getLogLineColor(line),
                }}
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
