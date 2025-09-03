import React, { useState, useEffect } from 'react'
import { AdminLogin } from './admin/admin-login'
import { AdminDashboard } from './admin/admin-dashboard'
import { AdminPricing } from './admin/admin-pricing'
import { AdminAnalytics } from './admin/admin-analytics'
import { AdminDevices } from './admin/admin-devices'
import { AdminLibraryFilters } from './admin/admin-library-filters'
import { AdminSignup } from './admin/admin-signup'
import { Toaster } from './ui/sonner'
import { projectId, publicAnonKey } from '../utils/supabase/info'

type AdminScreen = 'login' | 'signup' | 'dashboard' | 'pricing' | 'analytics' | 'devices' | 'library'

interface User {
  id: string
  email: string
}

export function AdminPanel() {
  const [screen, setScreen] = useState<AdminScreen>('login')
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string>('')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [creatingSession, setCreatingSession] = useState(false)

  const handleLogin = (userData: User, token: string) => {
    setUser(userData)
    setAccessToken(token)
    setScreen('dashboard')
  }

  const handleLogout = () => {
    setUser(null)
    setAccessToken('')
    setScreen('login')
  }

  const renderScreen = () => {
    if (!user || !accessToken) {
      if (screen === 'signup') {
        return (
          <AdminSignup 
            onSignupSuccess={handleLogin}
            onNavigateToLogin={() => setScreen('login')}
          />
        )
      }
      return <AdminLogin onLogin={handleLogin} onRequestSignup={() => setScreen('signup')} />
    }

    // Ensure a session exists for demo/testing
    const ensureSession = async () => {
      if (creatingSession || sessionId) return
      try {
        setCreatingSession(true)
        const res = await fetch(`https://${projectId}.supabase.co/functions/v1/server/session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ barName: 'Bar Jukebox Demo', pricePerSong: 3 })
        })
        if (res.ok) {
          const data = await res.json()
          setSessionId(data.session.id)
        }
      } catch (e) {
        console.error('Failed to create session', e)
      } finally {
        setCreatingSession(false)
      }
    }

    if (!sessionId) {
      // Kick off creation; render placeholder while creating
      ensureSession()
      return (
        <div className="flex h-screen">
          {/* Sidebar for consistent layout */}
          {/* Render minimal shell to keep layout consistent */}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p>Creating demo session...</p>
            </div>
          </div>
        </div>
      )
    }

    switch (screen) {
      case 'dashboard':
        return (
          <AdminDashboard 
            sessionId={sessionId}
            accessToken={accessToken}
            onNavigate={setScreen}
            onLogout={handleLogout}
          />
        )
      case 'pricing':
        return (
          <AdminPricing 
            sessionId={sessionId}
            accessToken={accessToken}
            onNavigate={setScreen}
            onLogout={handleLogout}
          />
        )
      case 'analytics':
        return (
          <AdminAnalytics 
            sessionId={sessionId}
            accessToken={accessToken}
            onNavigate={setScreen}
            onLogout={handleLogout}
          />
        )
      case 'devices':
        return (
          <AdminDevices 
            sessionId={sessionId}
            accessToken={accessToken}
            onNavigate={setScreen}
            onLogout={handleLogout}
          />
        )
      case 'library':
        return (
          <AdminLibraryFilters 
            accessToken={accessToken}
            onNavigate={setScreen}
            onLogout={handleLogout}
          />
        )
      default:
        return <AdminLogin onLogin={handleLogin} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {renderScreen()}
      <Toaster />
    </div>
  )
}