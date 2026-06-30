import { cn, initials } from '@/lib/utils'

interface AvatarProps {
  firstName: string
  lastName: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function Avatar({ firstName, lastName, size = 'md', className }: AvatarProps) {
  const sizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
    xl: 'w-14 h-14 text-lg',
  }
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-gradient-to-br from-[#FF7700] to-[#CC5500] text-white font-bold flex-shrink-0',
        sizes[size],
        className
      )}
    >
      {initials(firstName, lastName)}
    </div>
  )
}
