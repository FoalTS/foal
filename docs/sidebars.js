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
        category('File Storage', [
          'common/file-storage/local-and-cloud-storage',
          'common/file-storage/upload-and-download-files',
        ]),
        'common/serialization',
        'common/logging',
        'common/async-tasks',
        'common/rest-blueprints',
        'common/openapi-and-swagger-ui',
        'common/graphql',
        'common/websockets',
        'common/gRPC',
        'common/utilities',
        'common/expressjs',
      ]),
      category('Databases', [
        category('With TypeORM', [
          'databases/typeorm/introduction',
          'databases/typeorm/create-models-and-queries',
          'databases/typeorm/generate-and-run-migrations',
          'databases/typeorm/mongodb',
        ]),
        category('With another ORM', [
          'databases/other-orm/introduction',
          'databases/other-orm/prisma',
        ]),
      ]),
      category('Authentication', [
        'authentication/quick-start',
        'authentication/user-class',
        'authentication/password-management',
        'authentication/session-tokens',
        'authentication/jwt',
        'authentication/social-auth',
      ]),
      category('Authorization', [
        'authorization/administrators-and-roles',
        'authorization/groups-and-permissions',
      ]),
      category('Frontend', [
        'frontend/single-page-applications',
        'frontend/angular-react-vue',
        'frontend/server-side-rendering',
        'frontend/nuxt.js',
        'frontend/not-found-page',
      ]),
      category('CLI', [
        'cli/commands',
        'cli/shell-scripts',
        'cli/code-generation',
        'cli/linting-and-code-style',
      ]),
      category('Testing', [
        'testing/introduction',
        'testing/unit-testing',
        'testing/e2e-testing',
      ]),
      category('Security', [
        'security/http-headers-protection',
        'security/csrf-protection',
        'security/cors',
        'security/rate-limiting',
        'security/body-size-limiting',
      ]),
      category('Deployment', [
        'deployment-and-environments/checklist',
      ])
    ]),
    expandedCategory('Comparison with Other Frameworks', [
      'comparison-with-other-frameworks/express-fastify',
    ]),
    expandedCategory('Upgrading', [
      link('To v5', 'https://github.com/FoalTS/foal/releases/tag/v5.0.0'),
      link('To v4', 'https://github.com/FoalTS/foal/releases/tag/v4.0.0'),
      link('To v3', 'https://foalts.org/docs/3.x/upgrade-to-v3/'),
      link('To v2', 'https://foalts.org/docs/2.x/upgrade-to-v2/'),
      link('To v1', 'https://github.com/FoalTS/foal/releases/tag/v1.0.0'),
    ]),
    expandedCategory('Community', [
      "community/awesome-foal"
    ])
  ]
};
