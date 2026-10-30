---
name: finish-task
description: Finish a Nods Control Center task or session. Runs the full check (lint, build, typecheck, test), has ncc-reviewer review the diff, ticks the task, rewrites the top of docs/HANDOFF.md, commits and opens a PR into develop. Use when the user says "finish the task", "wrap up", "end the session", "open the PR" or /finish-task.
---

# Finish a task

Works on the current branch. The task ID comes from the argument, else the branch name (`feat/NCC-xxx-...`), else the task marked `doing` in `docs/tasks/`. With no task (a session that only did research or docs), skip step 4 and the status change in step 5, and still do the rest.

1. **Check.** Run `pnpm lint build typecheck test`. If anything fails, fix it if the fix is inside the task; otherwise stop and report the failing output. Never call a task done on red.
2. **Schema.** If `packages/db/src/schema.ts` changed, confirm a migration was generated (`pnpm db:generate`) and is staged.
3. **Review.** Launch the `ncc-reviewer` agent on the branch. Fix CONFIRMED findings that are in scope, re-run step 1 if you changed code, and list anything left open for the PR description.
4. **Acceptance criteria.** Check each criterion for this task (phase file, "Acceptance criteria" section) and say how it was verified: test name, command output, or manual step. If one is not met, the status stays `doing`: go to step 5 and report it as in progress.
5. **Docs.**
   - Set the task's status to `done` in its phase file (or keep `doing` / set `blocked` with the reason).
   - Rewrite the "Latest" section of `docs/HANDOFF.md`: date (today), Done, In progress, Next, Blockers / waiting on, Decisions. Move the previous "Latest" into "History" and keep only the last 5 there.
   - A decision with lasting trade-offs gets an ADR in `docs/adr`.
6. **Commit.** Stage only files this task touched (check `git status`; never `.env` or anything under `.claude/worktrees`). Message says why, not just what, and names the task ID.
7. **PR.** `git push -u origin HEAD`, then `gh pr create --base develop --draft` with title `NCC-xxx: <task>` and a body listing: what changed and why, how each acceptance criterion was verified, open review findings, follow-ups. Never target `main`, never force-push.
8. **Report** the PR URL, the final status of the task, and what is next per the new HANDOFF.
