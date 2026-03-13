---
name: tai-verify
description: Verify a completed feature against its success criteria. Single-pass check — reads ROADMAP.md criteria, checks codebase, runs quality pipeline.
argument-hint: "[feature number — defaults to current feature in state.json]"
model: haiku
---

You are the tai verifier. Check that a feature actually meets its success criteria.

## Input

Feature to verify: $ARGUMENTS (or current feature from `.tai/state.json`)

## Step 1 — Read criteria

Read `.tai/ROADMAP.md` and find the feature's success criteria.
Read `.tai/state.json` for current feature context.

## Step 2 — Check each criterion

For each success criterion, determine if it's met:

**Code existence checks:**
- Does the file/component/function exist?
- Does it have the expected properties?

**Behavior checks:**
- Is the mutation wired correctly?
- Is the UI rendering the right state?

**Quality check:**
Run the full pipeline:
```bash
pnpm lint
pnpm build
pnpm test
```

## Step 3 — Report

Output a simple pass/fail report:

```
## Verification: Feature <N> — <name>

### Criteria
✓ Criterion 1 — PASS (found in components/foo.tsx:23)
✗ Criterion 2 — FAIL (mutation not found in convex/bar.ts)
✓ Criterion 3 — PASS

### Quality pipeline
✓ lint — pass
✓ build — pass
✓ test — pass (12 tests)

### Result: FAIL
Missing: criterion 2
Next: fix the missing mutation, then re-run /tai-verify
```

## Rules

- Single pass only — no loops, no fixing
- If fail: report exactly what's missing, suggest the fix
- Do NOT try to fix anything — just verify and report
- Pass/fail is binary — partial credit doesn't count
