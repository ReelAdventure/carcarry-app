import { useParams, Link } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { StatusBadge, UrgencyBadge, Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { mockProfiles, mockVehicles, mockServiceRequests, mockInterventions } from '@/data/mockData'
import { formatDate, formatMileage, getCategoryConfig, isDateAlert } from '@/lib/utils'
import { ArrowLeft, Car, ClipboardList, Phone, Mail, MapPin, Wrench, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

export function InternalClientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const adminUser = mockProfiles.find(p => p.role === 'carcarry_admin')!
  const client = mockProfiles.find(p => p.id === id)
  const vehicles = mockVehicles.filter(v => v.owner_id === id)
  const requests = mockServiceRequests.filter(r => r.client_id === id)
  const activeRequests = requests.filter(r => !['termine', 'annule'].includes(r.status))
  const interventions = mockInterventions.filter(i => vehicles.some(v => v.id === i.vehicle_id))

  if (!client) {
    return (
      <AppLayout user={adminUser} notificationCount={3}>
        <div className="text-center py-20">
          <p className="text-[#B0B0B0]">Client introuvable</p>
          <Link to="/internal/clients" className="text-[#FF7700] text-sm mt-4 inline-block hover:underline">← Retour</Link>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout user={adminUser} notificationCount={3}>
      <div className="mb-6">
        <Link to="/internal/clients" className="flex items-center gap-2 text-[#B0B0B0] hover:text-white text-sm transition-colors">
          <ArrowLeft size={16} /> Retour aux clients
        </Link>
      </div>

      {/* Header */}
      <div className="bg-[#1C1C1C] border border-[#2E2E2E] rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-5">
          <Avatar firstName={client.first_name} lastName={client.last_name} size="xl" />
          <div className="flex-1">
            <h1 className="text-2xl font-black text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {client.first_name} {client.last_name}
            </h1>
            <p className="text-[#5A5A5A] text-sm mt-0.5">Client depuis le {formatDate(client.created_at)}</p>
            <div className="flex flex-wrap gap-3 mt-3">
              {client.phone && (
                <div className="flex items-center gap-1.5 text-[#B0B0B0] text-sm">
                  <Phone size={13} className="text-[#FF7700]" /> {client.phone}
                </div>
              )}
              {client.email && (
                <div className="flex items-center gap-1.5 text-[#B0B0B0] text-sm">
                  <Mail size={13} className="text-[#FF7700]" /> {client.email}
                </div>
              )}
              {client.city && (
                <div className="flex items-center gap-1.5 text-[#B0B0B0] text-sm">
                  <MapPin size={13} className="text-[#FF7700]" /> {client.city}, {client.canton}
                </div>
              )}
            </div>
          </div>
          <div className="hidden md:flex flex-col gap-3 text-right">
            <div className="cc-card p-3 text-center">
              <p className="text-2xl font-black text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>{vehicles.length}</p>
              <p className="text-[#5A5A5A] text-xs">véhicule{vehicles.length > 1 ? 's' : ''}</p>
            </div>
            <div className="cc-card p-3 text-center">
              <p className="text-2xl font-black text-[#FF7700]" style={{ fontFamily: 'Montserrat, sans-serif' }}>{activeRequests.length}</p>
              <p className="text-[#5A5A5A] text-xs">demande{activeRequests.length > 1 ? 's' : ''} active{activeRequests.length > 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Requests */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Demandes ({requests.length})</CardTitle>
                <Badge variant={activeRequests.length > 0 ? 'orange' : 'gray'}>
                  {activeRequests.length} en cours
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {requests.length === 0 ? (
                <div className="px-6 py-8 text-center">
                  <ClipboardList size={28} className="text-[#3A3A3A] mx-auto mb-2" />
                  <p className="text-[#5A5A5A] text-sm">Aucune demande</p>
                </div>
              ) : (
                <div className="divide-y divide-[#1E1E1E]">
                  {requests.map(req => {
                    const vehicle = vehicles.find(v => v.id === req.vehicle_id)
                    const cat = getCategoryConfig(req.category)
                    return (
                      <Link key={req.id} to={`/internal/requests/${req.id}`} className="flex items-center gap-4 px-6 py-3.5 hover:bg-[#1E1E1E] transition-colors group">
                        <span className="text-xl">{cat.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{req.title}</p>
                          <p className="text-[#5A5A5A] text-xs">{vehicle ? `${vehicle.make} ${vehicle.model}` : '—'} · {formatDate(req.created_at)}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <UrgencyBadge urgency={req.urgency} />
                          <StatusBadge status={req.status} />
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Interventions */}
          <Card>
            <CardHeader><CardTitle>Historique interventions ({interventions.length})</CardTitle></CardHeader>
            <CardContent className="p-0">
              {interventions.length === 0 ? (
                <div className="px-6 py-8 text-center">
                  <Wrench size={28} className="text-[#3A3A3A] mx-auto mb-2" />
                  <p className="text-[#5A5A5A] text-sm">Aucune intervention</p>
                </div>
              ) : (
                <div className="divide-y divide-[#1E1E1E]">
                  {interventions.map(inter => {
                    const v = vehicles.find(v => v.id === inter.vehicle_id)
                    return (
                      <div key={inter.id} className="flex items-center gap-4 px-6 py-3.5">
                        <div className={cn('w-2 h-2 rounded-full flex-shrink-0', inter.status === 'termine' ? 'bg-green-400' : 'bg-[#FF7700]')} />
                        <div className="flex-1">
                          <p className="text-white text-sm">{v ? `${v.make} ${v.model}` : '—'}</p>
                          <p className="text-[#5A5A5A] text-xs">{inter.summary ?? 'Intervention'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[#B0B0B0] text-xs">{formatDate(inter.start_date)}</p>
                          {inter.final_cost && <p className="text-[#FF7700] text-xs font-semibold">CHF {inter.final_cost.toFixed(2)}</p>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: vehicles */}
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Véhicules ({vehicles.length})</CardTitle></CardHeader>
            <CardContent className="p-0">
              {vehicles.map(v => {
                const hasAlert = isDateAlert(v.next_mfk_date, 90) || isDateAlert(v.next_service_date, 60)
                return (
                  <Link key={v.id} to={`/internal/vehicles/${v.id}`} className="block px-5 py-4 border-b border-[#1E1E1E] last:border-0 hover:bg-[#1E1E1E] transition-colors group">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Car size={14} className="text-[#FF7700]" />
                          <p className="text-white text-sm font-medium">{v.make} {v.model}</p>
                          {hasAlert && <AlertTriangle size={12} className="text-yellow-400" />}
                        </div>
                        <p className="text-[#5A5A5A] text-xs mt-1">{v.license_plate} · {v.year} · {formatMileage(v.mileage)}</p>
                        <p className="text-[#3A3A3A] text-xs mt-0.5">MFK : {formatDate(v.next_mfk_date)}</p>
                      </div>
                      <Badge variant="gray" className="text-xs">{v.fuel_type}</Badge>
                    </div>
                  </Link>
                )
              })}
            </CardContent>
          </Card>

          {/* Contact info */}
          <Card>
            <CardHeader><CardTitle>Coordonnées</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { icon: <Phone size={13} />, label: 'Téléphone', value: client.phone },
                { icon: <Mail size={13} />, label: 'E-mail', value: client.email },
                { icon: <MapPin size={13} />, label: 'Adresse', value: [client.address, client.postal_code, client.city].filter(Boolean).join(', ') },
                { icon: <MapPin size={13} />, label: 'Canton', value: client.canton },
              ].map(f => f.value ? (
                <div key={f.label} className="flex items-start gap-2">
                  <span className="text-[#FF7700] mt-0.5 flex-shrink-0">{f.icon}</span>
                  <div>
                    <p className="text-[#5A5A5A] text-xs">{f.label}</p>
                    <p className="text-[#B0B0B0] text-sm">{f.value}</p>
                  </div>
                </div>
              ) : null)}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
