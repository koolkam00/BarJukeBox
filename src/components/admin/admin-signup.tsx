import React, { useState } from 'react'
import { Shield } from 'lucide-react'
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

interface AdminSignupProps {
  onSignupSuccess: (user: User, accessToken: string) => void
  onNavigateToLogin: () => void
}

export function AdminSignup({ onSignupSuccess, onNavigateToLogin }: AdminSignupProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [barName, setBarName] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password || !barName || !username) {
      toast.error('Please complete all fields')
      return
    }
    setLoading(true)
    try {
      const response = await fetch(`https://${projectId}.functions.supabase.co/server/make-server-7f416d54/admin/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ email, password, barName, username })
      })
      if (response.ok) {
        const { accessToken, user } = await response.json()
        toast.success('Account created!')
        onSignupSuccess(user, accessToken)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Registration failed')
      }
    } catch (e) {
      console.error('Signup error:', e)
      toast.error('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create Admin Account</h1>
          <p className="text-slate-300">Set up your venue</p>
        </div>

        <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
          <CardHeader>
            <CardTitle className="text-white">Sign Up</CardTitle>
            <CardDescription className="text-slate-300">
              Email, password, bar name, and username
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="barName" className="text-white">Bar Name</Label>
                <Input id="barName" value={barName} onChange={(e) => setBarName(e.target.value)} className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">Username</Label>
                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20" required />
              </div>
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white border-0" disabled={loading}>
                {loading ? 'Creating...' : 'Create Account'}
              </Button>
              <Button type="button" variant="outline" className="w-full bg-transparent border-white/20 text-white hover:bg-white/10" onClick={onNavigateToLogin}>
                Back to Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


