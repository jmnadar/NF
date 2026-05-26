# Swim CRM — Especificación Completa de Base de Datos y Backend

> **Documento creado para:** Agente IA constructor de backend / reporte técnico
> **Versión del CRM:** v1.8.0
> **Fecha:** 2026-05-15
> **Objetivo:** Describir con máximo detalle el esquema de base de datos, arquitectura del backend, seguridad RLS, funciones, triggers, procedimientos, vistas, índices y todos los endpoints de la API REST.

---

## Tabla de Contenidos

1. [Stack Tecnológico del Backend](#1-stack-tecnológico-del-backend)
2. [Arquitectura del Backend](#2-arquitectura-del-backend)
3. [Base de Datos: Información General](#3-base-de-datos-información-general)
4. [Esquema Completo de Tablas (26 tablas)](#4-esquema-completo-de-tablas-26-tablas)
5. [Diagrama de Relaciones](#5-diagrama-de-relaciones)
6. [Secuencias](#6-secuencias)
7. [Índices](#7-índices)
8. [Funciones Helper y Predicados RLS](#8-funciones-helper-y-predicados-rls)
9. [Políticas de Row-Level Security (RLS)](#9-políticas-de-row-level-security-rls)
10. [Triggers](#10-triggers)
11. [Procedimientos Almacenados](#11-procedimientos-almacenados)
12. [Vistas KPI](#12-vistas-kpi)
13. [Seed Data (Datos Iniciales)](#13-seed-data-datos-iniciales)
14. [API REST: Endpoints Completos](#14-api-rest-endpoints-completos)
15. [Middleware de Autenticación y Autorización](#15-middleware-de-autenticación-y-autorización)
16. [Sistema de RLS en el Backend](#16-sistema-de-rls-en-el-backend)
17. [Servicios (Email y Notificaciones)](#17-servicios-email-y-notificaciones)
18. [Seguridad y Hardening](#18-seguridad-y-hardening)
19. [Variables de Entorno](#19-variables-de-entorno)
20. [Consideraciones para Reconstrucción](#20-consideraciones-para-reconstrucción)

---

## 1. Stack Tecnológico del Backend

| Tecnología | Versión | Propósito |
|---|---|---|
| **Node.js** | 20.x (Docker: node:20-slim) | Runtime del servidor |
| **Express** | 4.x | Framework web HTTP |
| **TypeScript** | 5.x | Tipado estático |
| **mssql (tedious)** | Latest | Driver de conexión a SQL Server |
| **bcrypt** | Latest | Hash de contraseñas (12 salt rounds) |
| **jsonwebtoken** | Latest | Generación y verificación de JWT |
| **Zod** | Latest | Validación de esquemas de request |
| **Helmet** | Latest | Cabeceras de seguridad HTTP |
| **CORS** | Latest | Control de orígenes cruzados |
| **cookie-parser** | Latest | Parseo de cookies HTTP |
| **express-rate-limit** | Latest | Rate limiting por endpoint |
| **Morgan** | Latest | Logging de peticiones HTTP |
| **Winston** | Latest | Logging estructurado con rotación |
| **dotenv** | Latest | Variables de entorno |
| **multer** | Latest | Manejo de uploads de archivos |
| **Resend** | Latest | API de envío de correos |

---

## 2. Arquitectura del Backend

### Estructura de Directorios

```
backend/
├── database/
│   ├── swimming_all_db.sql              # Script master (crear DB completa)
│   ├── 003_add_sptienda_rls_rules.sql   # Migración RLS avanzada para SPTienda
│   └── migrations/
│       ├── 001_add_numero_pedido_to_pedidos_guia.sql
│       └── 002_add_user_id_to_notificaciones.sql
├── src/
│   ├── config/
│   │   └── db.ts                        # Configuración de conexión SQL Server + RLS
│   ├── controllers/
│   │   ├── auth.controller.ts           # Login, registro, reset password
│   │   ├── comms.controller.ts          # Configuración de comunicaciones
│   │   ├── customers.controller.ts      # CRUD de clientes
│   │   ├── email.controller.ts          # Envío de emails
│   │   ├── files.controller.ts          # Upload/download de archivos
│   │   ├── guias.controller.ts          # Gestión de guías de envío
│   │   ├── marcas.controller.ts         # Gestión de marcas
│   │   ├── notifications.controller.ts  # Notificaciones internas
│   │   ├── pedidos.controller.ts        # Gestión de pedidos
│   │   ├── tickets.controller.ts        # CRUD de tickets + dashboard stats
│   │   ├── tiendas.controller.ts        # CRUD de tiendas
│   │   └── user.controller.ts           # Gestión de usuarios, roles, permisos
│   ├── middleware/
│   │   ├── auth.ts                      # authenticate + authorize
│   │   └── validate.ts                  # Validación con Zod
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── comms.routes.ts
│   │   ├── customers.routes.ts
│   │   ├── files.routes.ts
│   │   ├── guias.routes.ts
│   │   ├── marcas.routes.ts
│   │   ├── notifications.routes.ts
│   │   ├── pedidos.routes.ts
│   │   ├── tickets.routes.ts
│   │   ├── tiendas.routes.ts
│   │   └── user.routes.ts
│   ├── schemas/                         # Esquemas Zod de validación
│   ├── services/
│   │   ├── email.service.ts             # Servicio de email (Resend + templates)
│   │   └── notification.service.ts      # Servicio de notificaciones internas
│   ├── templates/                       # Templates HTML de emails
│   ├── utils/
│   │   ├── jwt.ts                       # Generación/verificación de JWT
│   │   ├── audit.ts                     # Logging de auditoría
│   │   └── logger.ts                    # Config de Winston
│   ├── check_db.ts                      # Script de verificación de DB
│   └── server.ts                        # Punto de entrada (Express app)
├── uploads/                             # Almacenamiento local de archivos
├── logs/                                # Logs de Winston (rotación)
├── Dockerfile
├── .env
└── package.json
```

### Patrón de Diseño

- **Controller-Route-Service**: Cada módulo tiene su controlador, rutas y servicios separados
- **RLS Context Pattern**: Todas las queries pasan por `executeWithRLS()` que establece `SESSION_CONTEXT` antes de ejecutar
- **Transaction-based RLS**: Las operaciones complejas usan transacciones para mantener el contexto RLS
- **OUTPUT clause**: Los INSERT/UPDATE usan `OUTPUT INSERTED.*` para retornar datos creados sin queries adicionales

---

## 3. Base de Datos: Información General

| Propiedad | Valor |
|---|---|
| **Motor** | Microsoft SQL Server |
| **Nombre de BD** | `SwimmingCRM` |
| **Collation** | `Latin1_General_CI_AS` |
| **Esquema principal** | `dbo` |
| **Esquema de seguridad** | `Security` |
| **Total de tablas** | 26 + 1 (config_comunicaciones) |
| **Total de secuencias** | 4 |
| **Total de índices** | 20 |
| **Total de políticas RLS** | 6 |
| **Total de triggers** | 4 |
| **Total de vistas** | 2 |
| **Total de procedimientos** | 1 |
| **Total de funciones** | 8 |

### Script Master

El archivo `swimming_all_db.sql` es **idempotente** y ejecuta:
1. Desactiva políticas RLS existentes
2. Crea esquema `Security`
3. Crea todas las tablas (con verificación `IF OBJECT_ID IS NULL`)
4. Agrega columnas incrementales (migración inline)
5. Crea índices (con verificación `IF NOT EXISTS`)
6. Crea secuencias
7. Crea funciones helper y predicados RLS
8. Crea políticas de seguridad
9. Crea triggers
10. Crea procedimientos
11. Inserta seed data (idempotente)
12. Otorga permisos a SA
13. Valida resultado final

---

## 4. Esquema Completo de Tablas (26 tablas)

### 4.1 Tablas de Seguridad & Auth

#### `dbo.roles`
| Columna | Tipo | Constraints | Default | Descripción |
|---|---|---|---|---|
| `id` | UNIQUEIDENTIFIER | PK | NEWID() | ID del rol |
| `name` | NVARCHAR(100) | NOT NULL, UNIQUE | — | Nombre del rol |
| `description` | NVARCHAR(MAX) | — | — | Descripción |
| `created_at` | DATETIMEOFFSET | NOT NULL | SYSDATETIMEOFFSET() | Fecha de creación |

**Roles existentes:** `super_admin`, `admin`, `user`, `SPTienda`

---

#### `dbo.profiles`
| Columna | Tipo | Constraints | Default | Descripción |
|---|---|---|---|---|
| `id` | UNIQUEIDENTIFIER | PK | — | ID del usuario (mismo que auth) |
| `email` | NVARCHAR(255) | NOT NULL, UNIQUE | — | Email de acceso |
| `full_name` | NVARCHAR(255) | — | — | Nombre completo |
| `avatar_url` | NVARCHAR(MAX) | — | — | URL del avatar |
| `password_hash` | NVARCHAR(MAX) | NOT NULL | — | Hash bcrypt (12 rounds) |
| `role_id` | UNIQUEIDENTIFIER | FK → roles(id) | — | Rol asignado |
| `tienda_id` | UNIQUEIDENTIFIER | FK → tiendas(id) | NULL | Tienda asignada (SPTienda) |
| `tienda_nombre` | NVARCHAR(255) | — | — | Nombre de tienda (denormalizado) |
| `last_login` | DATETIMEOFFSET | — | — | Último inicio de sesión |
| `failed_attempts` | INT | — | 0 | Intentos fallidos de login |
| `lockout_until` | DATETIMEOFFSET | NULL | — | Bloqueo temporal (15 min tras 3 intentos) |
| `created_at` | DATETIMEOFFSET | NOT NULL | SYSDATETIMEOFFSET() | Fecha de creación |
| `updated_at` | DATETIMEOFFSET | NOT NULL | SYSDATETIMEOFFSET() | Fecha de actualización |

**FK:** `FK_profiles_tienda_id` → `dbo.tiendas(id)`

---

#### `dbo.permissions`
| Columna | Tipo | Constraints | Default | Descripción |
|---|---|---|---|---|
| `id` | UNIQUEIDENTIFIER | PK | NEWID() | ID del permiso |
| `name` | NVARCHAR(100) | NOT NULL, UNIQUE | — | Nombre del permiso |
| `description` | NVARCHAR(MAX) | — | — | Descripción |
| `module` | NVARCHAR(100) | NOT NULL | — | Módulo al que pertenece |
| `created_at` | DATETIMEOFFSET | NOT NULL | SYSDATETIMEOFFSET() | Fecha de creación |

**Permisos existentes:** `tickets:view`, `tickets:create`, `tickets:edit`, `tickets:delete`, `customers:view`, `customers:create`, `customers:edit`, `customers:delete`, `dashboard:view`, `admin:users`

---

#### `dbo.role_permissions`
| Columna | Tipo | Constraints | Default | Descripción |
|---|---|---|---|---|
| `role_id` | UNIQUEIDENTIFIER | PK, FK → roles(id) ON DELETE CASCADE | — | Rol |
| `permission_id` | UNIQUEIDENTIFIER | PK, FK → permissions(id) | — | Permiso |
| `created_at` | DATETIMEOFFSET | NOT NULL | SYSDATETIMEOFFSET() | Fecha de asignación |

**PK compuesta:** `(role_id, permission_id)`

---

#### `dbo.user_permissions`
| Columna | Tipo | Constraints | Default | Descripción |
|---|---|---|---|---|
| `user_id` | UNIQUEIDENTIFIER | PK, FK → profiles(id) ON DELETE CASCADE | — | Usuario |
| `permission_id` | UNIQUEIDENTIFIER | PK, FK → permissions(id) | — | Permiso personalizado |
| `created_at` | DATETIMEOFFSET | NOT NULL | SYSDATETIMEOFFSET() | Fecha de asignación |

**PK compuesta:** `(user_id, permission_id)`

---

### 4.2 Tablas de Referencias (Lookups)

#### `dbo.ciudades`
| Columna | Tipo | Constraints | Default | Descripción |
|---|---|---|---|---|
| `id_ciudad` | INT | PK, IDENTITY(1,1) | — | ID de ciudad |
| `ciudad` | NVARCHAR(255) | NOT NULL | — | Nombre de la ciudad |
| `created_at` | DATETIMEOFFSET | NOT NULL | SYSDATETIMEOFFSET() | Fecha de creación |

**Seed:** 48 ciudades de Colombia (Bogotá, Medellín, Cali, etc.)

---

#### `dbo.marcas`
| Columna | Tipo | Constraints | Default | Descripción |
|---|---|---|---|---|
| `id_marcas` | INT | PK, IDENTITY(1,1) | — | ID de marca |
| `nombre_marca` | NVARCHAR(255) | NOT NULL | — | Nombre de la marca |
| `descripcion` | NVARCHAR(MAX) | — | — | Descripción |
| `whatsapp_numero` | NVARCHAR(30) | NULL | — | Número WhatsApp (sin +) |
| `email_remitente` | NVARCHAR(255) | NULL | — | Email remitente de la marca |
| `telefono_soporte` | NVARCHAR(30) | NULL | — | Teléfono de soporte |
| `created_at` | DATETIMEOFFSET | NOT NULL | SYSDATETIMEOFFSET() | Fecha de creación |

**Seed:** Speedo, O'Neill

---

#### `dbo.motivo_contacto`
| Columna | Tipo | Constraints | Default | Descripción |
|---|---|---|---|---|
| `id_motivo_caso` | NVARCHAR(50) | PK | — | Código del motivo |
| `motivo_caso` | NVARCHAR(255) | NOT NULL | — | Nombre legible |
| `created_at` | DATETIMEOFFSET | NOT NULL | SYSDATETIMEOFFSET() | Fecha de creación |

**Seed:**
| Código | Label |
|---|---|
| `change_size` | Cambio de Talla |
| `change_reference` | Cambio de Referencia |
| `warranty` | Garantía |
| `return` | Devolución |
| `coordinator_update` | Actualización de Coordinadora |
| `pqr` | PQR |
| `advice` | Asesoría |
| `balance_favor` | Saldo a Favor |

---

#### `dbo.sub_motivos`
| Columna | Tipo | Constraints | Default | Descripción |
|---|---|---|---|---|
| `id_sub_motivo` | INT | PK, IDENTITY(1,1) | — | ID del sub-motivo |
| `id_motivo_caso` | NVARCHAR(50) | FK → motivo_contacto(id_motivo_caso) | — | Motivo padre |
| `nombre_sub_motivo` | NVARCHAR(255) | NOT NULL | — | Nombre del sub-motivo |
| `created_at` | DATETIMEOFFSET | NOT NULL | SYSDATETIMEOFFSET() | Fecha de creación |

**Seed:** 6 sub-motivos de `coordinator_update`: Cambio de destino, Cambio de dirección, Retraso, Devolución, Hurto, Pérdida

---

#### `dbo.estados_casos`
| Columna | Tipo | Constraints | Default | Descripción |
|---|---|---|---|---|
| `id_estado_casos` | INT | PK, IDENTITY(1,1) | — | ID del estado |
| `estados_cambio` | NVARCHAR(100) | NOT NULL | — | Nombre del estado |
| `created_at` | DATETIMEOFFSET | NOT NULL | SYSDATETIMEOFFSET() | Fecha de creación |

**Seed:** Abierto, En Proceso, Pendiente, Resuelto, Cerrado, Cancelado

---

#### `dbo.tallas`
| Columna | Tipo | Constraints | Default | Descripción |
|---|---|---|---|---|
| `id_talla` | INT | PK, IDENTITY(1,1) | — | ID de talla |
| `nombre_talla` | NVARCHAR(50) | NOT NULL | — | Nombre de la talla |
| `created_at` | DATETIMEOFFSET | NOT NULL | SYSDATETIMEOFFSET() | Fecha de creación |

**Seed:** XXS, XS, S, M, L, XL, XXL, 3XL, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46

---

#### `dbo.referencias_productos`
| Columna | Tipo | Constraints | Default | Descripción |
|---|---|---|---|---|
| `id_referencias` | INT | PK, IDENTITY(1,1) | — | ID de referencia |
| `id_marcas` | INT | FK → marcas(id_marcas) | — | Marca del producto |
| `sku` | NVARCHAR(100) | NOT NULL | — | SKU del producto |
| `descripcion` | NVARCHAR(MAX) | — | — | Descripción |
| `created_at` | DATETIMEOFFSET | NOT NULL | SYSDATETIMEOFFSET() | Fecha de creación |

---

#### `dbo.tipos_comercio`
| Columna | Tipo | Constraints | Default | Descripción |
|---|---|---|---|---|
| `id_tipo_comercio` | INT | PK, IDENTITY(1,1) | — | ID del tipo |
| `nombre_tipo` | NVARCHAR(100) | NOT NULL | — | Nombre del tipo de comercio |

**Seed:** Tienda Física, Ecommerce

---

### 4.3 Tablas de Negocio Principal

#### `dbo.tiendas`
| Columna | Tipo | Constraints | Default | Descripción |
|---|---|---|---|---|
| `id` | UNIQUEIDENTIFIER | PK | NEWID() | ID de la tienda |
| `id_marcas` | INT | FK → marcas(id_marcas) | — | Marca asociada |
| `nombre` | NVARCHAR(255) | NOT NULL | — | Nombre de la tienda |
| `numero_bodega` | NVARCHAR(100) | — | — | Número de bodega |
| `ciudad` | NVARCHAR(100) | — | — | Ciudad |
| `direccion` | NVARCHAR(MAX) | — | — | Dirección completa |
| `telefono` | NVARCHAR(50) | — | — | Teléfono |
| `email` | NVARCHAR(255) | — | — | Email de contacto |
| `admin_id` | UNIQUEIDENTIFIER | FK → profiles(id) | — | Administrador asignado |
| `is_active` | BIT | — | 1 | Estado activo/inactivo |
| `id_tipo_comercio` | INT | FK → tipos_comercio(id_tipo_comercio) | — | Tipo de comercio |
| `created_at` | DATETIMEOFFSET | NOT NULL | SYSDATETIMEOFFSET() | Fecha de creación |
| `created_by` | UNIQUEIDENTIFIER | FK → profiles(id) | — | Usuario creador |

---

#### `dbo.customers`
| Columna | Tipo | Constraints | Default | Descripción |
|---|---|---|---|---|
| `id_cliente` | INT | PK, IDENTITY(1,1) | — | ID del cliente |
| `cedula` | NVARCHAR(50) | UNIQUE | — | Cédula o NIT |
| `nombre` | NVARCHAR(255) | NOT NULL | — | Nombre |
| `apellido` | NVARCHAR(255) | NOT NULL | — | Apellido |
| `telefono` | NVARCHAR(50) | — | — | Teléfono |
| `email` | NVARCHAR(255) | — | — | Email |
| `direccion` | NVARCHAR(MAX) | — | — | Dirección |
| `pais` | NVARCHAR(100) | — | 'Colombia' | País |
| `id_ciudad` | INT | FK → ciudades(id_ciudad) | — | Ciudad |
| `created_by` | UNIQUEIDENTIFIER | FK → profiles(id) | — | Usuario creador |
| `created_at` | DATETIMEOFFSET | NOT NULL | SYSDATETIMEOFFSET() | Fecha de creación |
| `updated_at` | DATETIMEOFFSET | NOT NULL | SYSDATETIMEOFFSET() | Fecha de actualización |
| `deleted_at` | DATETIMEOFFSET | NULL | — | Borrado lógico (soft delete) |
| `is_active` | BIT | — | 1 | Estado activo |
| `id_tipo_comercio` | INT | FK → tipos_comercio(id_tipo_comercio) | — | Tipo de comercio |

---

#### `dbo.tickets`
| Columna | Tipo | Constraints | Default | Descripción |
|---|---|---|---|---|
| `id_ticket` | INT | PK, IDENTITY(1,1) | — | ID del ticket |
| `ticket_numero` | NVARCHAR(50) | UNIQUE | — | Número generado (STK-000001, etc.) |
| `id_cliente` | INT | FK → customers(id_cliente) ON DELETE CASCADE | — | Cliente asociado |
| `id_marcas` | INT | FK → marcas(id_marcas) | — | Marca |
| `id_motivo_caso` | NVARCHAR(50) | FK → motivo_contacto(id_motivo_caso) | — | Motivo de contacto |
| `id_sub_motivo` | INT | FK → sub_motivos(id_sub_motivo) | — | Sub-motivo |
| `id_estado_caso` | INT | FK → estados_casos(id_estado_casos) | — | Estado del caso |
| `id_numero_pedido` | NVARCHAR(100) | — | — | Número de pedido |
| `referencia` | NVARCHAR(MAX) | — | — | Referencia/SKU original |
| `nueva_referencia` | NVARCHAR(MAX) | — | — | Nueva referencia (cambio) |
| `id_talla_actual` | INT | FK → tallas(id_talla) | — | Talla actual |
| `id_nueva_talla` | INT | FK → tallas(id_talla) | — | Nueva talla |
| `descripcion` | NVARCHAR(MAX) | — | — | Descripción del caso |
| `id_usuario` | UNIQUEIDENTIFIER | FK → profiles(id) | — | Agente asignado |
| `created_by` | UNIQUEIDENTIFIER | FK → profiles(id) | — | Usuario creador |
| `fecha_creacion_ticket` | DATETIMEOFFSET | NOT NULL | SYSDATETIMEOFFSET() | Fecha de creación |
| `tiempo_respuesta` | DATETIMEOFFSET | — | — | Tiempo de respuesta real |
| `fecha_limite_respuesta` | DATE | — | — | Fecha límite (calculada por motivo) |
| `id_tipo_comercio` | INT | FK → tipos_comercio(id_tipo_comercio) | — | Tipo de comercio |
| `fecha_compra` | DATE | NULL | — | Fecha de compra del producto |
| `valor_compra` | DECIMAL(18,2) | NULL | — | Valor de compra |
| `solucion_esperada` | NVARCHAR(MAX) | NULL | — | Solución esperada por el cliente |
| `created_at` | DATETIMEOFFSET | NOT NULL | SYSDATETIMEOFFSET() | Fecha de creación |
| `updated_at` | DATETIMEOFFSET | NOT NULL | SYSDATETIMEOFFSET() | Fecha de actualización |

**Trigger:** `trg_generate_ticket_number` (INSTEAD OF INSERT) genera automáticamente `ticket_numero`

---

#### `dbo.soluciones_tickets`
| Columna | Tipo | Constraints | Default | Descripción |
|---|---|---|---|---|
| `id_solucion` | INT | PK, IDENTITY(1,1) | — | ID de la solución |
| `id_ticket` | INT | NOT NULL, FK → tickets(id_ticket) | — | Ticket asociado |
| `id_cliente` | INT | NOT NULL, FK → customers(id_cliente) | — | Cliente asociado |
| `nota_credito` | NVARCHAR(255) | — | — | Número de nota de crédito |
| `nuevo_pedido` | NVARCHAR(255) | — | — | Número de nuevo pedido |
| `cst` | NVARCHAR(255) | — | — | CST (Customer Service Ticket) |
| `descripcion_solucion` | NVARCHAR(MAX) | NOT NULL | — | Descripción de la solución |
| `id_usuario` | UNIQUEIDENTIFIER | FK → profiles(id) | — | Usuario que registró |
| `created_at` | DATETIMEOFFSET | NOT NULL | SYSDATETIMEOFFSET() | Fecha de creación |

---

### 4.4 Tablas de Logística, Archivos & Sistema

#### `dbo.guias_envio`
| Columna | Tipo | Constraints | Default | Descripción |
|---|---|---|---|---|
| `id` | UNIQUEIDENTIFIER | PK | NEWID() | ID de la guía |
| `tienda_id` | UNIQUEIDENTIFIER | FK → tiendas(id) | — | Tienda destino |
| `numero_guia` | NVARCHAR(100) | UNIQUE, NOT NULL | — | Número de guía |
| `estado` | NVARCHAR(50) | — | 'pendiente' | Estado (pendiente, recibido, completo) |
| `nota` | NVARCHAR(MAX) | — | — | Notas adicionales |
| `fecha_recibido` | DATETIMEOFFSET | — | — | Fecha de recibido en tienda |
| `fecha_completado` | DATETIMEOFFSET | — | — | Fecha de completado |
| `created_at` | DATETIMEOFFSET | NOT NULL | SYSDATETIMEOFFSET() | Fecha de creación |
| `created_by` | UNIQUEIDENTIFIER | FK → profiles(id) | — | Usuario creador |

---

#### `dbo.pedidos_guia`
| Columna | Tipo | Constraints | Default | Descripción |
|---|---|---|---|---|
| `id` | UNIQUEIDENTIFIER | PK | NEWID() | ID del pedido |
| `guia_id` | UNIQUEIDENTIFIER | FK → guias_envio(id) | — | Guía asociada |
| `numero_pedido` | NVARCHAR(100) | NOT NULL | — | Número de pedido |
| `estado` | NVARCHAR(50) | — | 'pendiente' | Estado (pendiente, entregado) |
| `fecha_entrega` | DATETIMEOFFSET | — | — | Fecha de entrega |
| `created_at` | DATETIMEOFFSET | NOT NULL | SYSDATETIMEOFFSET() | Fecha de creación |

---

#### `dbo.pedido_evidencias`
| Columna | Tipo | Constraints | Default | Descripción |
|---|---|---|---|---|
| `id` | UNIQUEIDENTIFIER | PK | NEWID() | ID de la evidencia |
| `pedido_id` | UNIQUEIDENTIFIER | NOT NULL, FK → pedidos_guia(id) | — | Pedido asociado |
| `guia_id` | UNIQUEIDENTIFIER | NOT NULL, FK → guias_envio(id) | — | Guía asociada |
| `tienda_id` | UNIQUEIDENTIFIER | NOT NULL, FK → tiendas(id) | — | Tienda |
| `url_publica` | NVARCHAR(MAX) | NOT NULL | — | URL pública del archivo |
| `storage_path` | NVARCHAR(MAX) | NOT NULL | — | Ruta de almacenamiento |
| `tipo_mime` | NVARCHAR(100) | NOT NULL | — | Tipo MIME |
| `nombre` | NVARCHAR(255) | NOT NULL | — | Nombre del archivo |
| `tamano_bytes` | INT | NOT NULL | — | Tamaño en bytes |
| `subido_por` | UNIQUEIDENTIFIER | FK → profiles(id) | — | Usuario que subió |
| `created_at` | DATETIMEOFFSET | NOT NULL | SYSDATETIMEOFFSET() | Fecha de subida |

---

#### `dbo.ticket_archivos`
| Columna | Tipo | Constraints | Default | Descripción |
|---|---|---|---|---|
| `id` | UNIQUEIDENTIFIER | PK | NEWID() | ID del archivo |
| `ticket_id` | INT | NOT NULL, FK → tickets(id_ticket) ON DELETE CASCADE | — | Ticket asociado |
| `nombre` | NVARCHAR(255) | NOT NULL | — | Nombre del archivo |
| `tipo_mime` | NVARCHAR(100) | NOT NULL | — | Tipo MIME |
| `tamano_bytes` | INT | NOT NULL | — | Tamaño en bytes |
| `url_publica` | NVARCHAR(MAX) | NOT NULL | — | URL pública |
| `storage_path` | NVARCHAR(MAX) | NOT NULL | — | Ruta de almacenamiento |
| `proveedor` | NVARCHAR(50) | — | 'local' | Proveedor (local, supabase, etc.) |
| `subido_por` | UNIQUEIDENTIFIER | FK → profiles(id) | — | Usuario que subió |
| `created_at` | DATETIMEOFFSET | NOT NULL | SYSDATETIMEOFFSET() | Fecha de subida |

---

#### `dbo.notificaciones`
| Columna | Tipo | Constraints | Default | Descripción |
|---|---|---|---|---|
| `id` | UNIQUEIDENTIFIER | PK | NEWID() | ID de la notificación |
| `user_id` | UNIQUEIDENTIFIER | NULL, FK → profiles(id) | — | Usuario destino (nullable = por rol) |
| `tipo` | NVARCHAR(50) | NOT NULL | — | Tipo (guia_recibida, paquete_entregado, ticket_asignado, nueva_guia) |
| `titulo` | NVARCHAR(255) | NOT NULL | — | Título |
| `mensaje` | NVARCHAR(MAX) | NOT NULL | — | Mensaje |
| `leida` | BIT | NOT NULL | 0 | Leída o no |
| `roles_destino` | NVARCHAR(MAX) | NOT NULL | 'super_admin,admin' | Roles destino (CSV) |
| `metadata` | NVARCHAR(MAX) | — | — | JSON libre (ticketId, guiaId, etc.) |
| `created_at` | DATETIMEOFFSET | NOT NULL | SYSDATETIMEOFFSET() | Fecha de creación |

---

#### `dbo.config_comunicaciones`
| Columna | Tipo | Constraints | Default | Descripción |
|---|---|---|---|---|
| `id` | INT | PK, IDENTITY(1,1) | — | ID de la plantilla |
| `id_marca` | INT | NULL, FK → marcas(id_marcas) | — | Marca (NULL = global) |
| `tipo` | NVARCHAR(20) | NOT NULL, CHECK IN ('email','whatsapp') | — | Canal |
| `nombre` | NVARCHAR(100) | NOT NULL | — | Nombre descriptivo |
| `asunto` | NVARCHAR(255) | NULL | — | Asunto (solo email) |
| `contenido` | NVARCHAR(MAX) | NOT NULL | — | Contenido con placeholders |
| `activo` | BIT | NOT NULL | 1 | Activa o inactiva |
| `created_at` | DATETIMEOFFSET | NOT NULL | SYSDATETIMEOFFSET() | Fecha de creación |
| `updated_at` | DATETIMEOFFSET | NOT NULL | SYSDATETIMEOFFSET() | Fecha de actualización |

**Placeholders soportados:** `{{nombre}}`, `{{apellido}}`, `{{nombre_completo}}`, `{{cedula}}`, `{{telefono}}`

---

#### `dbo.email_rate_limit`
| Columna | Tipo | Constraints | Default | Descripción |
|---|---|---|---|---|
| `id` | UNIQUEIDENTIFIER | PK | NEWID() | ID |
| `user_id` | UNIQUEIDENTIFIER | NOT NULL, FK → profiles(id) | — | Usuario |
| `recipient` | NVARCHAR(255) | NOT NULL | — | Destinatario |
| `created_at` | DATETIMEOFFSET | NOT NULL | SYSDATETIMEOFFSET() | Fecha |

**Limpieza automática:** Registros > 24 horas eliminados por `usp_cleanup_system`

---

#### `dbo.invite_rate_limit`
| Columna | Tipo | Constraints | Default | Descripción |
|---|---|---|---|---|
| `id` | UNIQUEIDENTIFIER | PK | NEWID() | ID |
| `user_id` | UNIQUEIDENTIFIER | NOT NULL, FK → profiles(id) | — | Usuario |
| `target_email` | NVARCHAR(255) | NOT NULL | — | Email destino |
| `created_at` | DATETIMEOFFSET | NOT NULL | SYSDATETIMEOFFSET() | Fecha |

**Limpieza automática:** Registros > 24 horas eliminados

---

#### `dbo.audit_log`
| Columna | Tipo | Constraints | Default | Descripción |
|---|---|---|---|---|
| `id` | UNIQUEIDENTIFIER | PK | NEWID() | ID |
| `user_id` | UNIQUEIDENTIFIER | FK → profiles(id) | — | Usuario |
| `action` | NVARCHAR(100) | NOT NULL | — | Acción realizada |
| `details` | NVARCHAR(MAX) | NOT NULL | '{}' | Detalles en JSON |
| `ip_address` | NVARCHAR(45) | — | — | IP del usuario |
| `user_agent` | NVARCHAR(MAX) | — | — | User-Agent del navegador |
| `created_at` | DATETIMEOFFSET | NOT NULL | SYSDATETIMEOFFSET() | Fecha |

**Limpieza automática:** Registros > 90 días eliminados

---

## 5. Diagrama de Relaciones

```
roles (1) ────< (N) profiles
profiles (1) ────< (N) profiles.tienda_id → tiendas
profiles (1) ────< (N) user_permissions
roles (1) ────< (N) role_permissions
permissions (1) ────< (N) role_permissions
permissions (1) ────< (N) user_permissions

marcas (1) ────< (N) referencias_productos
marcas (1) ────< (N) tiendas
marcas (1) ────< (N) tickets
marcas (1) ────< (N) config_comunicaciones

motivo_contacto (1) ────< (N) sub_motivos
motivo_contacto (1) ────< (N) tickets

estados_casos (1) ────< (N) tickets

tallas (1) ────< (N) tickets (talla_actual)
tallas (1) ────< (N) tickets (nueva_talla)

ciudades (1) ────< (N) customers
tipos_comercio (1) ────< (N) customers
tipos_comercio (1) ────< (N) tiendas
tipos_comercio (1) ────< (N) tickets

profiles (1) ────< (N) customers (created_by)
profiles (1) ────< (N) tickets (id_usuario)
profiles (1) ────< (N) tickets (created_by)
profiles (1) ────< (N) tiendas (admin_id)
profiles (1) ────< (N) tiendas (created_by)
profiles (1) ────< (N) guias_envio (created_by)
profiles (1) ────< (N) ticket_archivos (subido_por)
profiles (1) ────< (N) pedido_evidencias (subido_por)
profiles (1) ────< (N) soluciones_tickets (id_usuario)
profiles (1) ────< (N) notificaciones (user_id)
profiles (1) ────< (N) email_rate_limit
profiles (1) ────< (N) invite_rate_limit
profiles (1) ────< (N) audit_log

customers (1) ────< (N) tickets (ON DELETE CASCADE)
customers (1) ────< (N) soluciones_tickets

tickets (1) ────< (N) soluciones_tickets
tickets (1) ────< (N) ticket_archivos (ON DELETE CASCADE)

tiendas (1) ────< (N) guias_envio
tiendas (1) ────< (N) pedido_evidencias

guias_envio (1) ────< (N) pedidos_guia
guias_envio (1) ────< (N) pedido_evidencias

pedidos_guia (1) ────< (N) pedido_evidencias
```

---

## 6. Secuencias

| Secuencia | Start | Increment | Prefijo | Uso |
|---|---|---|---|---|
| `seq_ticket_stk` | 1 | 1 | `STK-` | Tickets de marca Speedo |
| `seq_ticket_otk` | 1 | 1 | `OTK-` | Tickets de marca O'Neill |
| `seq_ticket_sptk` | 1 | 1 | `SPTK-` | Tickets de rol SPTienda |
| `seq_ticket_tkt` | 1 | 1 | `TKT-` | Tickets genéricos |

**Formato:** `{PREFIX}-{6 dígitos}` → Ej: `STK-000001`, `SPTK-000042`

**Lógica de asignación (en trigger `trg_generate_ticket_number`):**
1. Si rol = `SPTienda` → `SPTK-`
2. Si marca = `speedo` → `STK-`
3. Si marca = `o'neill` o `oneill` → `OTK-`
4. Otro → `TKT-`

**Previsualización sin consumir secuencia:** Se usa `CURRENT VALUE FOR + 1` en lugar de `NEXT VALUE FOR`

---

## 7. Índices

| Índice | Tabla | Columna(s) | Propósito |
|---|---|---|---|
| `idx_customers_cedula` | customers | cedula | Búsqueda por cédula |
| `idx_customers_ciudad` | customers | id_ciudad | Filtrado por ciudad |
| `idx_customers_created_by` | customers | created_by | Auditoría de creador |
| `idx_tickets_cliente` | tickets | id_cliente | Tickets por cliente |
| `idx_tickets_numero` | tickets | ticket_numero | Búsqueda por número |
| `idx_tickets_estado` | tickets | id_estado_caso | Filtrado por estado |
| `idx_tickets_motivo` | tickets | id_motivo_caso | Filtrado por motivo |
| `idx_tickets_usuario` | tickets | id_usuario | Tickets por agente |
| `idx_soluciones_ticket` | soluciones_tickets | id_ticket | Soluciones por ticket |
| `idx_soluciones_cliente` | soluciones_tickets | id_cliente | Soluciones por cliente |
| `idx_guias_tienda` | guias_envio | tienda_id | Guías por tienda |
| `idx_evidencias_pedido` | pedido_evidencias | pedido_id | Evidencias por pedido |
| `idx_evidencias_tienda` | pedido_evidencias | tienda_id | Evidencias por tienda |
| `idx_notificaciones_leida` | notificaciones | leida | Filtrar no leídas |
| `idx_notificaciones_user_id` | notificaciones | user_id | Notificaciones por usuario |
| `idx_rate_limit_user` | email_rate_limit | user_id, created_at DESC | Rate limiting |
| `idx_audit_log_user` | audit_log | user_id, created_at DESC | Auditoría por usuario |
| `idx_audit_log_action` | audit_log | action | Auditoría por acción |
| `idx_comms_marca_tipo` | config_comunicaciones | id_marca, tipo | Plantillas por marca/canal |

---

## 8. Funciones Helper y Predicados RLS

### Funciones Helper

#### `Security.fn_is_admin()` → BIT
Retorna `1` si el usuario es `super_admin` o `admin`.
- Verifica `IS_MEMBER('db_owner')` o `IS_SRVROLEMEMBER('sysadmin')`
- Lee `SESSION_CONTEXT(N'UserRole')`

#### `Security.fn_is_sptienda()` → BIT
Retorna `1` si el rol es `SPTienda`.

### Funciones Predicado (Table-Valued Functions)

#### `Security.fn_pred_profiles(@id UNIQUEIDENTIFIER)`
- **Uso:** FILTER + BLOCK en `dbo.profiles`
- **Lógica:** DBA siempre, o el usuario ve solo su propio perfil

#### `Security.fn_pred_authenticated(@dummy BIT = NULL)`
- **Uso:** FILTER + BLOCK en `dbo.customers`, `dbo.tickets`, y todas las tablas de lookup
- **Lógica:** DBA siempre, o cualquier usuario autenticado (`SESSION_CONTEXT(N'UserId') IS NOT NULL`)

#### `Security.fn_pred_tienda_write(@tienda_id UNIQUEIDENTIFIER)`
- **Uso:** FILTER + BLOCK en `dbo.tiendas`
- **Lógica:** DBA siempre, o `@tienda_id = SESSION_CONTEXT(N'TiendaId')`

#### `Security.fn_pred_notifications(@user_id, @roles_destino)`
- **Uso:** FILTER + BLOCK en `dbo.notificaciones`
- **Lógica:** DBA siempre, o `user_id` coincide, o el rol del usuario está en `roles_destino` (CSV match)

#### `Security.fn_pred_tickets_sptienda(@ticket_id, @id_usuario, @created_by)`
- **Uso:** FILTER en `dbo.tickets` (reemplaza `fn_pred_authenticated`)
- **Lógica:**
  - DBA: siempre
  - `super_admin`/`admin`: ven todos
  - `SPTienda`: solo tickets donde `id_usuario = UserId` (asignados) o `created_by = UserId` (creados)
  - Otros roles: solo sus propios tickets

#### `Security.fn_pred_prevent_super_admin_delete(@user_id)`
- **Uso:** BLOCK en `dbo.profiles` (DELETE)
- **Lógica:** DBA siempre, o el usuario siendo eliminado NO es `super_admin`, o el que intenta es `super_admin`

#### `Security.fn_kpi_user_count_sptienda(@tienda_id)`
- **Uso:** Filtrado de KPIs por tienda
- **Lógica:** DBA siempre, admin ven todas, SPTienda solo su tienda

---

## 9. Políticas de Row-Level Security (RLS)

### Políticas Activas

| Política | Tabla(s) | Tipo | Predicado |
|---|---|---|---|
| `PolicyProfiles` | profiles | FILTER + BLOCK | `fn_pred_profiles(id)` |
| `PolicyCustomers` | customers | FILTER + BLOCK | `fn_pred_authenticated()` |
| `PolicyTickets` | tickets | FILTER | `fn_pred_tickets_sptienda(id_ticket, id_usuario, created_by)` |
| `PolicyTiendas` | tiendas | FILTER + BLOCK | `fn_pred_tienda_write(id)` |
| `PolicyNotifications` | notificaciones | FILTER + BLOCK | `fn_pred_notifications(user_id, roles_destino)` |
| `PolicyLookups` | ciudades, marcas, motivo_contacto, sub_motivos, estados_casos, tallas, referencias_productos, guias_envio, pedidos_guia, pedido_evidencias, ticket_archivos, soluciones_tickets, config_comunicaciones | FILTER | `fn_pred_authenticated()` |

### Mecanismo de RLS en SQL Server

1. **SESSION_CONTEXT** se establece vía `sp_set_session_context` al inicio de cada query
2. **Keys:** `UserId`, `UserRole`, `TiendaId`
3. **Función `executeWithRLS()`:** Envuelve cada query del backend para establecer contexto antes de ejecutar
4. **Transacciones:** Para operaciones complejas, se usa transacción para mantener contexto en el pool de conexiones

---

## 10. Triggers

### `trg_generate_ticket_number` (INSTEAD OF INSERT en `dbo.tickets`)
- **Propósito:** Generar automáticamente `ticket_numero` basado en rol y marca
- **Lógica:** Cursor local que itera sobre `inserted`, determina prefijo, consume secuencia
- **Prefijos:** SPTK (SPTienda), STK (Speedo), OTK (O'Neill), TKT (genérico)
- **Formato:** `{PREFIX}-000001` (6 dígitos con padding)

### `trg_customers_updated_at` (AFTER UPDATE en `dbo.customers`)
- **Propósito:** Actualizar `updated_at` automáticamente
- **Condición:** Solo si se modifican: `nombre`, `apellido`, `email`, `telefono`, `direccion`

### `trg_tickets_updated_at` (AFTER UPDATE en `dbo.tickets`)
- **Propósito:** Actualizar `updated_at` automáticamente
- **Condición:** Solo si se modifican: `id_estado_caso`, `descripcion`, `id_sub_motivo`, `id_motivo_caso`

### `trg_prevent_super_admin_deletion` (INSTEAD OF DELETE en `dbo.profiles`)
- **Propósito:** Prevenir eliminación de `super_admin` por no-super_admin
- **Lógica:** Si intenta eliminar super_admin y no es super_admin/DBA → RAISERROR + ROLLBACK
- **Auditoría:** Registra DELETE en `audit_log`

### `trg_restrict_sptienda_tienda_update` (AFTER UPDATE en `dbo.tiendas`)
- **Propósito:** SPTienda no puede modificar `nombre` ni `email` de tiendas
- **Lógica:** Si rol = SPTienda y UPDATE(nombre) o UPDATE(email) → RAISERROR + ROLLBACK

---

## 11. Procedimientos Almacenados

### `dbo.usp_cleanup_system`
**Propósito:** Limpieza automática de datos temporales

```sql
DELETE FROM dbo.email_rate_limit WHERE created_at < DATEADD(HOUR, -24, SYSDATETIMEOFFSET());
DELETE FROM dbo.invite_rate_limit WHERE created_at < DATEADD(HOUR, -24, SYSDATETIMEOFFSET());
DELETE FROM dbo.audit_log WHERE created_at < DATEADD(DAY, -90, SYSDATETIMEOFFSET());
```

**Ejecución recomendada:** Job de SQL Server Agent cada 24 horas

---

## 12. Vistas KPI

### `dbo.vw_kpi_tickets_by_tienda`
**Propósito:** KPIs de tickets agrupados por tienda (respeta RLS)

```sql
SELECT 
    pr.tienda_id, pr.tienda_nombre,
    COUNT(DISTINCT t.id_ticket) AS total_tickets,
    SUM(CASE WHEN t.id_estado_caso = ec_abierto THEN 1 ELSE 0 END) AS tickets_abiertos,
    SUM(CASE WHEN t.id_estado_caso = ec_resuelto THEN 1 ELSE 0 END) AS tickets_resueltos,
    SUM(CASE WHEN t.id_estado_caso = ec_cerrado THEN 1 ELSE 0 END) AS tickets_cerrados
FROM dbo.profiles pr
LEFT JOIN dbo.tickets t ON (t.id_usuario = pr.id OR t.created_by = pr.id)
CROSS JOIN estados_casos (Abierto, Resuelto, Cerrado)
WHERE pr.tienda_id IS NOT NULL
GROUP BY pr.tienda_id, pr.tienda_nombre
```

### `dbo.vw_kpi_usuarios_by_tienda`
**Propósito:** KPIs de usuarios por tienda (respeta RLS)

```sql
SELECT 
    tienda_id, tienda_nombre,
    COUNT(*) AS total_usuarios,
    SUM(CASE WHEN DATEDIFF(DAY, last_login, SYSDATETIMEOFFSET()) < 7 THEN 1 ELSE 0 END) AS usuarios_activos_semana
FROM dbo.profiles
WHERE tienda_id IS NOT NULL AND tienda_id != ''
GROUP BY tienda_id, tienda_nombre
```

---

## 13. Seed Data (Datos Iniciales)

### Roles (4)
- `super_admin` — Acceso total
- `admin` — Administrador
- `user` — Usuario estándar
- `SPTienda` — Punto de venta

### Permisos (10)
- `tickets:view`, `tickets:create`, `tickets:edit`, `tickets:delete`
- `customers:view`, `customers:create`, `customers:edit`, `customers:delete`
- `dashboard:view`
- `admin:users`

### Role Permissions
- `super_admin` → TODOS los permisos (CROSS JOIN)

### Motivos de Contacto (8)
- change_size, change_reference, warranty, return, coordinator_update, pqr, advice, balance_favor

### Sub-motivos (6)
- Todos bajo `coordinator_update`: Cambio de destino, Cambio de dirección, Retraso, Devolución, Hurto, Pérdida

### Estados de Casos (6)
- Abierto, En Proceso, Pendiente, Resuelto, Cerrado, Cancelado

### Tallas (18)
- XXS, XS, S, M, L, XL, XXL, 3XL, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46

### Marcas (2)
- Speedo, O'Neill

### Ciudades (48)
- Bogotá, Medellín, Cali, Barranquilla, Cartagena, Cúcuta, Soledad, Ibagué, Bucaramanga, Villavicencio, Santa Marta, Bello, Valledupar, Pereira, Buenaventura, Pasto, Manizales, Montería, Neiva, Soacha, Palmira, Riohacha, Sincelejo, Popayán, Itagüí, Floridablanca, Envigado, Tuluá, Tumaco, Dosquebradas, Apartadó, Girón, Uribia, Maicao, Piedecuesta, Yopal, Facatativá, Cartago, Fusagasugá, Chía, Magangué, Pitalito, Sogamoso, Turbo, Caucasia, Ipiales, Quibdó, Chiquinquirá

### Tipos de Comercio (2)
- Tienda Física, Ecommerce

---

## 14. API REST: Endpoints Completos

### Base URL: `/api`

### Autenticación

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/auth/register` | No | Registro de usuario (primero = super_admin) |
| POST | `/auth/login` | No | Login → cookie HttpOnly con JWT |
| POST | `/auth/logout` | Sí | Logout → limpia cookie |
| GET | `/auth/me` | Sí | Perfil del usuario actual |
| GET | `/auth/first-user` | No | Verifica si es el primer usuario |
| POST | `/auth/forgot-password` | No | Solicita reset de contraseña |
| POST | `/auth/reset-password` | No | Establece nueva contraseña con token |

### Tickets

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/tickets` | Sí | Listar tickets (filtros: q, estado, marca, motivo, startDate, endDate, nearExpiry, page, limit) |
| GET | `/tickets/next-number` | Sí | Previsualizar próximo número de ticket |
| GET | `/tickets/:id` | Sí | Detalle de ticket + soluciones |
| POST | `/tickets` | Sí | Crear ticket |
| PUT | `/tickets/:id` | Sí | Actualizar ticket |
| DELETE | `/tickets/:id` | Sí (admin/super_admin) | Eliminar ticket |
| POST | `/tickets/:id/soluciones` | Sí | Agregar solución a ticket |
| GET | `/tickets/lookups` | Sí | Lookups (marcas, motivos, sub-motivos, estados, tallas, ciudades, tipos_comercio) |
| GET | `/tickets/dashboard/stats` | Sí | Stats del dashboard (range: hoy, semana, mes, año, todo) |

### Clientes

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/customers` | Sí | Listar clientes (filtros: q, storeType, page, limit, includeDeleted) |
| GET | `/customers/:id` | Sí | Detalle de cliente |
| POST | `/customers` | Sí | Crear cliente |
| PUT | `/customers/:id` | Sí | Actualizar cliente |
| DELETE | `/customers/:id` | Sí | Soft-delete (deleted_at) |
| PUT | `/customers/:id/restore` | Sí | Restaurar cliente |
| GET | `/customers/:id/tickets` | Sí | Tickets de un cliente |

### Tiendas

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/tiendas` | Sí | Listar tiendas |
| POST | `/tiendas` | Sí | Crear tienda |
| PUT | `/tiendas/:id` | Sí | Actualizar tienda |

### Guías de Envío

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/guias/tienda/:tiendaId` | Sí | Guías de una tienda |
| POST | `/guias` | Sí | Crear guía (con pedidos opcionales) |
| PUT | `/guias/:id/status` | Sí | Actualizar estado de guía |
| PUT | `/guias/pedido/:pedidoId` | Sí | Actualizar estado de pedido |

### Pedidos

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/pedidos` | Sí | Crear pedido |

### Marcas

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/marcas` | Sí | Listar marcas |

### Archivos

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/files/evidence` | Sí | Subir evidencia de ticket |
| GET | `/files/download/:filename` | Sí | Descarga segura de archivo |
| DELETE | `/files/:id` | Sí (admin/super_admin) | Eliminar archivo |

### Notificaciones

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/notifications/unread` | Sí | Notificaciones no leídas |
| PUT | `/notifications/:id/read` | Sí | Marcar como leída |
| PUT | `/notifications/read-all` | Sí | Marcar todas como leídas |

### Usuarios

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/users` | Sí | Listar usuarios |
| POST | `/users/invite` | Sí (admin) | Invitar usuario |
| GET | `/users/:id/permissions` | Sí | Permisos de usuario |
| PUT | `/users/:id/permissions` | Sí (admin) | Actualizar permisos |
| PUT | `/users/:id/profile` | Sí | Actualizar perfil |
| PUT | `/users/:id/password` | Sí | Cambiar contraseña |
| PUT | `/users/:id/role` | Sí (admin) | Cambiar rol |
| DELETE | `/users/:id` | Sí (admin) | Eliminar usuario |
| GET | `/roles` | Sí | Listar roles |
| GET | `/permissions` | Sí | Listar permisos |

### Comunicaciones

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/comms/marcas` | Sí | Marcas con config de comunicaciones |
| GET | `/comms/templates` | Sí | Plantillas de comunicación |
| POST | `/comms/send-email` | Sí | Enviar email |

### Health Check

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/health` | No | Health check |

---

## 15. Middleware de Autenticación y Autorización

### `authenticate`
1. Busca token en `req.cookies.token` (cookie HttpOnly)
2. Si no existe, busca en `Authorization: Bearer <token>`
3. Verifica token con `verifyToken()` (jsonwebtoken)
4. Decodifica → `req.user = { userId, email, role, roleId }`
5. Si inválido → 401

### `authorize(...allowedRoles)`
1. Verifica `req.user.role` está en `allowedRoles`
2. Si no → 403

### Flujo de Autenticación

```
1. POST /auth/login → valida credenciales → bcrypt.compare()
2. Si válido → generateToken({ userId, email, role, roleId })
3. res.cookie('token', jwt, { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 24h })
4. Reset failed_attempts = 0, lockout_until = NULL, last_login = now
5. Si tienda_id → activa tienda (is_active = 1)
6. Log audit en audit_log
```

### Bloqueo de Cuenta
- 3 intentos fallidos → bloqueo de 15 minutos
- `failed_attempts` incrementa con cada fallo
- `lockout_until` se establece tras 3 intentos

---

## 16. Sistema de RLS en el Backend

### `executeWithRLS(userId, role, queryOrAction, params, tiendaId)`

**Patrón 1: Query simple (batch)**
```typescript
const request = pool.request();
params.forEach(p => request.input(p.name, p.type, p.value));
request.input('RLS_UserId', sql.UniqueIdentifier, userId);
request.input('RLS_UserRole', sql.NVarChar(100), role);
request.input('RLS_TiendaId', sql.UniqueIdentifier, tiendaId);

const batch = `
  EXEC sp_set_session_context @key = N'UserId', @value = @RLS_UserId;
  EXEC sp_set_session_context @key = N'UserRole', @value = @RLS_UserRole;
  EXEC sp_set_session_context @key = N'TiendaId', @value = @RLS_TiendaId;
  ${queryOrAction}
`;
return request.query(batch);
```

**Patrón 2: Función callback (transacción)**
```typescript
const transaction = new sql.Transaction(pool);
await transaction.begin();
const request = transaction.request();
// Set context
const result = await queryOrAction(request, transaction);
await transaction.commit();
```

### `setRLSContext(request, userId, userRole, tiendaId)`
Establece contexto en un request existente (usado en controladores que necesitan múltiples queries en el mismo contexto).

---

## 17. Servicios (Email y Notificaciones)

### EmailService

**Proveedor:** Resend API (patrón adaptador: ResendProvider + MockSMTPProvider)

**Métodos:**
| Método | Descripción |
|---|---|
| `sendEmail({ to, subject, html })` | Envía email vía Resend |
| `getRegistrationConfirmationHtml(name, email)` | Template de registro |
| `getPasswordResetHtml(name, resetUrl)` | Template de reset password |
| `getGuiaEnvioHtml(guia, pedidos)` | Template de guía de envío |
| `getTicketAssignedHtml(ticket)` | Template de ticket asignado |

### NotificationService

**Métodos:**
| Método | Descripción |
|---|---|
| `notifyTicketAssigned(ticketId, agentId, ticketInfo)` | Crea notificación + email al agente |
| `notifyGuiaCreated(tiendaEmail, guia, pedidos)` | Notifica nueva guía a tienda |
| `createNotification({ tipo, titulo, mensaje, user_id, roles_destino, metadata })` | Crea notificación en BD |

### Tipos de Notificación

| Tipo | Descripción | Destino |
|---|---|---|
| `ticket_asignado` | Ticket asignado a agente | user_id del agente |
| `nueva_guia` | Nueva guía creada | roles_destino = 'super_admin,admin' |
| `guia_recibida` | Guía recibida en tienda | user_id o roles |
| `paquete_entregado` | Paquete entregado | user_id o roles |

---

## 18. Seguridad y Hardening

### Medidas Implementadas

| Medida | Descripción | Referencia |
|---|---|---|
| **Cookies HttpOnly** | JWT en cookie HttpOnly (no localStorage) | SEC-05 |
| **Helmet** | Cabeceras de seguridad HTTP | SEC-04 |
| **CORS estricto** | Orígenes permitidos vía `ALLOWED_ORIGINS` | SEC-01 |
| **Cifrado DB** | `encrypt: true` en producción | SEC-02 |
| **Archivos protegidos** | Sin acceso público a `/uploads` | SEC-03 |
| **Descarga segura** | Endpoint `/api/files/download/:filename` con auth + RLS | SEC-03 |
| **Error boundary** | No expone stack traces en producción | SEC-07 |
| **Rate limiting** | Auth: 20 req/15min, API: 500 req/15min | — |
| **Validación Zod** | Esquemas en rutas críticas | CAL-02 |
| **Logging estructurado** | Winston + Morgan con rotación | CAL-01 |
| **RLS en SQL Server** | Aislamiento de datos por rol/tienda | — |
| **Bcrypt 12 rounds** | Hash de contraseñas | — |
| **Account lockout** | 3 intentos → 15 min bloqueo | — |
| **Audit log** | Registro de acciones sensibles con IP + user-agent | — |
| **Triggers de protección** | Previene eliminación de super_admin | — |
| **Magic bytes validation** | Validación real de tipo de archivo | — |

---

## 19. Variables de Entorno

### Backend (.env)

| Variable | Descripción | Ejemplo |
|---|---|---|
| `PORT` | Puerto del servidor | `3000` |
| `DB_USER` | Usuario de SQL Server | `sa` |
| `DB_PASSWORD` | Contraseña de SQL Server | `your_password` |
| `DB_NAME` | Nombre de la base de datos | `SwimmingCRM` |
| `DB_SERVER` | Servidor de SQL Server | `localhost` |
| `DB_PORT` | Puerto de SQL Server | `1433` |
| `DB_ENCRYPT` | Cifrado de conexión | `true` |
| `DB_TRUST_CERT` | Confiar en certificado | `true` |
| `JWT_SECRET` | Secreto para JWT | `your_secret` |
| `JWT_EXPIRES_IN` | Expiración del token | `24h` |
| `SITE_URL` | URL del frontend | `http://localhost:5173` |
| `ALLOWED_ORIGINS` | Orígenes CORS permitidos | `http://localhost:5173` |
| `RESEND_API_KEY` | API key de Resend | `re_xxx` |
| `EMAIL_PROVIDER` | Proveedor de email | `resend` |
| `NODE_ENV` | Entorno | `development` / `production` |

### Frontend (.env)

| Variable | Descripción | Ejemplo |
|---|---|---|
| `VITE_API_URL` | URL de la API | `http://localhost:3000/api` |
| `VITE_SITE_URL` | URL del frontend | `http://localhost:5173` |

---

## 20. Consideraciones para Reconstrucción

### 20.1 Patrones de Diseño del Backend

1. **Controller-Route separation**: Cada dominio tiene su controlador y archivo de rutas
2. **RLS Context Pattern**: TODAS las queries pasan por `executeWithRLS()`
3. **OUTPUT clause**: INSERT/UPDATE retornan datos creados sin queries adicionales
4. **Transaction-based operations**: Operaciones complejas usan transacciones
5. **Dynamic SQL building**: Queries se construyen dinámicamente con filtros opcionales
6. **Lazy import**: Servicios se importan dinámicamente cuando se necesitan (ej: NotificationService)

### 20.2 Convenciones de Código

- **Imports**: Rutas relativas desde `src/`
- **Naming**: camelCase para funciones/variables, PascalCase para clases
- **Tipado**: Interfaces TypeScript para todos los request/response
- **Errores**: `res.status(500).json({ error: '...' })`
- **Respuestas exitosas**: `{ data: ..., message: ... }` o `{ data: ..., pagination: ... }`

### 20.3 Dependencias Críticas del Backend

```json
{
  "express": "4.x",
  "mssql": "latest",
  "bcrypt": "latest",
  "jsonwebtoken": "latest",
  "zod": "latest",
  "helmet": "latest",
  "cors": "latest",
  "cookie-parser": "latest",
  "express-rate-limit": "latest",
  "morgan": "latest",
  "winston": "latest",
  "dotenv": "latest",
  "multer": "latest",
  "resend": "latest"
}
```

### 20.4 Notas Importantes para el Agente Constructor

1. **SQL Server es el motor de base de datos.** No usar PostgreSQL, MySQL ni otros.
2. **RLS es nativo de SQL Server** usando `SESSION_CONTEXT` + security policies.
3. **Las secuencias** reemplazan a las secuencias PostgreSQL (`NEXT VALUE FOR`).
4. **Los triggers INSTEAD OF** se usan para generación de números de ticket.
5. **Las cookies HttpOnly** manejan autenticación, NO localStorage.
6. **`executeWithRLS()`** es CRÍTICO — todas las queries deben usarlo.
7. **El patrón de transacciones** asegura que el contexto RLS persista en el pool.
8. **Los índices** están optimizados para las queries más frecuentes.
9. **El seed data** es idempotente — puede ejecutarse múltiples veces sin duplicar.
10. **El script master** `swimming_all_db.sql` crea toda la BD desde cero.
11. **TypeScript** es estricto — todos los tipos deben estar definidos.
12. **Zod** valida los schemas de request en rutas críticas.
13. **Winston** maneja logging con rotación de archivos.
14. **Rate limiting** se deshabilita en desarrollo (`NODE_ENV !== 'production'`).

### 20.5 Flujo de Creación de Ticket

```
1. Frontend → POST /api/tickets con datos del cliente + ticket
2. Backend → executeWithRLS(userId, role, query, params)
3. Query → Determina prefijo según rol/marca
4. Query → NEXT VALUE FOR seq_ticket_xxx
5. Query → INSERT INTO tickets (ticket_numero, ...)
6. Trigger → trg_generate_ticket_number (si no se generó en query)
7. Trigger → trg_tickets_updated_at (en UPDATE futuro)
8. Backend → Notificar agente asignado (NotificationService)
9. Backend → Retorna { data: createdTicket, message: '...' }
```

### 20.6 Flujo de Autenticación

```
1. POST /auth/login → { email, password }
2. Query → SELECT profiles JOIN roles WHERE email = @email
3. bcrypt.compare(password, password_hash)
4. Si inválido → increment failed_attempts, lockout si >= 3
5. Si válido → generateToken({ userId, email, role, roleId })
6. res.cookie('token', jwt, { httpOnly, secure, sameSite, maxAge })
7. Query → UPDATE profiles SET failed_attempts=0, lockout_until=NULL, last_login=now
8. Si tienda_id → UPDATE tiendas SET is_active=1
9. Audit → INSERT INTO audit_log
10. Retorna { user: { id, email, full_name, role } }
```

### 20.7 Estructura de Roles y Permisos en BD

| Rol | Permisos por Defecto | Acceso RLS |
|---|---|---|
| `super_admin` | TODOS | Ve todo (db_owner bypass) |
| `admin` | Todos excepto admin:users | Ve todo (fn_is_admin) |
| `user` | tickets:view/create, customers:view/create, dashboard:view | Ve sus propios tickets |
| `SPTienda` | tickets:view/create, dashboard:view | Solo tickets creados/asignados + su tienda |

### 20.8 Migraciones

| Archivo | Propósito |
|---|---|
| `swimming_all_db.sql` | Script master (crear BD completa desde cero) |
| `003_add_sptienda_rls_rules.sql` | RLS avanzado para SPTienda (predicados, triggers, vistas KPI) |
| `migrations/001_add_numero_pedido_to_pedidos_guia.sql` | Agregar columnas `numero_pedido` y `nota` |
| `migrations/002_add_user_id_to_notificaciones.sql` | Agregar `user_id` a notificaciones |

---

## Apéndice A: Reglas de Negocio Implementadas en BD

### Cálculo de Fecha Límite de Tickets

| Motivo | Regla |
|---|---|
| `advice` (Asesoría) | Sin fecha límite (NULL) |
| `coordinator_update` + "Hurto"/"Pérdida" | 30 días calendario |
| Todos los demás | 15 días hábiles |

### Generación de Números de Ticket

| Condición | Prefijo | Secuencia |
|---|---|---|
| Rol = SPTienda | `SPTK-` | `seq_ticket_sptk` |
| Marca = Speedo | `STK-` | `seq_ticket_stk` |
| Marca = O'Neill | `OTK-` | `seq_ticket_otk` |
| Otro | `TKT-` | `seq_ticket_tkt` |

### Bloqueo de Cuenta

| Intentos Fallidos | Acción |
|---|---|
| 1-2 | Incrementar contador |
| 3+ | Bloquear 15 minutos (`lockout_until`) |

### Soft Delete de Clientes

- `deleted_at` se establece con `SYSDATETIMEOFFSET()`
- Queries excluyen clientes con `deleted_at IS NOT NULL` por defecto
- `includeDeleted=true` incluye todos
- Restaurar → `deleted_at = NULL`

---

## Apéndice B: Historial de Versiones Relevante para BD

| Versión | Cambios DB Significativos |
|---|---|
| v1.8.0 | Refactorización de estados de tickets |
| v1.7.0 | Campos `fecha_compra`, `valor_compra`, `solucion_esperada` en tickets |
| v1.6.0 | RLS para SPTienda, vistas KPI, triggers de protección |
| v1.5.0 | Cookies HttpOnly, Helmet, CORS, Zod validation, audit_log |
| v1.4.0 | `config_comunicaciones`, columnas de comunicación en marcas |
| v1.3.0 | `tipos_comercio`, FK `id_tipo_comercio` en tiendas/customers/tickets |
| v1.2.0 | Asignación de agentes, notificaciones, plantillas dinámicas |
| v1.1.0-B | Migración a SQL Server, RLS nativo, almacenamiento local |
| v1.0.0 | Migración completa desde Supabase/PostgreSQL |
| v0.2.9 | Magic bytes validation, rate limiting, audit infrastructure |
| v0.2.6 | `notificaciones`, `pedido_evidencias`, `ticket_archivos` |
| v0.2.5 | `soluciones_tickets`, trigger de generación de tickets |
| v0.2.1-B | Desacoplamiento de Supabase, almacenamiento local |
| v0.2.1 | `tiendas`, `guias_envio`, `pedidos_guia`, edge function notify-guia |
| v0.2.0 | Soft delete de clientes, soluciones de tickets |

---

> **Fin del documento.** Este archivo contiene toda la información necesaria para reconstruir la base de datos y el backend del CRM Swim con fidelidad completa.
