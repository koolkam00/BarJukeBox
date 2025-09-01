import React, { useState } from 'react'
import { AdminSidebar } from './admin-sidebar'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Badge } from '../ui/badge'
import { Monitor, QrCode, Upload, ExternalLink, Settings, Wifi, WifiOff } from 'lucide-react'
import { toast } from 'sonner@2.0.3'

type AdminScreen = 'dashboard' | 'pricing' | 'analytics' | 'devices'

interface AdminDevicesProps {
  sessionId: string
  accessToken: string
  onNavigate: (screen: AdminScreen) => void
  onLogout: () => void
}

export function AdminDevices({ sessionId, accessToken, onNavigate, onLogout }: AdminDevicesProps) {
  const [theme, setTheme] = useState('dark')
  const [showQR, setShowQR] = useState(true)
  const [showUpNext, setShowUpNext] = useState(true)
  const [marqueeText, setMarqueeText] = useState('Welcome to BarJukebox! Scan QR code to add your song')
  const [logoFile, setLogoFile] = useState<File | null>(null)

  // Mock connected devices
  const devices = [
    {
      id: '1',
      name: 'Main TV Display',
      type: 'TV',
      status: 'connected',
      location: 'Main Bar',
      resolution: '1920x1080',
      lastSeen: '2 minutes ago'
    },
    {
      id: '2',
      name: 'Corner Display',
      type: 'Monitor',
      status: 'connected',
      location: 'Corner Booth',
      resolution: '1440x900',
      lastSeen: '5 minutes ago'
    },
    {
      id: '3',
      name: 'Entrance Display',
      type: 'Tablet',
      status: 'disconnected',
      location: 'Entrance',
      resolution: '1024x768',
      lastSeen: '1 hour ago'
    }
  ]

  const handleSaveSettings = () => {
    toast.success('Display settings saved!')
  }

  const handleTestBroadcast = () => {
    toast.success('Test broadcast sent to all connected displays')
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setLogoFile(file)
      toast.success('Logo uploaded successfully!')
    }
  }

  const displayUrl = `${window.location.origin}?mode=tv&session=${sessionId}`

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar 
        currentScreen="devices" 
        onNavigate={onNavigate} 
        onLogout={onLogout}
      />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Devices & Displays</h1>
            <p className="text-muted-foreground">Manage TV displays and screen settings</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Display Settings */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>TV Display Settings</CardTitle>
                  <CardDescription>Configure the appearance of your now playing screens</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Display Theme</Label>
                      <Select value={theme} onValueChange={setTheme}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dark">Dark Theme</SelectItem>
                          <SelectItem value="neon">Neon Theme</SelectItem>
                          <SelectItem value="minimal">Minimal Theme</SelectItem>
                          <SelectItem value="colorful">Colorful Theme</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Show QR Code</Label>
                          <p className="text-sm text-muted-foreground">Display join QR code</p>
                        </div>
                        <Switch checked={showQR} onCheckedChange={setShowQR} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Show Up Next</Label>
                          <p className="text-sm text-muted-foreground">Display queue preview</p>
                        </div>
                        <Switch checked={showUpNext} onCheckedChange={setShowUpNext} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="marquee">Marquee Text</Label>
                    <Input
                      id="marquee"
                      value={marqueeText}
                      onChange={(e) => setMarqueeText(e.target.value)}
                      placeholder="Enter scrolling text for display"
                    />
                    <p className="text-sm text-muted-foreground">
                      This text will scroll at the bottom of the display
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="logo">Sponsor/Venue Logo</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="logo"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-muted file:text-muted-foreground hover:file:bg-muted/80"
                      />
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                    {logoFile && (
                      <p className="text-sm text-green-600">✓ {logoFile.name} uploaded</p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={handleSaveSettings}>Save Settings</Button>
                    <Button variant="outline" onClick={handleTestBroadcast}>
                      Test Broadcast
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Connected Devices */}
              <Card>
                <CardHeader>
                  <CardTitle>Connected Devices</CardTitle>
                  <CardDescription>Manage displays currently showing your content</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {devices.map((device) => (
                      <div
                        key={device.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                            <Monitor className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium">{device.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {device.location} • {device.resolution}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <Badge
                              variant={device.status === 'connected' ? 'default' : 'secondary'}
                              className={
                                device.status === 'connected'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                  : ''
                              }
                            >
                              {device.status === 'connected' ? (
                                <><Wifi className="w-3 h-3 mr-1" />Connected</>
                              ) : (
                                <><WifiOff className="w-3 h-3 mr-1" />Offline</>
                              )}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              {device.lastSeen}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Add New Display</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      To connect a new display, open this URL on the device:
                    </p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 p-2 bg-background border rounded text-sm">
                        {displayUrl}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(displayUrl)
                          toast.success('URL copied to clipboard!')
                        }}
                      >
                        Copy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(displayUrl, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Preview & Quick Actions */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Display Preview</CardTitle>
                  <CardDescription>Live preview of your TV display</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                    {/* Mini TV Display Preview */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-black to-blue-900/50">
                      <div className="p-3 text-white text-xs">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-purple-600 rounded-sm flex items-center justify-center">
                              <span className="text-[8px]">♪</span>
                            </div>
                            <span className="text-[10px]">BarJukebox</span>
                          </div>
                          <span className="text-[8px]">Live</span>
                        </div>
                        
                        <div className="text-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded mx-auto mb-2" />
                          <p className="text-[8px] font-bold">Bohemian Rhapsody</p>
                          <p className="text-[6px] text-purple-300">Queen</p>
                        </div>
                        
                        {showQR && (
                          <div className="absolute bottom-2 right-2">
                            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                              <QrCode className="w-4 h-4 text-black" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => window.open(displayUrl, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open Full Display
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Monitor className="w-4 h-4 mr-2" />
                      Enter Fullscreen
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Display Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Active Displays</span>
                    <Badge>{devices.filter(d => d.status === 'connected').length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Devices</span>
                    <Badge variant="outline">{devices.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Display Theme</span>
                    <Badge variant="secondary">{theme}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <QrCode className="w-4 h-4 mr-2" />
                    Generate Join QR Code
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Monitor className="w-4 h-4 mr-2" />
                    Refresh All Displays
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Upload className="w-4 h-4 mr-2" />
                    Update Display Content
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}