
module.exports = {
  theme: 'reco',
  themeConfig: require('./configs/themeConfig.js'),

  title: "LAMMPS 中文站",
  description: "这是一个LAMMPS中文教程网站",

  head: [
    ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }],
    ['link', { rel: 'icon', href: '/icons/favicon.ico' }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['link', { rel: 'apple-touch-icon', href: '/icons/apple-touch-icon.png' }],
    ['link', { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1/katex.min.css' }],
    ['link', { rel: "stylesheet", href: "https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/2.10.0/github-markdown.min.css" }],


    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }],
    ['meta', { name: 'keywords', content: 'lammps中文,lammps,lammps教程,lammps官网' }],
    ['meta', { name: 'description', content: 'lammps的非官方中文文档，lammps教程' }],

    ['script', { type: 'text/javascript', scr: './push.js' }],
  ],

  plugins: [
    ['vuepress-plugin-flowchart', true],
    ['@vuepress/medium-zoom', true],
    ['vuepress-plugin-baidu-google-analytics', {
      hm: '915d9a17e5448406c16519f87d253e84',
      ga: 'UA-159337280-1'
    }],
    ['@vuepress/active-header-links', {
      sidebarLinkSelector: '.sidebar-link',
      headerAnchorSelector: '.header-anchor'
    }],
    // vuepress-plugin-copyright
    ['vuepress-plugin-sitemap', {
      hostname: 'https://lammps.org.cn'
    }],

    ['vuepress-plugin-smooth-scroll', true],
  ],

  markdown: {
    extendMarkdown: md => {
      md.set({ html: true })
      md.use(require('markdown-it-katex'))
    },
    lineNumbers: true
  },

}