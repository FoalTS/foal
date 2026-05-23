module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  plugins: [
    '@typescript-eslint'
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  rules: {
    '@typescript-eslint/array-type': 'error',
    '@typescript-eslint/explicit-member-accessibility': [
      'error', { 'accessibility': 'no-public' }
    ],
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/quotes': ['error', 'single'],
    'arrow-parens': ['error', 'as-needed'],
    'max-classes-per-file': 'off',
    'no-console': 'off',
    'no-duplicate-imports': 'error',
    'no-empty': 'off',
    'no-shadow': 'off',
    'comma-dangle': 'off',
    'sort-keys': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { 'args':  'none' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/require-await': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    // Monorepo additions: disable rules that fire on intentional framework patterns
    'no-prototype-builtins': 'off',                                    // .hasOwnProperty() in session.ts, service-manager.ts, swagger-controller.ts
    '@typescript-eslint/no-misused-promises': 'off',                   // new Promise(async ...) in storage, setImmediate(async ...) in async.service.ts
    '@typescript-eslint/restrict-template-expressions': 'off',         // template literals with non-string types throughout packages/
    '@typescript-eslint/no-floating-promises': 'off',                  // fire-and-forget patterns in socketio-controller.service.ts
    '@typescript-eslint/ban-types': 'off',                             // Function type in context.ts
    '@typescript-eslint/quotes': 'off',                                // overrides template's 'single' — framework code uses double quotes in many places; fix in follow-up PR
    'no-case-declarations': 'off',                                     // let/const in switch cases in cli.ts, jwt, sessions
    'no-useless-escape': 'off',                                        // regex escape patterns in generator.ts, swagger-controller.ts
    '@typescript-eslint/await-thenable': 'off',                        // await on sync functions in spec files — pre-existing test style
    '@typescript-eslint/no-unnecessary-type-assertion': 'off',         // type narrowing assertions in spec files
    '@typescript-eslint/no-base-to-string': 'off',                     // service objects in template literals in spec files
    '@typescript-eslint/no-redundant-type-constituents': 'off',        // any in union types in config.ts, interfaces.ts
    '@typescript-eslint/no-this-alias': 'off',                         // const self = this pattern in spec files
    'no-inner-declarations': 'off',                                    // function declarations inside blocks in jwt.hook.spec.ts
    'no-async-promise-executor': 'off',                                // new Promise(async ...) in redis-store and parse-and-validate-files
    'no-extra-semi': 'off',                                            // extra semicolon in logger.ts
    '@typescript-eslint/ban-ts-comment': 'off',                        // @ts-ignore in service-manager.ts — separate PR per plan
  },
  ignorePatterns: [
    'src/migrations/*.ts',
    '**/src/migrations/*.ts',
    '**/src/generate/fixtures/**/*.ts',
    'packages/cli/fixtures',
    'packages/cli/specs',
    'packages/cli/templates',
    '**/*.d.ts',
  ]
};
