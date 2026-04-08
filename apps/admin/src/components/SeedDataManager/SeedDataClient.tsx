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
}

export function SeedDataClient({ counts: initialCounts }: Props) {
  const [counts, setCounts] = useState(initialCounts);
  const [selected, setSelected] = useState<Set<SeedCollection>>(
    new Set(COLLECTIONS.map((c) => c.key)),
  );
  const [log, setLog] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [clearConfirm, setClearConfirm] = useState(false);
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

  async function refreshCounts() {
    try {
      const results = await Promise.all(
        COLLECTIONS.map((c) =>
          fetch(`/api/${c.key}?limit=0`).then((r) => r.json()),
        ),
      );
      const next: Counts = {
        languages: results[0]?.totalDocs ?? counts.languages,
        sections: results[1]?.totalDocs ?? counts.sections,
        flashcards: results[2]?.totalDocs ?? counts.flashcards,
        exercises: results[3]?.totalDocs ?? counts.exercises,
        cheatSheetEntries: results[4]?.totalDocs ?? counts.cheatSheetEntries,
      };
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
