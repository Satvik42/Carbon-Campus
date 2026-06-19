# =========================================================================
# Stage 1: Install Dependencies
# =========================================================================
FROM node:20-alpine AS deps
# Install libc6-compat for compatibility with alpine-based builds
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy lock and package files
COPY package.json package-lock.json ./
# Clean install including devDependencies (needed for static page compilation and TS compilation)
RUN npm ci

# =========================================================================
# Stage 2: Build the Application
# =========================================================================
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable telemetry during static generation/builds
ENV NEXT_TELEMETRY_DISABLED=1

# Compile Next.js build
RUN npm run build

# =========================================================================
# Stage 3: Runner Environment
# =========================================================================
FROM node:20-alpine AS runner
WORKDIR /app

# Set container process environments
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root system users for execution safety
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy client-side assets and icons
COPY --from=builder /app/public ./public

# Setup folder permissions for Next.js dynamic routing caches
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Leverage Next.js output standalone trace output to minimize container size
# This pulls only required files and dependencies into .next/standalone
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Run application as a non-privileged nextjs system user
USER nextjs

EXPOSE 3000

# Expose port and bind host address for Cloud Run runtime mapping
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Execute standalone node engine
CMD ["node", "server.js"]
