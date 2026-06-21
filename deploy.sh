# ============================================
# Atlantic Optical - Deploy Script para Banahosting
# ============================================
# 
# Este script automatiza el deploy a Banahosting via FTP
# 
# USO:
#   bash deploy.sh              (deploy completo)
#   bash deploy.sh frontend     (solo frontend)
#   bash deploy.sh backend      (solo backend)
#
# PREREQUISITOS:
#   1. Instalar lftp: brew install lftp (Mac) o apt install lftp (Linux)
#   2. Configurar variables en .env.deploy
#   3. Ejecutar desde la raíz del proyecto
# ============================================

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Cargar configuración
if [ -f .env.deploy ]; then
    export $(cat .env.deploy | grep -v '^#' | xargs)
else
    echo -e "${RED}Error: Archivo .env.deploy no encontrado${NC}"
    echo "Crea el archivo .env.deploy con tus credenciales FTP"
    exit 1
fi

# Variables por defecto
FTP_HOST=${FTP_HOST:-"ftp.atlanticoptical.com"}
FTP_USER=${FTP_USER:-"atlantic@atlanticoptical.com"}
FTP_PASS=${FTP_PASS:-""}
FTP_DIR=${FTP_DIR:-"/public_html"}
BUILD_DIR="out"
BACKEND_DIR="backend"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Atlantic Optical - Deploy Script${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Función para deploy del frontend
deploy_frontend() {
    echo -e "${YELLOW}📦 Construyendo frontend...${NC}"
    npm run build
    npx next build
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Error al construir el frontend${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Frontend construido exitosamente${NC}"
    echo ""
    
    echo -e "${YELLOW}🚀 Subiendo frontend a Banahosting...${NC}"
    lftp -c "
        set ftp:ssl-allow no;
        set mirror:parallel-transfer-count 5;
        open ftp://${FTP_USER}:${FTP_PASS}@${FTP_HOST};
        cd ${FTP_DIR};
        mirror -R --delete --verbose ${BUILD_DIR}/ .;
        quit;
    "
    
    echo -e "${GREEN}✅ Frontend desplegado exitosamente${NC}"
}

# Función para deploy del backend
deploy_backend() {
    echo -e "${YELLOW}🚀 Subiendo backend a Banahosting...${NC}"
    lftp -c "
        set ftp:ssl-allow no;
        set mirror:parallel-transfer-count 5;
        open ftp://${FTP_USER}:${FTP_PASS}@${FTP_HOST};
        cd ${FTP_DIR};
        mirror -R --delete --verbose ${BACKEND_DIR}/ backend/;
        quit;
    "
    
    echo -e "${GREEN}✅ Backend desplegado exitosamente${NC}"
}

# Ejecutar según argumento
case "${1:-all}" in
    frontend)
        deploy_frontend
        ;;
    backend)
        deploy_backend
        ;;
    all)
        deploy_frontend
        deploy_backend
        ;;
    *)
        echo -e "${RED}Uso: bash deploy.sh [frontend|backend|all]${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Deploy completado exitosamente!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}Tu sitio está en: https://atlanticoptical.com${NC}"
