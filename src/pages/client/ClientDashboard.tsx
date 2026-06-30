import { AppLayout } from '@/components/layout/AppLayout'
import { StatCard, Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { StatusBadge, UrgencyBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { currentMockUser, mockVehicles, mockServiceRequests, mockInterventions } from '@/data/mockData'
import { formatDate, formatDateRelative, formatMileage, getCategoryConfig, isDateAlert } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { Car, ClipboardList, AlertTriangle, Plus, ChevronRight, Wrench, Calendar, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Bonjour'
  if (h < 18) return 'Bon après-midi'
  return 'Bonsoir'
}

export function ClientDashboard() {
  const user = currentMockUser
  const vehicles = mockVehicles.filter(v => v.owner_id === user.id)
  const requests = mockServiceRequests.filter(r => r.client_id === user.id)
  const activeRequests = requests.filter(r => !['termine', 'annule'].includes(r.status))
  const recentInterventions = mockInterventions.filter(i => vehicles.some(v => v.id === i.vehicle_id)).slice(0, 3)

  const nextMfk = vehicles
    .filter(v => v.next_mfk_date)
    .sort((a, b) => new Date(a.next_mfk_date!).getTime() - new Date(b.next_mfk_date!).getTime())[0]

  const nextService = vehicles
    .filter(v => v.next_service_date)
    .sort((a, b) => new Date(a.next_service_date!).getTime() - new Date(b.next_service_date!).getTime())[0]

  const alerts = vehicles.filter(v =>
    isDateAlert(v.next_mfk_date, 90) || isDateAlert(v.next_service_date, 60)
  )

  return (
    <AppLayout user={user} notificationCount={2} showNewRequest>

      {/* ── Hero greeting ── */}
      <div
        className="relative rounded-2xl p-7 mb-8 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #131313 0%, #0F0F0F 100%)',
          border: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        {/* Glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '-40px', right: '-40px',
            width: '300px', height: '300px',
            background: 'radial-gradient(circle, rgba(255,119,0,0.07) 0%, transparent 65%)',
          }}
        />
        {/* Grid texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.012]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-[#444] text-sm mb-1 font-medium">{getGreeting()},</p>
            <h1 className="text-3xl font-black text-white mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {user.first_name} <span style={{
                background: 'linear-gradient(135deg, #FF7700, #FF9933)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>{user.last_name}</span>
            </h1>
            <p className="text-[#3A3A3A] text-sm">Votre espace conciergerie CarCarry · Canton de Fribourg</p>
          </div>

          {/* Quick actions */}
          <div className="hidden lg:flex items-center gap-3">
            {alerts.length > 0 && (
              <div
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl"
                style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.15)' }}
              >
                <AlertTriangle size={14} className="text-yellow-400" />
                <span className="text-yellow-400 text-xs font-bold">{alerts.length} alerte{alerts.length > 1 ? 's' : ''}</span>
              </div>
            )}
            <Link to="/client/requests/new">
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:opacity-90"
                style={{
                  background: 'linear-gradient(135deg, #FF7700 0%, #CC5F00 100%)',
                  boxShadow: '0 2px 12px rgba(255,119,0,0.3)',
                }}
              >
                <Plus size={15} /> Nouvelle demande
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Véhicules" value={vehicles.length} icon={<Car size={22} />} color="orange" sub="enregistrés" />
        <StatCard label="Demandes actives" value={activeRequests.length} icon={<ClipboardList size={22} />} color="blue" sub="en cours" />
        <StatCard
          label="Prochaine MFK"
          value={nextMfk ? formatDateRelative(nextMfk.next_mfk_date) : '—'}
          icon={<Calendar size={22} />}
          color={isDateAlert(nextMfk?.next_mfk_date, 90) ? 'red' : 'green'}
          sub={nextMfk ? `${nextMfk.make} ${nextMfk.model}` : undefined}
        />
        <StatCard
          label="Prochain service"
          value={nextService ? formatDateRelative(nextService.next_service_date) : '—'}
          icon={<Wrench size={22} />}
          color={isDateAlert(nextService?.next_service_date, 60) ? 'yellow' : 'green'}
          sub={nextService ? `${nextService.make} ${nextService.model}` : undefined}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── Left 2/3 ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Alerts banner */}
          {alerts.length > 0 && (
            <div
              className="rounded-2xl p-5"
              style={{
                background: 'linear-gradient(135deg, rgba(251,191,36,0.06) 0%, rgba(251,191,36,0.02) 100%)',
                border: '1px solid rgba(251,191,36,0.15)',
              }}
            >
              <div className="flex items-center gap-2 mb-3.5">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.2)' }}
                >
                  <AlertTriangle size={14} className="text-yellow-400" />
                </div>
                <p className="text-yellow-400 text-sm font-bold">
                  {alerts.length} alerte{alerts.length > 1 ? 's' : ''} à traiter
                </p>
              </div>
              <div className="space-y-2.5">
                {alerts.map(v => (
                  <div key={v.id} className="flex items-center justify-between">
                    <div>
                      <span className="text-[#ccc] text-sm font-medium">{v.make} {v.model}</span>
                      <span className="text-[#444] text-xs ml-2">
                        {isDateAlert(v.next_mfk_date, 90) ? `MFK → ${formatDate(v.next_mfk_date)}` : `Service → ${formatDate(v.next_service_date)}`}
                      </span>
                    </div>
                    <Link
                      to="/client/requests/new"
                      className="text-[#FF7700] text-xs font-bold flex items-center gap-1 hover:opacity-80 transition-opacity"
                    >
                      Planifier <ChevronRight size={12} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active requests */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <p className="text-white font-bold text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>Demandes en cours</p>
              <Link to="/client/requests" className="text-[#FF7700] text-xs font-medium flex items-center gap-0.5 hover:opacity-80 transition-opacity">
                Voir tout <ChevronRight size={13} />
              </Link>
            </div>

            {activeRequests.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <ClipboardList size={22} className="text-[#2A2A2A]" />
                </div>
                <p className="text-[#444] text-sm mb-4">Aucune demande active</p>
                <Link to="/client/requests/new">
                  <Button size="sm"><Plus size={13} /> Créer une demande</Button>
                </Link>
              </div>
            ) : (
              <div>
                {activeRequests.map((req, i) => {
                  const vehicle = vehicles.find(v => v.id === req.vehicle_id)
                  const cat = getCategoryConfig(req.category)
                  return (
                    <Link
                      key={req.id}
                      to={`/client/requests/${req.id}`}
                      className="flex items-center gap-4 px-6 py-4 group transition-colors"
                      style={{
                        borderBottom: i < activeRequests.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                      }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                      >
                        {cat.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[#ddd] text-sm font-semibold truncate group-hover:text-white transition-colors">{req.title}</p>
                        <p className="text-[#3A3A3A] text-xs mt-0.5">
                          {vehicle ? `${vehicle.make} ${vehicle.model}` : '—'} · {formatDate(req.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <UrgencyBadge urgency={req.urgency} />
                        <StatusBadge status={req.status} />
                        <ChevronRight size={13} className="text-[#2A2A2A] group-hover:text-[#FF7700] transition-colors" />
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* Last interventions */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <p className="text-white font-bold text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>Dernières interventions</p>
              <Link to="/client/history" className="text-[#FF7700] text-xs font-medium flex items-center gap-0.5 hover:opacity-80 transition-opacity">
                Historique <ChevronRight size={13} />
              </Link>
            </div>

            {recentInterventions.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <p className="text-[#333] text-sm">Aucune intervention enregistrée</p>
              </div>
            ) : (
              <div>
                {recentInterventions.map((inter, i) => {
                  const vehicle = vehicles.find(v => v.id === inter.vehicle_id)
                  const dotColor = inter.status === 'termine' ? '#34d399' : inter.status === 'en_cours' ? '#FF7700' : '#60a5fa'
                  return (
                    <div
                      key={inter.id}
                      className="flex items-center gap-4 px-6 py-4"
                      style={{ borderBottom: i < recentInterventions.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                    >
                      <div className="flex flex-col items-center gap-1 flex-shrink-0">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: dotColor, boxShadow: `0 0 6px ${dotColor}` }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[#ccc] text-sm font-semibold">{vehicle ? `${vehicle.make} ${vehicle.model}` : '—'}</p>
                        <p className="text-[#3A3A3A] text-xs mt-0.5 truncate">{inter.summary ?? 'Intervention'}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-[#555] text-xs">{formatDate(inter.start_date)}</p>
                        {inter.final_cost && (
                          <p className="text-[#FF7700] text-xs font-bold mt-0.5">CHF {inter.final_cost.toFixed(2)}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Right 1/3 ── */}
        <div className="space-y-5">
          {/* My vehicles */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <p className="text-white font-bold text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>Mes véhicules</p>
              <Link to="/client/vehicles" className="text-[#FF7700] text-xs font-medium hover:opacity-80 transition-opacity">Gérer</Link>
            </div>
            {vehicles.map((v, i) => (
              <Link
                key={v.id}
                to={`/client/vehicles/${v.id}`}
                className="flex items-center gap-3 px-5 py-3.5 group transition-colors"
                style={{ borderBottom: i < vehicles.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(255,119,0,0.08)', border: '1px solid rgba(255,119,0,0.12)' }}
                >
                  <Car size={16} className="text-[#FF7700]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#ccc] text-sm font-semibold group-hover:text-white transition-colors">{v.make} {v.model}</p>
                  <p className="text-[#333] text-xs">{v.license_plate} · {formatMileage(v.mileage)}</p>
                </div>
                <ChevronRight size={13} className="text-[#222] group-hover:text-[#FF7700] transition-colors" />
              </Link>
            ))}
            <div className="px-5 py-3">
              <Link to="/client/vehicles/new">
                <Button variant="secondary" size="sm" className="w-full gap-1.5">
                  <Plus size={13} /> Ajouter un véhicule
                </Button>
              </Link>
            </div>
          </div>

          {/* CTA block */}
          <div
            className="relative rounded-2xl p-5 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255,119,0,0.1) 0%, rgba(255,119,0,0.03) 100%)',
              border: '1px solid rgba(255,119,0,0.18)',
            }}
          >
            <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none" style={{
              background: 'radial-gradient(circle, rgba(255,119,0,0.1) 0%, transparent 70%)',
            }} />
            <div className="relative">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                style={{ background: 'rgba(255,119,0,0.12)', border: '1px solid rgba(255,119,0,0.2)' }}
              >
                <Zap size={16} className="text-[#FF7700]" />
              </div>
              <p className="text-white font-bold text-sm mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Besoin d'aide ?
              </p>
              <p className="text-[#555] text-xs leading-relaxed mb-4">
                Notre équipe CarCarry prend en charge votre véhicule et coordonne tous vos besoins automobiles.
              </p>
              <Link to="/client/requests/new">
                <Button size="sm" className="w-full">
                  <Plus size={13} /> Nouvelle demande
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
