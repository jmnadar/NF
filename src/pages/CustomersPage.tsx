import { useState, useMemo, useEffect } from 'react'
import { ArrowRight, Mail, Phone, MapPin, LayoutGrid, List, Search } from 'lucide-react'
import { getAllCustomers } from '../data/mock'
import CustomerModal from '../components/CustomerModal'

const ITEMS_PER_PAGE = 9

export default function CustomersPage() {
  const [query, setQuery] = useState('')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<typeof allCustomers[number] | null>(null)

  const allCustomers = useMemo(() => getAllCustomers(), [])

  const filtered = useMemo(() => {
    if (!query.trim()) return allCustomers
    const q = query.toLowerCase()
    return allCustomers.filter(
      c =>
        c.name.toLowerCase().includes(q) ||
        c.owner.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.location.toLowerCase().includes(q),
    )
  }, [allCustomers, query])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const goTo = (p: number) => setPage(Math.max(1, Math.min(p, totalPages)))

  useEffect(() => {
    if (page > totalPages) setPage(Math.max(1, totalPages))
  }, [totalPages, page])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-label text-slate-500">Módulo de clientes</p>
          <h1 className="mt-3 text-h3 text-slate-950">Clientes</h1>
          <p className="mt-1 text-body-small text-slate-500">{filtered.length} registros</p>
        </div>
        <button className="inline-flex items-center justify-center rounded-lg bg-violet-700 px-5 py-3 text-button font-semibold text-white transition hover:bg-violet-800">
          + Nuevo cliente
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-2.5 shadow-sm shadow-slate-200/50 max-w-md">
          <Search className="h-4 w-4 shrink-0 text-slate-400" />
          <input
            value={query}
            onChange={e => { setQuery(e.target.value); setPage(1) }}
            placeholder="Buscar por nombre, correo o teléfono..."
            className="w-full border-0 bg-transparent text-body-medium text-slate-900 outline-none placeholder:text-slate-400"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white p-1 shadow-sm shadow-slate-200/50">
            <button
              onClick={() => setView('grid')}
              className={`rounded-md p-1.5 transition ${view === 'grid' ? 'bg-violet-100 text-violet-700' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`rounded-md p-1.5 transition ${view === 'list' ? 'bg-violet-100 text-violet-700' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="grid gap-6 xl:grid-cols-3">
          {paged.map(customer => (
            <article key={customer.name} className="flex flex-col rounded-lg border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-3xl bg-violet-100 text-h4 font-semibold text-violet-700">
                  {customer.initials}
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-h5 font-semibold text-slate-950">{customer.name}</h2>
                </div>
              </div>

              <div className="mt-5 space-y-2.5 text-body-medium text-slate-600">
                <p className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 shrink-0 text-violet-600" />
                  {customer.email}
                </p>
                <p className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 shrink-0 text-violet-600" />
                  {customer.phone}
                </p>
                <p className="flex items-center gap-2.5">
                  <MapPin className="h-4 w-4 shrink-0 text-violet-600" />
                  {customer.location}
                </p>
              </div>

              <hr className="mx-auto mt-5 w-4/5 border-slate-100" />

              <div className="mt-4 flex items-center justify-between text-body-medium font-semibold text-slate-700">
                <span>{customer.tickets} tickets</span>
                <button onClick={() => setSelected(customer)} className="inline-flex items-center gap-1.5 text-violet-700 transition hover:text-violet-900">
                  Ver perfil <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm shadow-slate-200/50">
          <table className="min-w-full text-left text-body-small text-slate-700">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-4 py-3 text-label text-slate-500">Cliente</th>
                <th className="px-4 py-3 text-label text-slate-500">Contacto</th>
                <th className="px-4 py-3 text-label text-slate-500">Ubicación</th>
                <th className="px-4 py-3 text-label text-slate-500">Tickets</th>
                <th className="px-4 py-3 text-label text-slate-500" />
              </tr>
            </thead>
            <tbody>
              {paged.map(customer => (
                <tr key={customer.name} className="border-b border-slate-50 transition hover:bg-slate-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-caption font-semibold text-violet-700">
                        {customer.initials}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{customer.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 shrink-0 text-violet-600" />
                      {customer.email}
                    </p>
                    <p className="mt-0.5 flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 shrink-0 text-violet-600" />
                      {customer.phone}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-violet-600" />
                      {customer.location}
                    </p>
                  </td>
                  <td className="px-4 py-4 font-semibold text-slate-900">{customer.tickets}</td>
                  <td className="px-4 py-4">
                    <button onClick={() => setSelected(customer)} className="inline-flex items-center gap-1 text-button font-semibold text-violet-700 transition hover:text-violet-900">
                      Ver perfil <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => goTo(page - 1)}
            disabled={page <= 1}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-button font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Anterior
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => goTo(p)}
              className={`min-w-[36px] rounded-lg px-3 py-2 text-button font-semibold transition ${
                p === page
                  ? 'bg-violet-700 text-white shadow-sm'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => goTo(page + 1)}
            disabled={page >= totalPages}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-button font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      )}

      {selected && (
        <CustomerModal customer={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
