import React, { useState, useEffect } from 'react'
import { TVDisplay } from './components/tv-display'

export default function TVEntry() {
  const [sessionId, setSessionId] = useState<string>('demo-session')

  // Check URL for session parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const sessionParam = urlParams.get('session')
    
    if (sessionParam) {
      setSessionId(sessionParam)
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <TVDisplay sessionId={sessionId} />
    </div>
  )
}