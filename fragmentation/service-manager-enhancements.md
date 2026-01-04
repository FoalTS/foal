# Patch: ServiceManager Enhancements (ServiceFactory and LazyService)

## Metadata
- **Patch ID**: `service-manager-enhancements`
- **Created Date**: 2025-12-20
- **Original Branch**: `copilot/analyze-custom-service-manager`
- **Base Version**: FoalTS 5.1.1
- **Derived From**: Commit b28096d (master branch after route-shadowing-fix merge)
- **Status**: Active
- **Latest Applied Branch**: `copilot/analyze-custom-service-manager`
- **Target Merge**: master (v5.1.1)

## Version Information
This patch was developed against **FoalTS 5.1.1** based on a custom v4.5.1 implementation. The enhancements integrate features from a user's custom ServiceManager implementation while maintaining full backward compatibility with v5.1.1.

To apply this patch to older versions (e.g., 4.5.1), you may need to:
1. Create a branch from the 4.5.1 tag
2. Manually port the changes (cherry-pick may not work cleanly due to version differences)
3. Adjust for any API differences between versions
4. Test thoroughly as the codebase structure may differ

## Problem Statement
The standard FoalTS ServiceManager lacked several advanced dependency injection features that were present in a custom v4.5.1 implementation:

1. **ServiceFactory Pattern**: No support for factory-based service creation with custom initialization logic
2. **Service Registration**: No `register()` method for pre-registering services with lazy initialization
3. **LazyService Wrapper**: No deferred service resolution with caching for properties
4. **Initialization Tracking**: No mechanism to track when the service manager has completed initial boot
5. **Lazy Boot Control**: No fine-grained control over when services are booted vs. instantiated

These limitations made it difficult to:
- Create services with complex initialization requirements
- Defer service instantiation until first use (memory optimization)
- Support lazy-loaded service properties in controllers/services
- Control the boot lifecycle of individual services

## Solution Summary
Implemented three major enhancements to the ServiceManager:

### 1. ServiceFactory Class
A concrete class that takes a factory function for custom service creation:
```typescript
const factory = new ServiceFactory<MyService>((sm: ServiceManager) => {
  return [MyService, new MyService(config)];
});
```

### 2. Service Registration with `register()` Method
Pre-register services for lazy or immediate initialization:
```typescript
sm.register(DatabaseService);  // Lazy - created on first get()
sm.register(CacheService, { init: true, boot: false });  // Immediate, no boot
```

### 3. LazyService Wrapper Class
Deferred service resolution with caching for service properties:
```typescript
class MyController {
  private dbService = new LazyService(DatabaseService);
  
  async method() {
    // Service resolved and cached on first access
    await this.dbService.value.query(...);
  }
}

// Initialize lazy services
LazyService.boot(serviceManager, myControllerInstance);
```

## Changes Made

### Files Modified

1. **`packages/core/src/core/service-manager.ts`**
   - Added `ServiceFactory<T>` class (concrete, not abstract)
     - Constructor accepts factory function: `(sm: ServiceManager) => [Class<T>, T]`
     - `create(sm)` method executes the factory function
   
   - Added `ServiceEntry` interface for map values
     - Properties: `boot: boolean`, `service?: any`, `target?: Class|ServiceFactory<any>`
     - Enables lazy initialization by storing target instead of service
   
   - Added `register()` method with multiple overload signatures
     - `register(identifier: string, target: Class|ServiceFactory, options?)`
     - `register(identifier: ClassOrAbstractClass, target: Class|ServiceFactory, options?)`
     - `register(identifierOrTarget: ClassOrAbstractClass, options?)`
     - Options: `boot?: boolean` (default true), `init?: boolean` (default false)
   
   - Enhanced `get()` method
     - Now supports ServiceFactory instances
     - Handles lazy initialization (target field in map)
     - Detects and prevents async boot hooks in lazy-initialized services
   
   - Enhanced `boot()` method
     - Instantiates lazy services before booting them
     - Sets `initialized` flag after first boot
     - Prevents async boot hooks in services initialized after boot
   
   - Added `initialized` private flag to track boot state
   
   - Added helper methods:
     - `instantiateService(target)` - Creates service from Class or ServiceFactory
     - `injectDependencies(serviceClass, service)` - Injects dependencies into service
   
   - Added `LazyService<T, V extends T = T>` class (after ServiceManager definition)
     - Private properties: `sm` (injected via @dependency), `c` (cached value)
     - Constructor: `type: ClassOrAbstractClass<T>`, `tx?: (v: T) => V` (transform function)
     - Getter `value` - Resolves service on first access, caches result
     - Static method `boot<T>(sm, s)` - Injects ServiceManager into LazyService instances
   
   - Added `injectLazyService()` helper function for LazyService dependency injection

2. **`packages/core/src/core/service-manager.spec.ts`**
   - Imported `ServiceFactory` and `LazyService`
   
   - Added test suite: "when register is called" (6 tests)
     - Should return itself
     - Should register a service for lazy initialization
     - Should register a service with a string identifier
     - Should register a service with boot option set to false
     - Should register a service with init option for immediate instantiation
     - Should support ServiceFactory for service creation
   
   - Added test suite: "ServiceFactory integration" (2 tests)
     - Should handle ServiceFactory in get method
     - Should cache services created by factory
   
   - Added test suite: "lazy initialization" (3 tests)
     - Should throw error if lazy service has async boot hook after initialized
     - Should call sync boot hook immediately for lazy services after initialized
     - Should not call boot hook immediately for lazy services if boot is false
   
   - Added test suite: "LazyService" (5 tests)
     - Should lazily resolve a service on first access
     - Should cache the resolved service
     - Should support transformation function
     - Should throw error if transformation returns invalid value
     - Should inject ServiceManager into multiple LazyService instances

3. **`packages/core/src/core/index.ts`**
   - Updated exports to include `ServiceFactory` and `LazyService`

## Commit History
```
6d813f3 - Add LazyService class for deferred service resolution with caching
2f28159 - Add ServiceFactory, LazyService, and lazy initialization to ServiceManager
74d0f0f - Change ServiceFactory from abstract to concrete class with factory function
3ae9888 - Address code review feedback - improve type safety and readability
3cc4765 - Fix linting errors in ServiceManager implementation
dd8a078 - Add ServiceFactory and register method to ServiceManager
35ad599 - Initial plan
```

## Key Implementation Details

### ServiceFactory Pattern
Uses a concrete class with a factory function rather than an abstract class:
```typescript
// User provides factory function
const factory = new ServiceFactory<MyService>((sm: ServiceManager) => {
  const dep = sm.get(SomeDependency);
  return [MyService, new MyService(dep)];
});

// ServiceManager uses it
const [ServiceClass, instance] = factory.create(serviceManager);
```

### Lazy Initialization Flow
1. **Register**: Service stored with `target` (Class or Factory), no `service` yet
2. **First get()**: 
   - Instantiate from `target`
   - Inject dependencies
   - Store in `service` field
   - Clear `target` field
   - Boot if needed and initialized
3. **Subsequent get()**: Return cached `service`

### LazyService Pattern
```typescript
// In a service or controller
class EstimateController {
  private employeeDao = new LazyService(EmployeeDao);
  private dispatcher = new LazyService(Dispatcher);
  
  async getEstimate() {
    // Services resolved on first .value access
    const employees = await this.employeeDao.value.getByLegacyIds(...);
    await this.dispatcher.value.execute(...);
  }
}

// During service creation
const controller = new EstimateController();
LazyService.boot(serviceManager, controller);  // Injects SM into LazyServices
```

### Initialization State Tracking
- `initialized` flag set to `false` initially
- Set to `true` after first `boot()` call with no identifier
- Used to detect lazy-initialized services after boot
- Prevents async boot hooks in lazy services (throws error)

## Testing
- Added 16 new tests (11 for ServiceManager features, 5 for LazyService)
- Total: 62 tests passing (57 ServiceManager + 5 LazyService)
- No regressions in existing functionality
- All new features have comprehensive test coverage
- Linting: Passed
- TypeScript compilation: Successful

## Branch Application History

### Applied to Branches
| Branch | Date | Commit Hash | Status | Notes |
|--------|------|-------------|--------|-------|
| `copilot/analyze-custom-service-manager` | 2025-12-20 | 6d813f3 | ✅ Original | Initial implementation (v5.1.1) |

### Pending Application
- [ ] `master` - Waiting for PR approval (target: v5.1.1)
- [ ] Older versions (e.g., v4.5.1) - May require manual porting due to version differences

## How to Apply This Patch to Another Branch

### To Same Version (v5.1.1+)
1. Checkout the target branch:
   ```bash
   git checkout <target-branch>
   ```

2. Cherry-pick the commits (in order):
   ```bash
   git cherry-pick 35ad599  # Initial plan
   git cherry-pick dd8a078  # ServiceFactory and register method
   git cherry-pick 3cc4765  # Linting fixes
   git cherry-pick 3ae9888  # Code review improvements
   git cherry-pick 74d0f0f  # ServiceFactory pattern change
   git cherry-pick 2f28159  # Progress update
   git cherry-pick 6d813f3  # LazyService implementation
   ```

3. Test the changes:
   ```bash
   cd packages/core
   npm run build
   npm test -- --grep "ServiceManager"
   npm run lint
   ```

4. Update this file with the new branch application:
   - Add entry to "Applied to Branches" table
   - Update "Latest Applied Branch" in metadata
   - Update status if needed

### To Older Versions (e.g., v4.5.1)
**Note**: This patch was developed for v5.1.1. Applying to older versions requires manual porting.

1. Create a branch from the target version tag:
   ```bash
   git checkout -b service-manager-enhancements-v4.5.1 v4.5.1
   ```

2. Manually review and apply the changes:
   - Review the diff: `git diff b28096d..6d813f3 -- packages/core/src/core/service-manager.ts`
   - Check for API differences in the older version
   - Adapt the code if necessary
   - Apply similar changes to test and index files

3. Key files to update:
   - `packages/core/src/core/service-manager.ts` - Add all new classes and methods
   - `packages/core/src/core/service-manager.spec.ts` - Add tests
   - `packages/core/src/core/index.ts` - Update exports

4. Thoroughly test on the target version:
   ```bash
   cd packages/core
   npm install  # Ensure dependencies for that version
   npm run build
   npm test
   npm run lint
   ```

5. Document the port in this file with the version-specific commit hash

### Using Git Patch File
Alternatively, create and apply patch files (works best for same version):
```bash
# Create patch
git format-patch 35ad599~1..6d813f3 -o fragmentation/patches/service-manager-enhancements/

# Apply to target branch
git checkout <target-branch>
git am fragmentation/patches/service-manager-enhancements/*.patch
```

## Validation Checklist
After applying to a new branch, verify:
- [ ] All ServiceManager tests pass (62 total)
- [ ] Linting passes
- [ ] Build succeeds
- [ ] TypeScript compilation successful
- [ ] No regressions in existing functionality
- [ ] ServiceFactory pattern works as expected
- [ ] LazyService resolves and caches correctly
- [ ] `register()` method supports all overload signatures
- [ ] Lazy initialization prevents async boot hooks

## Dependencies
- No new external dependencies added
- Uses existing `reflect-metadata` for dependency injection
- Compatible with FoalTS 5.1.1+
- Maintains backward compatibility with existing ServiceManager API

## Usage Examples

### ServiceFactory
```typescript
import { ServiceFactory, ServiceManager } from '@foal/core';

// Create a factory
const dbFactory = new ServiceFactory<DatabaseService>((sm: ServiceManager) => {
  const config = sm.get(ConfigService);
  return [DatabaseService, new DatabaseService(config.dbUrl)];
});

// Register and use
const sm = new ServiceManager();
sm.register('database', dbFactory);
const db = sm.get('database');
```

### Service Registration
```typescript
import { ServiceManager } from '@foal/core';

const sm = new ServiceManager();

// Lazy initialization (default)
sm.register(UserService);
const user = sm.get(UserService);  // Created on first access

// Immediate initialization
sm.register(CacheService, { init: true });

// No boot
sm.register(LogService, { boot: false });
```

### LazyService
```typescript
import { LazyService, ServiceManager } from '@foal/core';

class EstimateController {
  private employeeDao = new LazyService(EmployeeDao);
  private jobDao = new LazyService(JobDao);
  
  async getEstimate(id: string) {
    // Services resolved on first .value access
    const employees = await this.employeeDao.value.getByIds([id]);
    const jobs = await this.jobDao.value.findAll();
    return { employees, jobs };
  }
}

// Initialize
const sm = new ServiceManager();
const controller = new EstimateController();
LazyService.boot(sm, controller);
```

## Related Issues
- Original requirement: Integrate ServiceFactory and LazyService from custom v4.5.1 implementation
- PR: Add ServiceFactory, LazyService, and lazy initialization to ServiceManager

## Rollback Instructions
If issues occur after applying:
```bash
git revert 6d813f3 2f28159 74d0f0f 3ae9888 3cc4765 dd8a078 35ad599
```

Or revert to the commit before the patch:
```bash
git reset --hard b28096d
```

## Notes
- This patch is backward compatible
- No breaking changes to public API
- All existing ServiceManager functionality preserved
- New features are opt-in (existing code works unchanged)
- ServiceFactory uses concrete class pattern (user's design)
- LazyService requires explicit `boot()` call for ServiceManager injection
- Comprehensive test coverage for all new features
- Based on user's custom v4.5.1 implementation patterns
