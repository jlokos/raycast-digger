# Raycast Preferences Type

When working with Raycast extensions, do NOT define separate interfaces for preferences that are already defined in `package.json`.

## ❌ Avoid This

```typescript
interface Preferences {
  downloadPath: string;
  autoLoadUrlFromClipboard: boolean;
  autoLoadUrlFromSelectedText: boolean;
  enableBrowserExtensionSupport: boolean;
}

const preferences = getPreferenceValues<Preferences>();
```

## ✅ Do This Instead

Raycast automatically generates TypeScript types from the preferences defined in `package.json`. Use inline types for only the preferences you need:

```typescript
const preferences = getPreferenceValues<{
  autoLoadUrlFromClipboard: boolean;
  autoLoadUrlFromSelectedText: boolean;
  enableBrowserExtensionSupport: boolean;
}>();
```

Or simply use `getPreferenceValues()` without type parameters and let TypeScript infer the types from the Raycast-generated types.

## Rationale

- Raycast's build system automatically generates preference types from `package.json`
- Manually defining preference interfaces creates redundancy and potential type mismatches
- Inline types or type inference provide type safety without duplication
