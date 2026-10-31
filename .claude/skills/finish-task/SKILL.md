---
name: finish-task
description: Finish a Nods Control Center task or session. Runs the full check (lint, build, typecheck, test), has ncc-reviewer review the diff, rewrites the top of docs/HANDOFF.md, commits, opens a PR into develop and says which Jira ticket to move. Use when the user says "finish the task", "wrap up", "end the session", "open the PR" or /finish-task.
---

# Finish a task

Works on the current branch. The task key (`RDIT-##`) comes from the argument, else the branch name (`feat/RDIT-5-...`). Status lives in Jira, which you cannot read or write: never edit the task files for status. With no task (a session that only did research or docs), skip step 4 and the Jira line in step 8, and still do the rest.

1. **Check.** Run `pnpm lint build typecheck test`. If anything fails, fix it if the fix is inside the task; otherwise stop and report the failing output. Never call a task done on red.
2. **Schema.** If `packages/db/src/schema.ts` changed, confirm a migration was generated (`pnpm db:generate`) and is staged.
3. **Review.** Launch the `ncc-reviewer` agent on the branch. Fix CONFIRMED findings that are in scope, re-run step 1 if you changed code, and list anything left open for the PR description.
4. **Acceptance criteria.** Check each criterion for this task (phase file, "Acceptance criteria" section) and say how it was verified: test name, command output, or manual step. If one is not met, the task stays In Progress: go to step 5 and report it as in progress.
5. **Docs.**
   - Rewrite the "Latest" section of `docs/HANDOFF.md`: date (today), Done, In progress, Next, Blockers / waiting on, Decisions. Move the previous "Latest" into "History" and keep only the last 5 there.
   - A decision with lasting trade-offs gets an ADR in `docs/adr`.
6. **Commit.** Stage only files this task touched (check `git status`; never `.env` or anything under `.claude/worktrees`). Message starts with the key (`RDIT-5: ...`) and says why, not just what.
7. **PR.** `git push -u origin HEAD`, then `gh pr create --base develop --draft` with title `RDIT-5: <task>` and a body listing: what changed and why, how each acceptance criterion was verified, open review findings, follow-ups. Never target `main`, never force-push.
8. **Report** the PR URL, which Jira ticket to move and to what (Done once the PR merges, In Progress or `blocked` with the reason otherwise), and what is next per the new HANDOFF.
