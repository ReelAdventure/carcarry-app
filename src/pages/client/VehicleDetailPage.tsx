import { useParams, Link } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { StatusBadge } from '@/components/ui/Badge'
import { currentMockUser, mockVehicles, mockServiceRequests, mockInterventions } from '@/data/mockData'
import { formatDate, formatMileage, getFuelLabel, isDateAlert, getCategoryConfig } from '@/lib/utils'
import { ArrowLeft, Car, Plus, AlertTriangle, FileText, Wrench } from 'lucide-react'
import { cn } from '@/lib/utils'

export function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>()
  const user = currentMockUser
  const vehicle = mockVehicles.find(v => v.id === id)
  const requests = mockServiceRequests.filter(r => r.vehicle_id === id)
  const interventions = mockInterventions.filter(i => i.vehicle_id === id)

  if (!vehicle) {
    return (
      <AppLayout user={user}>
        <div className="text-center py-20">
          <Car size={48} className="text-[#3A3A3A] mx-auto mb-4" />
          <p className="text-[#B0B0B0]">Véhicule introuvable</p>
          <Link to="/client/vehicles"><Button variant="secondary" className="mt-4">Retour</Button></Link>
        </div>
      </AppLayout>
    )
  }

  const mfkAlert = isDateAlert(vehicle.next_mfk_date, 90)
  const serviceAlert = isDateAlert(vehicle.next_service_date, 60)

  const fields = [
    { label: 'Marque', value: vehicle.make },
    { label: 'Modèle', value: vehicle.model },
    { label: 'Version', value: vehicle.version },
    { label: 'Année', value: vehicle.year.toString() },
    { label: 'Plaque', value: vehicle.license_plate },
    { label: 'VIN', value: vehicle.vin, mono: true },
    { label: 'Kilométrage', value: formatMileage(vehicle.mileage) },
    { label: 'Couleur', value: vehicle.color },
    { label: 'Carburant', value: getFuelLabel(vehicle.fuel_type) },
    { label: 'Transmission', value: vehicle.transmission === 'automatique' ? 'Automatique' : vehicle.transmission === 'manuelle' ? 'Manuelle' : 'Semi-automatique' },
    { label: "Date d'achat", value: formatDate(vehicle.purchase_date) },
    { label: 'Dernier service', value: formatDate(vehicle.last_service_date) },
    { label: 'Prochain service', value: formatDate(vehicle.next_service_date), alert: serviceAlert },
    { label: 'Dernière MFK', value: formatDate(vehicle.last_mfk_date) },
    { label: 'Prochaine MFK', value: formatDate(vehicle.next_mfk_date), alert: mfkAlert },
  ]

  return (
    <AppLayout user={user} notificationCount={2} showNewRequest>
      {/* Back */}
      <div className="mb-6">
        <Link to="/client/vehicles" className="flex items-center gap-2 text-[#B0B0B0] hover:text-white text-sm transition-colors">
          <ArrowLeft size={16} /> Retour aux véhicules
        </Link>
      </div>

      {/* Header card */}
      <div className="bg-gradient-to-r from-[#1C1C1C] to-[#161616] border border-[#2E2E2E] rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#272727] to-[#1A1A1A] rounded-2xl flex items-center justify-center border border-[#3A3A3A]">
              <Car size={32} className="text-[#FF7700]" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {vehicle.make} {vehicle.model}
              </h1>
              {vehicle.version && <p className="text-[#B0B0B0] text-sm">{vehicle.version}</p>}
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Badge variant="gray">{vehicle.year}</Badge>
                <Badge variant="gray">{vehicle.license_plate}</Badge>
                <Badge variant="gray">{getFuelLabel(vehicle.fuel_type)}</Badge>
                {(mfkAlert || serviceAlert) && (
                  <Badge variant="yellow" className="flex items-center gap-1">
                    <AlertTriangle size={10} /> Alerte
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to={`/client/requests/new?vehicle=${vehicle.id}`}>
              <Button>
                <Plus size={16} /> Nouvelle demande
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left — details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Technical sheet */}
          <Card>
            <CardHeader>
              <CardTitle>Fiche technique</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {fields.map(f => (
                  <div key={f.label} className="flex flex-col gap-1">
                    <p className="text-[#5A5A5A] text-xs font-medium uppercase tracking-wider">{f.label}</p>
                    <p className={cn(
                      'text-sm font-medium',
                      f.alert ? 'text-yellow-400' : 'text-white',
                      (f as any).mono ? 'font-mono text-xs' : ''
                    )}>
                      {f.value ?? '—'}
                      {f.alert && <AlertTriangle size={12} className="inline ml-1.5 text-yellow-400" />}
                    </p>
                  </div>
                ))}
              </div>
              {vehicle.notes && (
                <div className="mt-4 pt-4 border-t border-[#2E2E2E]">
                  <p className="text-[#5A5A5A] text-xs font-medium uppercase tracking-wider mb-2">Notes</p>
                  <p className="text-[#B0B0B0] text-sm">{vehicle.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Requests */}
          <Card>
            <CardHeader>
              <CardTitle>Demandes liées</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {requests.length === 0 ? (
                <div className="px-6 py-8 text-center">
                  <p className="text-[#5A5A5A] text-sm">Aucune demande pour ce véhicule</p>
                </div>
              ) : (
                <div className="divide-y divide-[#1E1E1E]">
                  {requests.map(req => {
                    const cat = getCategoryConfig(req.category)
                    return (
                      <Link key={req.id} to={`/client/requests/${req.id}`} className="flex items-center gap-4 px-6 py-4 hover:bg-[#1E1E1E] transition-colors">
                        <span className="text-xl">{cat.icon}</span>
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">{req.title}</p>
                          <p className="text-[#5A5A5A] text-xs">{formatDate(req.created_at)}</p>
                        </div>
                        <StatusBadge status={req.status} />
                      </Link>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right */}
        <div className="space-y-6">
          {/* Interventions */}
          <Card>
            <CardHeader>
              <CardTitle>Interventions</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {interventions.length === 0 ? (
                <div className="px-5 py-6 text-center">
                  <Wrench size={24} className="text-[#3A3A3A] mx-auto mb-2" />
                  <p className="text-[#5A5A5A] text-xs">Aucune intervention</p>
                </div>
              ) : (
                <div className="divide-y divide-[#1E1E1E]">
                  {interventions.map(inter => (
                    <div key={inter.id} className="px-5 py-3">
                      <p className="text-white text-xs font-medium">{formatDate(inter.start_date)}</p>
                      <p className="text-[#5A5A5A] text-xs mt-0.5">{inter.summary ?? 'Intervention'}</p>
                      {inter.final_cost && (
                        <p className="text-[#FF7700] text-xs font-semibold mt-1">CHF {inter.final_cost.toFixed(2)}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <FileText size={24} className="text-[#3A3A3A] mx-auto mb-2" />
                <p className="text-[#5A5A5A] text-xs">Aucun document</p>
                <Button variant="secondary" size="sm" className="mt-3">
                  <Plus size={12} /> Ajouter
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
