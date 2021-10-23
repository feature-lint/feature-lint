const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: "Feature Lint",
  tagline: "Ensuring your projects structure",
  url: "https://feature-lint.github.io/",
  baseUrl: "/feature-lint/",
  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "throw",
  trailingSlash: true,
  favicon: "img/favicon.ico",
  organizationName: "feature-lint", // Usually your GitHub org/user name.
  projectName: "feature-lint", // Usually your repo name.
  themeConfig: {
    navbar: {
      title: "Feature-lint",
      logo: {
        alt: "My Site Logo",
        src: "img/logo.svg"
      },
      items: [
        /*{
          type: "doc",
          docId: "intro",
          position: "left",
          label: "Documentation"
        },*/
        //{ to: "/blog", label: "Blog", position: "left" },
        {
          href: "https://github.com/feature-lint/feature-lint",
          label: "GitHub",
          position: "right"
        }
      ]
    },
    footer: {
      style: "dark",
      links: [
        /*
        {
          title: "Community",
          items: [
            {
              label: "Github",
              href: "https://github.com/feature-lint/feature-lint"
            }
          ]
        },
        {
          title: "More",
          items: [

          ]
        }*/
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Feature-Lint Built with Docusaurus.`
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme
    }
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        blog: false,
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          editUrl: "https://github.com/feature-lint/feature-lint/",
          routeBasePath: "/"
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css")
        }
      }
    ]
  ]
};
