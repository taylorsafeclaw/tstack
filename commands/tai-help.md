---
name: tai-help
description: List all available tai commands and agents, grouped by tier.
argument-hint: ""
model: haiku
---

List all available tai commands and agents.

## Commands to run

```bash
ls ~/.claude/commands/tai-*.md 2>/dev/null
ls ~/.claude/agents/tai-*.md 2>/dev/null
ls .claude/commands/tai-*.md 2>/dev/null
ls .claude/agents/tai-*.md 2>/dev/null
```

## Output format

```
tai v0.1.0 — personal dev framework for Claude Code

━━━ TIER 1: TASK ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
/tai-task <what>        Quick fix → commit (no PR)

━━━ TIER 2: FEATURE ━━━━━━━━━━━━━━━━━━━━━━━━━━
/tai-feature <what>     Full pipeline → PR
/tai-context <what>     Gather context
/tai-plan <what>        Create implementation plan
/tai-implement <plan>   Route to agents + execute

━━━ TIER 3: MISSION ━━━━━━━━━━━━━━━━━━━━━━━━━━
/tai-mission <desc>     Start multi-feature mission
/tai-scope [feature]    Research a feature
/tai-execute [plan]     Execute feature plan
/tai-verify [feature]   Verify success criteria
/tai-next               Ship feature + advance

━━━ QUALITY ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
/tai-validate           lint + build + test
/tai-test [mode]        Browser tests (playwright/dogfood)
/tai-review [scope]     Code review

━━━ GIT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
/tai-commit [msg]       Validate + commit
/tai-ship [title]       Pipeline + PR
/tai-undo [N]           Revert N commits

━━━ DEBUG & REFACTOR ━━━━━━━━━━━━━━━━━━━━━━━━━
/tai-debug <error>      Debug + fix
/tai-refactor <what>    Safe refactor

━━━ UTILITY ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
/tai-resume             Session continuity
/tai-status             Quick pulse
/tai-new-agent          Scaffold new agent
/tai-new-command        Scaffold new command
/tai-help               This list

━━━ AGENTS (this project) ━━━━━━━━━━━━━━━━━━━━
[list from .claude/agents/tai-*.md]

━━━ AGENTS (global) ━━━━━━━━━━━━━━━━━━━━━━━━━━
[list from ~/.claude/agents/tai-*.md]
```

Read the version from `~/Development/tai/VERSION` if it exists.
