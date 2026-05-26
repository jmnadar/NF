import { stores } from '../data/mock'
import { ArrowRight } from 'lucide-react'

export default function StoresPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-label text-slate-500">Módulo de tiendas</p>
          <h1 className="mt-3 text-h3 font-semibold text-slate-950">Tiendas</h1>
        </div>
        <button className="inline-flex items-center justify-center rounded-lg bg-violet-700 px-5 py-3 text-button font-semibold text-white transition hover:bg-violet-800">
          + Nueva tienda
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {stores.map((store) => (
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
            <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-button font-semibold text-violet-700 transition hover:bg-violet-50">
              Ver detalle <ArrowRight className="h-4 w-4" />
            </button>
          </article>
        ))}
      </div>
    </div>
  )
}
