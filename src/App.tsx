import React, { useState, useEffect } from 'react'
import { PatronApp } from './components/patron-app'
import { AdminPanel } from './components/admin-panel'
import { TVDisplay } from './components/tv-display'
import { DesignGallery } from './components/design-gallery'
import { LandingPage } from './components/landing-page'
import { AppMode } from './components/app-config'

export default function App() {
  const [mode, setMode] = useState<AppMode>('launcher')
  const [sessionId, setSessionId] = useState<string>('demo-session')

  // Check URL for mode and session parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const modeParam = urlParams.get('app') as AppMode
    const sessionParam = urlParams.get('session')
    
    if (modeParam && ['patron', 'admin', 'tv', 'gallery'].includes(modeParam)) {
      setMode(modeParam)
      if (sessionParam) {
        setSessionId(sessionParam)
      }
    }
  }, [])

  const openApp = (app: string, sessionId?: string) => {
    const url = new URL(window.location.href)
    url.searchParams.set('app', app)
    if (sessionId) {
      url.searchParams.set('session', sessionId)
    }
    window.open(url.toString(), '_blank')
  }

  const navigateToApp = (app: AppMode, sessionId?: string) => {
    setMode(app)
    if (sessionId) {
      setSessionId(sessionId)
    }
    
    // Update URL without page reload
    const url = new URL(window.location.href)
    url.searchParams.set('app', app)
    if (sessionId) {
      url.searchParams.set('session', sessionId)
    }
    window.history.pushState({}, '', url.toString())
  }

  const renderApp = () => {
    switch (mode) {
      case 'patron':
        return <PatronApp sessionId={sessionId} />
      case 'admin':
        return <AdminPanel />
      case 'tv':
        return <TVDisplay sessionId={sessionId} />
      case 'gallery':
        return <DesignGallery />
      default:
        return (
          <LandingPage 
            onNavigate={navigateToApp}
            onOpenInNewTab={openApp}
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {renderApp()}
    </div>
  )
}