import React from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { ExternalLink } from 'lucide-react'
import { AppInfo, AppMode } from './app-config'

interface AppCardProps {
  app: AppInfo
  onNavigate: (appId: AppMode, sessionId?: string) => void
  onOpenInNewTab: (appId: string, sessionId?: string) => void
}

export function AppCard({ app, onNavigate, onOpenInNewTab }: AppCardProps) {
  const IconComponent = app.icon

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/20 transition-all duration-300">
      <CardHeader className="text-center">
        <div className={`mx-auto w-16 h-16 ${app.primaryColor} rounded-full flex items-center justify-center mb-4`}>
          <IconComponent className="w-8 h-8" />
        </div>
        <CardTitle className="text-2xl">{app.title}</CardTitle>
        <CardDescription className="text-purple-200">
          {app.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          onClick={() => onNavigate(app.id)}
          className={`w-full ${app.buttonColor}`}
          size="lg"
        >
          {app.id === 'gallery' ? 'View All Designs' : `Enter ${app.title}`}
        </Button>
        <Button 
          onClick={() => onOpenInNewTab(app.id, app.defaultSession)}
          variant="outline"
          className={`w-full ${app.borderColor} text-${app.id === 'gallery' ? 'emerald' : app.id === 'admin' ? 'blue' : app.id === 'tv' ? 'indigo' : 'purple'}-100 ${app.hoverColor}`}
          size="sm"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Open in New Tab
        </Button>
      </CardContent>
    </Card>
  )
}