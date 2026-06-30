import { useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { mockProfiles, mockVehicles } from '@/data/mockData'
import { formatDate, formatMileage, getFuelLabel, isDateAlert } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { Car, Search, ChevronRight, AlertTriangle, Gauge, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

export function InternalVehiclesPage() {
  const adminUser = mockProfiles.find(p => p.role === 'carcarry_admin')!
  const [search, setSearch] = useState('')

  const enriched = mockVehicles.map(v => ({
    ...v,
    owner: mockProfiles.find(p => p.id === v.owner_id),
    mfkAlert: isDateAlert(v.next_mfk_date, 90),
    serviceAlert: isDateAlert(v.next_service_date, 60),
  }))

  const filtered = enriched.filter(v =>
    search === '' ||
    `${v.make} ${v.model} ${v.license_plate} ${v.owner?.last_name}`.toLowerCase().includes(search.toLowerCase())
  )

  const alertCount = enriched.filter(v => v.mfkAlert || v.serviceAlert).length

  return (
    <AppLayout user={adminUser} notificationCount={3}>
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>Véhicules</h1>
          <p className="text-[#B0B0B0] text-sm mt-1">
            {mockVehicles.length} véhicule{mockVehicles.length > 1 ? 's' : ''} enregistrés
            {alertCount > 0 && (
              <span className="ml-2 text-yellow-400">· {alertCount} alerte{alertCount > 1 ? 's' : ''}</span>
            )}
          </p>
        </div>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5A5A5A]" />
        <input
          type="text"
          placeholder="Rechercher par marque, plaque, propriétaire..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-[#1C1C1C] border border-[#2E2E2E] text-white placeholder-[#5A5A5A] rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7700]/50 focus:border-[#FF7700]/50"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          {/* Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-[#1E1E1E]">
            {['Véhicule', 'Propriétaire', 'Kilométrage', 'MFK', 'Service', ''].map((h, i) => (
              <div key={h} className={cn('text-[#5A5A5A] text-xs font-semibold uppercase tracking-wider', i === 0 ? 'col-span-3' : i === 5 ? 'col-span-1' : 'col-span-2')}>
                {h}
              </div>
            ))}
          </div>

          <div className="divide-y divide-[#1E1E1E]">
            {filtered.map(v => (
              <Link
                key={v.id}
                to={`/internal/vehicles/${v.id}`}
                className="grid grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-[#1E1E1E] transition-colors group"
              >
                {/* Vehicle */}
                <div className="col-span-10 md:col-span-3 flex items-center gap-3">
                  <div className={cn(
                    'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0',
                    (v.mfkAlert || v.serviceAlert) ? 'bg-yellow-500/10' : 'bg-[#272727]'
                  )}>
                    <Car size={16} className={cn((v.mfkAlert || v.serviceAlert) ? 'text-yellow-400' : 'text-[#FF7700]')} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">{v.make} {v.model}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Badge variant="gray" className="text-xs">{v.license_plate}</Badge>
                      <span className="text-[#5A5A5A] text-xs">{v.year}</span>
                    </div>
                  </div>
                </div>

                {/* Owner */}
                <div className="hidden md:block col-span-2">
                  <p className="text-[#B0B0B0] text-xs">
                    {v.owner ? `${v.owner.first_name} ${v.owner.last_name}` : '—'}
                  </p>
                  <p className="text-[#3A3A3A] text-xs">{v.owner?.city}</p>
                </div>

                {/* Mileage */}
                <div className="hidden md:flex col-span-2 items-center gap-1.5">
                  <Gauge size={12} className="text-[#5A5A5A]" />
                  <p className="text-[#B0B0B0] text-xs">{formatMileage(v.mileage)}</p>
                </div>

                {/* MFK */}
                <div className="hidden md:block col-span-2">
                  <p className={cn('text-xs font-medium', v.mfkAlert ? 'text-yellow-400' : 'text-[#B0B0B0]')}>
                    {v.next_mfk_date ? formatDate(v.next_mfk_date) : '—'}
                  </p>
                  {v.mfkAlert && <p className="text-yellow-400 text-xs flex items-center gap-1"><AlertTriangle size={10} /> Alerte</p>}
                </div>

                {/* Service */}
                <div className="hidden md:block col-span-2">
                  <p className={cn('text-xs font-medium', v.serviceAlert ? 'text-orange-400' : 'text-[#B0B0B0]')}>
                    {v.next_service_date ? formatDate(v.next_service_date) : '—'}
                  </p>
                  {v.serviceAlert && <p className="text-orange-400 text-xs flex items-center gap-1"><AlertTriangle size={10} /> Alerte</p>}
                </div>

                {/* Arrow */}
                <div className="col-span-2 md:col-span-1 flex justify-end">
                  <ChevronRight size={14} className="text-[#3A3A3A] group-hover:text-[#FF7700] transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  )
}
