#!/bin/bash

# Generate self-signed certificates for development
# This script creates SSL certificates for local development

echo "🔒 Generating SSL certificates for development..."

# Create certs directory if it doesn't exist
mkdir -p ./certs

# Generate private key
openssl genrsa -out ./certs/server.key 2048

# Generate certificate signing request
openssl req -new -key ./certs/server.key -out ./certs/server.csr -subj "/C=NA/ST=Khomas/L=Windhoek/O=NSA/OU=IT Department/CN=localhost/emailAddress=admin@nsa.gov.na"

# Generate self-signed certificate
openssl x509 -req -days 365 -in ./certs/server.csr -signkey ./certs/server.key -out ./certs/server.crt -extensions v3_req -extfile <(cat <<EOF
[v3_req]
basicConstraints = CA:FALSE
keyUsage = nonRepudiation, digitalSignature, keyEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
DNS.2 = pms.localhost
DNS.3 = traefik.localhost
DNS.4 = *.localhost
IP.1 = 127.0.0.1
IP.2 = ::1
EOF
)

# Clean up CSR file
rm ./certs/server.csr

# Set appropriate permissions
chmod 600 ./certs/server.key
chmod 644 ./certs/server.crt

echo "✅ SSL certificates generated successfully!"
echo "📁 Certificate: ./certs/server.crt"
echo "🔑 Private key: ./certs/server.key"
echo ""
echo "⚠️  These are self-signed certificates for development only."
echo "   Your browser will show a security warning - this is normal."
echo "   For production, use proper SSL certificates from a CA or Let's Encrypt."