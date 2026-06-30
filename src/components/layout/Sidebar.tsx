import { cn } from '@/lib/utils'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Car, ClipboardList, Users, Wrench,
  Building2, FileText, Activity, Settings, LogOut,
  ChevronRight, Zap
} from 'lucide-react'
import type { UserRole } from '@/types'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  badge?: number
}

interface SidebarProps {
  role: UserRole
  onNavigate?: () => void
}

const clientNav: NavItem[] = [
  { label: 'Tableau de bord', href: '/client', icon: <LayoutDashboard size={17} /> },
  { label: 'Mes véhicules', href: '/client/vehicles', icon: <Car size={17} /> },
  { label: 'Mes demandes', href: '/client/requests', icon: <ClipboardList size={17} /> },
  { label: 'Historique', href: '/client/history', icon: <Activity size={17} /> },
  { label: 'Mon profil', href: '/client/profile', icon: <Settings size={17} /> },
]

const internalNav: NavItem[] = [
  { label: 'Dashboard', href: '/internal', icon: <LayoutDashboard size={17} /> },
  { label: 'Kanban', href: '/internal/kanban', icon: <Zap size={17} />, badge: 2 },
  { label: 'Demandes', href: '/internal/requests', icon: <ClipboardList size={17} /> },
  { label: 'Clients', href: '/internal/clients', icon: <Users size={17} /> },
  { label: 'Véhicules', href: '/internal/vehicles', icon: <Car size={17} /> },
  { label: 'Partenaires', href: '/internal/partners', icon: <Building2 size={17} /> },
  { label: 'Interventions', href: '/internal/interventions', icon: <Wrench size={17} /> },
  { label: 'Documents', href: '/internal/documents', icon: <FileText size={17} /> },
  { label: 'Activité', href: '/internal/activity', icon: <Activity size={17} /> },
]

const partnerNav: NavItem[] = [
  { label: 'Mes missions', href: '/partner', icon: <ClipboardList size={17} /> },
  { label: 'Documents', href: '/partner/documents', icon: <FileText size={17} /> },
]

export function Sidebar({ role, onNavigate }: SidebarProps) {
  const location = useLocation()
  const nav = role === 'client' ? clientNav : role === 'partner' ? partnerNav : internalNav

  const isActive = (href: string) => {
    if (href === '/client' || href === '/internal' || href === '/partner') {
      return location.pathname === href
    }
    return location.pathname.startsWith(href)
  }

  return (
    <aside
      className="w-64 flex flex-col h-full fixed left-0 top-0 bottom-0 z-40"
      style={{
        background: 'linear-gradient(180deg, #0F0F0F 0%, #0B0B0B 100%)',
        borderRight: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      {/* Logo */}
      <div className="px-5 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <Link
          to={role === 'client' ? '/client' : role === 'partner' ? '/partner' : '/internal'}
          className="flex items-center gap-3"
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #FF7700 0%, #CC5F00 100%)',
              boxShadow: '0 4px 14px rgba(255,119,0,0.4)',
            }}
          >
            <span className="text-white font-black text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>CC</span>
          </div>
          <div>
            <p className="text-white font-bold text-base leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>CarCarry</p>
            <p className="text-[#3A3A3A] text-[11px] leading-tight tracking-wide">Conciergerie</p>
          </div>
        </Link>
      </div>

      {/* Space switcher */}
      {(role === 'carcarry_admin' || role === 'carcarry_team') && (
        <div className="px-4 pt-4">
          <div
            className="rounded-xl p-1 flex gap-1"
            style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            {[
              { label: 'Interne', path: '/internal' },
              { label: 'Client', path: '/client' },
            ].map(({ label, path }) => {
              const active = location.pathname.startsWith(path)
              return (
                <Link
                  key={path}
                  to={path}
                  className="flex-1 text-center py-1.5 text-xs font-semibold rounded-lg transition-all duration-200"
                  style={active ? {
                    background: 'linear-gradient(135deg, #FF7700 0%, #CC5F00 100%)',
                    color: '#fff',
                    boxShadow: '0 2px 8px rgba(255,119,0,0.3)',
                  } : { color: '#444' }}
                >
                  {label}
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Section label */}
      <div className="px-5 pt-5 pb-1.5">
        <p className="text-[#2A2A2A] text-[10px] font-bold uppercase tracking-[0.15em]">Menu</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto scrollbar-thin pb-2">
        {nav.map(item => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative',
                !active && 'text-[#4A4A4A] hover:text-[#B0B0B0]'
              )}
              style={active ? {
                background: 'linear-gradient(135deg, rgba(255,119,0,0.1) 0%, rgba(255,119,0,0.03) 100%)',
                border: '1px solid rgba(255,119,0,0.12)',
                color: '#fff',
              } : {}}
            >
              {/* Active indicator bar */}
              {active && (
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                  style={{ background: '#FF7700', boxShadow: '0 0 8px rgba(255,119,0,0.6)' }}
                />
              )}

              <span className="flex items-center gap-3">
                <span className={cn(
                  'transition-colors flex-shrink-0',
                  active ? 'text-[#FF7700]' : 'text-[#383838] group-hover:text-[#666]'
                )}>
                  {item.icon}
                </span>
                <span className="text-[13px]">{item.label}</span>
              </span>

              <span className="flex items-center gap-1.5 flex-shrink-0">
                {item.badge != null && (
                  <span
                    className="text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none"
                    style={{
                      background: 'linear-gradient(135deg, #FF7700, #CC5F00)',
                      boxShadow: '0 1px 6px rgba(255,119,0,0.5)',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
                {active && <ChevronRight size={12} className="text-[#FF7700] opacity-60" />}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="flex items-center gap-2.5 px-3 py-2 mb-1">
          <div
            className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0"
            style={{ boxShadow: '0 0 6px rgba(74,222,128,0.7)' }}
          />
          <span className="text-[#333] text-xs">
            {role === 'carcarry_admin'
              ? 'Admin CarCarry'
              : role === 'carcarry_team'
              ? 'Équipe CarCarry'
              : role === 'partner'
              ? 'Partenaire'
              : 'Client'}
          </span>
        </div>
        <Link
          to="/auth/login"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-[#383838] hover:text-red-400 hover:bg-red-500/5 transition-all duration-150"
        >
          <LogOut size={15} />
          Déconnexion
        </Link>
      </div>
    </aside>
  )
}
