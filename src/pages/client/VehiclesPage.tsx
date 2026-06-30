import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { currentMockUser, mockVehicles } from '@/data/mockData'
import { formatDate, formatMileage, getFuelLabel, isDateAlert, daysUntil } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { Car, Plus, AlertTriangle, ChevronRight, Gauge, Calendar, Wrench, Zap, Flame, Droplets, Wind } from 'lucide-react'
import { cn } from '@/lib/utils'

const FUEL_COLORS: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
  essence: { color: '#f87171', bg: 'rgba(248,113,113,0.08)', icon: <Flame size={11} /> },
  diesel: { color: '#60a5fa', bg: 'rgba(96,165,250,0.08)', icon: <Droplets size={11} /> },
  hybride: { color: '#34d399', bg: 'rgba(52,211,153,0.08)', icon: <Wind size={11} /> },
  electrique: { color: '#a78bfa', bg: 'rgba(167,139,250,0.08)', icon: <Zap size={11} /> },
}

function FuelPill({ fuel }: { fuel: string }) {
  const cfg = FUEL_COLORS[fuel] ?? { color: '#888', bg: 'rgba(136,136,136,0.08)', icon: null }
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-[2px] rounded-full text-[10px] font-bold uppercase tracking-wide"
      style={{ color: cfg.color, background: cfg.bg }}
    >
      {cfg.icon}
      {getFuelLabel(fuel as Parameters<typeof getFuelLabel>[0])}
    </span>
  )
}

export function VehiclesPage() {
  const user = currentMockUser
  const vehicles = mockVehicles.filter(v => v.owner_id === user.id)

  return (
    <AppLayout user={user} notificationCount={2} showNewRequest>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-white mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Mes véhicules
          </h1>
          <p className="text-[#444] text-sm">
            {vehicles.length} véhicule{vehicles.length > 1 ? 's' : ''} enregistré{vehicles.length > 1 ? 's' : ''}
          </p>
        </div>
        <Link to="/client/vehicles/new">
          <Button>
            <Plus size={15} /> Ajouter un véhicule
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {vehicles.map(vehicle => {
          const mfkAlert = isDateAlert(vehicle.next_mfk_date, 90)
          const serviceAlert = isDateAlert(vehicle.next_service_date, 60)
          const hasAlert = mfkAlert || serviceAlert
          const mfkDays = daysUntil(vehicle.next_mfk_date)
          const serviceDays = daysUntil(vehicle.next_service_date)

          return (
            <Link key={vehicle.id} to={`/client/vehicles/${vehicle.id}`} className="group block">
              <div
                className="rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer"
                style={{
                  background: '#111111',
                  border: hasAlert
                    ? '1px solid rgba(250,204,21,0.15)'
                    : '1px solid rgba(255,255,255,0.05)',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = hasAlert ? 'rgba(250,204,21,0.3)' : 'rgba(255,119,0,0.25)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(0,0,0,0.5)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = hasAlert ? 'rgba(250,204,21,0.15)' : 'rgba(255,255,255,0.05)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.3)';
                }}
              >
                {/* Color bar — orange gradient or alert yellow */}
                <div
                  className="h-[3px] w-full"
                  style={{
                    background: hasAlert
                      ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                      : 'linear-gradient(90deg, #FF7700, #CC5500)',
                  }}
                />

                <div className="p-5">
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-white font-black text-lg leading-tight truncate" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          {vehicle.make} {vehicle.model}
                        </p>
                        {hasAlert && (
                          <AlertTriangle size={14} className="text-yellow-400 flex-shrink-0" />
                        )}
                      </div>
                      {vehicle.version && (
                        <p className="text-[#555] text-xs mb-1.5 truncate">{vehicle.version}</p>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-[#3A3A3A] text-xs">{vehicle.year}</span>
                        <span className="text-[#2A2A2A]">·</span>
                        <FuelPill fuel={vehicle.fuel_type} />
                      </div>
                    </div>
                    <div className="ml-3 flex-shrink-0">
                      <span
                        className="text-[#888] text-[11px] font-mono px-2.5 py-1 rounded-lg"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                      >
                        {vehicle.license_plate}
                      </span>
                    </div>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {[
                      {
                        icon: <Gauge size={13} />,
                        label: 'Kilométrage',
                        value: formatMileage(vehicle.mileage),
                        alert: false,
                        alertColor: '',
                      },
                      {
                        icon: <Calendar size={13} />,
                        label: 'MFK',
                        value: vehicle.next_mfk_date
                          ? (mfkDays !== null && mfkDays <= 0 ? 'Expirée' : formatDate(vehicle.next_mfk_date))
                          : '—',
                        alert: mfkAlert,
                        alertColor: '#fbbf24',
                        sub: mfkDays !== null && mfkDays > 0 && mfkDays <= 90 ? `J-${mfkDays}` : undefined,
                      },
                      {
                        icon: <Wrench size={13} />,
                        label: 'Service',
                        value: vehicle.next_service_date ? formatDate(vehicle.next_service_date) : '—',
                        alert: serviceAlert,
                        alertColor: '#FF7700',
                        sub: serviceDays !== null && serviceDays > 0 && serviceDays <= 60 ? `J-${serviceDays}` : undefined,
                      },
                      {
                        icon: <Car size={13} />,
                        label: 'Couleur',
                        value: vehicle.color ?? '—',
                        alert: false,
                        alertColor: '',
                      },
                    ].map(s => (
                      <div
                        key={s.label}
                        className="rounded-xl p-3"
                        style={{
                          background: s.alert ? `${s.alertColor}0D` : 'rgba(255,255,255,0.025)',
                          border: s.alert ? `1px solid ${s.alertColor}25` : '1px solid rgba(255,255,255,0.04)',
                        }}
                      >
                        <div className="flex items-center gap-1.5 mb-1.5" style={{ color: s.alert ? s.alertColor : '#444' }}>
                          {s.icon}
                          <span className="text-[10px] font-bold uppercase tracking-wide">{s.label}</span>
                        </div>
                        <p className="text-sm font-bold leading-tight" style={{ color: s.alert ? s.alertColor : '#ccc' }}>
                          {s.value}
                        </p>
                        {s.sub && (
                          <p className="text-[10px] font-semibold mt-0.5" style={{ color: s.alertColor }}>
                            dans {s.sub.replace('J-', '')} jours
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div
                    className="flex items-center justify-between pt-3"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
                  >
                    <p className="text-[#333] text-xs">Ajouté le {formatDate(vehicle.created_at)}</p>
                    <div
                      className="flex items-center gap-1 text-xs font-semibold transition-all duration-200"
                      style={{ color: '#FF7700' }}
                    >
                      Voir la fiche
                      <ChevronRight size={12} />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}

        {/* Add vehicle card */}
        <Link to="/client/vehicles/new" className="block group">
          <div
            className="rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-200 min-h-[300px]"
            style={{
              border: '2px dashed rgba(255,255,255,0.06)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,119,0,0.3)';
              (e.currentTarget as HTMLElement).style.background = 'rgba(255,119,0,0.02)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)';
              (e.currentTarget as HTMLElement).style.background = 'transparent';
            }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:scale-110"
              style={{
                background: 'rgba(255,119,0,0.06)',
                border: '1px solid rgba(255,119,0,0.12)',
              }}
            >
              <Plus size={26} className="text-[#FF7700] opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-center">
              <p className="text-[#444] group-hover:text-[#888] text-sm font-semibold transition-colors">Ajouter un véhicule</p>
              <p className="text-[#2A2A2A] text-xs mt-0.5 group-hover:text-[#3A3A3A] transition-colors">Enregistrez votre voiture</p>
            </div>
          </div>
        </Link>
      </div>
    </AppLayout>
  )
}
