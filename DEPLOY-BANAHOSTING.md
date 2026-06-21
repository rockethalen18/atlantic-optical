# Guía de Deploy - Atlantic Optical en Banahosting

## 📋 Pasos para Subir al Hosting

### 1. Subir archivos del Frontend (estático)

1. **Subir el contenido de la carpeta `out/`** a la carpeta `public_html` de tu hosting en Banahosting
   - Puedes usar el File Manager de cPanel o FTP
   - Todo lo que está en `out/` va directamente a `public_html/`

2. **Subir la carpeta `backend/`** a `public_html/backend/`
   - Esto permite que la API PHP funcione en `tudominio.com/backend/api/`

### 2. Configurar la Base de Datos MySQL

1. En cPanel ve a **"MySQL Databases"**
2. Crea una nueva base de datos: `atlantic_optical`
3. Crea un usuario MySQL y agrégalo a la base de datos con TODOS los permisos
4. Ve a **"phpMyAdmin"** y selecciona la base de datos `atlantic_optical`
5. Importa el archivo `database/schema.sql`
6. **Importante**: Cambia la contraseña del usuario admin en la tabla `users`

### 3. Configurar la Conexión a la Base de Datos

Edita el archivo `backend/config/database.php` y cambia estas líneas:

```php
$this->host = 'localhost';
$this->db_name = 'atlantic_optical';  // Nombre de tu base de datos
$this->username = 'tu_usuario_mysql';  // Usuario MySQL de cPanel
$this->password = 'tu_contraseña';     // Contraseña del usuario MySQL
```

### 4. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz de `public_html/` con:

```
NEXT_PUBLIC_API_URL=https://tudominio.com/backend/api
```

### 5. Configurar .htaccess

El archivo `.htaccess` ya está incluido en `backend/`. Asegúrate de que esté en `public_html/backend/.htaccess`

### 6. Permisos de Archivos

En cPanel > File Manager, asegúrate de que:
- `backend/uploads/` tenga permisos `755` o `777` (para subir imágenes)
- Todos los archivos `.php` tengan permisos `644`
- Todas las carpetas tengan permisos `755`

---

## 🔧 Estructura de Archivos en el Hosting

```
public_html/
├── index.html              ← Homepage principal
├── favicon.ico
├── admin/                  ← Panel de administración
│   ├── index.html
│   ├── productos/
│   ├── costos/
│   ├── importar/
│   └── pedidos/
├── productos/              ← Catálogo de productos
├── carrito/                ← Carrito de compras
├── _next/                  ← Archivos JS/CSS de Next.js
│   └── static/
├── backend/                ← API PHP
│   ├── api/
│   │   ├── index.php       ← Router principal
│   │   ├── products.php
│   │   ├── categories.php
│   │   ├── shipping.php
│   │   ├── orders.php
│   │   ├── auth.php
│   │   ├── import.php
│   │   ├── export.php
│   │   ├── settings.php
│   │   ├── sections.php
│   │   ├── pricing.php
│   │   └── dashboard.php
│   ├── config/
│   │   ├── database.php    ← Configurar credenciales aquí
│   │   └── helpers.php
│   ├── uploads/            ← Imágenes subidas
│   └── .htaccess
└── .env                    ← Variables de entorno
```

---

## 🔄 Reconstruir el Proyecto (después de cambios)

Si haces cambios en el código:

```bash
# En tu computadora
cd atlantic-optical
npm run build
npx next build

# Subir solo la carpeta 'out/' al hosting
```

---

## 🐛 Solución de Problemas

### Error 500 en la API
- Verifica las credenciales de MySQL en `backend/config/database.php`
- Revisa los permisos de la carpeta `backend/uploads/`

### Página en blanco
- Verifica que `NEXT_PUBLIC_API_URL` apunte a la API correcta
- Revisa la consola del navegador (F12) para errores

### Imágenes no cargan
- Verifica permisos de la carpeta `uploads/`
- Asegúrate de que las URLs de imágenes sean accesibles

### CSS/JS no carga
- Verifica que la carpeta `_next/static/` esté completa en `public_html`

---

## 📧 Correo Electrónico

Para configurar formularios de contacto, usa el correo de cPanel:
- `info@atlanticoptical.com` (o el que configures)

---

## 🔒 SSL (HTTPS)

Banahosting incluye SSL gratuito. Actívalo desde cPanel > "SSL/TLS Status"

---

## 📊 Google Analytics

Agrega tu ID de Google Analytics en `src/app/layout.tsx` o en un archivo de tracking.
