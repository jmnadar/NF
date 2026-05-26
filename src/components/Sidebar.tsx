import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { PanelLeftClose, PanelLeftOpen, BookOpen } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { version } from '../../package.json'

interface SidebarItem {
  label: string
  path: string
  icon: LucideIcon
}

interface SidebarProps {
  items: SidebarItem[]
}

export default function Sidebar({ items }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-slate-950/95 text-white shadow-xl shadow-slate-900/10 transition-all duration-300 lg:sticky lg:top-0 lg:h-screen lg:bg-slate-950/100 lg:shadow-none ${
        collapsed ? 'lg:w-20' : 'lg:w-80'
      }`}
    >
      <div className={`flex ${collapsed ? 'flex-col items-center gap-3 pt-6' : 'items-center gap-3 px-6 py-6 lg:px-8'}`}>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-3xl bg-white/10 text-h4 font-semibold text-white ring-1 ring-white/10">
          S
        </div>
        {!collapsed && (
          <>
            <div className="flex-1">
              <p className="text-h4 font-semibold text-slate-400">Swimming</p>
            </div>
            <button
              onClick={() => setCollapsed(v => !v)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-white/10 hover:text-white"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          </>
        )}
        {collapsed && (
          <button
            onClick={() => setCollapsed(v => !v)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <PanelLeftOpen className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className={`space-y-1 ${collapsed ? 'mt-4 px-2' : 'px-4 lg:px-6'}`}>
        {!collapsed && <p className="pt-2 pb-3 pl-2 text-label text-slate-400">Navegación</p>}
        {items.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-3xl px-4 py-3 text-body-medium font-medium transition ${
                  collapsed ? 'justify-center' : ''
                } ${
                  isActive
                    ? 'bg-white text-slate-950 shadow-panel'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && item.label}
            </NavLink>
          )
        })}
      </div>

      {!collapsed && (
        <div className="mt-auto hidden px-6 lg:block">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-slate-300">
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 shrink-0 text-violet-400" />
              <p className="text-body-large font-semibold text-white">¿Necesitas ayuda?</p>
            </div>
            <p className="mt-2 text-body-medium leading-6">Consulta la documentación oficial de Swimming CRM.</p>
            <button
              onClick={() => {}}
              className="mt-4 w-full rounded-2xl bg-white/10 py-2 text-button font-semibold text-white transition hover:bg-white/20"
            >
              Ir a la documentación
            </button>
          </div>
          <p className="pb-6 pt-4 text-center text-caption text-slate-600">v{version}</p>
        </div>
      )}
    </aside>
  )
}
