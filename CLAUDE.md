# CLAUDE.md — tai Framework

This is the tai dev framework repository. tai is a lightweight, installable workflow for Claude Code — three work tiers, opinionated quality pipeline, plug-and-play agents and skills.

## Repo structure

```
tai/
├── cli/                ← Rust CLI binary (`tai install`, `tai doctor`, etc.)
│   ├── Cargo.toml
│   └── src/
├── commands/           ← slash commands → ~/.claude/commands/tai-*.md
├── agents/             ← subagents → ~/.claude/agents/tai-*.md
├── skills/             ← skills → ~/.claude/skills/tai-*/SKILL.md
├── hooks/              ← hook scripts (quality gate, branch guard, etc.)
├── templates/          ← project-specific extensions
│   └── safeclaw/       ← SafeClaw project template
│       ├── install     ← copies agents + commands + skills to project .claude/
│       ├── agents/     ← tai-convex, tai-ui, tai-validate, tai-reviewer
│       ├── commands/   ← tai-schema-change
│       └── skills/     ← tai-convex-patterns
├── extensions/         ← personal add-ons (gitignored, not in repo)
├── docs/               ← full documentation
├── setup               ← symlinks commands + agents + skills to ~/.claude/
├── uninstall           ← removes all symlinks
├── VERSION             ← semver
└── CLAUDE.md           ← this file
```

## Install / uninstall

```bash
# Via CLI (preferred):
tai install      # symlinks commands + agents + skills to ~/.claude/
tai uninstall    # removes all symlinks

# Or via bash scripts:
./setup          # same as tai install
./uninstall      # same as tai uninstall
```

Both are idempotent — safe to re-run after adding commands, agents, or skills.

### Building the CLI

```bash
cd cli && cargo install --path .   # puts `tai` on PATH
# or: cd cli && cargo build --release
```

## Conventions

- All tai files are prefixed `tai-` — prevents collisions with other frameworks (`gsd-*`, `gstack-*`)
- Commands: `commands/tai-*.md` with frontmatter (`name`, `description`, `argument-hint`, `model`)
- Agents: `agents/tai-*.md` with frontmatter (`name`, `description`, `model`, `tools`, `maxTurns`)
- Skills: `skills/tai-*/SKILL.md` with frontmatter (`name`, `description`, `user-invocable`)
- Project templates: `templates/<project>/` with an `install` script

## Adding a new command

```bash
# Via CLI:
tai add command my-thing   # scaffolds commands/tai-my-thing.md
tai install                # refresh symlinks

# Via slash command:
/tai-new-command

# Or manually:
# 1. Create commands/tai-<name>.md with frontmatter
# 2. Run tai install (or ./setup)
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

Agent frontmatter:
```yaml
---
name: tai-<name>
description: <one-line description>
model: sonnet | opus | haiku
tools: Read, Grep, Glob, Edit, Write, Bash
maxTurns: 30
---
```

## Adding a new skill

```bash
# 1. Create skills/tai-<name>/SKILL.md with frontmatter
# 2. Run ./setup to refresh symlinks
```

Skill frontmatter:
```yaml
---
name: tai-<name>
description: <one-line description>
user-invocable: true | false
---
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
- **haiku** — running: validation (`/tai-validate`), status, help

## Quality pipeline

Every tier runs after implementation — no opt-out:
```
pnpm lint → pnpm build → pnpm test → [browser: smart detect]
Stop on first failure. Never commit broken code.
```

## Extension system

Commands, agents, and skills can live in three places (highest → lowest priority):
1. `<project>/.claude/commands|agents|skills/tai-*.md` — project-specific
2. `~/Development/tai/extensions/tai-*.md` — personal add-ons (gitignored)
3. `~/Development/tai/commands|agents|skills/tai-*.md` — core (this repo)

## Documentation

Full docs in `docs/`:
- `docs/cli.md` — Rust CLI reference (`tai`, `tai doctor`, etc.)
- `docs/tiers.md` — tier breakdown and decision guide
- `docs/commands.md` — all slash commands with args, model, behavior
- `docs/agents.md` — agents reference (global + SafeClaw template agents)
- `docs/skills.md` — skills system and all available skills
- `docs/hooks.md` — hook scripts and configuration
- `docs/quality-pipeline.md` — pipeline details and failure behavior
- `docs/missions.md` — state format, ROADMAP.md, feature loop
- `docs/agent-teams.md` — Agent Team coordination model
- `docs/extensions.md` — extension system and priority resolution
- `docs/install.md` — install, uninstall, project templates
