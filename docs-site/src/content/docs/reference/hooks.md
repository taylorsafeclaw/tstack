---
title: Hooks
description: Scripts that enforce guardrails, log information, and block dangerous actions
---

Hooks are scripts that run in response to Claude Code events. They enforce guardrails, log information, and block dangerous actions.

## Available hooks

### `tai-quality-gate.js`
**Event:** `PreToolUse` (matcher: `Bash`)
**Trigger:** `git commit` commands

Blocks commits if the quality pipeline hasn't passed in the current session. Checks for `.tai/.quality-passed` flag file.

**How it works:**
1. When `pnpm lint && pnpm build && pnpm test` all pass, touch `.tai/.quality-passed`
2. On any file edit, the flag is cleared
3. On `git commit`, the hook checks for the flag
4. If missing: blocks with "Run quality pipeline first"

### `tai-agent-return-validator.js`
**Event:** `SubagentStop`

Logs agent completion, duration, and exit status to `.tai/.agent-log`. Informational only — never blocks.

Useful for debugging Agent Team coordination and understanding agent performance.

### `tai-branch-guard.js`
**Event:** `PreToolUse` (matcher: `Bash`)
**Trigger:** `git push` to main/master

Prevents accidental pushes directly to main/master. Forces feature branch workflow.

### `guard-destructive.js` (default)
**Event:** `PreToolUse` (matcher: `Bash`)

Blocks dangerous destructive commands:
- `git reset --hard` → use git stash or git revert
- `rm -rf /` or `rm -rf ~` or `rm -rf .` → too dangerous

### `guard-pnpm.js` (opt-in, opinionated)
**Event:** `PreToolUse` (matcher: `Bash`)

Blocks npm/yarn commands, enforcing pnpm as the package manager. Only add this if your project uses pnpm exclusively.

## Configuration

Add hooks to `.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "command": "node ~/tai/hooks/tai-quality-gate.js"
      },
      {
        "matcher": "Bash",
        "command": "node ~/tai/hooks/tai-branch-guard.js"
      },
      {
        "matcher": "Bash",
        "command": "node ~/tai/hooks/guard-destructive.js"
      }
    ],
    "SubagentStop": [
      {
        "command": "node ~/tai/hooks/tai-agent-return-validator.js"
      }
    ]
  }
}
```

To also enforce pnpm (opt-in):

```json
{
  "matcher": "Bash",
  "command": "node ~/tai/hooks/guard-pnpm.js"
}
```

## Creating a new hook

Hooks are Node.js scripts that:
1. Read JSON from stdin (tool input or event data)
2. Decide whether to allow or block
3. Exit with code 0 (allow) or code 2 (block with message)

```javascript
#!/usr/bin/env node
let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => { input += chunk; });
process.stdin.on('end', () => {
  const data = JSON.parse(input);
  // ... check data ...

  // To block:
  process.stdout.write(JSON.stringify({
    decision: "block",
    reason: "Why it's blocked"
  }));
  process.exit(2);

  // To allow:
  process.exit(0);
});
```
