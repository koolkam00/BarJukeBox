import React from 'react'
import { Music, Clock, TrendingUp, MoreHorizontal } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { BottomNavigation } from './bottom-navigation'
import { ImageWithFallback } from '../figma/ImageWithFallback'

type PatronScreen = 'discover' | 'queue' | 'account'

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
  barName: string
  avgWaitTime: number
}

interface PatronQueueProps {
  queue: QueueItem[]
  userId: string
  session: Session
  onNavigate: (screen: PatronScreen) => void
}

export function PatronQueue({ queue, userId, session, onNavigate }: PatronQueueProps) {
  const nowPlaying = queue.find(item => item.status === 'playing')
  const queuedSongs = queue.filter(item => item.status === 'queued')
  const userSongs = queuedSongs.filter(item => item.userId === userId)

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const calculateETA = (position: number) => {
    const avgSongLength = 3 * 60 // 3 minutes average
    const estimatedSeconds = position * avgSongLength
    const minutes = Math.round(estimatedSeconds / 60)
    return minutes
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

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-white">
        <div className="max-w-md mx-auto">
          <h1 className="text-xl font-semibold">{session.barName}</h1>
          <p className="text-sm text-purple-100">Music Queue</p>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Now Playing */}
        {nowPlaying ? (
          <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/50 dark:to-blue-950/50">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <CardTitle className="text-sm font-medium text-purple-800 dark:text-purple-200">
                  Now Playing
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  {nowPlaying.song.artwork ? (
                    <ImageWithFallback 
                      src={nowPlaying.song.artwork} 
                      alt={nowPlaying.song.title}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <Music className="w-8 h-8 text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{nowPlaying.song.title}</p>
                  <p className="text-sm text-muted-foreground truncate">{nowPlaying.song.artist}</p>
                  <Progress value={45} className="mt-2 h-1" />
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <p>{formatDuration(nowPlaying.song.duration)}</p>
                </div>
              </div>
              {nowPlaying.dedication && (
                <div className="mt-3 p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-sm text-purple-700 dark:text-purple-300">💬 {nowPlaying.dedication}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="text-center py-8">
            <CardContent>
              <Music className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground">No song currently playing</p>
            </CardContent>
          </Card>
        )}

        {/* Your Songs */}
        {userSongs.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-semibold flex items-center gap-2">
              <Music className="w-5 h-5 text-purple-600" />
              Your Songs ({userSongs.length})
            </h2>
            <div className="space-y-2">
              {userSongs.map((item, index) => (
                <Card key={item.id} className="border-l-4 border-l-purple-500">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center p-0">
                          #{item.position + 1}
                        </Badge>
                      </div>
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        {item.song.artwork ? (
                          <ImageWithFallback 
                            src={item.song.artwork} 
                            alt={item.song.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Music className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.song.title}</p>
                        <p className="text-sm text-muted-foreground truncate">{item.song.artist}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-muted-foreground">
                            ETA: ~{calculateETA(item.position)}m
                          </p>
                          {item.boosted && (
                            <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Boosted
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                    {item.dedication && (
                      <div className="mt-2 p-2 bg-muted/50 rounded text-sm">
                        💬 {item.dedication}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Up Next */}
        {queuedSongs.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-semibold">Up Next ({queuedSongs.length})</h2>
            <div className="space-y-2">
              {queuedSongs.slice(0, 10).map((item) => {
                const isUserSong = item.userId === userId
                return (
                  <Card 
                    key={item.id} 
                    className={`${isUserSong ? 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800' : ''}`}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center p-0 text-xs">
                          #{item.position + 1}
                        </Badge>
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                          {item.song.artwork ? (
                            <ImageWithFallback 
                              src={item.song.artwork} 
                              alt={item.song.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Music className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{item.song.title}</p>
                          <p className="text-sm text-muted-foreground truncate">{item.song.artist}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs text-muted-foreground">
                              {formatTimeAgo(item.createdAt)}
                            </p>
                            {item.boosted && (
                              <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                Boosted
                              </Badge>
                            )}
                            {isUserSong && (
                              <Badge variant="outline" className="text-xs">
                                Your Song
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right text-xs text-muted-foreground">
                          <p>~{calculateETA(item.position)}m</p>
                        </div>
                      </div>
                      {item.dedication && (
                        <div className="mt-2 p-2 bg-muted/50 rounded text-sm">
                          💬 {item.dedication}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
            
            {queuedSongs.length > 10 && (
              <p className="text-center text-sm text-muted-foreground py-4">
                ... and {queuedSongs.length - 10} more songs
              </p>
            )}
          </div>
        )}

        {/* Empty State */}
        {queuedSongs.length === 0 && !nowPlaying && (
          <Card className="text-center py-12">
            <CardContent>
              <Music className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <CardTitle className="mb-2">Queue is empty</CardTitle>
              <CardDescription className="mb-4">
                Be the first to add a song and get the party started!
              </CardDescription>
              <Button onClick={() => onNavigate('discover')}>
                Browse Songs
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <BottomNavigation 
        activeTab="queue" 
        onNavigate={onNavigate}
      />
    </div>
  )
}