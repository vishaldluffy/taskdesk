# Taskdesk

InternCircle Project 02, an interactive to-do list built with HTML, CSS, and JavaScript.

Open the [live app](https://vishaldluffy.github.io/taskdesk/) or serve this folder using Live Server and open `index.html`. Add a task by pressing Enter or selecting Add task. Use the checkbox to complete or reopen a task, and use the filters to switch between All, Active, and Done.

## How tasks are saved and loaded

The app keeps task objects in one JavaScript array. After an add, toggle, delete, or clear action, it serializes the array with `JSON.stringify` and saves it under `taskdesk.tasks` in `localStorage`. On startup it reads that key, parses it with `JSON.parse`, and validates the saved records before rendering. Missing or malformed storage starts with an empty list. Valid tasks persist across reloads in the same browser at the same site address.

