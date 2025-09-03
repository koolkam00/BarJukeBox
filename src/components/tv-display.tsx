import React, { useState, useEffect } from 'react'
import { Music, Clock, QrCode } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { projectId, publicAnonKey } from '../utils/supabase/info'
import { ImageWithFallback } from './figma/ImageWithFallback'

interface Song {
  id: string
  title: string
  artist: string
  duration: number
  artwork?: string
}

interface QueueItem {
  id: string
  song: Song
  dedication?: string
  boosted?: boolean
  status: 'queued' | 'playing' | 'played'
}

interface TVDisplayProps {
  sessionId: string
}

export function TVDisplay({ sessionId }: TVDisplayProps) {
  const [nowPlaying, setNowPlaying] = useState<QueueItem | null>(null)
  const [upNext, setUpNext] = useState<QueueItem[]>([])
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Fetch queue data
  useEffect(() => {
    fetchQueue()
    const interval = setInterval(fetchQueue, 2000)
    return () => clearInterval(interval)
  }, [])

  // Update time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Simulate playback progress
  useEffect(() => {
    if (nowPlaying) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / nowPlaying.song.duration)
          return newProgress >= 100 ? 0 : newProgress
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [nowPlaying])

  const fetchQueue = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/server/make-server-7f416d54/queue/${sessionId}`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      })
      
      if (response.ok) {
        const queue = await response.json()
        const playing = queue.find((item: QueueItem) => item.status === 'playing')
        const queued = queue.filter((item: QueueItem) => item.status === 'queued').slice(0, 5)
        
        setNowPlaying(playing || null)
        setUpNext(queued)
      }
    } catch (error) {
      console.error('Error fetching queue:', error)
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const qrCodeUrl = `${window.location.origin}?mode=patron&session=${sessionId}`

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black to-blue-900/30" />
      
      {/* Main content */}
      <div className="relative z-10 p-8 h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
              <Music className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">BarJukebox</h1>
              <p className="text-purple-300">Live Music Queue</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold">{formatTime(currentTime)}</p>
            <p className="text-purple-300">Live Session</p>
          </div>
        </div>

        <div className="flex-1 flex gap-8">
          {/* Main Now Playing Section */}
          <div className="flex-1">
            {nowPlaying ? (
              <div className="text-center">
                <div className="mb-6">
                  <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-lg px-4 py-2 mb-8">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-3" />
                    Now Playing
                  </Badge>
                </div>

                {/* Album Art */}
                <div className="w-80 h-80 mx-auto mb-8 rounded-3xl overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  {nowPlaying.song.artwork ? (
                    <ImageWithFallback 
                      src={nowPlaying.song.artwork} 
                      alt={nowPlaying.song.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Music className="w-32 h-32 text-white/80" />
                  )}
                </div>

                {/* Song Info */}
                <div className="mb-8">
                  <h2 className="text-5xl font-bold mb-4 leading-tight">{nowPlaying.song.title}</h2>
                  <p className="text-3xl text-purple-300 mb-6">{nowPlaying.song.artist}</p>
                  
                  {nowPlaying.dedication && (
                    <div className="bg-white/10 backdrop-blur rounded-2xl p-4 max-w-md mx-auto">
                      <p className="text-lg">💬 {nowPlaying.dedication}</p>
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="max-w-md mx-auto mb-4">
                  <Progress value={progress} className="h-2 bg-white/20" />
                  <div className="flex justify-between mt-2 text-sm text-purple-300">
                    <span>{Math.floor(progress * nowPlaying.song.duration / 100 / 60)}:{Math.floor((progress * nowPlaying.song.duration / 100) % 60).toString().padStart(2, '0')}</span>
                    <span>{formatDuration(nowPlaying.song.duration)}</span>
                  </div>
                </div>

                {nowPlaying.boosted && (
                  <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 text-lg px-4 py-1">
                    ⚡ Boosted Song
                  </Badge>
                )}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Music className="w-16 h-16 text-white/50" />
                </div>
                <h2 className="text-4xl font-bold mb-4">No Song Playing</h2>
                <p className="text-xl text-purple-300">Waiting for the next track...</p>
              </div>
            )}
          </div>

          {/* Side Panel */}
          <div className="w-80 space-y-6">
            {/* QR Code */}
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="p-6 text-center">
                <div className="w-32 h-32 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <QrCode className="w-20 h-20 text-black" />
                </div>
                <h3 className="text-xl font-bold mb-2">Join the Queue!</h3>
                <p className="text-purple-300 mb-3">Scan to add your song</p>
                <p className="text-sm text-white/60 font-mono bg-black/30 px-3 py-1 rounded">
                  barjukebox.com/join
                </p>
              </CardContent>
            </Card>

            {/* Up Next */}
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-center">Up Next</h3>
                {upNext.length > 0 ? (
                  <div className="space-y-3">
                    {upNext.map((item, index) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                          {item.song.artwork ? (
                            <ImageWithFallback 
                              src={item.song.artwork} 
                              alt={item.song.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Music className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.song.title}</p>
                          <p className="text-xs text-purple-300 truncate">{item.song.artist}</p>
                          {item.boosted && (
                            <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 text-xs mt-1">
                              ⚡ Boosted
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-white/60">
                          ~{(index + 1) * 3}m
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Music className="w-12 h-12 mx-auto mb-3 text-white/30" />
                    <p className="text-white/60">Queue is empty</p>
                    <p className="text-sm text-white/40">Be the first to add a song!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur border-white/20">
              <CardContent className="p-6 text-center">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-2xl font-bold">{upNext.length + (nowPlaying ? 1 : 0)}</p>
                    <p className="text-sm text-purple-300">In Queue</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">$3</p>
                    <p className="text-sm text-purple-300">Per Song</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-white/60">
          <p className="text-lg">Powered by BarJukebox • Real-time Music Experience</p>
        </div>
      </div>
    </div>
  )
}