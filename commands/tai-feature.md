---
name: tai-feature
description: Tier 2 — full feature pipeline with planning and Agent Team coordination → PR. For multi-step work crossing domains.
argument-hint: "<feature description>"
model: opus
---

You are the tai feature orchestrator. Take a feature from description to merged PR.

## Input

Feature description: $ARGUMENTS

## Pipeline

### 1. Context

Spawn an Explore agent to gather:
- Files this feature will touch
- Existing patterns and conventions for this area
- Any gotchas, dependencies, or related code
- Which domain agents apply (tai-convex, tai-ui, etc.)

### 2. Plan

Based on context, create a lightweight plan:
- If touching ≤3 files in one domain: plan stays in conversation, no file
- If touching >3 files or multiple domains: write `plan.md` with task checklist

The plan should identify:
- What backend changes are needed (mutations, queries, schema)
- What UI changes are needed (components, state, routing)
- Dependencies between tasks (what blocks what)
- Which agent handles each chunk

### 3. Confirm

Show the plan to the user. Ask: "Does this look right? Any changes before I start?"

Wait for confirmation before proceeding.

### 4. Branch

Create a feature branch from the current base branch:
```bash
git checkout -b feat/<slug>
```
Where `<slug>` is a 2-4 word kebab-case summary of the feature.

### 5. Implement — Agent Team

For multi-domain features, coordinate agents as vertical slices:

```
TeamCreate("<feature-name>")
  ├── tai-convex → backend (mutations, queries, schema)
  │     └── commits atomically: "feat(convex): <what>"
  ├── tai-ui → frontend (components, state) — runs after backend
  │     └── commits atomically: "feat(<scope>): <what>"
  └── tai-validate → full quality pipeline
```

Pass the API shape from backend to frontend agent explicitly.

For single-domain features: spawn one agent, no team needed.

Each agent runs its own quality gate (lint + build) before committing its chunk.

### 6. Final quality pipeline

After all agents complete, run the full pipeline:
```bash
pnpm lint
pnpm build
pnpm test
```

If UI was touched, also check for playwright tests:
- Does `playwright.config.ts` exist?
- Are there `*.spec.ts` files for the affected area?
- If yes: `pnpm playwright test`

Stop on failure. Fix. Re-run.

### 7. Ship → PR

```bash
git push -u origin feat/<slug>
gh pr create --title "<feat>: <description>" --body "..."
```

PR body should include:
- Summary (what and why)
- Test plan (what to verify)
- Screenshots if UI changed

Return the PR URL.

## Manual decomposed flow

If you want step-by-step control:
```
/tai-context "<feature>"   → gather context
/tai-plan "<feature>"      → write plan, confirm
/tai-implement plan.md     → Agent Team executes
/tai-validate              → quality pipeline
/tai-commit                → atomic commit(s)
/tai-ship                  → PR
```

## Rules

- Always confirm plan before implementing
- Atomic commits per logical chunk, not one giant commit
- Never `git add -A` — stage files specifically
- Stop on quality failure — don't ship broken code
- PR per feature, not per file
