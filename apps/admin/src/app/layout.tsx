import type React from 'react'

export const metadata = {
  title: 'Admin',
  description: 'Admin dashboard',
}

const Layout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <body>{children}</body>
  </html>
)

export default Layout
