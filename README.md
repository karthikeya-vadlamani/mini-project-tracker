# Mini Project Tracker

A full-stack DevOps learning project built with:

- React (Vite)
- Node.js + Express
- PostgreSQL
- Prisma
- Docker
- GitHub Actions
- Terraform
- K3s (planned)
- Prometheus/Grafana/Loki (planned)

## Project Structure

```text
mini-project-tracker/
├── frontend/
├── backend/
├── docker/
├── infra/
└── docker-compose.yml

## Production-like Deployment (EC2 + Docker Compose)

1. Images are built and pushed by GitHub Actions
2. EC2 pulls latest images from Docker Hub
3. App runs via docker-compose.prod.yml
4. Frontend exposed on port 80
5. Backend exposed on port 5000