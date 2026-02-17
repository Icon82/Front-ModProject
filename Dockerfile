# Stage 1: Build React
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve con Nginx
FROM nginx:alpine

# Copia build React
COPY --from=build /app/build /usr/share/nginx/html

# Configura Nginx per proxy pass al backend
RUN echo 'server { \
    listen 8080; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri /index.html; \
    } \
    location /auth/ { \
        proxy_pass https://modproject-production.up.railway.app; \
        proxy_set_header Host modproject-production.up.railway.app; \
        proxy_set_header X-Real-IP $remote_addr; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]