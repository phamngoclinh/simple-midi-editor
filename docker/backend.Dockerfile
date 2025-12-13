FROM node:24 AS builder

WORKDIR /app

# RUN apk add --no-cache python3 make g++ sqlite libsqlite3-dev

# RUN apk add --no-cache build-base python3

# RUN npm install -g sqlite3

# RUN apt-get update && apt-get install -y \
#     python3 \
#     make \
#     g++ \
#     sqlite3 \
#     libsqlite3-dev \
#     && rm -rf /var/lib/apt/lists/*

COPY backend/package*.json ./

RUN npm install

COPY backend/. .

RUN npm run build

# Runner

FROM node:20-alpine AS runner

WORKDIR /apps

COPY backend/package*.json ./

RUN npm install --only=production --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 4000

CMD ["npm", "run", "start:prod"]
# CMD ["sh", "-c", "node dist/main"]