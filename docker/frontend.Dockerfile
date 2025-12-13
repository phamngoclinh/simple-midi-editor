FROM node:20-alpine AS builder

WORKDIR /app

COPY frontend/package*.json ./

RUN npm install

COPY frontend/. .

RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /usr/app

RUN npm install -g serve

COPY --from=builder /app/build ./build

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]

# FROM nginx:alpine

# RUN rm /etc/nginx/conf.d/default.conf

# COPY --from=builder /app/build /usr/share/nginx/html

# COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# EXPOSE 80
