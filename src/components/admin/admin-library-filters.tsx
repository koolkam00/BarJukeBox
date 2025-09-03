import React, { useEffect, useState } from 'react'
import { AdminSidebar } from './admin-sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { toast } from 'sonner@2.0.3'
import { projectId } from '../../utils/supabase/info'

type AdminScreen = 'dashboard' | 'pricing' | 'analytics' | 'devices' | 'library'

interface AdminLibraryFiltersProps {
  accessToken: string
  onNavigate: (screen: AdminScreen) => void
  onLogout: () => void
}

export function AdminLibraryFilters({ accessToken, onNavigate, onLogout }: AdminLibraryFiltersProps) {
  const [providers, setProviders] = useState({ spotify: true, apple: true })
  const [allowArtists, setAllowArtists] = useState<string[]>([])
  const [blockArtists, setBlockArtists] = useState<string[]>([])
  const [allowSongs, setAllowSongs] = useState<string[]>([])
  const [blockSongs, setBlockSongs] = useState<string[]>([])
  const [blockGenres, setBlockGenres] = useState<string[]>([])

  const [inputs, setInputs] = useState({
    allowArtist: '',
    blockArtist: '',
    allowSong: '',
    blockSong: '',
    blockGenre: ''
  })

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`https://${projectId}.supabase.co/functions/v1/server/make-server-7f416d54/filters`, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        })
        if (res.ok) {
          const data = await res.json()
          setProviders(data.providers || { spotify: true, apple: true })
          setAllowArtists(data.allowArtists || [])
          setBlockArtists(data.blockArtists || [])
          setAllowSongs(data.allowSongs || [])
          setBlockSongs(data.blockSongs || [])
          setBlockGenres(data.blockGenres || [])
        }
      } catch (e) {
        console.error('Failed to load filters', e)
      }
    }
    load()
  }, [])

  const save = async () => {
    try {
      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/server/make-server-7f416d54/filters`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ providers, allowArtists, blockArtists, allowSongs, blockSongs, blockGenres })
      })
      if (res.ok) {
        toast.success('Filters saved')
      } else {
        toast.error('Failed to save filters')
      }
    } catch (e) {
      console.error('Failed to save filters', e)
      toast.error('Failed to save filters')
    }
  }

  const addTo = (key: keyof typeof inputs, listSetter: React.Dispatch<React.SetStateAction<string[]>>) => {
    const val = inputs[key].trim()
    if (!val) return
    listSetter((prev) => Array.from(new Set([...prev, val])))
    setInputs((prev) => ({ ...prev, [key]: '' }))
  }

  const removeFrom = (value: string, listSetter: React.Dispatch<React.SetStateAction<string[]>>) => {
    listSetter((prev) => prev.filter((v) => v !== value))
  }

  return (
    <div className="flex h-screen">
      <AdminSidebar currentScreen="library" onNavigate={onNavigate} onLogout={onLogout} />
      <div className="flex-1 overflow-auto p-6 space-y-6 bg-background">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Library Filters</h1>
          <Button onClick={save}>Save Changes</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Providers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Spotify</span>
                <Button variant={providers.spotify ? 'default' : 'outline'} onClick={() => setProviders(p => ({ ...p, spotify: !p.spotify }))}>
                  {providers.spotify ? 'Enabled' : 'Disabled'}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span>Apple Music</span>
                <Button variant={providers.apple ? 'default' : 'outline'} onClick={() => setProviders(p => ({ ...p, apple: !p.apple }))}>
                  {providers.apple ? 'Enabled' : 'Disabled'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Allow Artists (optional)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input placeholder="Add artist" value={inputs.allowArtist} onChange={(e) => setInputs({ ...inputs, allowArtist: e.target.value })} />
                <Button onClick={() => addTo('allowArtist', setAllowArtists)}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {allowArtists.map((a) => (
                  <Badge key={a} variant="outline" className="cursor-pointer" onClick={() => removeFrom(a, setAllowArtists)}>
                    {a}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Block Artists</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input placeholder="Add artist" value={inputs.blockArtist} onChange={(e) => setInputs({ ...inputs, blockArtist: e.target.value })} />
                <Button onClick={() => addTo('blockArtist', setBlockArtists)}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {blockArtists.map((a) => (
                  <Badge key={a} variant="outline" className="cursor-pointer" onClick={() => removeFrom(a, setBlockArtists)}>
                    {a}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Allow Songs (optional)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input placeholder="Add song title" value={inputs.allowSong} onChange={(e) => setInputs({ ...inputs, allowSong: e.target.value })} />
                <Button onClick={() => addTo('allowSong', setAllowSongs)}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {allowSongs.map((s) => (
                  <Badge key={s} variant="outline" className="cursor-pointer" onClick={() => removeFrom(s, setAllowSongs)}>
                    {s}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Block Songs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input placeholder="Add song title" value={inputs.blockSong} onChange={(e) => setInputs({ ...inputs, blockSong: e.target.value })} />
                <Button onClick={() => addTo('blockSong', setBlockSongs)}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {blockSongs.map((s) => (
                  <Badge key={s} variant="outline" className="cursor-pointer" onClick={() => removeFrom(s, setBlockSongs)}>
                    {s}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Block Genres</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input placeholder="Add genre" value={inputs.blockGenre} onChange={(e) => setInputs({ ...inputs, blockGenre: e.target.value })} />
                <Button onClick={() => addTo('blockGenre', setBlockGenres)}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {blockGenres.map((g) => (
                  <Badge key={g} variant="outline" className="cursor-pointer" onClick={() => removeFrom(g, setBlockGenres)}>
                    {g}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


