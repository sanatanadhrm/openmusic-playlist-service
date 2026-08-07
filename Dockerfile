# ==========================================
# STAGE 1: BUILDER (Masa Pengolahan & Kompilasi)
# ==========================================
FROM node:20-alpine AS builder
RUN apk add --no-cache openssl ca-certificates

WORKDIR /usr/src/app
# Salin package.json & folder prisma lebih dulu untuk memanfaatkan Layer Caching
COPY package*.json ./
COPY prisma ./prisma/
# Instal SELURUH dependensi (termasuk TypeScript dan Prisma CLI)
RUN npm install
# Generate Prisma Client untuk Linux Alpine (tanpa butuh koneksi database)
RUN npx prisma generate
# Salin seluruh kode sumber TypeScript (termasuk prisma.config.ts)
COPY . .
# Kompilasi TypeScript ke JavaScript (menghasilkan folder dist/ yang sudah tersapu tsc-alias)
RUN npm run build
# ==========================================
# STAGE 2: RUNNER (Masa Produksi Ringan & Aman)
# ==========================================
FROM node:20-alpine AS runner
RUN apk add --no-cache openssl ca-certificates

WORKDIR /usr/src/app

# Atur lingkungan ke mode production
ENV NODE_ENV=production

# Salin package.json dan instal HANYA dependensi production (ditambah prisma & tsx untuk migrasi)
COPY package*.json ./
RUN npm install --only=production && npm install prisma tsx

# Salin skema prisma & config dari builder untuk keperluan migrasi saat runtime
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /usr/src/app/src/Infrastructures/database/postgresql/generated/prisma ./src/Infrastructures/database/postgresql/generated/prisma

# Salin hasil kompilasi dari Stage 1 (folder dist/)
COPY --from=builder /usr/src/app/dist ./dist

# Gunakan pengguna non-root (node) demi keamanan server
USER node

# Eksekusi aplikasi saat kontainer hidup
CMD ["node", "dist/app.js"]