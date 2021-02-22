module.exports = {
  title: 'FoalTS',
  tagline: 'Node.JS framework for building web applications',
  url: 'https://foalts.org',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/logo.png',
  organizationName: 'FoalTS', // Usually your GitHub org/user name.
  projectName: 'foal', // Usually your repo name.
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr'],
    localeConfigs: {
      en: {
        label: 'English',
      },
      fr: {
        label: 'Français',
      },
    },
  },
  scripts: [
    'https://m.servedby-buysellads.com/monetization.custom.js'
  ],
  themeConfig: {
    image: 'img/logo.png',
    googleAnalytics: {
      trackingID: 'UA-112613053-1',
      anonymizeIP: true,
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
      style: 'dark',
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
          href: 'https://www.youtube.com/channel/UCQFojM334E0YdoDq56MjfOQ',
          position: 'right',
          className: 'header-youtube-link',
          'aria-label': 'Youtube channel',
        },
        {
          href: 'https://discord.gg/QUrJv98',
          position: 'right',
          className: 'header-chat-link',
          'aria-label': 'Discord chat server',
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
      ],
    },
    footer: {
      links: [
      ],
    },
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
        theme: {
          customCss: require.resolve('./src/css/custom.scss'),
        },
      },
    ],
  ],
};
