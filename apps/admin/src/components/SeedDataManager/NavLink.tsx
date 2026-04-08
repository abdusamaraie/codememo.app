'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function SeedDataManagerNavLink() {
  const pathname = usePathname()
  const isActive = pathname === '/seed-data-manager'

  return (
    <div style={{ padding: '0 16px 8px' }}>
      <Link
        href="/seed-data-manager"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          borderRadius: '4px',
          fontSize: '14px',
          fontWeight: 500,
          textDecoration: 'none',
          color: isActive ? 'var(--theme-elevation-1000)' : 'var(--theme-elevation-800)',
          background: isActive ? 'var(--theme-elevation-150)' : 'transparent',
        }}
      >
        <span style={{ fontSize: '16px' }}>🌱</span>
        Seed Data Manager
      </Link>
    </div>
  )
}
