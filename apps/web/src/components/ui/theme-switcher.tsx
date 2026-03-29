'use client';

import { useRouter } from 'next/navigation';
import { ACCENT_COOKIE, THEME_COOKIE, type AccentName, type ThemeMode } from '@/lib/theme-cookie';

const ACCENTS: { name: AccentName; swatch: string; label: string }[] = [
  { name: 'purple', swatch: '#7c6af6', label: 'Purple (Default)' },
  { name: 'sky',    swatch: '#00a6f4', label: 'Sky'    },
  { name: 'blue',   swatch: '#2b7fff', label: 'Blue'   },
  { name: 'indigo', swatch: '#615fff', label: 'Indigo' },
  { name: 'teal',   swatch: '#00bba7', label: 'Teal'   },
  { name: 'green',  swatch: '#12b76a', label: 'Green'  },
  { name: 'yellow', swatch: '#f0b100', label: 'Yellow' },
  { name: 'orange', swatch: '#fb6514', label: 'Orange' },
  { name: 'red',    swatch: '#fb2c36', label: 'Red'    },
  { name: 'rose',   swatch: '#ff2056', label: 'Rose'   },
  { name: 'gray',   swatch: '#6a7282', label: 'Gray'   },
];

type Props = {
  currentAccent: AccentName;
  currentTheme: ThemeMode;
};

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
}

export function ThemeSwitcher({ currentAccent, currentTheme }: Props) {
  const router = useRouter();

  function applyAccent(name: AccentName) {
    document.documentElement.setAttribute('data-accent', name);
    setCookie(ACCENT_COOKIE, name);
    router.refresh();
  }

  function toggleTheme() {
    const next: ThemeMode = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark',  next === 'dark');
    document.documentElement.classList.toggle('light', next === 'light');
    setCookie(THEME_COOKIE, next);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Accent colour */}
      <div>
        <p className="text-sm font-semibold text-[--foreground] mb-3">Accent Colour</p>
        <div className="flex flex-wrap gap-3">
          {ACCENTS.map(({ name, swatch, label }) => {
            const isActive = currentAccent === name;
            return (
              <button
                key={name}
                title={label}
                aria-label={`Set accent to ${label}`}
                aria-pressed={isActive}
                onClick={() => applyAccent(name)}
                className="relative h-8 w-8 rounded-full border-2 shadow transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{
                  background: swatch,
                  borderColor: isActive ? 'white' : 'transparent',
                  outlineColor: swatch,
                }}
              >
                {isActive && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="h-2 w-2 rounded-full bg-white" />
                  </span>
                )}
                <span className="sr-only">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dark / Light toggle */}
      <div>
        <p className="text-sm font-semibold text-[--foreground] mb-3">Appearance</p>
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-[--border] bg-[--card] hover:border-[--primary] transition-colors text-sm font-medium text-[--foreground]"
          aria-label={`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <span>{currentTheme === 'dark' ? '🌙' : '☀️'}</span>
          <span>{currentTheme === 'dark' ? 'Dark mode' : 'Light mode'}</span>
          <span className="ml-auto text-xs text-[--muted-foreground]">
            Switch to {currentTheme === 'dark' ? 'light' : 'dark'}
          </span>
        </button>
      </div>
    </div>
  );
}
