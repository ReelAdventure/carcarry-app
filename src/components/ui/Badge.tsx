import { cn } from '@/lib/utils'
import type { RequestStatus, RequestUrgency } from '@/types'
import { getStatusConfig, getUrgencyConfig } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'orange' | 'gray' | 'green' | 'red' | 'blue' | 'yellow'
}

export function Badge({ children, className, variant = 'default' }: BadgeProps) {
  const variants: Record<string, string> = {
    default: 'text-[#888] border border-white/5',
    orange: 'text-[#FF7700] border border-[#FF7700]/20',
    gray: 'text-[#666] border border-white/5',
    green: 'text-green-400 border border-green-500/20',
    red: 'text-red-400 border border-red-500/20',
    blue: 'text-blue-400 border border-blue-500/20',
    yellow: 'text-yellow-400 border border-yellow-500/20',
  }
  const bgs: Record<string, string> = {
    default: 'rgba(255,255,255,0.04)',
    orange: 'rgba(255,119,0,0.08)',
    gray: 'rgba(255,255,255,0.03)',
    green: 'rgba(74,222,128,0.08)',
    red: 'rgba(248,113,113,0.08)',
    blue: 'rgba(96,165,250,0.08)',
    yellow: 'rgba(250,204,21,0.08)',
  }
  return (
    <span
      className={cn('inline-flex items-center gap-1 px-2.5 py-[3px] rounded-full text-[11px] font-semibold tracking-wide', variants[variant], className)}
      style={{ background: bgs[variant] }}
    >
      {children}
    </span>
  )
}

export function StatusBadge({ status }: { status: RequestStatus }) {
  const cfg = getStatusConfig(status)
  return (
    <span
      className={cn('inline-flex items-center gap-1.5 px-2.5 py-[3px] rounded-full text-[11px] font-semibold border', cfg.bg, cfg.color)}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />
      {cfg.label}
    </span>
  )
}

export function UrgencyBadge({ urgency }: { urgency: RequestUrgency }) {
  const cfg = getUrgencyConfig(urgency)
  return (
    <span
      className={cn('inline-flex items-center px-2 py-[3px] rounded-md text-[11px] font-bold border', cfg.bg, cfg.color)}
    >
      {urgency === 'urgente' && <span className="mr-0.5">⚡</span>}
      {cfg.label}
    </span>
  )
}
