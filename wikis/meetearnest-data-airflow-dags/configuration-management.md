---
title: Configuration Management
description: guide documentation
---

<div style="border-bottom: 1px solid var(--vp-c-divider); padding-bottom: 1rem; margin-bottom: 2rem;">
  <h1 style="margin-bottom: 0.5rem;">Configuration Management</h1>
  <div style="display: flex; gap: 1rem; flex-wrap: wrap; font-size: 0.9rem; color: var(--vp-c-text-2);">
    <span style="display: flex; align-items: center; gap: 0.25rem;">
      📖 <strong>Guide</strong>
    </span>
    <span style="display: flex; align-items: center; gap: 0.25rem;">
      📝 <strong>855</strong> words
    </span>
    <span style="display: flex; align-items: center; gap: 0.25rem;">
      ⏱️ <strong>5</strong> min read
    </span>
  </div>
</div>

Configuration management in the data-airflow-dags repository is handled through a combination of environment variables, Vault secrets, and a centralized configuration module. The system supports multiple deployment environments (local, development, staging, production) with environment-specific settings.

## Configuration Architecture

```mermaid
graph TD
    A[Environment Variable: ENVIRONMENT] --> B[Config Class]
    B --> C[Environment-Specific Config Dict]
    C --> D[DAG Configuration]
    C --> E[Database Credentials]
    C --> F[External Service Settings]
    G[Vault] --> H[vault_client Module]
    H --> I[Runtime Secret Injection]
    I --> D
    J[docker-compose.yml] --> K[Local Environment]
    K --> B
```

## Environment Detection

The system determines the current environment through the `ENVIRONMENT` environment variable:

```python
environment = os.environ["ENVIRONMENT"]
```

**Supported environments:**
- `local` - Local development using Docker Compose
- `development` - Development Kubernetes cluster
- `staging` - Staging environment
- `production` - Production environment

## Configuration Module

The primary configuration is managed in `dags/common/utils/config.py` through a `Config` class that maintains environment-specific dictionaries.

### Configuration Structure

```mermaid
graph LR
    A[Config Class] --> B[dag_args]
    A --> C[Database Configs]
    A --> D[S3 Buckets]
    A --> E[External Services]
    A --> F[Kubernetes Settings]
    C --> C1[redshift_violin]
    C --> C2[snowflake]
    C --> C3[postgres]
    C --> C4[neo4j]
    D --> D1[redshift_bucket]
    D --> D2[api_bucket]
    D --> D3[analyst_bucket]
    E --> E1[SFTP Credentials]
    E --> E2[API Credentials]
    E --> E3[EMR Settings]
```

### Key Configuration Categories

| Category | Purpose | Example Keys |
|----------|---------|--------------|
| `dag_args` | Default Airflow DAG arguments | `owner`, `start_date`, `on_failure_callback` |
| Database connections | Credentials and connection details | `redshift_violin`, `snowflake`, `postgres` |
| S3 buckets | Environment-specific bucket names | `redshift_bucket`, `api_bucket`, `analyst_bucket` |
| External services | Third-party service configurations | `braze`, `cx1`, `zendesk`, `even` |
| Kubernetes | K8s executor settings | `k8s_annotations`, node selectors |
| EMR | Elastic MapReduce cluster settings | Security groups, subnets, IAM roles |

### Accessing Configuration

Configuration values are accessed through the singleton `config` instance:

```python
from common.utils.config import config

# Get a specific property
redshift_config = config.get_property("redshift_violin")
s3_bucket = config.get_property("api_bucket")
```

The `get_property()` method returns `None` if the property doesn't exist in the current environment.

## Vault Secrets Management

Secrets are stored in HashiCorp Vault and accessed at runtime through the `vault_client` module.

### Available Vault Variables

The following secrets are documented in `docs/available_variables.md`:

| Variable | Description |
|----------|-------------|
| `database_username` / `database_password` | Airflow metadata DB credentials |
| `redshift_violin_user` / `redshift_violin_password` | Redshift warehouse credentials |
| `snowflake_user` / `snowsql_private_key` / `snowsql_private_key_passphrase` | Snowflake authentication |
| `google_sa_base64` | Google Sheets service account JSON |
| `fuelsdk_client_id` / `fuelsdk_client_secret` | Salesforce Marketing Cloud |
| `splunk_banyan_token` | Splunk HEC token |
| `banyan_token` | Banyan refresh token |
| Various SFTP credentials | Experian, Navient, SST, etc. |

### Injecting Vault Secrets into DAGs

**Method 1: Environment Variables (Python Operators)**

```python
from common.utils.vault_client import set_envs_from_vault

# Inject specific secrets as environment variables
set_envs_from_vault(
    "snowflake_user", 
    "snowsql_private_key", 
    "snowsql_private_key_passphrase"
)
```

This function retrieves secrets from Vault and sets them as environment variables for the current process.

**Method 2: Kubernetes Secrets (Pod Operators)**

For KubernetesPodOperator tasks, Vault secrets are passed via Kubernetes secrets:

```python
from common.utils.config import vault_token_secret, vault_envs

KubernetesPodOperator(
    secrets=[vault_token_secret],
    env_vars=vault_envs,
    # ... other parameters
)
```

Where:
- `vault_token_secret` - Kubernetes secret containing the Vault token
- `vault_envs` - Dictionary with Vault connection parameters (`VAULT_URL`, `VAULT_PORT`, `VAULT_KEY`)

### Vault Configuration by Environment

**Local Environment (docker-compose.yml):**
```yaml
environment:
  USE_VAULT: true
  VAULT_URL: http://vault
  VAULT_PORT: 9000
  VAULT_TOKEN: myC0mpl3xT0k3n
  VAULT_KEY: data-airflow-dags
```

**Development/Staging/Production:**
Vault credentials are injected via Kubernetes secrets and service accounts. The Vault token is mounted from the `vault-token` secret.

## Airflow Variables and Connections

### Environment Variables

Airflow configuration can be set via environment variables using the pattern:
```
AIRFLOW__<section>__<key>
```

Example from `docker-compose.yml`:
```yaml
AIRFLOW__CORE__EXECUTOR: CeleryExecutor
AIRFLOW__DATABASE__SQL_ALCHEMY_CONN: postgresql+psycopg2://airflow:airflow@postgres/airflow
AIRFLOW__WEBSERVER__BASE_URL: 'http://localhost:8080'
```

### Connection Strings

Connections can be defined via environment variables prefixed with `AIRFLOW_CONN_`:
```
AIRFLOW_CONN_POSTGRES_MASTER=postgres://user:password@localhost:5432/master
```

> **Note:** Connections defined this way work for hooks but won't appear in the Airflow UI unless also created in the database.

## DBT Configuration

DBT profiles are managed separately from Airflow configuration and use environment-specific targets.

### DBT Profile Configuration

DBT tasks specify their configuration through `dbt_settings` dictionaries:

```python
dbt_settings = {
    "warehouse": "snowflake",
    "profiles_dir": "profiles/",
    "target": "vpc-development" if os.environ["ENVIRONMENT"] == "development" else None,
}
```

### Environment-Specific Targets

The `target` parameter determines which DBT profile target to use:
- **Local/Development:** `vpc-development` - Uses personal Okta credentials
- **Staging/Production:** Default target from profile - Uses service account credentials

### DBT in Kubernetes

DBT runs in separate containers using the `dbt_image`:

```python
from common.utils.config import dbt_image, vault_token_secret, vault_envs

KubernetesPodOperator(
    image=dbt_image,
    secrets=[vault_token_secret],
    env_vars=vault_envs,
    arguments=[dbt.debug(**dbt_settings)],
    # ...
)
```

The DBT image tag is environment-specific:
```python
tag = environment.lower() if environment != "local" else "latest"
dbt_image = f"earnest/data-dbt:{tag}"
```

## Kubernetes Configuration

### Pod Resource Specifications

Resource requirements are defined as constants in `config.py`:

```python
dbt_parent_pod_resources = k8s_models.V1ResourceRequirements(
    limits={"memory": "800Mi", "cpu": "800m"},
    requests={"memory": "800Mi", "cpu": "800m"},
)

dbt_child_pod_resources = k8s_models.V1ResourceRequirements(
    limits={"memory": "800Mi", "cpu": "800m"},
    requests={"memory": "800Mi", "cpu": "800m"},
)
```

### Kubernetes Defaults

The `k8s_defaults` dictionary provides standard settings for all KubernetesPodOperator tasks:

| Setting | Local | Development | Staging/Production |
|---------|-------|-------------|-------------------|
| `cluster_context` | `docker-desktop` | N/A | N/A |
| `in_cluster` | `True` | `True` | `True` |
| `image_pull_policy` | `IfNotPresent` | `IfNotPresent` | `Always` |
| `namespace` | From Airflow config | From Airflow config | From Airflow config |
| `node_selector` | `None` | `None` | `karpenter.sh/nodepool: data-airflow` |
| `service_account_name` | `None` | `None` | `de-airflow` |

### Environment-Specific Annotations

Kubernetes pod annotations vary by environment:

```python
"k8s_annotations": {
    # Development
    "iam.amazonaws.com/role": "arn:aws:iam::747722821363:role/k8s-de-compute-services-airflow",
    
    # Staging/Production
    "karpenter.sh/do-not-disrupt": "true",
    "eks.amazonaws.com/role-arn": "arn:aws:iam::831351477977:role/de-airflow-c1-de-stg-us-east-1",
}
```

## SFTP Connection Configuration

SFTP credentials are stored as dictionaries in `config.py` with Vault key references:

```python
experian_sftp_credentials = {
    "host": "stm.experian.com",
    "vault_username": "experian_dataexchange_sftp_user",
    "vault_password": "experian_dataexchange_sftp_password",
    "port": 22,
}

sst_sftp_credentials = {
    "host": "mft.alorica.com",
    "vault_username": "sst_service_username",
    "vault_password": "sst_service_sftp_password",
    "port": 22,
}
```

These are used in connectivity tests and data extraction DAGs.

## Database Connection Patterns

### Snowflake

```python
snowflake_params = {
    "account": snowflake_cred["account"],
    "user": snowflake_cred["user"],
    "role": snowflake_cred["role"],
    "warehouse": snowflake_cred["warehouse"],
}
```

Snowflake authentication uses private key authentication. The private key and passphrase are retrieved from Vault at runtime.

### Redshift

```python
redshift_params = {
    "username": redshift_cred["vault_username"],
    "password": redshift_cred["vault_password"],
    "host": redshift_cred["hostname"],
    "port": redshift_cred["port"],
    "database": redshift_cred["db_name"],
    "iam_role": redshift_cred["iam_role"],
}
```

### PostgreSQL

PostgreSQL configurations support multiple databases with schema-specific access:

```python
postgres_params = {
    "host": postgres_cred["k8smaster"]["host"],
    "port": 5432,
    "database": get_db_name(postgres_cred),
    "vault_username": postgres_cred["k8smaster"]["user"],
    "vault_password": postgres_cred["k8smaster"]["password"],
}
```

Helper function for dynamic database selection:
```python
def get_db_params(db_name: str, use_main: bool = False):
    # Returns connection parameters for specific database
    # use_main=True connects to primary (write) instance
```

## Configuration File Organization

```
data-airflow-dags/
├── dags/
│   └── common/
│       └── utils/
│           ├── config.py              # Main configuration module
│           └── vault_client.py        # Vault integration
├── dbt/
│   └── profiles/                      # DBT profile configurations
├── docs/
│   └── available_variables.md         # Vault secrets documentation
├── docker-compose.yml                 # Local environment configuration
└── vault-data/                        # Local Vault data (gitignored)
```

## Best Practices for Adding Configuration

### Adding a New Environment-Specific Setting

1. **Add to Config Class:**
   ```python
   # In config.py Config._conf dictionary
   "local": {
       "new_service": {
           "api_url": "http://localhost:8000",
           "vault_token": "new_service_token",
       }
   },
   "production": {
       "new_service": {
           "api_url": "https://api.service.com",
           "vault_token": "new_service_token",
       }
   }
   ```

2. **Create accessor if needed:**
   ```python
   new_service_config = config.get_property("new_service")
   ```

### Adding a New Vault Secret

1. **Document in `docs/available_variables.md`:**
   ```markdown
   | `new_service_token` | `set-me-please` | New service API token |
   ```

2. **Add to local Vault data** (for local development)

3. **Use in DAG:**
   ```python
   set_envs_from_vault("new_service_token")
   ```

### Adding Database Connection Parameters

1. **Add credentials to environment config:**
   ```python
   "new_database": {
       "host": "db.example.com",
       "vault_username": "new_db_user",
       "vault_password": "new_db_password",
       "port": 5432,
   }
   ```

2. **Create parameter dictionary:**
   ```python
   new_db_cred = config.get_property("new_database")
   new_db_params = {
       "host": new_db_cred["host"],
       "username": new_db_cred["vault_username"],
       "password": new_db_cred["vault_password"],
   }
   ```

### Adding S3 Bucket Configuration

S3 bucket names follow environment-specific naming conventions:

```python
# Pattern: earnest-{environment}-data-infrastructure-{purpose}-data-stage
"staging": {
    "new_bucket": "earnest-staging-data-infrastructure-new-service-data-stage",
}
```

Access via:
```python
s3_new_bucket = config.get_property("new_bucket")
```

## Local Development Configuration

### Snowflake Authentication (Local)

Local Snowflake access requires personal Okta credentials:

```bash
export OKTA_USERNAME=your_username
export OKTA_PASSWORD=your_password
export SNOWFLAKE_ROLE=dna_data_engineer  # or dna_data_scientist, dna_analyst
```

These are used by the Snowflake token generator service to obtain temporary credentials.

### Vault Setup (Local)

The local Vault instance is configured in `docker-compose.yml`:

```yaml
vault:
  image: earnest/vault-dev:5.2.13-d413009
  ports:
    - "9000:9000"
  volumes:
    - "./vault-data:/etc/vault-data"
  environment:
    - VAULT_AUTH_TOKEN=myC0mpl3xT0k3n
    - VAULT_DATA_DIR=/etc/vault-data/
```

Vault data is stored in the `vault-data/` directory (gitignored).

## Connectivity Testing

The `connectivity_tests_dag.py` validates configuration across environments:

```mermaid
graph TD
    A[Start] --> B[Check Airflow]
    A --> C[Check Vault]
    A --> D[Print Vault Keys]
    A --> E[Check SFTP Connections]
    A --> F[Check Port Connectivity]
    A --> G[DBT Debug]
    B --> H[End]
    C --> H
    D --> H
    E --> H
    F --> H
    G --> H
```

This DAG runs every 20 minutes in production to verify:
- Airflow webserver accessibility
- Vault connectivity and key availability
- SFTP server connections (SST, Experian)
- Network port accessibility
- DBT/Snowflake configuration

## Configuration Precedence

Configuration values are resolved in the following order:

1. **Environment variables** (highest precedence)
2. **Vault secrets** (runtime injection)
3. **Config class defaults** (environment-specific)
4. **Airflow configuration** (airflow.cfg or environment variables)

> **Important:** Vault secrets are retrieved at DAG execution time, not at DAG parsing time. Ensure `set_envs_from_vault()` is called within task context or at the module level before task definitions.