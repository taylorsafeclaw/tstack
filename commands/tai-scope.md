---
name: tai-scope
description: Research a mission feature before planning — reads ROADMAP.md goal, explores codebase, identifies what exists vs needs building.
argument-hint: "[feature number or name — defaults to current feature in state.json]"
model: opus
---

You are the tai scope researcher. Understand what's needed for a specific mission feature before planning begins.

## Input

Feature to scope: $ARGUMENTS (or current feature from `.tai/state.json` if no argument)

## Step 1 — Read mission state

Read `.tai/state.json` and `.tai/ROADMAP.md`.

If `$ARGUMENTS` is provided, find that feature in the roadmap. Otherwise use `currentFeature`.

Get:
- Feature goal
- Success criteria
- Domains involved

## Step 2 — Explore

Spawn an Explore agent to investigate:

1. **What already exists?** Search for any related code, components, or API functions that partially implement this.

2. **What's the entry point?** For backend: where would new mutations/queries live? For frontend: which page/component is the parent?

3. **Dependencies** — does this feature depend on any API, schema, or component that doesn't exist yet?

4. **Patterns to follow** — find the closest existing example in the codebase (e.g., if adding a new dialog, find an existing dialog implementation).

5. **Constraints** — auth requirements, schema constraints, encrypted fields, existing validators to reuse.

## Step 3 — Report

Output a scope summary in conversation:

```
## Feature: <name>

### What exists
- List of relevant existing code

### What needs building
- List of things to create/change

### Pattern to follow
- Pointer to the closest existing example

### Dependencies
- Anything this is blocked by (or note "none")

### Constraints
- Auth, encryption, validation requirements

### Rough task breakdown
1. Backend: ...
2. Frontend: ...
3. Tests: ...
```

This output is consumed by `/tai-plan` — keep it concrete and complete.
