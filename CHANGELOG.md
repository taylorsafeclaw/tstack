# Changelog

## [0.1.0] — 2026-03-14

First public release.

### Added
- Three-tier workflow: Task, Feature, Mission
- 23 core slash commands
- 2 global agents: `tai-explorer`, `tai-implementer`
- 8 global skills: `tai-frontend-design`, `tai-simplify`, `tai-dogfood`, `tai-research`, `tai-audit`, `tai-test-gen`, `tai-changelog`, `tai-pr-body`
- 4 hooks: `tai-quality-gate.js`, `tai-branch-guard.js`, `tai-agent-return-validator.js`, `guard-destructive.js` (destructive command guard, default), `guard-pnpm.js` (pnpm enforcer, opt-in)
- Rust CLI (`tai install`, `tai uninstall`, `tai doctor`, `tai list`, `tai add`)
- Project template system with `templates/example/` reference implementation
- Quality pipeline: lint → build → test → browser (smart detect)
- Agent Teams coordination for vertical slices
- 3-tier model strategy: opus thinks, sonnet builds, haiku validates
- MIT license
