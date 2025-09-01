import React, { useState, useEffect } from 'react'
import { AdminSidebar } from './admin-sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Download, TrendingUp, Music, DollarSign, Clock, Users } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { projectId, publicAnonKey } from '../../utils/supabase/info'

type AdminScreen = 'dashboard' | 'pricing' | 'analytics' | 'devices'

interface AnalyticsData {
  songsPlayedToday: number
  revenueToday: number
  avgWaitTime: number
  topArtists: Array<{ name: string; plays: number }>
}

interface AdminAnalyticsProps {
  sessionId: string
  accessToken: string
  onNavigate: (screen: AdminScreen) => void
  onLogout: () => void
}

export function AdminAnalytics({ sessionId, accessToken, onNavigate, onLogout }: AdminAnalyticsProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7f416d54/analytics/${sessionId}`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  // Mock data for charts
  const hourlyData = [
    { hour: '12 PM', songs: 4, revenue: 12 },
    { hour: '1 PM', songs: 8, revenue: 24 },
    { hour: '2 PM', songs: 12, revenue: 36 },
    { hour: '3 PM', songs: 15, revenue: 45 },
    { hour: '4 PM', songs: 18, revenue: 54 },
    { hour: '5 PM', songs: 25, revenue: 75 },
    { hour: '6 PM', songs: 32, revenue: 96 },
    { hour: '7 PM', songs: 28, revenue: 84 },
    { hour: '8 PM', songs: 35, revenue: 105 },
    { hour: '9 PM', songs: 42, revenue: 126 },
    { hour: '10 PM', songs: 38, revenue: 114 },
    { hour: '11 PM', songs: 22, revenue: 66 }
  ]

  const genreData = [
    { name: 'Rock', value: 35, color: '#8884d8' },
    { name: 'Pop', value: 25, color: '#82ca9d' },
    { name: 'Hip Hop', value: 20, color: '#ffc658' },
    { name: 'Electronic', value: 12, color: '#ff7300' },
    { name: 'Country', value: 8, color: '#00ff88' }
  ]

  const weeklyData = [
    { day: 'Mon', songs: 45, revenue: 135 },
    { day: 'Tue', songs: 52, revenue: 156 },
    { day: 'Wed', songs: 48, revenue: 144 },
    { day: 'Thu', songs: 65, revenue: 195 },
    { day: 'Fri', songs: 89, revenue: 267 },
    { day: 'Sat', songs: 95, revenue: 285 },
    { day: 'Sun', songs: 67, revenue: 201 }
  ]

  if (loading) {
    return (
      <div className="flex h-screen">
        <AdminSidebar 
          currentScreen="analytics" 
          onNavigate={onNavigate} 
          onLogout={onLogout}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>Loading analytics...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar 
        currentScreen="analytics" 
        onNavigate={onNavigate} 
        onLogout={onLogout}
      />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Analytics</h1>
              <p className="text-muted-foreground">Performance insights and statistics</p>
            </div>
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Songs Today</CardTitle>
                <Music className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.songsPlayedToday || 47}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline w-3 h-3 mr-1" />
                  +12% from yesterday
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue Today</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${analytics?.revenueToday || 141}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline w-3 h-3 mr-1" />
                  +8% from yesterday
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Wait Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.avgWaitTime || 3.2}m</div>
                <p className="text-xs text-muted-foreground">
                  -5% from yesterday
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground">
                  Currently in venue
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Hourly Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Activity</CardTitle>
                <CardDescription>Songs played and revenue by hour</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="songs" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Genre Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Genre Distribution</CardTitle>
                <CardDescription>Most popular music genres</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={genreData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {genreData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Revenue Trend</CardTitle>
                <CardDescription>Revenue performance over the past week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Artists */}
            <Card>
              <CardHeader>
                <CardTitle>Top Artists</CardTitle>
                <CardDescription>Most requested artists today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(analytics?.topArtists || [
                    { name: 'Queen', plays: 8 },
                    { name: 'The Beatles', plays: 6 },
                    { name: 'Led Zeppelin', plays: 5 },
                    { name: 'Pink Floyd', plays: 4 },
                    { name: 'The Rolling Stones', plays: 4 }
                  ]).map((artist, index) => (
                    <div key={artist.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="w-6 h-6 rounded-full flex items-center justify-center p-0 text-xs">
                          {index + 1}
                        </Badge>
                        <span className="font-medium">{artist.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{artist.plays} plays</span>
                        <div className="w-12 bg-muted rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full" 
                            style={{ width: `${(artist.plays / 8) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Insights */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Performance Insights</CardTitle>
              <CardDescription>AI-powered recommendations to optimize your venue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-green-600">What's Working Well</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      Peak hours (7-9 PM) generating 40% of daily revenue
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      Average wait time below target (under 4 minutes)
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      Rock and Pop genres driving high engagement
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-amber-600">Opportunities</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                      Consider happy hour pricing 2-5 PM to increase volume
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                      Promote tip boosting feature to increase revenue per song
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                      Add more electronic/EDM options for younger demographic
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}