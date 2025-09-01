import React, { useState, useEffect } from 'react'
import { X, Check, AlertCircle } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'

interface Song {
  title: string
  artist: string
}

interface Session {
  pricePerSong: number
}

interface ApplePaySheetProps {
  song: Song | null
  session: Session
}

export function ApplePaySheet({ song, session }: ApplePaySheetProps) {
  const [paymentState, setPaymentState] = useState<'processing' | 'success' | 'failed'>('processing')
  
  useEffect(() => {
    // Simulate payment processing
    const timer = setTimeout(() => {
      // 90% success rate for demo
      const success = Math.random() > 0.1
      setPaymentState(success ? 'success' : 'failed')
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (!song) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-50">
      <Card className="w-full max-w-md mx-4 mb-4 bg-white dark:bg-gray-900 rounded-t-2xl">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Apple Pay</h2>
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">Pay</span>
            </div>
          </div>

          {/* Payment States */}
          {paymentState === 'processing' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 relative">
                <div className="w-full h-full border-4 border-gray-200 rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h3 className="text-lg font-medium mb-2">Processing Payment</h3>
              <p className="text-muted-foreground">Confirm with Touch ID or Face ID</p>
            </div>
          )}

          {paymentState === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-green-800">Payment Successful</h3>
              <p className="text-muted-foreground">Adding song to queue...</p>
            </div>
          )}

          {paymentState === 'failed' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-red-800">Payment Failed</h3>
              <p className="text-muted-foreground mb-4">Please try again or use a different payment method</p>
              <Button className="w-full">Try Again</Button>
            </div>
          )}

          {/* Song Details */}
          <div className="border-t pt-4 mt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{song.title}</p>
                <p className="text-sm text-muted-foreground">{song.artist}</p>
              </div>
              <p className="text-lg font-semibold">${session.pricePerSong}</p>
            </div>
          </div>

          {/* Apple Pay Branding */}
          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span>Secured by</span>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-black rounded-sm flex items-center justify-center">
                  <span className="text-white text-xs">🍎</span>
                </div>
                <span className="font-medium">Apple Pay</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}