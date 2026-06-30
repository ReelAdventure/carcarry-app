import { Bell, Search, Menu, Plus, Command } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { NotificationDrawer } from '@/components/ui/NotificationDrawer'
import { Link } from 'react-router-dom'
import type { Profile } from '@/types'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

interface HeaderProps {
  user: Profile
  onMenuToggle?: () => void
  notificationCount?: number
  showNewRequest?: boolean
}

export function Header({ user, onMenuToggle, notificationCount = 0, showNewRequest }: HeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(notificationCount)

  // Keyboard shortcut Cmd/Ctrl+K for search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        const el = document.getElementById('header-search')
        el?.focus()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const handleNotifOpen = () => {
    setNotifOpen(true)
    setUnreadCount(0)
  }

  return (
    <>
      <header
        className="h-16 flex items-center justify-between px-6 sticky top-0 z-30"
        style={{
          background: 'rgba(10,10,10,0.92)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-xl hover:bg-white/5 text-[#555] hover:text-white transition-colors"
          >
            <Menu size={20} />
          </button>

          {/* Search */}
          <div
            className={cn(
              'hidden md:flex items-center gap-2.5 rounded-xl px-3.5 py-2 transition-all duration-300',
              searchFocused
                ? 'w-80 border border-[#FF7700]/30'
                : 'w-52 border border-transparent hover:border-white/5'
            )}
            style={{ background: 'rgba(255,255,255,0.04)' }}
          >
            <Search size={14} className={cn('flex-shrink-0 transition-colors', searchFocused ? 'text-[#FF7700]' : 'text-[#3A3A3A]')} />
            <input
              id="header-search"
              type="text"
              placeholder="Rechercher..."
              className="bg-transparent text-sm text-white placeholder-[#333] focus:outline-none w-full"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            {searchFocused ? (
              <kbd className="text-[#3A3A3A] text-[10px] border border-[#2A2A2A] rounded px-1.5 py-0.5 font-mono flex-shrink-0">
                Esc
              </kbd>
            ) : (
              <div className="hidden lg:flex items-center gap-0.5 flex-shrink-0">
                <kbd className="text-[#2A2A2A] text-[10px] border border-[#1E1E1E] rounded px-1 py-0.5 font-mono">⌘</kbd>
                <kbd className="text-[#2A2A2A] text-[10px] border border-[#1E1E1E] rounded px-1 py-0.5 font-mono">K</kbd>
              </div>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2.5">
          {showNewRequest && (
            <Link
              to="/client/requests/new"
              className="hidden sm:flex items-center gap-2 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 hover:shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #FF7700 0%, #CC5F00 100%)',
                boxShadow: '0 2px 12px rgba(255,119,0,0.3)',
              }}
            >
              <Plus size={15} />
              Nouvelle demande
            </Link>
          )}

          {/* Notifications */}
          <button
            onClick={handleNotifOpen}
            className="relative p-2.5 rounded-xl transition-all hover:bg-white/5 text-[#444] hover:text-white"
            title="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 w-4 h-4 text-white text-[9px] font-black flex items-center justify-center rounded-full"
                style={{
                  background: 'linear-gradient(135deg, #FF7700, #CC5F00)',
                  boxShadow: '0 1px 6px rgba(255,119,0,0.5)',
                }}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-white/5" />

          {/* User */}
          <Link
            to={user.role === 'client' ? '/client/profile' : user.role === 'partner' ? '/partner' : '/internal'}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity rounded-xl px-2 py-1.5 hover:bg-white/[0.04]"
          >
            <Avatar firstName={user.first_name} lastName={user.last_name} size="sm" />
            <div className="hidden md:block text-left">
              <p className="text-white text-[13px] font-semibold leading-tight">{user.first_name} {user.last_name}</p>
              <p className="text-[#3A3A3A] text-[11px]">
                {user.role === 'carcarry_admin' ? 'Admin' : user.role === 'carcarry_team' ? 'Équipe' : user.role === 'partner' ? 'Partenaire' : 'Client'}
              </p>
            </div>
          </Link>
        </div>
      </header>

      {/* Notification drawer */}
      <NotificationDrawer open={notifOpen} onClose={() => setNotifOpen(false)} />
    </>
  )
}
