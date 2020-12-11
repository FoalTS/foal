module.exports = {
  title: 'Foal TS',
  tagline: 'Node.JS and TypeScript framework for building web applications',
  url: 'https://foalts.github.io',
  baseUrl: '/foal/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/logo_400.png',
  organizationName: 'FoalTS', // Usually your GitHub org/user name.
  projectName: 'foal', // Usually your repo name.
  themeConfig: {
    googleAnalytics: {
      trackingID: 'UA-112613053-1',
      anonymizeIP: true,
    },
    hideableSidebar: true,
    announcementBar: {
      id: 'supportus',
      content:
        '⭐ Foal TS version 2 has been released! 🎉',
    },
    colorMode: {
      disableSwitch: true
    },
    navbar: {
      title: 'Foal TS',
      logo: {
        alt: 'Foal TS Logo',
        src: 'img/logo_400.png',
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
      ],
    },
    // footer: {
    //   style: 'dark',
    //   links: [
    //     {
    //       title: 'Docs',
    //       items: [
    //         {
    //           label: 'Style Guide',
    //           to: 'docs/',
    //         },
    //         {
    //           label: 'Second Doc',
    //           to: 'docs/doc2/',
    //         },
    //       ],
    //     },
    //     {
    //       title: 'Community',
    //       items: [
    //         {
    //           label: 'Stack Overflow',
    //           href: 'https://stackoverflow.com/questions/tagged/docusaurus',
    //         },
    //         {
    //           label: 'Discord',
    //           href: 'https://discordapp.com/invite/docusaurus',
    //         },
    //         {
    //           label: 'Twitter',
    //           href: 'https://twitter.com/docusaurus',
    //         },
    //       ],
    //     },
    //     {
    //       title: 'More',
    //       items: [
    //         {
    //           label: 'Blog',
    //           to: 'blog',
    //         },
    //         {
    //           label: 'GitHub',
    //           href: 'https://github.com/facebook/docusaurus',
    //         },
    //       ],
    //     },
    //   ],
    //   copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
    // },
  },
  plugins: [
    'docusaurus-plugin-sass',
    '@docusaurus/plugin-google-analytics'
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
