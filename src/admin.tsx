import React from 'react'
import { createRoot } from 'react-dom/client'
import { AdminPanel } from './components/admin-panel'
import './index.css'
import './styles/globals.css'

export default function AdminEntry() {
  return (
    <div className="min-h-screen bg-background">
      <AdminPanel />
    </div>
  )
}

const rootElement = document.getElementById('root')
if (rootElement) {
  createRoot(rootElement).render(<AdminEntry />)
}