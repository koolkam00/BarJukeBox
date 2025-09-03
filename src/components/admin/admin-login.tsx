import React, { useState } from 'react'
import { Shield, Eye, EyeOff } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { toast } from 'sonner@2.0.3'
import { projectId, publicAnonKey } from '../../utils/supabase/info'

interface User {
  id: string
  email: string
}

interface AdminLoginProps {
  onLogin: (user: User, accessToken: string) => void
  onRequestSignup: () => void
}

export function AdminLogin({ onLogin, onRequestSignup }: AdminLoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  // Signup inputs moved to dedicated signup page

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error('Please enter both email and password')
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/server/make-server-7f416d54/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ email, password })
      })

      if (response.ok) {
        const { accessToken, user } = await response.json()
        toast.success('Login successful!')
        onLogin(user, accessToken)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Connection failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAccount = async () => {
    if (!email || !password || !barName || !username) {
      toast.error('Enter email, password, bar name, and username')
      return
    }
    setLoading(true)
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/server/make-server-7f416d54/admin/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, barName, username })
      })
      if (response.ok) {
        const { accessToken, user } = await response.json()
        toast.success('Account created! Logged in')
        onLogin(user, accessToken)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Registration failed')
      }
    } catch (e) {
      console.error('Registration error:', e)
      toast.error('Connection failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Demo login for testing
  const handleDemoLogin = () => {
    const demoUser: User = {
      id: 'demo-admin',
      email: 'admin@barjukebox.com'
    }
    const demoToken = 'demo-access-token'
    onLogin(demoUser, demoToken)
    toast.success('Logged in with demo account')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">BarJukebox Admin</h1>
          <p className="text-slate-300">Manage your venue's music experience</p>
        </div>

        {/* Login Form */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
          <CardHeader>
            <CardTitle className="text-white">Admin Login</CardTitle>
            <CardDescription className="text-slate-300">
              Access your dashboard to manage queues and settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@yourbar.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-white/60 hover:text-white hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <Button 
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white border-0"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
              <Button
                type="button"
                onClick={onRequestSignup}
                className="w-full mt-2 bg-white/10 hover:bg-white/20 text-white border-white/20"
              >
                Create Account
              </Button>
            </form>

            {/* Demo Login */}
            <div className="mt-6 pt-4 border-t border-white/20">
              <p className="text-sm text-slate-300 text-center mb-3">
                Don't have credentials? Try the demo
              </p>
              <Button
                onClick={handleDemoLogin}
                variant="outline"
                className="w-full bg-transparent border-white/20 text-white hover:bg-white/10"
              >
                Demo Login
              </Button>
            </div>

            {/* Help Links */}
            <div className="mt-6 text-center text-sm">
              <div className="flex justify-center gap-4">
                <Button variant="link" className="text-slate-300 hover:text-white h-auto p-0">
                  Forgot password?
                </Button>
                <Button variant="link" className="text-slate-300 hover:text-white h-auto p-0">
                  Need help?
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-8 text-center">
          <p className="text-slate-300 mb-4">Admin Dashboard Features</p>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <span className="bg-white/10 px-3 py-1 rounded-full text-white">Queue Management</span>
            <span className="bg-white/10 px-3 py-1 rounded-full text-white">Pricing Control</span>
            <span className="bg-white/10 px-3 py-1 rounded-full text-white">Real-time Analytics</span>
            <span className="bg-white/10 px-3 py-1 rounded-full text-white">Content Moderation</span>
          </div>
        </div>
      </div>
    </div>
  )
}