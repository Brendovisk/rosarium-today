import type { ElementType, ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

type TypographyVariant = 'display' | 'heading' | 'subheading' | 'prayer' | 'label' | 'muted' | 'caption'

interface TypographyProps {
  as?: ElementType
  variant: TypographyVariant
  children: ReactNode
  className?: string
}

const VARIANT_CLASSES: Record<TypographyVariant, string> = {
  display:    'font-caps text-4xl font-bold tracking-widest text-bone uppercase',
  heading:    'font-caps text-xl font-semibold tracking-[0.15em] text-bone uppercase',
  subheading: 'font-caps text-sm font-medium tracking-[0.2em] text-muted uppercase',
  prayer:     'font-display text-2xl leading-relaxed text-bone',
  label:      'font-ui text-xs font-medium tracking-[0.15em] text-muted uppercase',
  muted:      'font-ui text-sm text-muted-2',
  caption:    'font-ui text-[10px] font-medium tracking-[0.2em] text-muted-2 uppercase',
}

export function Typography({ as: Tag = 'p', variant, children, className }: TypographyProps) {
  return (
    <Tag className={cn(VARIANT_CLASSES[variant], className)}>
      {children}
    </Tag>
  )
}
