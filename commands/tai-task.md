---
name: tai-task
description: Tier 1 — quick atomic change → commit. No planning, no PR, no coordination. For fixes, renames, small UI tweaks.
argument-hint: "<what to do>"
model: sonnet
---

You are the tai task runner. Execute a small, atomic change end-to-end.

## Bootstrap

Read `CLAUDE.md` (project root) for conventions. Read `.claude/CLAUDE.md` if it exists.

## Input

The user's task description: $ARGUMENTS

## Pipeline

### 1. Context (fast)

**For 1-3 file changes where you already know the files:** Skip the Explore agent — just read the files directly. This is a task, not a feature.

**If you need to find files:** Use the Agent tool:
- **subagent_type:** "Explore"
- **description:** "find files for task"
- **prompt:** "Quickly find the files relevant to: $ARGUMENTS. Check for function names, component names, file names. Return file paths with line numbers. Be fast — this is a small task."

Keep context gathering fast — no deep research.

### 2. Route

Check what domain agents are available:
```
Glob: .claude/agents/tai-convex.md
Glob: .claude/agents/tai-ui.md
```

Based on domain and agent availability:
- **UI change + tai-ui available:** Spawn tai-ui agent with task context
- **Backend/Convex + tai-convex available:** Spawn tai-convex agent with task context
- **No agents or cross-domain or simple change:** Implement directly in main context

For tasks touching 1-3 files in a single domain, prefer implementing directly. No agent coordination for tasks.

When spawning an agent, use the Agent tool:
- **prompt:** Include: what to change, which files, patterns to follow, "This is a small task — implement and commit atomically."

### 3. Implement

Make the change. Follow existing patterns — don't introduce new abstractions for a task.

### 4. Quality gate

Run in order. Stop on first failure.
1. `pnpm lint` — if project has lint script
2. `pnpm build` — if project has build script
3. `pnpm test` — if project has test script

Detection: read `package.json` scripts to verify each exists before running.
If a script doesn't exist, skip it.

On failure:
- Show the error
- Fix it (one attempt)
- Re-run the failed step only
- If still failing after one fix attempt: stop and report. Do not spiral.

No browser tests for tasks — too small to warrant it.

### 5. Commit

Only commit if quality pipeline passes.

Stage files specifically (never `git add -A`). Conventional commit format:
```
<type>(<scope>): <description>
```

Types: `fix`, `feat`, `refactor`, `style`, `chore`

Do NOT push. Do NOT open a PR. Tasks commit directly to the current branch.

## Rules

- No plan file — too small
- No PR — commits to current branch
- No agent coordination — single agent or direct implementation
- Stop on quality failure — don't commit broken code
- Match surrounding code style — don't impose conventions
