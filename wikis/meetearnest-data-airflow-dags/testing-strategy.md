---
title: Testing Strategy
description: guide documentation
---

<div style="border-bottom: 1px solid var(--vp-c-divider); padding-bottom: 1rem; margin-bottom: 2rem;">
  <h1 style="margin-bottom: 0.5rem;">Testing Strategy</h1>
  <div style="display: flex; gap: 1rem; flex-wrap: wrap; font-size: 0.9rem; color: var(--vp-c-text-2);">
    <span style="display: flex; align-items: center; gap: 0.25rem;">
      📖 <strong>Guide</strong>
    </span>
    <span style="display: flex; align-items: center; gap: 0.25rem;">
      📝 <strong>694</strong> words
    </span>
    <span style="display: flex; align-items: center; gap: 0.25rem;">
      ⏱️ <strong>4</strong> min read
    </span>
  </div>
</div>

This guide documents the unit testing approach used in the data-airflow-dags repository, including test organization, mocking strategies, and guidelines for writing new tests.

## Test Organization

The unit tests are organized under `tests/unit/` and mirror the source code structure in `dags/`. This parallel structure makes it straightforward to locate tests for any given module.

```
tests/unit/
└── dags/
    └── common/
        ├── test_repo.py
        ├── db/
        │   └── test_db.py
        └── google/
            └── test_sheets.py
```

Each test file corresponds to a module in the source tree, with the naming convention `test_\<module_name\>.py`.

## Testing Framework

The test suite uses **pytest** as the testing framework. Tests leverage pytest's fixture system for setup and dependency injection, and use `unittest.mock` for mocking external dependencies.

## Mocking Strategies

### External Dependencies

The codebase employs several mocking strategies to isolate units under test from external dependencies:

#### Environment Variables

Environment variables are mocked using pytest's `monkeypatch` fixture:

```python
@pytest.fixture
def mock_env_variables(monkeypatch):
    monkeypatch.setenv("REDSHIFT_VIOLIN_USER", "username")
    monkeypatch.setenv("REDSHIFT_VIOLIN_PASSWORD", "password")
```

This approach allows tests to verify environment variable mapping without requiring actual credentials.

#### Database Connections

Database operations are tested using in-memory SQLite databases or by mocking pandas SQL operations:

```python
@pytest.fixture
def mock_pandas(monkeypatch):
    def mock_read_sql(*args, **kwargs):
        return pd.DataFrame()
    
    monkeypatch.setattr(pd.io.sql, "read_sql", mock_read_sql)
```

This pattern enables testing of database interaction logic without connecting to actual data warehouses.

#### S3 Operations

S3 interactions are mocked by replacing the `S3Manager` class with a mock implementation:

```python
class MockS3Manager:
    def upload_file(self, bucket, local_path, remote_path):
        upload_mock(bucket=bucket, local_path=local_path, remote_path=remote_path)
        # Verification logic here

monkeypatch.setattr("dags.common.repo.S3Manager", MockS3Manager)
```

This allows tests to verify file generation and upload parameters without actual S3 access.

#### Google Sheets

Google Sheets resources are mocked through fixtures (referenced as `mock_gs` in the test file), enabling tests to verify sheet operations without API calls.

## Test Fixtures

Fixtures provide reusable test data and mock objects. Common fixture patterns include:

### Configuration Fixtures

```python
@pytest.fixture
def params():
    return {
        "host": None,
        "database": None,
        "username": None,
        "port": None,
        "password": None,
        "dialect": "sqlite",
    }
```

### Repository Fixtures

```python
@pytest.fixture
def repository(params):
    return repo.get_repository(DB, params, secret_keys=())
```

These fixtures create properly configured instances for testing without requiring production credentials or connections.

## Testing Common Utilities

### Testing Repository Functions

The `test_repo.py` file demonstrates testing patterns for common utility functions in `dags.common.repo`:

**Secret Mapping**: Tests verify that environment variables are correctly mapped to secret keys:

```python
def test_map_secret_environment_variables(mock_env_variables, secrets):
    mapped_secrets = repo.map_secret_environment_variables(secrets)
    assert list(secrets.keys()) == list(mapped_secrets.values())
```

**Repository Initialization**: Tests confirm that repository objects are created with correct types:

```python
def test_get_repository(params):
    db = repo.get_repository(DB, params, secret_keys=())
    assert isinstance(db, DB)
```

**Data Loading**: Tests verify incremental data loading behavior:

```python
def test_load_pandas_df_incremental(db, df, sql):
    load_pandas_df_params = {
        "schema": "main",
        "table_name": "users",
        "is_append": True,
    }
    repo.load_pandas_df(
        load_pandas_df_params=load_pandas_df_params, df=df, repository=db
    )
    res = db.execute_sql(sql, query_format="string")
    rows = res.fetchall()
    assert len(rows) == 4
```

### Testing CSV Export to S3

The test for `df_to_s3_as_csv_gzip` demonstrates a comprehensive approach to testing file generation and upload:

```python
def test_df_to_s3_as_csv_gzip(monkeypatch):
    sample_df = pd.DataFrame({
        "id": [1, 2, 3],
        "name": ["Alice", "Bob", "Charlie"],
        "notes": ["", None, "test,comma"],
    })
    
    upload_mock = MagicMock()
    
    class MockS3Manager:
        def upload_file(self, bucket, local_path, remote_path):
            upload_mock(bucket=bucket, local_path=local_path, remote_path=remote_path)
            
            # Verify file contents
            with open(local_path, "rb") as f:
                with gzip.GzipFile(fileobj=f, mode="rb") as gz:
                    content = gz.read().decode("utf-8")
                    reader = csv.reader(content.splitlines(), delimiter=",", quotechar='"')
                    rows = list(reader)
                    
                    assert rows[0] == ["id", "name", "notes"]
                    assert rows[3] == ["3", "Charlie", "test,comma"]  # Quoted due to comma
    
    monkeypatch.setattr("dags.common.repo.S3Manager", MockS3Manager)
    
    df_to_s3_as_csv_gzip(
        df=sample_df,
        bucket="my-bucket",
        remote_path="snapshots/",
        output_file_name="test_csv",
        index=False,
    )
```

This test verifies:
- File compression (gzip)
- CSV formatting with proper quoting
- S3 upload parameters
- Handling of edge cases (empty strings, None values, commas in data)

## Running Tests Locally

> The specific command for running tests is not directly observable in the provided code evidence. Standard pytest invocation would typically be used.

To run tests for a specific module:

```bash
pytest tests/unit/dags/common/test_repo.py
```

To run all unit tests:

```bash
pytest tests/unit/
```

## Guidelines for Writing New Tests

Based on the observable patterns in the codebase:

### 1. Mirror Source Structure

Place test files in `tests/unit/` following the same directory structure as the source code in `dags/`.

### 2. Use Fixtures for Setup

Create fixtures for:
- Mock objects and dependencies
- Test data (DataFrames, configuration dictionaries)
- Reusable repository or database instances

### 3. Mock External Dependencies

Always mock:
- Database connections (use SQLite in-memory or mock pandas operations)
- S3 operations (replace S3Manager with mock implementations)
- API calls (Google Sheets, external services)
- Environment variables (use monkeypatch)

### 4. Test Edge Cases

Include test data that covers:
- Empty values and None
- Special characters requiring CSV quoting
- Incremental vs. full load scenarios
- Different data types

### 5. Verify Both Behavior and Output

Tests should verify:
- Return types and values
- Side effects (database writes, file creation)
- Correct parameter passing to mocked dependencies
- Data integrity (row counts, content validation)

### 6. Keep Tests Isolated

Each test should:
- Be runnable independently
- Not depend on execution order
- Clean up any resources (handled by fixtures)
- Use fresh fixtures for each test function

## Testing DAGs

> Direct evidence of DAG testing patterns is not present in the provided code sample. The test file focuses on common utility functions rather than DAG-specific testing.

For information on DAG structure and organization, see [DAG Organization and Structure](./dag-organization.md).

## Testing DBT Models

> Direct evidence of DBT model testing patterns is not present in the provided code sample.

For information on DBT integration, see [DBT Integration](./dbt-integration.md) and [Adding DBT Models](./adding-dbt-models.md).

## Related Documentation

- [Common Utilities](./common-utilities.md) - Documentation of the utility functions being tested
- [Database Abstraction Layer](./database-abstraction.md) - Details on the DB class and repository pattern
- [S3 Storage Patterns](./s3-storage.md) - Information on S3Manager and storage operations
- [Local Development Setup](./local-development-setup.md) - Environment setup for running tests