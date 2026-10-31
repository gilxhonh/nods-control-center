---
name: start-task
description: Start a Nods Control Center backlog task by its Jira key (RDIT-##). Reads the task, checks its dependencies and size, branches from origin/develop, tells the user to move the ticket and loads the context it needs. Use when the user says "start RDIT-5", "work on RDIT-5", "pick up the next task" or /start-task.
---

# Start a task

Task IDs are Jira keys (`RDIT-##`, space Retail Dashboard For Integration Team). Status lives in Jira, which you cannot read; `docs/tasks/*.md` holds the definitions.

Argument: a key like `RDIT-5`. If none is given, take the next task in the schedule of the current plan (`docs/tasks/plan-*.md`) that HANDOFF does not list as done, and say which one you picked.

1. **Find the task.** `grep -n "| RDIT-5 |" docs/tasks/*.md`. Note task text, module, size, dependencies. Read the phase file's "Acceptance criteria" section for this key; if it has none, say so and write the criteria you will work to as a short list for the user to confirm.
2. **Stop if it is not ready.**
   - HANDOFF lists it as done or in progress on another branch: tell the user and stop.
   - A dependency is not listed as done in HANDOFF: name it and ask the user whether it is done in Jira before starting.
   - A decision it waits on (the plan's decisions table, "Blocks" column) is still open: say so; start only if the user wants to work on the assumption.
   - Size `L`: propose a split into S/M tasks and stop until the user agrees (ROADMAP: split L tasks before starting).
3. **Branch.** `git fetch origin`, then `git switch -c feat/RDIT-5-<short-slug> origin/develop`. Slug: 2-4 kebab-case words from the task. In a worktree whose branch was created from main, rename it onto develop the same way. Never branch from `main`.
4. **Jira.** Tell the user to move the ticket to In Progress. Do not edit the task files for status.
5. **Load context.**
   - The "Latest" section of `docs/HANDOFF.md` (blockers and decisions that may touch this task).
   - The module's row and notes in `docs/modules.md`.
   - Any ADR in `docs/adr` or doc in `docs/sources` / `docs/research` the task or module names.
   - The existing code for that module (`apps/api/src`, `apps/web/src/features/<module>`, `packages/shared`).
6. **Report** in a few lines: task, branch, acceptance criteria, the files you expect to touch, and anything unclear. Then start the work unless something is unclear.
