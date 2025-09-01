import React, { useState, useEffect } from 'react'
import { PatronApp } from './components/patron-app'

export default function PatronEntry() {
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
      <PatronApp sessionId={sessionId} />
    </div>
  )
}