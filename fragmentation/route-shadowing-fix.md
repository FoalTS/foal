# Patch: Route Shadowing Fix

## Metadata
- **Patch ID**: `route-shadowing-fix`
- **Created Date**: 2025-12-20
- **Original Branch**: `copilot/fix-route-shadowing-issue`
- **Status**: Active
- **Latest Applied Branch**: `copilot/fix-route-shadowing-issue`

## Problem Statement
Dynamic routes (e.g., `GET /mypath/:param`) were shadowing static routes (e.g., `GET /mypath/some-static-path`) when both were defined in the same controller. This happened because Express matches routes in the order they are registered, and the dynamic route would match first.

## Solution Summary
Implemented a route sorting algorithm that ensures static routes are registered with Express before dynamic routes by calculating a specificity score for each route.

## Changes Made

### Files Modified
1. `packages/core/src/express/create-app.ts`
   - Added route sorting constants: `STATIC_SEGMENT_WEIGHT`, `PATH_LENGTH_WEIGHT`, `POSITION_BASE`
   - Added `calculateRouteSpecificity(path: string): number` - Scores routes based on static segments
   - Added `RouteWithPath` interface for type safety
   - Added `sortRoutes<T extends RouteWithPath>(routes: T[]): T[]` - Sorts routes by specificity
   - Modified `createApp()` to convert routes to array and sort before registration

2. `packages/core/src/express/create-app.spec.ts`
   - Added unit tests for `calculateRouteSpecificity()`
   - Added unit tests for `sortRoutes()`
   - Added integration test: "should prioritize static routes over dynamic routes to prevent shadowing"
   - Added integration test: "should prioritize more specific routes with multiple segments"

## Commit History
```
0c92eb2 - Address code review feedback: add named constants, improve type safety, optimize performance
f5b1488 - Fix linting issues (trailing whitespace)
374b020 - Add unit tests for route sorting functions and refine scoring algorithm
823b919 - Implement route sorting to prevent dynamic routes from shadowing static routes
ce5b50c - Initial plan
```

## Key Implementation Details

### Route Specificity Scoring Algorithm
Routes are scored using three factors:
1. **Primary Factor**: Number of static segments × 100,000,000,000
2. **Secondary Factor**: Total path length × 100,000
3. **Tertiary Factor**: Position-weighted score (earlier static segments weighted more)

### Examples
```
/api/users/current/profile           → 4 static segments (highest priority)
/api/users/:userId/posts/:postId     → 3 static, 2 dynamic
/api/users/:userId                   → 2 static, 1 dynamic
/api/users                           → 2 static
/api/:resource/:id                   → 1 static, 2 dynamic
/:param                              → 0 static (lowest priority)
```

## Testing
- Added 8 new tests
- All 1302 tests passing
- No regressions introduced
- Security scan: Clean (CodeQL)
- Linting: Passed

## Branch Application History

### Applied to Branches
| Branch | Date | Commit Hash | Status | Notes |
|--------|------|-------------|--------|-------|
| `copilot/fix-route-shadowing-issue` | 2025-12-20 | 0c92eb2 | ✅ Original | Initial implementation |

### Pending Application
- [ ] `master` - Waiting for PR approval
- [ ] Other release branches as needed

## How to Apply This Patch to Another Branch

### Manual Application
1. Checkout the target branch:
   ```bash
   git checkout <target-branch>
   ```

2. Cherry-pick the commits (in order):
   ```bash
   git cherry-pick 823b919  # Main implementation
   git cherry-pick 374b020  # Tests and refinements
   git cherry-pick f5b1488  # Linting fixes
   git cherry-pick 0c92eb2  # Code review improvements
   ```

3. Test the changes:
   ```bash
   cd packages/core
   npm run build
   npm test
   npm run lint
   ```

4. Update this file with the new branch application:
   - Add entry to "Applied to Branches" table
   - Update "Latest Applied Branch" in metadata
   - Update status if needed

### Using Git Patch File
Alternatively, create and apply patch files:
```bash
# Create patch
git format-patch ce5b50c~1..0c92eb2 -o fragmentation/patches/

# Apply to target branch
git checkout <target-branch>
git am fragmentation/patches/*.patch
```

## Validation Checklist
After applying to a new branch, verify:
- [ ] All tests pass (especially the 8 new route sorting tests)
- [ ] Linting passes
- [ ] Build succeeds
- [ ] Integration test demonstrates fix works
- [ ] No regressions in existing functionality
- [ ] Security scan clean

## Dependencies
- No new external dependencies added
- Uses existing Express routing mechanism
- Compatible with FoalTS 5.1.1+

## Related Issues
- Original issue: Route shadowing when dynamic routes registered before static routes
- PR: Fix route shadowing: prioritize static routes over dynamic parameters

## Rollback Instructions
If issues occur after applying:
```bash
git revert 0c92eb2 f5b1488 374b020 823b919
```

Or revert to the commit before the patch:
```bash
git reset --hard ce5b50c
```

## Notes
- This patch is backward compatible
- No breaking changes to public API
- Exported functions (`calculateRouteSpecificity`, `sortRoutes`) can be used by other modules
- Performance optimized with pre-calculated power values
