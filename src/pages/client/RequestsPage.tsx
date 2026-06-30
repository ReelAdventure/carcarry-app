import { useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge, UrgencyBadge } from '@/components/ui/Badge'
import { currentMockUser, mockVehicles, mockServiceRequests } from '@/data/mockData'
import { formatDate, getCategoryConfig } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { Plus, ClipboardList, ChevronRight, Filter } from 'lucide-react'
import type { RequestStatus } from '@/types'
import { cn } from '@/lib/utils'

const statusFilters: { value: RequestStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Toutes' },
  { value: 'nouveau', label: 'Nouvelles' },
  { value: 'analyse', label: 'En analyse' },
  { value: 'devis_en_cours', label: 'Devis' },
  { value: 'planifie', label: 'Planifiées' },
  { value: 'intervention_en_cours', label: 'En cours' },
  { value: 'termine', label: 'Terminées' },
]

export function RequestsPage() {
  const user = currentMockUser
  const vehicles = mockVehicles.filter(v => v.owner_id === user.id)
  const requests = mockServiceRequests.filter(r => r.client_id === user.id)
  const [filter, setFilter] = useState<RequestStatus | 'all'>('all')

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter)
  const sorted = [...filtered].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return (
    <AppLayout user={user} notificationCount={2} showNewRequest>
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>Mes demandes</h1>
          <p className="text-[#B0B0B0] text-sm mt-1">{requests.length} demande{requests.length > 1 ? 's' : ''} au total</p>
        </div>
        <Link to="/client/requests/new">
          <Button><Plus size={16} /> Nouvelle demande</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <Filter size={14} className="text-[#5A5A5A]" />
        {statusFilters.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              filter === f.value ? 'bg-[#FF7700] text-white' : 'bg-[#1C1C1C] text-[#B0B0B0] border border-[#2E2E2E] hover:border-[#3A3A3A] hover:text-white'
            )}
          >
            {f.label}
            {f.value !== 'all' && (
              <span className="ml-1.5 opacity-60">{requests.filter(r => r.status === f.value).length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Requests list */}
      <Card>
        <CardContent className="p-0">
          {sorted.length === 0 ? (
            <div className="py-16 text-center">
              <ClipboardList size={40} className="text-[#3A3A3A] mx-auto mb-4" />
              <p className="text-[#B0B0B0] font-medium mb-1">Aucune demande</p>
              <p className="text-[#5A5A5A] text-sm mb-6">Créez votre première demande de conciergerie</p>
              <Link to="/client/requests/new">
                <Button><Plus size={16} /> Créer une demande</Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[#1E1E1E]">
              {sorted.map(req => {
                const vehicle = vehicles.find(v => v.id === req.vehicle_id)
                const cat = getCategoryConfig(req.category)
                return (
                  <Link
                    key={req.id}
                    to={`/client/requests/${req.id}`}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-[#1E1E1E] transition-colors group"
                  >
                    <div className="w-12 h-12 bg-[#141414] rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                      {cat.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                          <p className="text-white font-medium text-sm">{req.title}</p>
                          <p className="text-[#5A5A5A] text-xs mt-0.5">
                            {vehicle ? `${vehicle.make} ${vehicle.model}` : '—'} · {cat.label}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <UrgencyBadge urgency={req.urgency} />
                          <StatusBadge status={req.status} />
                        </div>
                      </div>
                      <p className="text-[#3A3A3A] text-xs mt-2">{req.description.slice(0, 100)}…</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-2">
                      <p className="text-[#5A5A5A] text-xs">{formatDate(req.created_at)}</p>
                      <ChevronRight size={14} className="text-[#3A3A3A] group-hover:text-[#FF7700] transition-colors" />
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  )
}
