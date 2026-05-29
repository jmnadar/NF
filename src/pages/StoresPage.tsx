import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { stores } from '../data/mock'
import { ArrowRight, LayoutGrid, List, MapPin } from 'lucide-react'

const ciudades = [...new Set(stores.map((s) => s.ciudad))]

export default function StoresPage() {
  const navigate = useNavigate()
  const [ciudad, setCiudad] = useState('')
  const [vista, setVista] = useState<'cards' | 'lista'>('cards')

  const filtradas = ciudad ? stores.filter((s) => s.ciudad === ciudad) : stores

  return (
    <div className="space-y-6">
      <div>
        <p className="text-label text-slate-500">Módulo de tiendas</p>
        <h1 className="mt-3 text-h3 font-semibold text-slate-950">Tiendas</h1>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <select
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-8 text-body-small text-slate-700 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
          >
            <option value="">Todas las ciudades</option>
            {ciudades.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1">
          <button
            onClick={() => setVista('cards')}
            className={`rounded-md p-2 transition ${vista === 'cards' ? 'bg-violet-100 text-violet-700' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setVista('lista')}
            className={`rounded-md p-2 transition ${vista === 'lista' ? 'bg-violet-100 text-violet-700' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {vista === 'cards' ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtradas.map((store) => (
            <article key={store.name} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-violet-100 text-violet-700">
                    🏬
                  </div>
                  <h2 className="text-h5 font-semibold text-slate-950">{store.name}</h2>
                  <p className="mt-1 text-body-small text-slate-500">{store.subtitle}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${store.badge}`}>{store.status}</span>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-50 px-4 py-4 text-body-medium text-slate-700">
                  <p className="text-label text-slate-400">Envíos</p>
                  <p className="mt-3 text-h3 font-semibold text-slate-950">{store.shipments}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 px-4 py-4 text-body-medium text-slate-700">
                  <p className="text-label text-slate-400">Pendientes</p>
                  <p className="mt-3 text-h3 font-semibold text-slate-950">{store.pending}</p>
                </div>
              </div>
              <button onClick={() => navigate(`/tiendas/${encodeURIComponent(store.name)}`)} className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-button font-semibold text-violet-700 transition hover:bg-violet-50">
                Ver detalle <ArrowRight className="h-4 w-4" />
              </button>
            </article>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm shadow-slate-200/50">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-label text-slate-400">
                <th className="px-5 py-3 font-medium">Nombre</th>
                <th className="px-5 py-3 font-medium">Dirección</th>
                <th className="px-5 py-3 font-medium">Ciudad</th>
                <th className="px-5 py-3 font-medium">Envíos</th>
                <th className="px-5 py-3 font-medium">Pendientes</th>
                <th className="px-5 py-3 font-medium">Estado</th>
                <th className="px-5 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {filtradas.map((store) => (
                <tr key={store.name} className="border-b border-slate-100 text-body-small text-slate-700 last:border-0">
                  <td className="px-5 py-4 font-semibold text-slate-950">{store.name}</td>
                  <td className="px-5 py-4">{store.subtitle}</td>
                  <td className="px-5 py-4">{store.ciudad}</td>
                  <td className="px-5 py-4">{store.shipments}</td>
                  <td className="px-5 py-4">{store.pending}</td>
                  <td className="px-5 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${store.badge}`}>{store.status}</span></td>
                  <td className="px-5 py-4">
                    <button onClick={() => navigate(`/tiendas/${encodeURIComponent(store.name)}`)} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-violet-700 transition hover:bg-violet-50">
                      Ver detalle <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
