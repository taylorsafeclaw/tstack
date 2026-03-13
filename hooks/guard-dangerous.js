#!/usr/bin/env node
/**
 * guard-dangerous — PreToolUse hook
 * Blocks dangerous commands: npm/yarn (enforce pnpm), git reset --hard, rm -rf on project dirs.
 *
 * Hook config:
 * {
 *   "hooks": {
 *     "PreToolUse": [{
 *       "matcher": "Bash",
 *       "command": "node ~/Development/tai/hooks/guard-dangerous.js"
 *     }]
 *   }
 * }
 */

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => { input += chunk; });
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const toolInput = data.tool_input || {};
    const command = toolInput.command || '';

    // Block npm and yarn (enforce pnpm)
    if (command.match(/\b(npm|yarn)\s+(install|add|remove|i)\b/)) {
      process.stdout.write(JSON.stringify({
        decision: "block",
        reason: "Use pnpm instead of npm/yarn. Run: pnpm install, pnpm add, etc."
      }));
      process.exit(2);
    }

    // Block git reset --hard without specific ref
    else if (command.match(/\bgit\s+reset\s+--hard\b/)) {
      process.stdout.write(JSON.stringify({
        decision: "block",
        reason: "git reset --hard is destructive. Use git stash or git revert instead. If you really need this, ask the user to confirm."
      }));
      process.exit(2);
    }

    // Block rm -rf on dangerous paths
    else if (command.match(/\brm\s+-rf\s+[\/~]/) || command.match(/\brm\s+-rf\s+\.\s/)) {
      process.stdout.write(JSON.stringify({
        decision: "block",
        reason: "rm -rf on root/home/current directory is too dangerous. Be more specific about what to delete."
      }));
      process.exit(2);
    }
  } catch {
    // Don't block on parse errors
  }
  process.exit(0);
});
