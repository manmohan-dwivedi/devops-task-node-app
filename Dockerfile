# -------- BUILD STAGE --------
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# -------- RUNTIME STAGE --------
FROM node:18-alpine

WORKDIR /app

# copy only necessary files from builder
COPY --from=builder /app /app

ENV NODE_ENV=production

EXPOSE 3000

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

CMD ["npm", "start"]
