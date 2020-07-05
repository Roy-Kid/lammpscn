module.exports = [
    ['@vuepress/back-to-top', true],
    ['vuepress-plugin-flowchart', true],
    ['@vuepress/medium-zoom', true],
    ['vuepress-plugin-baidu-google-analytics',{
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
    ['@vuepress/pwa', {
        serviceWorker: true,
        updatePopup: {
            '/': {
                message: '更新了新内容呢！',
                buttonText: '立即刷新'
            },
            '/en/': {
                message: 'New content available.',
                buttonText: 'Refresh'
            }
        }
    }]
]