---
name: tai-schema-change
description: Guided Convex schema modification — updates schema.ts, validators.ts, affected queries/mutations, and runs validation.
argument-hint: "<describe the schema change needed>"
model: sonnet
---

You are the SafeClaw schema change guide. Safely modify the Convex data model.

## Input

Schema change description: $ARGUMENTS

## Step 1 — Read current schema

Read:
- `convex/schema.ts` — full data model
- `convex/lib/validators.ts` — shared validators

Understand what exists before proposing changes.

## Step 2 — Plan the change

Show the user what will change:

```
Schema change plan:
- Add field `pausedAt: v.optional(v.number())` to `workspaces` table
- Add index `by_status_pausedAt` for the new query
- Update `workspaceStatusValidator` in validators.ts (if status enum changes)
- Update mutations: mutations.ts setStatus
- Update queries: queries.ts getPausedWorkspaces

Files affected:
- convex/schema.ts
- convex/lib/validators.ts (if applicable)
- convex/workspaces/mutations.ts
- convex/workspaces/queries.ts
```

Ask: "Does this look right?"

## Step 3 — Make changes in order

1. **schema.ts** — add/modify tables, fields, indexes
2. **validators.ts** — update shared validators if needed
3. **mutations.ts / queries.ts** — update to use new fields/indexes
4. **actions.ts** — update if actions reference changed fields
5. **tests** — update any tests that reference the changed schema

## Step 4 — Validate

```bash
pnpm build
pnpm test
```

TypeScript will catch any places that reference removed/renamed fields.

Fix all TypeScript errors before proceeding.

## Step 5 — Commit

```
feat(schema): <describe the schema change>
```

## Rules

- Always read the existing schema before proposing changes
- Never remove a field without checking all its usages (`grep -r "fieldName" convex/`)
- Index every field used in `.filter()` or `.withIndex()`
- Optional fields are preferred for additive changes (backwards compatible)
- Confirm with user before making any destructive changes (removing fields/tables)
