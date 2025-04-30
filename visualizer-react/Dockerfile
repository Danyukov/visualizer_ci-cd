# production 1 — сборка проекта
FROM node:22.13.0-alpine AS builder

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build:prod

# production 2 — nginx
FROM nginx:alpine

# Копируем конфигурацию Nginx в контейнер
COPY nginx_prod.conf /etc/nginx/nginx.conf

# Копируем собранные файлы из стадии сборки в директорию для статики
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
