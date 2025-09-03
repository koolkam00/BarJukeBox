import React, { useState, useEffect } from 'react'
import { Search, Music, Clock, Users } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { toast } from 'sonner@2.0.3'
import { Toaster } from './ui/sonner'
import { PatronOnboarding } from './patron/patron-onboarding'
import { PatronDiscover } from './patron/patron-discover'
import { PatronQueue } from './patron/patron-queue'
import { PatronAccount } from './patron/patron-account'
import { SongDetail } from './patron/song-detail'
import { ApplePaySheet } from './patron/apple-pay-sheet'
import { projectId, publicAnonKey } from '../utils/supabase/info'

type PatronScreen = 'onboarding' | 'discover' | 'queue' | 'account' | 'song-detail' | 'apple-pay' | 'confirmation'

interface Song {
  id: string
  title: string
  artist: string
  duration: number
  artwork?: string
  genre?: string
}

interface QueueItem {
  id: string
  songId: string
  song: Song
  userId: string
  position: number
  dedication?: string
  boosted?: boolean
  tip?: number
  createdAt: string
  status: 'queued' | 'playing' | 'played'
}

interface Session {
  id: string
  barName: string
  isOpen: boolean
  pricePerSong: number
  avgWaitTime: number
  maxSongLength: number
  explicitFilter: boolean
}

interface PatronAppProps {
  sessionId: string
}

export function PatronApp({ sessionId }: PatronAppProps) {
  const [screen, setScreen] = useState<PatronScreen>('onboarding')
  const [session, setSession] = useState<Session | null>(null)
  const [selectedSong, setSelectedSong] = useState<Song | null>(null)
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [userId] = useState(() => crypto.randomUUID()) // In real app, this would come from auth
  const [loading, setLoading] = useState(false)

  // Fetch session data
  useEffect(() => {
    fetchSession()
  }, [sessionId])

  // Poll queue updates
  useEffect(() => {
    if (session && screen !== 'onboarding') {
      const interval = setInterval(fetchQueue, 3000)
      return () => clearInterval(interval)
    }
  }, [session, screen])

  const fetchSession = async () => {
    try {
      setLoading(true)
      const response = await fetch(`https://${projectId}.functions.supabase.co/server/make-server-7f416d54/session/${sessionId}`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      })
      
      if (response.ok) {
        const sessionData = await response.json()
        setSession(sessionData)
      } else {
        toast.error('Session not found')
      }
    } catch (error) {
      console.error('Error fetching session:', error)
      toast.error('Failed to connect to session')
    } finally {
      setLoading(false)
    }
  }

  const fetchQueue = async () => {
    try {
      const response = await fetch(`https://${projectId}.functions.supabase.co/server/make-server-7f416d54/queue/${sessionId}`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      })
      
      if (response.ok) {
        const queueData = await response.json()
        setQueue(queueData)
      }
    } catch (error) {
      console.error('Error fetching queue:', error)
    }
  }

  const handleSongSelect = (song: Song) => {
    setSelectedSong(song)
    setScreen('song-detail')
  }

  const handleAddToQueue = async (song: Song, dedication?: string, tip?: number) => {
    setScreen('apple-pay')
    
    // Simulate Apple Pay processing
    setTimeout(async () => {
      try {
        const response = await fetch(`https://${projectId}.functions.supabase.co/server/make-server-7f416d54/queue/${sessionId}/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            songId: song.id,
            song,
            userId,
            dedication,
            tip
          })
        })

        if (response.ok) {
          const result = await response.json()
          toast.success('Song added to queue!')
          setScreen('confirmation')
          fetchQueue()
        } else {
          const error = await response.json()
          toast.error(error.error || 'Failed to add song')
          setScreen('song-detail')
        }
      } catch (error) {
        console.error('Error adding song:', error)
        toast.error('Failed to add song to queue')
        setScreen('song-detail')
      }
    }, 2000)
  }

  const renderScreen = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>Connecting to session...</p>
          </div>
        </div>
      )
    }

    if (!session) {
      return (
        <div className="flex items-center justify-center min-h-screen p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Session Not Found</CardTitle>
              <CardDescription>
                The session ID "{sessionId}" could not be found or is no longer active.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => window.location.href = '/'} className="w-full">
                Return Home
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }

    switch (screen) {
      case 'onboarding':
        return (
          <PatronOnboarding 
            session={session} 
            onJoin={() => setScreen('discover')} 
          />
        )
      case 'discover':
        return (
          <PatronDiscover 
            session={session}
            onSongSelect={handleSongSelect}
            onNavigate={setScreen}
          />
        )
      case 'song-detail':
        return selectedSong ? (
          <SongDetail 
            song={selectedSong}
            session={session}
            onAddToQueue={handleAddToQueue}
            onBack={() => setScreen('discover')}
          />
        ) : null
      case 'apple-pay':
        return (
          <ApplePaySheet 
            song={selectedSong}
            session={session}
          />
        )
      case 'confirmation':
        return (
          <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Music className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-green-800">Added to Queue!</CardTitle>
                <CardDescription>
                  Your song has been successfully added to the queue
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="font-medium">{selectedSong?.title}</p>
                  <p className="text-muted-foreground">{selectedSong?.artist}</p>
                </div>
                <div className="flex justify-center gap-4 text-sm">
                  <div className="text-center">
                    <p className="font-medium">{queue.filter(item => item.userId === userId).length}</p>
                    <p className="text-muted-foreground">Position</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">~{Math.round(session.avgWaitTime / 60)}m</p>
                    <p className="text-muted-foreground">ETA</p>
                  </div>
                </div>
                <Button onClick={() => setScreen('queue')} className="w-full">
                  View Queue
                </Button>
              </CardContent>
            </Card>
          </div>
        )
      case 'queue':
        return (
          <PatronQueue 
            queue={queue}
            userId={userId}
            session={session}
            onNavigate={setScreen}
          />
        )
      case 'account':
        return (
          <PatronAccount 
            onNavigate={setScreen}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {renderScreen()}
      <Toaster />
    </div>
  )
}