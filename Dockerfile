# Stage 1: Build React
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Setup proxy + Nginx
FROM node:22-alpine
WORKDIR /app

# Installa Nginx
RUN apk add --no-cache nginx

# Copia proxy server
COPY proxy-server/package*.json ./proxy-server/
WORKDIR /app/proxy-server
RUN npm install --production
COPY proxy-server/ ./

# Copia build React in Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Configura Nginx
RUN mkdir -p /run/nginx && \
    echo 'server { \
        listen 8080; \
        root /usr/share/nginx/html; \
        index index.html; \
        location / { \
            try_files $uri /index.html; \
        } \
        location /auth/ { \
            proxy_pass https://modproject-production.up.railway.app; \
            proxy_set_header Host $host; \
        } \
    }' > /etc/nginx/http.d/default.conf

EXPOSE 8080

# Avvia Nginx
CMD ["nginx", "-g", "daemon off;"]