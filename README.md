# tai

A lightweight, installable dev framework for Claude Code. Three tiers, opinionated quality pipeline, plug-and-play agents.

## Install

```bash
git clone https://github.com/taylorsafeclaw/tai.git ~/Development/tai && ~/Development/tai/setup
```

Symlinks all commands to `~/.claude/commands/`. No binaries, no dependencies — pure markdown.

## The three tiers

```
TIER 1: TASK      → /tai-task "fix the thing"         minutes, one commit
TIER 2: FEATURE   → /tai-feature "add this feature"   hours, Agent Team, PR
TIER 3: MISSION   → /tai-mission "build this system"  days, multiple features, PRs
```

### Choosing the right tier

| Signal | Tier |
|--------|------|
| Fix bug, change color, rename | Task |
| Add feature, build flow | Feature |
| Build entire system | Mission |
| 1-3 files | Task |
| 3-10 files | Feature |
| 10+ files | Mission |

## Commands

### Tier 1 — Task
- `/tai-task` — quick fix/change → commit

### Tier 2 — Feature
- `/tai-feature` — full pipeline → PR
- `/tai-context` — gather context
- `/tai-plan` — plan implementation
- `/tai-implement` — route to agents + execute

### Tier 3 — Mission
- `/tai-mission` — start a mission, produce roadmap
- `/tai-scope` — research a feature before planning
- `/tai-execute` — execute a feature plan
- `/tai-verify` — verify feature outcomes
- `/tai-next` — advance to next feature

### Quality
- `/tai-validate` — lint + build + test
- `/tai-test` — browser testing (playwright / dogfood)
- `/tai-review` — code review

### Git
- `/tai-commit` — validate then commit
- `/tai-ship` — full pipeline → PR
- `/tai-undo` — rollback

### Debug & Refactor
- `/tai-debug` — debugging workflow
- `/tai-refactor` — safe refactoring

### Utility
- `/tai-resume` — session continuity
- `/tai-status` — quick pulse
- `/tai-help` — list everything
- `/tai-new-agent` — scaffold a new agent
- `/tai-new-command` — scaffold a new command

## Quality pipeline

Every tier runs this after implementation:

```
1. pnpm lint    (always)
2. pnpm build   (always)
3. pnpm test    (always)
4. browser      (smart detect — playwright if configured, dogfood if --dogfood flag)

Stop on first failure. Don't commit broken code.
```

## Project templates

Install project-specific agents and commands:

```bash
# SafeClaw
~/Development/tai/templates/safeclaw/install
```

This copies SafeClaw agents (`tai-convex`, `tai-ui`, `tai-validate`, `tai-reviewer`) and the `tai-schema-change` command into your project's `.claude/`.

## Uninstall

```bash
~/Development/tai/uninstall
```

Removes all global symlinks. Does not touch project-level files.

## Extension system

Drop a `tai-*.md` file in any of these to extend tai:
- `~/Development/tai/commands/` — core (in git)
- `~/Development/tai/extensions/` — personal add-ons (gitignored)
- `<project>/.claude/commands/tai-*.md` — project-only

Project files take priority over global files. Use `/tai-new-command` or `/tai-new-agent` to scaffold new files.

## Docs

- [docs/tiers.md](docs/tiers.md) — tier breakdown and decision guide
- [docs/commands.md](docs/commands.md) — all 23 commands with full reference
- [docs/agents.md](docs/agents.md) — available agents + SafeClaw template
- [docs/quality-pipeline.md](docs/quality-pipeline.md) — pipeline details
- [docs/missions.md](docs/missions.md) — mission state, ROADMAP.md, state.json
- [docs/agent-teams.md](docs/agent-teams.md) — Agent Team coordination model
- [docs/extensions.md](docs/extensions.md) — extension system + priority
- [docs/install.md](docs/install.md) — install, uninstall, templates
