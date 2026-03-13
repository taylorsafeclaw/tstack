---
name: tai-convex-patterns
description: "SafeClaw Convex backend patterns reference — auth, encryption, state machine, indexes, validators. Loaded by tai-convex agent."
user-invocable: false
---

You have access to SafeClaw's Convex backend patterns. Reference these when implementing backend features.

## Authentication

Every mutation must authenticate:
```typescript
import { getUserOrThrow } from "../lib/auth";

const user = await getUserOrThrow(ctx);
```

For resource access, verify ownership:
```typescript
const workspace = await ctx.db.get(args.workspaceId);
if (!workspace || workspace.userId !== user._id) {
  throw new ConvexError("Unauthorized");
}
```

## Encryption (API keys and secrets)

Use `convex/lib/crypto.ts` for all sensitive values:
```typescript
import { encryptValue, decryptValue } from "../lib/crypto";

// Store
const encrypted = await encryptValue(ctx, apiKey);
await ctx.db.patch(id, { apiKey: encrypted });

// Retrieve
const decrypted = await decryptValue(ctx, record.apiKey);
```

**Never** store API keys, tokens, or passwords as plaintext strings.

## Workspace state machine

Status transitions go through `convex/lib/workspaces.ts`:
```typescript
import { transitionWorkspaceStatus } from "../lib/workspaces";

// This validates the transition is legal
await transitionWorkspaceStatus(ctx, workspaceId, "paused");
```

Valid transitions:
- `provisioning` → `running` | `error`
- `running` → `paused` | `error`
- `paused` → `running` | `error`
- `error` → `running` (retry)

**Never** set `status` directly with `ctx.db.patch`.

## Indexes

Every query that filters by a field needs an index in `schema.ts`:
```typescript
// schema.ts
workspaces: defineTable({...})
  .index("by_userId", ["userId"])
  .index("by_status", ["status"])
  .index("by_userId_status", ["userId", "status"])
```

Index naming: `by_<field>` or `by_<field1>_<field2>` for compounds.

## Validators

Reuse shared validators from `convex/lib/validators.ts`:
```typescript
import { workspaceStatus, channelType } from "../lib/validators";

// In mutation args:
args: {
  status: workspaceStatus,  // not v.string()
}
```

Don't create duplicate validators — check `validators.ts` first.

## Action logs

Log significant operations for audit trail:
```typescript
await ctx.runMutation(internal.messaging.actionLogs.log, {
  workspaceId,
  type: "workspace_paused",
  message: "Workspace paused by user",
});
```

## Convex patterns

### Mutations (write operations)
```typescript
export const createThing = mutation({
  args: { name: v.string(), workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const user = await getUserOrThrow(ctx);
    // verify ownership...
    return await ctx.db.insert("things", { ...args, userId: user._id });
  },
});
```

### Queries (read operations)
```typescript
export const getThing = query({
  args: { id: v.id("things") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
```

### Actions (external API calls)
```typescript
export const callExternalApi = action({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    try {
      const result = await fetch("https://api.example.com/...");
      await ctx.runMutation(internal.things.update, { ... });
    } catch (error) {
      await ctx.runMutation(internal.messaging.actionLogs.log, {
        workspaceId: args.workspaceId,
        type: "api_error",
        message: `External API failed: ${error.message}`,
      });
      throw error;
    }
  },
});
```
