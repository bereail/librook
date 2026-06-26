#!/usr/bin/env bash
# deploy.sh — Despliega Librook en el VPS
# Uso: bash deploy.sh [usuario_ssh]
# Ejemplo: bash deploy.sh root

USER=${1:-root}
HOST="138.36.238.175"
PORT="5440"
API_DIR="/var/www/librook-api"
SSH="ssh -p $PORT $USER@$HOST"
SCP="scp -P $PORT"

echo "==> Copiando archivos del servidor al VPS..."
$SCP server/index.js          $USER@$HOST:$API_DIR/index.js
$SCP server/schema.sql        $USER@$HOST:$API_DIR/schema.sql
$SCP server/routes/auth.js    $USER@$HOST:$API_DIR/routes/auth.js
$SCP server/routes/books.js   $USER@$HOST:$API_DIR/routes/books.js
$SCP server/routes/admin.js   $USER@$HOST:$API_DIR/routes/admin.js
$SCP server/routes/analytics.js $USER@$HOST:$API_DIR/routes/analytics.js
$SCP server/routes/settings.js $USER@$HOST:$API_DIR/routes/settings.js

echo "==> Aplicando migración SQL (tabla user_settings)..."
$SSH "psql \$(grep DATABASE_URL $API_DIR/.env | cut -d= -f2-) -c \"
  CREATE TABLE IF NOT EXISTS user_settings (
    user_id     UUID        PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    goal_count  INTEGER     DEFAULT 0,
    goal_year   INTEGER     DEFAULT EXTRACT(YEAR FROM NOW())::int,
    updated_at  TIMESTAMPTZ DEFAULT NOW()
  );
\"" 2>/dev/null || echo "(La tabla puede que ya exista — OK)"

echo "==> Reiniciando API..."
$SSH "sudo systemctl restart librook-api && sleep 1 && sudo systemctl status librook-api --no-pager | head -6"

echo "==> Copiando frontend al directorio web..."
# Detecta el directorio del frontend leyendo la config de nginx
WEBROOT=$($SSH "grep -r 'root.*librook' /etc/nginx/sites-enabled/ /etc/nginx/conf.d/ 2>/dev/null | grep -v '#' | awk '{print \$2}' | tr -d ';' | head -1")
if [ -z "$WEBROOT" ]; then
  WEBROOT=$($SSH "find /var/www -name 'index.html' 2>/dev/null | grep -i librook | head -1 | xargs dirname" 2>/dev/null)
fi
if [ -z "$WEBROOT" ]; then
  echo "AVISO: no se pudo detectar el webroot de nginx."
  echo "Copiá manualmente la carpeta dist/ al servidor:"
  echo "  scp -P $PORT -r dist/* $USER@$HOST:/ruta/a/librook/"
else
  echo "==> Webroot detectado: $WEBROOT"
  $SCP -r dist/. $USER@$HOST:$WEBROOT/
  echo "==> Frontend copiado correctamente."
fi

echo ""
echo "Deploy completado. Verificá en https://ailonline.com.ar/librook/"
