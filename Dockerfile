FROM node:20-slim AS builder
WORKDIR /app

COPY package.json package-lock.json ./
COPY frontend/package.json frontend/package-lock.json ./frontend/

RUN npm install
RUN npm install --prefix frontend

COPY . ./
RUN npm run frontend:build

FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/frontend/dist ./frontend/dist
COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/utils ./utils
COPY --from=builder /app/PesaCoin.sol ./PesaCoin.sol
COPY --from=builder /app/deploy.js ./deploy.js
COPY --from=builder /app/.env.example ./.env.example

EXPOSE 3000

CMD ["node", "server.js"]
