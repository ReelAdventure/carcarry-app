import { useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent } from '@/components/ui/Card'
import { StatusBadge, UrgencyBadge } from '@/components/ui/Badge'
import { mockProfiles, mockVehicles, mockServiceRequests } from '@/data/mockData'
import { formatDate, getCategoryConfig } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { ClipboardList, ChevronRight, Filter } from 'lucide-react'
import type { RequestStatus } from '@/types'
import { cn } from '@/lib/utils'

const statusFilters: { value: RequestStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Toutes' },
  { value: 'nouveau', label: 'Nouveau' },
  { value: 'analyse', label: 'Analyse' },
  { value: 'devis_en_cours', label: 'Devis' },
  { value: 'planifie', label: 'Planifié' },
  { value: 'intervention_en_cours', label: 'En cours' },
  { value: 'termine', label: 'Terminé' },
  { value: 'annule', label: 'Annulé' },
]

export function InternalRequestsPage() {
  const adminUser = mockProfiles.find(p => p.role === 'carcarry_admin')!
  const [filter, setFilter] = useState<RequestStatus | 'all'>('all')

  const filtered = filter === 'all'
    ? mockServiceRequests
    : mockServiceRequests.filter(r => r.status === filter)

  const sorted = [...filtered].sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  return (
    <AppLayout user={adminUser} notificationCount={3}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>Toutes les demandes</h1>
        <p className="text-[#B0B0B0] text-sm mt-1">{mockServiceRequests.length} demandes au total</p>
      </div>

      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <Filter size={14} className="text-[#5A5A5A]" />
        {statusFilters.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              filter === f.value ? 'bg-[#FF7700] text-white' : 'bg-[#1C1C1C] text-[#B0B0B0] border border-[#2E2E2E] hover:text-white'
            )}
          >
            {f.label}
            {f.value !== 'all' && (
              <span className="ml-1.5 opacity-60">
                {mockServiceRequests.filter(r => r.status === f.value).length}
              </span>
            )}
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          {/* Table header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-[#1E1E1E]">
            <div className="col-span-4 text-[#5A5A5A] text-xs font-semibold uppercase tracking-wider">Demande</div>
            <div className="col-span-2 text-[#5A5A5A] text-xs font-semibold uppercase tracking-wider hidden md:block">Client</div>
            <div className="col-span-2 text-[#5A5A5A] text-xs font-semibold uppercase tracking-wider hidden lg:block">Véhicule</div>
            <div className="col-span-2 text-[#5A5A5A] text-xs font-semibold uppercase tracking-wider">Statut</div>
            <div className="col-span-2 text-[#5A5A5A] text-xs font-semibold uppercase tracking-wider hidden md:block">Date</div>
          </div>

          <div className="divide-y divide-[#1E1E1E]">
            {sorted.map(req => {
              const client = mockProfiles.find(p => p.id === req.client_id)
              const vehicle = mockVehicles.find(v => v.id === req.vehicle_id)
              const cat = getCategoryConfig(req.category)
              return (
                <Link
                  key={req.id}
                  to={`/internal/requests/${req.id}`}
                  className="grid grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-[#1E1E1E] transition-colors group"
                >
                  <div className="col-span-4 flex items-center gap-3 min-w-0">
                    <span className="text-lg flex-shrink-0">{cat.icon}</span>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">{req.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[#5A5A5A] text-xs">{cat.label}</span>
                        <UrgencyBadge urgency={req.urgency} />
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2 hidden md:block">
                    <p className="text-[#B0B0B0] text-xs truncate">
                      {client ? `${client.first_name} ${client.last_name}` : '—'}
                    </p>
                  </div>
                  <div className="col-span-2 hidden lg:block">
                    <p className="text-[#B0B0B0] text-xs truncate">
                      {vehicle ? `${vehicle.make} ${vehicle.model}` : '—'}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <StatusBadge status={req.status} />
                  </div>
                  <div className="col-span-2 hidden md:flex items-center justify-between">
                    <p className="text-[#5A5A5A] text-xs">{formatDate(req.created_at)}</p>
                    <ChevronRight size={14} className="text-[#3A3A3A] group-hover:text-[#FF7700] transition-colors" />
                  </div>
                </Link>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  )
}
