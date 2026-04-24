interface CrossIconProps {
  size?: number
  className?: string
}

export function CrossIcon({ size = 16, className }: CrossIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <rect x="6.5" y="0" width="3" height="16" rx="1" />
      <rect x="0" y="4.5" width="16" height="3" rx="1" />
    </svg>
  )
}
