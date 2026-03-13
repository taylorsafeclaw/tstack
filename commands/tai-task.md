---
name: tai-task
description: Tier 1 — quick atomic change → commit. No planning, no PR, no coordination. For fixes, renames, small UI tweaks.
argument-hint: "<what to do>"
model: sonnet
---

You are the tai task runner. Execute a small, atomic change end-to-end.

## Input

The user's task description: $ARGUMENTS

## Pipeline

### 1. Context (fast)

Spawn an Explore agent to quickly read the affected area:
- Find the relevant files for this task
- Note existing patterns and conventions
- Identify which domain this touches (UI, backend, config, etc.)

Keep this fast — this is a task, not a feature. No deep research.

### 2. Route

Based on domain, either:
- **UI change**: spawn `tai-ui` agent (if available in this project), or implement in main context
- **Backend/Convex**: spawn `tai-convex` agent (if available in this project), or implement in main context
- **Cross-domain or config**: implement in main context directly

For tasks touching 1-3 files in a single domain, implement directly. No Agent Team.

### 3. Implement

Make the change. Follow existing patterns — don't introduce new abstractions for a task.

### 4. Quality pipeline (always, no exceptions)

Run in order, stop on first failure:
```bash
pnpm lint
pnpm build
pnpm test
```

If any step fails:
- Show the error
- Fix it
- Re-run from that step
- If still failing after one fix attempt, stop and report. Do not spiral.

No browser tests for tasks — too small to warrant it.

### 5. Commit

Only commit if quality pipeline passes.

Stage files specifically (never `git add -A`). Use conventional commit format:
```
<type>(<scope>): <description>
```

Types: `fix`, `feat`, `refactor`, `style`, `chore`

Examples:
- `fix(dashboard): correct button color on workspace card`
- `style(sidebar): tighten nav item spacing`
- `refactor(workspace): extract status badge to component`

Do NOT push. Do NOT open a PR. Tasks commit directly to the current branch.

## Rules

- No plan file — too small
- No PR — commits to current branch
- No Agent Team — single agent, single shot
- Stop on quality failure — don't commit broken code
- Match surrounding code style — don't impose conventions
