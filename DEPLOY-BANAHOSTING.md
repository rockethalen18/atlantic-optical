# Guía de Deploy y Mantenimiento - Atlantic Optical en Banahosting

Esta guía explica cómo se publica el sitio, dónde viven las credenciales y
qué hacer cuando algo falla.

---

## 1. Cómo está organizado el sitio

El hosting sirve **una sola carpeta** (la raíz del sitio). Dentro hay:

```
<raíz del sitio>/
├── index.html, _next/, productos/, images/…   ← el build estático (carpeta out/)
├── admin/                                       ← panel de administración (PHP)
├── backend/                                     ← API PHP
├── catalogos/products.json                      ← catálogo de 121 productos
└── .atlantic-secrets.php                         ← credenciales (FUERA del repositorio)
```

| Carpeta | Qué es | Origen |
|---|---|---|
| `out/` | Build estático de Next.js | `npm run build` |
| `admin/` | Panel de administración en PHP | Repositorio |
| `backend/` | API PHP | Repositorio |
| `catalogos/products.json` | Catálogo de productos | Repositorio |
| `.atlantic-secrets.php` | Credenciales | **Nunca está en el repositorio** |

---

## 2. 🔑 Credenciales (importante)

El repositorio de GitHub es **público**, así que **ninguna credencial puede
estar dentro de él**. Las credenciales viven en un archivo PHP que está en el
hosting, junto al sitio:

```
/home/azjnptoj/equipos.atlanticopticalgroup.com/.atlantic-secrets.php
```

Se sube por FTP (no está en Git):

```bash
curl -T .atlantic-secrets.php \
  "ftp://204.93.224.102/equipos.atlanticopticalgroup.com/.atlantic-secrets.php" \
  --user "deploy@equipos.atlanticopticalgroup.com:TU_CONTRASEÑA"
```

Formato del archivo:

```php
<?php
return [
    'DB_HOST'           => 'localhost',
    'DB_NAME'           => 'azjnptoj_atlantic',
    'DB_USER'           => 'azjnptoj_user',
    'DB_PASS'           => 'la contraseña de MySQL',
    'IMAGE_SYNC_SECRET' => 'clave para /admin/sync-*',
    'DEPLOY_KEY'        => 'clave para /admin/deploy-package',
];
```

> Es un archivo PHP que sólo devuelve un array, así que pedirlo por HTTP lo
> **ejecuta** y no devuelve nada. Además los archivos que empiezan con punto
> están bloqueados por Apache (403).

El código lo lee desde `admin/includes/secrets.php` y
`backend/config/secrets.php`. Si el archivo falta, la API responde con un error
claro en lugar de fallar en silencio.

### Rotar una credencial

1. Cambia el valor en `.atlantic-secrets.php` (en el hosting).
2. Si es `IMAGE_SYNC_SECRET` o `DEPLOY_KEY`, actualiza también el secreto de
   GitHub:
   ```bash
   gh secret set IMAGE_SYNC_SECRET --body "el-nuevo-valor"
   gh secret set DEPLOY_KEY --body "el-nuevo-valor"
   ```

---

## 3. 🚀 Deploy automático (GitHub Actions)

Cada `push` a `main` dispara `.github/workflows/deploy.yml`:

1. Compila el sitio (`npm run build`, con 3 reintentos porque la fuente de
   Google a veces falla).
2. Empaqueta `out/`, `admin/`, `backend/` y el catálogo en un ZIP.
3. Sube el ZIP a `https://equipos.atlanticopticalgroup.com/admin/deploy-package`
   con la cabecera `X-Deploy-Key`.
4. El servidor descomprime el ZIP y lo aplica sobre el sitio vivo.
5. Sincroniza la base de datos (productos, imágenes y galería).
6. Verifica que el frontend, el catálogo y la API coincidan.

Tarda alrededor de **1 minuto y medio**.

### ¿Por qué HTTPS y no FTP?

El hosting rechaza los inicios de sesión FTP que llegan desde los servidores de
GitHub Actions (`530 Login authentication failed`), de forma intermitente. El
deploy por HTTPS es un solo archivo, es rápido y no depende de esa conexión.
FTP queda sólo como respaldo.

### El endpoint de deploy

`admin/deploy-package.php`:

- Sólo acepta `POST` y necesita la clave `DEPLOY_KEY`.
- Rechaza cualquier ruta del ZIP que pueda salirse de la raíz del sitio.
- Nunca sobrescribe `.atlantic-secrets.php`.
- **Fusiona** las carpetas en vez de reemplazarlas, así que las fotos que
  subes desde el panel de administración (`admin/uploads/`) nunca se borran.
- `_next/` sí se reemplaza completo, para que no se acumulen archivos viejos.

---

## 4. 🖼️ Fotos de productos

Las fotos de un producto se guardan en **dos sitios que siempre coinciden**:

| Dónde | Qué es |
|---|---|
| `product_images` (MySQL) | Lo que administra el panel (subidas y fotos borradas) |
| `catalogos/products.json` | El catálogo que pinta el frontend |

La regla de combinación está en `admin/includes/gallery.php`:

1. Primero las filas de `product_images` (lo que gère el panel).
2. Después las fotos del catálogo que todavía no estén en la base de datos.
3. Si no hay ninguna, la columna `image` del producto.

El panel y la API usan **ese mismo archivo**, así que es imposible que se
muestren fotos diferentes.

### Subir una foto y que aparezca en el sitio

1. Panel → Productos → editar un producto → **Subir foto**.
2. La foto se guarda en `admin/uploads/` y se anota en `product_images`.
3. El sitio la muestra **en el acto**, sin desplegar nada: el frontend pide
   la galería a la API en cuanto carga la página.

### Borrar una foto

Si borras una foto del catálogo desde el panel, se marca como oculta en
`product_images` y el frontend deja de mostrarla también.

> Las fotos que están en `catalogos/products.json` no se borran del disco al
> ocultarlas; se ocultan. La sincronización nunca vuelve a mostrar una foto
> oculta a mano.

---

## 5. 🔄 Sincronizaciones

Los endpoints en `/admin/sync-*` necesitan la clave `IMAGE_SYNC_SECRET`:

| Endpoint | Qué hace |
|---|---|
| `/admin/sync-products` | Crea las filas de los productos del catálogo que falten y oculta los registros rotos |
| `/admin/sync-images` | Corrige la foto principal de cada producto |
| `/admin/sync-gallery` | Copia la galería del catálogo a `product_images` |

Son idempotentes: se pueden ejecutar todas las veces que quieras.

---

## 6. 🛠️ Deploy manual (desde tu computadora)

Si el CI no está disponible:

```bash
npm run build

# Empaquetar
rm -rf .deploy && mkdir -p .deploy/site/admin .deploy/site/backend .deploy/site/catalogos
cp -r out/. .deploy/site/
cp -r admin/. .deploy/site/admin/
cp -r backend/. .deploy/site/backend/
cp catalogos/products.json .deploy/site/catalogos/products.json
cd .deploy && zip -qr ../deploy-package.zip site && cd ..

# Subir
curl --fail -X POST \
  -H "X-Deploy-Key: $DEPLOY_KEY" \
  -F "package=@deploy-package.zip" \
  https://equipos.atlanticopticalgroup.com/admin/deploy-package
```

---

## 7. 🐛 Solución de problemas

### Error 500 en la API
- Revisa que `.atlantic-secrets.php` exista en la raíz del sitio.
- Revisa los permisos: archivos `644`, carpetas `755`.
- La respuesta JSON suele decir `Database credentials are not configured`.

### El panel no deja iniciar sesión
- La sesión se guarda en cookies; comprueba que el navegador acepte cookies.
- La contraseña del panel está en la tabla `users` de la base de datos.

### Las fotos no cargan
- Verifica que `admin/uploads/` tenga permisos `755` o `777`.
- Comprueba la URL directamente en el navegador.

### El sitio parece viejo
- Puede que el navegador tenga la versión anterior en caché: recarga con `Ctrl+F5`.
- Revisa que el deploy haya terminado: `gh run list`.

### Las fotos se ven borrosas
- No uses un JPEG de menos de 1200 px de lado mayor.
- Las fotos se optimizan sin reducir resolución (`max 1200px`, calidad 85,
  progresivo, croma 4:2:0). Compara el tamaño del archivo en el servidor con
  el del repositorio: deberían coincidir byte a byte.

---

## 8. 📧 Correo Electrónico

Para los formularios de contacto, usa el correo de cPanel (`info@atlanticoptical.com`).

---

## 9. 🔒 SSL (HTTPS)

Banahosting incluye SSL gratuito. Actívalo desde cPanel > "SSL/TLS Status".

---

## 10. 📊 Google Tag Manager

Hay un placeholder `GTM-XXXXX` en `src/app/layout.tsx`. Sustitúyelo por el ID
real de Google Tag Manager antes de publicar la versión final.
