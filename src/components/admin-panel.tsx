import React, { useState, useEffect } from 'react'
import { AdminLogin } from './admin/admin-login'
import { AdminDashboard } from './admin/admin-dashboard'
import { AdminPricing } from './admin/admin-pricing'
import { AdminAnalytics } from './admin/admin-analytics'
import { AdminDevices } from './admin/admin-devices'
import { Toaster } from './ui/sonner'
import { projectId, publicAnonKey } from '../utils/supabase/info'

type AdminScreen = 'login' | 'dashboard' | 'pricing' | 'analytics' | 'devices'

interface User {
  id: string
  email: string
}

export function AdminPanel() {
  const [screen, setScreen] = useState<AdminScreen>('login')
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string>('')
  const [sessionId] = useState('demo-session') // In real app, this would be selected/created

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
      return <AdminLogin onLogin={handleLogin} />
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