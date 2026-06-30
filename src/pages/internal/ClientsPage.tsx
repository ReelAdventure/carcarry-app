import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { mockProfiles, mockVehicles, mockServiceRequests } from '@/data/mockData'
import { formatDate } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { Users, Search, ChevronRight, Car, ClipboardList } from 'lucide-react'
import { useState } from 'react'

export function ClientsPage() {
  const adminUser = mockProfiles.find(p => p.role === 'carcarry_admin')!
  const clients = mockProfiles.filter(p => p.role === 'client')
  const [search, setSearch] = useState('')

  const filtered = clients.filter(c =>
    search === '' ||
    `${c.first_name} ${c.last_name} ${c.email}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AppLayout user={adminUser} notificationCount={3}>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>Clients</h1>
          <p className="text-[#B0B0B0] text-sm mt-1">{clients.length} clients enregistrés</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5A5A5A]" />
        <input
          type="text"
          placeholder="Rechercher un client..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-[#1C1C1C] border border-[#2E2E2E] text-white placeholder-[#5A5A5A] rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7700]/50 focus:border-[#FF7700]/50"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-[#1E1E1E]">
            {filtered.map(client => {
              const vehicles = mockVehicles.filter(v => v.owner_id === client.id)
              const requests = mockServiceRequests.filter(r => r.client_id === client.id)
              const activeReqs = requests.filter(r => !['termine', 'annule'].includes(r.status))
              return (
                <Link
                  key={client.id}
                  to={`/internal/clients/${client.id}`}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-[#1E1E1E] transition-colors group"
                >
                  <Avatar firstName={client.first_name} lastName={client.last_name} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm">
                      {client.first_name} {client.last_name}
                    </p>
                    <p className="text-[#5A5A5A] text-xs">{client.email}</p>
                    <p className="text-[#3A3A3A] text-xs mt-0.5">{client.city}, {client.canton} · Client depuis {formatDate(client.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="flex items-center gap-1.5 text-[#B0B0B0]">
                      <Car size={13} />
                      <span className="text-xs">{vehicles.length}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#B0B0B0]">
                      <ClipboardList size={13} />
                      <span className="text-xs">{requests.length}</span>
                    </div>
                    {activeReqs.length > 0 && (
                      <Badge variant="orange">{activeReqs.length} actif{activeReqs.length > 1 ? 's' : ''}</Badge>
                    )}
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
