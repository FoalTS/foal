function category(label, items) {
  return {
    type: 'category',
    label,
    items
  }
}

function expandedCategory(label, items) {
  return {
    type: 'category',
    label,
    collapsed: false,
    items
  }
}

function link(label, href) {
  return {
    type: 'link',
    label,
    href,
  }
}

module.exports = {
  someSidebar: [
    'README',
    expandedCategory('TUTORIALS', [
      category('Simple To-Do List', [
        'tutorials/simple-todo-list/1-installation',
        'tutorials/simple-todo-list/2-introduction',
        'tutorials/simple-todo-list/3-the-todo-model',
        'tutorials/simple-todo-list/4-the-shell-script-create-todo',
        'tutorials/simple-todo-list/5-the-rest-api',
        'tutorials/simple-todo-list/6-validation-and-sanitization',
        'tutorials/simple-todo-list/7-unit-testing',
      ]),
      category('Multi-User To-Do List', [
        'tutorials/multi-user-todo-list/1-Introduction',
        'tutorials/multi-user-todo-list/2-the-user-and-todo-models',
        'tutorials/multi-user-todo-list/3-the-shell-scripts',
        'tutorials/multi-user-todo-list/5-auth-controllers-and-hooks',
        'tutorials/multi-user-todo-list/6-todos-and-ownership',
        'tutorials/multi-user-todo-list/7-the-signup-page',
        'tutorials/multi-user-todo-list/8-e2e-testing-and-authentication',
      ])
    ]),
    expandedCategory('TOPIC GUIDES', [
      category('Architecture', [
        'architecture/architecture-overview',
        'architecture/controllers',
        'architecture/services-and-dependency-injection',
        'architecture/hooks',
        'architecture/initialization',
        'architecture/error-handling',
      ]),
      category('Common', [
        'common/validation-and-sanitization',
        'common/serializing-and-deserializing',
        'common/templating',
        'common/logging-and-debugging',
        'common/generate-tokens',
      ]),
      category('Databases', [
        'databases/typeorm',
        'databases/create-models-and-queries',
        'databases/generate-and-run-migrations',
        'databases/mongodb',
        'databases/using-another-orm',
      ]),
      category('Authentication & Access Control', [
        'authentication-and-access-control/quick-start',
        'authentication-and-access-control/user-class',
        'authentication-and-access-control/password-management',
        'authentication-and-access-control/session-tokens',
        'authentication-and-access-control/jwt',
        'authentication-and-access-control/social-auth',
        'authentication-and-access-control/administrators-and-roles',
        'authentication-and-access-control/groups-and-permissions',
      ]),
      category('API', [
        'api-section/rest-blueprints',
        'api-section/openapi-and-swagger-ui',
        'api-section/public-api-and-cors-requests',
        'api-section/graphql',
      ]),
      category('Frontend Integration', [
        'frontend-integration/single-page-applications',
        'frontend-integration/angular-react-vue',
        'frontend-integration/jsx-server-side-rendering',
        'frontend-integration/nuxt.js',
      ]),
      category('File System', [
        'file-system/local-and-cloud-storage',
        'file-system/upload-and-download-files',
      ]),
      category('CLI & Development Environment', [
        'development-environment/build-and-start-the-app',
        'development-environment/create-and-run-scripts',
        'development-environment/code-generation',
        'development-environment/linting-and-code-style',
        'development-environment/vscode',
      ]),
      category('Testing', [
        'testing/introduction',
        'testing/unit-testing',
        'testing/e2e-testing',
      ]),
      category('Security', [
        'security/http-headers-protection',
        'security/csrf-protection',
        'security/xss-protection',
      ]),
      category('Cookbook', [
        'cookbook/scheduling-jobs',
        'cookbook/404-page',
        'cookbook/request-body-size',
        'cookbook/expressjs',
        'cookbook/root-imports',
        'cookbook/limit-repeated-requests',
      ]),
      category('Deployment & Environments', [
        'deployment-and-environments/configuration',
        'deployment-and-environments/ship-to-production',
      ]),
      'comparison-with-other-frameworks'
    ]),
    category('Upgrading', [
      'upgrade-to-v2/README',
      link('To v1', 'https://github.com/FoalTS/foal/releases/tag/v1.0.0'),
    ]),
    category('Community', [
      "community/awesome-foal"
    ])
  ]
};
