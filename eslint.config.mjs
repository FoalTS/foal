import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  {
    // Match TSLint's scope: tslint --project tsconfig.json
    // Root tsconfig.json include: packages/**/index.ts, packages/**/src/**/*.ts
    files: [
      'packages/**/index.ts',
      'packages/**/src/**/*.ts',
      'packages/**/src/**/*.tsx',
    ],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      prettierConfig,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // --- Active rules (carried over from TSLint) ---
      '@typescript-eslint/array-type': 'error',
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        { accessibility: 'no-public' },
      ],
      'no-duplicate-imports': 'error',

      // --- Disabled: not enforced by TSLint ---
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      'max-classes-per-file': 'off',
      'no-console': 'off',
      'no-empty': 'off',
      'no-shadow': 'off',
      'sort-keys': 'off',

      // --- Disabled: unsafe-* rules (codebase uses `any` extensively) ---
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',

      // --- Disabled: pre-existing violations (enable incrementally) ---
      '@typescript-eslint/no-unnecessary-type-assertion': 'off', // 51 violations
      '@typescript-eslint/await-thenable': 'off',                // 23 violations
      '@typescript-eslint/no-misused-promises': 'off',           // 22 violations
      '@typescript-eslint/no-redundant-type-constituents': 'off', // 20 violations
      '@typescript-eslint/no-floating-promises': 'off',          // 12 violations
      '@typescript-eslint/restrict-template-expressions': 'off', // 11 violations
      '@typescript-eslint/no-unused-vars': 'off',                // 9 violations
      '@typescript-eslint/prefer-promise-reject-errors': 'off',  // 8 violations
      '@typescript-eslint/no-base-to-string': 'off',             // 7 violations
      '@typescript-eslint/no-this-alias': 'off',                 // 4 violations
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-duplicate-type-constituents': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/only-throw-error': 'off',
      'no-prototype-builtins': 'off',                            // 48 violations
      'no-case-declarations': 'off',                             // 41 violations
      'no-useless-escape': 'off',                                // 24 violations
      'preserve-caught-error': 'off',                            // 25 violations (new in ESLint v10)
      'no-async-promise-executor': 'off',                        // 4 violations
      'no-useless-assignment': 'off',
      'no-useless-catch': 'off',
      'prefer-const': 'off',
    },
  },
  {
    // TSLint's linterOptions.exclude (from master's tslint.json)
    // plus standard non-source ignores
    ignores: [
      '**/src/migrations/*.ts',
      '**/src/generate/fixtures/**/*.ts',
      'packages/cli/templates/app/src/**',
      'packages/cli/specs/app/src/**',
      'packages/cli/templates/rest-api/**/*.ts',
      'packages/cli/templates/entity/entity.ts',
      'packages/cli/templates/entity/entity.mongodb.ts',
      'packages/cli/specs/**/app.controller.ts',
      'packages/cli/specs/**/api.controller.ts',
      'packages/cli/specs/entity/test-foo-bar.entity.ts',
      'packages/cli/specs/entity/test-foo-bar.entity.mongodb.ts',
      'node_modules/**',
      'dist/**',
      'build/**',
      'docs/**',
      '**/*.js',
      '**/*.mjs',
      '**/*.d.ts',
    ],
  },
);
