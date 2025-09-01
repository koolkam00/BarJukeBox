import React, { useState } from 'react'
import { ArrowLeft, Music, Clock, Play, Heart, Share } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Badge } from '../ui/badge'
import { Textarea } from '../ui/textarea'
import { ImageWithFallback } from '../figma/ImageWithFallback'

interface Song {
  id: string
  title: string
  artist: string
  duration: number
  artwork?: string
  genre?: string
}

interface Session {
  pricePerSong: number
}

interface SongDetailProps {
  song: Song
  session: Session
  onAddToQueue: (song: Song, dedication?: string, tip?: number) => void
  onBack: () => void
}

export function SongDetail({ song, session, onAddToQueue, onBack }: SongDetailProps) {
  const [dedication, setDedication] = useState('')
  const [selectedTip, setSelectedTip] = useState<number>(0)
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false)

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const tipOptions = [
    { value: 0, label: 'No Tip' },
    { value: 1, label: '$1 Tip' },
    { value: 3, label: '$3 Tip' },
    { value: 5, label: '$5 Tip' },
  ]

  const totalPrice = session.pricePerSong + selectedTip

  const handlePreviewToggle = () => {
    setIsPreviewPlaying(!isPreviewPlaying)
    // In real implementation, this would play a 15-second preview
    if (!isPreviewPlaying) {
      setTimeout(() => setIsPreviewPlaying(false), 15000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 text-white">
      {/* Header */}
      <div className="p-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
      </div>

      <div className="max-w-md mx-auto px-4 pb-8">
        {/* Song Artwork */}
        <div className="text-center mb-8">
          <div className="w-64 h-64 mx-auto mb-6 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center relative">
            {song.artwork ? (
              <ImageWithFallback 
                src={song.artwork} 
                alt={song.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <Music className="w-24 h-24 text-white/80" />
            )}
            
            {/* Preview Button Overlay */}
            <Button
              size="sm"
              onClick={handlePreviewToggle}
              className={`absolute bottom-4 right-4 rounded-full w-12 h-12 p-0 ${
                isPreviewPlaying 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-white/20 hover:bg-white/30 backdrop-blur'
              }`}
            >
              <Play className={`w-5 h-5 ${isPreviewPlaying ? 'hidden' : 'block'}`} />
              {isPreviewPlaying && (
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              )}
            </Button>
          </div>

          {/* Song Info */}
          <h1 className="text-2xl font-bold mb-2">{song.title}</h1>
          <p className="text-lg text-purple-200 mb-4">{song.artist}</p>
          
          <div className="flex items-center justify-center gap-4 text-sm text-purple-200">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatDuration(song.duration)}
            </div>
            {song.genre && (
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                {song.genre}
              </Badge>
            )}
          </div>

          {/* Preview Status */}
          {isPreviewPlaying && (
            <div className="mt-4 text-center">
              <p className="text-sm text-purple-200">Playing 15s preview...</p>
            </div>
          )}
        </div>

        {/* Pricing */}
        <Card className="bg-white/10 backdrop-blur border-white/20 mb-6">
          <CardContent className="p-4">
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-green-300">${totalPrice}</div>
              <p className="text-purple-200">
                ${session.pricePerSong} base {selectedTip > 0 && `+ $${selectedTip} tip`}
              </p>
            </div>

            {/* Tip Options */}
            <div className="space-y-3">
              <Label className="text-white">Boost Position (Optional)</Label>
              <div className="grid grid-cols-2 gap-2">
                {tipOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={selectedTip === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTip(option.value)}
                    className={
                      selectedTip === option.value
                        ? "bg-purple-600 hover:bg-purple-700 text-white border-purple-600"
                        : "bg-white/10 hover:bg-white/20 text-white border-white/20"
                    }
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
              {selectedTip > 0 && (
                <p className="text-xs text-purple-200 text-center">
                  Tips help move your song up in the queue
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dedication */}
        <Card className="bg-white/10 backdrop-blur border-white/20 mb-8">
          <CardContent className="p-4 space-y-3">
            <Label htmlFor="dedication" className="text-white">
              Add a dedication (Optional)
            </Label>
            <Textarea
              id="dedication"
              placeholder="e.g., For Sarah's birthday! 🎉"
              value={dedication}
              onChange={(e) => setDedication(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60 resize-none"
              rows={2}
              maxLength={100}
            />
            <p className="text-xs text-purple-200 text-right">
              {dedication.length}/100
            </p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Apple Pay Button */}
          <Button
            size="lg"
            onClick={() => onAddToQueue(song, dedication || undefined, selectedTip)}
            className="w-full bg-black hover:bg-gray-800 text-white border border-gray-600 h-14 rounded-xl"
          >
            <div className="flex items-center justify-center gap-3">
              <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                <span className="text-black font-bold text-xs">Pay</span>
              </div>
              <span>Pay with Apple Pay</span>
            </div>
          </Button>

          {/* Alternative Payment */}
          <Button
            size="lg"
            variant="outline"
            onClick={() => onAddToQueue(song, dedication || undefined, selectedTip)}
            className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20 h-12"
          >
            Add to Queue - ${totalPrice}
          </Button>
        </div>

        {/* Secondary Actions */}
        <div className="flex justify-center gap-4 mt-6">
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
            <Heart className="w-5 h-5 mr-2" />
            Save
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
            <Share className="w-5 h-5 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </div>
  )
}