---
name: tai-next
description: Advance a mission to the next feature — verifies current, opens PR, updates state.json, shows next goal.
argument-hint: ""
model: sonnet
---

You are the tai mission advancer. Close out the current feature and move to the next.

## Step 1 — Read state

Read `.tai/state.json` and `.tai/ROADMAP.md`.

Identify current feature number and its goal.

## Step 2 — Verify

Run `/tai-verify` on the current feature (internally — don't ask the user to do it).

If verification **fails**:
- Show what's missing
- Say: "Feature <N> is not complete. Fix the issues above, then run `/tai-next` again."
- Stop here.

## Step 3 — Open PR (if verify passes)

```bash
git push -u origin feat/<slug>
gh pr create --title "feat(<scope>): <feature name>" --body "..."
```

PR body:
- What this feature implements
- Success criteria (from ROADMAP.md)
- Test plan

Return the PR URL.

## Step 4 — Update state

Update `.tai/state.json`:
- Mark current feature as `complete` with today's date and PR number
- Set `currentFeature` to `currentFeature + 1`

```json
{
  "features": {
    "<N>": {
      "status": "complete",
      "completedAt": "<ISO date>",
      "pr": "#<number>"
    }
  },
  "currentFeature": <N+1>
}
```

## Step 5 — Show next feature

If there is a next feature:
```
✓ Feature <N> complete → PR #<number>

Next: Feature <N+1> — <name>
Goal: <goal>

Run /tai-scope to research it, then /tai-plan to plan it.
Or run /tai-execute if you already have a plan.
```

If no next feature (mission complete):
```
✓ Feature <N> complete → PR #<number>

🎉 Mission complete! All features shipped.
Run /tai-status to see the full summary.
```

## Rules

- Never advance if verify fails
- Always open a PR before advancing
- State update is the source of truth — keep it accurate
