import { AppLayout } from '@/components/layout/AppLayout'
import { StatCard, Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { StatusBadge, UrgencyBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import {
  mockProfiles, mockVehicles, mockServiceRequests, mockPartners, mockActivityLogs
} from '@/data/mockData'
import { formatDate, getCategoryConfig } from '@/lib/utils'
import { Link } from 'react-router-dom'
import {
  ClipboardList, Users, Car, Building2, AlertTriangle,
  Activity, TrendingUp, CheckCircle2, Clock, Zap, ChevronRight, Star
} from 'lucide-react'

export function InternalDashboard() {
  const adminUser = mockProfiles.find(p => p.role === 'carcarry_admin')!
  const clients = mockProfiles.filter(p => p.role === 'client')
  const requests = mockServiceRequests
  const partners = mockPartners

  const byStatus = (s: string) => requests.filter(r => r.status === s)
  const activePartners = partners.filter(p => p.missions_count > 0)

  const alerts = mockVehicles.filter(v => {
    const now = new Date()
    const diff = (d: Date) => Math.floor((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    const mfkD = v.next_mfk_date ? new Date(v.next_mfk_date) : null
    const svcD = v.next_service_date ? new Date(v.next_service_date) : null
    return (mfkD && diff(mfkD) <= 90) || (svcD && diff(svcD) <= 60)
  })

  const recentActivity = mockActivityLogs.slice(0, 6)

  // Pipeline totals
  const pipeline = [
    { label: 'Nouveau', count: byStatus('nouveau').length, color: '#60a5fa' },
    { label: 'Analyse', count: byStatus('analyse').length, color: '#a78bfa' },
    { label: 'Devis', count: byStatus('devis_en_cours').length, color: '#fb923c' },
    { label: 'Attente', count: byStatus('en_attente_client').length, color: '#fbbf24' },
    { label: 'Planifié', count: byStatus('planifie').length, color: '#34d399' },
    { label: 'En cours', count: byStatus('intervention_en_cours').length, color: '#FF7700' },
    { label: 'Terminé', count: byStatus('termine').length, color: '#6ee7b7' },
  ]
  const total = pipeline.reduce((s, p) => s + p.count, 0)

  return (
    <AppLayout user={adminUser} notificationCount={3}>

      {/* ── Hero header ── */}
      <div
        className="relative rounded-2xl p-7 mb-8 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #131313 0%, #0F0F0F 100%)',
          border: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div
          className="absolute pointer-events-none"
          style={{
            top: '-60px', right: '-60px',
            width: '350px', height: '350px',
            background: 'radial-gradient(circle, rgba(255,119,0,0.07) 0%, transparent 65%)',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.012]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" style={{ boxShadow: '0 0 6px #34d399' }} />
              <span className="text-[#444] text-xs font-bold uppercase tracking-widest">Live · Tableau de bord interne</span>
            </div>
            <h1 className="text-3xl font-black text-white mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              CarCarry{' '}
              <span style={{
                background: 'linear-gradient(135deg, #FF7700, #FF9933)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Conciergerie
              </span>
            </h1>
            <p className="text-[#3A3A3A] text-sm">Vue globale de l'activité — Canton de Fribourg, Suisse</p>
          </div>

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
            <Link to="/internal/kanban">
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity"
                style={{
                  background: 'linear-gradient(135deg, #FF7700 0%, #CC5F00 100%)',
                  boxShadow: '0 2px 12px rgba(255,119,0,0.3)',
                }}
              >
                <TrendingUp size={15} /> Vue Kanban
              </button>
            </Link>
          </div>
        </div>

        {/* Pipeline bar */}
        <div className="relative z-10 mt-6 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center gap-1 mb-2">
            <div className="h-1.5 flex rounded-full overflow-hidden flex-1">
              {pipeline.filter(p => p.count > 0).map(p => (
                <div
                  key={p.label}
                  style={{
                    width: `${(p.count / total) * 100}%`,
                    background: p.color,
                    transition: 'width 0.3s ease',
                  }}
                />
              ))}
            </div>
            <span className="text-[#333] text-xs ml-2">{total} total</span>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {pipeline.map(p => (
              <div key={p.label} className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: p.color }} />
                <span className="text-[#444] text-xs">{p.label}</span>
                <span className="font-bold text-xs" style={{ color: p.color }}>{p.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stats row 1 ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatCard label="Nouvelles demandes" value={byStatus('nouveau').length} icon={<Zap size={22} />} color="orange" />
        <StatCard label="En analyse" value={byStatus('analyse').length} icon={<Clock size={22} />} color="blue" />
        <StatCard label="Planifiées" value={byStatus('planifie').length + byStatus('pris_en_charge').length} icon={<CheckCircle2 size={22} />} color="green" />
        <StatCard label="En cours" value={byStatus('intervention_en_cours').length} icon={<TrendingUp size={22} />} color="yellow" />
      </div>

      {/* ── Stats row 2 ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Clients actifs" value={clients.length} icon={<Users size={22} />} color="gray" />
        <StatCard label="Véhicules" value={mockVehicles.length} icon={<Car size={22} />} color="gray" />
        <StatCard label="Partenaires" value={activePartners.length} icon={<Building2 size={22} />} color="gray" />
        <StatCard label="Alertes véhicules" value={alerts.length} icon={<AlertTriangle size={22} />} color="red"
          sub={alerts.length > 0 ? 'MFK ou service' : 'Tout est à jour'}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* ── Left 2/3 ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Recent requests */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <p className="text-white font-bold text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>Demandes récentes</p>
              <Link to="/internal/kanban">
                <Button size="sm" variant="secondary">Vue Kanban</Button>
              </Link>
            </div>
            <div>
              {requests.slice(0, 6).map((req, i) => {
                const client = mockProfiles.find(p => p.id === req.client_id)
                const vehicle = mockVehicles.find(v => v.id === req.vehicle_id)
                const cat = getCategoryConfig(req.category)
                return (
                  <Link
                    key={req.id}
                    to={`/internal/requests/${req.id}`}
                    className="flex items-center gap-4 px-6 py-3.5 group transition-colors"
                    style={{ borderBottom: i < 5 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                  >
                    <span className="text-xl flex-shrink-0">{cat.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-[#ccc] text-sm font-semibold truncate group-hover:text-white transition-colors">{req.title}</p>
                        <UrgencyBadge urgency={req.urgency} />
                      </div>
                      <p className="text-[#333] text-xs">
                        {client ? `${client.first_name} ${client.last_name}` : '—'} · {vehicle ? `${vehicle.make} ${vehicle.model}` : '—'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <StatusBadge status={req.status} />
                      <p className="text-[#333] text-xs hidden md:block">{formatDate(req.created_at)}</p>
                      <ChevronRight size={13} className="text-[#222] group-hover:text-[#FF7700] transition-colors" />
                    </div>
                  </Link>
                )
              })}
            </div>
            <div className="px-6 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
              <Link to="/internal/requests" className="text-[#FF7700] text-xs font-medium flex items-center gap-1 hover:opacity-80 transition-opacity">
                Voir toutes les demandes <ChevronRight size={12} />
              </Link>
            </div>
          </div>

          {/* Alerts */}
          {alerts.length > 0 && (
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(251,191,36,0.05) 0%, rgba(251,191,36,0.01) 100%)',
                border: '1px solid rgba(251,191,36,0.15)',
              }}
            >
              <div className="flex items-center gap-2.5 px-6 py-4" style={{ borderBottom: '1px solid rgba(251,191,36,0.08)' }}>
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.18)' }}
                >
                  <AlertTriangle size={14} className="text-yellow-400" />
                </div>
                <p className="text-yellow-400 text-sm font-bold">Alertes véhicules ({alerts.length})</p>
              </div>
              <div>
                {alerts.map((v, i) => {
                  const owner = mockProfiles.find(p => p.id === v.owner_id)
                  const now = new Date()
                  const diff = (d: Date) => Math.floor((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
                  const mfkDiff = v.next_mfk_date ? diff(new Date(v.next_mfk_date)) : null
                  const svcDiff = v.next_service_date ? diff(new Date(v.next_service_date)) : null
                  return (
                    <div
                      key={v.id}
                      className="flex items-center justify-between px-6 py-3.5"
                      style={{ borderBottom: i < alerts.length - 1 ? '1px solid rgba(251,191,36,0.06)' : 'none' }}
                    >
                      <div>
                        <p className="text-[#ccc] text-sm font-semibold">{v.make} {v.model} — <span className="font-mono text-[#555] text-xs">{v.license_plate}</span></p>
                        <p className="text-[#444] text-xs">{owner ? `${owner.first_name} ${owner.last_name}` : '—'}</p>
                      </div>
                      <div className="text-right">
                        {mfkDiff !== null && mfkDiff <= 90 && (
                          <p className={`text-xs font-bold ${mfkDiff <= 0 ? 'text-red-400' : 'text-yellow-400'}`}>
                            MFK: {mfkDiff <= 0 ? 'Expirée' : `J-${mfkDiff}`}
                          </p>
                        )}
                        {svcDiff !== null && svcDiff <= 60 && (
                          <p className="text-orange-400 text-xs font-bold">Service: J-{svcDiff}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── Right 1/3 ── */}
        <div className="space-y-5">

          {/* Partners */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <p className="text-white font-bold text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>Partenaires actifs</p>
              <Link to="/internal/partners" className="text-[#FF7700] text-xs font-medium hover:opacity-80 transition-opacity">Gérer</Link>
            </div>
            {partners.map((p, i) => (
              <Link
                key={p.id}
                to={`/internal/partners/${p.id}`}
                className="flex items-center gap-3 px-5 py-3.5 group transition-colors"
                style={{ borderBottom: i < partners.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(255,119,0,0.06)', border: '1px solid rgba(255,119,0,0.1)' }}
                >
                  <Building2 size={15} className="text-[#FF7700] opacity-70" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#ccc] text-xs font-semibold truncate group-hover:text-white transition-colors">{p.name}</p>
                  <p className="text-[#333] text-xs capitalize">{p.type} · {p.missions_count} missions</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={10} className="text-[#FF7700]" />
                  <p className="text-[#FF7700] text-xs font-black">{p.quality_score?.toFixed(1)}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Activity feed */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <div className="flex items-center gap-2 px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <Activity size={13} className="text-[#FF7700]" />
              <p className="text-white font-bold text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>Activité récente</p>
            </div>
            <div>
              {recentActivity.map((log, i) => {
                const actor = mockProfiles.find(p => p.id === log.user_id)
                return (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 px-5 py-3"
                    style={{ borderBottom: i < recentActivity.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                  >
                    {actor && <Avatar firstName={actor.first_name} lastName={actor.last_name} size="sm" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-[#555] text-xs leading-relaxed">{log.details}</p>
                      <p className="text-[#2A2A2A] text-xs mt-0.5">{formatDate(log.created_at)}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
