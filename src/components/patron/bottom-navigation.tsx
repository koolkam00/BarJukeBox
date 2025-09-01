import React from 'react'
import { Search, Music, User } from 'lucide-react'
import { Button } from '../ui/button'

type TabType = 'discover' | 'queue' | 'account'

interface BottomNavigationProps {
  activeTab: TabType
  onNavigate: (tab: TabType) => void
}

export function BottomNavigation({ activeTab, onNavigate }: BottomNavigationProps) {
  const tabs = [
    {
      id: 'discover' as TabType,
      label: 'Discover',
      icon: Search,
    },
    {
      id: 'queue' as TabType,
      label: 'Queue',
      icon: Music,
    },
    {
      id: 'account' as TabType,
      label: 'Account',
      icon: User,
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border safe-bottom">
      <div className="max-w-md mx-auto">
        <nav className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            
            return (
              <Button
                key={tab.id}
                variant="ghost"
                size="sm"
                onClick={() => onNavigate(tab.id)}
                className={`flex-1 flex-col h-16 gap-1 ${
                  isActive 
                    ? 'text-purple-600 bg-purple-50 dark:bg-purple-950 dark:text-purple-400' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-purple-600 dark:text-purple-400' : ''}`} />
                <span className="text-xs">{tab.label}</span>
              </Button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}