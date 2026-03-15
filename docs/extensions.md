# Extension System

tai is extended by dropping `tai-*.md` files in specific directories. No registration, no config — Claude Code discovers them automatically.

## Directory priority

```
<project>/.claude/agents/tai-*.md       ← highest (project override)
<project>/.claude/commands/tai-*.md
    ↓
~/tai/extensions/                       ← personal add-ons (gitignored)
    ↓
~/tai/agents/                           ← core global agents
~/tai/commands/                         ← core global commands (lowest)
```

A project-level `tai-<name>.md` overrides the global one. This is how project templates work — they install project-specific agents that know about your schema, auth patterns, and conventions.

## Adding a command

**Global (available in all projects):**
```bash
cp my-command.md ~/tai/commands/tai-my-command.md
# Re-run setup to refresh symlink:
~/tai/setup
```

**Personal add-on (global but not in git):**
```bash
mkdir -p ~/tai/extensions
cp my-command.md ~/tai/extensions/tai-my-command.md
```

**Project-only:**
```bash
cp my-command.md <project>/.claude/commands/tai-my-command.md
```

## Adding an agent

Same pattern:
```bash
# Project-only (most common):
cp my-agent.md <project>/.claude/agents/tai-my-agent.md

# Global:
cp my-agent.md ~/tai/agents/tai-my-agent.md
~/tai/setup
```

## Naming convention

All tai files must be prefixed `tai-`. This prevents collisions with other frameworks (`gsd-*`, `gstack-*`, etc.) and makes them instantly recognizable.

Examples: `tai-my-command.md`, `tai-stripe.md`, `tai-rails.md`

## Scaffolding

Use the built-in scaffolders instead of writing from scratch:

```
/tai-new-command    → asks what the command should do, writes the file
/tai-new-agent      → asks about domain + bootstrap, writes the file
```

## Project templates

For reusable project setups, create a template directory:

```
~/tai/templates/<project-name>/
├── install                 ← copies agents + commands to project .claude/
├── agents/
│   └── tai-*.md
└── commands/
    └── tai-*.md
```

The `install` script should:
1. Find the project root (directory with `.claude/`)
2. `mkdir -p .claude/agents .claude/commands`
3. Copy `tai-*.md` files

See `templates/example/install` for a reference implementation.

## Promotion path

Agents start project-specific and are promoted to global when they prove useful across multiple projects:

1. Identify what's project-specific vs generic in the agent
2. Extract project-specific bootstrap/patterns into the project override
3. Move the generic version to `~/tai/agents/`
4. The project keeps its override — the global version is the fallback

Example: A project-specific `tai-validate` agent that knows your exact `pnpm` commands could be generalized to auto-detect the package manager and test runner, then promoted to global.
