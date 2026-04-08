import type React from 'react'
import '@payloadcms/next/css'
import './custom.scss'

type Args = {
  children: React.ReactNode
}

const Layout = ({ children }: Args) => children

export default Layout
