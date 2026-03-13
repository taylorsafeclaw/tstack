# Agents

Agents are specialized subprocesses with domain knowledge baked in. tai commands spawn them automatically based on the work domain.

## How agents work

When a tai command (e.g., `/tai-feature`) determines a task touches the backend, it spawns the `tai-convex` agent rather than implementing inline. The agent:
1. Reads its bootstrap files (schema, patterns, conventions)
2. Does the work in its domain
3. Runs quality checks
4. Commits atomically
5. Returns an API shape or summary to the orchestrator

Commands check agent availability via Glob before spawning:
```
.claude/agents/tai-convex.md    → project-specific
~/.claude/agents/tai-*.md       → global
```

If no domain agents are found, commands fall back to `tai-implementer` or direct implementation.

---

## Global agents

Global agents live in `~/Development/tai/agents/` and are available in every project after running `./setup`.

### `tai-explorer` — Codebase exploration specialist
**Model:** haiku | **Tools:** Read, Grep, Glob, Bash | **Max turns:** 20

Fast, read-only codebase exploration. Finds files, understands patterns, traces code paths, gathers context.

**Scope lock:** Read-only — does not modify any files.

**Used by:** tai-context, tai-feature, tai-task, tai-scope, tai-execute (context gathering steps)

**Return format:** Structured findings with file:line references, patterns observed, gotchas.

---

### `tai-implementer` — Generic implementation agent
**Model:** sonnet | **Tools:** Read, Grep, Glob, Edit, Write, Bash | **Max turns:** 30

General-purpose implementation agent for projects without domain-specific agents. Reads CLAUDE.md, follows project patterns, runs quality pipeline.

**Used by:** tai-task, tai-feature, tai-implement, tai-execute (fallback when no domain agents)

**Return format:** What was implemented, files modified, quality result.

---

## SafeClaw project agents

Installed by `~/Development/tai/templates/safeclaw/install` into `<project>/.claude/agents/`. These override global agents with the same name.

---

### `tai-convex` — Convex backend specialist
**Model:** sonnet | **Tools:** Read, Grep, Glob, Edit, Write, Bash | **Max turns:** 30

Handles all Convex backend work: schema, mutations, queries, actions.

**Scope lock:** Backend only — does not modify files in `app/`, `components/`, or frontend code.

**Bootstrap (reads before every task):**
- `convex/schema.ts` — data model and indexes
- `convex/lib/validators.ts` — shared validators
- `convex/lib/auth.ts` — `getUserOrThrow` and auth utilities
- `convex/lib/crypto.ts` — AES-256-GCM encryption
- `convex/lib/workspaces.ts` — state machine helpers

**Key patterns:**
- Every mutation requires `getUserOrThrow(ctx)` + ownership check
- API keys stored via `encryptValue()` / `decryptValue()` — never plaintext
- Status transitions go through the state machine in `workspaces.ts`
- Every filtered field needs an index in `schema.ts`
- Significant operations get logged to `action_logs`

**Error recovery:** Max 2 build/test fix attempts, then stop and report.

**Return contract:** What was implemented, files modified, API shape `{ mutationName: { args, returns } }`, quality result.

---

### `tai-ui` — UI specialist
**Model:** sonnet | **Tools:** Read, Grep, Glob, Edit, Write, Bash | **Max turns:** 30 | **Skills:** tai-frontend-design

Handles all frontend/component work: React components, pages, UI state.

**Scope lock:** UI only — does not modify files in `convex/`.

**Skills:** `tai-frontend-design` loaded automatically via frontmatter.

**Design system:** soft-card/soft-card-strong cards, glassmorphic effects, Radix + CVA + `cn()`, entity card grid pattern, light theme only.

**API shape:** When receiving API shape from orchestrator, uses exact function names and types. Imports from `convex/_generated/api`.

**Error recovery:** Max 2 build fix attempts, then stop and report.

**Return contract:** Components created/modified, UX decisions, files changed, quality result.

---

### `tai-validate` — Quality validator + SafeClaw checks
**Model:** haiku | **Tools:** Bash, Read, Grep, Glob | **Max turns:** 10

Runs the quality pipeline AND SafeClaw-specific static checks:

**Quality pipeline:** lint → build → test (stop on first failure)

**SafeClaw checks (after pipeline passes):**
- Auth: all mutations have `getUserOrThrow`
- Encryption: no plaintext API keys
- Indexes: query filters have matching indexes in schema.ts
- State machine: no direct status mutations bypassing workspaces.ts

---

### `tai-reviewer` — Code reviewer
**Model:** sonnet | **Tools:** Read, Grep, Glob, Bash | **Max turns:** 15

Reviews code for security, logic errors, and SafeClaw convention violations. Can load `tai-audit` skill for deeper security analysis.

Single pass, high-confidence issues only.

---

## SafeClaw project command

### `tai-schema-change` — Schema modification guide

Guided Convex schema modification workflow. Reads schema + validators, shows change plan, gets confirmation, makes changes in order, runs quality pipeline.

---

## Adding a new agent

Use `/tai-new-agent` to scaffold a new agent. Or create a `.md` file manually:

```markdown
---
name: tai-<name>
description: <one-line description>
model: sonnet | opus | haiku
tools: Read, Grep, Glob, Edit, Write, Bash
maxTurns: 30
---

You are the tai <name>. <purpose statement>

## Bootstrap
Read these files first:
- ...

## Scope lock
What this agent does NOT do.

## Behavior
Step-by-step workflow.

## Error recovery
Max attempts, when to stop.

## Return contract
What to return to the orchestrator.
```

Place in:
- `<project>/.claude/agents/tai-<name>.md` — project-only
- `~/Development/tai/agents/tai-<name>.md` — global (available everywhere)

See [extensions.md](extensions.md) for priority resolution.
