import React from 'react'
import { User, Heart, CreditCard, Bell, HelpCircle, Settings, ChevronRight, Music, Star } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Switch } from '../ui/switch'
import { BottomNavigation } from './bottom-navigation'

type PatronScreen = 'discover' | 'queue' | 'account'

interface PatronAccountProps {
  onNavigate: (screen: PatronScreen) => void
}

export function PatronAccount({ onNavigate }: PatronAccountProps) {
  const menuItems = [
    {
      icon: Heart,
      label: 'Saved Bars',
      description: 'Your favorite venues',
      badge: '3',
      onClick: () => console.log('Saved bars')
    },
    {
      icon: CreditCard,
      label: 'Payment Methods',
      description: 'Apple Pay, cards',
      onClick: () => console.log('Payment methods')
    },
    {
      icon: Music,
      label: 'Recently Played',
      description: 'Your song history',
      onClick: () => console.log('Recently played')
    },
    {
      icon: Bell,
      label: 'Notifications',
      description: 'Song alerts & updates',
      hasSwitch: true,
      switchValue: true
    },
    {
      icon: Settings,
      label: 'Preferences',
      description: 'Explicit content, language',
      onClick: () => console.log('Preferences')
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      description: 'FAQs, contact us',
      onClick: () => console.log('Help')
    }
  ]

  const recentBars = [
    { name: "Murphy's Pub", lastVisit: "2 days ago", songsPlayed: 5 },
    { name: "The Blue Note", lastVisit: "1 week ago", songsPlayed: 3 },
    { name: "Rockin' Horse", lastVisit: "2 weeks ago", songsPlayed: 7 }
  ]

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-white">
        <div className="max-w-md mx-auto">
          <h1 className="text-xl font-semibold">Account</h1>
          <p className="text-sm text-purple-100">Settings & preferences</p>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <CardTitle>Music Lover</CardTitle>
                <CardDescription>Anonymous session</CardDescription>
                <div className="flex items-center gap-2 mt-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm">12 songs played this month</span>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Recent Bars */}
        <div className="space-y-3">
          <h2 className="font-semibold">Recent Bars</h2>
          <div className="space-y-2">
            {recentBars.map((bar, index) => (
              <Card key={index} className="cursor-pointer hover:bg-accent transition-colors">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{bar.name}</p>
                      <p className="text-sm text-muted-foreground">{bar.lastVisit}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="mb-1">
                        {bar.songsPlayed} songs
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Settings Menu */}
        <div className="space-y-3">
          <h2 className="font-semibold">Settings</h2>
          <Card>
            <CardContent className="p-0">
              {menuItems.map((item, index) => (
                <div key={index} className={`p-4 ${index !== menuItems.length - 1 ? 'border-b border-border' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{item.label}</p>
                          {item.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    {item.hasSwitch ? (
                      <Switch 
                        checked={item.switchValue} 
                        onCheckedChange={() => console.log('Toggle notification')}
                      />
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={item.onClick}
                        className="p-0 h-auto"
                      >
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Stats Card */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30">
          <CardHeader>
            <CardTitle className="text-lg">Your Music Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-purple-600">47</p>
                <p className="text-sm text-muted-foreground">Total Songs</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">8</p>
                <p className="text-sm text-muted-foreground">Bars Visited</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">$141</p>
                <p className="text-sm text-muted-foreground">Total Spent</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">15</p>
                <p className="text-sm text-muted-foreground">This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="bg-muted/30">
          <CardContent className="p-4 text-center">
            <h3 className="font-semibold mb-2">BarJukebox</h3>
            <p className="text-sm text-muted-foreground mb-3">Version 1.0.0</p>
            <div className="flex justify-center gap-4 text-sm">
              <Button variant="link" size="sm" className="h-auto p-0">
                Terms of Service
              </Button>
              <Button variant="link" size="sm" className="h-auto p-0">
                Privacy Policy
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation 
        activeTab="account" 
        onNavigate={onNavigate}
      />
    </div>
  )
}