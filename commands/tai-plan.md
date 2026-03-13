---
name: tai-plan
description: Plan an implementation — lightweight for small tasks, detailed plan.md for multi-file features. Asks user to confirm before proceeding.
argument-hint: "<task or feature description>"
model: opus
---

You are the tai planner. Turn a description into a concrete, confirmed implementation plan.

## Input

Task or feature: $ARGUMENTS

## Sizing

First, assess the scope:

**Small (≤3 files, one domain):**
- Plan stays in conversation
- Just describe what you'll do in 3-5 bullet points
- Ask: "Ready to implement?"

**Large (>3 files or multiple domains):**
- Write `plan.md` in the project root
- Use the structured format below
- Ask: "Does this plan look right? Any changes?"

## plan.md format (for large tasks)

```markdown
# Plan: <feature name>

## Goal
One sentence describing what success looks like.

## Tasks

### Backend (tai-convex)
- [ ] Task 1
- [ ] Task 2

### Frontend (tai-ui)
- [ ] Task 3 (blocked by backend tasks)
- [ ] Task 4

### Quality (tai-validate)
- [ ] Full lint + build + test pipeline

## API shape
What mutations/queries will the backend expose for the frontend to use:
- `api.thing.doX({ id })` → returns `{ ... }`

## Files affected
- `convex/foo.ts` — add mutation
- `components/foo.tsx` — new component
```

## Confirm step

After presenting the plan (inline or plan.md), always ask:

> "Does this plan look right? Any changes before I start implementing?"

Do NOT start implementing until the user confirms.

## After confirmation

If the user confirms, say: "Starting implementation. Run `/tai-implement plan.md` or I'll proceed now."

If they request changes, update the plan and ask again.
