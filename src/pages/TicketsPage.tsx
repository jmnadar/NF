import { tickets } from '../data/mock'
import { Search, SlidersHorizontal } from 'lucide-react'

function statusColor(status: string) {
  switch (status) {
    case 'Abierto':
      return 'bg-violet-100 text-violet-700'
    case 'En curso':
      return 'bg-rose-100 text-rose-700'
    case 'Pendiente':
      return 'bg-amber-100 text-amber-700'
    case 'Resuelto':
      return 'bg-emerald-100 text-emerald-700'
    case 'Cerrado':
      return 'bg-slate-100 text-slate-700'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}

export default function TicketsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-label text-slate-500">Módulo de tickets</p>
          <h1 className="mt-3 text-h3 text-slate-950">Tickets</h1>
        </div>
        <button className="inline-flex items-center justify-center rounded-lg bg-violet-700 px-5 py-3 text-button font-semibold text-white transition hover:bg-violet-800">
          + Registrar ticket
        </button>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {['Todos', 'Abiertos', 'En curso', 'Pendientes', 'Vencidos'].map((label) => (
              <button key={label} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-button font-semibold text-slate-700 transition hover:bg-slate-100">
                {label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
            <Search className="h-4 w-4 text-slate-400" />
            <input placeholder="Buscar por # o cliente..." className="w-full border-0 bg-transparent text-body-medium outline-none" />
            <button className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-button font-semibold text-slate-700 shadow-sm shadow-slate-200/50">
              <SlidersHorizontal className="h-4 w-4" /> Filtros
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3 text-left text-body-small text-slate-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-label text-slate-500">Ticket</th>
                <th className="px-4 py-3 text-label text-slate-500">Cliente</th>
                <th className="px-4 py-3 text-label text-slate-500">Motivo</th>
                <th className="px-4 py-3 text-label text-slate-500">Estado</th>
                <th className="px-4 py-3 text-label text-slate-500">Vencimiento</th>
                <th className="px-4 py-3 text-label text-slate-500">Agente</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="rounded-3xl bg-slate-50">
                  <td className="px-4 py-4 font-semibold text-slate-900">{ticket.id}</td>
                  <td className="px-4 py-4">{ticket.client}</td>
                  <td className="px-4 py-4">{ticket.reason}</td>
                  <td className="px-4 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor(ticket.status)}`}>{ticket.status}</span>
                  </td>
                  <td className="px-4 py-4 text-slate-500">{ticket.due}</td>
                  <td className="px-4 py-4">{ticket.agent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
