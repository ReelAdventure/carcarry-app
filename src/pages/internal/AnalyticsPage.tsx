import { AppLayout } from '@/components/layout/AppLayout'
import { mockProfiles, mockServiceRequests, mockPartners, mockVehicles } from '@/data/mockData'
import { TrendingUp, Users, Car, Building2, CheckCircle2, Clock, ArrowUp, ArrowDown } from 'lucide-react'

// Simple sparkline bar chart
function BarChart({ data, color = '#FF7700' }: { data: number[]; color?: string }) {
  const max = Math.max(...data, 1)
  return (
    <div className="flex items-end gap-1 h-16">
      {data.map((v, i) => (
        <div key={i} className="flex-1 rounded-sm transition-all duration-300 hover:opacity-80" style={{
          height: `${(v / max) * 100}%`,
          background: i === data.length - 1 ? color : `${color}40`,
          minHeight: '2px',
        }} />
      ))}
    </div>
  )
}

function MiniStat({ label, value, delta, color }: { label: string; value: string | number; delta?: number; color?: string }) {
  const isPos = (delta ?? 0) >= 0
  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.05)' }}
    >
      <p className="text-[#444] text-[10px] font-bold uppercase tracking-widest mb-2">{label}</p>
      <p className="text-2xl font-black text-white mb-1" style={{ fontFamily: 'Montserrat, sans-serif', color: color ?? '#fff' }}>{value}</p>
      {delta !== undefined && (
        <div className={`flex items-center gap-1 text-xs font-semibold ${isPos ? 'text-green-400' : 'text-red-400'}`}>
          {isPos ? <ArrowUp size={11} /> : <ArrowDown size={11} />}
          {Math.abs(delta)}% vs mois dernier
        </div>
      )}
    </div>
  )
}

export function AnalyticsPage() {
  const adminUser = mockProfiles.find(p => p.role === 'carcarry_admin')!
  const requests = mockServiceRequests
  const partners = mockPartners

  const byStatus = (s: string) => requests.filter(r => r.status === s).length
  const done = byStatus('termine')
  const active = requests.filter(r => !['termine', 'annule'].includes(r.status)).length

  // Fake monthly data
  const monthlyRequests = [3, 5, 4, 7, 6, 8, 5, 9, 7, 11, 8, requests.length]
  const monthlyRevenue = [2800, 4200, 3900, 5100, 4700, 6200, 4500, 7300, 5900, 8400, 6800, 9200]
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']

  const topPartners = [...partners].sort((a, b) => (b.quality_score ?? 0) - (a.quality_score ?? 0)).slice(0, 4)

  const categoryBreakdown = [
    { label: 'Entretien', count: 3, color: '#FF7700', pct: 30 },
    { label: 'Réparation', count: 2, color: '#60a5fa', pct: 20 },
    { label: 'MFK', count: 2, color: '#a78bfa', pct: 20 },
    { label: 'Pneus', count: 2, color: '#34d399', pct: 20 },
    { label: 'Autre', count: 1, color: '#fbbf24', pct: 10 },
  ]

  return (
    <AppLayout user={adminUser} notificationCount={3}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>Analytiques</h1>
        <p className="text-[#444] text-sm">Performance & métriques — Canton de Fribourg</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MiniStat label="Demandes ce mois" value={requests.length} delta={+18} color="#FF7700" />
        <MiniStat label="Terminées" value={done} delta={+12} color="#34d399" />
        <MiniStat label="En cours" value={active} delta={-5} />
        <MiniStat label="Revenus CHF" value={`${(9200).toLocaleString()}`} delta={+22} color="#a78bfa" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MiniStat label="Clients actifs" value={mockProfiles.filter(p => p.role === 'client').length} delta={+8} />
        <MiniStat label="Véhicules gérés" value={mockVehicles.length} delta={+3} />
        <MiniStat label="Partenaires" value={partners.length} />
        <MiniStat label="Score moyen" value="9.1 ★" delta={+2} color="#FF7700" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Monthly requests chart */}
        <div
          className="lg:col-span-2 rounded-2xl p-6"
          style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-white font-bold text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>Demandes par mois</p>
              <p className="text-[#444] text-xs mt-0.5">12 derniers mois</p>
            </div>
            <div className="flex items-center gap-1.5 text-green-400 text-xs font-bold">
              <TrendingUp size={13} />
              +18% ce mois
            </div>
          </div>
          <BarChart data={monthlyRequests} color="#FF7700" />
          <div className="flex items-center justify-between mt-3">
            {months.map((m, i) => (
              <span key={m} className="text-[#222] text-[9px]" style={{ fontWeight: i === 11 ? 700 : 400, color: i === 11 ? '#555' : '#222' }}>{m}</span>
            ))}
          </div>
        </div>

        {/* Category breakdown */}
        <div
          className="rounded-2xl p-6"
          style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.05)' }}
        >
          <p className="text-white font-bold text-sm mb-5" style={{ fontFamily: 'Montserrat, sans-serif' }}>Par catégorie</p>
          <div className="space-y-4">
            {categoryBreakdown.map(c => (
              <div key={c.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[#888] text-xs font-semibold">{c.label}</span>
                  <span className="text-[#555] text-xs">{c.count} ({c.pct}%)</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${c.pct}%`, background: c.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <div
          className="lg:col-span-2 rounded-2xl p-6"
          style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-white font-bold text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>Chiffre d'affaires CHF</p>
              <p className="text-[#444] text-xs mt-0.5">12 derniers mois</p>
            </div>
            <div className="text-right">
              <p className="text-white font-black text-xl" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {monthlyRevenue.reduce((a, b) => a + b, 0).toLocaleString()} CHF
              </p>
              <p className="text-[#444] text-xs">total annuel</p>
            </div>
          </div>
          <BarChart data={monthlyRevenue} color="#a78bfa" />
          <div className="flex items-center justify-between mt-3">
            {months.map((m, i) => (
              <span key={m} className="text-[9px]" style={{ fontWeight: i === 11 ? 700 : 400, color: i === 11 ? '#555' : '#222' }}>{m}</span>
            ))}
          </div>
        </div>

        {/* Top partners */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <p className="text-white font-bold text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>Top partenaires</p>
          </div>
          <div>
            {topPartners.map((p, i) => (
              <div
                key={p.id}
                className="flex items-center gap-3 px-5 py-3.5"
                style={{ borderBottom: i < topPartners.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
              >
                <span
                  className="text-xs font-black w-5 text-center flex-shrink-0"
                  style={{ color: i === 0 ? '#fbbf24' : i === 1 ? '#94a3b8' : i === 2 ? '#cd7c2f' : '#333' }}
                >
                  #{i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[#ccc] text-xs font-semibold truncate">{p.name}</p>
                  <p className="text-[#333] text-xs">{p.missions_count} missions</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[#FF7700] text-sm font-black">{p.quality_score?.toFixed(1)}</p>
                  <p className="text-[#333] text-[9px]">score</p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3.5" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <div
              className="rounded-xl p-3 text-center"
              style={{ background: 'rgba(255,119,0,0.05)', border: '1px solid rgba(255,119,0,0.1)' }}
            >
              <p className="text-[#FF7700] text-2xl font-black" style={{ fontFamily: 'Montserrat, sans-serif' }}>9.1</p>
              <p className="text-[#444] text-xs">Score moyen réseau</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status funnel */}
      <div
        className="mt-6 rounded-2xl p-6"
        style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.05)' }}
      >
        <p className="text-white font-bold text-sm mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>Pipeline actuel</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { label: 'Nouveau', count: byStatus('nouveau'), color: '#60a5fa' },
            { label: 'Analyse', count: byStatus('analyse'), color: '#a78bfa' },
            { label: 'Devis', count: byStatus('devis_en_cours'), color: '#fb923c' },
            { label: 'Attente', count: byStatus('en_attente_client'), color: '#fbbf24' },
            { label: 'Planifié', count: byStatus('planifie'), color: '#34d399' },
            { label: 'En cours', count: byStatus('intervention_en_cours'), color: '#FF7700' },
            { label: 'Terminé', count: done, color: '#6ee7b7' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div
                className="rounded-xl py-3 px-2 mb-2"
                style={{ background: `${s.color}10`, border: `1px solid ${s.color}20` }}
              >
                <p className="text-2xl font-black" style={{ fontFamily: 'Montserrat, sans-serif', color: s.color }}>{s.count}</p>
              </div>
              <p className="text-[#444] text-[10px] font-bold">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
