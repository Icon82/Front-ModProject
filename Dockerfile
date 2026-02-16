FROM node:22-alpine

WORKDIR /app

# Copia package.json
COPY package.json ./

# Installa dipendenze
RUN npm install --production

# Copia il codice
COPY proxy-server.js ./

# Esponi porta
EXPOSE 4000

# Avvia app
CMD ["node", "proxy-server.js"]
