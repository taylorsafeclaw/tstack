---
name: tai-help
description: List all available tai commands, agents, and skills, grouped by tier.
argument-hint: ""
model: haiku
---

List all available tai commands, agents, and skills.

## Commands to run

```bash
ls ~/.claude/commands/tai-*.md 2>/dev/null
ls ~/.claude/agents/tai-*.md 2>/dev/null
ls ~/.claude/skills/tai-*/SKILL.md 2>/dev/null
ls .claude/commands/tai-*.md 2>/dev/null
ls .claude/agents/tai-*.md 2>/dev/null
ls .claude/skills/tai-*/SKILL.md 2>/dev/null
```

## Output format

```
tai v<version> — personal dev framework for Claude Code

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
/tai-audit [scope]      Security + performance audit (skill)

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

━━━ SKILLS (global) ━━━━━━━━━━━━━━━━━━━━━━━━━━
[list from ~/.claude/skills/tai-*/SKILL.md — show name + description from frontmatter]

━━━ SKILLS (this project) ━━━━━━━━━━━━━━━━━━━━
[list from .claude/skills/tai-*/SKILL.md — show name + description]

━━━ AGENTS (this project) ━━━━━━━━━━━━━━━━━━━━
[list from .claude/agents/tai-*.md — show name + description]

━━━ AGENTS (global) ━━━━━━━━━━━━━━━━━━━━━━━━━━
[list from ~/.claude/agents/tai-*.md — show name + description]
```

Read the version from `~/tai/VERSION` if it exists.
