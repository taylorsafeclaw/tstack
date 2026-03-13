# CLAUDE.md — tai Framework

This is the tai dev framework repository. tai is a lightweight, installable workflow for Claude Code — three work tiers, opinionated quality pipeline, plug-and-play agents.

## Repo structure

```
tai/
├── commands/           ← slash commands → ~/.claude/commands/tai-*.md
├── agents/             ← subagents → ~/.claude/agents/tai-*.md (currently empty)
├── templates/          ← project-specific extensions
│   └── safeclaw/       ← SafeClaw project template
│       ├── install     ← copies agents + commands to project .claude/
│       ├── agents/     ← tai-convex, tai-ui, tai-validate, tai-reviewer
│       └── commands/   ← tai-schema-change
├── extensions/         ← personal add-ons (gitignored, not in repo)
├── docs/               ← full documentation
├── setup               ← symlinks commands + agents to ~/.claude/
├── uninstall           ← removes all symlinks
├── VERSION             ← semver
└── CLAUDE.md           ← this file
```

## Install / uninstall

```bash
./setup      # symlinks commands + agents to ~/.claude/
./uninstall  # removes all symlinks
```

`setup` is idempotent — safe to re-run after adding commands.

## Conventions

- All tai files are prefixed `tai-` — prevents collisions with other frameworks (`gsd-*`, `gstack-*`)
- Commands: `commands/tai-*.md` with frontmatter (`name`, `description`, `argument-hint`, `model`)
- Agents: `agents/tai-*.md` with frontmatter (`name`, `description`, `model`)
- Project templates: `templates/<project>/` with an `install` script

## Adding a new command

```bash
# Scaffold with the built-in tool:
/tai-new-command

# Or create manually:
# 1. Create commands/tai-<name>.md with frontmatter
# 2. Run ./setup to refresh symlinks
```

Frontmatter format:
```yaml
---
name: tai-<name>
description: <one-line description>
argument-hint: "<hint for the user>"
model: sonnet | opus | haiku
---
```

## Adding a new agent

```bash
# Scaffold with the built-in tool:
/tai-new-agent

# Or create manually:
# 1. Create agents/tai-<name>.md with frontmatter
# 2. Run ./setup to refresh symlinks
```

## The three tiers

| Tier | Command | Scope | Model |
|------|---------|-------|-------|
| Task | `/tai-task` | Minutes, 1–3 files, single commit, no PR | sonnet |
| Feature | `/tai-feature` | Hours, 3–10 files, Agent Team, PR | opus → sonnet |
| Mission | `/tai-mission` | Days/weeks, multiple features, multiple PRs | opus → sonnet → haiku |

## Model strategy

- **opus** — thinking: context (`/tai-context`), planning (`/tai-plan`), missions, scoping, debugging
- **sonnet** — building: implementation (`/tai-task`, `/tai-execute`), review, refactoring, committing
- **haiku** — running: validation (`/tai-validate`), verification (`/tai-verify`), status, help

## Quality pipeline

Every tier runs after implementation — no opt-out:
```
pnpm lint → pnpm build → pnpm test → [browser: smart detect]
Stop on first failure. Never commit broken code.
```

## Extension system

Commands and agents can live in three places (highest → lowest priority):
1. `<project>/.claude/commands|agents/tai-*.md` — project-specific
2. `~/Development/tai/extensions/tai-*.md` — personal add-ons (gitignored)
3. `~/Development/tai/commands|agents/tai-*.md` — core (this repo)

## Documentation

Full docs in `docs/`:
- `docs/tiers.md` — tier breakdown and decision guide
- `docs/commands.md` — all 23 commands with args, model, behavior
- `docs/agents.md` — agents reference + SafeClaw template agents
- `docs/quality-pipeline.md` — pipeline details and failure behavior
- `docs/missions.md` — state format, ROADMAP.md, feature loop
- `docs/agent-teams.md` — Agent Team coordination model
- `docs/extensions.md` — extension system and priority resolution
- `docs/install.md` — install, uninstall, project templates
