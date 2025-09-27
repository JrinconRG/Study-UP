FROM node:20-alpine AS deps



WORKDIR /usr/src/app
#install dependencies

COPY package.json package-lock.json ./
RUN npm ci 

FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY . .
COPY --from=deps /usr/src/app/node_modules ./node_modules
#build the project
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /usr/src/app
ENV NODE_ENV production

# instalar cliente postgres (para pg_isready)
RUN apk add --no-cache postgresql-client
#copiar build y node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY package.json ./

#copiar scrots de espera
COPY docker/wait-for-postgres.sh /usr/local/bin/wait-for-postgres.sh
RUN chmod +x /usr/local/bin/wait-for-postgres.sh


EXPOSE 3000
# Comando: primero espera por la BD, luego arranca
CMD ["/usr/local/bin/wait-for-postgres.sh", "npm", "run", "start:prod"]