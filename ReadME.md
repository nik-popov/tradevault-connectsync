# Cobalt Data

## Overview
Cobalt Data is an integrated platform that combines a **Vite.JS** frontend with a **Python** backend. The backend is hosted at `api.scrapecompass.com`, and the frontend is available at [Cobalt Data Dashboard](https://dashboard.cobaltdata.net). The project is deployed using **Docker Compose** and **Traefik**, with a PostgreSQL database, email settings, and Sentry for error monitoring.

## Documentation Sections

### 1. [Release Notes](release-notes.md)
   - Track recent updates, fixes, and new features in Cobalt Data.

### 2. [Deployment Guide](deployment.md)
   - Step-by-step instructions for deploying Cobalt Data using Docker Compose and Traefik.

### 3. [Development Guide](development.md)
   - Guidelines for setting up a development environment, including VS Code configurations and backend/frontend setup.

### 4. [Security Policies](SECURITY.md)
   - Security best practices and vulnerability reporting process.

### 5. [License](LICENSE)
   - Details about the licensing of Cobalt Data.

### 6. Configuration Files
   - `.env`: Environment variables.
   - `docker-compose.yml`: Main Docker Compose configuration.
   - `docker-compose.override.yml`: Overrides for local development.
   - `docker-compose.traefik.yml`: Configuration for Traefik reverse proxy.
   - `copier.yml`: Template automation configurations.

## Contributing
For contribution guidelines, please refer to the [Development Guide](development.md).

---
For more information, visit [Cobalt Data Dashboard](https://dashboard.cobaltdata.net).
