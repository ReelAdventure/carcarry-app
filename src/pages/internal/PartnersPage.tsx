import { useState, useEffect, useRef } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { mockProfiles, mockPartners } from '@/data/mockData'
import { getPartnerTypeConfig } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { Building2, Plus, Search, Star, ChevronRight, MapPin, Phone, Map, List } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PartnerType, Partner } from '@/types'

const typeFilters: { value: PartnerType | 'all'; label: string }[] = [
  { value: 'all', label: 'Tous' },
  { value: 'garage', label: 'Garage' },
  { value: 'pneumatique', label: 'Pneumatique' },
  { value: 'carrosserie', label: 'Carrosserie' },
  { value: 'detailing', label: 'Detailing' },
  { value: 'depannage', label: 'Dépannage' },
  { value: 'transport', label: 'Transport' },
]

// Approximate coordinates for demo partners (canton Fribourg area)
const PARTNER_COORDS: Record<string, [number, number]> = {
  'part-1': [46.8065,  7.1620],  // Fribourg
  'part-2': [46.8020,  7.1510],  // Fribourg
  'part-3': [46.6205,  7.0580],  // Bulle
  'part-4': [46.9481,  7.4474],  // Berne
}

const TYPE_COLORS: Record<string, string> = {
  garage: '#FF7700',
  pneumatique: '#60a5fa',
  carrosserie: '#a78bfa',
  detailing: '#34d399',
  depannage: '#f87171',
  transport: '#fbbf24',
}

// ─── Map view (Leaflet) ───────────────────────────────────────────────────────

function PartnersMap({ partners }: { partners: Partner[] }) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<unknown>(null)
  const [selected, setSelected] = useState<Partner | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    import('leaflet').then(L => {
      // Dark tile layer style
      const map = L.default.map(mapRef.current!, {
        center: [46.82, 7.15],
        zoom: 10,
        zoomControl: true,
        attributionControl: false,
      })

      L.default.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        { maxZoom: 19 }
      ).addTo(map)

      mapInstanceRef.current = map

      partners.forEach(partner => {
        const coords = PARTNER_COORDS[partner.id]
        if (!coords) return

        const color = TYPE_COLORS[partner.type] ?? '#FF7700'

        const icon = L.default.divIcon({
          className: '',
          html: `
            <div style="
              width:32px;height:32px;border-radius:50%;
              background:${color};
              border:2px solid #0A0A0A;
              box-shadow:0 0 0 3px ${color}40, 0 4px 12px rgba(0,0,0,0.6);
              display:flex;align-items:center;justify-content:center;
              font-size:14px;cursor:pointer;
              transition:transform .15s;
            ">
              ${partner.type === 'garage' ? '🔧' : partner.type === 'pneumatique' ? '🛞' : partner.type === 'carrosserie' ? '🚗' : partner.type === 'detailing' ? '✨' : '🏢'}
            </div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        })

        const marker = L.default.marker(coords, { icon }).addTo(map)

        const score = partner.quality_score?.toFixed(1) ?? '—'
        marker.bindPopup(`
          <div style="
            background:#131313;border:1px solid #1E1E1E;border-radius:12px;
            padding:12px 14px;min-width:200px;font-family:system-ui;
          ">
            <div style="font-size:13px;font-weight:700;color:#fff;margin-bottom:4px">${partner.name}</div>
            <div style="font-size:11px;color:${color};font-weight:600;margin-bottom:6px;text-transform:capitalize">${partner.type}</div>
            <div style="font-size:11px;color:#666;margin-bottom:2px">📍 ${partner.city}, ${partner.canton}</div>
            <div style="font-size:11px;color:#666;margin-bottom:8px">⭐ ${score} · ${partner.missions_count} missions</div>
            <a href="/internal/partners/${partner.id}" style="
              display:inline-block;background:linear-gradient(135deg,#FF7700,#CC5F00);
              color:#fff;font-size:10px;font-weight:700;padding:5px 10px;
              border-radius:6px;text-decoration:none;
            ">Voir le profil →</a>
          </div>
        `, {
          className: 'carcarry-popup',
          maxWidth: 240,
        })

        marker.on('click', () => setSelected(partner))
      })

      // Leaflet popup dark override
      const style = document.createElement('style')
      style.textContent = `
        .carcarry-popup .leaflet-popup-content-wrapper {
          background:transparent !important;
          border:none !important;
          box-shadow:none !important;
          padding:0 !important;
        }
        .carcarry-popup .leaflet-popup-content { margin:0 !important; }
        .carcarry-popup .leaflet-popup-tip-container { display:none; }
        .carcarry-popup .leaflet-popup-close-button { color:#555 !important; top:8px !important; right:8px !important; }
      `
      document.head.appendChild(style)
    })

    return () => {
      if (mapInstanceRef.current) {
        ;(mapInstanceRef.current as { remove: () => void }).remove()
        mapInstanceRef.current = null
      }
    }
  }, [partners])

  return (
    <div className="relative rounded-2xl overflow-hidden" style={{ height: '560px', border: '1px solid #1E1E1E' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

      {/* Legend */}
      <div
        className="absolute bottom-4 left-4 rounded-xl p-3 z-[400]"
        style={{ background: 'rgba(13,13,13,0.95)', border: '1px solid #1E1E1E', backdropFilter: 'blur(8px)' }}
      >
        <p className="text-[10px] font-bold text-[#444] uppercase tracking-widest mb-2">Légende</p>
        {Object.entries(TYPE_COLORS).map(([type, color]) => (
          <div key={type} className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
            <span className="text-[11px] text-[#888] capitalize">{type}</span>
          </div>
        ))}
      </div>

      {/* Partner count */}
      <div
        className="absolute top-4 right-4 rounded-xl px-3 py-2 z-[400]"
        style={{ background: 'rgba(13,13,13,0.95)', border: '1px solid #1E1E1E' }}
      >
        <p className="text-xs font-bold text-white">{partners.length} partenaires</p>
        <p className="text-[10px] text-[#444]">Canton de Fribourg + BE</p>
      </div>

      {/* Leaflet CSS */}
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function PartnersPage() {
  const adminUser = mockProfiles.find(p => p.role === 'carcarry_admin')!
  const [filter, setFilter] = useState<PartnerType | 'all'>('all')
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'grid' | 'map'>('grid')

  const filtered = mockPartners.filter(p => {
    const matchType = filter === 'all' || p.type === filter
    const matchSearch = search === '' || p.name.toLowerCase().includes(search.toLowerCase())
    return matchType && matchSearch
  })

  return (
    <AppLayout user={adminUser} notificationCount={3}>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>Partenaires</h1>
          <p className="text-[#B0B0B0] text-sm mt-1">{mockPartners.length} partenaires référencés</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div
            className="flex rounded-xl p-1"
            style={{ background: '#111', border: '1px solid #1E1E1E' }}
          >
            <button
              onClick={() => setView('grid')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: view === 'grid' ? '#1E1E1E' : 'transparent',
                color: view === 'grid' ? '#FF7700' : '#444',
              }}
            >
              <List size={13} />
              Liste
            </button>
            <button
              onClick={() => setView('map')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: view === 'map' ? '#1E1E1E' : 'transparent',
                color: view === 'map' ? '#FF7700' : '#444',
              }}
            >
              <Map size={13} />
              Carte
            </button>
          </div>
          <Button><Plus size={16} /> Ajouter</Button>
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5A5A5A]" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#1C1C1C] border border-[#2E2E2E] text-white placeholder-[#5A5A5A] rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7700]/50 focus:border-[#FF7700]/50"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {typeFilters.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                filter === f.value ? 'bg-[#FF7700] text-white' : 'bg-[#1C1C1C] text-[#B0B0B0] border border-[#2E2E2E] hover:text-white'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Map view */}
      {view === 'map' && <PartnersMap partners={filtered} />}

      {/* Grid view */}
      {view === 'grid' && (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(partner => {
            const typeCfg = getPartnerTypeConfig(partner.type)
            const score = partner.quality_score ?? 0
            return (
              <Link key={partner.id} to={`/internal/partners/${partner.id}`}>
                <Card className="hover:border-[#FF7700]/30 transition-all duration-200 cursor-pointer overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-[#FF7700]/60 to-[#FF7700]/20" />
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-[#272727] rounded-xl flex items-center justify-center flex-shrink-0">
                          <Building2 size={20} className="text-[#FF7700]" />
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm">{partner.name}</p>
                          <Badge variant="gray" className={cn('mt-1', typeCfg.color)}>{typeCfg.label}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star size={14} fill="currentColor" />
                        <span className="text-sm font-bold">{score.toFixed(1)}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 mb-4">
                      {partner.city && (
                        <div className="flex items-center gap-2 text-[#B0B0B0]">
                          <MapPin size={12} />
                          <span className="text-xs">{partner.city}, {partner.canton}</span>
                        </div>
                      )}
                      {partner.phone && (
                        <div className="flex items-center gap-2 text-[#B0B0B0]">
                          <Phone size={12} />
                          <span className="text-xs">{partner.phone}</span>
                        </div>
                      )}
                      {partner.contact_name && (
                        <p className="text-[#5A5A5A] text-xs">Contact : {partner.contact_name}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#2E2E2E]">
                      <div className="flex gap-4">
                        <div>
                          <p className="text-[#5A5A5A] text-xs">Missions</p>
                          <p className="text-white text-sm font-bold">{partner.missions_count}</p>
                        </div>
                        {partner.average_delay_days && (
                          <div>
                            <p className="text-[#5A5A5A] text-xs">Délai moyen</p>
                            <p className="text-white text-sm font-bold">{partner.average_delay_days}j</p>
                          </div>
                        )}
                      </div>
                      <ChevronRight size={16} className="text-[#3A3A3A]" />
                    </div>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </AppLayout>
  )
}
