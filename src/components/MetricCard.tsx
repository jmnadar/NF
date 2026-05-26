import type { ReactNode } from 'react'

interface MetricCardProps {
  label: string
  value: string
  badge: string
  badgeType: 'success' | 'danger'
  icon: ReactNode
}

const badgeClasses = {
  success: 'bg-emerald-100 text-emerald-700',
  danger: 'bg-rose-100 text-rose-700',
}

export default function MetricCard({ label, value, badge, badgeType, icon }: MetricCardProps) {
  return (
    <article className="h-full rounded-lg border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="w-8 h-8 flex items-center justify-center text-violet-600">
          {icon}
        </div>
        <span className={`rounded-full px-3 py-1 text-caption font-semibold ${badgeClasses[badgeType]}`}>{badge}</span>
      </div>
      <div>
        <p className="text-label text-slate-400">{label}</p>
        <p className="mt-2 text-h3 text-slate-950">{value}</p>
      </div>
    </article>
  )
}
