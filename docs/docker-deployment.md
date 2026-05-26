# 🐳 Guía de Despliegue con Docker - Swimming CRM

Esta guía detalla los pasos necesarios para desplegar y mantener el sistema Swimming CRM (Frontend y Backend) utilizando contenedores Docker.

## 📋 Requisitos Previos

*   **Docker** instalado (v20.10+).
*   **Docker Compose** instalado (v2.0+).
*   **Git** configurado en el servidor.
*   Acceso a la base de datos SQL Server (externa o en contenedor).

---

## 🚀 Despliegue Inicial

Sigue estos pasos la primera vez que instales el sistema en el servidor:

1.  **Clonar el repositorio:**
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd swimming
    ```

2.  **Configurar variables de entorno:**
    Crea el archivo `.env` en la carpeta `backend/` basándote en el archivo de ejemplo (si existe) o con las credenciales necesarias:
    ```bash
    nano backend/.env
    ```
    *Asegúrate de configurar `DB_SERVER`, `DB_USER`, `DB_PASSWORD` y `JWT_SECRET`.*

3.  **Construir y levantar los contenedores:**
    Desde la raíz del proyecto, ejecuta:
    ```bash
    docker-compose up --build -d
    ```
    *Esto compilará el código de TypeScript para el backend y generará el build de producción de Vite para el frontend.*

4.  **Verificar el estado:**
    ```bash
    docker-compose ps
    ```
    El sistema debería estar disponible en el puerto `8080` para el frontend y `3000` para el backend (interno).

---

## 🔗 Conectividad con la Base de Datos (Estrategia Profesional)

Si la base de datos se encuentra en un contenedor independiente (fuera de este proyecto), la forma más segura y profesional de conectarlos en un servidor Linux es mediante una **Docker Network** compartida.

### 1. Crear la red compartida
Ejecuta este comando una sola vez en el servidor para crear el canal de comunicación:
```bash
docker network create swimming-network
```

### 2. Conectar el contenedor de la Base de Datos
Debes unir el contenedor de tu base de datos a esta nueva red:
```bash
docker network connect swimming-network <NOMBRE_CONTENEDOR_DB>
```

### 3. Configurar el `docker-compose.yml` del CRM
Asegúrate de que tus servicios estén configurados para usar esta red externa en el archivo `docker-compose.yml`:

```yaml
services:
  backend:
    # ... otras configuraciones
    networks:
      - swimming-network

  frontend:
    # ... otras configuraciones
    networks:
      - swimming-network

networks:
  swimming-network:
    external: true
```

### 4. Configurar los archivos `.env` para Producción

En producción (VPS), debes ajustar los archivos de entorno tanto para el Backend como para el Frontend.

#### A. Backend (`backend/.env`)
Debes configurar las variables considerando los puertos expuestos, los dominios o IPs públicas, y la ubicación de la Base de Datos:

```env
# Puerto interno de la API en el contenedor
PORT=3000

# Entorno optimizado para producción
NODE_ENV=production

# URL mediante la cual los usuarios entran al frontend. Reemplaza con IP o Dominio.
SITE_URL=http://<IP_DE_TU_VPS>:8080

# Seguridad CORS: Exactamente la misma URL del SITE_URL (sin barra final).
ALLOWED_ORIGINS=http://<IP_DE_TU_VPS>:8080

# Si SQL Server está como servicio en la VPS (fuera de Docker), usa la IP pública o LAN de la VPS.
# Si SQL Server está en un contenedor en la misma 'swimming-network', usa el nombre de ese contenedor.
DB_SERVER=<IP_VPS_O_NOMBRE_CONTENEDOR>
DB_PORT=1433
DB_NAME=SwimmingCRM
DB_USER=sa
DB_PASSWORD=<TU_CONTRASEÑA>

# ==========================================
# CONFIGURACIÓN DE CORREO (SMTP / RESEND)
# ==========================================
# NOTA: No necesitas configurar manualmente las credenciales de correo (SMTP_HOST, SMTP_USER, etc.) 
# en este momento. El sistema permite modificar estos valores dinámicamente desde el propio 
# panel de administración (Frontend) del CRM una vez que inicies sesión.
```

#### B. Frontend (`frontend/.env`)
Sí, el Frontend también necesita conocer la ruta del Backend para poder enviarle peticiones desde el navegador del cliente. 

Crea el archivo `frontend/.env` copiando el `.env.example`:
```bash
nano frontend/.env
```
Y configura el `VITE_API_URL` apuntando a la IP (o dominio) y puerto del backend público (o al proxy, si usas uno):
```env
# Reemplaza con la IP pública de tu VPS apuntando al puerto del backend (o al puerto 80/443 si usas Nginx Proxy)
# IMPORTANTE: Esta URL debe ser alcanzable desde el navegador de tus usuarios, no es una IP interna de Docker.
VITE_API_URL=http://<IP_DE_TU_VPS>:3000/api
```

---

## 🔄 Procedimiento de Actualización (Paso a Paso)

Cuando realices cambios en el código y los subas a GitHub, sigue este procedimiento en el servidor para aplicar las actualizaciones:

### Paso 1: Obtener los últimos cambios
```bash
git pull origin main
```
*Si tienes cambios locales sin guardar, puedes usar `git stash` antes del pull.*

### Paso 2: Re-construir imágenes y reiniciar servicios
Para que Docker reconozca los cambios en el código fuente, es necesario reconstruir las imágenes:
```bash
docker-compose up --build -d
```
*Docker detectará qué archivos han cambiado y solo reconstruirá las capas necesarias. Los servicios se reiniciarán automáticamente sin pérdida de datos en la base de datos externa.*

### Paso 3: Limpiar imágenes antiguas (Opcional)
Con el tiempo, las reconstrucciones pueden dejar imágenes "huérfanas" (dangling) que ocupan espacio. Puedes limpiarlas con:
```bash
docker image prune -f
```

---

## 🤖 Automatización con GitHub Actions (CI/CD)

El sistema está configurado para actualizarse automáticamente cada vez que se realiza un `push` a la rama `main`.

### 1. Configuración de Secretos en GitHub
Para que el flujo funcione, debes agregar los siguientes **Secrets** en tu repositorio de GitHub (`Settings > Secrets and variables > Actions`):

*   **`SSH_HOST`**: La dirección IP o dominio de tu servidor.
*   **`SSH_USER`**: El usuario con el que te conectas al servidor (ej: `root` o `ubuntu`).
*   **`SSH_KEY`**: El contenido de tu clave privada SSH (generalmente el archivo `~/.ssh/id_rsa`).
*   **`SSH_PORT`**: (Opcional) Puerto SSH del servidor, por defecto es `22`.
*   **`DEPLOY_PATH`**: (Opcional) La ruta absoluta donde se encuentra el proyecto en el servidor (ej: `/var/www/swimming`).

### 2. Funcionamiento del Workflow
El archivo de configuración se encuentra en `.github/workflows/deploy.yml`. Cada vez que envíes cambios a GitHub:
1.  GitHub inicia un runner virtual.
2.  Se conecta a tu servidor vía SSH de forma segura.
3.  Ejecuta los comandos de actualización definidos en el [Paso 2](#paso-2-re-construir-imágenes-y-reiniciar-servicios).

---

## 🛠️ Comandos de Utilidad

### Ver Logs en tiempo real
Si algo no funciona correctamente, revisa los logs del backend:
```bash
docker-compose logs -f backend
```

### Reiniciar sin reconstruir
Si solo necesitas reiniciar los servicios sin aplicar cambios de código:
```bash
docker-compose restart
```

### Apagar el sistema
```bash
docker-compose down
```

---

## 🔒 Notas de Seguridad

1.  **HTTPS:** Se recomienda encarecidamente utilizar un proxy inverso como **Nginx Proxy Manager** o **Traefik** con certificados SSL (Let's Encrypt) delante de estos contenedores.
2.  **Secretos:** Nunca subas el archivo `.env` a GitHub. Manténlo únicamente en el servidor de producción.
3.  **Acceso a DB:** Asegúrate de que el firewall del servidor SQL permita la conexión desde la IP del servidor de Docker o desde la red interna de Docker.
