import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, style, ...props }, ref) => {
    const baseStyle = 'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed'

    const sizes = {
      sm: 'px-3 py-1.5 text-xs rounded-lg',
      md: 'px-4 py-2.5 text-sm rounded-xl',
      lg: 'px-6 py-3 text-sm rounded-xl',
    }

    // Use inline styles for primary/secondary to get gradients
    const variantStyles: Record<string, React.CSSProperties> = {
      primary: {
        background: 'linear-gradient(135deg, #FF7700 0%, #CC5F00 100%)',
        color: '#fff',
        boxShadow: '0 2px 12px rgba(255,119,0,0.25)',
      },
      secondary: {
        background: 'rgba(255,255,255,0.05)',
        color: '#B0B0B0',
        border: '1px solid rgba(255,255,255,0.08)',
      },
      ghost: {},
      danger: {
        background: 'rgba(239,68,68,0.15)',
        color: '#f87171',
        border: '1px solid rgba(239,68,68,0.2)',
      },
      outline: {
        background: 'transparent',
        color: '#B0B0B0',
        border: '1px solid rgba(255,255,255,0.08)',
      },
    }

    const variantClass: Record<string, string> = {
      primary: 'hover:opacity-90 hover:-translate-y-0.5 hover:shadow-lg text-white',
      secondary: 'hover:bg-white/[0.08] hover:text-white hover:border-white/10',
      ghost: 'text-[#666] hover:text-[#B0B0B0] hover:bg-white/[0.04]',
      danger: 'hover:bg-red-500/20 hover:text-red-300',
      outline: 'hover:border-[#FF7700]/30 hover:text-white hover:bg-[#FF7700]/5',
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyle, sizes[size], variantClass[variant], className)}
        disabled={disabled || loading}
        style={{ ...variantStyles[variant], ...style }}
        {...props}
      >
        {loading && (
          <svg className="animate-spin w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
