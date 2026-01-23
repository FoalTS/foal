---
title: Version 5.2 release notes
authors: LoicPoullain
image: blog/twitter-banners/version-5.2-release-notes.png
tags: [release]
---

![Banner](./assets/version-5.2-is-here/banner.png)

Version 5.2 of [Foal](https://foalts.org/) is out!

<!--truncate-->

## PasswordService and automatic password upgrade

Version 5.2 introduces a new `PasswordService` that centralizes password hashing and verification functionality. This service provides a cleaner API and enables automatic password security upgrades.

### New PasswordService

The `PasswordService` class groups all password-related operations:

```typescript
import { PasswordService, dependency } from '@foal/core';

export class AuthService {
  @dependency
  passwordService: PasswordService;

  async createUser(email: string, password: string) {
    const passwordHash = await this.passwordService.hashPassword(password);
    // Save user with passwordHash
  }

  async verifyUserPassword(plainPassword: string, passwordHash: string): Promise<boolean> {
    return this.passwordService.verifyPassword(plainPassword, passwordHash);
  }
}
```

### Automatic password upgrade

One of the key features of the new service is the ability to automatically upgrade password hashes when they become outdated. This is particularly useful when security standards evolve (e.g., when the number of PBKDF2 iterations increases).

The `verifyPassword` method now accepts an optional `onPasswordUpgrade` callback that is called when a password hash needs to be upgraded:

```typescript
import { PasswordService, dependency } from '@foal/core';

export class AuthService {
  @dependency
  passwordService: PasswordService;

  @dependency
  userRepository: UserRepository;

  async login(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    
    const isValid = await this.passwordService.verifyPassword(
      password,
      user.passwordHash,
      {
        onPasswordUpgrade: async (newHash) => {
          // Automatically save the upgraded hash
          await this.userRepository.updatePasswordHash(user.id, newHash);
        }
      }
    );

    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    // User is authenticated
  }
}
```

When a user logs in with a password that was hashed with an older security standard, the service automatically:
1. Verifies the password is correct
2. Detects that the hash needs to be upgraded
3. Generates a new hash with the current security standards
4. Calls the `onPasswordUpgrade` callback with the new hash
5. Returns the verification result

This ensures that all password hashes in your database are gradually upgraded to the latest security standards.

### Deprecated functions

The standalone functions `hashPassword`, `verifyPassword`, and `passwordHashNeedsToBeRefreshed` are now deprecated in favor of the `PasswordService` methods. 

```typescript
// Deprecated
import { hashPassword, verifyPassword } from '@foal/core';

// Recommended
import { PasswordService } from '@foal/core';
```

## TypeORMStore now supports string user IDs

The `TypeORMStore` session store now supports both `number` and `string` user IDs. This is particularly useful when using UUIDs or other string-based identifiers as primary keys for your users.

### How it works

The `sessions` table now has two columns for storing user IDs:
- `user_id` (integer, nullable) - for numeric user IDs
- `user_id_str` (varchar(64), nullable) - for string user IDs (UUIDs, etc.)

When saving a session, the store automatically determines which column to use based on the type of the user ID. 

### Migration

Run the command `npm run makemigrations`. It will generate a migration to add the new "user_id_str" column in your codebase.

Then run `npm run migrations` to apply it.

Existing sessions with numeric user IDs will continue to work without any changes.
