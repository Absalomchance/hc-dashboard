# Docker Setup for PMS Dashboard

This document provides instructions for building and running the PMS Dashboard using Docker.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)

## Quick Start

### 1. Build and Run with Docker Compose

```bash
# Build and start the container
docker-compose up --build

# Run in detached mode (background)
docker-compose up -d --build
```

The application will be available at: http://localhost:3000

### 2. Stop the Application

```bash
# Stop the running containers
docker-compose down

# Stop and remove volumes (if any)
docker-compose down -v
```

## Docker Commands

### Build the Image

```bash
# Build the Docker image
docker build -t pms-dashboard .

# Build with a specific tag
docker build -t pms-dashboard:v1.0.0 .
```

### Run the Container

```bash
# Run the container
docker run -d \
  --name pms-dashboard \
  -p 3000:3000 \
  --restart unless-stopped \
  pms-dashboard

# Run with environment variables
docker run -d \
  --name pms-dashboard \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  pms-dashboard
```

### Container Management

```bash
# View running containers
docker ps

# View container logs
docker logs pms-dashboard

# Follow logs in real-time
docker logs -f pms-dashboard

# Execute commands in running container
docker exec -it pms-dashboard sh

# Stop the container
docker stop pms-dashboard

# Remove the container
docker rm pms-dashboard
```

## Development Mode

For development with debugging capabilities:

```bash
# Use the development compose file
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build

# This exposes:
# - Port 3000: Application
# - Port 9229: Node.js debugger
```

## Health Checks

The container includes built-in health checks:

```bash
# Check container health
docker inspect --format='{{.State.Health.Status}}' pms-dashboard

# View health check logs
docker inspect --format='{{range .State.Health.Log}}{{.Output}}{{end}}' pms-dashboard
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| NODE_ENV | production | Node.js environment |
| PORT | 3000 | Application port |

## Container Features

- **Multi-stage build**: Optimized for production with minimal image size
- **Non-root user**: Runs as non-privileged user for security
- **Health checks**: Built-in application health monitoring
- **Signal handling**: Proper shutdown with dumb-init
- **Security**: Helmet.js security headers and CSP
- **Compression**: Gzip compression for better performance
- **Caching**: Proper cache headers for static assets

## Production Deployment

### Using Docker Hub

```bash
# Tag for Docker Hub
docker tag pms-dashboard yourusername/pms-dashboard:latest

# Push to Docker Hub
docker push yourusername/pms-dashboard:latest

# Pull and run from Docker Hub
docker run -d -p 3000:3000 yourusername/pms-dashboard:latest
```

### Using a Container Registry

```bash
# Tag for your registry
docker tag pms-dashboard registry.example.com/pms-dashboard:latest

# Push to registry
docker push registry.example.com/pms-dashboard:latest
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Use a different port
   docker run -p 3001:3000 pms-dashboard
   ```

2. **Permission issues**
   ```bash
   # Check container logs
   docker logs pms-dashboard
   ```

3. **Build failures**
   ```bash
   # Clean build (no cache)
   docker build --no-cache -t pms-dashboard .
   ```

4. **Container won't start**
   ```bash
   # Check health status
   docker inspect pms-dashboard | grep Health -A 10
   ```

### Debug Container

```bash
# Run container with shell access
docker run -it --entrypoint sh pms-dashboard

# Or execute shell in running container
docker exec -it pms-dashboard sh
```

## Resource Usage

The container is optimized for:
- **CPU**: Minimal usage with Node.js Alpine
- **Memory**: ~100-200MB typical usage
- **Storage**: ~150MB image size (multi-stage build)

## Security Considerations

- Runs as non-root user (pmsapp:nodejs)
- Uses Alpine Linux for minimal attack surface
- Includes security headers via Helmet.js
- No sensitive data in image layers
- Proper signal handling for graceful shutdowns