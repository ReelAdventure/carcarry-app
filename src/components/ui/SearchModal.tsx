import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Search, X, Car, ClipboardList, Building2, Users, ChevronRight, Clock } from 'lucide-react'
import { mockVehicles, mockServiceRequests, mockPartners, mockProfiles } from '@/data/mockData'
import { getCategoryConfig } from '@/lib/utils'

interface SearchResult {
  id: string
  type: 'vehicle' | 'request' | 'partner' | 'client'
  title: string
  subtitle: string
  link: string
  icon: React.ReactNode
}

const TYPE_CONFIG = {
  vehicle: { label: 'Véhicule', color: '#FF7700', icon: <Car size={14} /> },
  request: { label: 'Demande', color: '#60a5fa', icon: <ClipboardList size={14} /> },
  partner: { label: 'Partenaire', color: '#a78bfa', icon: <Building2 size={14} /> },
  client: { label: 'Client', color: '#34d399', icon: <Users size={14} /> },
}

const RECENTS: SearchResult[] = [
  { id: 'r1', type: 'request', title: 'Révision annuelle BMW 530d', subtitle: 'En cours · Créée il y a 3 jours', link: '/client/requests/req-1', icon: '🔧' },
  { id: 'r2', type: 'vehicle', title: 'BMW 530d xDrive', subtitle: 'FR 123 456 · 2020', link: '/client/vehicles/v-1', icon: '🚗' },
]

interface Props {
  open: boolean
  onClose: () => void
  role?: string
}

export function SearchModal({ open, onClose, role = 'client' }: Props) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => {
        setVisible(true)
        setTimeout(() => inputRef.current?.focus(), 50)
      })
    } else {
      setVisible(false)
      setTimeout(() => setQuery(''), 200)
    }
  }, [open])

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!open) return
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowDown') setSelected(s => s + 1)
      if (e.key === 'ArrowUp') setSelected(s => Math.max(0, s - 1))
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  // Search across data
  const results: SearchResult[] = query.length < 2 ? [] : [
    ...mockVehicles.filter(v =>
      `${v.make} ${v.model} ${v.license_plate}`.toLowerCase().includes(query.toLowerCase())
    ).map(v => ({
      id: v.id, type: 'vehicle' as const,
      title: `${v.make} ${v.model}`,
      subtitle: `${v.license_plate} · ${v.year}`,
      link: role === 'client' ? `/client/vehicles/${v.id}` : `/internal/vehicles/${v.id}`,
      icon: '🚗',
    })),
    ...mockServiceRequests.filter(r =>
      r.title.toLowerCase().includes(query.toLowerCase())
    ).map(r => {
      const cat = getCategoryConfig(r.category)
      return {
        id: r.id, type: 'request' as const,
        title: r.title,
        subtitle: `${cat.label} · ${r.status}`,
        link: role === 'client' ? `/client/requests/${r.id}` : `/internal/requests/${r.id}`,
        icon: cat.icon,
      }
    }),
    ...mockPartners.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase())
    ).map(p => ({
      id: p.id, type: 'partner' as const,
      title: p.name,
      subtitle: `${p.type} · ${p.city}`,
      link: `/internal/partners/${p.id}`,
      icon: '🏢',
    })),
    ...mockProfiles.filter(p =>
      p.role === 'client' &&
      `${p.first_name} ${p.last_name} ${p.email}`.toLowerCase().includes(query.toLowerCase())
    ).map(p => ({
      id: p.id, type: 'client' as const,
      title: `${p.first_name} ${p.last_name}`,
      subtitle: p.email,
      link: `/internal/clients/${p.id}`,
      icon: '👤',
    })),
  ].slice(0, 8)

  if (!open && !visible) return null

  const showItems = query.length < 2 ? RECENTS : results

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 transition-opacity duration-200"
        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', opacity: visible ? 1 : 0 }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed z-50 left-1/2 transition-all duration-200"
        style={{
          top: '10%',
          transform: `translateX(-50%) scale(${visible ? 1 : 0.96})`,
          opacity: visible ? 1 : 0,
          width: 'min(600px, calc(100vw - 2rem))',
        }}
      >
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: '#131313',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.8)',
          }}
        >
          {/* Search input */}
          <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <Search size={18} className="text-[#444] flex-shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={e => { setQuery(e.target.value); setSelected(0) }}
              placeholder="Rechercher véhicule, demande, partenaire, client..."
              className="flex-1 bg-transparent text-white text-sm placeholder-[#333] outline-none"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-[#333] hover:text-[#888] transition-colors">
                <X size={16} />
              </button>
            )}
            <kbd className="hidden sm:flex items-center gap-0.5 flex-shrink-0">
              <span className="text-[#222] text-xs border border-[#1E1E1E] rounded px-1.5 py-0.5 font-mono">Esc</span>
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-[400px] overflow-y-auto scrollbar-thin">
            {query.length < 2 && (
              <div className="px-5 pt-3 pb-1">
                <div className="flex items-center gap-1.5">
                  <Clock size={11} className="text-[#2A2A2A]" />
                  <p className="text-[#2A2A2A] text-[10px] font-bold uppercase tracking-widest">Récents</p>
                </div>
              </div>
            )}

            {showItems.length === 0 && query.length >= 2 && (
              <div className="px-5 py-10 text-center">
                <Search size={28} className="text-[#1E1E1E] mx-auto mb-3" />
                <p className="text-[#333] text-sm">Aucun résultat pour « {query} »</p>
              </div>
            )}

            {showItems.map((item, i) => {
              const cfg = TYPE_CONFIG[item.type]
              const isSelected = i === selected
              return (
                <Link
                  key={item.id}
                  to={item.link}
                  onClick={onClose}
                  className="flex items-center gap-3 px-5 py-3.5 transition-colors"
                  style={{ background: isSelected ? 'rgba(255,255,255,0.04)' : 'transparent' }}
                  onMouseEnter={() => setSelected(i)}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                    style={{ background: `${cfg.color}12`, border: `1px solid ${cfg.color}20` }}
                  >
                    {typeof item.icon === 'string' ? item.icon : item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#ccc] text-sm font-semibold truncate">{item.title}</p>
                    <p className="text-[#444] text-xs truncate">{item.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: `${cfg.color}15`, color: cfg.color }}
                    >
                      {cfg.label}
                    </span>
                    <ChevronRight size={13} className="text-[#2A2A2A]" />
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-between px-5 py-3"
            style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
          >
            <div className="flex items-center gap-3 text-[#222] text-[10px]">
              <span>↑↓ Naviguer</span>
              <span>↵ Ouvrir</span>
              <span>Esc Fermer</span>
            </div>
            <span className="text-[#1E1E1E] text-[10px]">
              {results.length > 0 ? `${results.length} résultat${results.length > 1 ? 's' : ''}` : ''}
            </span>
          </div>
        </div>
      </div>
    </>
  )
}
