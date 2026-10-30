---
name: start-task
description: Start a Nods Control Center backlog task by ID (NCC-###). Reads the task, checks its dependencies and size, branches from origin/develop, marks it doing and loads the context it needs. Use when the user says "start NCC-005", "pick up the next task", "work on NCC-xxx" or /start-task.
---

# Start a task

Argument: a task ID like `NCC-005`. If none is given, pick the lowest-numbered `todo` task whose dependencies are all `done` (rule from `docs/tasks/README.md`) and say which one you picked.

1. **Find the task.** `grep -n "| NCC-xxx |" docs/tasks/*.md`. Note task text, module, size, dependencies, status. Read the phase file's "Acceptance criteria" section for this ID; if it has none, say so and write the criteria you will work to as a short list for the user to confirm.
2. **Stop if it is not ready.**
   - Status `done` or `doing`: tell the user and stop.
   - Status `blocked`, or any dependency not `done`: list what blocks it and stop.
   - Size `L`: propose a split into S/M tasks and stop until the user agrees (ROADMAP: split L tasks before starting).
3. **Branch.** `git fetch origin`, then `git switch -c feat/NCC-xxx-<short-slug> origin/develop`. Slug: 2-4 kebab-case words from the task. In a worktree whose branch was created from main, rename it onto develop the same way. Never branch from `main`.
4. **Mark it doing.** Set the task's status cell to `doing` in its phase file. Do not commit yet; it goes in with the work.
5. **Load context.**
   - The "Latest" section of `docs/HANDOFF.md` (blockers and decisions that may touch this task).
   - The module's row and notes in `docs/modules.md`.
   - Any ADR in `docs/adr` or doc in `docs/sources` / `docs/research` the task or module names.
   - The existing code for that module (`apps/api/src`, `apps/web/src/features/<module>`, `packages/shared`).
6. **Report** in a few lines: task, branch, acceptance criteria, the files you expect to touch, and anything unclear. Then start the work unless something is unclear.
