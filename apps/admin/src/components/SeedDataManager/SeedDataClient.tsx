'use client';

import { useRef, useState } from 'react';
import type { SeedCollection } from '../../services/seedService';

const COLLECTIONS: { key: SeedCollection; label: string }[] = [
  { key: 'languages', label: 'Languages' },
  { key: 'sections', label: 'Sections' },
  { key: 'flashcards', label: 'Flashcards' },
  { key: 'exercises', label: 'Exercises' },
  { key: 'cheatSheetEntries', label: 'Cheat Sheets' },
];

interface Counts {
  languages: number;
  sections: number;
  flashcards: number;
  exercises: number;
  cheatSheetEntries: number;
}

interface Props {
  counts: Counts;
  appDataSource: string;
}

export function SeedDataClient({ counts: initialCounts, appDataSource: initialAppDataSource }: Props) {
  const [counts, setCounts] = useState(initialCounts);
  const [appDataSource, setAppDataSource] = useState(initialAppDataSource);
  const [selected, setSelected] = useState<Set<SeedCollection>>(
    new Set(COLLECTIONS.map((c) => c.key)),
  );
  const [log, setLog] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [clearConfirm, setClearConfirm] = useState(false);
  const [clerkUserId, setClerkUserId] = useState('');
  const [userSeedStatus, setUserSeedStatus] = useState<'idle' | 'running' | 'ok' | 'error'>('idle');
  const [userSeedError, setUserSeedError] = useState('');
  const logRef = useRef<HTMLDivElement>(null);

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

  async function updateAppDataSource(value: string) {
    try {
      await fetch('/api/globals/site-settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appDataSource: value }),
      });
      setAppDataSource(value);
    } catch {
      // Non-critical
    }
  }

  async function refreshCounts() {
    try {
      const results = await Promise.all(
        COLLECTIONS.map((c) =>
          fetch(`/api/${c.key}?limit=0`).then((r) => r.json()),
        ),
      );
      const next = Object.fromEntries(
        COLLECTIONS.map((c, i) => [c.key, results[i]?.totalDocs ?? counts[c.key]]),
      ) as Counts;
      setCounts(next);
    } catch {
      // Non-critical — counts just won't refresh
    }
  }

  async function streamOperation(url: string, body: unknown) {
    setIsRunning(true);
    setLog([]);
    setClearConfirm(false);

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        appendLog(`Error: ${res.status} ${res.statusText}`);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const lines = decoder.decode(value, { stream: true }).split('\n').filter(Boolean);
        for (const line of lines) {
          try {
            const event = JSON.parse(line) as { type: string; message: string };
            appendLog(`[${event.type}] ${event.message}`);
          } catch {
            appendLog(line);
          }
        }
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

    const slugs: SeedCollection[] = ['cheatSheetEntries', 'exercises', 'flashcards', 'sections', 'languages'];
    try {
      for (const slug of slugs) {
        const res = await fetch(`/api/${slug}?where[id][exists][equals]=true`, {
          method: 'DELETE',
        });
        appendLog(`Cleared ${slug} (${res.status})`);
      }
    } catch (err) {
      appendLog(`Clear failed: ${String(err)}`);
    } finally {
      setIsRunning(false);
      await refreshCounts();
    }
  }

  async function seedUserData() {
    if (!clerkUserId.trim()) return;
    setUserSeedStatus('running');
    setUserSeedError('');
    try {
      const res = await fetch('/api/seed-user-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clerkUserId: clerkUserId.trim() }),
      });
      const json = await res.json() as { ok?: boolean; error?: string };
      if (!res.ok) {
        setUserSeedStatus('error');
        setUserSeedError(json.error ?? res.statusText);
      } else {
        setUserSeedStatus('ok');
      }
    } catch (err) {
      setUserSeedStatus('error');
      setUserSeedError(String(err));
    }
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
    <div style={{ padding: '2rem', maxWidth: 800, fontFamily: 'inherit' }}>
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
          {(['real', 'mock'] as const).map((val) => (
            <button
              key={val}
              onClick={() => updateAppDataSource(val)}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                border: '1px solid var(--theme-elevation-300)',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 500,
                background: appDataSource === val ? (val === 'mock' ? '#8b5cf6' : '#10b981') : 'var(--theme-elevation-50)',
                color: appDataSource === val ? '#fff' : 'var(--theme-elevation-700)',
              }}
            >
              {val === 'real' ? 'Real Data' : 'Mock Seed Data'}
            </button>
          ))}
        </div>
      </div>

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
          disabled={isRunning || selected.size === 0}
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
          disabled={isRunning || selected.size === 0}
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
          disabled={isRunning}
          style={{ ...btnBase, background: '#10b981', color: '#fff' }}
          onClick={() => streamOperation('/api/sync-to-convex', {})}
        >
          Force Sync to Convex
        </button>

        {clearConfirm ? (
          <button
            disabled={isRunning}
            style={{ ...btnBase, background: '#ef4444', color: '#fff' }}
            onClick={clearAll}
          >
            Confirm Clear All?
          </button>
        ) : (
          <button
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
        <p style={{ fontWeight: 600, fontSize: 14, margin: '0 0 4px' }}>Seed Mock User Data (Convex)</p>
        <p style={{ fontSize: 12, color: 'var(--theme-elevation-500)', margin: '0 0 10px' }}>
          Writes mock streak data for a specific Clerk user into Convex (streak=7, best=14, reviews=18).
          Use this to test the signed-in experience with realistic stats when App Data Source is set to Real.
        </p>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Clerk User ID (user_xxxx)"
            value={clerkUserId}
            onChange={(e) => { setClerkUserId(e.target.value); setUserSeedStatus('idle'); }}
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
            disabled={!clerkUserId.trim() || userSeedStatus === 'running'}
            onClick={seedUserData}
            style={{
              ...btnBase,
              background: '#f59e0b',
              color: '#fff',
              cursor: (!clerkUserId.trim() || userSeedStatus === 'running') ? 'not-allowed' : 'pointer',
              opacity: (!clerkUserId.trim() || userSeedStatus === 'running') ? 0.5 : 1,
            }}
          >
            {userSeedStatus === 'running' ? 'Seeding…' : 'Seed User Data'}
          </button>
        </div>
        {userSeedStatus === 'ok' && (
          <p style={{ color: '#10b981', fontSize: 12, marginTop: 6 }}>Done — mock streak data applied.</p>
        )}
        {userSeedStatus === 'error' && (
          <p style={{ color: '#ef4444', fontSize: 12, marginTop: 6 }}>Error: {userSeedError}</p>
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
                  color: line.includes('[error]')
                    ? '#ef4444'
                    : line.includes('[summary]')
                      ? '#10b981'
                      : 'inherit',
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
