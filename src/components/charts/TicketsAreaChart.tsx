import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import type { DailyMetric, TimeRange } from '../../data/mock'

const formatDateLabel = (dateStr: string, range: TimeRange): string => {
  const d = new Date(dateStr + 'T12:00:00')
  if (range === 'hoy') return d.toLocaleTimeString('es-MX', { hour: '2-digit' })
  if (range === 'semana') return d.toLocaleDateString('es-MX', { weekday: 'short' })
  if (range === 'mes') return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
}

interface Props {
  data: DailyMetric[]
  range: TimeRange
}

export default function TicketsAreaChart({ data, range }: Props) {
  const chartData = data.map(d => ({
    ...d,
    label: formatDateLabel(d.date, range),
  }))

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50 h-full flex flex-col">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-label text-slate-500">Tickets del período</p>
          <p className="mt-2 text-body-small text-slate-500">Abiertos vs. resueltos</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-caption font-semibold text-slate-600">
          <span className="inline-flex h-2 w-2 rounded-full bg-violet-600" />
          Abiertos
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          Resueltos
        </div>
      </div>
      <div className="mt-8 flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="gradOpen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradResolved" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.28} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#94a3b8' }}
              interval="preserveStartEnd"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#94a3b8' }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                fontSize: 13,
              }}
            />
            <Area
              type="monotone"
              dataKey="opened"
              stroke="#8b5cf6"
              strokeWidth={3}
              fill="url(#gradOpen)"
              dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#8b5cf6', strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="resolved"
              stroke="#22c55e"
              strokeWidth={3}
              fill="url(#gradResolved)"
              dot={{ r: 4, fill: '#22c55e', strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#22c55e', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
