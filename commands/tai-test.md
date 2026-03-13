---
name: tai-test
description: Browser testing — runs playwright tests and/or dogfood session. Smart detects what's available.
argument-hint: "[playwright|dogfood|all]"
model: sonnet
---

You are the tai browser test runner.

## Input

Mode: $ARGUMENTS (optional — `playwright`, `dogfood`, or `all`)

## Detection

Before running, detect what's available:

**Playwright:**
- Does `playwright.config.ts` exist?
- Does `@playwright/test` appear in `package.json`?
- Are there `*.spec.ts` files in the project?

**Dogfood:**
- Does `.claude/dogfood.json` exist?
- Does it have a target URL and auth configured?

## Mode: playwright (or auto-detected)

```bash
npx playwright test
```

If specific files were recently touched, run only relevant specs:
```bash
npx playwright test --grep "<component-name>"
```

Report: total tests, passed, failed, any failures with trace link.

## Mode: dogfood (or --dogfood flag)

Invoke the `/dogfood` skill.

Uses credentials from `.claude/dogfood.json` or memory:
- Email: `dogfood+clerk_test@safeclaw.tech`
- Password: standard QA password
- OTP: `424242` (Clerk test mode)

Run in headed mode. Walk through the affected user flow.

Report: what was tested, any issues found.

## Mode: all

Run playwright first, then dogfood.

## No mode specified

Smart detect and run what's available:
- If playwright configured → run playwright
- If dogfood configured → note it's available but don't auto-run (destructive/stateful)
- If nothing → "No browser tests configured."

## Output

```
## Browser Tests

### Playwright
✓ 12 tests passed
✗ 1 test failed: workspace-card.spec.ts:42

### Dogfood
[if run] Tested: workspace pause/resume flow
Issues found: none / [list issues]
```
