# Command Reference

All commands are available after running `~/Development/tai/setup`. Invoke them with `/tai-<name>` in Claude Code.

---

## Tier 1: Task

### `/tai-task <what to do>`
**Model:** sonnet

Quick atomic change from description to commit. No planning, no PR.

**Pipeline:** fast context → implement → lint/build/test → commit

**Rules:**
- No plan file
- No PR — commits to current branch
- No Agent Team
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

**Pipeline:** context → plan → **user confirms** → branch → Agent Team → quality → push → PR

Shows the plan and waits for confirmation before writing any code. Creates a feature branch, coordinates agents as vertical slices, opens PR at the end.

**Example:**
```
/tai-feature "add workspace pause/resume — pause stops the Fly machine, resume restarts it"
```

---

### `/tai-context <task or feature description>`
**Model:** opus

Gather context before implementing. Spawns an Explore agent to find:
- Affected files and their relevance
- Recent changes in the area
- Existing patterns to follow
- Which agents apply (tai-convex, tai-ui, etc.)
- Gotchas (auth requirements, encryption, validators, etc.)

Output stays in conversation — consumed by `/tai-plan` or `/tai-implement`.

---

### `/tai-plan <task or feature description>`
**Model:** opus

Create an implementation plan and wait for user confirmation.

**Small tasks (≤3 files, 1 domain):** plan stays in conversation as bullet points.

**Large tasks (>3 files or multiple domains):** writes `plan.md`:
```markdown
# Plan: <feature name>

## Goal
## Tasks
  ### Backend (tai-convex)
  ### Frontend (tai-ui)
  ### Quality
## API shape
## Files affected
```

Always asks "Does this plan look right?" and waits for confirmation before proceeding.

---

### `/tai-implement <task description or plan.md path>`
**Model:** sonnet

Route a task or plan to the right agents and execute.

- If argument ends in `.md` — reads the file as a plan
- Otherwise — treats as inline task description
- Determines domains (backend/frontend/config)
- Spawns agents or Agent Team based on scope
- Atomic commits per logical chunk
- Runs quality pipeline after implementation

---

## Tier 3: Mission

### `/tai-mission <description or requirements doc path>`
**Model:** opus

Start a multi-feature mission.

**Produces:**
- `.tai/ROADMAP.md` — numbered features with goals and success criteria
- `.tai/state.json` — progress tracker
- `.tai/features/` — directory for per-feature plans

Shows the roadmap, waits for user confirmation, then hands off to `/tai-next` to start feature 1.

Will **not** overwrite an existing `.tai/state.json` without asking.

---

### `/tai-scope [feature number or name]`
**Model:** opus

Research a specific mission feature before planning.

Reads the feature goal from ROADMAP.md, then spawns an Explore agent to find:
- What already exists in the codebase
- What needs building
- The closest existing pattern to follow
- Dependencies and constraints

Output is a scope summary in conversation, consumed by `/tai-plan`.

Defaults to the current feature from `state.json` if no argument given.

---

### `/tai-execute [plan file path]`
**Model:** sonnet

Execute a feature plan with Agent Team coordination.

- Reads plan.md (or `.tai/features/<N>/plan.md` if no argument)
- Creates Agent Team for multi-domain plans
- Backend agent runs first, commits atomically, returns API shape
- Frontend agent runs after, receives API shape, commits atomically
- Updates plan.md with `[x]` marks as tasks complete
- Runs full quality pipeline after all agents finish
- Reports what was implemented and suggests `/tai-verify` or `/tai-next`

---

### `/tai-verify [feature number]`
**Model:** haiku

Verify a completed feature against its ROADMAP.md success criteria.

- Reads success criteria from ROADMAP.md
- Checks each criterion (does the code exist? is it wired correctly?)
- Runs lint + build + test
- Reports pass/fail per criterion
- If fail: says exactly what's missing and suggests the fix

Single pass only — does **not** fix anything, does **not** loop.

---

### `/tai-next`
**Model:** sonnet

Close the current feature and advance to the next.

1. Runs `/tai-verify` internally
2. If fail: shows what's missing, stops
3. If pass: opens PR, updates `state.json`, shows next feature goal

Equivalent to: verify → `gh pr create` → `state.json` update → "here's feature N+1"

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

Output shows exactly which step failed with the raw error output.

---

### `/tai-test [playwright|dogfood|all]`
**Model:** sonnet

Run browser tests. Smart-detects what's available.

| Mode | What runs |
|------|-----------|
| `playwright` | `npx playwright test` |
| `dogfood` | `/dogfood` skill with test credentials |
| `all` | playwright then dogfood |
| (none) | auto-detects — runs playwright if configured |

**Detection:**
- Playwright: looks for `playwright.config.ts` + `@playwright/test` in `package.json`
- Dogfood: looks for `.claude/dogfood.json` with target URL and auth

---

### `/tai-review [files|staged|branch]`
**Model:** sonnet

Code review recent changes. High-confidence issues only — no nitpicks.

| Argument | Scope |
|----------|-------|
| (none) | `git diff HEAD` |
| `staged` | staged changes |
| `branch` | `git diff main...HEAD` |
| file path | that specific file |

Checks: security (OWASP top 10, hardcoded secrets, missing auth), logic errors (race conditions, unhandled failures), convention violations (patterns from CLAUDE.md).

Single pass. Reports only real issues with file:line references and fix suggestions.

---

## Git

### `/tai-commit [commit message]`
**Model:** sonnet

Validate then commit.

1. Runs lint + build + test — aborts on failure
2. Reviews `git diff --stat HEAD` to understand what changed
3. Generates conventional commit message (or uses provided message)
4. Stages files specifically — never `git add -A`
5. Creates commit, shows result

Does **not** push.

**Commit format:** `<type>(<scope>): <description>`
Types: `feat`, `fix`, `refactor`, `style`, `test`, `chore`, `docs`

---

### `/tai-ship [PR title or description]`
**Model:** sonnet

Full pipeline → PR.

1. Runs lint + build + test
2. Creates feature branch if on main
3. Commits any uncommitted changes
4. Pushes with `-u origin`
5. `gh pr create` with summary + test plan
6. Returns the PR URL

---

### `/tai-undo [N]`
**Model:** sonnet

Safely rollback N commits (default: 1).

Uses `git revert` (creates new commits) — never `git reset --hard`.

1. Shows what would be reverted with file stats
2. Asks for explicit confirmation
3. Reverts
4. Runs quality pipeline after
5. Reports result

---

## Debug & Refactor

### `/tai-debug <error message or stack trace>`
**Model:** opus

Systematic debugging workflow.

1. Parses error type, file, line from stack trace
2. Reads source around the error point
3. Traces execution backwards (what called this? what was the input?)
4. Checks `git log` for recent changes that might have caused it
5. Greps for related code (function name, type, config key)
6. States root cause clearly with before/after fix
7. Asks "Should I apply this fix?"

Stops and asks the user for more context if stuck after 2 attempts.

---

### `/tai-refactor <what to refactor>`
**Model:** sonnet

Safe refactoring with reference discovery.

1. Reads current code to understand what's changing
2. **Greps all references first** — shows "this affects N files: [list]"
3. Applies the refactor systematically (definition → imports → usages → tests)
4. Runs quality pipeline
5. If quality fails: reverts cleanly with `git checkout -- .`
6. If quality passes: commits with `refactor(<scope>): <what>`

Refactors don't add behavior — if the change adds logic, it's a feature.

---

## Utility

### `/tai-resume`
**Model:** sonnet

Session continuity after a context reset or new session.

Shows:
- Current branch, uncommitted changes, last 5 commits
- Mission progress (if `.tai/state.json` exists)
- Incomplete tasks from `plan.md`
- Open PRs

Leads with the most actionable next step.

---

### `/tai-status`
**Model:** haiku

One-screen project pulse.

Shows: branch, ahead/behind, recent commits, mission progress (if active), open PRs. Under 20 lines.

---

### `/tai-help`
**Model:** haiku

Lists all commands grouped by tier, plus all available agents (global and project).

---

### `/tai-new-agent`
**Model:** sonnet

Scaffold a new tai agent with proper frontmatter.

Asks: name, description, model, which tools it needs. Places in the right directory (global `~/Development/tai/agents/` or project `.claude/agents/`).

---

### `/tai-new-command`
**Model:** sonnet

Scaffold a new tai command with proper frontmatter.

Asks: name, description, argument-hint, model, what the command should do. Places in the right directory.
