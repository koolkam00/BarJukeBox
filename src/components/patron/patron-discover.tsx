import React, { useState, useEffect } from 'react'
import { Search, Music, Clock, TrendingUp, Play } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { BottomNavigation } from './bottom-navigation'
import { projectId, publicAnonKey } from '../../utils/supabase/info'
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

interface Session {
  id: string
  barName: string
  pricePerSong: number
  avgWaitTime: number
}

interface PatronDiscoverProps {
  session: Session
  onSongSelect: (song: Song) => void
  onNavigate: (screen: PatronScreen) => void
}

export function PatronDiscover({ session, onSongSelect, onNavigate }: PatronDiscoverProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)

  // Fetch songs on mount and search changes
  useEffect(() => {
    fetchSongs()
  }, [searchQuery])

  const fetchSongs = async () => {
    try {
      setLoading(true)
      const url = searchQuery 
        ? `https://${projectId}.supabase.co/functions/v1/make-server-7f416d54/search?q=${encodeURIComponent(searchQuery)}`
        : `https://${projectId}.supabase.co/functions/v1/make-server-7f416d54/search`

      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      })
      
      if (response.ok) {
        const songsData = await response.json()
        setSongs(songsData)
      }
    } catch (error) {
      console.error('Error fetching songs:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const genres = ['Rock', 'Pop', 'Hip Hop', 'Electronic', 'Country', 'R&B']
  const trendingSongs = songs.slice(0, 3)
  const filteredSongs = selectedGenre 
    ? songs.filter(song => song.genre === selectedGenre)
    : songs

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-white">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold">{session.barName}</h1>
              <p className="text-sm text-purple-100">Discover music</p>
            </div>
            <Badge className="bg-white/20 text-white border-white/30">
              ${session.pricePerSong}/song
            </Badge>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
            <Input
              placeholder="Search any song or artist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
            />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Trending Section */}
        {!searchQuery && trendingSongs.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <h2 className="font-semibold">Trending at {session.barName}</h2>
            </div>
            <div className="space-y-2">
              {trendingSongs.map((song) => (
                <Card 
                  key={song.id} 
                  className="cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => onSongSelect(song)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        {song.artwork ? (
                          <ImageWithFallback 
                            src={song.artwork} 
                            alt={song.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Music className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{song.title}</p>
                        <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">${session.pricePerSong}</p>
                        <p className="text-xs text-muted-foreground">{formatDuration(song.duration)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Genres */}
        {!searchQuery && (
          <div className="space-y-3">
            <h2 className="font-semibold">Browse by Genre</h2>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <Badge
                  key={genre}
                  variant={selectedGenre === genre ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedGenre(selectedGenre === genre ? null : genre)}
                >
                  {genre}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* All Songs / Search Results */}
        <div className="space-y-3">
          <h2 className="font-semibold">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'All Songs'}
          </h2>
          
          {loading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-muted rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4" />
                        <div className="h-3 bg-muted rounded w-1/2" />
                      </div>
                      <div className="w-16 h-8 bg-muted rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredSongs.length > 0 ? (
            <div className="space-y-2">
              {filteredSongs.map((song) => (
                <Card 
                  key={song.id} 
                  className="cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => onSongSelect(song)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center relative">
                        {song.artwork ? (
                          <ImageWithFallback 
                            src={song.artwork} 
                            alt={song.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Music className="w-6 h-6 text-white" />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                          <Play className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{song.title}</p>
                        <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                        {song.genre && (
                          <Badge variant="outline" className="text-xs mt-1">
                            {song.genre}
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">${session.pricePerSong}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDuration(song.duration)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Music className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No songs found</p>
              {searchQuery && (
                <Button 
                  variant="ghost" 
                  onClick={() => setSearchQuery('')}
                  className="mt-2"
                >
                  Clear search
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <BottomNavigation 
        activeTab="discover" 
        onNavigate={onNavigate}
      />
    </div>
  )
}