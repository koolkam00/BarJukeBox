import { Hono } from 'npm:hono'
import { logger } from 'npm:hono/logger'
import { cors } from 'npm:hono/cors'
import { createClient } from 'npm:@supabase/supabase-js'
import * as kv from './kv_store.tsx'

const app = new Hono()

// Middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['*'],
}))
app.use('*', logger(console.log))

// Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
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
  nowPlaying?: QueueItem
}

// Utility functions
const generateId = () => crypto.randomUUID()

// Routes

// Session management
app.get('/make-server-7f416d54/session/:sessionId', async (c) => {
  try {
    const sessionId = c.req.param('sessionId')
    const session = await kv.get(`session:${sessionId}`)
    
    if (!session) {
      return c.json({ error: 'Session not found' }, 404)
    }
    
    return c.json(session)
  } catch (error) {
    console.log('Error fetching session:', error)
    return c.json({ error: 'Failed to fetch session' }, 500)
  }
})

app.post('/make-server-7f416d54/session', async (c) => {
  try {
    const { barName, pricePerSong = 3, maxSongLength = 300, explicitFilter = true } = await c.req.json()
    
    const sessionId = generateId()
    const session: Session = {
      id: sessionId,
      barName,
      isOpen: true,
      pricePerSong,
      maxSongLength,
      explicitFilter,
      avgWaitTime: 180, // 3 minutes default
    }
    
    await kv.set(`session:${sessionId}`, session)
    await kv.set(`queue:${sessionId}`, [])
    
    return c.json({ session, qrCodeUrl: `${c.req.url}/../patron/${sessionId}` })
  } catch (error) {
    console.log('Error creating session:', error)
    return c.json({ error: 'Failed to create session' }, 500)
  }
})

// Queue management
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
    if (!session || !session.isOpen) {
      return c.json({ error: 'Session not available' }, 400)
    }
    
    const queue = await kv.get(`queue:${sessionId}`) || []
    
    // Check for duplicates
    const duplicate = queue.find(item => item.songId === songId && item.status === 'queued')
    if (duplicate) {
      return c.json({ error: 'Song already in queue' }, 400)
    }
    
    const queueItem: QueueItem = {
      id: generateId(),
      songId,
      song,
      userId,
      sessionId,
      position: queue.length,
      dedication,
      boosted: tip > 0,
      tip,
      createdAt: new Date().toISOString(),
      status: 'queued'
    }
    
    // If tip provided, boost position
    if (tip && tip > 0) {
      const insertPosition = Math.max(0, Math.floor(queue.length / 2))
      queue.splice(insertPosition, 0, queueItem)
      // Update positions
      queue.forEach((item, index) => {
        item.position = index
      })
    } else {
      queue.push(queueItem)
    }
    
    await kv.set(`queue:${sessionId}`, queue)
    
    // Calculate ETA
    const eta = queue.length * (session.avgWaitTime / Math.max(1, queue.length))
    
    return c.json({ 
      queueItem, 
      position: queueItem.position + 1, 
      eta: Math.round(eta) 
    })
  } catch (error) {
    console.log('Error adding to queue:', error)
    return c.json({ error: 'Failed to add song to queue' }, 500)
  }
})

// Admin routes
app.post('/make-server-7f416d54/admin/login', async (c) => {
  try {
    const { email, password } = await c.req.json()
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error || !data.session) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }
    
    return c.json({ 
      accessToken: data.session.access_token,
      user: data.user 
    })
  } catch (error) {
    console.log('Error during admin login:', error)
    return c.json({ error: 'Login failed' }, 500)
  }
})

app.post('/make-server-7f416d54/admin/queue/:sessionId/skip', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    const sessionId = c.req.param('sessionId')
    const queue = await kv.get(`queue:${sessionId}`) || []
    
    if (queue.length > 0) {
      const nowPlaying = queue.shift()
      if (nowPlaying) {
        nowPlaying.status = 'played'
      }
      
      // Update positions
      queue.forEach((item, index) => {
        item.position = index
      })
      
      await kv.set(`queue:${sessionId}`, queue)
    }
    
    return c.json({ success: true, queue })
  } catch (error) {
    console.log('Error skipping song:', error)
    return c.json({ error: 'Failed to skip song' }, 500)
  }
})

// Search songs (mock implementation)
app.get('/make-server-7f416d54/search', async (c) => {
  try {
    const query = c.req.query('q') || ''
    
    // Mock song database - in real implementation, this would connect to Spotify API, etc.
    const mockSongs: Song[] = [
      {
        id: '1',
        title: 'Bohemian Rhapsody',
        artist: 'Queen',
        duration: 355,
        genre: 'Rock',
        artwork: 'https://picsum.photos/300/300?random=1'
      },
      {
        id: '2',
        title: 'Sweet Child O\' Mine',
        artist: 'Guns N\' Roses',
        duration: 356,
        genre: 'Rock',
        artwork: 'https://picsum.photos/300/300?random=2'
      },
      {
        id: '3',
        title: 'Hotel California',
        artist: 'Eagles',
        duration: 391,
        genre: 'Rock',
        artwork: 'https://picsum.photos/300/300?random=3'
      },
      {
        id: '4',
        title: 'Stairway to Heaven',
        artist: 'Led Zeppelin',
        duration: 482,
        genre: 'Rock',
        artwork: 'https://picsum.photos/300/300?random=4'
      },
      {
        id: '5',
        title: 'Don\'t Stop Believin\'',
        artist: 'Journey',
        duration: 251,
        genre: 'Rock',
        artwork: 'https://picsum.photos/300/300?random=5'
      }
    ]
    
    const filteredSongs = query 
      ? mockSongs.filter(song => 
          song.title.toLowerCase().includes(query.toLowerCase()) ||
          song.artist.toLowerCase().includes(query.toLowerCase())
        )
      : mockSongs
    
    return c.json(filteredSongs)
  } catch (error) {
    console.log('Error searching songs:', error)
    return c.json({ error: 'Search failed' }, 500)
  }
})

// Analytics
app.get('/make-server-7f416d54/analytics/:sessionId', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    const sessionId = c.req.param('sessionId')
    
    // Mock analytics data
    const analytics = {
      songsPlayedToday: 47,
      revenueToday: 141,
      avgWaitTime: 3.2,
      topArtists: [
        { name: 'Queen', plays: 8 },
        { name: 'The Beatles', plays: 6 },
        { name: 'Led Zeppelin', plays: 5 }
      ]
    }
    
    return c.json(analytics)
  } catch (error) {
    console.log('Error fetching analytics:', error)
    return c.json({ error: 'Failed to fetch analytics' }, 500)
  }
})

Deno.serve(app.fetch)