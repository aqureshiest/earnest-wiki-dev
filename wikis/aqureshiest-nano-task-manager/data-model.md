---
title: Data Model
description: reference documentation
---

# Data Model

The task object is the core data structure in nano-task-manager. This page describes its schema, storage mechanism, and lifecycle.

## Task Object Schema

A task is represented as a dictionary with three properties:

| Property | Type | Description |
|----------|------|-------------|
| `id` | integer | Unique identifier, auto-generated on creation |
| `text` | string | The task description provided by the user |
| `completed` | boolean | Completion status; defaults to `False` when created |

### Example Task Object

```json
{
  "id": 1,
  "text": "Buy groceries",
  "completed": false
}
```

## Storage

Tasks are stored in a Python list held in memory on the backend:

```python
tasks = []
```

This list is populated when tasks are created via the API and persists for the duration of the application runtime. When the application restarts, all tasks are lost—there is no persistent storage mechanism.

## ID Generation

Task IDs are auto-generated using a global counter that increments with each new task:

```python
task_id_counter = 1

# When a task is created:
new_task = {
    "id": task_id_counter,
    "text": task_text,
    "completed": False
}
tasks.append(new_task)
task_id_counter += 1
```

IDs start at 1 and increment sequentially. There is no mechanism to reuse IDs after task deletion, so the counter only moves forward.

## Constraints and Validation

The data model enforces no validation or constraints beyond basic Python types:

- The `text` field accepts any string value, including empty strings (though the frontend prevents empty submissions)
- The `completed` field is always a boolean
- The `id` field is always an integer
- There are no uniqueness constraints, length limits, or format requirements at the data layer
- No null/None checks or type coercion occur during task creation

> **Note:** Input validation occurs on the frontend (e.g., trimming whitespace before submission), but the backend does not enforce these constraints. A direct API call with invalid data would be accepted.

## Related Documentation

- [API Reference](./api-reference.md) — Task creation, retrieval, update, and deletion endpoints
- [Backend Implementation](./backend-structure.md) — How tasks are manipulated in Flask route handlers
- [Limitations & Considerations](./limitations-and-future.md) — Implications of in-memory storage and lack of persistence