import React from 'react'
import { AppCard } from './app-card'
import { APP_CONFIG, AppMode, FEATURES, DIRECT_URLS } from './app-config'

interface LandingPageProps {
  onNavigate: (appId: AppMode, sessionId?: string) => void
  onOpenInNewTab: (appId: string, sessionId?: string) => void
}

export function LandingPage({ onNavigate, onOpenInNewTab }: LandingPageProps) {
  const apps = [APP_CONFIG.patron, APP_CONFIG.admin, APP_CONFIG.tv, APP_CONFIG.gallery]

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4">BarJukebox</h1>
          <p className="text-xl text-purple-200">Choose your application</p>
          <p className="text-sm text-purple-300 mt-2">Click to navigate or open in new tab</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {apps.map((app) => (
            <AppCard
              key={app.id}
              app={app}
              onNavigate={onNavigate}
              onOpenInNewTab={onOpenInNewTab}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-purple-200 mb-4">Application Features:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            {FEATURES.map((feature) => (
              <span key={feature} className="bg-white/10 px-3 py-1 rounded-full">
                {feature}
              </span>
            ))}
          </div>
          
          <div className="mt-8 text-sm text-purple-300">
            <p><strong>Direct URLs:</strong></p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-3">
              {DIRECT_URLS.map((url) => (
                <code key={url} className="bg-white/5 px-3 py-2 rounded">
                  {url}
                </code>
              ))}
            </div>
            <p className="mt-3 text-xs">Add &session=your-session-id for custom sessions</p>
          </div>
        </div>
      </div>
    </div>
  )
}