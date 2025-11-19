FROM docker.io/node:lts-alpine

# 1. Instalar OpenSSL
RUN apk add --no-cache openssl

WORKDIR /app

# 2. Copiar app
COPY dist/api api

# 3. Crear carpeta y copiar esquema
RUN mkdir -p api/prisma
COPY src/prisma/schema.prisma api/prisma/schema.prisma

# 4. Entrar a la carpeta de la API
WORKDIR /app/api

# 5. Instalar dependencias
RUN npm install --omit=dev
RUN npm install @prisma/client@5

# 6. (CORRECCIÓN) Forzamos la ruta con --schema
# Esto obliga a Prisma a usar nuestro archivo y no buscar cosas raras
RUN npx prisma@5 generate --schema=./prisma/schema.prisma

# 7. Volver a la raíz
WORKDIR /app
CMD [ "node", "api" ]