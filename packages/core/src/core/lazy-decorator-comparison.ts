/**
 * Complete Before/After Example: @lazy Decorator
 * 
 * This example demonstrates the improvement achieved by the @lazy decorator
 * for automatic LazyService initialization without manual boot() calls.
 */

import { strictEqual } from 'assert';
import { ServiceManager, LazyService, lazy } from './service-manager';

// Example services
class DatabaseService {
  query(sql: string): string {
    return `DB result: ${sql}`;
  }
}

class CacheService {
  get(key: string): string {
    return `Cache value for: ${key}`;
  }
}

class LogService {
  log(message: string): string {
    return `Logged: ${message}`;
  }
}

console.log('='.repeat(70));
console.log('BEFORE: Manual LazyService.boot() Required');
console.log('='.repeat(70));

// OLD APPROACH: Requires manual boot call
class OldController {
  private dbService = new LazyService(DatabaseService);
  private cacheService = new LazyService(CacheService);
  private logService = new LazyService(LogService);

  processData(sql: string): { db: string; cache: string; log: string } {
    return {
      db: this.dbService.value.query(sql),
      cache: this.cacheService.value.get('data'),
      log: this.logService.value.log('Processing complete')
    };
  }
}

// Create instance and MANUALLY call boot
const serviceManager1 = new ServiceManager();
const oldController = new OldController();
LazyService.boot(serviceManager1, oldController); // ⚠️ REQUIRED MANUAL STEP

const oldResult = oldController.processData('SELECT * FROM users');
console.log('\n📋 Old Approach Result:');
console.log(JSON.stringify(oldResult, null, 2));
console.log('\n⚠️  Required manual LazyService.boot() call');

console.log('\n' + '='.repeat(70));
console.log('AFTER: @lazy Decorator - Automatic Initialization');
console.log('='.repeat(70));

// NEW APPROACH: @lazy decorator handles everything automatically
class NewController {
  @lazy
  private dbService = new LazyService(DatabaseService);

  @lazy
  private cacheService = new LazyService(CacheService);

  @lazy
  private logService = new LazyService(LogService);

  processData(sql: string): { db: string; cache: string; log: string } {
    return {
      db: this.dbService.value.query(sql),
      cache: this.cacheService.value.get('data'),
      log: this.logService.value.log('Processing complete')
    };
  }
}

// Simply get the controller from ServiceManager - no manual boot needed!
const serviceManager2 = new ServiceManager();
const newController = serviceManager2.get(NewController); // ✅ Automatic injection

const newResult = newController.processData('SELECT * FROM users');
console.log('\n📋 New Approach Result:');
console.log(JSON.stringify(newResult, null, 2));
console.log('\n✅ No manual boot call needed - @lazy decorator handles it!');

// Verify both produce the same results
strictEqual(oldResult.db, newResult.db);
strictEqual(oldResult.cache, newResult.cache);
strictEqual(oldResult.log, newResult.log);

console.log('\n' + '='.repeat(70));
console.log('BENEFITS OF @lazy DECORATOR');
console.log('='.repeat(70));
console.log('✓ Cleaner, more declarative code');
console.log('✓ No manual boot() calls needed');
console.log('✓ Automatic ServiceManager injection');
console.log('✓ Works seamlessly with dependency injection');
console.log('✓ Supports inheritance and transformation functions');
console.log('✓ Fully backward compatible');
console.log('✓ Type-safe with full TypeScript support');
console.log('='.repeat(70));

console.log('\n✅ All assertions passed - Both approaches work correctly!');
console.log('🎉 The @lazy decorator successfully achieves the same result');
console.log('   without requiring manual boot() calls!');
