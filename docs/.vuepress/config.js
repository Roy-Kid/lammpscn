module.exports = ctx => ({

    lang : 'zh-CN',
    title : 'LAMMPS中文站',
    discription : '这是LAMMPS的非官方中文站，提供不保证正确的教程和命令翻译',
    head : require('./configs/head'),
    theme : 'teadocs',
    themeConfig : require('./configs/themeConfig'),
    plugins : require('./configs/plugins'),
    extraWatchFiles : [
        '.vuepress/configs/sidebar_tutorial.js',
        '.vuepress/configs/navbar.js',
        '.vuepress/configs/sidebar_command.js',
        '.vuepress/configs/sidebar_moduling.js',
    ],
});

