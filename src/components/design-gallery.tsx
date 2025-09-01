import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { 
  Smartphone, 
  Monitor, 
  Tv, 
  Eye, 
  Download,
  Layout,
  Settings,
  Users,
  BarChart3,
  Music,
  CreditCard,
  List,
  User,
  LogIn,
  Home,
  DollarSign,
  MonitorSpeaker
} from 'lucide-react'

// Import all the individual screen components
import { PatronOnboarding } from './patron/patron-onboarding'
import { PatronDiscover } from './patron/patron-discover'
import { SongDetail } from './patron/song-detail'
import { PatronQueue } from './patron/patron-queue'
import { PatronAccount } from './patron/patron-account'
import { ApplePaySheet } from './patron/apple-pay-sheet'
import { AdminLogin } from './admin/admin-login'
import { AdminDashboard } from './admin/admin-dashboard'
import { AdminPricing } from './admin/admin-pricing'
import { AdminAnalytics } from './admin/admin-analytics'
import { AdminDevices } from './admin/admin-devices'
import { TVDisplay } from './tv-display'

interface DesignScreen {
  id: string
  name: string
  description: string
  category: 'patron' | 'admin' | 'tv' | 'shared'
  component: React.ComponentType<any>
  icon: React.ComponentType<any>
  props?: any
  dimensions: {
    width: string
    height: string
    responsive: boolean
  }
}

const screens: DesignScreen[] = [
  // Patron App Screens
  {
    id: 'patron-onboarding',
    name: 'Patron Onboarding',
    description: 'Welcome screen with QR code scanner and session joining',
    category: 'patron',
    component: PatronOnboarding,
    icon: Smartphone,
    props: { onJoinSession: () => {}, onScanQR: () => {} },
    dimensions: { width: '375px', height: '667px', responsive: true }
  },
  {
    id: 'patron-discover',
    name: 'Song Discovery',
    description: 'Search and browse songs with categories and trending music',
    category: 'patron',
    component: PatronDiscover,
    icon: Music,
    props: { 
      onSongSelect: () => {},
      mockMode: true
    },
    dimensions: { width: '375px', height: '667px', responsive: true }
  },
  {
    id: 'song-detail',
    name: 'Song Detail',
    description: 'Individual song page with preview and add to queue functionality',
    category: 'patron',
    component: SongDetail,
    icon: Music,
    props: { 
      song: {
        id: '1',
        title: 'Bohemian Rhapsody',
        artist: 'Queen',
        album: 'A Night at the Opera',
        duration: '5:55',
        price: 3.00,
        imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop'
      },
      onBack: () => {},
      onAddToQueue: () => {}
    },
    dimensions: { width: '375px', height: '667px', responsive: true }
  },
  {
    id: 'apple-pay',
    name: 'Apple Pay Checkout',
    description: 'Payment flow with Apple Pay integration',
    category: 'patron',
    component: ApplePaySheet,
    icon: CreditCard,
    props: { 
      isOpen: true,
      onClose: () => {},
      song: {
        title: 'Bohemian Rhapsody',
        artist: 'Queen',
        price: 3.00
      }
    },
    dimensions: { width: '375px', height: '400px', responsive: true }
  },
  {
    id: 'patron-queue',
    name: 'Queue View',
    description: 'Real-time queue with song progress and ETA',
    category: 'patron',
    component: PatronQueue,
    icon: List,
    props: {},
    dimensions: { width: '375px', height: '667px', responsive: true }
  },
  {
    id: 'patron-account',
    name: 'Account Settings',
    description: 'User profile and preferences management',
    category: 'patron',
    component: PatronAccount,
    icon: User,
    props: {},
    dimensions: { width: '375px', height: '667px', responsive: true }
  },

  // Admin Panel Screens
  {
    id: 'admin-login',
    name: 'Admin Login',
    description: 'Secure login for bar staff and administrators',
    category: 'admin',
    component: AdminLogin,
    icon: LogIn,
    props: { onLogin: () => {} },
    dimensions: { width: '1200px', height: '800px', responsive: true }
  },
  {
    id: 'admin-dashboard',
    name: 'Admin Dashboard',
    description: 'Main control center with queue management and overview',
    category: 'admin',
    component: AdminDashboard,
    icon: Home,
    props: {},
    dimensions: { width: '1200px', height: '800px', responsive: true }
  },
  {
    id: 'admin-pricing',
    name: 'Pricing Management',
    description: 'Dynamic pricing controls and surge pricing settings',
    category: 'admin',
    component: AdminPricing,
    icon: DollarSign,
    props: {},
    dimensions: { width: '1200px', height: '800px', responsive: true }
  },
  {
    id: 'admin-analytics',
    name: 'Analytics Dashboard',
    description: 'Revenue tracking, popular songs, and usage statistics',
    category: 'admin',
    component: AdminAnalytics,
    icon: BarChart3,
    props: {},
    dimensions: { width: '1200px', height: '800px', responsive: true }
  },
  {
    id: 'admin-devices',
    name: 'Device Management',
    description: 'Manage connected devices and session controls',
    category: 'admin',
    component: AdminDevices,
    icon: MonitorSpeaker,
    props: {},
    dimensions: { width: '1200px', height: '800px', responsive: true }
  },

  // TV Display
  {
    id: 'tv-display',
    name: 'TV Display',
    description: 'Full-screen display with now playing and QR code',
    category: 'tv',
    component: TVDisplay,
    icon: Tv,
    props: { sessionId: 'demo-session' },
    dimensions: { width: '1920px', height: '1080px', responsive: false }
  }
]

export function DesignGallery() {
  const [selectedScreen, setSelectedScreen] = useState<DesignScreen | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const filteredScreens = selectedCategory === 'all' 
    ? screens 
    : screens.filter(screen => screen.category === selectedCategory)

  const categoryStats = {
    patron: screens.filter(s => s.category === 'patron').length,
    admin: screens.filter(s => s.category === 'admin').length,
    tv: screens.filter(s => s.category === 'tv').length,
    total: screens.length
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">BarJukebox Design Gallery</h1>
          <p className="text-muted-foreground text-lg mb-6">
            Complete collection of all UI screens and components from the BarJukebox application.
            Each design can be referenced when creating your Figma files.
          </p>
          
          <div className="flex gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{categoryStats.total} Total Screens</Badge>
              <Badge variant="outline">{categoryStats.patron} Patron App</Badge>
              <Badge variant="outline">{categoryStats.admin} Admin Panel</Badge>
              <Badge variant="outline">{categoryStats.tv} TV Display</Badge>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Screens</TabsTrigger>
            <TabsTrigger value="patron">Patron App</TabsTrigger>
            <TabsTrigger value="admin">Admin Panel</TabsTrigger>
            <TabsTrigger value="tv">TV Display</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-6">
            {/* Screen Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredScreens.map((screen) => {
                const IconComponent = screen.icon
                return (
                  <Card key={screen.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {screen.category}
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedScreen(screen)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                      <CardTitle className="text-base">{screen.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {screen.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {/* Thumbnail Preview */}
                        <div 
                          className="bg-muted rounded-lg p-4 aspect-[4/3] overflow-hidden relative"
                          style={{ 
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                          }}
                        >
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-white/80 text-center">
                              <IconComponent className="w-8 h-8 mx-auto mb-2" />
                              <p className="text-xs">{screen.name}</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Dimensions */}
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{screen.dimensions.width} × {screen.dimensions.height}</span>
                          <span>{screen.dimensions.responsive ? 'Responsive' : 'Fixed'}</span>
                        </div>
                        
                        <Button 
                          onClick={() => setSelectedScreen(screen)}
                          className="w-full"
                          size="sm"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Design
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Screen Viewer Modal */}
        {selectedScreen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg max-w-[95vw] max-h-[95vh] overflow-hidden">
              <div className="p-4 border-b flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{selectedScreen.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedScreen.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedScreen(null)}>
                    Close
                  </Button>
                </div>
              </div>
              
              <div className="p-4 overflow-auto max-h-[80vh]">
                <div 
                  className="border rounded-lg overflow-hidden"
                  style={{
                    width: selectedScreen.dimensions.responsive ? '100%' : selectedScreen.dimensions.width,
                    maxWidth: selectedScreen.dimensions.width,
                    height: selectedScreen.dimensions.responsive ? 'auto' : selectedScreen.dimensions.height,
                    maxHeight: selectedScreen.dimensions.height
                  }}
                >
                  <selectedScreen.component {...(selectedScreen.props || {})} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Export Guide */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layout className="w-5 h-5" />
              Creating Your Figma Files
            </CardTitle>
            <CardDescription>
              Use these designs as reference when creating your own editable Figma files
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium">Recommended Figma Structure:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Page 1: Patron App Screens (6 screens)</li>
                  <li>• Page 2: Admin Panel Screens (5 screens)</li>
                  <li>• Page 3: TV Display & Shared Components</li>
                  <li>• Page 4: Design System & Components</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium">Design Specifications:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Mobile: 375×667px (iPhone SE)</li>
                  <li>• Desktop: 1200×800px (Admin Panel)</li>
                  <li>• TV: 1920×1080px (Full HD)</li>
                  <li>• All designs use 14px base font size</li>
                </ul>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                <strong>Tip:</strong> Each screen in this gallery represents a complete, functional design that you can recreate in Figma. 
                Use the "View Design" button to see the full implementation and take screenshots for reference.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}