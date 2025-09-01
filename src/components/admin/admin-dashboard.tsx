import React, { useState, useEffect } from 'react'
import { Play, Pause, SkipForward, Volume2, Music, TrendingUp, MoreHorizontal, Search } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { Progress } from '../ui/progress'
import { Slider } from '../ui/slider'
import { AdminSidebar } from './admin-sidebar'
import { toast } from 'sonner@2.0.3'
import { projectId, publicAnonKey } from '../../utils/supabase/info'
import { ImageWithFallback } from '../figma/ImageWithFallback'

type AdminScreen = 'dashboard' | 'pricing' | 'analytics' | 'devices'

interface Song {
  id: string
  title: string
  artist: string
  duration: number
  artwork?: string
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
}

interface AdminDashboardProps {
  sessionId: string
  accessToken: string
  onNavigate: (screen: AdminScreen) => void
  onLogout: () => void
}

export function AdminDashboard({ sessionId, accessToken, onNavigate, onLogout }: AdminDashboardProps) {
  const [session, setSession] = useState<Session | null>(null)
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [nowPlaying, setNowPlaying] = useState<QueueItem | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState([75])
  const [progress, setProgress] = useState(45)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  // Fetch data on mount and set up polling
  useEffect(() => {
    fetchSession()
    fetchQueue()
    const interval = setInterval(fetchQueue, 3000)
    return () => clearInterval(interval)
  }, [])

  const fetchSession = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7f416d54/session/${sessionId}`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      })
      
      if (response.ok) {
        const sessionData = await response.json()
        setSession(sessionData)
      }
    } catch (error) {
      console.error('Error fetching session:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchQueue = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7f416d54/queue/${sessionId}`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      })
      
      if (response.ok) {
        const queueData = await response.json()
        setQueue(queueData.filter((item: QueueItem) => item.status === 'queued'))
        const playing = queueData.find((item: QueueItem) => item.status === 'playing')
        setNowPlaying(playing || null)
      }
    } catch (error) {
      console.error('Error fetching queue:', error)
    }
  }

  const handleSkip = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7f416d54/admin/queue/${sessionId}/skip`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        toast.success('Song skipped')
        fetchQueue()
      } else {
        toast.error('Failed to skip song')
      }
    } catch (error) {
      console.error('Error skipping song:', error)
      toast.error('Failed to skip song')
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffMinutes < 1) return 'Just now'
    if (diffMinutes < 60) return `${diffMinutes}m ago`
    const hours = Math.floor(diffMinutes / 60)
    return `${hours}h ago`
  }

  if (loading) {
    return (
      <div className="flex h-screen">
        <AdminSidebar 
          currentScreen="dashboard" 
          onNavigate={onNavigate} 
          onLogout={onLogout}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar 
        currentScreen="dashboard" 
        onNavigate={onNavigate} 
        onLogout={onLogout}
      />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">{session?.barName || 'BarJukebox Admin'}</h1>
                <p className="text-muted-foreground">Session Dashboard</p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant={session?.isOpen ? "default" : "secondary"} className="px-3 py-1">
                  {session?.isOpen ? 'Session Open' : 'Session Closed'}
                </Badge>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Price per song</p>
                  <p className="font-semibold">${session?.pricePerSong || 3}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Now Playing */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
                    Now Playing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {nowPlaying ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                          {nowPlaying.song.artwork ? (
                            <ImageWithFallback 
                              src={nowPlaying.song.artwork} 
                              alt={nowPlaying.song.title}
                              className="w-full h-full object-cover rounded-xl"
                            />
                          ) : (
                            <Music className="w-10 h-10 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{nowPlaying.song.title}</h3>
                          <p className="text-muted-foreground">{nowPlaying.song.artist}</p>
                          <p className="text-sm text-muted-foreground">
                            Duration: {formatDuration(nowPlaying.song.duration)}
                          </p>
                        </div>
                        {nowPlaying.boosted && (
                          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Boosted
                          </Badge>
                        )}
                      </div>
                      
                      {nowPlaying.dedication && (
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-sm">💬 {nowPlaying.dedication}</p>
                        </div>
                      )}

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <Progress value={progress} className="h-2" />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>1:23</span>
                          <span>{formatDuration(nowPlaying.song.duration)}</span>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center justify-center gap-4">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setIsPlaying(!isPlaying)}
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleSkip}
                        >
                          <SkipForward className="w-4 h-4" />
                        </Button>
                        <div className="flex items-center gap-2 ml-4">
                          <Volume2 className="w-4 h-4" />
                          <Slider
                            value={volume}
                            onValueChange={setVolume}
                            max={100}
                            step={1}
                            className="w-24"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Music className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground">No song currently playing</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Staff Search */}
            <Card>
              <CardHeader>
                <CardTitle>Staff Song Search</CardTitle>
                <CardDescription>Add songs directly to queue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search and add songs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {searchQuery && (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground">
                        Staff search functionality would appear here
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Queue */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>
                Up Next ({queue.length} songs)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {queue.length > 0 ? (
                <div className="space-y-3">
                  {queue.slice(0, 10).map((item, index) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-3 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center p-0 text-xs">
                        #{index + 1}
                      </Badge>
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
                      <div className="flex-1">
                        <p className="font-medium">{item.song.title}</p>
                        <p className="text-sm text-muted-foreground">{item.song.artist}</p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDuration(item.song.duration)}
                      </div>
                      {item.dedication && (
                        <div className="max-w-32">
                          <p className="text-xs text-muted-foreground truncate">
                            💬 {item.dedication}
                          </p>
                        </div>
                      )}
                      {item.boosted && (
                        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          +${item.tip}
                        </Badge>
                      )}
                      <div className="text-xs text-muted-foreground">
                        {formatTimeAgo(item.createdAt)}
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  
                  {queue.length > 10 && (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground">
                        ... and {queue.length - 10} more songs
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Music className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">Queue is empty</p>
                  <p className="text-sm text-muted-foreground">Songs will appear here as patrons add them</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}