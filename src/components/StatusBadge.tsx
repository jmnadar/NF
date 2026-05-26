interface StatusBadgeProps {
  label: string
  styleClass: string
}

export default function StatusBadge({ label, styleClass }: StatusBadgeProps) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-caption font-semibold uppercase tracking-[0.2em] ${styleClass}`}>{label}</span>
  )
}
