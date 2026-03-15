# tai CLI

A standalone Rust binary for managing the tai framework outside of Claude Code sessions.

## Install

```bash
cd cli && cargo install --path .
```

Or build without installing:

```bash
cd cli && cargo build --release
# Binary at cli/target/release/tai
```

## Commands

### `tai` (no args)

Status dashboard — shows ASCII logo, item counts with link health, and config paths.

### `tai install`

Symlinks all commands, agents, and skills from the tai repo to `~/.claude/`. Equivalent to running the `setup` bash script. Idempotent — safe to re-run.

### `tai uninstall`

Removes all `tai-*` symlinks from `~/.claude/commands/`, `~/.claude/agents/`, and `~/.claude/skills/`. Does not touch project-level `.claude/` files.

### `tai list [commands|agents|skills|hooks|all]`

Pretty-prints installed items with link status, description, and model. Defaults to `all`.

Status icons:
- `●` green — linked and healthy
- `●` red — broken symlink (target missing)
- `●` yellow — conflict (non-symlink file exists)
- `○` dim — not linked

### `tai add <command|agent|skill> <name>`

Scaffolds a new item with proper frontmatter template. The `tai-` prefix is added automatically if not provided.

```bash
tai add command my-thing    # → commands/tai-my-thing.md
tai add agent reviewer      # → agents/tai-reviewer.md
tai add skill linter        # → skills/tai-linter/SKILL.md
```

Run `tai install` after adding to create the symlink.

### `tai doctor`

Full diagnostic:
- **Symlinks** — checks all items for healthy/broken/missing/conflict status
- **Frontmatter** — validates YAML in all markdown files, warns on missing descriptions
- **Hooks** — lists available hooks and configuration status
- **Templates** — inventories available project templates

### `tai template list`

Shows available project templates with content counts.

### `tai template install <name>`

Runs a template's `install` script (e.g., `templates/example/install`).

### `tai version`

Prints version (from `VERSION` file), tai root path, and claude home path.

## Configuration

The CLI auto-detects the tai root directory by searching for a `VERSION` file:

1. `TAI_ROOT` environment variable (if set)
2. Parent of the binary's location
3. Current working directory
4. `~/tai` (fallback)

The Claude home is always `~/.claude/`.

## Color palette

| Color | Usage |
|-------|-------|
| Cyan | Headings, logo, diamond bullets |
| Bold white | Item names, primary text |
| Dim white | Descriptions, secondary text, paths |
| Green | Checkmarks, healthy status |
| Yellow | Warnings, conflicts |
| Red | Errors, broken links |
