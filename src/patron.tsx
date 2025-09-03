import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { PatronApp } from './components/patron-app'
import { Card, CardContent } from './components/ui/card'
import { Button } from './components/ui/button'
import { projectId } from './utils/supabase/info'
import './index.css'
import './styles/globals.css'

export default function PatronEntry() {
  const [sessionId, setSessionId] = useState<string>('demo-session')
  const [availableSessions, setAvailableSessions] = useState<{ id: string, barName: string, pricePerSong: number }[]>([])

  // Check URL for session parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const sessionParam = urlParams.get('session')
    
    if (sessionParam) {
      setSessionId(sessionParam)
    }
  }, [])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`https://${projectId}.functions.supabase.co/server/make-server-7f416d54/sessions/active`)
        if (res.ok) {
          const data = await res.json()
          setAvailableSessions(data)
        }
      } catch (e) {
        console.error('Failed to load sessions', e)
      }
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {sessionId ? (
        <PatronApp sessionId={sessionId} />
      ) : (
        <div className="max-w-md mx-auto p-4 space-y-4">
          <h1 className="text-2xl font-bold">Choose a Bar</h1>
          {availableSessions.length > 0 ? (
            availableSessions.map((s) => (
              <Card key={s.id} className="hover:bg-accent transition-colors">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{s.barName}</p>
                    <p className="text-sm text-muted-foreground">${s.pricePerSong}/song</p>
                  </div>
                  <Button onClick={() => setSessionId(s.id)}>Join</Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground">No active bars right now.</p>
          )}
        </div>
      )}
    </div>
  )
}

const rootElement = document.getElementById('root')
if (rootElement) {
  createRoot(rootElement).render(<PatronEntry />)
}