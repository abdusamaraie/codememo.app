'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { cheatSheetEntries } from '@repo/mock-data/seed/cheatsheet-entries';
import type { CheatSheetEntrySeed } from '@repo/mock-data/seed/cheatsheet-entries';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  languageSlug: string;
  sectionTitle?: string;
};

export function CheatSheetPanel({ open, onOpenChange, languageSlug, sectionTitle }: Props) {
  const [search, setSearch] = useState('');

  const entries = useMemo(() => {
    return cheatSheetEntries.filter(
      (e) => e.languageSlug === languageSlug && e.isPublished,
    );
  }, [languageSlug]);

  const filtered = useMemo(() => {
    if (!search.trim()) return entries;
    const needle = search.trim().toLowerCase();
    return entries.filter(
      (e) =>
        e.title.toLowerCase().includes(needle) ||
        e.syntax.toLowerCase().includes(needle) ||
        e.description.toLowerCase().includes(needle) ||
        (e.example?.toLowerCase().includes(needle) ?? false),
    );
  }, [entries, search]);

  const categories = useMemo(() => {
    const map = new Map<string, CheatSheetEntrySeed[]>();
    for (const entry of filtered) {
      const list = map.get(entry.category) ?? [];
      list.push(entry);
      map.set(entry.category, list);
    }
    return Array.from(map.entries()).map(([name, items]) => ({
      name,
      items: items.sort((a, b) => a.order - b.order),
    }));
  }, [filtered]);

  // Auto-expand category matching the current section title
  const defaultOpen = useMemo(() => {
    if (!sectionTitle) return categories.map((c) => c.name);
    const match = categories.find((c) =>
      sectionTitle.toLowerCase().includes(c.name.toLowerCase()) ||
      c.name.toLowerCase().includes(sectionTitle.toLowerCase()),
    );
    return match ? [match.name] : categories.map((c) => c.name);
  }, [categories, sectionTitle]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[480px] overflow-y-auto bg-background border-border z-[80]"
        overlayClassName="z-[75]"
      >
        <SheetHeader className="pb-3">
          <SheetTitle className="text-lg text-foreground">Quick Reference</SheetTitle>
        </SheetHeader>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search syntax..."
            className="pl-9"
          />
        </div>

        {categories.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            {entries.length === 0
              ? 'No cheat sheet entries for this language yet.'
              : 'No results found.'}
          </p>
        ) : (
          <Accordion type="multiple" defaultValue={defaultOpen}>
            {categories.map((cat) => (
              <AccordionItem key={cat.name} value={cat.name}>
                <AccordionTrigger className="text-sm font-semibold text-foreground">
                  {cat.name}
                  <span className="ml-auto mr-2 text-xs font-normal text-muted-foreground">
                    {cat.items.length}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {cat.items.map((entry, i) => (
                      <div
                        key={`${entry.title}-${i}`}
                        className="rounded-lg border border-border bg-card p-3"
                      >
                        <code className="font-mono text-sm text-primary font-semibold break-all">
                          {entry.title}
                        </code>
                        <pre className="mt-1.5 text-xs font-mono text-foreground bg-muted rounded px-2 py-1.5 overflow-x-auto whitespace-pre-wrap">
                          {entry.syntax}
                        </pre>
                        <p className="mt-1.5 text-xs text-muted-foreground">
                          {entry.description}
                        </p>
                        {entry.example && (
                          <pre className="mt-1.5 text-[11px] font-mono text-muted-foreground bg-muted rounded px-2 py-1 overflow-x-auto whitespace-pre-wrap">
                            {entry.example}
                          </pre>
                        )}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </SheetContent>
    </Sheet>
  );
}
