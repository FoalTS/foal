const { description } = require('../../package')

module.exports = {
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'FoalTS Docs',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,

  locales: {
    '/': {
      lang: 'en-US',
      title: 'FoalTS',
      description: description
    },
    '/es/': {
      lang: 'es-MX',
      title: 'FoalTS',
      description: 'Framework en TypeScript y Node.js, todo en uno.'
    }
  },
  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['meta', { name: 'theme-color', content: '#1B7CF2' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    repo: 'FoalTS/foal',
    editLinks: true,
    docsDir: 'https://docs.foalts.org/',
    smoothScroll: true,
    locales: {
      '/': {
        label: 'English',
        selectText: 'Languages',
        arialLabel: 'Select language',
        editLinkText: 'Edit this page on GitHub',
        lastUpdated: 'Last Updated',
        nav: require('./nav/en'),
        sidebar: {
          '/guide/': getGuideSidebar('Guide'),
          '/tutorials/': getTutorialsSidebar('Simple To-Do List', 'Multi-User To-Do List'),
          '/upgrade-to-v2/': getUpgradeToV2Sidebar('Menu')
        }
      },
      '/es/': {
        label: 'Español',
        selectText: 'Idiomas',
        arialLabel: 'Seleccionar Idioma',
        editLinkText: 'Editar en GitHub',
        lastUpdated: 'Ultima Actualización',
        nav: require('./nav/es'),
        sidebar: {
          '/es/guide/': getGuideSidebar('Guia'),
          '/es/tutorials/': getTutorialsSidebar('Lista de tareas', 'Lista de tareas con usuarios'),
          '/es/upgrade-to-v2/': getUpgradeToV2Sidebar('Menú')
        }
      }
    },
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
  ],
  extraWatchFiles: [
    './vuepress/nav/en.js',
    './vuepress/nav/es.js'
  ]
}

function getGuideSidebar(guideTitle) {
  return [
    {
      title: guideTitle,
      collapsable: false,
      children: [
        ['', 'Why FoalTS?']
      ]
    }
  ]
}

function getTutorialsSidebar(simpleTitle, multiTitle) {
  return [
    {
      title: simpleTitle,
      collapsable: false,
      children: [
        '1s-installation',
        '2s-introduction',
        '3s-the-todo-model',
        '4s-the-shell-script-create-todo',
        '5s-the-rest-api',
        '6s-validation-and-sanitization',
        '7s-unit-testing',
      ]
    },
    {
      title: multiTitle,
      collapsable: false,
      children: [
        '1m-Introduction',
        '2m-the-user-and-todo-models',
        '3m-the-shell-scripts',
        '5m-auth-controllers-and-hooks',
        '6m-todos-and-ownership',
        '7m-the-signup-page',
        '8m-e2e-testing-and-authentication',
      ]
    }
  ]
}

function getUpgradeToV2Sidebar(upgradeTitle) {
  return [
    {
      title: upgradeTitle,
      collapsable: false,
      children: [
        'application-creation',
        'cli-commands',
        'config-system',
        'custom-express-instance',
        'error-handling',
        'file-upload-and-download',
        'jwt-and-csrf',
        'mongodb',
        'openapi',
        'service-and-app-initialization',
        'session-tokens',
        'template-engine',
        'validation-hooks',
      ]
    }
  ]
}
