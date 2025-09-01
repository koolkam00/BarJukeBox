import { Music, Shield, Monitor, Layout } from 'lucide-react'

export type AppMode = 'patron' | 'admin' | 'tv' | 'gallery' | 'launcher'

export interface AppInfo {
  id: AppMode
  title: string
  description: string
  icon: typeof Music
  primaryColor: string
  buttonColor: string
  borderColor: string
  hoverColor: string
  defaultSession?: string
}

export const APP_CONFIG: Record<AppMode, AppInfo> = {
  patron: {
    id: 'patron',
    title: 'Patron App',
    description: 'Mobile-first interface for song selection and Apple Pay checkout',
    icon: Music,
    primaryColor: 'bg-purple-500',
    buttonColor: 'bg-purple-600 hover:bg-purple-700',
    borderColor: 'border-purple-400',
    hoverColor: 'hover:bg-purple-600/20',
    defaultSession: 'custom-session'
  },
  admin: {
    id: 'admin',
    title: 'Admin Panel',
    description: 'Desktop interface for queue management and analytics',
    icon: Shield,
    primaryColor: 'bg-blue-500',
    buttonColor: 'bg-blue-600 hover:bg-blue-700',
    borderColor: 'border-blue-400',
    hoverColor: 'hover:bg-blue-600/20'
  },
  tv: {
    id: 'tv',
    title: 'TV Display',
    description: 'Full-screen display with now playing and QR code',
    icon: Monitor,
    primaryColor: 'bg-indigo-500',
    buttonColor: 'bg-indigo-600 hover:bg-indigo-700',
    borderColor: 'border-indigo-400',
    hoverColor: 'hover:bg-indigo-600/20',
    defaultSession: 'bar-session-1'
  },
  gallery: {
    id: 'gallery',
    title: 'Design Gallery',
    description: 'View all UI screens for creating your own Figma files',
    icon: Layout,
    primaryColor: 'bg-emerald-500',
    buttonColor: 'bg-emerald-600 hover:bg-emerald-700',
    borderColor: 'border-emerald-400',
    hoverColor: 'hover:bg-emerald-600/20'
  },
  launcher: {
    id: 'launcher',
    title: 'BarJukebox',
    description: 'Choose your application',
    icon: Music,
    primaryColor: 'bg-purple-500',
    buttonColor: 'bg-purple-600 hover:bg-purple-700',
    borderColor: 'border-purple-400',
    hoverColor: 'hover:bg-purple-600/20'
  }
}

export const FEATURES = [
  'Real-time Sync',
  'Apple Pay',
  'Queue Management',
  'Analytics',
  'Multi-Device'
]

export const DIRECT_URLS = [
  '?app=patron',
  '?app=admin',
  '?app=tv',
  '?app=gallery'
]