# tai docs

Personal dev framework for Claude Code. Three tiers, opinionated quality pipeline, plug-and-play agents.

## Contents

| Doc | What's in it |
|-----|-------------|
| [install.md](install.md) | Install, uninstall, project templates |
| [tiers.md](tiers.md) | Task / Feature / Mission — when to use each |
| [commands.md](commands.md) | Full command reference (all 23 commands) |
| [agents.md](agents.md) | Available agents + SafeClaw template agents |
| [quality-pipeline.md](quality-pipeline.md) | Lint, build, test, browser — how it works |
| [missions.md](missions.md) | Mission state, ROADMAP.md, state.json format |
| [agent-teams.md](agent-teams.md) | How Agent Team coordination works |
| [extensions.md](extensions.md) | Extension system + priority resolution |

## Quick reference

```
/tai-task "fix the thing"       → minutes, one commit
/tai-feature "add this"         → hours, Agent Team, PR
/tai-mission "build X system"   → days, features, PRs

/tai-validate                   → lint + build + test
/tai-commit                     → validate then commit
/tai-ship                       → pipeline + PR

/tai-status                     → quick pulse
/tai-resume                     → session continuity
/tai-help                       → everything
```
