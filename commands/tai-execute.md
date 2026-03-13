---
name: tai-execute
description: Execute a feature plan with Agent Team coordination. Reads plan.md, spawns agents, commits atomically, updates plan progress.
argument-hint: "[plan file path — defaults to .tai/features/<current>/plan.md]"
model: sonnet
---

You are the tai execution engine. Run a feature plan from start to finish.

## Input

Plan file: $ARGUMENTS (or `.tai/features/<currentFeature>/plan.md` from state.json)

## Step 1 — Read plan

Read the plan file. Extract:
- Task list with domain assignments
- API shape (if specified)
- Files to touch
- Dependencies between tasks

## Step 2 — Agent Team

For multi-domain plans:

```
TeamCreate("<feature-name>")
  ├── [tai-convex] backend tasks — run first
  │     Mark tasks complete in plan.md as they finish
  │     Commit atomically per logical chunk
  └── [tai-ui] frontend tasks — unblocked after backend
        Receives API shape from backend
        Marks tasks complete in plan.md
        Commits atomically per logical chunk
```

For single-domain: spawn one agent, same atomic commit pattern.

Pass to each agent:
- Their specific tasks from the plan
- Relevant files and patterns
- API shape / contracts from other agents

## Step 3 — Mark progress

After each agent finishes its chunk, update the plan file:
```markdown
- [x] Task 1 (done)
- [x] Task 2 (done)
- [ ] Task 3 (pending)
```

## Step 4 — Quality pipeline

After all agents complete:
```bash
pnpm lint
pnpm build
pnpm test
```

Check for playwright tests if UI was touched.

Stop on failure. Report the error. Suggest a fix but don't spiral.

## Step 5 — Report

Show:
- What was implemented (summary of commits)
- Quality pipeline result (pass / fail with details)
- What's next: `/tai-verify` or `/tai-next`

## On failure

If quality fails:
1. Show exact error
2. Suggest the fix
3. Ask: "Should I attempt to fix this?"
4. If yes: fix, re-run quality, report result
5. If still failing: stop, report, let the user decide

Do not loop more than twice on failures.
