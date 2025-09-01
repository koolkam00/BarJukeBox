import React, { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Music, Shield, Monitor } from 'lucide-react'

interface ModeSelectorProps {
  onModeSelect: (mode: 'patron' | 'admin' | 'tv', sessionId?: string) => void
}

export function ModeSelector({ onModeSelect }: ModeSelectorProps) {
  const [sessionId, setSessionId] = useState('')

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4">BarJukebox</h1>
          <p className="text-xl text-purple-200">Choose your interface</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Patron Mode */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/20 transition-all duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mb-4">
                <Music className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl">Patron App</CardTitle>
              <CardDescription className="text-purple-200">
                Search songs, pay with Apple Pay, and join the queue
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="patron-session">Session ID (optional)</Label>
                <Input
                  id="patron-session"
                  placeholder="Enter session ID"
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
                />
              </div>
              <Button 
                onClick={() => onModeSelect('patron', sessionId || 'demo-session')}
                className="w-full bg-purple-600 hover:bg-purple-700"
                size="lg"
              >
                Enter as Patron
              </Button>
            </CardContent>
          </Card>

          {/* Admin Mode */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/20 transition-all duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl">Admin Panel</CardTitle>
              <CardDescription className="text-purple-200">
                Manage queue, pricing, and session settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => onModeSelect('admin')}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                Admin Dashboard
              </Button>
            </CardContent>
          </Card>

          {/* TV Display Mode */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/20 transition-all duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mb-4">
                <Monitor className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl">TV Display</CardTitle>
              <CardDescription className="text-purple-200">
                Now playing screen with QR code for joining
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="tv-session">Session ID</Label>
                <Input
                  id="tv-session"
                  placeholder="Enter session ID"
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
                />
              </div>
              <Button 
                onClick={() => onModeSelect('tv', sessionId || 'demo-session')}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                size="lg"
              >
                Launch TV Display
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="text-purple-200 mb-4">Demo Features:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="bg-white/10 px-3 py-1 rounded-full">Real-time Queue</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">Apple Pay Integration</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">Song Search</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">Queue Management</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">Analytics</span>
          </div>
        </div>
      </div>
    </div>
  )
}