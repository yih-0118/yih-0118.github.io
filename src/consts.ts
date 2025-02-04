// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

// Site title and description
export const SITE_LANG = "tw";
export const SITE_TAB = "Yi-Hung Wu";
export const SITE_TITLE = "Blog";
export const SITE_DESCRIPTION = "嗨";
export const DATE_FORMAT = "YYYY MMM DD ddd";
// User profile informationYi-Hung Wu
export const USER_NAME = "";
export const USER_SITE = "https://yih-0118.github.io/"; // At the same time, this is also the site retrieved by the i18n configuration.
export const USER_AVATAR = "/69842.jpg";

// Server and transition settings
export const SERVER_URL = "https://demo.saroprock.com";

// Theme settings
export const DAISYUI_THEME = {
  light: "winter",
  dark: "dracula",
};
export const CODE_THEME = {
  light: "github-light",
  dark: "github-dark",
};

// Menu items for navigation
export const menuItems = [
  { id: "home", text: "Home", href: "/", svg: "material-symbols:home-outline-rounded", target: "_self" }, // Home page
  { id: "about", text: "About", href: "/about", svg: "material-symbols:info-outline-rounded", target: "_self" }, // About page
  {
    id: "blog",
    text: "Blogs",
    href: "/blog",
    svg: "material-symbols:book-2-outline-rounded",
    target: "_self",
    subItems: [
      {
        id: "all",
        text: "All blogs",
        href: "/blog",
        svg: "material-symbols:ink-pen-outline-rounded",
        target: "_self",
      }, // All blog
      {
        id: "Daily",
        text: "Daily",
        href: "/blog/categories/Daily",
        svg: "material-symbols:ad-group",
        target: "_self",
      }, // Life category
      {
        id: "特殊選才",
        text: "特殊選才",
        href: "/blog/categories/特殊選才",
        svg: "material-symbols:star-rounded",
        target: "_self",
      }, // Life category
    ],
  }, // Blog page with sub-items
  {
    id: "project",
    text: "Project",
    href: "/project",
    svg: "material-symbols:code-blocks-outline",
    target: "_self",
  }, // Projects page
  {
    id: "friend",
    text: "Friend",
    href: "/friend",
    svg: "material-symbols:supervisor-account-outline-rounded",
    target: "_self",
  }, // Friends page
  // {
  //   id: "contact",
  //   text: "Contact",
  //   href: "mailto:s11131191@mlsh.tp.edu.tw", // Contact email
  //   target: "_blank", // Open in a new tab
  //   svg: "material-symbols:attach-email-outline-rounded",
  // },
];

// Social media and contact icons
export const socialIcons = [
  {
    href: "https://mlsh-vocabulary.web.app/",
    ariaLabel: "Support my work",
    title: "Support my work",
    svg: "ri:book-line",
  },
  {
    href: "https://github.com/yih-0118",
    ariaLabel: "Github",
    title: "Github",
    svg: "ri:github-line",
  },
  {
    href: "https://play.google.com/store/apps/details?id=com.MLCP.MLCP_31st",
    ariaLabel: "app",
    title: "app",
    svg: "ri:google-play-line",
  },
  // {
  //   href: "/rss.xml",
  //   ariaLabel: "RSS Feed",
  //   title: "RSS Feed",
  //   svg: "ri:rss-line",
  // },
];
