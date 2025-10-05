# backend/Dockerfile

# 1. Usamos la imagen base de Node.js
FROM node:18-alpine

# --- NUEVO ---
# 2. Instalamos 'netcat', la herramienta que usa nuestro script para esperar a la BD.
RUN apk add --no-cache netcat-openbsd

# 3. Establecemos el directorio de trabajo
WORKDIR /usr/src/app

# 4. Copiamos los archivos de dependencias
COPY package*.json ./

# 5. Instalamos las dependencias
RUN npm install

# 6. Copiamos todo el código de nuestro backend
COPY . .

# --- NUEVO ---
# 7. Copiamos nuestro script de inicialización de la carpeta local al contenedor
COPY ../docker-scripts/init-app.sh /usr/src/app/init-app.sh

# --- NUEVO ---
# 8. Le damos permisos de ejecución al script
RUN chmod +x /usr/src/app/init-app.sh

# 9. Exponemos el puerto
EXPOSE 3001

# --- MODIFICADO ---
# 10. Usamos nuestro script como el punto de entrada del contenedor.
# Este script se ejecutará primero y luego pasará el control al CMD.
ENTRYPOINT [ "/usr/src/app/init-app.sh" ]

# 11. Este es el comando por defecto que nuestro entrypoint ejecutará al final.
CMD [ "npm", "run", "dev" ]