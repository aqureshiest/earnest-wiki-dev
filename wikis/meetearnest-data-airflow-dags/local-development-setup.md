---
title: Local Development Setup
description: guide documentation
---

<div style="border-bottom: 1px solid var(--vp-c-divider); padding-bottom: 1rem; margin-bottom: 2rem;">
  <h1 style="margin-bottom: 0.5rem;">Local Development Setup</h1>
  <div style="display: flex; gap: 1rem; flex-wrap: wrap; font-size: 0.9rem; color: var(--vp-c-text-2);">
    <span style="display: flex; align-items: center; gap: 0.25rem;">
      📖 <strong>Guide</strong>
    </span>
    <span style="display: flex; align-items: center; gap: 0.25rem;">
      📝 <strong>884</strong> words
    </span>
    <span style="display: flex; align-items: center; gap: 0.25rem;">
      ⏱️ <strong>5</strong> min read
    </span>
  </div>
</div>

This guide covers setting up the Airflow development environment locally using Docker Compose to run PostgreSQL, Redis, and Vault alongside the Airflow services.

## Prerequisites

Before starting, ensure you have the following installed:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Architecture Overview

The local development environment consists of multiple containerized services:

```mermaid
graph TD
    A[Airflow Webserver :8080] --> B[PostgreSQL Database]
    C[Airflow Scheduler] --> B
    D[Airflow Worker] --> B
    E[Airflow Triggerer] --> B
    A --> F[Redis :6379]
    C --> F
    D --> F
    G[Vault :9000] -.-> A
    G -.-> C
    G -.-> D
    H[DBT Container] -.-> I[Snowflake]
    J[SFTP Server :2222] -.-> D
    
    style A fill:#e1f5ff
    style C fill:#e1f5ff
    style D fill:#e1f5ff
    style E fill:#e1f5ff
```

## Service Configuration

| Service | Purpose | Port | Health Check |
|---------|---------|------|--------------|
| **postgres** | Airflow metadata database | Internal | `pg_isready` |
| **redis** | Celery message broker | 6379 | `redis-cli ping` |
| **vault** | Secrets management | 9000 | N/A |
| **airflow-webserver** | Web UI | 8080 | `/health` endpoint |
| **airflow-scheduler** | DAG scheduling | 8974 | `/health` endpoint |
| **airflow-worker** | Task execution | Internal | Celery ping |
| **airflow-triggerer** | Deferred task handling | Internal | Job check |
| **dbt** | DBT transformations | N/A | N/A |
| **sftp** | Test SFTP server | 2222 | N/A |

## Building the Docker Image

Build the Airflow development image:

```bash
docker-compose build dev
```

> **Note**: If you need to add Python dependencies, add them to `requirements.txt` or `requirements.dev.txt` and rebuild the image.

The build process:
1. Uses `apache/airflow:2.8.4-python3.8` as the base image
2. Installs system packages (Java, build tools, etc.)
3. Adds Impala JDBC driver
4. Installs Python requirements from `requirements.dev.txt`

## Environment Configuration

### Required Environment Variables

Set these environment variables before starting the services:

#### Snowflake Authentication

```bash
export OKTA_USERNAME=your_username
export OKTA_PASSWORD=your_password
export SNOWFLAKE_ROLE=dna_data_engineer  # or dna_data_scientist, dna_analyst
```

> **Note**: Add these to your `~/.bashrc` or `~/.zshrc` for persistence.

#### AWS Credentials (Optional)

```bash
export AWS_DEFAULT_REGION=us-east-1
export AWS_ACCESS_KEY_ID=your_key
export AWS_SECRET_ACCESS_KEY=your_secret
export AWS_SESSION_TOKEN=your_token  # if using temporary credentials
```

### Testing Snowflake Credentials

Verify your Snowflake credentials before starting Airflow:

```bash
curl -s -X POST https://snowflake-token-generator.k8s.data-org.production.earnest.com/token \
  --data '{"okta_username": "your_username", "snowflake_role": "your_role", "okta_password": "your_password"}'
```

Expected response:
```json
{
  "token": "a-very-long-token-key"
}
```

### Airflow Configuration

The `docker-compose.yml` configures Airflow through environment variables following the pattern `AIRFLOW__\<section\>__\<key\>`:

| Configuration | Value | Purpose |
|--------------|-------|---------|
| `AIRFLOW__CORE__EXECUTOR` | `CeleryExecutor` | Distributed task execution |
| `AIRFLOW__DATABASE__SQL_ALCHEMY_CONN` | `postgresql+psycopg2://airflow:airflow@postgres/airflow` | Metadata database connection |
| `AIRFLOW__CELERY__BROKER_URL` | `redis://:@redis:6379/0` | Message broker for Celery |
| `AIRFLOW__CORE__FERNET_KEY` | `EB868LKil7C8NOE0k8CNyAEHCSI_CY4PXCrjJ6x7ki4=` | Encryption key (local only) |
| `AIRFLOW__CORE__LOAD_EXAMPLES` | `false` | Disable example DAGs |
| `AIRFLOW__WEBSERVER__BASE_URL` | `http://localhost:8080` | Web UI URL |

### Vault Configuration

Vault is configured for local development with:

```bash
VAULT_URL=http://vault
VAULT_PORT=9000
VAULT_TOKEN=myC0mpl3xT0k3n
VAULT_KEY=data-airflow-dags
```

Vault data is persisted in `./vault-data` directory.

## Starting the Environment

### Initial Setup

Start all services:

```bash
docker-compose up -d
```

This command:
1. Starts PostgreSQL and Redis
2. Runs the `airflow-init` service to:
   - Initialize the Airflow database
   - Create the admin user (username: `airflow`, password: `airflow`)
   - Set up required directories
3. Starts Airflow webserver, scheduler, worker, and triggerer

### Accessing the Airflow UI

Once services are running, access the Airflow web interface:

**URL**: `http://localhost:8080/admin/`

**Default Credentials**:
- Username: `airflow`
- Password: `airflow`

> **Note**: You can customize credentials by setting `_AIRFLOW_WWW_USER_USERNAME` and `_AIRFLOW_WWW_USER_PASSWORD` environment variables.

## Volume Mounts

The following directories are mounted from your local filesystem:

```
./dags       → /opt/airflow/dags
./logs       → /opt/airflow/logs
./config     → /opt/airflow/config
./plugins    → /opt/airflow/plugins
```

Changes to DAG files are automatically detected by Airflow's scheduler.

## Managing Services

### View Container Status

```bash
docker-compose ps
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f airflow-webserver
docker-compose logs -f airflow-scheduler
```

### Stop Services

```bash
docker-compose down
```

> **Recommendation**: Shut down containers when not in use to reduce resource consumption. Restarting containers can also resolve some issues.

### Restart Services

```bash
docker-compose restart
```

## Running DBT Transformations Locally

### DBT Container Setup

The DBT service is configured separately with its own Dockerfile at `./dbt/Dockerfile`.

#### Required Environment Variables

```bash
export SNOWFLAKE_USER=your_email_prefix
export SNOWFLAKE_DEVELOPMENT_SCHEMA=first_initial_last_name
export DBT_PROFILES_DIR=profiles/snowflake/
```

Example:
```bash
export SNOWFLAKE_USER=chris.evans
export SNOWFLAKE_DEVELOPMENT_SCHEMA=cevans
export DBT_PROFILES_DIR=profiles/snowflake/
```

### Building the DBT Image

```bash
docker-compose build dbt
```

### Running DBT Commands

Execute DBT commands in the container:

```bash
# Install dependencies
docker-compose run dbt dbt deps

# Run models
docker-compose run dbt dbt run

# Test models
docker-compose run dbt dbt test

# Generate documentation
docker-compose run dbt dbt docs generate
```

### DBT Documentation Server

To run the DBT documentation server locally:

```bash
cd dbt
export SNOWFLAKE_USER=your_username
export SNOWFLAKE_DEVELOPMENT_SCHEMA=your_schema
dbt docs serve --profiles-dir profiles/snowflake
```

Access at: `http://localhost:8080/`

## Using the Go Script

The `./go` script provides convenient commands for local development:

```bash
./go [command]
```

### Available Commands

| Command | Description |
|---------|-------------|
| `build` | Build the production Docker image |
| `push` | Push image to Docker Hub |
| `test` | Run pytest in the container |
| `validate` | Run pytest in dev container |
| `shell` | Open terminal in development container |
| `clean` | Remove project and dependencies locally |
| `lint_jenkinsfile` | Lint the Jenkinsfile |
| `init` | Initialize project locally |
| `login_docker` | Login to Docker |

### Opening a Shell

To debug or run commands inside the Airflow container:

```bash
./go shell
```

Or directly with Docker Compose:

```bash
docker-compose run dev bash
```

## Troubleshooting

### DAG Not Showing in UI

**Symptom**: DAG file exists but doesn't appear in the Airflow UI, no errors shown.

**Causes**:
1. **Safe Mode**: By default, Airflow only considers Python files containing both "airflow" and "DAG" strings
2. **Dynamic DAGs**: If creating DAGs dynamically, ensure the DAG object is added to the global namespace

**Solution**: Disable safe mode by setting:
```bash
AIRFLOW__CORE__DAG_DISCOVERY_SAFE_MODE=false
```

### Broken DAG

**Symptom**: DAG shows error message in UI.

**Debugging**:
1. Check error message in UI
2. View full stacktrace:
```bash
docker exec -it data-airflow-dags_airflow-webserver_1 bash -c "airflow dags list"
```

### Validate/Test Images Not Updated

**Symptom**: Changes not reflected when running `./go validate` or `./go test`.

**Cause**: Docker creates separate images (`validate_dev`, `test_dev`) based on `dev`.

**Solution**: Remove the cached images:
```bash
docker rmi validate_dev test_dev
```

### Task Failures

**Debugging Steps**:
1. Navigate to DAG in UI
2. Click **Graph View**
3. Click the failed task (red border)
4. Click **View Log**
5. Analyze logs to identify the issue

### Connection Issues

**Snowflake Connection**: Verify environment variables are set and token generation works (see [Testing Snowflake Credentials](#testing-snowflake-credentials))

**Database Connection**: Ensure PostgreSQL container is healthy:
```bash
docker-compose ps postgres
```

**Redis Connection**: Verify Redis is running:
```bash
docker-compose ps redis
```

### Port Conflicts

If port 8080 is already in use, modify the port mapping in `docker-compose.yml`:

```yaml
airflow-webserver:
  ports:
    - "8081:8080"  # Change host port
```

### Volume Permission Issues

If you encounter permission errors, ensure the `AIRFLOW_UID` matches your user ID:

```bash
echo "AIRFLOW_UID=$(id -u)" > .env
docker-compose down
docker-compose up -d
```

## Development Workflow

```mermaid
graph LR
    A[Create/Modify DAG] --> B[Save to ./dags]
    B --> C[Scheduler Detects Change]
    C --> D[View in UI]
    D --> E{Working?}
    E -->|No| F[Check Logs]
    F --> A
    E -->|Yes| G[Run Tests]
    G --> H[Create PR]
```

### Best Practices

1. **Set `schedule_interval=None`** during development to prevent automatic runs
2. **Set `catchup=False`** to avoid backfilling
3. **Test locally** before creating a PR
4. **Run validation**:
   ```bash
   ./go validate
   ./go test
   ```
5. **Check logs** for any warnings or errors

## Additional Resources

- [DAG Development Guide](dags_development)
- [Creating New DAGs](./creating-new-dags.md)
- [DBT Integration](./dbt-integration.md)
- [Troubleshooting Guide](./troubleshooting.md)
- [Configuration Management](./configuration-management.md)

## Related Documentation

- [Deployment Guide](./deployment-guide.md) - For production deployment
- [Testing Strategy](./testing-strategy.md) - For writing tests
- [Local Development with Kubernetes](k8s_local_deployment/README.md) - Alternative local setup using Kubernetes