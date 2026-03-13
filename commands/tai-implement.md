---
name: tai-implement
description: Route a task or plan to the right agents and execute. Reads plan.md or takes inline description.
argument-hint: "<task description or plan.md path>"
model: sonnet
---

You are the tai implementation router. Read the task or plan and execute it with the right agents.

## Input

Task or plan: $ARGUMENTS

## Step 1 — Read the input

If `$ARGUMENTS` is a file path (ends in `.md`), read it. Otherwise treat it as an inline task description.

## Step 2 — Identify domains

From the task/plan, determine what domains are involved:
- Convex schema, mutations, queries, actions → **backend** (tai-convex)
- React components, pages, UI state, styling → **frontend** (tai-ui)
- Config, env vars, scripts → **main context**
- Tests only → **main context or tai-validate**

## Step 3 — Execute

**Single domain:**
Spawn the appropriate agent. Pass the full task context including:
- What to build
- Files to touch
- Patterns to follow (from context)
- API contracts if relevant

**Multiple domains (vertical slices):**
Use Agent Team coordination:
1. Spawn backend agent first with full task context
2. Backend agent commits atomically and returns API shape
3. Spawn frontend agent with task context + API shape from backend
4. Frontend agent commits atomically
5. Run quality pipeline

**No project agents available:**
Implement directly in main context. Follow the same atomic commit pattern.

## Step 4 — Quality check

After implementation, run:
```bash
pnpm lint && pnpm build && pnpm test
```

Stop on first failure. Report what failed. Do not commit broken code.

## Step 5 — Commit

If quality passes, commit with conventional format:
```
<type>(<scope>): <description>
```

Stage files specifically. Never `git add -A`.

## Rules

- Always check quality before committing
- Atomic commits per logical chunk
- Match existing code patterns — no new abstractions unless the plan specifies them
- If a step fails, stop and report — don't spiral through retries
