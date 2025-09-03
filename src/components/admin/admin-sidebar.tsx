import React from 'react'
import { BarChart3, Music, DollarSign, Monitor, LogOut, Settings } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'

type AdminScreen = 'dashboard' | 'pricing' | 'analytics' | 'devices' | 'library'

interface AdminSidebarProps {
  currentScreen: AdminScreen
  onNavigate: (screen: AdminScreen) => void
  onLogout: () => void
}

export function AdminSidebar({ currentScreen, onNavigate, onLogout }: AdminSidebarProps) {
  const menuItems = [
    {
      id: 'dashboard' as AdminScreen,
      label: 'Dashboard',
      icon: Music,
      description: 'Queue & playback'
    },
    {
      id: 'pricing' as AdminScreen,
      label: 'Pricing & Rules',
      icon: DollarSign,
      description: 'Manage pricing'
    },
    {
      id: 'analytics' as AdminScreen,
      label: 'Analytics',
      icon: BarChart3,
      description: 'Performance stats'
    },
    {
      id: 'devices' as AdminScreen,
      label: 'Devices',
      icon: Monitor,
      description: 'TV displays'
    },
    {
      id: 'library' as AdminScreen,
      label: 'Library Filters',
      icon: Settings,
      description: 'Providers & allow/block lists'
    }
  ]

  return (
    <div className="w-64 bg-muted/30 border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <Music className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold">BarJukebox</h2>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = currentScreen === item.id
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start h-auto p-3 ${
                  isActive ? 'bg-purple-600 text-white' : 'hover:bg-accent'
                }`}
                onClick={() => onNavigate(item.id)}
              >
                <div className="flex items-center gap-3 w-full">
                  <Icon className="w-5 h-5" />
                  <div className="text-left">
                    <p className="font-medium">{item.label}</p>
                    <p className={`text-xs ${isActive ? 'text-purple-100' : 'text-muted-foreground'}`}>
                      {item.description}
                    </p>
                  </div>
                </div>
              </Button>
            )
          })}
        </div>
      </nav>

      {/* Session Status */}
      <div className="p-4 border-t border-border">
        <Card className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-sm font-medium text-green-800 dark:text-green-200">Session Active</p>
            </div>
            <p className="text-xs text-green-600 dark:text-green-300">Demo Session</p>
          </CardContent>
        </Card>
      </div>

      {/* User Menu */}
      <div className="p-4 border-t border-border">
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => console.log('Settings')}
          >
            <Settings className="w-4 h-4 mr-3" />
            Settings
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
            onClick={onLogout}
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  )
}