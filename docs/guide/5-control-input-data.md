# 5. Control and sanitize input data

Of course, input data received by the server cannot be trusted. That's why we need to add control and sanitization tools. These are called hooks.

Explain shape of a pre-hook.

```typescript // ajv on s'en tape non ?
@preHook(ctx => escapeHTML(ctx.body, 'text'))
```