import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
  glow?: boolean
}

export function Card({ children, className, hover, onClick, glow }: CardProps) {
  return (
    <div
      className={cn(
        'bg-[#161616] border border-[#252525] rounded-2xl relative overflow-hidden',
        hover && 'cursor-pointer transition-all duration-200 hover:border-[#FF7700]/25 hover:bg-[#1A1A1A] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30',
        glow && 'shadow-[0_0_30px_rgba(255,119,0,0.06)]',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('px-6 py-4 border-b border-[#1E1E1E]', className)}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={cn('text-sm font-semibold text-white tracking-wide', className)} style={{ fontFamily: 'Montserrat, sans-serif' }}>
      {children}
    </h3>
  )
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('px-6 py-4', className)}>{children}</div>
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('px-6 py-4 border-t border-[#1E1E1E]', className)}>
      {children}
    </div>
  )
}

interface StatCardProps {
  label: string
  value: string | number
  icon?: React.ReactNode
  sub?: string
  color?: 'orange' | 'green' | 'red' | 'blue' | 'yellow' | 'gray'
  trend?: 'up' | 'down'
  trendValue?: string
}

const STAT_COLORS = {
  orange: {
    icon: 'text-[#FF7700] bg-[#FF7700]/10 border border-[#FF7700]/15',
    bar: 'bg-[#FF7700]',
    glow: 'shadow-[0_0_20px_rgba(255,119,0,0.08)]',
    value: 'text-white',
  },
  green: {
    icon: 'text-green-400 bg-green-500/10 border border-green-500/15',
    bar: 'bg-green-400',
    glow: 'shadow-[0_0_20px_rgba(74,222,128,0.06)]',
    value: 'text-white',
  },
  red: {
    icon: 'text-red-400 bg-red-500/10 border border-red-500/15',
    bar: 'bg-red-400',
    glow: 'shadow-[0_0_20px_rgba(248,113,113,0.08)]',
    value: 'text-red-300',
  },
  blue: {
    icon: 'text-blue-400 bg-blue-500/10 border border-blue-500/15',
    bar: 'bg-blue-400',
    glow: 'shadow-[0_0_20px_rgba(96,165,250,0.06)]',
    value: 'text-white',
  },
  yellow: {
    icon: 'text-yellow-400 bg-yellow-500/10 border border-yellow-500/15',
    bar: 'bg-yellow-400',
    glow: 'shadow-[0_0_20px_rgba(250,204,21,0.06)]',
    value: 'text-yellow-300',
  },
  gray: {
    icon: 'text-[#B0B0B0] bg-[#272727] border border-[#2E2E2E]',
    bar: 'bg-[#B0B0B0]',
    glow: '',
    value: 'text-white',
  },
}

export function StatCard({ label, value, icon, sub, color = 'orange', trend, trendValue }: StatCardProps) {
  const c = STAT_COLORS[color]
  return (
    <div className={cn(
      'bg-[#161616] border border-[#252525] rounded-2xl p-5 relative overflow-hidden transition-all duration-200 hover:border-[#2E2E2E] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30',
      c.glow
    )}>
      {/* Decorative top accent */}
      <div className={cn('absolute top-0 left-0 right-0 h-[2px]', c.bar, 'opacity-60')} />

      <div className="flex items-start justify-between mb-3">
        <p className="text-[#5A5A5A] text-[11px] font-semibold uppercase tracking-widest">{label}</p>
        {icon && (
          <div className={cn('p-2.5 rounded-xl', c.icon)}>
            <span className="block">{icon}</span>
          </div>
        )}
      </div>

      <p className={cn('text-3xl font-black leading-none mb-1', c.value)} style={{ fontFamily: 'Montserrat, sans-serif' }}>
        {value}
      </p>

      {sub && <p className="text-[#4A4A4A] text-xs mt-1.5">{sub}</p>}

      {trend && trendValue && (
        <div className={cn(
          'inline-flex items-center gap-1 text-xs font-medium mt-2 px-2 py-0.5 rounded-full',
          trend === 'up' ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'
        )}>
          <span>{trend === 'up' ? '↑' : '↓'}</span>
          {trendValue}
        </div>
      )}
    </div>
  )
}
