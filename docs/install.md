# Installation

## Requirements

- macOS or Linux
- Claude Code CLI
- `pnpm` (for quality pipeline)
- `gh` CLI (for PR creation)

## Install

```bash
git clone https://github.com/tai-framework/tai.git ~/tai && ~/tai/setup
```

The `setup` script:
1. Symlinks every `commands/tai-*.md` → `~/.claude/commands/`
2. Symlinks every `agents/tai-*.md` → `~/.claude/agents/`
3. Symlinks every `skills/tai-*/` → `~/.claude/skills/`
4. Prints a summary of installed commands, agents, and skills

After install, all `/tai-*` commands are available in every Claude Code session.

## Verify

```bash
ls ~/.claude/commands/tai-*.md
```

You should see 23 command symlinks.

## Uninstall

```bash
~/tai/uninstall
```

Removes all `~/.claude/commands/tai-*.md`, `~/.claude/agents/tai-*.md`, and `~/.claude/skills/tai-*/` symlinks. Does **not** touch any project-level `.claude/` files.

---

## Update

```bash
cd ~/tai && git pull && ~/tai/setup
```

`setup` is idempotent — re-running it refreshes all symlinks.

---

## Project templates

Templates install project-specific agents, commands, and skills into your project's `.claude/` directory. These override global tai commands when they share a name.

### Using a template

```bash
~/tai/templates/<template-name>/install
```

### Creating a template

Create a directory under `templates/` with an install script:

```
~/tai/templates/<my-project>/
├── install                 ← copies agents + commands + skills to project .claude/
├── agents/
│   └── tai-*.md            ← project-specific agent overrides
├── commands/
│   └── tai-*.md            ← project-specific commands
└── skills/
    └── tai-*/
        └── SKILL.md        ← project-specific skills
```

The `install` script should:
1. Find the project root (directory with `.claude/`)
2. `mkdir -p .claude/agents .claude/commands .claude/skills`
3. Copy `tai-*.md` files and skill directories

See `templates/example/install` for a reference implementation.

---

## Runtime directory

Many tai commands write to `.tai/` in your project root:
- `.tai/state.json` — mission progress state
- `.tai/.quality-passed` — quality gate marker
- `.tai/.agent-log` — agent coordination log

Add `.tai/` to your project's `.gitignore`.
