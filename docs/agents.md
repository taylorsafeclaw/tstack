# Agents

Agents are specialized subprocesses with domain knowledge baked in. tai commands spawn them automatically based on the work domain.

## How agents work

When a tai command (e.g., `/tai-feature`) determines a task touches the backend, it spawns the `tai-convex` agent rather than implementing inline. The agent:
1. Reads its bootstrap files (schema, patterns, conventions)
2. Does the work in its domain
3. Commits atomically
4. Returns an API shape or summary to the orchestrator

This keeps context clean and allows parallel domain execution via Agent Teams.

---

## Global agents

Global agents live in `~/Development/tai/agents/` and are available in every project.

Currently empty — agents start as project-specific and are promoted to global when proven useful across multiple projects. See [extensions.md](extensions.md) for the promotion path.

---

## SafeClaw project agents

Installed by `~/Development/tai/templates/safeclaw/install` into `<project>/.claude/agents/`.

These override global agents with the same name.

---

### `tai-convex` — Convex backend specialist
**Model:** sonnet

Handles all Convex backend work: schema, mutations, queries, actions.

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

**Epilogue:** `pnpm build` → `pnpm test` → `/simplify`

---

### `tai-ui` — UI specialist
**Model:** sonnet

Handles all frontend/component work: React components, pages, UI state.

**Preamble:** Invokes `/frontend-design` skill **first** before writing any code.

**Bootstrap (reads before every task):**
- `app/globals.css` — CSS custom properties, utility classes
- `components/product/workspace-shell.tsx` — main workspace layout pattern
- Relevant tab components in `components/product/`
- `lib/utils.ts` — `cn()` helper
- `components/ui/` — available primitives

**Design system:**
- Cards: `soft-card` / `soft-card-strong` classes
- Glassmorphic: `backdrop-filter: blur(12px)`, `rgba(255,255,255,0.6)` background
- Components: Radix primitives + CVA + `cn()` — always
- Pattern: entity list → entity card grid → add dialog → detail sheet
- Data: `useQuery` / `useMutation` from `convex/react` — no business logic in components
- Light theme only — no dark mode

**Epilogue:** `pnpm build` → `/simplify`

---

### `tai-validate` — Quality validator
**Model:** haiku

Runs the quality pipeline and reports results. Does **not** fix anything.

```
pnpm lint   → stop on failure, report errors
pnpm build  → stop on failure, report errors
pnpm test   → stop on failure, report failures
```

Single pass. Pastes exact error output. Invoked automatically at the end of every tier's pipeline.

---

### `tai-reviewer` — Code reviewer
**Model:** sonnet

Reviews code for real issues only — no nitpicks.

**Checks:**

*Security:*
- Convex mutations missing `getUserOrThrow` / auth check
- API keys or secrets hardcoded (should use Convex env vars or `crypto.ts`)
- Sensitive data in action logs or console output
- User input passed to exec without sanitization

*Logic errors:*
- State machine violations — invalid status transitions
- Missing error handling for Fly.io API calls
- Race conditions in workspace lifecycle
- Mutations that don't check workspace ownership

*SafeClaw conventions:*
- Encrypted fields must use `convex/lib/crypto.ts`
- Workspace status transitions via `workspaces.ts` state machine
- New tables need indexes in `schema.ts`
- Environment variables in `env.ts` (Zod-validated)

**Output format:**
```
## SafeClaw Code Review

### Issues
**[SECURITY]** convex/workspaces/mutations.ts:42
Missing auth check.
Fix: add getUserOrThrow and verify workspace.userId === user._id

### No issues
[if clean] No significant issues found.
```

Single pass. Does **not** fix issues — reports them.

---

## SafeClaw project command

### `tai-schema-change` — Schema modification guide

Guided Convex schema modification workflow. Invoked as `/tai-schema-change <description>`.

**Pipeline:**
1. Reads `convex/schema.ts` and `convex/lib/validators.ts`
2. Shows a change plan with all affected files
3. Asks "Does this look right?"
4. Makes changes in order: schema → validators → mutations/queries → actions → tests
5. Runs `pnpm build` + `pnpm test`
6. Commits with `feat(schema): <description>`

**Rules:**
- Never removes a field without checking all usages first
- Indexes every field used in `.filter()` or `.withIndex()`
- Prefers `v.optional()` for additive changes (backwards compatible)
- Confirms with user before destructive changes

---

## Adding a new agent

Use `/tai-new-agent` to scaffold a new agent. Or create a `.md` file manually:

```markdown
---
name: tai-<name>
description: <one-line description — this is how commands discover agents>
model: sonnet
---

You are the tai <name> specialist. <domain-specific instructions>

## Bootstrap
Read these files before starting:
- ...

## Patterns
...

## Epilogue
After implementing:
1. pnpm build — fix errors
2. [commit instructions]
```

Place in:
- `<project>/.claude/agents/tai-<name>.md` — project-only
- `~/Development/tai/agents/tai-<name>.md` — global (available everywhere)

See [extensions.md](extensions.md) for priority resolution.
