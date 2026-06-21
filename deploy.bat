@echo off
REM ============================================
REM Atlantic Optical - Deploy Script para Windows
REM ============================================
REM
REM USO:
REM   deploy.bat              (deploy completo)
REM   deploy.bat frontend     (solo frontend)
REM   deploy.bat backend      (solo backend)
REM
REM ============================================

echo ========================================
echo   Atlantic Optical - Deploy Script
echo ========================================
echo.

REM Verificar que exista .env.deploy
if not exist .env.deploy (
    echo ERROR: Archivo .env.deploy no encontrado
    echo Copia .env.deploy.example a .env.deploy y llena tus datos
    pause
    exit /b 1
)

REM Cargar variables (Windows style)
for /f "usebackq tokens=1,* delims==" %%A in (".env.deploy") do (
    set "%%A=%%B"
)

REM Construir frontend
if "%1"=="frontend" goto :frontend
if "%1"=="backend" goto :backend

echo.
echo [1/2] Construyendo frontend...
call npm run build
call npx next build

if %errorlevel% neq 0 (
    echo ERROR: Error al construir el frontend
    pause
    exit /b 1
)

echo [2/2] Subiendo archivos a Banahosting...
echo NOTA: Para subir archivos usa File Manager de cPanel o un cliente FTP como FileZilla
echo.
echo Frontend: Sube el contenido de la carpeta 'out\' a /public_html/
echo Backend:  Sube la carpeta 'backend\' a /public_html/backend/
echo.
echo Presiona cualquier tecla para abrir la carpeta de salida...
pause > nul
explorer "out"
goto :end

:frontend
echo Construyendo frontend...
call npm run build
call npx next build
echo Frontend construido en la carpeta 'out\'
explorer "out"
goto :end

:backend
echo Backend listo en la carpeta 'backend\'
explorer "backend"
goto :end

:end
echo.
echo Deploy completado!
echo.
