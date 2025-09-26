#!/bin/sh
set -e

# Usa las variables definidas en tu .env (Docker Compose las inyecta al contenedor)
HOST="${DB_HOST}"
PORT="${DB_PORT}"
USER="${DB_USER}"

# Número de intentos y tiempo de espera entre ellos
RETRIES=30
INTERVAL=2

echo "⏳ Esperando a Postgres en ${HOST}:${PORT} (user=${USER})..."

i=0
until pg_isready -h "$HOST" -p "$PORT" -U "$USER" >/dev/null 2>&1; do
  i=$((i+1))
  if [ "$i" -ge "$RETRIES" ]; then
    echo "❌ Postgres no respondió después de $((RETRIES * INTERVAL)) segundos."
    exit 1
  fi
  echo "Esperando postgres... ($i/$RETRIES)"
  sleep "$INTERVAL"
done

echo "✅ Postgres está listo. Ejecutando: $*"
exec "$@"
