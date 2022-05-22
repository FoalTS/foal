module.exports = {
  title: 'FoalTS',
  tagline: 'Elegant and complete web framework for NodeJS',
  url: 'https://foalts.org',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/logo.png',
  organizationName: 'FoalTS', // Usually your GitHub org/user name.
  projectName: 'foal', // Usually your repo name.
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr', 'es', 'id'],
    localeConfigs: {
      en: {
        label: 'EN',
      },
      fr: {
        label: 'FR',
      },
      es: {
        label: 'ES',
      },
      id: {
        label: 'Bahasa Indonesia',
      },
    },
  },
  scripts: [
    'https://m.servedby-buysellads.com/monetization.custom.js',
    { src: 'https://plausible.io/js/script.js', defer: true, 'data-domain': 'foalts.org' }
  ],
  themeConfig: {
    image: 'img/meta-image.png',
    announcementBar: {
      id: 'github-twitter',
      content: '⭐️ If you like FoalTS, give it a star on <a target="_blank" rel="noopener noreferrer" href="https://github.com/FoalTS/foal">GitHub</a> and follow us on <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/FoalTs" >Twitter</a>! 🚀'
    },
    algolia: {
      apiKey: '888cc664f8cdf532950f93fdd481eac1',
      indexName: 'foalts',

      // Optional: see doc section bellow
      contextualSearch: true,

      // Optional: Algolia search parameters
      searchParameters: {},

      //... other Algolia params
    },
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'FoalTS',
      style: 'primary',
      hideOnScroll: true,
      logo: {
        alt: 'FoalTS Logo',
        src: 'img/logo.png',
      },
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        {
          to: 'blog',
          label: 'Blog',
          position: 'left'
        },
        {
          to: 'newsletter',
          label: 'Newsletter',
          position: 'left'
        },
        {
          type: 'docsVersionDropdown',
          position: 'right',
          dropdownActiveClassDisabled: true,
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/FoalTS/foal',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
        {
          href: 'https://twitter.com/FoalTs',
          position: 'right',
          className: 'header-twitter-link',
          'aria-label': 'Twitter profile',
        },
        {
          href: 'https://discord.gg/QUrJv98',
          position: 'right',
          className: 'header-discord-link',
          'aria-label': 'Discord chat',
        },
      ],
    }
  },
  plugins: [
    'docusaurus-plugin-sass',
  ],
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/FoalTS/foal/edit/master/docs/',
          lastVersion: "current",
          versions: {
            current: {
              "label": require('../lerna.json').version + ' (latest)',
            },
            '1.x': {
              'label': '1.x'
            }
          }
        },
        blog: {
          showReadingTime: true,
          editUrl:
            'https://github.com/FoalTS/foal/edit/master/docs',
        },
        googleAnalytics: {
          trackingID: 'UA-112613053-1',
          anonymizeIP: true,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.scss'),
        },
      },
    ],
  ],
};
