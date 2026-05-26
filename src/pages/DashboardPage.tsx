import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Inbox, Users, CheckCircle, Clock } from 'lucide-react'
import { getDailyMetrics, filterByRange, computeStats, generateRecentActivity, account } from '../data/mock'
import type { TimeRange } from '../data/mock'
import MetricCard from '../components/MetricCard'
import TicketsAreaChart from '../components/charts/TicketsAreaChart'

const iconMap: Record<string, React.ReactNode> = {
  Inbox: <Inbox size={20} />,
  Users: <Users size={20} />,
  CheckCircle: <CheckCircle size={20} />,
  Clock: <Clock size={20} />,
}

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Buenos días'
  if (h < 18) return 'Buenas tardes'
  return 'Buenas noches'
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const [range, setRange] = useState<TimeRange>('semana')

  const allMetrics = useMemo(() => getDailyMetrics(), [])
  const filteredMetrics = useMemo(() => filterByRange(allMetrics, range), [allMetrics, range])
  const dynamicStats = useMemo(() => computeStats(filteredMetrics), [filteredMetrics])
  const activities = useMemo(() => generateRecentActivity(), [])
  const greeting = useMemo(() => `${getGreeting()}, ${account.name.split(' ')[0]}`, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-label text-slate-500">Panel de control</p>
          <h1 className="mt-3 text-h3 text-slate-950">{greeting}</h1>
          <p className="mt-2 max-w-2xl text-body-large text-slate-600">Resumen operativo del período seleccionado.</p>
        </div>
        
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div>
            <label className="block text-label text-slate-500 mb-2">Periodo de análisis</label>
            <select 
              value={range}
              onChange={(e) => setRange(e.target.value as TimeRange)}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-body-medium text-slate-950 transition hover:border-slate-300 focus:border-violet-500 focus:outline-none"
            >
              <option value="hoy">Hoy</option>
              <option value="semana">Esta Semana</option>
              <option value="mes">Este Mes</option>
              <option value="trimestre">Este Trimestre</option>
              <option value="semestre">Este Semestre</option>
              <option value="año">Este Año</option>
              <option value="todo">Histórico</option>
            </select>
          </div>
          
          <button 
            onClick={() => navigate('/tickets/registro')}
            className="rounded-lg bg-violet-600 px-6 py-2 text-button font-semibold text-white transition hover:bg-violet-700 active:bg-violet-800"
          >
            Nuevo ticket
          </button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-4">
        {dynamicStats.map((item) => (
          <MetricCard key={item.label} {...item} icon={iconMap[item.icon]} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr] items-start">
        <TicketsAreaChart data={filteredMetrics} range={range} />

        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50 h-full flex flex-col">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-label text-slate-500">Actividad reciente</p>
              <p className="mt-2 text-body-small text-slate-500">Últimas acciones en la plataforma.</p>
            </div>
            <button className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-button font-semibold text-slate-700 transition hover:bg-slate-100">
              Ver todo
            </button>
          </div>

          <div className="mt-6 space-y-4 flex-1 overflow-y-auto max-h-[320px] scrollbar-thin">
            {activities.map((item) => (
              <div key={item.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-body-medium text-slate-900">
                  <span className="font-semibold text-slate-950">{item.actor}</span> {item.action} <span className="font-semibold text-slate-950">{item.subject}</span>
                </p>
                <p className="mt-1 text-caption text-slate-500">{item.timeAgo}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
