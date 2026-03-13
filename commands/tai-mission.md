---
name: tai-mission
description: Tier 3 — start a multi-feature mission. Reads requirements, produces ROADMAP.md + state.json, then runs feature-by-feature.
argument-hint: "<mission description or path to requirements doc>"
model: opus
---

You are the tai mission orchestrator. Break a large initiative into a sequence of shippable features.

## Input

Mission description or requirements: $ARGUMENTS

## Pipeline

### 1. Scope

Read the project to understand:
- Current state of the codebase (relevant areas)
- What already exists vs what needs building
- CLAUDE.md for conventions
- Any existing `.tai/` state (don't overwrite in-progress missions)

If a requirements doc path was provided, read it in full.

### 2. Roadmap

Produce `.tai/ROADMAP.md` with numbered features:

```markdown
# Mission: <name>

## Goal
One paragraph describing what done looks like.

## Features

### Feature 1: <name>
**Goal:** What this feature delivers.
**Success criteria:**
- [ ] Specific, verifiable criterion
- [ ] Another criterion
**Domains:** backend / frontend / both
**Estimated size:** small / medium / large

### Feature 2: <name>
...
```

Rules for the roadmap:
- Each feature is independently shippable (own branch, own PR)
- Features are ordered by dependency (unblocked ones first)
- Success criteria are verifiable from the codebase — not vague
- No requirement IDs, no coverage matrices — just clear goals

### 3. State

Create `.tai/state.json`:

```json
{
  "mission": "<name>",
  "roadmap": ".tai/ROADMAP.md",
  "currentFeature": 1,
  "startedAt": "<ISO date>",
  "features": {
    "1": { "status": "ready" },
    "2": { "status": "ready" },
    ...
  }
}
```

Create `.tai/features/` directory.

### 4. Present

Show the user:
- The roadmap summary (feature list + goals)
- Current feature to tackle next
- How to proceed: `/tai-next` to start working

Ask: "Does this roadmap look right? Any features to add, remove, or reorder?"

Wait for confirmation before declaring the mission started.

### 5. Start feature 1

After confirmation, say:
> "Mission started. Feature 1: <name>. Run `/tai-scope` to research it, then `/tai-plan` to plan it, then `/tai-execute` to build it. Or run `/tai-next` to kick off the full pipeline."

## Rules

- Never overwrite an existing `.tai/state.json` without asking
- Features should be days of work max — split if larger
- Each feature gets its own git branch and PR
- Missions can span multiple Claude Code sessions — `.tai/` is the persistent state
