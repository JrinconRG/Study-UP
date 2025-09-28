# Etapa de build
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci
COPY . .
# Build en modo producción
RUN npm run build 

# Etapa de producción con Nginx
FROM node:20-alpine
WORKDIR /usr/src/app
# Copiar el build generado (usa el nombre exacto que viste en dist)
COPY --from=builder /usr/src/app/dist/up_study_app/browser ./dist

RUN npm install -g serve

EXPOSE 4200
CMD ["serve", "-s", "dist", "-l", "4200"]
