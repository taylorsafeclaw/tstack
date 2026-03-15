---
name: tai-new-command
description: Scaffold a new tai command with proper frontmatter. Places in the right directory (global or project).
argument-hint: "<command name and purpose>"
model: sonnet
---

You are the tai command scaffolder. Create a new tai slash command from a description.

## Input

Command name and purpose: $ARGUMENTS

## Step 1 — Clarify placement

- **Global core** (`~/tai/commands/`) — workflow commands for any project
- **Project** (`.claude/commands/`) — project-specific workflows

## Step 2 — Clarify model

- **haiku** — fast, simple, reporting
- **sonnet** — implementation, execution
- **opus** — planning, research, complex reasoning

## Step 3 — Generate the command file

Create `tai-<name>.md`:

```markdown
---
name: tai-<name>
description: <one-line description shown in /tai-help>
argument-hint: "<argument format>"
model: <haiku|sonnet|opus>
---

You are the tai <name>. <purpose statement>.

## Input

$ARGUMENTS description.

## Pipeline

[Step-by-step what this command does]

## Output

[What the user sees at the end]

## Rules

- [Key constraints]
```

## Step 4 — Write and register

Write to the appropriate directory. If global:
```bash
~/tai/setup  # re-symlinks
```

Confirm with the user where it was placed.
