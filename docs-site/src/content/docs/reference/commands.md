---
title: Commands
description: All 23 tai slash commands with full reference
---

All commands are available after running `~/tai/setup`. Invoke them with `/tai-<name>` in Claude Code.

---

## Tier 1: Task

### `/tai-task <what to do>`
**Model:** sonnet

Quick atomic change from description to commit. No planning, no PR.

**Pipeline:** bootstrap → fast context (skip Explore for known files) → route to agent or implement directly → quality gate → commit

**Agent routing:**
- Checks for domain agents (tai-convex, tai-ui) via Glob
- For 1-3 file changes, prefers direct implementation over spawning agents
- Falls back to tai-implementer or main context if no domain agents

**Rules:**
- No plan file
- No PR — commits to current branch
- No agent coordination
- No browser tests
- Stops on quality failure

**Example:**
```
/tai-task "rename WorkspaceCard to AgentCard in all components"
```

---

## Tier 2: Feature

### `/tai-feature <feature description>`
**Model:** opus

Full feature pipeline from description to merged PR.

**Pipeline:** bootstrap → context (Explore agent) → plan → **user confirms** → branch → agent coordination (dual-path) → quality gate → push → PR

**Agent coordination (dual-path):**
- **Path A:** Domain agents available → spawn tai-convex first, extract API shape, spawn tai-ui with API shape
- **Path B:** No domain agents → use tai-implementer or implement directly
- Each agent commits atomically per logical chunk

**Error recovery:** Logs failures, saves progress to plan.md, attempts one fix, re-runs from failure point. Never loops more than twice.

**Example:**
```
/tai-feature "add workspace pause/resume — pause stops the Fly machine, resume restarts it"
```

---

### `/tai-context <task or feature description>`
**Model:** opus

Gather context before implementing. Uses Agent tool with `subagent_type: "Explore"` and specific investigation questions.

Finds: affected files, recent changes, patterns, available agents, gotchas.

**Scope lock:** Gathers context only — does not implement anything.

---

### `/tai-plan <task or feature description>`
**Model:** opus

Create an implementation plan and wait for user confirmation.

**Small tasks (≤3 files, 1 domain):** plan stays in conversation as bullet points.

**Large tasks (>3 files or multiple domains):** writes plan.md (or `.tai/features/<N>/plan.md` if mission active).

**Context window sizing:** Each agent's workload sized to ~50% of a fresh context window. Each chunk is self-contained.

Always asks "Does this plan look right?" and waits for confirmation.

---

### `/tai-implement <task description or plan.md path>`
**Model:** sonnet

Route a task or plan to the right agents and execute.

- Checks agent availability via Glob
- Uses dual-path agent coordination (domain agents → fallback to tai-implementer → main context)
- Atomic commits per logical chunk
- Runs quality gate after implementation

---

## Tier 3: Mission

### `/tai-mission <description or requirements doc path>`
**Model:** opus

Start a multi-feature mission.

**Produces:**
- `.tai/ROADMAP.md` — numbered features with goals and success criteria
- `.tai/state.json` — progress tracker
- `.tai/features/<N>/` — directory per feature for plans

**Context window sizing:** Each feature sized to be completable in a fresh context window (~50% utilization). Self-contained plans.

Will **not** overwrite an existing `.tai/state.json` without asking.

---

### `/tai-scope [feature number or name]`
**Model:** opus

Research a specific mission feature before planning.

Uses Agent tool with `subagent_type: "Explore"` (very thorough) to find what exists, what needs building, patterns to follow, dependencies, constraints.

Can invoke `tai-research` skill for web research on external APIs/libraries.

**Scope lock:** Researches only — does not implement anything.

---

### `/tai-execute [plan file path]`
**Model:** sonnet

Execute a feature plan with agent coordination.

- Reads plan.md (or searches `.tai/features/<N>/plan.md` → `plan.md`)
- Uses dual-path agent coordination
- Updates plan.md with `[x]` marks as tasks complete
- Reports progress after each agent completes
- Error recovery: saves progress, suggests resume with `/tai-execute`

---

### `/tai-verify [feature number]`
**Model:** sonnet

Verify a completed feature against its ROADMAP.md success criteria.

- Reads success criteria from ROADMAP.md
- Checks each criterion (code existence, behavior wiring)
- Runs quality gate
- Reports pass/fail per criterion with file:line references

Single pass — does **not** fix anything.

---

### `/tai-next`
**Model:** sonnet

Close the current feature and advance to the next.

1. Runs verification inline (not as separate command)
2. If fail: shows what's missing, stops
3. If pass: opens PR (with error recovery for push/auth failures), updates `state.json`, shows next feature goal

---

## Quality

### `/tai-validate`
**Model:** haiku

Run the quality pipeline and report results. Does **not** fix anything.

```
pnpm lint   → stop on failure
pnpm build  → stop on failure
pnpm test   → stop on failure
[playwright] → if configured
```

Detects available scripts from package.json. Skips missing scripts.

---

### `/tai-test [playwright|dogfood|all]`
**Model:** sonnet

Run browser tests. Smart-detects what's available.

| Mode | What runs |
|------|-----------|
| `playwright` | `npx playwright test` |
| `dogfood` | `tai-dogfood` skill with credentials from `.claude/dogfood.json` |
| `all` | playwright then dogfood |
| (none) | auto-detects — runs playwright if configured |

Can invoke `tai-test-gen` skill to generate missing tests before running.

**No hardcoded credentials** — reads from `.claude/dogfood.json`.

---

### `/tai-review [files|staged|branch]`
**Model:** sonnet

Code review recent changes. High-confidence issues only.

- Checks for project-specific reviewer agent first (`.claude/agents/tai-reviewer.md`)
- If available, spawns it instead of running generic review
- Can invoke `tai-audit` skill for deeper security analysis

Checks: security (OWASP top 10), logic errors, convention violations.

---

## Git

### `/tai-commit [commit message]`
**Model:** sonnet

Validate then commit. Runs quality gate, stages files specifically, conventional commit format.

### `/tai-ship [PR title or description]`
**Model:** sonnet

Full pipeline → PR. Can invoke `tai-pr-body` skill for rich PR descriptions.

### `/tai-undo [N]`
**Model:** sonnet

Safely rollback N commits using `git revert` — never `git reset --hard`.

---

## Debug & Refactor

### `/tai-debug <error message or stack trace>`
**Model:** opus

Systematic debugging. Uses parallel tool calls to read source + check git history simultaneously. Checks for known quality pipeline fix patterns first.

### `/tai-refactor <what to refactor>`
**Model:** sonnet

Safe refactoring with reference discovery.

- Warns about existing uncommitted changes before starting
- Greps all references before touching anything
- On failure: reverts only refactored files (not `git checkout -- .`)
- On success: commits with `refactor(<scope>): <what>`

---

## Utility

### `/tai-resume`
**Model:** sonnet — Session continuity.

### `/tai-status`
**Model:** haiku — One-screen project pulse.

### `/tai-help`
**Model:** haiku — Lists all commands, agents, AND skills.

### `/tai-new-agent`
**Model:** sonnet — Scaffold new agent with full frontmatter (tools, maxTurns, etc.).

### `/tai-new-command`
**Model:** sonnet — Scaffold new command.
