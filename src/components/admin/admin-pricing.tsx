import React, { useState } from 'react'
import { AdminSidebar } from './admin-sidebar'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'
import { Slider } from '../ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { toast } from 'sonner@2.0.3'

type AdminScreen = 'dashboard' | 'pricing' | 'analytics' | 'devices'

interface AdminPricingProps {
  sessionId: string
  accessToken: string
  onNavigate: (screen: AdminScreen) => void
  onLogout: () => void
}

export function AdminPricing({ sessionId, accessToken, onNavigate, onLogout }: AdminPricingProps) {
  const [pricePerSong, setPricePerSong] = useState(3)
  const [happyHourEnabled, setHappyHourEnabled] = useState(false)
  const [happyHourPrice, setHappyHourPrice] = useState(2)
  const [happyHourStart, setHappyHourStart] = useState('17:00')
  const [happyHourEnd, setHappyHourEnd] = useState('19:00')
  const [maxSongLength, setMaxSongLength] = useState([300]) // 5 minutes
  const [maxPerUser, setMaxPerUser] = useState([3])
  const [userCooldown, setUserCooldown] = useState([30]) // 30 minutes
  const [explicitFilter, setExplicitFilter] = useState(true)
  const [tipMultiplier, setTipMultiplier] = useState([1.5])

  const handleSave = () => {
    // In real implementation, this would save to the server
    toast.success('Pricing and rules updated successfully!')
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar 
        currentScreen="pricing" 
        onNavigate={onNavigate} 
        onLogout={onLogout}
      />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Pricing & Rules</h1>
            <p className="text-muted-foreground">Configure pricing, limits, and content filtering</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pricing Settings */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Song Pricing</CardTitle>
                  <CardDescription>Set prices for song requests</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="price-per-song">Regular Price per Song</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">$</span>
                      <Input
                        id="price-per-song"
                        type="number"
                        min="0"
                        step="0.50"
                        value={pricePerSong}
                        onChange={(e) => setPricePerSong(parseFloat(e.target.value))}
                        className="w-24"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Happy Hour Pricing</Label>
                      <p className="text-sm text-muted-foreground">
                        Discounted pricing for specific hours
                      </p>
                    </div>
                    <Switch
                      checked={happyHourEnabled}
                      onCheckedChange={setHappyHourEnabled}
                    />
                  </div>

                  {happyHourEnabled && (
                    <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                      <div className="space-y-2">
                        <Label htmlFor="happy-hour-price">Happy Hour Price</Label>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">$</span>
                          <Input
                            id="happy-hour-price"
                            type="number"
                            min="0"
                            step="0.50"
                            value={happyHourPrice}
                            onChange={(e) => setHappyHourPrice(parseFloat(e.target.value))}
                            className="w-24"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="happy-hour-start">Start Time</Label>
                          <Input
                            id="happy-hour-start"
                            type="time"
                            value={happyHourStart}
                            onChange={(e) => setHappyHourStart(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="happy-hour-end">End Time</Label>
                          <Input
                            id="happy-hour-end"
                            type="time"
                            value={happyHourEnd}
                            onChange={(e) => setHappyHourEnd(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tip Settings</CardTitle>
                  <CardDescription>Configure how tips affect queue position</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tip Position Multiplier</Label>
                    <div className="px-3">
                      <Slider
                        value={tipMultiplier}
                        onValueChange={setTipMultiplier}
                        max={3}
                        min={1}
                        step={0.1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground mt-1">
                        <span>1x (no boost)</span>
                        <span className="font-medium">{tipMultiplier[0]}x boost</span>
                        <span>3x (max boost)</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Higher values make tips more effective at moving songs up in queue
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Rules & Limits */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Song Limits</CardTitle>
                  <CardDescription>Set restrictions on song requests</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Maximum Song Length</Label>
                    <div className="px-3">
                      <Slider
                        value={maxSongLength}
                        onValueChange={setMaxSongLength}
                        max={600}
                        min={60}
                        step={30}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground mt-1">
                        <span>1:00</span>
                        <span className="font-medium">{formatTime(maxSongLength[0])}</span>
                        <span>10:00</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Maximum Songs per User</Label>
                    <div className="px-3">
                      <Slider
                        value={maxPerUser}
                        onValueChange={setMaxPerUser}
                        max={10}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground mt-1">
                        <span>1 song</span>
                        <span className="font-medium">{maxPerUser[0]} songs</span>
                        <span>10 songs</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>User Cooldown Period</Label>
                    <div className="px-3">
                      <Slider
                        value={userCooldown}
                        onValueChange={setUserCooldown}
                        max={120}
                        min={0}
                        step={15}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground mt-1">
                        <span>No cooldown</span>
                        <span className="font-medium">{userCooldown[0]} minutes</span>
                        <span>2 hours</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Time users must wait between song requests
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Content Filtering</CardTitle>
                  <CardDescription>Manage content restrictions and moderation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Block Explicit Content</Label>
                      <p className="text-sm text-muted-foreground">
                        Filter out songs marked as explicit
                      </p>
                    </div>
                    <Switch
                      checked={explicitFilter}
                      onCheckedChange={setExplicitFilter}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="blocked-genres">Blocked Genres (Optional)</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select genres to block" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No blocked genres</SelectItem>
                        <SelectItem value="heavy-metal">Heavy Metal</SelectItem>
                        <SelectItem value="hardcore">Hardcore</SelectItem>
                        <SelectItem value="death-metal">Death Metal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="blocked-artists">Blocked Artists</Label>
                    <Input
                      id="blocked-artists"
                      placeholder="Enter artist names separated by commas"
                      className="text-sm"
                    />
                    <p className="text-sm text-muted-foreground">
                      Songs by these artists will be automatically rejected
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <div className="text-sm text-muted-foreground">
              Changes take effect immediately for new requests
            </div>
            <div className="flex gap-3">
              <Button variant="outline">Reset to Defaults</Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </div>

          {/* Preview */}
          <Card className="mt-6 bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg">Current Configuration Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Regular Price</p>
                  <p className="font-semibold">${pricePerSong}</p>
                </div>
                {happyHourEnabled && (
                  <div>
                    <p className="text-muted-foreground">Happy Hour</p>
                    <p className="font-semibold">${happyHourPrice} ({happyHourStart}-{happyHourEnd})</p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground">Max Length</p>
                  <p className="font-semibold">{formatTime(maxSongLength[0])}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Max per User</p>
                  <p className="font-semibold">{maxPerUser[0]} songs</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}