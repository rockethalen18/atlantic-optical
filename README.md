# 🏥 Atlantic Optical - Ecommerce

Ecommerce profesional para equipamiento óptico con diseño inmersivo, GSAP animations, costos variables de envío desde China, y panel de administración completo.

## 🚀 Instrucciones de Setup

### 1. Instalar Git (si no lo tienes)

Descarga e instala Git desde: https://git-scm.com/download/win

Durante la instalación, selecciona las opciones por defecto.

### 2. Instalar Node.js (si no lo tienes)

Descarga e instala Node.js desde: https://nodejs.org (versión LTS)

### 3. Abrir el proyecto

```powershell
# Abre PowerShell y navega al proyecto
cd "C:\Users\sebas\OneDrive\Desktop\webs\Atlantic Optical\atlantic-optical"

# Inicia el servidor de desarrollo
npm run dev
```

Abre tu navegador en: **http://localhost:3000**

---

## 📦 Crear Repositorio en GitHub

### Paso 1: Crear repo en GitHub
1. Ve a https://github.com/new
2. Nombre: `atlantic-optical`
3. Visibilidad: **Private** (recomendado)
4. NO marques "Add a README" (ya tenemos archivos)
5. Click en **Create repository**

### Paso 2: Conectar tu proyecto con GitHub
```powershell
cd "C:\Users\sebas\OneDrive\Desktop\webs\Atlantic Optical\atlantic-optical"

# Inicializar Git
git init
git add -A
git commit -m "Initial commit: Atlantic Optical ecommerce"

# Conectar con GitHub (reemplaza TU_USUARIO)
git remote add origin https://github.com/TU_USUARIO/atlantic-optical.git

# Subir código
git branch -M main
git push -u origin main
```

---

## 🌐 Deploy a Banahosting

### OPCIÓN A: Deploy Manual (más fácil)

1. En tu computadora, ejecuta:
```powershell
npm run build
npx next build
```

2. Sube el contenido de la carpeta `out/` a `/public_html/` en tu hosting
3. Sube la carpeta `backend/` a `/public_html/backend/` en tu hosting
4. Importa `database/schema.sql` en phpMyAdmin

### OPCIÓN B: Deploy Automático con GitHub Actions

#### Paso 1: Configurar secrets en GitHub
1. Ve a tu repo en GitHub → **Settings** → **Secrets and variables** → **Actions**
2. Crea estos secrets:
   - `FTP_HOST`: ftp.tudominio.com
   - `FTP_USER`: usuario@tudominio.com
   - `FTP_PASS`: tu contraseña FTP

#### Paso 2: Configurar Banahosting
1. En cPanel ve a **Git Version Control**
2. Click en **Create**
3. Ingresa la URL de tu repo: `https://github.com/TU_USUARIO/atlantic-optical.git`
4. Selecciona la rama: `main`
5. Click en **Create & Deploy**

**¡Listo!** Cada vez que hagas `git push`, los cambios se despliegan automáticamente.

### OPCIÓN C: Deploy con FTP (FileZilla)

1. Descarga e instala FileZilla: https://filezilla-project.org/
2. Configura la conexión:
   - Host: `ftp.tudominio.com`
   - Usuario: `usuario@tudominio.com`
   - Contraseña: `tu_contraseña`
   - Puerto: `21`
3. Sube los archivos:
   - `out/` → `/public_html/`
   - `backend/` → `/public_html/backend/`

---

## ⚙️ Configurar Base de Datos

1. En cPanel ve a **MySQL Databases**
2. Crea base de datos: `atlantic_optical`
3. Crea usuario MySQL y agrégalo con todos los permisos
4. Ve a **phpMyAdmin**, selecciona la BD
5. Click en **Import** → selecciona `database/schema.sql`
6. Editar `backend/config/database.php` con tus credenciales

---

## 📁 Estructura del Proyecto

```
atlantic-optical/
├── backend/          → API PHP (subir a /public_html/backend/)
├── database/         → Schema SQL (para importar en phpMyAdmin)
├── src/              → Código fuente Next.js
├── out/              → Build estático (subir a /public_html/)
├── .github/workflows/ → Deploy automático
├── deploy.sh         → Script deploy Linux/Mac
├── deploy.bat        → Script deploy Windows
└── DEPLOY-BANAHOSTING.md → Guía completa
```

---

## 🎨 Personalización

### Cambiar colores
Edita `src/app/globals.css`:
```css
:root {
  --primary: #006535;      /* Color principal (verde) */
  --primary-dark: #004d28; /* Verde oscuro */
  --secondary: #1a1a1a;    /* Negro */
  --accent: #FFA110;       /* Naranja (badges) */
}
```

### Cambiar logo
Edita `src/components/layout/Header.tsx` y `Footer.tsx`

### Agregar productos
Ve al panel de admin: `http://localhost:3000/admin/productos`

---

## 🔧 Comandos Útiles

```powershell
# Desarrollo
npm run dev                    # Iniciar servidor local

# Build
npm run build                  # Build de producción
npx next build                 # Build para deploy

# Deploy
git add -A                     # Agregar cambios
git commit -m "mensaje"        # Commit
git push                       # Subir a GitHub (trigger deploy automático)
```

---

## 📞 Soporte

- Panel de admin: `http://localhost:3000/admin`
- Documentación: Ver `DEPLOY-BANAHOSTING.md`
