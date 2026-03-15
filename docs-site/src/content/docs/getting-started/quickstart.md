---
title: Quickstart
description: Get up and running with tai in 5 minutes
---

This guide walks you through your first tai session from install to your first commit.

## 1. Install

```bash
git clone https://github.com/tai-framework/tai.git ~/tai && ~/tai/setup
```

Open a new Claude Code session. All `/tai-*` commands are now available.

## 2. Check your status

In any project, run:

```
/tai-status
```

This gives you a one-screen pulse: current branch, uncommitted changes, quality state, and any active mission. Run this at the start of every session.

## 3. Tier 1: Run your first task

Tasks are the smallest unit of work — a bug fix, rename, or color change. No planning, no PR.

```
/tai-task "add a console.log to the submit handler to debug form submissions"
```

tai will:
1. Read the relevant files
2. Make the change
3. Run `pnpm lint && pnpm build && pnpm test`
4. Commit with a conventional commit message

If the quality pipeline fails, tai stops and reports the exact error — it never commits broken code.

## 4. Tier 2: Run your first feature

Features take hours and produce a PR. tai creates a branch, coordinates agents, and opens the PR.

```
/tai-feature "add dark mode toggle to the settings page"
```

tai will:
1. Gather context (reads relevant files)
2. Write a plan and ask for your confirmation
3. Create a feature branch (`feat/dark-mode-toggle`)
4. Spawn the right agents for the work
5. Run the full quality pipeline
6. Open a PR via `gh pr create`

You confirm the plan before any code is written.

## 5. Resume after a break

Lost context after closing your terminal? Run:

```
/tai-resume
```

This reads git state, any active mission progress, open PRs, and outstanding tasks. Use it to get back up to speed quickly.

## 6. (Optional) Install the CLI

The `tai` CLI adds power tools for managing your setup outside of Claude Code.

```bash
cd ~/tai/cli && cargo install --path .
```

Then:

```bash
tai          # status dashboard
tai doctor   # full diagnostic
tai list     # list installed commands, agents, skills
tai add command my-thing   # scaffold a new command
```

## Next steps

- [Tiers overview](/tiers/overview/) — understand when to use Task vs Feature vs Mission
- [Commands reference](/reference/commands/) — all 23 commands with full details
- [Quality pipeline](/guides/quality-pipeline/) — how lint, build, test, and browser testing work
- [Extensions](/guides/extensions/) — add project-specific agents and commands
