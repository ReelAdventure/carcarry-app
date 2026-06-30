import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, ClipboardList, Car, User, Plus } from 'lucide-react'
import type { UserRole } from '@/types/database'

const CLIENT_ITEMS = [
  { icon: <LayoutDashboard size={20} />, label: 'Accueil', to: '/client' },
  { icon: <ClipboardList size={20} />, label: 'Demandes', to: '/client/requests' },
  { icon: null, label: '', to: '/client/requests/new' }, // CTA center
  { icon: <Car size={20} />, label: 'Véhicules', to: '/client/vehicles' },
  { icon: <User size={20} />, label: 'Profil', to: '/client/profile' },
]

const INTERNAL_ITEMS = [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard', to: '/internal' },
  { icon: <ClipboardList size={20} />, label: 'Kanban', to: '/internal/kanban' },
  { icon: null, label: '', to: '/internal/requests' }, // CTA center
  { icon: <Car size={20} />, label: 'Clients', to: '/internal/clients' },
  { icon: <User size={20} />, label: 'Profil', to: '/internal' },
]

interface Props {
  role: UserRole
}

export function MobileNav({ role }: Props) {
  const location = useLocation()
  const items = role === 'client' ? CLIENT_ITEMS : INTERNAL_ITEMS

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center px-2 pb-safe"
      style={{
        background: 'rgba(10,10,10,0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        height: '64px',
      }}
    >
      {items.map((item, i) => {
        if (!item.icon) {
          // Center CTA button
          return (
            <div key={i} className="flex-1 flex justify-center">
              <Link
                to={item.to}
                className="w-12 h-12 rounded-2xl flex items-center justify-center -mt-4 shadow-lg transition-transform active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #FF7700 0%, #CC5F00 100%)',
                  boxShadow: '0 4px 16px rgba(255,119,0,0.4)',
                }}
              >
                <Plus size={22} className="text-white" />
              </Link>
            </div>
          )
        }

        const active = location.pathname === item.to || (item.to !== '/client' && item.to !== '/internal' && location.pathname.startsWith(item.to))

        return (
          <Link
            key={i}
            to={item.to}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-2 transition-all duration-150 active:scale-95"
            style={{ color: active ? '#FF7700' : '#2A2A2A' }}
          >
            <div
              className="transition-all duration-150"
              style={{ transform: active ? 'scale(1.1)' : 'scale(1)' }}
            >
              {item.icon}
            </div>
            <span
              className="text-[9px] font-bold uppercase tracking-wide"
              style={{ color: active ? '#FF7700' : '#2A2A2A' }}
            >
              {item.label}
            </span>
            {active && (
              <div
                className="absolute bottom-1 w-4 h-0.5 rounded-full"
                style={{ background: '#FF7700' }}
              />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
