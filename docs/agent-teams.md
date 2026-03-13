# Agent Teams

Agent Teams coordinate multiple domain agents on a single feature, working in vertical slices. Backend finishes first and hands its API shape to the frontend agent.

## How it works

```
Orchestrator (main context, opus)
  │
  ├── Gathers context, creates plan
  │
  ├── TeamCreate("pause-resume")
  │
  ├── Spawns tai-convex ──────────────────────────────────┐
  │     Input: full task context, files to touch           │
  │     tai-convex: reads schema, validators, auth, crypto │
  │     tai-convex: writes mutations + queries             │
  │     tai-convex: runs lint + build + test               │
  │     tai-convex: commits atomically                     │
  │     Returns: API shape ─────────────────────────────── ┤
  │                                                        │
  ├── (orchestrator receives API shape)                    │
  │                                                        │
  ├── Spawns tai-ui ────────────────────────────────────── ┘
  │     Input: task context + API shape from backend
  │     tai-ui: reads workspace-shell, globals.css, patterns
  │     tai-ui: invokes /frontend-design first
  │     tai-ui: builds components + hooks
  │     tai-ui: runs lint + build
  │     tai-ui: commits atomically
  │
  └── Spawns tai-validate ← full quality pipeline
        pnpm lint + build + test (+ playwright if configured)
```

## Task board

Tasks are defined in `plan.md` with domain assignments and dependency markers:

```markdown
## Tasks

### Backend (tai-convex)
- [ ] Add pause/resume mutations to convex/workspaces/mutations.ts
- [ ] Add status query updates to convex/workspaces/queries.ts
- [ ] Add indexes for new queries in schema.ts

### Frontend (tai-ui)
- [ ] Pause button component (blocked by backend)
- [ ] Status indicator updates (blocked by backend)
- [ ] Wire to Convex mutations

### Quality (tai-validate)
- [ ] Full pipeline: lint + build + test (blocked by frontend)
```

The orchestrator passes context and unblocks tasks as dependencies complete.

## API shape handoff

After the backend agent finishes, the orchestrator explicitly extracts and passes the API surface to the frontend agent:

```
Backend returned:
  api.workspaces.pause({ workspaceId: Id<"workspaces"> }) → null
  api.workspaces.resume({ workspaceId: Id<"workspaces"> }) → null
  api.workspaces.get({ id }) → { status: "running" | "paused" | ... }
```

The frontend agent receives this before it starts — no guessing at mutation names or argument shapes.

## Atomic commits

Each agent commits its own chunk before returning:

```
feat(convex): add pause/resume mutations and status query
feat(workspace): add pause/resume UI controls
```

The final PR rolls up these commits. No giant "feat: add pause/resume" that touches 15 files.

## Single-domain features

If a feature only touches one domain (e.g., pure backend migration, pure UI change), no Agent Team is created. One agent runs the full implementation. Same atomic commit pattern.

## Fallback without Agent Teams

If `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` is not set, the orchestrator falls back to sequential agent spawning — runs backend agent, waits for it to finish, passes API shape manually, runs frontend agent. Same pipeline, same commits, just sequential rather than concurrent.

## When NOT to use Agent Teams

- Tasks (tier 1) — always single agent, too small to coordinate
- Pure-backend features — single `tai-convex` call
- Pure-frontend features — single `tai-ui` call
- Config/script changes — handled in main context

Teams are for features that genuinely cross the backend/frontend boundary.
