# Multi-stage build for PMS Dashboard
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for building)
RUN npm ci --silent

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app directory and user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S pmsapp -u 1001

WORKDIR /app

# Copy package files and install production dependencies only
COPY package*.json ./
RUN npm ci --only=production --silent && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.js ./

# Copy any additional assets
COPY --from=builder /app/public/nsa.png ./dist/

# Change ownership to non-root user
RUN chown -R pmsapp:nodejs /app
USER pmsapp

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "const http = require('http'); \
    const options = { host: 'localhost', port: 3000, path: '/health', timeout: 2000 }; \
    const req = http.request(options, (res) => { \
      console.log('STATUS: ' + res.statusCode); \
      process.exitCode = (res.statusCode === 200) ? 0 : 1; \
    }); \
    req.on('error', () => process.exitCode = 1); \
    req.on('timeout', () => process.exitCode = 1); \
    req.end();"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "server.js"]