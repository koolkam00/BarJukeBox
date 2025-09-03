// @ts-nocheck
import { Hono } from 'npm:hono'
import { logger } from 'npm:hono/logger'
import { cors } from 'npm:hono/cors'
import { createClient } from 'npm:@supabase/supabase-js'
import * as kv from './kv_store.ts'

const app = new Hono()

// Middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['*'],
}))
app.use('*', logger(console.log))

// Supabase client (prefer SERVICE_ROLE_KEY; fallback to SUPABASE_SERVICE_ROLE_KEY)
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  (Deno.env.get('SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'))!
)

// Types
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
  sessionId: string
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
  maxSongLength: number
  explicitFilter: boolean
  avgWaitTime: number
  ownerId?: string
  nowPlaying?: QueueItem
}

// Utility
const generateId = () => crypto.randomUUID()

// Routes
app.get('/make-server-7f416d54/session/:sessionId', async (c) => {
  try {
    const sessionId = c.req.param('sessionId')
    const session = await kv.get(`session:${sessionId}`)
    if (!session) return c.json({ error: 'Session not found' }, 404)
    return c.json(session)
  } catch (error) {
    console.log('Error fetching session:', error)
    return c.json({ error: 'Failed to fetch session' }, 500)
  }
})

app.post('/make-server-7f416d54/session', async (c) => {
  try {
    const { barName, pricePerSong = 3, maxSongLength = 300, explicitFilter = true } = await c.req.json()
    let ownerId: string | undefined = undefined
    const authHeader = c.req.header('Authorization')
    if (authHeader) {
      const token = authHeader.split(' ')[1]
      const { data: { user } } = await supabase.auth.getUser(token)
      if (user?.id) ownerId = user.id
    }
    const sessionId = generateId()
    const session: Session = {
      id: sessionId,
      barName,
      isOpen: true,
      pricePerSong,
      maxSongLength,
      explicitFilter,
      avgWaitTime: 180,
      ownerId
    }
    await kv.set(`session:${sessionId}`, session)
    await kv.set(`queue:${sessionId}`, [])
    return c.json({ session, qrCodeUrl: `${c.req.url}/../patron/${sessionId}` })
  } catch (error) {
    console.log('Error creating session:', error)
    return c.json({ error: 'Failed to create session' }, 500)
  }
})

app.get('/make-server-7f416d54/sessions/active', async (c) => {
  try {
    const sessions = (await kv.getByPrefix('session:')) as Session[]
    const active = (sessions || []).filter((s) => s?.isOpen)
    return c.json(active.map((s) => ({ id: s.id, barName: s.barName, isOpen: s.isOpen, pricePerSong: s.pricePerSong })))
  } catch (error) {
    console.log('Error listing active sessions:', error)
    return c.json({ error: 'Failed to list sessions' }, 500)
  }
})

app.get('/make-server-7f416d54/queue/:sessionId', async (c) => {
  try {
    const sessionId = c.req.param('sessionId')
    const queue = await kv.get(`queue:${sessionId}`) || []
    return c.json(queue)
  } catch (error) {
    console.log('Error fetching queue:', error)
    return c.json({ error: 'Failed to fetch queue' }, 500)
  }
})

app.post('/make-server-7f416d54/queue/:sessionId/add', async (c) => {
  try {
    const sessionId = c.req.param('sessionId')
    const { songId, song, userId, dedication, tip } = await c.req.json()
    const session = await kv.get(`session:${sessionId}`)
    if (!session || !session.isOpen) return c.json({ error: 'Session not available' }, 400)
    const queue = await kv.get(`queue:${sessionId}`) || []
    const duplicate = queue.find((item: any) => item.songId === songId && item.status === 'queued')
    if (duplicate) return c.json({ error: 'Song already in queue' }, 400)
    const queueItem: QueueItem = {
      id: generateId(), songId, song, userId, sessionId,
      position: queue.length, dedication, boosted: tip > 0, tip,
      createdAt: new Date().toISOString(), status: 'queued'
    }
    if (tip && tip > 0) {
      const insertPosition = Math.max(0, Math.floor(queue.length / 2))
      queue.splice(insertPosition, 0, queueItem)
      queue.forEach((item: any, index: number) => { item.position = index })
    } else {
      queue.push(queueItem)
    }
    await kv.set(`queue:${sessionId}`, queue)
    const eta = queue.length * (session.avgWaitTime / Math.max(1, queue.length))
    return c.json({ queueItem, position: queueItem.position + 1, eta: Math.round(eta) })
  } catch (error) {
    console.log('Error adding to queue:', error)
    return c.json({ error: 'Failed to add song to queue' }, 500)
  }
})

app.post('/make-server-7f416d54/admin/login', async (c) => {
  try {
    const { email, password } = await c.req.json()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error || !data.session) return c.json({ error: 'Invalid credentials' }, 401)
    return c.json({ accessToken: data.session.access_token, user: data.user })
  } catch (error) {
    console.log('Error during admin login:', error)
    return c.json({ error: 'Login failed' }, 500)
  }
})

app.post('/make-server-7f416d54/admin/register', async (c) => {
  try {
    const { email, password, barName, username } = await c.req.json()
    if (!email || !password || !barName || !username) {
      return c.json({ error: 'Email, password, barName and username required' }, 400)
    }
    let accessToken: string | null = null
    let userId: string | null = null
    try {
      const { error: adminCreateError } = await supabase.auth.admin.createUser({ email, password, email_confirm: true })
      if (adminCreateError) {
        const msg = String(adminCreateError.message || '')
        if (!msg.toLowerCase().includes('already')) return c.json({ error: adminCreateError.message }, 400)
      }
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error || !data.session) return c.json({ error: 'Registration succeeded but login failed' }, 400)
      accessToken = data.session.access_token
      userId = data.user.id
    } catch (_) {
      const devToken = `dev:${email}`
      accessToken = devToken
      userId = `dev-${btoa(email)}`
    }
    const ownerId = userId!
    const sessionId = generateId()
    const session: Session = { id: sessionId, barName, isOpen: true, pricePerSong: 3, maxSongLength: 300, explicitFilter: true, avgWaitTime: 180, ownerId }
    await kv.set(`session:${sessionId}`, session)
    await kv.set(`queue:${sessionId}`, [])
    await kv.set(`filters:${ownerId}:providers`, { spotify: true, apple: true })
    await kv.set(`admin:${ownerId}:profile`, { username, barName })
    return c.json({ accessToken, user: { id: ownerId, email }, session })
  } catch (error) {
    console.log('Error during admin registration:', error)
    return c.json({ error: 'Registration failed' }, 500)
  }
})

app.post('/make-server-7f416d54/admin/queue/:sessionId/skip', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user } } = await supabase.auth.getUser(accessToken)
    if (!user?.id) return c.json({ error: 'Unauthorized' }, 401)
    const sessionId = c.req.param('sessionId')
    const queue = await kv.get(`queue:${sessionId}`) || []
    if (queue.length > 0) {
      const nowPlaying = queue.shift()
      if (nowPlaying) nowPlaying.status = 'played'
      queue.forEach((item: any, index: number) => { item.position = index })
      await kv.set(`queue:${sessionId}`, queue)
    }
    return c.json({ success: true, queue })
  } catch (error) {
    console.log('Error skipping song:', error)
    return c.json({ error: 'Failed to skip song' }, 500)
  }
})

app.get('/make-server-7f416d54/search', async (c) => {
  try {
    const query = c.req.query('q') || ''
    const providerParam = (c.req.query('provider') || 'all').toLowerCase()
    const sessionIdParam = c.req.query('sessionId') || ''
    const providerFilter = providerParam === 'all' ? ['spotify', 'apple'] : [providerParam]
    let ownerId: string | undefined
    if (sessionIdParam) {
      const session = await kv.get(`session:${sessionIdParam}`) as Session | null
      ownerId = session?.ownerId
    }
    const prefix = ownerId ? `filters:${ownerId}` : 'filters'
    const providers = await kv.get(`${prefix}:providers`) || { spotify: true, apple: true }
    let results: Song[] = []
    const mockSongs: Song[] = [
      { id: 'mock:1', title: 'Bohemian Rhapsody', artist: 'Queen', duration: 355, genre: 'Rock', artwork: 'https://picsum.photos/300/300?random=1' },
      { id: 'mock:2', title: 'Sweet Child O\' Mine', artist: 'Guns N\' Roses', duration: 356, genre: 'Rock', artwork: 'https://picsum.photos/300/300?random=2' },
      { id: 'mock:3', title: 'Hotel California', artist: 'Eagles', duration: 391, genre: 'Rock', artwork: 'https://picsum.photos/300/300?random=3' },
      { id: 'mock:4', title: 'Stairway to Heaven', artist: 'Led Zeppelin', duration: 482, genre: 'Rock', artwork: 'https://picsum.photos/300/300?random=4' },
      { id: 'mock:5', title: 'Don\'t Stop Believin\'', artist: 'Journey', duration: 251, genre: 'Rock', artwork: 'https://picsum.photos/300/300?random=5' }
    ]
    if (providers.spotify && providerFilter.includes('spotify')) {
      const spClientId = Deno.env.get('SPOTIFY_CLIENT_ID')
      const spClientSecret = Deno.env.get('SPOTIFY_CLIENT_SECRET')
      if (spClientId && spClientSecret && query) {
        try {
          const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Basic ' + btoa(`${spClientId}:${spClientSecret}`) },
            body: new URLSearchParams({ grant_type: 'client_credentials' })
          })
          if (tokenRes.ok) {
            const tokenJson = await tokenRes.json()
            const accessToken = tokenJson.access_token
            const res = await fetch(`https://api.spotify.com/v1/search?type=track&limit=20&q=${encodeURIComponent(query)}`, { headers: { 'Authorization': `Bearer ${accessToken}` } })
            if (res.ok) {
              const json = await res.json()
              const tracks = json.tracks?.items || []
              const toSeconds = (ms: number) => Math.round((ms || 0) / 1000)
              results = results.concat(tracks.map((t: any) => ({ id: `spotify:${t.id}`, title: t.name, artist: t.artists?.[0]?.name || 'Unknown', duration: toSeconds(t.duration_ms), artwork: t.album?.images?.[0]?.url })))
            }
          }
        } catch (e) { if (results.length === 0) results = results.concat(mockSongs) }
      } else if (results.length === 0) { results = results.concat(mockSongs) }
    }
    if (providers.apple && providerFilter.includes('apple')) {
      const appleDevToken = Deno.env.get('APPLE_MUSIC_DEVELOPER_TOKEN')
      if (appleDevToken && query) {
        try {
          const storefront = 'us'
          const res = await fetch(`https://api.music.apple.com/v1/catalog/${storefront}/search?term=${encodeURIComponent(query)}&types=songs&limit=20`, { headers: { 'Authorization': `Bearer ${appleDevToken}` } })
          if (res.ok) {
            const json = await res.json()
            const songs = json.results?.songs?.data || []
            const toSeconds = (ms: number) => Math.round((ms || 0) / 1000)
            results = results.concat(songs.map((s: any) => {
              const art = s.attributes?.artwork
              const artUrl = art?.url ? art.url.replace('{w}x{h}', '300x300') : undefined
              return { id: `apple:${s.id}`, title: s.attributes?.name || 'Unknown', artist: s.attributes?.artistName || 'Unknown', duration: toSeconds(s.attributes?.durationInMillis || 0), artwork: artUrl }
            }))
          }
        } catch (e) { if (results.length === 0) results = results.concat(mockSongs) }
      } else if (results.length === 0) { results = results.concat(mockSongs) }
    }
    if (!query && results.length === 0) results = mockSongs
    const allowArtists: string[] = (await kv.get(`${prefix}:allow:artists`)) || []
    const blockArtists: string[] = (await kv.get(`${prefix}:block:artists`)) || []
    const allowSongs: string[] = (await kv.get(`${prefix}:allow:songs`)) || []
    const blockSongs: string[] = (await kv.get(`${prefix}:block:songs`)) || []
    const blockGenres: string[] = (await kv.get(`${prefix}:block:genres`)) || []
    const ci = (s: string) => s.toLowerCase()
    const inList = (value: string, list: string[]) => list.some((x) => ci(value).includes(ci(x)))
    let filtered = results
    if (allowArtists.length > 0) filtered = filtered.filter((s) => inList(s.artist, allowArtists))
    if (allowSongs.length > 0) filtered = filtered.filter((s) => inList(s.title, allowSongs))
    if (blockArtists.length > 0) filtered = filtered.filter((s) => !inList(s.artist, blockArtists))
    if (blockSongs.length > 0) filtered = filtered.filter((s) => !inList(s.title, blockSongs))
    if (blockGenres.length > 0) filtered = filtered.filter((s) => !(s as any).genre || !inList((s as any).genre, blockGenres))
    const seen = new Set<string>()
    const unique: Song[] = []
    for (const s of filtered) {
      const key = `${ci(s.title)}|${ci(s.artist)}`
      if (!seen.has(key)) { seen.add(key); unique.push(s) }
      if (unique.length >= 25) break
    }
    return c.json(unique)
  } catch (error) {
    console.log('Error searching songs:', error)
    return c.json({ error: 'Search failed' }, 500)
  }
})

app.get('/make-server-7f416d54/filters', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user } } = await supabase.auth.getUser(accessToken)
    if (!user?.id) return c.json({ error: 'Unauthorized' }, 401)
    const uid = user.id
    const providers = await kv.get(`filters:${uid}:providers`) || { spotify: true, apple: true }
    const allowArtists = await kv.get(`filters:${uid}:allow:artists`) || []
    const blockArtists = await kv.get(`filters:${uid}:block:artists`) || []
    const allowSongs = await kv.get(`filters:${uid}:allow:songs`) || []
    const blockSongs = await kv.get(`filters:${uid}:block:songs`) || []
    const blockGenres = await kv.get(`filters:${uid}:block:genres`) || []
    return c.json({ providers, allowArtists, blockArtists, allowSongs, blockSongs, blockGenres })
  } catch (error) {
    console.log('Error fetching filters:', error)
    return c.json({ error: 'Failed to fetch filters' }, 500)
  }
})

app.post('/make-server-7f416d54/filters', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user } } = await supabase.auth.getUser(accessToken)
    if (!user?.id) return c.json({ error: 'Unauthorized' }, 401)
    const body = await c.req.json()
    const providers = body.providers ?? { spotify: true, apple: true }
    const allowArtists = body.allowArtists ?? []
    const blockArtists = body.blockArtists ?? []
    const allowSongs = body.allowSongs ?? []
    const blockSongs = body.blockSongs ?? []
    const blockGenres = body.blockGenres ?? []
    await kv.set(`filters:${user.id}:providers`, providers)
    await kv.set(`filters:${user.id}:allow:artists`, allowArtists)
    await kv.set(`filters:${user.id}:block:artists`, blockArtists)
    await kv.set(`filters:${user.id}:allow:songs`, allowSongs)
    await kv.set(`filters:${user.id}:block:songs`, blockSongs)
    await kv.set(`filters:${user.id}:block:genres`, blockGenres)
    return c.json({ success: true })
  } catch (error) {
    console.log('Error updating filters:', error)
    return c.json({ error: 'Failed to update filters' }, 500)
  }
})

Deno.serve(app.fetch)


