import React from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { QrCode, Music, Clock, DollarSign, Shield } from 'lucide-react'
import { ImageWithFallback } from '../figma/ImageWithFallback'

interface Session {
  id: string
  barName: string
  pricePerSong: number
  avgWaitTime: number
  maxSongLength: number
  explicitFilter: boolean
}

interface PatronOnboardingProps {
  session: Session
  onJoin: () => void
}

export function PatronOnboarding({ session, onJoin }: PatronOnboardingProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-md mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center mx-auto mb-4">
            <QrCode className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome to BarJukebox</h1>
          <p className="text-purple-200">Scan complete! Ready to join the music.</p>
        </div>

        {/* Bar Session Card */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Music className="w-6 h-6" />
              </div>
              <div>
                <h2>{session.barName}</h2>
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30 mt-1">
                  Now Open
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Session Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-white/10 rounded-lg">
                <DollarSign className="w-5 h-5 mx-auto mb-1 text-green-300" />
                <p className="font-semibold">${session.pricePerSong}</p>
                <p className="text-sm text-purple-200">per song</p>
              </div>
              <div className="text-center p-3 bg-white/10 rounded-lg">
                <Clock className="w-5 h-5 mx-auto mb-1 text-blue-300" />
                <p className="font-semibold">~{Math.round(session.avgWaitTime / 60)}m</p>
                <p className="text-sm text-purple-200">avg wait</p>
              </div>
            </div>

            {/* Rules */}
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Shield className="w-4 h-4" />
                House Rules
              </h4>
              <ul className="text-sm text-purple-200 space-y-1">
                <li>• Max song length: {Math.floor(session.maxSongLength / 60)}:{(session.maxSongLength % 60).toString().padStart(2, '0')}</li>
                {session.explicitFilter && <li>• Explicit content filtered</li>}
                <li>• Duplicate songs not allowed</li>
                <li>• Tip to boost your position in queue</li>
              </ul>
            </div>

            {/* Join Button */}
            <Button 
              onClick={onJoin}
              size="lg"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
            >
              Join {session.barName}
            </Button>
          </CardContent>
        </Card>

        {/* How it Works */}
        <Card className="bg-white/5 backdrop-blur border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-lg">How it works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-purple-200">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">1</div>
                <p>Search for any song or browse trending tracks</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">2</div>
                <p>Pay securely with Apple Pay or card</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">3</div>
                <p>Watch your song enter the queue and enjoy!</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-purple-200 text-sm">
          <p>Powered by BarJukebox</p>
        </div>
      </div>
    </div>
  )
}