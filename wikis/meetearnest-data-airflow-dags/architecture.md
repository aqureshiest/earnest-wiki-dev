---
title: System Architecture
description: architecture documentation
---

<div style="border-bottom: 1px solid var(--vp-c-divider); padding-bottom: 1rem; margin-bottom: 2rem;">
  <h1 style="margin-bottom: 0.5rem;">System Architecture</h1>
  <div style="display: flex; gap: 1rem; flex-wrap: wrap; font-size: 0.9rem; color: var(--vp-c-text-2);">
    <span style="display: flex; align-items: center; gap: 0.25rem;">
      🏗️ <strong>Architecture</strong>
    </span>
    <span style="display: flex; align-items: center; gap: 0.25rem;">
      📝 <strong>1,154</strong> words
    </span>
    <span style="display: flex; align-items: center; gap: 0.25rem;">
      ⏱️ <strong>6</strong> min read
    </span>
  </div>
</div>

The data-airflow-dags repository implements a distributed data orchestration platform using Apache Airflow with CeleryExecutor, containerized via Docker and deployed to Kubernetes. The architecture separates concerns between task orchestration, execution, metadata storage, message brokering, and secrets management.

## Architecture Overview

```mermaid
graph TB
    subgraph "Airflow Core"
        WEB[Webserver<br/>Port 8080]
        SCHED[Scheduler<br/>Health: 8974]
        TRIG[Triggerer]
    end
    
    subgraph "Task Execution"
        WORKER[Celery Worker]
        K8S[KubernetesPodOperator<br/>DBT & ML Tasks]
    end
    
    subgraph "Infrastructure"
        PG[(PostgreSQL<br/>Metadata DB)]
        REDIS[(Redis<br/>Message Broker)]
        VAULT[Vault<br/>Secrets Management<br/>Port 9000]
    end
    
    subgraph "External Images"
        DBT_IMG[DBT Image<br/>dbt_test:latest / dbt_image]
        ML_IMG[ML Models Image]
    end
    
    WEB --> PG
    SCHED --> PG
    SCHED --> REDIS
    WORKER --> REDIS
    WORKER --> PG
    TRIG --> PG
    
    WORKER --> K8S
    K8S --> DBT_IMG
    K8S --> ML_IMG
    
    WEB -.-> VAULT
    SCHED -.-> VAULT
    WORKER -.-> VAULT
    K8S -.-> VAULT
    
    style K8S fill:#e1f5ff
    style DBT_IMG fill:#fff4e1
    style ML_IMG fill:#fff4e1
```

## Core Components

### CeleryExecutor Configuration

The system uses CeleryExecutor for distributed task execution, configured in `docker-compose.yml`:

```yaml
AIRFLOW__CORE__EXECUTOR: CeleryExecutor
AIRFLOW__CELERY__BROKER_URL: redis://:@redis:6379/0
AIRFLOW__CELERY__RESULT_BACKEND: db+postgresql://airflow:airflow@postgres/airflow
```

**Component Responsibilities:**

- **Scheduler**: Parses DAGs, schedules tasks, sends them to the Celery queue
- **Celery Workers**: Pull tasks from Redis queue and execute them
- **Redis**: Acts as message broker for task distribution
- **PostgreSQL**: Stores task results and execution state

### Metadata Storage (PostgreSQL)

PostgreSQL 15 serves as the Airflow metadata database, storing:

- DAG definitions and run history
- Task instance states and logs
- Connections and variables
- Celery task results (via `db+postgresql://` result backend)

**Configuration:**
```yaml
AIRFLOW__DATABASE__SQL_ALCHEMY_CONN: postgresql+psycopg2://airflow:airflow@postgres/airflow
```

**Health Check:**
```yaml
healthcheck:
  test: ["CMD", "pg_isready", "-U", "airflow"]
  interval: 10s
  retries: 5
```

### Message Broker (Redis)

Redis serves as the Celery message broker, handling task queue distribution between the scheduler and workers.

**Key Characteristics:**
- Single Redis instance on port 6379
- No authentication in local development
- 30-second startup period with 50 retries
- Used exclusively for task queuing (not caching)

### Secrets Management (Vault)

HashiCorp Vault integration provides centralized secrets management for database credentials, API keys, and encryption keys.

**Configuration:**
```yaml
USE_VAULT: true
VAULT_URL: http://vault
VAULT_PORT: 9000
VAULT_TOKEN: myC0mpl3xT0k3n  # Local development only
VAULT_KEY: data-airflow-dags
```

**Integration Points:**
- Environment variables injected via `vault_envs` configuration
- Kubernetes secrets mounted via `vault_token_secret`
- DBT tasks retrieve warehouse credentials at runtime
- Production uses `execute_dbt_commands.sh` with Vault integration

> **Note:** The Vault token shown is for local development only. Production environments use proper authentication mechanisms.

## Containerization Strategy

### Docker Compose Architecture

The local development environment uses Docker Compose to orchestrate multiple services:

| Service | Purpose | Ports | Dependencies |
|---------|---------|-------|--------------|
| postgres | Metadata database | Internal | None |
| redis | Message broker | 6379 | None |
| vault | Secrets management | 9000 | None |
| airflow-webserver | Web UI | 8080 | postgres, redis, vault, airflow-init |
| airflow-scheduler | Task scheduler | 8974 (health) | postgres, redis, vault, airflow-init |
| airflow-worker | Task executor | Internal | postgres, redis, vault, airflow-init |
| airflow-triggerer | Async triggers | Internal | postgres, redis, vault, airflow-init |
| dbt | DBT development | Internal | None |
| sftp | Test SFTP server | 2222 | None |

### Custom Image Build

The repository builds a custom Airflow image extending the base `earnest/airflow` image:

```yaml
build:
  context: .
  dockerfile: Dockerfile
platform: "linux/amd64"
```

**Volume Mounts:**
```yaml
volumes:
  - ./dags:/opt/airflow/dags
  - ./logs:/opt/airflow/logs
  - ./config:/opt/airflow/config
  - ./plugins:/opt/airflow/plugins
```

This approach allows:
- Hot-reloading of DAG changes during development
- Persistent log storage
- Custom plugin integration
- Configuration overrides

### Kubernetes Deployment

Production deployments use Kubernetes with the KubernetesPodOperator for task execution. The architecture decouples Airflow from DBT as documented in RFC 0001.

**Deployment Strategy:**
```mermaid
sequenceDiagram
    participant Scheduler
    participant Worker
    participant K8s API
    participant DBT Pod
    participant Vault
    
    Scheduler->>Worker: Task via Redis
    Worker->>K8s API: Create Pod
    K8s API->>DBT Pod: Start Container
    DBT Pod->>Vault: Fetch Secrets
    Vault-->>DBT Pod: Credentials
    DBT Pod->>DBT Pod: Execute DBT
    DBT Pod-->>K8s API: Complete
    K8s API-->>Worker: Status
    Worker-->>Scheduler: Result
```

## DBT Integration Architecture

### Image Decoupling

DBT runs in separate containers to avoid dependency conflicts with Airflow, as detailed in RFC 0001. This hybrid approach:

1. **Base Image**: Created in `docker-images` repository
2. **Custom Image**: Extended in `dbt/Dockerfile` with project-specific code
3. **Execution**: Via KubernetesPodOperator in production, direct container in development

### Task Execution Flow

From `dags/common/dag_builder.py`, the `get_dbt_tasks` function creates KubernetesPodOperator tasks:

```python
def get_dbt_tasks(dbt_settings, operations=("debug", "run", "test"), ...):
    if os.environ["ENVIRONMENT"] == "production":
        arguments_elements = "|".join(
            [getattr(dbt, f"{op}")(**dbt_settings) for op in operations]
        )
        arguments_elements = [
            f"source execute_dbt_commands.sh '{arguments_elements}' '{MONTECARLO_CLI_COMMAND}'"
        ]
    else:
        vault_keys = dbt.get_envs_for_warehouse("snowflake")
        dbt_command = " && ".join(
            [getattr(dbt, f"{op}")(**dbt_settings) for op in operations]
        )
        arguments_elements = [
            f"source get_envs.sh {' '.join(vault_keys)} && sh create_private_key_file.sh && {dbt_command}"
        ]
```

**Environment-Specific Behavior:**

| Environment | Image | Secrets | Execution |
|-------------|-------|---------|-----------|
| Development | `dbt_test:latest` | No Vault secrets | Direct command execution |
| Staging/Production | `dbt_image` (from config) | Vault token secret | Wrapped in `execute_dbt_commands.sh` |

### Resource Allocation

DBT tasks use dedicated resource configurations:

- **Child Pods** (`dbt_child_pod_resources`): Execute DBT commands
- **Docs Pods** (`dbt_docs_pod_resources`): Generate documentation
- **Parent Pods**: Orchestrate execution (when using KubernetesExecutor)

### DBT Documentation Generation

The `dbt-docs-generator` DAG creates documentation artifacts:

```python
def dbt_docs_task(dbt_settings):
    return KubernetesPodOperator(
        image=dbt_image,
        labels={"task": "dbt_docs"},
        name="dbt_docs",
        task_id="dbt_docs",
        secrets=[vault_token_secret],
        env_vars=vault_envs,
        container_resources=dbt_docs_pod_resources,
        arguments=[getattr(dbt, "generate_docs")(**dbt_settings)],
        **k8s_defaults,
    )
```

Runs on schedule: `"0 6,14 * * *"` (6 AM and 2 PM UTC daily)

## Data Warehouse Connections

### Snowflake Integration

Snowflake authentication uses Okta SSO with token generation:

```yaml
SNOWFLAKE_TOKEN_GENERATOR_URL: https://snowflake-token-generator.k8s.data-org.production.earnest.com
OKTA_USERNAME: {user_okta_username}
OKTA_PASSWORD: {user_okta_password}
SNOWFLAKE_ROLE: {dna_data_engineer|dna_data_scientist|dna_analyst}
```

**Local Development Flow:**
1. User sets Okta credentials as environment variables
2. Token generator service exchanges credentials for Snowflake token
3. DBT uses token for warehouse authentication

**Production Flow:**
1. Vault stores service account credentials
2. DBT pod retrieves credentials via `get_envs.sh`
3. Private key file created via `create_private_key_file.sh`
4. DBT authenticates using key-based authentication

### Redshift Support

The codebase includes Redshift support with pre-production DAG capability:

```python
if (os.environ["ENVIRONMENT"] == "production" 
    and dbt_settings["warehouse"] == "redshift"):
    kwargs["schedule_interval"] = None
    dbt_settings["pre_prod"] = True
    pre_dag_id = "pre_prod_" + dag_id
    pre_prod_dag = create_dbt_dag(...)
```

Pre-production DAGs allow testing transformations before production deployment.

## EMR Integration

For Spark-based workloads, the system supports Amazon EMR cluster creation:

```python
def emr_airflow_DAG(dag_id, command, instance_count=2, **kwargs):
    cluster_creator = EmrCreateJobFlowOperator(
        task_id=f"cluster_creator_{dag_id}",
        job_flow_overrides=cluster_config,
        aws_conn_id="aws_default",
        emr_conn_id="emr_default",
    )
    
    job_sensor = EmrJobFlowSensor(
        task_id=f"job_sensor_{dag_id}",
        job_flow_id="{{{{ task_instance.xcom_pull(...) }}}}",
    )
```

**Cluster Configuration:**
- Dynamic instance count (default: 2)
- Automatic resource calculation based on instance type
- 8 vCPU and ~25.5 GB RAM per machine
- Optimized executor configuration for throughput

## ML Models Integration

Machine learning model training uses a similar containerized approach:

```python
def get_ml_training_tasks(ml_model_settings, 
                          operations=("validate_model", "sync_model"), ...):
    for operation in operations:
        yield KubernetesPodOperator(
            image=ml_models_image,
            labels={"task": f"ml_model_{operation}"},
            secrets=[vault_token_secret],
            env_vars=vault_envs,
            container_resources=ml_models_child_pod_resources,
            executor_config={"KubernetesExecutor": ml_models_parent_pod_resources},
        )
```

**Resource Tiers:**
- **Parent Pods**: Orchestration layer
- **Child Pods**: Model execution layer

## Deployment Topology

### Environment Progression

```mermaid
graph LR
    DEV[Development<br/>Local Docker Compose]
    STAGE[Staging<br/>EKS Cluster]
    PROD[Production<br/>EKS Cluster]
    
    DEV -->|Jenkins CI| STAGE
    STAGE -->|Manual Approval| PROD
    
    style DEV fill:#e3f2fd
    style STAGE fill:#fff3e0
    style PROD fill:#ffebee
```

### Image Deployment Pipeline

From RFC 0001 and Jenkins configuration:

1. **Code Change**: Push to `data-airflow-dags` repository
2. **Jenkins Build**: Builds both Airflow and DBT images
3. **DockerHub Push**: Tagged with environment (staging/production)
4. **Helm Deployment**: Updates Kubernetes deployments via `data-infrastructure` repository

**Image Tags:**
- Development: `latest` or PR-specific tags
- Staging: `staging` tag
- Production: `production` tag

### Health Checks

Each component implements health monitoring:

| Component | Endpoint | Interval | Timeout |
|-----------|----------|----------|---------|
| Webserver | `http://localhost:8080/health` | 30s | 10s |
| Scheduler | `http://localhost:8974/health` | 30s | 10s |
| Worker | Celery inspect ping | 30s | 10s |
| Triggerer | Airflow jobs check | 30s | 10s |
| PostgreSQL | `pg_isready` | 10s | - |
| Redis | `redis-cli ping` | 10s | 30s |

## Configuration Management

### Environment Variables

Core configuration uses environment variables following Airflow's convention:

```
AIRFLOW__<section>__<key>
```

Examples:
- `AIRFLOW__CORE__EXECUTOR`: Sets executor type
- `AIRFLOW__DATABASE__SQL_ALCHEMY_CONN`: Database connection
- `AIRFLOW__WEBSERVER__BASE_URL`: Web UI URL

### Fernet Key Management

Encryption key for sensitive data:

```yaml
AIRFLOW__CORE__FERNET_KEY: 'EB868LKil7C8NOE0k8CNyAEHCSI_CY4PXCrjJ6x7ki4='
```

> **Important:** Production Fernet keys are stored in KeyBase and must be backed up before upgrades (see `docs/upgrading_airflow.md`).

### DAG Configuration

DAGs use a centralized configuration system via `common.utils.config.Config`:

```python
def airflow_DAG(dag_id, force_schedule=False, team_owner=None, **kwargs):
    conf = Config()
    kwargs["default_args"] = get_default_args(
        conf.get_property("dag_args"),
        kwargs.get("default_args"),
    )
```

Schedule intervals respect environment:
- **Production**: Uses specified schedule
- **Staging**: Requires `force_schedule=True` flag
- **Development**: Always `None` (manual trigger only)

## Service Dependencies

### Initialization Sequence

The `airflow-init` service ensures proper startup order:

1. Check system resources (memory, CPU, disk)
2. Create required directories
3. Run database migrations (`_AIRFLOW_DB_MIGRATE: 'true'`)
4. Create admin user (`_AIRFLOW_WWW_USER_CREATE: 'true'`)
5. Signal completion to dependent services

All Airflow services depend on `airflow-init` completion:

```yaml
depends_on:
  airflow-init:
    condition: service_completed_successfully
```

### Network Communication

Services communicate over Docker's internal network:

- **Webserver → PostgreSQL**: Metadata queries
- **Scheduler → Redis**: Task publishing
- **Worker → Redis**: Task consumption
- **Worker → PostgreSQL**: Result storage
- **All → Vault**: Secrets retrieval

External access limited to:
- Port 8080: Airflow web UI
- Port 9000: Vault (development only)
- Port 2222: SFTP test server (development only)

## Monitoring and Observability

### Health Check Infrastructure

Each service exposes health endpoints for orchestration:

- **Scheduler**: HTTP server on port 8974 (`AIRFLOW__SCHEDULER__ENABLE_HEALTH_CHECK: 'true'`)
- **Webserver**: `/health` endpoint on port 8080
- **Workers**: Celery inspect commands
- **Triggerer**: Airflow jobs check command

### Log Management

Logs are persisted via volume mounts:

```yaml
volumes:
  - ./logs:/opt/airflow/logs
```

This enables:
- Log retention across container restarts
- Local log inspection during development
- Integration with external log aggregation systems in production

## Related Documentation

- [Local Development Setup](./local-development-setup.md) - Setting up the development environment
- [Deployment Guide](./deployment-guide.md) - Production deployment procedures
- [DBT Integration](./dbt-integration.md) - Detailed DBT integration patterns
- [Configuration Management](./configuration-management.md) - Configuration options and management
- [Monitoring and Alerting](./monitoring-alerting.md) - Observability setup