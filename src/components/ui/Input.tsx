import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-[#B0B0B0] text-xs font-medium uppercase tracking-wider">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'bg-[#1C1C1C] border border-[#2E2E2E] text-white placeholder-[#5A5A5A] rounded-lg px-3 py-2.5 text-sm',
            'focus:outline-none focus:ring-2 focus:ring-[#FF7700]/50 focus:border-[#FF7700]/50 transition-all duration-200',
            error && 'border-red-500/50 focus:ring-red-500/30',
            className
          )}
          {...props}
        />
        {error && <p className="text-red-400 text-xs">{error}</p>}
        {hint && !error && <p className="text-[#5A5A5A] text-xs">{hint}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-[#B0B0B0] text-xs font-medium uppercase tracking-wider">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={cn(
            'bg-[#1C1C1C] border border-[#2E2E2E] text-white rounded-lg px-3 py-2.5 text-sm',
            'focus:outline-none focus:ring-2 focus:ring-[#FF7700]/50 focus:border-[#FF7700]/50 transition-all duration-200',
            'appearance-none cursor-pointer',
            error && 'border-red-500/50',
            className
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map(opt => (
            <option key={opt.value} value={opt.value} className="bg-[#1C1C1C]">
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-red-400 text-xs">{error}</p>}
      </div>
    )
  }
)
Select.displayName = 'Select'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-[#B0B0B0] text-xs font-medium uppercase tracking-wider">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            'bg-[#1C1C1C] border border-[#2E2E2E] text-white placeholder-[#5A5A5A] rounded-lg px-3 py-2.5 text-sm resize-none',
            'focus:outline-none focus:ring-2 focus:ring-[#FF7700]/50 focus:border-[#FF7700]/50 transition-all duration-200',
            error && 'border-red-500/50',
            className
          )}
          {...props}
        />
        {error && <p className="text-red-400 text-xs">{error}</p>}
        {hint && !error && <p className="text-[#5A5A5A] text-xs">{hint}</p>}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'
