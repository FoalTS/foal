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
        'tutorials/simple-todo-list/tuto-1-installation',
        'tutorials/simple-todo-list/tuto-2-introduction',
        'tutorials/simple-todo-list/tuto-3-the-todo-model',
        'tutorials/simple-todo-list/tuto-4-the-shell-script-create-todo',
        'tutorials/simple-todo-list/tuto-5-the-rest-api',
        'tutorials/simple-todo-list/tuto-6-validation-and-sanitization',
        'tutorials/simple-todo-list/tuto-7-unit-testing',
      ]),
      category('Full Example with React', [
        'tutorials/real-world-example-with-react/tuto-1-introduction',
        'tutorials/real-world-example-with-react/tuto-2-database-set-up',
        'tutorials/real-world-example-with-react/tuto-3-the-models',
        'tutorials/real-world-example-with-react/tuto-4-the-shell-scripts',
        'tutorials/real-world-example-with-react/tuto-5-our-first-route',
        'tutorials/real-world-example-with-react/tuto-6-swagger-interface',
        'tutorials/real-world-example-with-react/tuto-7-add-frontend',
        'tutorials/real-world-example-with-react/tuto-8-authentication',
        'tutorials/real-world-example-with-react/tuto-9-authenticated-api',
        'tutorials/real-world-example-with-react/tuto-10-auth-with-react',
        'tutorials/real-world-example-with-react/tuto-11-sign-up',
        'tutorials/real-world-example-with-react/tuto-12-file-upload',
        'tutorials/real-world-example-with-react/tuto-13-csrf',
        'tutorials/real-world-example-with-react/tuto-14-production-build',
        'tutorials/real-world-example-with-react/tuto-15-social-auth',
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
        'architecture/configuration',
      ]),
      category('Common', [
        'common/validation-and-sanitization',
        'common/serializing-and-deserializing',
        'common/templating',
        'common/logging-and-debugging',
        'common/generate-tokens',
        'common/conversions',
      ]),
      category('Databases', [
        'databases/typeorm',
        'databases/create-models-and-queries',
        'databases/generate-and-run-migrations',
        'databases/mongodb',
        'databases/using-another-orm',
      ]),
      category('Authentication', [
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
        'api-section/gRPC',
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
      category('Dev Tools', [
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
        'cookbook/not-found-page',
        'cookbook/request-body-size',
        'cookbook/expressjs',
        'cookbook/root-imports',
        'cookbook/limit-repeated-requests',
      ]),
      'websockets',
      category('Deployment', [
        'deployment-and-environments/checklist',
      ])
    ]),
    expandedCategory('Upgrading', [
      'upgrade-to-v2/README',
      link('To v1', 'https://github.com/FoalTS/foal/releases/tag/v1.0.0'),
    ]),
    expandedCategory('Community', [
      "community/awesome-foal"
    ])
  ]
};
