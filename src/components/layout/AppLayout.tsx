import { useState, useEffect } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { MobileNav } from './MobileNav'
import { SearchModal } from '@/components/ui/SearchModal'
import type { Profile } from '@/types'
import { cn } from '@/lib/utils'

interface AppLayoutProps {
  children: React.ReactNode
  user: Profile
  notificationCount?: number
  showNewRequest?: boolean
}

export function AppLayout({ children, user, notificationCount = 0, showNewRequest }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <div className="min-h-screen flex" style={{ background: '#080808' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar desktop */}
      <div className="hidden lg:block">
        <Sidebar role={user.role} />
      </div>

      {/* Sidebar mobile */}
      <div className={cn(
        'fixed inset-y-0 left-0 z-40 lg:hidden transition-transform duration-300',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <Sidebar role={user.role} onNavigate={() => setSidebarOpen(false)} />
      </div>

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <Header
          user={user}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          notificationCount={notificationCount}
          showNewRequest={showNewRequest}
        />
        <main className="flex-1 p-6 lg:p-8 lg:px-10 animate-fade-in max-w-[1400px] pb-24 lg:pb-8">
          {children}
        </main>
        <footer className="hidden lg:flex py-4 px-6 border-t border-[#1A1A1A] items-center justify-between">
          <p className="text-[#2A2A2A] text-xs">© 2025 CarCarry — Conciergerie Automobile Suisse</p>
          <p className="text-[#2A2A2A] text-xs">Canton de Fribourg</p>
        </footer>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav role={user.role} />

      {/* Global search Cmd+K */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} role={user.role} />
    </div>
  )
}
