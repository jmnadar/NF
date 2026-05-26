# Swim CRM — Especificación Completa de la Interfaz de Usuario (UI)

> **Documento creado para:** Agente IA constructor de frontend (Lovable u otro)
> **Versión del CRM:** v1.8.0
> **Fecha:** 2026-05-15
> **Objetivo:** Describir con máximo detalle cada componente, funcionalidad, flujo y decisión de diseño de la UI del CRM Swim para permitir su reconstrucción fiel.

---

## Tabla de Contenidos

1. [Stack Tecnológico](#1-stack-tecnológico)
2. [Arquitectura General de la UI](#2-arquitectura-general-de-la-ui)
3. [Sistema de Ruteo y Navegación](#3-sistema-de-ruteo-y-navegación)
4. [Sistema de Diseño Visual](#4-sistema-de-diseño-visual)
5. [TopBar (Barra Superior)](#5-topbar-barra-superior)
6. [Sidebar (Barra Lateral)](#6-sidebar-barra-lateral)
7. [Dashboard (Panel de Control)](#7-dashboard-panel-de-control)
8. [Módulo de Clientes](#8-módulo-de-clientes)
9. [Módulo de Tickets](#9-módulo-de-tickets)
10. [Módulo de Tiendas](#10-módulo-de-tiendas)
11. [Módulo de Configuraciones](#11-módulo-de-configuraciones)
12. [Módulo de Autenticación](#12-módulo-de-autenticación)
13. [Gestión de Estado Global](#13-gestión-de-estado-global)
14. [Servicios y Comunicación con Backend](#14-servicios-y-comunicación-con-backend)
15. [Sistema de Notificaciones](#15-sistema-de-notificaciones)
16. [Sistema de Comunicaciones (Email y WhatsApp)](#16-sistema-de-comunicaciones-email-y-whatsapp)
17. [Manejo de Temas (Light/Dark)](#17-manejo-de-temas-lightdark)
18. [Consideraciones para Reconstrucción](#18-consideraciones-para-reconstrucción)

---

## 1. Stack Tecnológico

### Frontend

| Tecnología | Versión | Propósito |
|---|---|---|
| **React** | 18.3.1 | Biblioteca principal de UI |
| **TypeScript** | 5.7.2 | Tipado estático |
| **Vite** | 6.0.5 | Bundler y dev server |
| **React Router DOM** | 6.28.0 | Enrutamiento del lado del cliente |
| **NextUI** | 2.4.8 | Sistema de componentes UI (botones, modales, tablas, cards, inputs, etc.) |
| **Tailwind CSS** | 3.4.17 | Framework de CSS utility-first |
| **Framer Motion** | 11.11.17 | Animaciones y transiciones |
| **Recharts** | 3.7.0 | Gráficos y visualización de datos (AreaChart) |
| **Zustand** | 5.0.2 | Gestión de estado global (stores) |
| **Axios** | 1.15.2 | Cliente HTTP para comunicación con API REST |
| **date-fns** | 4.1.0 | Manipulación y formateo de fechas |
| **Sileo** | 0.1.4 | Sistema de notificaciones toast |
| **ESLint** | 9.17.0 | Linting de código |

### Backend (referencia)

| Tecnología | Propósito |
|---|---|
| Node.js + Express + TypeScript | API REST |
| Microsoft SQL Server | Base de datos principal |
| JWT + Cookies HttpOnly | Autenticación segura |
| Zod | Validación de esquemas |
| Winston + Morgan | Logging estructurado |
| Helmet | Hardening de servidor |
| Resend API | Envío de correos electrónicos |

### Infraestructura

| Tecnología | Propósito |
|---|---|
| Docker + Docker Compose | Contenedorización y orquestación |
| Nginx | Servidor web + proxy reverso + soporte SPA |
| GitHub Actions | CI/CD (deploy automático vía SSH) |

---

## 2. Arquitectura General de la UI

### Estructura de Directorios del Frontend

```
frontend/src/
├── App.tsx                          # Componente raíz con ruteo
├── main.tsx                         # Punto de entrada
├── index.css                        # Estilos globales + Tailwind
├── components/
│   └── icons/                       # Iconos personalizados
├── config/
│   ├── assets.ts                    # URLs centralizadas de assets (logo, avatars)
│   ├── axios.ts                     # Configuración del cliente Axios (con credentials)
│   ├── storage.ts                   # Configuración de almacenamiento local
│   └── supabase.ts                  # Configuración legacy de Supabase
├── modules/
│   ├── admin/                       # Módulo de configuraciones
│   │   ├── layouts/
│   │   │   └── ConfiguracionLayout.tsx   # Layout con sub-navegación lateral
│   │   └── pages/
│   │       ├── CommsConfigPage.tsx       # Configuración de comunicaciones
│   │       ├── PreferencesPage.tsx       # Preferencias del sistema
│   │       ├── ProfilePage.tsx           # Perfil del usuario
│   │       ├── SecurityPage.tsx          # Seguridad (cambio de contraseña)
│   │       └── UserManagementPage.tsx    # Gestión de usuarios
│   ├── auth/                        # Módulo de autenticación
│   │   ├── components/
│   │   │   └── ProtectedRoute.tsx        # Guard de rutas protegidas
│   │   ├── pages/
│   │   │   ├── ForgotPasswordPage.tsx    # Recuperación de contraseña
│   │   │   ├── LoginPage.tsx             # Inicio de sesión
│   │   │   ├── RegisterPage.tsx          # Registro (primer usuario = super_admin)
│   │   │   └── ResetPasswordPage.tsx     # Reset de contraseña
│   │   ├── store/
│   │   │   └── authStore.ts              # Zustand store de autenticación
│   │   └── types/                        # Tipos TypeScript de auth
│   ├── casos/                       # Módulo de tickets
│   │   ├── components/
│   │   │   ├── ImageLightbox.tsx         # Visor de imágenes a pantalla completa
│   │   │   ├── SharedTicketModal.tsx     # Modal reutilizable de detalle de ticket
│   │   │   ├── TicketClosureModal.tsx    # Modal de cierre de ticket con resolución
│   │   │   └── TicketFileUpload.tsx      # Componente de carga de archivos
│   │   └── pages/
│   │       ├── TicketListPage.tsx        # Listado de tickets con filtros
│   │       └── TicketRegistrationPage.tsx # Formulario de registro/edición de tickets
│   ├── clientes/                    # Módulo de clientes
│   │   ├── components/
│   │   │   └── CustomerDetailDrawer.tsx  # Panel lateral deslizable de detalle
│   │   └── pages/
│   │       └── CustomerListPage.tsx      # Directorio de clientes (cards + lista)
│   ├── dashboard/                   # Módulo del dashboard principal
│   │   ├── components/
│   │   │   ├── DashboardLayout.tsx       # Layout principal (TopBar + Sidebar + Outlet)
│   │   │   └── Sidebar.tsx               # Barra lateral de navegación
│   │   └── pages/
│   │       └── DashboardPage.tsx         # Panel de control con KPIs y gráficos
│   └── tienda/                      # Módulo de tiendas
│       ├── components/
│       │   ├── EntregaEvidenciaModal.tsx # Modal de evidencia de entrega
│       │   ├── GuiaPedidoModal.tsx       # Modal de creación de guía + pedidos
│       │   └── TiendaModal.tsx           # Modal de creación/edición de tienda
│       ├── pages/
│       │   ├── TiendaDetailPage.tsx      # Detalle de tienda individual
│       │   ├── TiendaEnviosPage.tsx      # Gestión de envíos (vista SPTienda)
│       │   ├── TiendaListPage.tsx        # Listado de tiendas con tabs
│       │   └── TiendaTicketsPage.tsx     # Tickets filtrados por tienda
│       ├── services/                     # Servicios específicos de tienda
│       ├── store/
│       │   └── tiendaStore.ts            # Zustand store de tiendas
│       └── types/                        # Tipos TypeScript de tienda
├── services/
│   ├── emailService.ts              # Servicio de envío de emails (Resend)
│   └── storageService.ts            # Servicio de almacenamiento de archivos
└── shared/
    ├── constants/
    │   └── ticketConstants.ts       # Constantes de motivos, ciudades, marcas
    ├── store/
    │   └── themeStore.ts            # Zustand store de tema (light/dark)
    └── utils/
        └── dateUtils.ts             # Utilidades de fechas (deadlines, business days)
```

### Patrón de Layout Principal

La aplicación usa un **layout anidado** con React Router:

1. **Rutas públicas** (`/login`, `/register`, `/forgot-password`, `/reset-password`): Sin layout, cada página es independiente.
2. **Rutas protegidas** (`/dashboard/*`): Envueltas en `ProtectedRoute` que verifica autenticación.
3. **DashboardLayout**: Contiene `Sidebar` (izquierda) + `TopBar` (arriba) + `<Outlet />` (contenido principal).
4. **ConfiguracionLayout**: Sub-layout dentro de configuraciones con navegación lateral propia.

---

## 3. Sistema de Ruteo y Navegación

### Rutas Públicas

| Ruta | Componente | Descripción |
|---|---|---|
| `/login` | `LoginPage` | Formulario de inicio de sesión con email/password. Incluye toggle de visibilidad de contraseña y enlace a forgot-password. |
| `/register` | `RegisterPage` | Registro del primer usuario (automáticamente `super_admin`). Campos: nombre completo, email, password. |
| `/forgot-password` | `ForgotPasswordPage` | Formulario para solicitar reset de contraseña vía email. |
| `/reset-password` | `ResetPasswordPage` | Formulario para establecer nueva contraseña usando token de reset. |

### Rutas Protegidas (bajo `/dashboard`)

| Ruta | Componente | Descripción |
|---|---|---|
| `/dashboard` | `DashboardPage` | Panel de control principal con KPIs y gráficos. |
| `/dashboard/configuracion` | `ConfiguracionLayout` | Layout con sub-navegación. Redirige a `/perfil` por defecto. |
| `/dashboard/configuracion/perfil` | `ProfilePage` | Edición de perfil, avatar y datos personales. |
| `/dashboard/configuracion/seguridad` | `SecurityPage` | Cambio de contraseña. |
| `/dashboard/configuracion/preferencias` | `PreferencesPage` | Preferencias del sistema. |
| `/dashboard/configuracion/usuarios` | `UserManagementPage` | CRUD de usuarios, invitaciones, roles y permisos (solo admin/super_admin). |
| `/dashboard/configuracion/comunicaciones` | `CommsConfigPage` | Gestión de marcas, números WhatsApp, emails y plantillas (solo super_admin). |
| `/dashboard/tickets` | `TicketListPage` | Tabla de tickets con filtros por estado, motivo y tiempo. |
| `/dashboard/tickets/registro` | `TicketRegistrationPage` | Formulario unificado de registro de cliente + ticket. Soporta modo edición vía `location.state`. |
| `/dashboard/clientes` | `CustomerListPage` | Directorio de clientes en vista de tarjetas o lista. |
| `/dashboard/tiendas` | `TiendaListPage` | Listado de tiendas con tabs (tiendas + tickets). |
| `/dashboard/tiendas/:id` | `TiendaDetailPage` | Detalle de tienda con info, guías y pedidos. |
| `/dashboard/envios` | `EnviosRouter` | Router condicional: `TiendaEnviosPage` para SPTienda, `TiendaListPage` para otros roles. |

### Redirecciones

| Ruta Origen | Ruta Destino | Condición |
|---|---|---|
| `/` | `/dashboard` | Siempre |
| `*` | `/dashboard` | Ruta no encontrada |
| `/dashboard/configuracion` | `/dashboard/configuracion/perfil` | Sub-ruta por defecto |

---

## 4. Sistema de Diseño Visual

### Paleta de Colores

| Elemento | Light Mode | Dark Mode |
|---|---|---|
| Fondo de app | `#F1F5F9` (slate-100) | `#000000` (black) |
| Fondo de cards/paneles | `#FFFFFF` (white) | `#030712` (gray-950) |
| Borde de cards/paneles | `#E5E7EB` (gray-200) | `#1F2937` (gray-800) |
| Texto principal | `#1F2937` (gray-800) | `#F9FAFB` (gray-50) |
| Texto secundario | `#6B7280` (gray-500) | `#9CA3AF` (gray-400) |
| Color primario (brand) | `#2563EB` (blue-600) | `#2563EB` (blue-600) |
| Gradiente de marca | `from-blue-600 to-blue-800` | Igual |
| Acento de éxito | `#22C55E` (green-500) | Igual |
| Acento de advertencia | `#F97316` (orange-500) | Igual |
| Acento de peligro | `#EF4444` (red-500) | Igual |

### Tipografía

| Elemento | Familia | Tamaño | Peso |
|---|---|---|---|
| Títulos principales | `font-sans` (system) | `text-xl` (20px) | `font-bold` (700) |
| Títulos de sección | `font-sans` | `text-2xl` (24px) | `font-bold` + `italic` |
| Subtítulos | `font-sans` | `text-xs` (12px) | `font-medium` (500) |
| Labels de KPIs | `font-sans` | `text-[11px]` | `font-bold` + `uppercase` |
| Texto de tablas | `font-sans` | `text-sm` (14px) | `font-medium` |
| Texto monoespaciado | `font-mono` | `text-[11px]` | Normal |
| Items de sidebar | `font-sans` | `text-[13px]` | `font-medium` |
| Header de admin | `font-sans` | `text-[14px]` | `font-bold` + `uppercase` + `tracking-widest` |

### Bordes y Sombras

| Elemento | Border Radius | Sombra |
|---|---|---|
| Cards principales | `rounded-[1.25rem]` (20px) | `shadow-sm` |
| Cards de KPIs | `rounded-xl` (12px) | `shadow-sm` + hover `shadow-md` |
| Botones | `rounded-lg` (8px) o `radius="lg"` | `boxShadow` con transiciones de escala |
| Inputs | `rounded-[1.25rem]` (full en TopBar search) | `shadow-none` |
| Sidebar | `rounded-[1.25rem]` | `shadow-sm` |
| Modales | `rounded-[1.25rem]` | `shadow-2xl` |
| Dropdowns | `rounded-[1.25rem]` | `shadow-xl` |

### Espaciado

| Contexto | Padding | Gap |
|---|---|---|
| Layout principal | `p-4` con `gap-4` | — |
| Contenido de páginas | `p-8` | `space-y-6` |
| Cards internas | `p-6` | `gap-4` |
| Formularios | `gap-6` entre campos | Grid `gap-6` |
| Sidebar items | `px-3 py-2.5` | `space-y-1` |
| TopBar | `px-6 py-3` | `gap-3` |

### Iconografía

Se utilizan **SVG inline** con estilo Heroicons (stroke-based, `strokeWidth={2}`). Cada icono tiene:
- `fill="none"`, `stroke="currentColor"`, `viewBox="0 0 24 24"`
- Transiciones de color y escala en hover
- Tamaños: `w-4 h-4` (16px), `w-5 h-5` (20px)

---

## 5. TopBar (Barra Superior)

### Ubicación y Estructura

El TopBar está integrado dentro de `DashboardLayout.tsx` como el `<header>` del layout principal.

**Contenedor:**
- Flex horizontal con `justify-between`
- Fondo blanco (light) / gray-950 (dark)
- Border radius: `rounded-[1.25rem]`
- Sombra: `shadow-sm`
- Borde: `border border-gray-200 dark:border-gray-800`
- Padding: `px-6 py-3`
- Gap entre secciones: `gap-4`

### Componentes del TopBar (de izquierda a derecha)

#### 5.1 Barra de Búsqueda Global

- **Componente:** `Input` de NextUI
- **Tamaño:** `sm`
- **Variant:** `bordered`
- **Radius:** `full` (pill shape)
- **Ancho máximo:** `max-w-xs` (320px)
- **Placeholder:** "Buscar..."
- **Icono inicial:** Lupa (SVG search icon, `w-4 h-4`, color `gray-400`)
- **Estilos custom:**
  - Fondo: `bg-gray-50/50 dark:bg-gray-900`
  - Borde: `border-gray-200 dark:border-gray-800`
  - Hover: `hover:border-blue-400`
  - Focus: `group-data-[focus=true]:border-blue-500`
  - Transición: `transition-colors`
- **Funcionalidad:** Actualmente es visual placeholder. No implementa búsqueda global funcional en el TopBar (la búsqueda se realiza dentro de cada módulo individualmente).

#### 5.2 Toggle de Tema (Light/Dark)

- **Componente:** `Button` de NextUI
- **Tipo:** `isIconOnly`, `variant="light"`, `size="sm"`
- **Icono dinámico:**
  - Si `theme === 'light'`: Icono de luna (modo oscuro)
  - Si `theme === 'dark'`: Icono de sol (modo claro)
- **Color:** `text-gray-500 hover:text-gray-900`
- **Función:** Llama a `toggleTheme()` del `useThemeStore()`
- **Persistencia:** El tema se guarda en localStorage vía Zustand

#### 5.3 Centro de Notificaciones (Campana)

- **Componente:** Botón custom con dropdown manual (no usa NextUI Dropdown)
- **Icono:** Campana (bell icon, `w-4 h-4`)
- **Badge de contador:**
  - Posición: `absolute -top-1 -right-1`
  - Tamaño mínimo: `min-w-[18px] h-[18px]`
  - Color: `bg-red-500 text-white`
  - Tipografía: `text-[10px] font-bold`
  - Forma: `rounded-full`
  - Visible solo cuando `nearExpiryTickets.length > 0 || notificacionesTienda.length > 0`
  - Muestra la suma de ambos tipos de notificaciones

**Dropdown de Notificaciones:**
- **Posición:** `absolute right-0 top-10`
- **Ancho:** `w-96` (384px)
- **Fondo:** `bg-white dark:bg-gray-950`
- **Border radius:** `rounded-[1.25rem]`
- **Sombra:** `shadow-xl`
- **Z-index:** `z-50`
- **Altura máxima del contenido:** `max-h-80` con scroll vertical

**Secciones del Dropdown:**

1. **Header del dropdown:**
   - Título: "Notificaciones" (`text-sm font-bold`)
   - Badge de contador total (`text-xs bg-red-100 text-red-600`)
   - Botón "Limpiar tienda" (solo si hay notificaciones de tienda)

2. **Sección "Tiendas"** (si `notificacionesTienda.length > 0`):
   - Label: `text-[10px] font-bold uppercase text-gray-400 tracking-wider`
   - Fondo: `bg-gray-50 dark:bg-gray-900`
   - Cada notificación incluye:
     - Indicador circular de color (`w-2 h-2 rounded-full`):
       - `bg-green-500` para `paquete_entregado`
       - `bg-blue-500` para `guia_recibida`
     - Título (`text-sm font-semibold`)
     - Mensaje (`text-xs text-gray-500`)
     - Timestamp formateado (`text-[10px] text-gray-400`, formato `HH:mm - dd MMM`)
     - Botón de dismiss (X) que aparece en hover (`opacity-0 group-hover:opacity-100`)
   - Click en notificación: Navega a la ruta correspondiente y marca como leída

3. **Sección "Tickets por vencer"** (si `nearExpiryTickets.length > 0`):
   - Label: igual que sección Tiendas
   - Cada ticket incluye:
     - Indicador circular de color según urgencia:
       - `bg-red-500` si venció (`days < 0`)
       - `bg-orange-500` si vence hoy (`days === 0`)
       - `bg-yellow-400` si vence pronto (`days > 0`)
     - Número de ticket (`text-sm font-semibold truncate uppercase`)
     - Nombre del cliente (`text-xs text-gray-500 truncate`)
     - Texto de vencimiento (`text-xs font-medium` con color según urgencia):
       - "Venció hace X día(s)" (rojo)
       - "Vence hoy" (naranja)
       - "Vence en X día(s)" (amarillo)
   - Click en ticket: Navega a `/dashboard/tickets?q={ticket_numero}`

4. **Estado vacío:**
   - Icono de check grande (`w-10 h-10`, opacidad 20%)
   - Texto: "Sin notificaciones pendientes"

**Polling:** Las notificaciones se actualizan cada 5 minutos (`setInterval` de 300000ms).

**Permisos:** Las notificaciones de tienda solo se muestran si el usuario tiene el permiso `recibir_notificaciones_tienda` (verificado vía API).

#### 5.4 Separador Vertical

- **Elemento:** `div` con `w-[1px] h-6 bg-gray-200 dark:bg-gray-800 mx-1`

#### 5.5 Menú de Usuario (Avatar + Dropdown)

- **Componente:** `Dropdown` de NextUI con `placement="bottom-end"`
- **Trigger:** Botón custom con:
  - Avatar (`Avatar` de NextUI, `size="md"`):
    - Muestra `user?.avatar_url` o fallback con initials
    - Ring: `ring-2 ring-transparent group-hover:ring-blue-100`
    - Sombra: `shadow-sm`
  - Info del usuario (visible en pantallas `md+`):
    - Nombre: `text-[13px] font-bold text-gray-900 dark:text-gray-100`
    - Rol: `text-[10px] text-gray-400 font-medium`
    - Labels de rol:
      - `super_admin` → "Súper Administrador"
      - `admin` → "Administrador"
      - `SPTienda` → "Tienda"
      - Otro → "Usuario"
  - Hover: `hover:bg-gray-100 dark:hover:bg-gray-800`
  - Border en hover: `hover:border-gray-200 dark:hover:border-gray-700`
  - Border radius: `rounded-full`

**Dropdown Menu:**
- **Variant:** `flat`
- **Padding:** `p-2`
- **Items:**
  1. **Header de perfil** (`h-14`, borde inferior):
     - Nombre completo (`font-semibold text-[13px]`)
     - Email (`text-[11px] text-gray-500`)
  2. **Configuración:**
     - Icono: engranaje (`w-4 h-4`)
     - Navega a `/dashboard/configuracion`
  3. **Cerrar sesión:**
     - Color: `danger`
     - Icono: logout (`w-4 h-4`)
     - Llama a `handleSignOut()` → `api.post('/auth/logout')` → `navigate('/login')`

---

## 6. Sidebar (Barra Lateral)

### Ubicación y Estructura

El Sidebar está en `Sidebar.tsx` y es renderizado dentro de `DashboardLayout.tsx`.

**Contenedor:**
- `<aside>` con `flex flex-col`
- Fondo: `bg-white dark:bg-gray-950`
- Border radius: `rounded-[1.25rem]`
- Borde: `border border-gray-200 dark:border-gray-800`
- Sombra: `shadow-sm`
- Transición de ancho: `transition-all duration-500 ease-in-out`
- **Ancho expandido:** `w-64` (256px)
- **Ancho colapsado:** `w-20` (80px)

### Componentes del Sidebar

#### 6.1 Header con Logo

- **Expandido:**
  - Logo imagen (`h-8 w-auto object-contain`) + texto "Swim CRM"
  - Texto: `text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent`
  - Gap: `gap-2`
- **Colapsado:**
  - Solo logo imagen centrada (`flex justify-center w-full`)

#### 6.2 Botón de Toggle (Colapsar/Expandir)

- **Ubicación:** Debajo del header, `px-4 mb-4`
- **Estilo:**
  - Fondo: `bg-gray-50 dark:bg-gray-900`
  - Borde: `border border-gray-100 dark:border-gray-800`
  - Hover: `hover:border-blue-400 hover:bg-blue-50/30`
  - Border radius: `rounded-xl`
- **Icono:** Flecha doble (`<<`), rota 180° cuando está colapsado (`rotate-180`)
- **Transición del icono:** `transition-all duration-300`

#### 6.3 Navegación Principal

- **Contenedor:** `<nav>` con `flex-1 overflow-y-auto px-4 space-y-6`
- **Secciones:**
  1. **Menú Principal** (siempre visible)
  2. **Administración** (solo para roles con acceso)

#### 6.4 Items del Menú Principal (por rol)

**Para `super_admin` y `admin`:**

| Orden | Título | Ruta | Icono |
|---|---|---|---|
| 1 | Dashboard | `/dashboard` | Casa (home) |
| 2 | Registrar Ticket | `/dashboard/tickets/registro` | Más (+) en círculo |
| 3 | Tiendas | `/dashboard/tiendas` | Edificio (building) |
| 4 | Tickets | `/dashboard/tickets` | Documentos apilados |
| 5 | Clientes | `/dashboard/clientes` | Grupo de personas |

**Para `SPTienda`:**

| Orden | Título | Ruta | Icono |
|---|---|---|---|
| 1 | Dashboard | `/dashboard` | Casa (home) |
| 2 | Tickets | `/dashboard/tickets` | Documentos apilados |
| 3 | Registrar Ticket | `/dashboard/tickets/registro` | Más (+) en círculo |
| 4 | Envíos | `/dashboard/envios` | Camión (truck) |

**Para usuario regular (sin rol especial):**

| Orden | Título | Ruta | Icono |
|---|---|---|---|
| 1 | Dashboard | `/dashboard` | Casa (home) |
| 2 | Tiendas | `/dashboard/tiendas` | Edificio (building) |
| 3 | Tickets | `/dashboard/tickets` | Documentos apilados |
| 4 | Registrar Ticket | `/dashboard/tickets/registro` | Más (+) en círculo |

#### 6.5 Sección "Administración"

- **Visible para:** `admin`, `super_admin`, `SPTienda`
- **Header:** `text-[14px] font-bold text-gray-400 uppercase tracking-widest` (solo visible cuando expandido)
- **Items:**

| Título | Ruta | Icono |
|---|---|---|
| Configuración | `/dashboard/configuracion` | Engranaje (settings) |

#### 6.6 Estilo de Items de Navegación

- **Contenedor de cada item:** `flex items-center gap-3 px-3 py-2.5 rounded-xl`
- **Estado activo:**
  - Fondo: `bg-blue-600`
  - Texto: `text-white`
  - Sombra: `shadow-md`
  - Indicador: punto blanco (`w-1.5 h-1.5 rounded-full bg-white/40`) a la derecha
- **Estado inactivo:**
  - Texto: `text-gray-600 dark:text-gray-400`
  - Hover: `hover:bg-gray-50 dark:hover:bg-gray-900`
- **Icono:** `transition-transform group-hover:scale-110`
- **Texto:** `text-[13px] font-medium` (solo visible cuando expandido)
- **Colapsado:** `justify-center px-0` + `title` attribute con tooltip nativo

---

## 7. Dashboard (Panel de Control)

### Página: `DashboardPage.tsx`

#### 7.1 Header del Dashboard

- **Layout:** Flex con `justify-between`, responsive (`flex-col md:flex-row`)
- **Izquierda:**
  - Título: "Panel de Control" (`text-xl font-bold`)
  - Subtítulo: "Bienvenido, {nombre}" (`text-xs text-gray-500`)
- **Derecha:**
  - **Selector de Período** (`Select` de NextUI):
    - Label: "Periodo"
    - Size: `sm`
    - Variant: `bordered`
    - Opciones: Hoy, Esta Semana, Este Mes, Este Año, Histórico Todo
    - Valores: `hoy`, `semana`, `mes`, `año`, `todo`
    - Default: `todo`

#### 7.2 Grid de KPIs (6 tarjetas)

- **Layout:** `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4`
- **Cada StatCard contiene:**
  - Label (`text-[11px] text-gray-400 uppercase font-bold tracking-wider`)
  - Valor (`text-xl lg:text-2xl font-bold`) o Spinner si loading
  - Icono de métrica (`p-2 rounded-lg` con color de fondo temático)
  - Hover: `hover:shadow-md transition-shadow`

| KPI | Color | Icono Background | Dato |
|---|---|---|---|
| Clientes | blue | `bg-blue-50 dark:bg-blue-900/10` | Count de clientes únicos |
| Abiertos | orange | `bg-orange-50 dark:bg-orange-900/10` | Tickets con estado != "Cerrado" |
| Cerrados | green | `bg-green-50 dark:bg-green-900/10` | Tickets con estado = "Cerrado" |
| Por Vencer | red | `bg-red-50 dark:bg-red-900/10` | Tickets próximos a vencer (5 días) |
| Tiemp. Prom. | purple | `bg-purple-50 dark:bg-purple-900/10` | Tiempo promedio de respuesta (horas/días) |
| Mas Común | teal | `bg-teal-50 dark:bg-teal-900/10` | Motivo de contacto más frecuente |

#### 7.3 Sección de Gráficos

- **Layout:** `grid grid-cols-1 lg:grid-cols-2 gap-6`

**Gráfico 1: Tendencia de Tickets**
- **Tipo:** AreaChart (Recharts)
- **Datos:** Tickets agrupados por fecha de creación
- **Estilo:**
  - Gradiente de fill: `#3b82f6` con opacidad decreciente
  - Grid: `CartesianGrid` con líneas punteadas, sin verticales
  - Ejes: Sin líneas, sin tick marks, fuente 10px
  - Tooltip: `borderRadius: 12px`, sin borde, con sombra
  - Línea: `strokeWidth: 2`, tipo `monotone`
- **Altura:** 250px
- **Loading:** Spinner centrado

**Gráfico 2: Distribución por Estado**
- **Tipo:** Barras de progreso horizontales
- **Contenido:**
  - Barra "Abiertos" (azul `bg-blue-500`)
  - Barra "Cerrados" (verde `bg-green-500`)
- **Cada barra muestra:**
  - Label y count con porcentaje (`text-xs font-semibold`)
  - Barra de progreso (`h-1.5`, fondo `bg-gray-100 dark:bg-gray-800`)
  - Fill animado (`transition-all duration-1000`)

#### 7.4 Lógica de Datos

- **Endpoint:** `GET /tickets/dashboard/stats?range={range}`
- **Respuesta:** `{ customers, openTickets, closedTickets, nearExpiry, commonRes, avgTimeRes, chartRes }`
- **Cálculos:**
  - Tiempo promedio: Promedio de diferencia entre `fecha_creacion_ticket` y `updated_at` de tickets cerrados
  - Motivo más común: Primer elemento de `commonRes` traducido con `translateReason()`
  - Datos del gráfico: Agrupación por fecha (`toLocaleDateString('es-CO')`)

---

## 8. Módulo de Clientes

### Página: `CustomerListPage.tsx`

#### 8.1 Header

- **Título:** "Directorio de Clientes" (`text-xl font-bold`)
- **Subtítulo:** "Base de datos de fidelización" + Chip con count de activos (`Chip size="sm" variant="flat" color="primary"`)

#### 8.2 Barra de Controles

- **Layout:** Flex responsive con gap-3
- **Controles (de izquierda a derecha):**

1. **Toggle de Vista** (`Tabs` de NextUI):
   - Variant: `bordered`, color: `primary`
   - Opciones: Icono de grid (cards) / Icono de lista (list)
   - Estado: `viewMode` (`'card'` o `'list'`)

2. **Filtro Tipo de Tienda** (`Select`):
   - Placeholder: "Tipo de Tienda"
   - Size: `sm`, variant: `bordered`
   - Opciones: "Todas", "Sin Tienda", + valores dinámicos de `tipos_comercio`
   - Estado: `storeFilter`

3. **Tabs de Estado** (`Tabs`):
   - Variant: `underlined`, color: `primary`
   - Opciones: "Activos" / "Bajas"
   - Estado: `activeTab`

4. **Búsqueda** (`Input`):
   - Placeholder: "Buscar por nombre o cédula..."
   - Size: `sm`, variant: `bordered`
   - Icono: Lupa
   - MaxLength: 100
   - Búsqueda en tiempo real (useMemo)

#### 8.3 Vista de Tarjetas (Card View)

- **Layout:** `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4`
- **Cada Card:**
  - **Presionable** (`isPressable`): Abre el `CustomerDetailDrawer`
  - **Estado baja:** `opacity-70 grayscale-[0.5]`
  - **CardBody superior:**
    - Avatar (`size="lg"`): Color `bg-primary/10 text-primary` (activo) o `bg-gray-200 text-gray-400` (baja)
    - Nombre: `font-bold text-sm truncate uppercase`
    - Cédula: `text-[11px] text-gray-400 font-mono`
    - Tienda creadora: `text-[10px] font-semibold` con color según tipo:
      - Ecommerce: `text-purple-600`
      - Tienda Física: `text-orange-500`
  - **CardBody medio:**
    - Teléfono con icono
    - Ciudad con icono (truncate)
  - **CardFooter:**
    - Chip de tickets: `Chip size="sm" variant="flat" color="primary"` con texto "{count} TICKETS"
    - Botones de acción (con `onClick={e => e.stopPropagation()}`):
      - **Editar:** Icono lápiz (azul)
      - **Nuevo Ticket:** Icono más (verde) → Navega a registro con cédula prellenada
      - **Dar de Baja:** Icono basura (rojo) → Confirmación modal
      - **Restaurar** (solo en bajas): Icono refresh (verde)

#### 8.4 Vista de Lista (List View)

- **Componente:** `Table` de NextUI
- **Columnas:** CLIENTE, CONTACTO, UBICACIÓN, ORIGEN, TICKETS, ACCIONES
- **Filas:** Mismos datos que las cards pero en formato tabular
- **Estado baja:** `opacity-50`
- **Chip de tickets:** Clickable → abre drawer

#### 8.5 Customer Detail Drawer

- **Tipo:** Panel lateral deslizable desde la derecha
- **Ancho:** `max-w-[480px]`, full height
- **Overlay:** `bg-black/30 backdrop-blur-[2px] z-40`
- **Animación:** `animate-slide-in-right`
- **Z-index:** `z-50`

**Header del Drawer:**
- Gradiente: `from-blue-600 to-blue-500`
- Avatar del cliente (`size="lg"`, fondo blanco semitransparente)
- Nombre (uppercase, truncate)
- Cédula (font-mono)
- Chip de tienda creadora (si aplica)
- Botón de cierre (X)

**Sección de Info Rápida:**
- Grid 2 columnas con 4 items:
  - Teléfono, Email, Ciudad, Tickets
  - Cada uno con icono SVG azul y label uppercase

**Sección de Comunicación:**
- **Tabs internos:** Email / WhatsApp / Llamada (deshabilitado, "Próximamente")
- **Tab Email:**
  - Select de marca remitente
  - Select de plantilla (opcional, filtrado por marca)
  - Input de asunto
  - Textarea de mensaje (minRows=4)
  - Info de placeholders disponibles
  - Botón "Enviar Correo" (disabled si no hay email)
- **Tab WhatsApp:**
  - Select de marca (muestra número configurado o "Sin número")
  - Select de plantilla (opcional)
  - Textarea de mensaje
  - Botón "Abrir WhatsApp" (abre `wa.me/{phone}?text={msg}`)
  - Warning si cliente no tiene teléfono

**Sección de Historial de Tickets:**
- Lista de tickets del cliente
- Cada ticket: número (azul), fecha, motivo, chip de estado
- Click en ticket → Abre `SharedTicketModal`

#### 8.6 Modal de Edición de Cliente

- **Size:** `3xl`
- **Header:** "Editar Información de Cliente" (italic + blue accent)
- **Campos (grid 3 columnas):**
  - Identificación (ID)
  - Nombres (required)
  - Apellidos (required)
  - Teléfono
  - Email
  - Ciudad (Select)
  - Tipo de Origen (Select)
  - Dirección (spans 2 columnas)
- **Footer:** Cancelar (danger) / Guardar Cambios (primary, loading state)

#### 8.7 Modal de Confirmación (Acciones Destructivas)

- **Size:** `sm`
- **Header:** Icono de advertencia (rojo) + título
- **Body:** Mensaje de confirmación
- **Footer:** Cancelar / Confirmar (danger)

#### 8.8 Funcionalidades Clave

| Función | Descripción | Permiso |
|---|---|---|
| Buscar clientes | Filtrado en tiempo real por nombre/apellido/cédula | Todos |
| Toggle vista | Cambiar entre cards y lista | Todos |
| Filtrar por tipo | Filtrar por origen de comercio | Todos |
| Tabs Activos/Bajas | Ver clientes activos o dados de baja | Todos |
| Ver detalle | Abrir drawer con info, comunicación e historial | Todos |
| Editar cliente | Modal con todos los campos editables | Todos |
| Dar de baja | Borrado lógico (`deleted_at`) | admin, super_admin |
| Restaurar cliente | Revertir borrado lógico | admin, super_admin |
| Nuevo ticket | Navegar a registro con cédula prellenada | Todos |
| Enviar email | Enviar correo vía Resend | Todos |
| Abrir WhatsApp | Abrir wa.me con mensaje prellenado | Todos |

---

## 9. Módulo de Tickets

### Página: `TicketListPage.tsx`

#### 9.1 Header

- **Título:** "Listado de Tickets" (`text-xl font-bold`)
- **Subtítulo:** "Visualiza y filtra todos los casos registrados"
- **Botón:** "Refrescar" (recarga datos)

#### 9.2 Panel de Filtros

- **Componente:** `Card` con `grid grid-cols-1 md:grid-cols-4 gap-4`
- **Filtros:**

| Filtro | Componente | Opciones |
|---|---|---|
| Buscar | Input con lupa | N° Ticket o Cliente (search en tiempo real) |
| Estado | Select | Todos + estados dinámicos de BD |
| Motivo | Select | Todos + motivos traducidos |
| Tiempo | Select | Todo el tiempo, Hoy, Últimos 7 días, Últimos 30 días |

#### 9.3 Tabla de Tickets

- **Componente:** `Table` de NextUI
- **Columnas:**

| Columna | Contenido |
|---|---|
| TICKET | Número (azul, bold) + N° pedido (gris) |
| CLIENTE | Nombre + cédula |
| MARCA | Nombre de marca |
| MOTIVO | Motivo traducido (uppercase) |
| ESTADO | Chip con color según estado |
| CREADOR | Nombre del creador (italic) |
| CREACIÓN | Fecha formateada (dd/MM/yyyy) |
| LÍMITE | Fecha límite formateada |

- **Colores de estado:**
  - Abierto: `primary` (azul)
  - En Proceso: `warning` (naranja)
  - Cerrado: `success` (verde)
  - Cancelado: `danger` (rojo)
  - Default: `default` (gris)

- **Interacción:** Click en fila → Abre `SharedTicketModal`
- **Auto-open:** Si viene parámetro `?q=` en URL y coincide exactamente con un ticket, abre el modal automáticamente

#### 9.4 SharedTicketModal

- **Tipo:** Modal centrado con overlay
- **Z-index:** `z-[100]` overlay, `z-[101]` contenido
- **Ancho:** `max-w-3xl`
- **Altura:** `max-h-[85vh]`
- **Animación:** `animate-in fade-in zoom-in duration-200`

**Header:**
- Número de ticket (azul, uppercase) + Badge de estado
- Nombre del cliente + cédula
- Botón de cierre (X)

**Contenido (scrollable):**
- **Grid de información (2 columnas):**
  - Motivo, Fecha Creación, Marca, Fecha Límite, Agente Asignado, Creado por, Referencia, N° Pedido
- **Descripción:** Texto en caja con fondo gris
- **Archivos Adjuntos:**
  - Grid de thumbnails (2-3 columnas)
  - Imágenes: click abre `ImageLightbox`
  - PDFs: link abre en nueva pestaña
  - Botón de eliminar (solo admin/super_admin)

**Footer:**
- Botón "Cerrar Ticket" (solo si no está cerrado) → Abre `TicketClosureModal`
- Botón "Editar" → Navega a registro en modo edición
- Botón "Eliminar" (solo admin/super_admin) → Confirmación + delete

#### 9.5 TicketRegistrationPage

- **Tipo:** Formulario unificado de registro de cliente + ticket
- **Previsualización:** Muestra el próximo número de ticket basado en la marca seleccionada
- **Campos de cliente:** Nombre, apellido, cédula, teléfono, email, ciudad, dirección
- **Campos de ticket:** Marca, motivo, sub-motivo, referencia, N° pedido, descripción, agente asignado, fecha de compra, valor de compra, solución esperada
- **Fecha límite:** Calculada automáticamente según motivo de contacto
- **Modo edición:** Se activa vía `location.state.editTicketId`

#### 9.6 TicketClosureModal

- **Tipo:** Modal para cerrar tickets con resolución detallada
- **Campos:** Tipo de resolución, notas de crédito, nuevos pedidos, CST, descripción de solución
- **Validación:** Requiere al menos un tipo de resolución

#### 9.7 ImageLightbox

- **Tipo:** Visor de imágenes a pantalla completa
- **Contenido:** Imagen ampliada + nombre del archivo
- **Cierre:** Click fuera o botón X

---

## 10. Módulo de Tiendas

### Página: `TiendaListPage.tsx`

#### 10.1 Header

- **Título:** "Módulo de Tiendas" (`text-2xl font-bold italic` con "Tiendas" en blue)
- **Subtítulo:** "Gestiona tus perfiles de tienda y seguimiento de envíos."
- **Filtro:** Select de ciudad (dinámico basado en tiendas registradas)

#### 10.2 Tabs del Módulo

- **Componente:** `Tabs` de NextUI con `variant="underlined"`
- **Tabs:**
  1. **Tiendas:** Icono de edificio + chip con count
  2. **Tickets:** Icono de ticket → Renderiza `TiendaTicketsPage` inline

#### 10.3 Vista de Tiendas (Cards)

- **Layout:** `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- **Cada Card:**
  - **Presionable:** Navega a `/dashboard/tiendas/:id`
  - **Hover:** `hover:scale-[1.02]`
  - **Estilo:** `bg-blue-50/30 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800`
  - **Header:**
    - Icono de edificio en caja blanca con sombra
    - Nombre de tienda (bold)
    - Ciudad + Marca (gris)
    - Chip de estado: "Activa" (primary) o "Pendiente de Activación" (warning)
  - **Body:**
    - Dirección con icono
    - Teléfono con icono
- **Estado vacío:** Caja con borde dashed + texto "No hay tiendas registradas."

#### 10.4 TiendaDetailPage

- **Contenido:**
  - Info de la tienda (nombre, marca, ciudad, dirección, teléfono, email, bodega)
  - Historial de guías de envío en tabla interactiva
  - Botón para registrar nueva guía → Abre `GuiaPedidoModal`

#### 10.5 TiendaTicketsPage

- **Contenido:** Tabla de tickets filtrados por tienda
- **Filtros:** Por tienda, estado y motivo
- **Traducción:** Motivos traducidos automáticamente con `translateReason()`

#### 10.6 TiendaEnviosPage

- **Visible para:** Rol `SPTienda` (vía `EnviosRouter`)
- **Contenido:**
  - Lista de guías de envío
  - Checkboxes para marcar paquetes como entregados
  - Estados operativos: pendiente, recibido, completo
  - Carga de evidencias (fotos/PDF)
  - Actualizaciones optimistas

#### 10.7 Modales del Módulo

**TiendaModal:**
- Formulario de creación/edición de tienda
- Campos: nombre, marca, número de bodega, ciudad (select con ciudades de Colombia), dirección, teléfono, email

**GuiaPedidoModal:**
- Registro combinado de guía + pedidos
- Campos: número de guía, notas
- Lista dinámica de pedidos (agregar/eliminar con chips)
- Notificación automática por email al email de la tienda

**EntregaEvidenciaModal:**
- Carga de evidencias de entrega (fotos/PDF)
- Almacenamiento local en servidor (no Supabase)

---

## 11. Módulo de Configuraciones

### Layout: `ConfiguracionLayout.tsx`

#### 11.1 Estructura

- **Header:**
  - Título: "Configuración del Sistema" (`text-2xl font-bold italic` con "del Sistema" en blue)
  - Subtítulo: "Personaliza tu perfil y gestiona los accesos de Swim CRM."

- **Layout de 2 columnas:** `grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8`
  - **Sidebar izquierdo (240px):** Sub-navegación
  - **Contenido derecho:** `<Outlet />`

#### 11.2 Sub-navegación

| Item | Ruta | Icono | Visible para |
|---|---|---|---|
| Mi Perfil | `/dashboard/configuracion/perfil` | Persona | Todos |
| Gestión Usuarios | `/dashboard/configuracion/usuarios` | Grupo de personas | admin, super_admin |
| Comunicaciones | `/dashboard/configuracion/comunicaciones` | Chat/mensaje | super_admin |
| Seguridad | `/dashboard/configuracion/seguridad` | Candado | Todos |
| Preferencias | `/dashboard/configuracion/preferencias` | Layout/grid | Todos |

- **Item activo:** `bg-blue-600 text-white shadow-md shadow-blue-100`
- **Item inactivo:** `text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900`
- **Estilo:** `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm`

#### 11.3 ProfilePage

- **Avatar Selector:**
  - 4 avatares predefinidos (URLs de Supabase Storage)
  - Avatar actual grande con ring azul
  - Avatares disponibles con hover scale + check indicator
- **Campos:**
  - Nombre Completo (Input, size lg)
  - Correo Electrónico (Input, size lg)
  - Nombre de la Tienda (solo para SPTienda, en caja azul destacada)
- **Botón:** "Guardar Perfil" (primary, loading state)

#### 11.4 SecurityPage

- Cambio de contraseña
- Campo de contraseña actual
- Campo de nueva contraseña
- Campo de confirmación
- Toggle de visibilidad de contraseña

#### 11.5 PreferencesPage

- Preferencias del sistema (configuración específica según implementación)

#### 11.6 UserManagementPage

- **Tabla de usuarios** con:
  - Nombre, email, rol, estado de invitación
  - Acciones: editar permisos, cambiar rol, eliminar
- **Botón de invitar usuario:**
  - Modal con: email, nombre completo, rol, permisos personalizados, nombre de tienda (para SPTienda)
  - Flujo: Invitación Auth → Creación de Perfil → Asignación de Roles y Permisos

#### 11.7 CommsConfigPage

- **Solo para super_admin**
- **Gestión de marcas:**
  - Nombre de marca
  - Número de WhatsApp
  - Email remitente
  - Teléfono de soporte
- **CRUD de plantillas de comunicación:**
  - Filtros por marca y canal (email/whatsapp)
  - Campos: nombre, tipo, asunto (email), contenido
  - Placeholders: `{{nombre}}`, `{{apellido}}`, `{{cedula}}`, `{{telefono}}`
- **Configuración de Resend:**
  - API key con enmascaramiento (`type="password"`)
  - Toggle de visibilidad
  - Botón de eliminar/limpiar

---

## 12. Módulo de Autenticación

### 12.1 LoginPage

- Formulario de inicio de sesión
- Campos: email, password (con toggle de visibilidad)
- Botón: "Iniciar Sesión"
- Enlace: "¿Olvidaste tu contraseña?" → `/forgot-password`
- Enlace: "Registrarse" → `/register` (solo si es primer usuario)
- Validación de errores del backend

### 12.2 RegisterPage

- Formulario de registro del primer usuario
- Campos: nombre completo, email, password (con toggle de visibilidad), confirmar password
- Botón: "Registrarse"
- El primer usuario se convierte automáticamente en `super_admin`
- Verificación de primer usuario vía `GET /auth/first-user`

### 12.3 ForgotPasswordPage

- Campo: email
- Botón: "Enviar enlace de recuperación"
- Envía email con token de reset vía Resend

### 12.4 ResetPasswordPage

- Campos: nueva contraseña, confirmar contraseña
- Usa token de la URL para validar
- Botón: "Establecer nueva contraseña"

### 12.5 ProtectedRoute

- Verifica autenticación vía `useAuthStore`
- Si no autenticado: redirige a `/login`
- Si autenticado: renderiza `<Outlet />`

---

## 13. Gestión de Estado Global

### 13.1 authStore (Zustand)

**Estado:**
```typescript
{
  user: User | null
  loading: boolean
  error: string | null
  _profileLoaded: boolean
}
```

**Acciones:**
| Acción | Descripción | Endpoint |
|---|---|---|
| `signIn(email, password)` | Login → carga perfil completo | `POST /auth/login`, `GET /auth/me` |
| `signUp(email, password, fullName)` | Registro → carga perfil | `POST /auth/register`, `GET /auth/me` |
| `signOut()` | Logout → limpia cookie | `POST /auth/logout` |
| `resetPassword(email)` | Solicita reset | `POST /auth/forgot-password` |
| `updatePassword(password, token?)` | Cambia contraseña | `POST /auth/reset-password` o `PUT /users/:id/password` |
| `checkFirstUser()` | Verifica si es primer usuario | `GET /auth/first-user` |
| `fetchRoles()` | Obtiene roles | `GET /roles` |
| `fetchPermissions()` | Obtiene permisos | `GET /permissions` |
| `fetchUsers()` | Obtiene usuarios | `GET /users` |
| `inviteUser(email, fullName, roleId, permissions?, storeName?)` | Invita usuario | `POST /users/invite` |
| `fetchUserPermissions(userId)` | Obtiene permisos de usuario | `GET /users/:id/permissions` |
| `updateUserPermissions(userId, permissionIds)` | Actualiza permisos | `PUT /users/:id/permissions` |
| `updateProfile(data)` | Actualiza perfil | `PUT /users/:id/profile` |
| `deleteUserProfile(userId)` | Elimina usuario | `DELETE /users/:id` |
| `updateUserRole(userId, roleId)` | Cambia rol | `PUT /users/:id/role` |
| `loadCurrentUser()` | Carga usuario actual | `GET /auth/me` |

**Inicialización:** `loadCurrentUser()` se ejecuta al iniciar la app

### 13.2 themeStore (Zustand)

**Estado:**
```typescript
{
  theme: 'light' | 'dark'
}
```

**Acciones:**
| Acción | Descripción |
|---|---|
| `toggleTheme()` | Alterna entre light y dark |

**Persistencia:** localStorage

### 13.3 tiendaStore (Zustand)

**Estado:**
```typescript
{
  tiendas: Tienda[]
  marcas: Marca[]
  loading: boolean
  loadingGuias: boolean
  updating: boolean
  creating: boolean
  error: string | null
}
```

**Acciones:**
| Acción | Descripción | Endpoint |
|---|---|---|
| `fetchTiendas()` | Obtiene tiendas | `GET /tiendas` |
| `fetchMarcas()` | Obtiene marcas | `GET /marcas` |
| `createTienda(tienda)` | Crea tienda | `POST /tiendas` |
| `updateTienda(id, updates)` | Actualiza tienda | `PUT /tiendas/:id` |
| `fetchGuias(tiendaId)` | Obtiene guías | `GET /guias/tienda/:id` |
| `createGuia(guia)` | Crea guía | `POST /guias` |
| `createPedido(pedido)` | Crea pedido | `POST /pedidos` |
| `createGuiaWithPedidos(tiendaId, email, guiaData, pedidos)` | Crea guía + pedidos + notifica | `POST /guias`, `POST /notifications/guia` |
| `updatePedidoStatus(pedidoId, status, guiaId)` | Actualiza estado de pedido | `PUT /guias/pedido/:id` |
| `updateGuiaStatus(guiaId, status)` | Actualiza estado de guía | `PUT /guias/:id/status` |

---

## 14. Servicios y Comunicación con Backend

### 14.1 Axios Configuration (`config/axios.ts`)

- **Base URL:** Configurada vía variable de entorno
- **Credentials:** `withCredentials: true` (para cookies HttpOnly)
- **Interceptors:**
  - Request: Añade headers necesarios
  - Response: Manejo global de errores

### 14.2 Endpoints Principales

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/auth/login` | Login |
| POST | `/auth/register` | Registro |
| POST | `/auth/logout` | Logout |
| GET | `/auth/me` | Perfil actual |
| POST | `/auth/forgot-password` | Solicitar reset |
| POST | `/auth/reset-password` | Reset con token |
| GET | `/tickets` | Listar tickets (con filtros) |
| GET | `/tickets/:id` | Detalle de ticket |
| POST | `/tickets` | Crear ticket |
| PUT | `/tickets/:id` | Actualizar ticket |
| DELETE | `/tickets/:id` | Eliminar ticket |
| GET | `/tickets/lookups` | Lookups (motivos, estados, ciudades, marcas, tipos_comercio) |
| GET | `/tickets/dashboard/stats` | Stats del dashboard |
| GET | `/customers` | Listar clientes |
| GET | `/customers/:id/tickets` | Tickets de un cliente |
| PUT | `/customers/:id` | Actualizar cliente |
| DELETE | `/customers/:id` | Dar de baja cliente |
| PUT | `/customers/:id/restore` | Restaurar cliente |
| GET | `/tiendas` | Listar tiendas |
| POST | `/tiendas` | Crear tienda |
| PUT | `/tiendas/:id` | Actualizar tienda |
| GET | `/guias/tienda/:id` | Guías de una tienda |
| POST | `/guias` | Crear guía |
| PUT | `/guias/:id/status` | Actualizar estado de guía |
| PUT | `/guias/pedido/:id` | Actualizar estado de pedido |
| GET | `/notifications/unread` | Notificaciones no leídas |
| PUT | `/notifications/:id/read` | Marcar como leída |
| PUT | `/notifications/read-all` | Marcar todas como leídas |
| GET | `/comms/marcas` | Marcas con config de comunicaciones |
| GET | `/comms/templates` | Plantillas de comunicación |
| POST | `/comms/send-email` | Enviar email |
| GET | `/users` | Listar usuarios |
| POST | `/users/invite` | Invitar usuario |
| GET | `/users/:id/permissions` | Permisos de usuario |
| PUT | `/users/:id/permissions` | Actualizar permisos |
| PUT | `/users/:id/profile` | Actualizar perfil |
| PUT | `/users/:id/password` | Cambiar contraseña |
| PUT | `/users/:id/role` | Cambiar rol |
| DELETE | `/users/:id` | Eliminar usuario |
| GET | `/roles` | Listar roles |
| GET | `/permissions` | Listar permisos |
| GET | `/auth/first-user` | Verificar primer usuario |
| GET | `/files/download/:filename` | Descarga segura de archivos |

### 14.3 storageService

- `fetchTicketFiles(ticketId)`: Obtiene archivos adjuntos de un ticket
- `deleteTicketFile(fileId, storagePath, provider)`: Elimina archivo
- `uploadEvidence(...)`: Carga evidencias de entrega

### 14.4 emailService

- Envío de correos vía Resend API
- Plantillas HTML dinámicas
- Patrón adaptador (ResendProvider + MockSMTPProvider)

---

## 15. Sistema de Notificaciones

### Tipos de Notificaciones

| Tipo | Descripción | Color | Navegación |
|---|---|---|---|
| `guia_recibida` | Guía recibida en tienda | Azul (`bg-blue-500`) | `/dashboard/envios` |
| `paquete_entregado` | Paquete entregado | Verde (`bg-green-500`) | `/dashboard/envios` |
| `ticket_asignado` | Ticket asignado a agente | Según urgencia | `/dashboard/tickets?q={numero}` |
| `nueva_guia` | Nueva guía creada | Según urgencia | `/dashboard/envios` |

### Tickets Próximos a Vencer

- **Criterio:** Tickets con `fecha_limite_respuesta` dentro de 5 días
- **Colores de urgencia:**
  - Rojo: Vencido (`days < 0`)
  - Naranja: Vence hoy (`days === 0`)
  - Amarillo: Vence pronto (`days > 0`)

### Polling

- Actualización automática cada 5 minutos
- Verificación de permisos: `recibir_notificaciones_tienda`

---

## 16. Sistema de Comunicaciones (Email y WhatsApp)

### 16.1 Email (Resend)

- **Endpoint:** `POST /comms/send-email`
- **Payload:** `{ to, subject, html }`
- **Plantillas:**
  - Almacenadas en `dbo.config_comunicaciones`
  - Soporte para placeholders: `{{nombre}}`, `{{apellido}}`, `{{nombre_completo}}`, `{{cedula}}`, `{{telefono}}`
  - Interpolación automática con datos del cliente
- **Remitente:** Configurado por marca en `dbo.marcas`

### 16.2 WhatsApp

- **Método:** Enlace `wa.me/{phone}?text={message}`
- **Número:** Configurado por marca en `dbo.marcas`
- **Plantillas:** Mismo sistema de placeholders que email
- **Apertura:** Nueva pestaña del navegador

### 16.3 Plantillas Dinámicas

- **Filtrado:** Por marca y canal (email/whatsapp)
- **Variables disponibles:**
  - `{{nombre}}` → Nombre del cliente
  - `{{apellido}}` → Apellido del cliente
  - `{{nombre_completo}}` → Nombre completo
  - `{{cedula}}` → Cédula del cliente
  - `{{telefono}}` → Teléfono del cliente

---

## 17. Manejo de Temas (Light/Dark)

### Implementación

- **Store:** `themeStore.ts` (Zustand)
- **Persistencia:** localStorage
- **Toggle:** Botón en TopBar
- **Clases Tailwind:**
  - Light: clases normales
  - Dark: prefijo `dark:`

### Diferencias Visuales

| Elemento | Light | Dark |
|---|---|---|
| Fondo app | `#F1F5F9` | `#000000` |
| Fondo paneles | `#FFFFFF` | `#030712` |
| Bordes | `#E5E7EB` | `#1F2937` |
| Texto principal | `#1F2937` | `#F9FAFB` |
| Texto secundario | `#6B7280` | `#9CA3AF` |
| Sombras | `rgba(0,0,0,0.1)` | `rgba(0,0,0,0.5)` |

---

## 18. Consideraciones para Reconstrucción

### 18.1 Patrones de Diseño Utilizados

1. **Feature-based architecture:** Módulos separados por dominio (admin, auth, casos, clientes, dashboard, tienda)
2. **Lazy loading:** Todas las páginas se cargan con `React.lazy()` + `Suspense`
3. **Container/Presentational:** Layouts separados de páginas
4. **Custom hooks:** Lógica extraída en hooks cuando es reutilizable
5. **Zustand stores:** Estado global separado por dominio

### 18.2 Convenciones de Código

- **Imports:** Alias configurados (`@modules/`, `@config/`, `@shared/`, `@services/`)
- **Naming:** PascalCase para componentes, camelCase para funciones/variables
- **Tipado:** Interfaces TypeScript para todos los datos
- **Estilos:** Tailwind CSS con clases utility-first
- **Componentes NextUI:** Usar consistentemente los componentes de NextUI en lugar de HTML nativo

### 18.3 Dependencias Críticas

```json
{
  "@nextui-org/react": "^2.4.8",
  "react-router-dom": "^6.28.0",
  "zustand": "^5.0.2",
  "axios": "^1.15.2",
  "recharts": "^3.7.0",
  "framer-motion": "^11.11.17",
  "date-fns": "^4.1.0",
  "sileo": "^0.1.4",
  "tailwindcss": "^3.4.17"
}
```

### 18.4 Configuración de Tailwind

- **Content:** `./src/**/*.{js,ts,jsx,tsx}`
- **Plugins:** NextUI plugin
- **Dark mode:** `class` (activado por clase en HTML)

### 18.5 Configuración de Vite

- **Alias:** `@modules/`, `@config/`, `@shared/`, `@services/`
- **Plugins:** `@vitejs/plugin-react`
- **Build:** `tsc && vite build`

### 18.6 Variables de Entorno Requeridas

```env
VITE_API_URL=http://localhost:3001/api
VITE_SITE_URL=http://localhost:5173
```

### 18.7 Notas Importantes para el Agente Constructor

1. **NextUI es el sistema de componentes principal.** No usar Material-UI, Chakra ni otros.
2. **Tailwind CSS** se usa para todo el styling custom.
3. **Zustand** maneja TODO el estado global (no Redux, no Context API).
4. **Axios** es el cliente HTTP (no fetch nativo).
5. **Las cookies HttpOnly** manejan la autenticación (no localStorage para tokens).
6. **El diseño es consistente** con border-radius de `1.25rem` (20px) en elementos principales.
7. **El tema dark** se activa con la clase `dark` en el elemento HTML.
8. **Los iconos son SVG inline** estilo Heroicons.
9. **Las animaciones** usan Framer Motion y clases de Tailwind `animate-*`.
10. **Las notificaciones toast** usan la librería Sileo.
11. **Los gráficos** usan Recharts (AreaChart específicamente).
12. **Las fechas** se manejan con date-fns (no moment.js).
13. **El ruteo** usa React Router DOM v6 con nested routes.
14. **Lazy loading** es obligatorio para todas las páginas.
15. **TypeScript** es estricto — todos los tipos deben estar definidos.

### 18.8 Estructura de Roles y Permisos

| Rol | Dashboard | Clientes | Tickets | Tiendas | Envíos | Configuración | Usuarios | Comunicaciones |
|---|---|---|---|---|---|---|---|---|
| super_admin | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| admin | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| SPTienda | ✓ (filtrado) | ✗ | ✓ (propios) | ✓ | ✓ | ✓ (parcial) | ✗ | ✗ |
| user | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ (parcial) | ✗ | ✗ |

### 18.9 Sistema de Base de Datos (Referencia)

- **Motor:** Microsoft SQL Server
- **Tablas principales:** 26 tablas
- **Seguridad:** Row-Level Security (RLS) con `SESSION_CONTEXT`
- **Autenticación:** JWT + Cookies HttpOnly + Bcrypt
- **Auditoría:** Tabla `audit_log` con IP, user-agent y detalles JSON

### 18.10 Flujo de Autenticación

1. Usuario ingresa email/password en LoginPage
2. Backend valida credenciales → Setea cookie HttpOnly con JWT
3. Frontend llama a `GET /auth/me` para obtener perfil completo
4. Perfil se almacena en `authStore`
5. `ProtectedRoute` verifica autenticación antes de renderizar rutas protegidas
6. Logout llama a `POST /auth/logout` para limpiar cookie

### 18.11 Flujo de Registro de Tickets

1. Usuario navega a `/dashboard/tickets/registro`
2. Formulario unificado muestra campos de cliente + ticket
3. Selecciona marca → Se muestra próximo número de ticket
4. Completa datos del cliente (o busca existente por cédula)
5. Completa datos del ticket (motivo, descripción, etc.)
6. Fecha límite se calcula automáticamente según motivo
7. Submit → Crea cliente (si nuevo) + ticket en transacción
8. Notificaciones automáticas si hay agente asignado

### 18.12 Flujo de Comunicaciones

1. Usuario abre CustomerDetailDrawer de un cliente
2. Selecciona tab Email o WhatsApp
3. Selecciona marca remitente
4. Opcionalmente selecciona plantilla
5. Placeholders se interpolan con datos del cliente
6. Email: Envía vía `POST /comms/send-email` → Resend
7. WhatsApp: Abre `wa.me` en nueva pestaña

---

## Apéndice A: Constantes del Sistema

### Motivos de Contacto

| Código | Label |
|---|---|
| `change_size` | Cambio de Talla |
| `change_reference` | Cambio de Referencia |
| `warranty` | Garantía |
| `return` | Devolución |
| `coordinator_update` | Novedad Coordinadora |
| `pqr` | PQR |
| `advice` | Asesoría |
| `balance_favor` | Saldo a Favor |

### Sub-motivos de Novedad Coordinadora

- Cambio de destino
- Cambio de dirección
- Retraso
- Devolución
- Hurto
- Pérdida

### Marcas

- Speedo
- O'Neill

### Tipos de Comercio

- Tienda Física
- Ecommerce

---

## Apéndice B: Reglas de Cálculo de Fechas Límite

| Motivo | Regla |
|---|---|
| `advice` (Asesoría) | Sin fecha límite (null) |
| `coordinator_update` + "Hurto"/"Pérdida" | 30 días calendario |
| Todos los demás | 15 días hábiles |

---

## Apéndice C: Historial de Versiones Relevante para UI

| Versión | Cambios UI Significativos |
|---|---|
| v1.8.0 | Refactorización de estados de tickets, limpieza de código |
| v1.7.0 | Formulario unificado de tickets, previsualización dinámica de número, protección de API keys |
| v1.6.0 | RLS para SPTienda, KPIs seguros por tienda |
| v1.5.0 | Cookies HttpOnly, Helmet, CORS, descarga segura de archivos, Zod validation, logging |
| v1.4.0 | Customer Detail Drawer, centro de comunicaciones, configuración admin de comunicaciones |
| v1.3.0 | Origen de comercio, directorio de clientes con toggle cards/lista, filtros por tipo de tienda |
| v1.2.0 | Asignación de agentes, notificaciones automatizadas, plantillas dinámicas |
| v1.1.0-B | Migración completa a API REST, almacenamiento local de archivos |
| v1.0.0 | Migración a SQL Server, JWT propio, RLS nativo |
| v0.2.9 | Validación de archivos por magic bytes, rate limiting, auditoría |
| v0.2.6 | KPI "Próximos a Vencer", ImageLightbox, sistema de notificaciones unificado |
| v0.2.5 | SharedTicketModal reutilizable, TicketClosureModal, ruteo seguro |
| v0.2.3 | Sombras estandarizadas, tipografía mejorada, toggle de contraseñas |
| v0.2.2 | Portal de documentación Docsify, especialización de SPTienda |
| v0.2.1-B | Navegación anidada en configuraciones, tracking de envíos |
| v0.2.1 | Módulo de tiendas completo, edge function notify-guia |
| v0.2.0 | Módulo de clientes, KPIs en tiempo real, notificaciones de vencimiento |
| v0.1.6 | Servicio de email Resend, gestión de usuarios, recuperación de contraseñas |

---

> **Fin del documento.** Este archivo contiene toda la información necesaria para reconstruir la interfaz de usuario del CRM Swim con fidelidad completa. Cualquier duda adicional debe consultarse con el código fuente directamente.
