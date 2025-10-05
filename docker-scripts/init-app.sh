#!/bin/sh
# init-app.sh

# Este script espera a que la base de datos esté lista y luego
# ejecuta el script para crear el usuario admin, antes de iniciar la app.

echo "🟡 Esperando a que PostgreSQL (db_favorita:5432) esté listo..."

# Usamos netcat (nc) para probar la conexión al puerto 5432 del servicio db_favorita.
# El bucle se repetirá hasta que la conexión sea exitosa.
while ! nc -z db_favorita 5432; do
  sleep 1
done

echo "✅ PostgreSQL está listo."

echo "🚀 Ejecutando el script de creación de usuario admin..."
# Ejecutamos el script que nos pasaste.
node scripts/create_admin.js

echo "👍 Script de admin finalizado."

echo "▶️  Iniciando la aplicación principal..."
# Finalmente, ejecuta el comando que originalmente iba a correr el contenedor.
# En nuestro caso, es "npm run dev".
exec "$@"