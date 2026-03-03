---
title: Getting Started
description: tutorial documentation
---

<div style="border-bottom: 1px solid var(--vp-c-divider); padding-bottom: 1rem; margin-bottom: 2rem;">
  <h1 style="margin-bottom: 0.5rem;">Getting Started</h1>
  <div style="display: flex; gap: 1rem; flex-wrap: wrap; font-size: 0.9rem; color: var(--vp-c-text-2);">
    <span style="display: flex; align-items: center; gap: 0.25rem;">
      🎓 <strong>Tutorial</strong>
    </span>
    <span style="display: flex; align-items: center; gap: 0.25rem;">
      📝 <strong>489</strong> words
    </span>
    <span style="display: flex; align-items: center; gap: 0.25rem;">
      ⏱️ <strong>3</strong> min read
    </span>
  </div>
</div>

# Getting Started

This guide walks you through running the Nano Task Manager application in minutes. The application is a lightweight, in-memory task management system with no external database dependencies.

## Prerequisites

- **Python 3.7+** installed on your system
- **pip** (Python package manager)
- A modern web browser

## Installation

### 1. Install Required Dependencies

The application requires Flask and Flask-CORS. Install both using pip:

```bash
pip install Flask Flask-CORS
```

- **Flask**: Provides the web server and API framework
- **Flask-CORS**: Enables cross-origin requests between the frontend and backend

### 2. Run the Application

Navigate to the project directory and start the application:

```bash
python app.py
```

You should see output similar to:

```
 * Running on http://127.0.0.1:3000
 * Debug mode: on
```

The application is now running locally.

## Accessing the Application

Open your web browser and navigate to:

```
http://localhost:3000
```

The Nano Task Manager interface will load. You should see:

- A header with the application title
- An input field with placeholder text "What needs to be done?"
- An "Add Task" button
- An empty task list area

## Basic Usage

### Adding a Task

1. Type your task description in the input field
2. Click the **Add Task** button, or press **Enter**
3. The task appears in the list below with a checkbox and delete button

### Completing a Task

- Click the checkbox next to any task to mark it as complete
- Completed tasks display with strikethrough text and reduced opacity
- Click the checkbox again to mark the task as incomplete

### Deleting a Task

- Click the **Delete** button on any task to remove it from the list
- The task is immediately removed from the interface

## Important Limitations

> **Data Persistence**: All tasks are stored in memory only. When you restart the application (stop and restart `app.py`), all tasks are lost. There is no database or file-based storage.

> **No Database Setup Required**: The application requires no database configuration, migrations, or initialization. It starts immediately and is ready to use.

## How It Works

The application consists of two components:

- **Backend** (`app.py`): A Flask server running on port 3000 that manages tasks via a REST API
- **Frontend** (`static/index.html`): A single-page web interface that communicates with the backend

When you interact with the UI, the frontend sends HTTP requests to the backend API, which stores tasks in a Python list. The frontend then refreshes the task list to reflect changes.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 3000 already in use | Stop other applications using port 3000, or modify the `port=3000` parameter in `app.py` |
| "Module not found" error | Ensure Flask and Flask-CORS are installed: `pip install Flask Flask-CORS` |
| Tasks not appearing | Verify the browser is accessing `http://localhost:3000` (not `http://127.0.0.1:3000` if you changed the host) |
| Changes not saving after restart | This is expected behavior—tasks are stored in memory only |

## Next Steps

- Explore the [API Reference](./api-reference.md) to understand the available endpoints
- Review the [Architecture & Design](./architecture.md) to learn how the application is structured
- Check [Limitations & Considerations](./limitations-and-future.md) for known constraints and planned improvements