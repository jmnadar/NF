import { useState } from 'react'
import { account, preferences, users } from '../data/mock'

const tabs = ['Perfil', 'Seguridad', 'Preferencias', 'Usuarios', 'Comunicaciones'] as const

type TabKey = (typeof tabs)[number]

function TabButton({ label, active, onClick }: { label: TabKey; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-lg px-4 py-3 text-left text-button font-semibold transition ${
        active ? 'bg-violet-700 text-white' : 'text-slate-700 hover:bg-slate-100'
      }`}
    >
      {label}
    </button>
  )
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('Perfil')

  return (
    <div className="space-y-6">
      <div>
        <p className="text-label text-slate-500">Ajustes</p>
        <h1 className="mt-3 text-h3 font-semibold text-slate-950">Configuración</h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
        <div className="space-y-2 rounded-lg border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/50">
          {tabs.map((tab) => (
            <TabButton key={tab} label={tab} active={activeTab === tab} onClick={() => setActiveTab(tab)} />
          ))}
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
          {activeTab === 'Perfil' && (
            <div className="space-y-6">
              <div>
                <p className="text-label text-slate-500">Perfil</p>
                <p className="mt-2 text-body-small text-slate-600">Actualiza tu información personal y avatar.</p>
              </div>
              <div className="flex flex-col gap-6 rounded-lg border border-slate-200 bg-slate-50 p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-700 text-h4 font-semibold text-white">MA</div>
                  <div className="flex items-center gap-3">
                    <button className="rounded-lg bg-white px-4 py-2 text-button font-semibold text-violet-700 ring-1 ring-violet-200">Cambiar foto</button>
                    <button className="text-button font-semibold text-rose-600">Eliminar</button>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-body-medium text-slate-700">
                    <span>Nombre completo</span>
                    <input className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-violet-500" defaultValue={account.name} />
                  </label>
                  <label className="space-y-2 text-body-medium text-slate-700">
                    <span>Correo electrónico</span>
                    <input className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-violet-500" defaultValue={account.email} />
                  </label>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-body-medium text-slate-700">
                    <span>Teléfono</span>
                    <input className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-violet-500" defaultValue={account.phone} />
                  </label>
                  <label className="space-y-2 text-body-medium text-slate-700">
                    <span>Cargo</span>
                    <input className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-violet-500" defaultValue={account.position} />
                  </label>
                </div>
                <div className="flex justify-end gap-3">
                  <button className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-button font-semibold text-slate-700">Cancelar</button>
                  <button className="rounded-lg bg-violet-700 px-5 py-3 text-button font-semibold text-white hover:bg-violet-800">Guardar cambios</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Seguridad' && (
            <div className="space-y-6">
              <div>
                <p className="text-label text-slate-500">Seguridad</p>
                <p className="mt-2 text-body-small text-slate-600">Protege tu cuenta con contraseña fuerte y autenticación en dos pasos.</p>
              </div>
              <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-6">
                <label className="space-y-2 text-body-medium text-slate-700">
                  <span>Contraseña actual</span>
                  <input type="password" className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-violet-500" />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-body-medium text-slate-700">
                    <span>Nueva contraseña</span>
                    <input type="password" className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-violet-500" />
                  </label>
                  <label className="space-y-2 text-body-medium text-slate-700">
                    <span>Confirmar contraseña</span>
                    <input type="password" className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-violet-500" />
                  </label>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white px-4 py-4 text-body-medium text-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Autenticación en dos pasos (2FA)</p>
                        <p className="text-body-small text-slate-500">Añade una capa extra con un código temporal de tu app autenticadora.</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" className="peer sr-only" defaultChecked />
                      <div className="h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-violet-700"></div>
                      <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition peer-checked:translate-x-5"></div>
                    </label>
                  </div>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-4 text-body-medium text-slate-700">
                  <p className="font-semibold">Sesiones activas</p>
                  <div className="mt-3 space-y-3">
                    {['Chrome · macOS · CDMX', 'Safari · iPhone · CDMX', 'Edge · Windows · Monterrey'].map((item) => (
                      <div key={item} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <div>
                          <p className="font-semibold text-slate-900">{item}</p>
                          <p className="text-caption text-slate-500">{item.includes('Hace') ? item : item.includes('Monterrey') ? 'Hace 3 d' : 'Activa ahora'}</p>
                        </div>
                        <button className="text-button font-semibold text-rose-600">Cerrar sesión</button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end">
                  <button className="rounded-lg bg-violet-700 px-5 py-3 text-button font-semibold text-white hover:bg-violet-800">Actualizar seguridad</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Preferencias' && (
            <div className="space-y-6">
              <div>
                <p className="text-label text-slate-500">Preferencias</p>
                <p className="mt-2 text-body-small text-slate-600">Personaliza idioma, zona horaria y notificaciones.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-body-medium text-slate-700">
                  <span>Idioma</span>
                  <select className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-violet-500" defaultValue={preferences.locale}>
                    <option>Español (MX)</option>
                  </select>
                </label>
                <label className="space-y-2 text-body-medium text-slate-700">
                  <span>Zona horaria</span>
                  <select className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-violet-500" defaultValue={preferences.timezone}>
                    <option>GMT-6 · Ciudad de México</option>
                  </select>
                </label>
                <label className="space-y-2 text-body-medium text-slate-700">
                  <span>Formato de fecha</span>
                  <select className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-violet-500" defaultValue={preferences.dateFormat}>
                    <option>DD/MM/AAAA</option>
                  </select>
                </label>
                <label className="space-y-2 text-body-medium text-slate-700">
                  <span>Moneda</span>
                  <select className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-violet-500" defaultValue={preferences.currency}>
                    <option>MXN — Peso</option>
                  </select>
                </label>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-body-medium text-slate-700">
                <p className="font-semibold">Notificaciones</p>
                <div className="mt-4 space-y-3">
                  {Object.entries(preferences.notifications).map(([label, enabled]) => (
                    <label key={label} className="flex items-center justify-between rounded-3xl bg-white px-4 py-3">
                      <span>{label === 'assignedTickets' ? 'Nuevos tickets asignados' : label === 'upcomingDeadlines' ? 'Tickets próximos a vencer' : label === 'commentsMentions' ? 'Comentarios y menciones' : 'Resumen semanal por correo'}</span>
                      <input type="checkbox" className="h-4 w-4 accent-violet-700" defaultChecked={enabled} />
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <button className="rounded-lg bg-violet-700 px-5 py-3 text-button font-semibold text-white hover:bg-violet-800">Guardar preferencias</button>
              </div>
            </div>
          )}

          {activeTab === 'Usuarios' && (
            <div className="space-y-6">
              <div>
                <p className="text-label text-slate-500">Usuarios</p>
                <p className="mt-2 text-body-small text-slate-600">Invita, asigna roles y gestiona permisos del equipo.</p>
              </div>
              <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between gap-4 pb-4">
                  <p className="text-body-medium font-semibold text-slate-900">Lista de usuarios</p>
                  <button className="rounded-lg bg-violet-700 px-5 py-3 text-button font-semibold text-white hover:bg-violet-800">Invitar usuario</button>
                </div>
                <table className="min-w-full text-left text-body-small text-slate-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-label text-slate-500">Nombre</th>
                      <th className="px-4 py-3 text-label text-slate-500">Correo</th>
                      <th className="px-4 py-3 text-label text-slate-500">Rol</th>
                      <th className="px-4 py-3 text-label text-slate-500">Estado</th>
                      <th className="px-4 py-3 text-label text-slate-500">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.email} className="border-t border-slate-200">
                        <td className="px-4 py-4 font-semibold text-slate-900">{user.name}</td>
                        <td className="px-4 py-4">{user.email}</td>
                        <td className="px-4 py-4">{user.role}</td>
                        <td className="px-4 py-4">
                          <span className={`rounded-full px-3 py-1 text-caption font-semibold ${user.status === 'Activo' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>{user.status}</span>
                        </td>
                        <td className="px-4 py-4 text-violet-700">Editar</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'Comunicaciones' && (
            <div className="space-y-6">
              <div>
                <p className="text-label text-slate-500">Comunicaciones</p>
                <p className="mt-2 text-body-small text-slate-600">Configura canales, marcas y plantillas de mensajes.</p>
              </div>
              <div className="grid gap-4 xl:grid-cols-2">
                {[
                  { title: 'WhatsApp Business', status: 'Conectado' },
                  { title: 'Correo electrónico', status: 'Conectado' },
                  { title: 'SMS', status: 'No conectado' },
                  { title: 'Webchat', status: 'No conectado' },
                ].map((item) => (
                  <div key={item.title} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-950">{item.title}</p>
                        <p className="mt-1 text-body-small text-slate-500">{item.title.includes('SMTP') ? 'SMTP saliente y respuestas.' : item.title.includes('WhatsApp') ? 'Conecta tu número oficial.' : item.title.includes('Webchat') ? 'Widget para el sitio web.' : 'Notificaciones por mensaje de texto.'}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-caption font-semibold ${item.status === 'Conectado' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>{item.status}</span>
                    </div>
                    <button className="mt-5 rounded-lg bg-white px-4 py-2 text-button font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-100">
                      {item.status === 'Conectado' ? 'Administrar' : 'Conectar'}
                    </button>
                  </div>
                ))}
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <p className="font-semibold text-slate-900">Plantillas rápidas</p>
                <div className="mt-4 space-y-3 text-body-medium text-slate-700">
                  {['Acuse de recibo de ticket', 'Solicitud de información adicional', 'Resolución y cierre'].map((item) => (
                    <div key={item} className="flex items-center justify-between rounded-3xl bg-white px-4 py-3">
                      <span>{item}</span>
                      <button className="text-button font-semibold text-violet-700">Editar</button>
                    </div>
                  ))}
                </div>
                <button className="mt-4 rounded-lg bg-transparent px-4 py-3 text-button font-semibold text-violet-700 transition hover:bg-violet-50">+ Nueva plantilla</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
