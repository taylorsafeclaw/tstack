# Installation

## Requirements

- macOS or Linux
- Claude Code CLI
- `pnpm` (for quality pipeline)
- `gh` CLI (for PR creation)

## Install

```bash
git clone https://github.com/taylorsafeclaw/tai.git ~/Development/tai && ~/Development/tai/setup
```

The `setup` script:
1. Symlinks every `commands/tai-*.md` → `~/.claude/commands/`
2. Symlinks every `agents/tai-*.md` → `~/.claude/agents/` (currently empty — agents live in project templates)
3. Prints a summary of installed commands

After install, all `/tai-*` commands are available in every Claude Code session.

## Verify

```bash
ls ~/.claude/commands/tai-*.md
```

You should see 23 command symlinks.

## Uninstall

```bash
~/Development/tai/uninstall
```

Removes all `~/.claude/commands/tai-*.md` and `~/.claude/agents/tai-*.md` symlinks. Does **not** touch any project-level `.claude/` files.

---

## Project templates

Templates install project-specific agents and commands into your project's `.claude/` directory. These override global tai commands when they share a name.

### SafeClaw

```bash
~/Development/tai/templates/safeclaw/install
```

Installs to `<project>/.claude/`:
- `agents/tai-convex.md` — Convex backend specialist
- `agents/tai-ui.md` — Workspace UI specialist
- `agents/tai-validate.md` — SafeClaw lint/build/test validator
- `agents/tai-reviewer.md` — SafeClaw code reviewer
- `commands/tai-schema-change.md` — Guided schema modification workflow

The install script can be re-run safely — it overwrites existing files.

---

## Update

```bash
cd ~/Development/tai && git pull && ~/Development/tai/setup
```

`setup` is idempotent — re-running it refreshes all symlinks.
