---
title: Adding DBT Models
description: tutorial documentation
---

<div style="border-bottom: 1px solid var(--vp-c-divider); padding-bottom: 1rem; margin-bottom: 2rem;">
  <h1 style="margin-bottom: 0.5rem;">Adding DBT Models</h1>
  <div style="display: flex; gap: 1rem; flex-wrap: wrap; font-size: 0.9rem; color: var(--vp-c-text-2);">
    <span style="display: flex; align-items: center; gap: 0.25rem;">
      🎓 <strong>Tutorial</strong>
    </span>
    <span style="display: flex; align-items: center; gap: 0.25rem;">
      📝 <strong>1,170</strong> words
    </span>
    <span style="display: flex; align-items: center; gap: 0.25rem;">
      ⏱️ <strong>6</strong> min read
    </span>
  </div>
</div>

This guide covers the process of creating and integrating new DBT models into the data-airflow-dags repository, including SQL and Python model types, directory organization, configuration, testing, and Airflow integration.

## Overview

DBT models in this repository are organized under the `dbt/models/` directory and are deployed through Airflow DAGs. Models can be written in SQL or Python and are configured with materialization strategies, tags, and schema settings through the `dbt_project.yml` file and model-level config blocks.

## Directory Structure and Organization

Models are organized by team and domain within the `dbt/models/` directory:

```
dbt/models/
├── data_team/              # Data team models
│   ├── lending_artifacts_service/
│   ├── reporting_models/
│   │   ├── marts/
│   │   └── unions/
│   ├── boarding_service/
│   ├── loan_service/
│   └── [other domains]/
└── data_platform_team/     # Platform team models
    ├── ingestion/
    └── monitor/
```

### Team-Based Organization

Models are grouped by owning team:

- **`data_team/`**: Business domain models including reporting, marts, and service-specific transformations
- **`data_platform_team/`**: Infrastructure models for ingestion and monitoring

Within each team directory, models are further organized by:
- **Service/domain** (e.g., `lending_artifacts_service`, `boarding_service`)
- **Layer** (e.g., `staging`, `preparation`, `intermediate`, `marts`)

## Creating SQL Models

### Basic SQL Model Structure

Create a new `.sql` file in the appropriate directory with a config block and SELECT statement:

::: v-pre
```sql
{{ config(
    materialized = 'table',
    tags = ['hourly'],
) }}

select
    id,
    created_at,
    updated_at,
    -- your columns here
from {{ ref('source_model') }}
```
:::


### Configuration Options

Models are configured through the <span v-pre>`{{ config() }}`</span> macro at the top of the file:

**Materialization Types:**
- `view` - Creates a database view
- `table` - Creates a physical table
- `incremental` - Builds incrementally on existing data
- `ephemeral` - Creates a CTE, not materialized in database

**Common Configuration Parameters:**

| Parameter | Description | Example |
|-----------|-------------|---------|
| `materialized` | How the model is built | `'table'`, `'view'`, `'incremental'` |
| `tags` | Tags for selection and scheduling | `['hourly']`, `['nightly']` |
| `schema` | Target schema override | `'intermediate'`, `'staging'` |
| `cluster_by` | Clustering keys (Snowflake) | `'user_id'` |
| `pre-hook` | SQL to run before model | <span v-pre>`"{{ create_ingestion_table(this) }}"`</span> |
| `post-hook` | SQL to run after model | <span v-pre>`"GRANT SELECT ON {{ this }} TO ROLE SYSADMIN"`</span> |
| `transient` | Transient table flag | `false` |
| `incremental_strategy` | Strategy for incremental builds | `'delete+insert'`, `'merge'` |

### Example: Preparation Layer Model

::: v-pre
```sql
{{ config(
    materialized = 'table',
    tags = ['hourly'],
) }}

with source_data as (
    select * from {{ ref('stg_lending_artifacts__raw') }}
),

transformed as (
    select
        application_id,
        artifact_name::text as artifact_name,
        artifact_value::float as artifact_value,
        created_at::timestamp as created_at
    from source_data
    where artifact_name is not null
)

select * from transformed
```
:::


## Creating Python Models

Python models are supported in DBT 1.8.9+ (as specified in `dbt_project.yml`). While no Python model examples are present in the provided codebase, the configuration supports them.

Python models would be created as `.py` files in the models directory with the following structure:

```python
def model(dbt, session):
    dbt.config(
        materialized="table",
        tags=["hourly"]
    )
    
    # Your transformation logic here
    df = dbt.ref("source_model")
    
    return df
```

## Configuring Materialization

### Project-Level Configuration

The `dbt_project.yml` file sets default materializations and tags for entire directories:

```yaml
models:
  earnest_etl:
    data_team:
      reporting_models:
        materialized: table
        +tags:
          - "hourly"
        marts:
          materialized: table
          +tags:
            - "hourly"
```

### Model-Level Override

Individual models can override project-level settings:

::: v-pre
```sql
{{ config(
    materialized = 'view',  -- Override default 'table'
    tags = ['nightly'],     -- Override default 'hourly'
) }}
```
:::


### Schema Configuration

Schemas can be configured to vary by environment:

::: v-pre
```yaml
staging:
  schema: "{{ target.role if target.name == 'development'
              else 'staging' }}"
```
:::


This pattern:
- Uses the developer's role name in development
- Uses a fixed schema name in production

## Adding Tests and Documentation

### Schema Tests

Create a `schema.yml` file in the same directory as your models:

```yaml
version: 2

models:
  - name: prep_artifacts__artifacts
    description: "Prepared artifacts data"
    columns:
      - name: application_id
        description: "Unique application identifier"
        tests:
          - not_null
          - unique
      - name: artifact_name
        description: "Name of the artifact"
        tests:
          - not_null
```

### Documentation

Documentation is configured in the `dbt_project.yml`:

```yaml
data_team:
  +persist_docs:
    relation: true
    columns: true
```

This persists documentation as comments in the database for both relations and columns.

The repository includes a custom overview document at `dbt/docs/overview.md` that provides project-level documentation.

## Tagging for Scheduling

Tags control which models are included in specific DAG runs. Common tags in this repository:

| Tag | Schedule | Purpose |
|-----|----------|---------|
| `hourly` | Every hour | Frequently updated models |
| `twice_daily` | Twice per day | Regular updates |
| `nightly` | Once per day | Daily batch processing |
| `disable` | Never | Temporarily disabled models |

### Adding Tags

**In model config:**
::: v-pre
```sql
{{ config(
    tags = ['hourly'],
) }}
```
:::


**In dbt_project.yml:**
```yaml
lending_artifacts_service:
  preparation:
    +tags:
      - "hourly"
```

## Integrating with Airflow DAGs

### Standard DBT DAG Pattern

Create a new DAG file in the appropriate team directory (e.g., `dags/data_platform_team/transform/`):

```python
from common.dag_builder import dbt_airflow_DAG
from common.schedule import get_timezone_aware_date

description = """
Description of what this DAG does.
Cron-job: Schedule description
Contact:
    - Email: your.email@earnest.com
    - Slack: @yourname
"""

models = ["data_team.your_domain"]

dbt_settings = {
    "warehouse": "snowflake",
    "models": " ".join(models),
}

_, prod_dag = dbt_airflow_DAG(
    dag_id="dbt_your_domain",
    dbt_settings=dbt_settings,
    schedule_interval="0 6-20 * * *",
    start_date=get_timezone_aware_date(date=(2021, 1, 1)),
    tags=["DBT", "your_domain"],
)
```

### DBT Settings Dictionary

| Parameter | Description | Example |
|-----------|-------------|---------|
| `warehouse` | Target warehouse | `"snowflake"`, `"redshift"` |
| `models` | Model selection criteria | `"data_team.lending_artifacts_service+"` |
| `exclusions` | Models to exclude | `"tag:disable"` |
| `full_refresh` | Force full refresh | `True`, `False` |

### Model Selection Syntax

The `models` parameter supports DBT's selection syntax:

- `data_team.lending_artifacts_service` - Specific model/directory
- `data_team.lending_artifacts_service+` - Model and all downstream
- `+data_team.lending_artifacts_service` - Model and all upstream
- `tag:hourly` - All models with the "hourly" tag
- `path/to/models` - All models in a directory

### Ad Hoc DAG Pattern

For manual or one-off runs, create an ad hoc DAG with no schedule:

```python
from common.dag_builder import dbt_airflow_DAG

models = [
    "data_team.your_domain.specific_model",
]

dbt_settings = {
    "warehouse": "snowflake",
    "models": " ".join(models),
    "exclusions": "tag:disable",
    "full_refresh": True,
}

pre_prod_dag, prod_dag = dbt_airflow_DAG(
    dag_id="dbt_ad_hoc_your_name",
    dbt_settings=dbt_settings,
    schedule_interval=None,  # Manual trigger only
    tags=["DBT", "ad_hoc"],
)
```

### Build Command DAG

For using the `dbt build` command (runs models, tests, and snapshots together):

```python
from common.dag_builder import dbt_build_airflow_DAG

dbt_settings = {
    "warehouse": "snowflake",
    "models": " ".join(models),
    "exclusions": "tag:disable",
    "full_refresh": True,
}

prod_dag = dbt_build_airflow_DAG(
    dag_id="dbt_build_your_domain",
    operations=("build",),
    dbt_settings=dbt_settings,
    schedule_interval=None,
    tags=["DBT", "ad_hoc"],
)
```

## Fan Out DAGs

Fan Out DAGs create individual Airflow tasks for each DBT model, providing granular control and visibility.

### Adding Models to Fan Outs

Tag your model with the appropriate fan out selector:

::: v-pre
```sql
{{ config(
    materialized = 'table',
    tags = ['hourly'],  -- Adds to hourly fan out
) }}
```
:::


### Creating a New Fan Out

1. **Add a selector** in `dbt/selectors.yml`:
```yaml
selectors:
  - name: your_selector
    definition:
      method: tag
      value: your_tag
```

2. **Update artifact generation** in `bin/generate_artifacts.sh` and `.ci/validate_dbt.sh` to include the new selector

3. **Configure the fan out** in `dbt_fan_out_dag_factory.py` with a `FanOutConfig` object

### Refreshing Fan Out Artifacts

After adding models to a fan out, regenerate artifacts:

```bash
bin/generate_artifacts.sh
```

This script introspects DBT's `manifest.json` to build the Airflow DAG structure.

## Special Case: Adding Artifacts

The repository includes an automated script for adding new lending artifacts that updates multiple models and macros simultaneously.

### Using the Artifact Addition Script

```bash
python scripts/add_artifact_script.py
```

The script prompts for:
- **Product**: `slr`, `pl`, or `fraud`
- **Artifact name**: The technical name
- **Alias**: Display name (optional)
- **Datatype**: `boolean`, `float`, `cents`, `int`, `text`, `date`, `variant`
- **Journey**: `softpull`, `hardpull`, or `both`

### What the Script Does

The script automatically:

1. **Updates macros** to include the artifact name:
   - `mcr_get_pl_artifact_names.sql`
   - `mcr_get_slr_artifact_names.sql`
   - `mcr_get_pl_fraud_artifact_names.sql`

2. **Updates preparation models** with the new column:
   - `prep_artifacts__artifacts.sql`
   - `prep_artifacts__artifacts_pl.sql`
   - `prep_artifacts__artifacts_pl_fraud.sql`

3. **Updates union and mart models**:
   - `artifacts_union.sql`
   - `dim_application_decisioning_attributes.sql`
   - `dim_rate_check_decisioning_attributes.sql`
   - Product-specific variants

4. **Clones production data** for testing:
   ```python
   subprocess.run(["python", dbtclone_path, "-m", "prep_artifacts__artifacts"])
   ```

5. **Runs affected models** to validate:
   ```python
   subprocess.run([
       "dbt", "run",
       "--target", "development",
       "--profiles-dir", "./profiles/snowflake",
       "-m", *model_names,
       "--full-refresh",
   ])
   ```

### Insertion Landmarks

The script uses special comments as insertion points:

```sql
--ARTIFACT ADDITION AUTOMATION LANDMARK - DO NOT DELETE
```

These landmarks must be preserved in the SQL files for the automation to work.

## Environment-Specific Behavior

### Development vs Production

The DAG builder adjusts behavior based on the `ENVIRONMENT` variable:

**Development:**
- Uses local `dbt_test:latest` image
- No vault secrets required
- Simplified command execution

**Production:**
- Uses versioned DBT image from registry
- Includes Monte Carlo integration for observability
- Executes through `execute_dbt_commands.sh` wrapper

**Staging:**
- Schedules disabled by default unless `force_schedule=True`

### Pre-Production DAGs

For Redshift warehouses in production, a pre-production DAG is automatically created:

```python
pre_prod_dag, prod_dag = dbt_airflow_DAG(
    dag_id="dbt_your_domain",
    dbt_settings=dbt_settings,
    # ...
)
```

The pre-prod DAG:
- Has `schedule_interval=None` (manual trigger only)
- Uses `pre_prod=True` in dbt_settings
- Is tagged with `"pre_prod"`

## Best Practices

### Model Naming Conventions

Based on observed patterns in the codebase:

- **Staging**: `stg_\<source\>__\<entity\>`
- **Preparation**: `prep_\<domain\>__\<entity\>`
- **Intermediate**: `int_\<domain\>__\<entity\>`
- **Marts**: `dim_\<entity\>`, `fact_\<entity\>`, `act_\<entity\>`

### Referencing Models

Use the `ref()` function to reference other models:

::: v-pre
```sql
select * from {{ ref('prep_artifacts__artifacts') }}
```
:::


This creates dependencies that DBT uses to determine execution order.

### Schema Evolution

For ingestion models that need to handle schema changes, use the schema evolution macro:

::: v-pre
```yaml
pre-hook: "{{ create_ingestion_table_w_schema_evolution(this) }}"
tags: ["snowflake_pattern"]
```
:::


### Testing Strategy

Run models locally before committing:

```bash
dbt run --target development --profiles-dir ./profiles/snowflake -m your_model
dbt test --target development --profiles-dir ./profiles/snowflake -m your_model
```

> **Note**: The artifact addition script automatically runs affected models with `--full-refresh` to validate changes.

## Troubleshooting

### Common Issues

**Model not appearing in DAG:**
- Verify the model has the correct tag for the DAG's selection criteria
- Check that the model is not excluded by the `exclusions` parameter
- Ensure the model is in the correct directory path

**Schema conflicts:**
- Check schema configuration in `dbt_project.yml`
- Verify environment-specific schema logic
- Ensure development uses `target.role` for isolation

**Dependency errors:**
- Verify all `ref()` calls point to existing models
- Check for circular dependencies
- Review the DBT lineage graph

For additional troubleshooting guidance, see [Troubleshooting Guide](./troubleshooting.md).

## Related Documentation

- [DBT Integration](./dbt-integration.md) - Overview of DBT integration architecture
- [DBT Models Reference](./dbt-models-reference.md) - Comprehensive model catalog
- [Transform DAGs](./transform-dags.md) - Transform DAG patterns and organization
- [DAG Builder Framework](./dag-builder-framework.md) - DAG construction utilities
- [Testing Strategy](./testing-strategy.md) - Testing approaches and tools