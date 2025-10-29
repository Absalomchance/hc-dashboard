# Traefik Integration for PMS Dashboard

This document provides comprehensive instructions for running the PMS Dashboard with Traefik reverse proxy for enhanced routing, SSL termination, and load balancing.

## Overview

Traefik is a modern reverse proxy and load balancer that provides:
- Automatic HTTPS with Let's Encrypt
- Service discovery through Docker labels
- Load balancing and health checks
- Web dashboard for monitoring
- Advanced routing and middleware

## Architecture

```
Internet/Browser
       ↓
   Traefik (Reverse Proxy)
    Port 80 → HTTP
    Port 443 → HTTPS
    Port 8080 → Dashboard
       ↓
PMS Dashboard Container
    Port 3000 (Internal)
```

## Quick Start

### 1. Generate SSL Certificates

For development, generate self-signed certificates:

**Windows:**
```batch
generate-certs.bat
```

**Linux/macOS:**
```bash
bash generate-certs.sh
```

### 2. Start with Traefik

```bash
# Stop any existing containers
docker-compose down

# Start with Traefik
docker-compose -f docker-compose.traefik.yml up -d --build
```

### 3. Access Services

- **PMS Dashboard**: https://localhost (or https://pms.localhost)
- **Traefik Dashboard**: http://localhost:8080

## Configuration Files

### Traefik Static Configuration (`traefik/traefik.yml`)

Defines:
- Entry points (HTTP:80, HTTPS:443, Dashboard:8080)
- Certificate resolvers (Let's Encrypt)
- Providers (Docker, File)
- Logging and metrics

### Traefik Dynamic Configuration (`traefik/dynamic.yml`)

Defines:
- Middleware (Security headers, rate limiting, auth)
- TLS options and certificates
- HTTP to HTTPS redirects

### Docker Compose Labels

Services are configured using Docker labels:

```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.pms-dashboard-secure.rule=Host(`pms.localhost`)"
  - "traefik.http.routers.pms-dashboard-secure.entrypoints=websecure"
  - "traefik.http.routers.pms-dashboard-secure.tls=true"
```

## SSL/HTTPS Setup

### Development (Self-Signed)

1. Run certificate generation script
2. Certificates stored in `./certs/`
3. Browser will show security warning (normal for self-signed)

### Production (Let's Encrypt)

1. Update email in `traefik/traefik.yml`
2. Use real domain names in Docker labels
3. Ensure ports 80/443 are accessible from internet
4. Uncomment Let's Encrypt configuration

Example for production:
```yaml
labels:
  - "traefik.http.routers.pms-dashboard-secure.rule=Host(`pms.yourdomain.com`)"
  - "traefik.http.routers.pms-dashboard-secure.tls.certresolver=letsencrypt"
```

## Service Configuration

### PMS Dashboard

The application is configured to work behind Traefik:
- `TRUST_PROXY=true` enables proxy trust
- HTTPS redirect disabled when behind proxy
- Health checks configured for load balancer

### Traefik Dashboard

Access the Traefik dashboard at:
- **Development**: http://localhost:8080
- **Production**: https://traefik.yourdomain.com (configure DNS)

## Security Features

### Middleware

1. **Security Headers**: XSS protection, content type options, frame options
2. **Rate Limiting**: Prevents abuse (50 req/sec average, 100 burst)
3. **HTTPS Redirect**: Automatic HTTP to HTTPS redirection
4. **Basic Auth**: Optional protection for Traefik dashboard

### TLS Configuration

- TLS 1.2 and 1.3 support
- Strong cipher suites
- Perfect Forward Secrecy

## Monitoring and Logs

### Health Checks

- Application health endpoint: `/health`
- Traefik health checks every 30 seconds
- Automatic service removal on failure

### Logging

Logs are stored in Docker volumes:
- Traefik logs: `traefik-logs` volume
- Access logs: Includes request details

### Metrics

Prometheus metrics available at:
- http://localhost:8080/metrics (when dashboard is enabled)

## Management Commands

### Start Services
```bash
# Start all services
docker-compose -f docker-compose.traefik.yml up -d

# Start with build
docker-compose -f docker-compose.traefik.yml up -d --build

# View logs
docker-compose -f docker-compose.traefik.yml logs -f
```

### Stop Services
```bash
# Stop all services
docker-compose -f docker-compose.traefik.yml down

# Stop and remove volumes
docker-compose -f docker-compose.traefik.yml down -v
```

### Service Management
```bash
# Restart specific service
docker-compose -f docker-compose.traefik.yml restart pms-dashboard

# Scale services (if needed)
docker-compose -f docker-compose.traefik.yml up -d --scale pms-dashboard=2
```

## Troubleshooting

### Common Issues

1. **Certificate Errors**
   ```bash
   # Regenerate certificates
   rm -rf certs/*
   ./generate-certs.sh
   ```

2. **Service Not Accessible**
   ```bash
   # Check Traefik dashboard for routing
   # Verify labels in docker-compose.traefik.yml
   ```

3. **SSL/TLS Issues**
   ```bash
   # Check certificate validity
   openssl x509 -in certs/server.crt -text -noout
   ```

### Debug Commands

```bash
# View Traefik configuration
docker exec traefik cat /etc/traefik/traefik.yml

# Check routing rules
curl -H "Host: pms.localhost" http://localhost

# View service health
docker-compose -f docker-compose.traefik.yml ps
```

## Production Deployment

### Domain Setup

1. Point your domain to your server
2. Update Docker labels with real domain names
3. Configure Let's Encrypt email
4. Enable certificate resolver

### Security Hardening

1. Disable insecure dashboard access
2. Enable basic auth for dashboard
3. Configure firewall rules
4. Use strong TLS configuration
5. Enable access logs monitoring

### Example Production Labels

```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.pms-dashboard-secure.rule=Host(`pms.yourdomain.com`)"
  - "traefik.http.routers.pms-dashboard-secure.entrypoints=websecure"
  - "traefik.http.routers.pms-dashboard-secure.tls.certresolver=letsencrypt"
  - "traefik.http.routers.pms-dashboard-secure.middlewares=security-headers@file,rate-limit@file"
```

## Advanced Features

### Load Balancing

To run multiple instances:
```bash
docker-compose -f docker-compose.traefik.yml up -d --scale pms-dashboard=3
```

### Custom Middleware

Add custom middleware in `dynamic.yml`:
```yaml
middlewares:
  custom-headers:
    headers:
      customRequestHeaders:
        X-Custom-Header: "value"
```

### Service Discovery

Traefik automatically discovers services with proper labels. No manual configuration needed for new services.

## File Structure

```
pms-dashboard/
├── traefik/
│   ├── traefik.yml      # Static configuration
│   └── dynamic.yml      # Dynamic configuration
├── certs/
│   ├── server.crt       # SSL certificate
│   └── server.key       # SSL private key
├── docker-compose.traefik.yml  # Main compose file
├── generate-certs.sh    # Certificate generation (Linux/macOS)
├── generate-certs.bat   # Certificate generation (Windows)
└── openssl.conf         # OpenSSL configuration
```

## Support

For issues or questions:
1. Check Traefik dashboard for routing errors
2. Review container logs
3. Verify DNS resolution for custom domains
4. Check firewall and port accessibility