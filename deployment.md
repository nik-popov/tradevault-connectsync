# Full-Stack Project - Deployment

This guide provides instructions for deploying a Full-Stack project using Docker Compose on a remote server with Traefik as a reverse proxy.

## 📖 Comprehensive Deployment Guide

For a step-by-step guide on deploying a Full-Stack project with Docker and Traefik, refer to the following article:

[**From Zero to Deployed: A Comprehensive Guide to Deploying a Full-Stack Project with Docker and Traefik**](https://medium.com/@nik_75329/from-zero-to-deployed-a-comprehensive-guide-to-deploying-a-fastapi-project-with-docker-and-traefik-79283ae9e4b7)

This guide covers:
- Setting up a remote server
- Configuring DNS and Traefik
- Deploying Full-Stack with Docker Compose
- Setting up Continuous Deployment with GitHub Actions

## 🚀 Quick Deployment Steps

### 1️⃣ Preparation
- Have a remote server available.
- Configure DNS records for your domain.
- Set up a wildcard subdomain (`*.yourdomain.com`).
- Install Docker on the remote server.

### 2️⃣ Traefik Setup
- Deploy Traefik with Docker Compose.
- Configure Traefik as a reverse proxy.
- Set up Let's Encrypt for automatic SSL certificates.

### 3️⃣ Full-Stack Deployment
- Configure environment variables.
- Deploy Full-Stack using Docker Compose.

### 4️⃣ Continuous Deployment (CI/CD)
- Set up GitHub Actions for automated deployments.
- Configure a GitHub Actions Runner on the remote server.
- Store secrets in GitHub for secure deployment.

### 5️⃣ Accessing Services
Replace `yourdomain.com` with your actual domain:

#### **Traefik Dashboard**
🔗 `https://traefik.yourdomain.com`

#### **Production**
- Frontend: `https://dashboard.yourdomain.com`
- API Docs: `https://api.yourdomain.com/docs`
- API Base URL: `https://api.yourdomain.com`
- Adminer: `https://adminer.yourdomain.com`

#### **Staging**
- Frontend: `https://dashboard.staging.yourdomain.com`
- API Docs: `https://api.staging.yourdomain.com/docs`
- API Base URL: `https://api.staging.yourdomain.com`
- Adminer: `https://adminer.staging.yourdomain.com`

## 📌 Reference
For a complete setup guide, check out the full article:  
[**Deploying a Full Stack Project with Docker and Traefik**](https://medium.com/@nik_75329/from-zero-to-deployed-a-comprehensive-guide-to-deploying-a-fastapi-project-with-docker-and-traefik-79283ae9e4b7)

---
This repository contains configurations for deploying your FastAPI project efficiently. 🚀


For production you wouldn't want to have the overrides in `docker-compose.override.yml`, that's why we explicitly specify `docker-compose.yml` as the file to use.

## Continuous Deployment (CD)

You can use GitHub Actions to deploy your project automatically. 😎

You can have multiple environment deployments.

There are already two environments configured, `staging` and `production`. 🚀

### Install GitHub Actions Runner

* On your remote server, create a user for your GitHub Actions:

```bash
sudo adduser github
```

* Add Docker permissions to the `github` user:

```bash
sudo usermod -aG docker github
```

* Temporarily switch to the `github` user:

```bash
sudo su - github
```

* Go to the `github` user's home directory:

```bash
cd
```

* [Install a GitHub Action self-hosted runner following the official guide](https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/adding-self-hosted-runners#adding-a-self-hosted-runner-to-a-repository).

* When asked about labels, add a label for the environment, e.g. `production`. You can also add labels later.

After installing, the guide would tell you to run a command to start the runner. Nevertheless, it would stop once you terminate that process or if your local connection to your server is lost.

To make sure it runs on startup and continues running, you can install it as a service. To do that, exit the `github` user and go back to the `root` user:

```bash
exit
```

After you do it, you will be on the previous user again. And you will be on the previous directory, belonging to that user.

Before being able to go the `github` user directory, you need to become the `root` user (you might already be):

```bash
sudo su
```

* As the `root` user, go to the `actions-runner` directory inside of the `github` user's home directory:

```bash
cd /home/github/actions-runner
```

* Install the self-hosted runner as a service with the user `github`:

```bash
./svc.sh install github
```

* Start the service:

```bash
./svc.sh start
```

* Check the status of the service:

```bash
./svc.sh status
```

You can read more about it in the official guide: [Configuring the self-hosted runner application as a service](https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/configuring-the-self-hosted-runner-application-as-a-service).

### Set Secrets

On your repository, configure secrets for the environment variables you need, the same ones described above, including `SECRET_KEY`, etc. Follow the [official GitHub guide for setting repository secrets](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions#creating-secrets-for-a-repository).

The current Github Actions workflows expect these secrets:

* `DOMAIN_PRODUCTION`
* `DOMAIN_STAGING`
* `STACK_NAME_PRODUCTION`
* `STACK_NAME_STAGING`
* `EMAILS_FROM_EMAIL`
* `FIRST_SUPERUSER`
* `FIRST_SUPERUSER_PASSWORD`
* `POSTGRES_PASSWORD`
* `SECRET_KEY`
* `LATEST_CHANGES`
* `SMOKESHOW_AUTH_KEY`

## GitHub Action Deployment Workflows

There are GitHub Action workflows in the `.github/workflows` directory already configured for deploying to the environments (GitHub Actions runners with the labels):

* `staging`: after pushing (or merging) to the branch `master`.
* `production`: after publishing a release.

If you need to add extra environments you could use those as a starting point.

## URLs

Replace `fastapi-project.example.com` with your domain.

### Main Traefik Dashboard

Traefik UI: `https://traefik.project.example.com`

### Production

Frontend: `https://dashboard.project.example.com`

Backend API docs: `https://api.project.example.com/docs`

Backend API base URL: `https://api.project.example.com`

Adminer: `https://adminer.project.example.com`

### Staging

Frontend: `https://dashboard.staging.project.example.com`

Backend API docs: `https://api.staging.project.example.com/docs`

Backend API base URL: `https://api.staging.project.example.com`

Adminer: `https://adminer.staging.project.example.com`
