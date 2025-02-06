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
# Contribution Guidelines

Thank you for your interest in contributing to this project! Before you get started, please take a moment to review our guidelines and resources.

## Getting Started

Before you start coding, please refer to our detailed [Production Guide](https://medium.com/@nik_75329/from-zero-to-deployed-a-comprehensive-guide-to-deploying-a-fastapi-project-with-docker-and-traefik-79283ae9e4b7) which covers:
- Deployment best practices
- Project setup using FastAPI, Docker, and Traefik
- Configuration and environment management

## Docker Environment

If you encounter any issues with your Docker setup or need to perform debugging and cleanup, please review the following guides:

- **Docker Environment Debugging:**  
  [How to Completely Reset Your Docker Setup](https://medium.com/@nik_75329/docker-environment-debugging-how-to-completely-reset-your-docker-setup-dfec0eb6e6c4)  
  *This guide helps you diagnose and resolve Docker environment issues.*

- **Removing Docker Containers, Images, and Volumes:**  
  [Step-by-Step Guide on How to Remove All Docker Containers, Images, and Volumes](https://medium.com/@nik_75329/below-is-a-step-by-step-guide-on-how-to-remove-all-docker-containers-images-and-volumes-and-d119d02a76b9)  
  *Follow this guide to clean up your Docker setup completely.*

- **Reinstalling Docker on Linux:**  
  [How to Completely Remove and Reinstall Docker on Linux](https://medium.com/@nik_75329/how-to-completely-remove-and-reinstall-docker-on-linux-bc4fb677887c)  
  *Use this resource if you need to completely remove and reinstall Docker on your Linux system.*   git checkout -b feature/your-feature-name
- **Docker like a pro with Linux:**  
  [Production Guuide](https://medium.com/@nik_75329/how-to-completely-remove-and-reinstall-docker-on-linux-bc4fb677887c)  
  *Use this resource if you need to completely remove and reinstall Docker on your Linux system.*

# Contributing to Cobalt Data

Thank you for your interest in contributing to our project! Please follow the guidelines below to get started.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Forking the Repository](#forking-the-repository)
  - [Using GitHub CLI](#using-github-cli)
  - [Using the GitHub API with `curl`](#using-the-github-api-with-curl)
- [Creating a Feature Branch](#creating-a-feature-branch)
- [Making Your Changes](#making-your-changes)
- [Committing and Pushing Changes](#committing-and-pushing-changes)
- [Opening a Pull Request](#opening-a-pull-request)
- [Additional Resources](#additional-resources)
- [Code of Conduct](#code-of-conduct)
- [Issues & Support](#issues--support)

---

## Getting Started

Before you start coding, please review our production and Docker guides for deployment and debugging:

- **[Production Guide](https://medium.com/@nik_75329/from-zero-to-deployed-a-comprehensive-guide-to-deploying-a-fastapi-project-with-docker-and-traefik-79283ae9e4b7)**
- **[Docker Environment Debugging](https://medium.com/@nik_75329/docker-environment-debugging-how-to-completely-reset-your-docker-setup-dfec0eb6e6c4)**
- **[Removing Docker Containers, Images, and Volumes](https://medium.com/@nik_75329/below-is-a-step-by-step-guide-on-how-to-remove-all-docker-containers-images-and-volumes-and-d119d02a76b9)**
- **[Reinstalling Docker on Linux](https://medium.com/@nik_75329/how-to-completely-remove-and-reinstall-docker-on-linux-bc4fb677887c)**

---

## Forking the Repository

You can fork the repository directly from the command line using either the GitHub CLI or the GitHub API.

### Using GitHub CLI

1. **Install GitHub CLI**  
   If you haven't installed the GitHub CLI yet, follow the instructions based on your operating system:

   - **macOS (Homebrew):**
     ```bash
     brew install gh
     ```
   - **Windows and Linux:**  
     Check out the [GitHub CLI installation guide](https://github.com/cli/cli#installation).

2. **Authenticate with GitHub:**
   ```bash
   gh auth login

Below is a complete Markdown example for a `CONTRIBUTING.md` file containing the sections you listed:

```markdown
# Contributing to [Project Name]

Thank you for your interest in contributing to our project! Please follow the guidelines below to help us maintain a high-quality codebase and streamlined collaboration.

---

## Getting Started

Before you begin, please review our key documentation resources:
- **[Production Guide](https://medium.com/@nik_75329/from-zero-to-deployed-a-comprehensive-guide-to-deploying-a-fastapi-project-with-docker-and-traefik-79283ae9e4b7)**
- **[Docker Environment Debugging](https://medium.com/@nik_75329/docker-environment-debugging-how-to-completely-reset-your-docker-setup-dfec0eb6e6c4)**
- **[Removing Docker Containers, Images, and Volumes](https://medium.com/@nik_75329/below-is-a-step-by-step-guide-on-how-to-remove-all-docker-containers-images-and-volumes-and-d119d02a76b9)**
- **[Reinstalling Docker on Linux](https://medium.com/@nik_75329/how-to-completely-remove-and-reinstall-docker-on-linux-bc4fb677887c)**

These guides will provide you with background on our deployment setup, debugging practices, and overall development environment.

---

## Forking the Repository

Before you start working on your changes, you need to fork the repository.

### Using GitHub CLI

1. **Install GitHub CLI**  
   If you haven't already installed GitHub CLI, follow these steps:
   - **macOS (Homebrew):**
     ```bash
     brew install gh
     ```
   - **Windows & Linux:**  
     Refer to the [GitHub CLI installation guide](https://github.com/cli/cli#installation).

2. **Authenticate with GitHub:**
   ```bash
   gh auth login
   ```
   Follow the prompts to log in to your GitHub account.

3. **Fork the Repository:**
   ```bash
   gh repo fork OWNER/REPO --clone
   ```
   Replace `OWNER/REPO` with the repository's owner and name (e.g., `octocat/Hello-World`). The `--clone` flag automatically clones your fork to your local machine.

### Using the GitHub API with curl

If you prefer using the API with `curl`:

1. **Set Environment Variables:**
   ```bash
   export GITHUB_TOKEN=your_personal_access_token
   export OWNER=repository_owner
   export REPO=repository_name
   ```

2. **Fork the Repository:**
   ```bash
   curl -X POST \
     -H "Authorization: token ${GITHUB_TOKEN}" \
     https://api.github.com/repos/${OWNER}/${REPO}/forks
   ```
   This command sends a POST request to fork the repository into your GitHub account.

---

## Creating a Feature Branch

Once you have your fork cloned locally, create a new branch for your feature or bug fix:

```bash
git checkout -b feature/your-feature-name
```

This keeps your changes organized and separate from the main branch.

---

## Making Your Changes

Work on your feature or bug fix in your new branch. Be sure to follow the project's coding standards and best practices. Comment your code where necessary and write clear, maintainable code.

---

## Committing and Pushing Changes

1. **Commit Your Changes:**  
   Use descriptive commit messages to explain the purpose of your changes:
   ```bash
   git commit -m "Add feature X to improve Y"
   ```

2. **Push Your Changes:**  
   Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

---

## Opening a Pull Request

After pushing your changes:

1. Go to your fork on GitHub.
2. Click the **"Compare & pull request"** button.
3. Fill in a clear description of your changes and reference any related issues.
4. Submit your pull request to the main repository for review.

---

## Additional Resources

For more detailed instructions and troubleshooting, please refer to:
- **[Production Guide](https://medium.com/@nik_75329/from-zero-to-deployed-a-comprehensive-guide-to-deploying-a-fastapi-project-with-docker-and-traefik-79283ae9e4b7)**
- **[Docker Environment Debugging](https://medium.com/@nik_75329/docker-environment-debugging-how-to-completely-reset-your-docker-setup-dfec0eb6e6c4)**
- **[Removing Docker Containers, Images, and Volumes](https://medium.com/@nik_75329/below-is-a-step-by-step-guide-on-how-to-remove-all-docker-containers-images-and-volumes-and-d119d02a76b9)**
- **[Reinstalling Docker on Linux](https://medium.com/@nik_75329/how-to-completely-remove-and-reinstall-docker-on-linux-bc4fb677887c)**

---

## Code of Conduct

By contributing to this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please ensure you read and understand it before contributing.

---

## Issues & Support

If you encounter any issues or have questions:
- Please [open an issue](https://github.com/OWNER/REPO/issues) on GitHub.
- You can also reach out via our community channels (if available).

Your feedback and contributions help make this project better for everyone!

---

*Happy coding and thank you for contributing!*

Feel free to modify any sections or links to match your project's specific requirements and guidelines.
For more information, visit [Cobalt Data Dashboard](https://dashboard.cobaltdata.net).
