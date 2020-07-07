module.exports =  ({


    head : require('./configs/head'),
    
    theme : 'teadocs',
    themeConfig : require('./configs/themeConfig'),
    plugins : require('./configs/plugins'),
    extraWatchFiles : [
        '.vuepress/sidebar/command_zh',
        '.vuepress/sidebar/command_en',
        '.vuepress/sidebar/tutorial_zh',
        '.vuepress/sidebar/tutorial_en',
        '.vuepress/sidebar/tools_zh',
        '.vuepress/sidebar/tools_en',
        '.vuepress/sidebar/column_zh',
        '.vuepress/sidebar/column_en',
        '.vuepress/nav/zh.js',
        '.vuepress/nav/en.js',

    ],
    markdown: {
        extendMarkdown: md =>{
            md.use(require('markdown-it-imsize'))
        },
        lineNumbers: true,
    },

    locales:{
        '/':{
            lang: '简体中文',
            title: 'LAMMPS教程',
            description : '这是LAMMPS的教程网站，提供不保证正确的教程和命令翻译',
            lastUpdated: '上次更新',
        },
        '/en/': {
            lang: 'English',
            title: 'LAMMPS tutorial',
            description: 'This is a unofficial LAMMPS tutorial community',
            lastUpdated: 'last updated',
        }
    }
});

