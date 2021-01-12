module.exports = {

    repo: 'Roy-Kid/lammpscn',

    docsDir: 'docs',

    logo: {
        text: 'LAMMPS',
        subText: 'tutorial',
        image: '/icons/favicon.ico',
    },

    alert: [{
        id: '2020-12-28',
        title: '文档公告',
        content: '欢迎向本教程的GitHub上贡献内容. 只有群策群力才能实现良性发展.'
    }],
    editLinks: true,


    locales: {
      '/': {

            selectText: '选择语言',
            label: '简体中文',
            editLinkText: '在 GitHub 上编辑此页',
            
            nav: require('../nav/zh.js'),
            sidebar: {
                '/zh/tutorial/': require('../sidebar/tutorial_zh')(),
                '/zh/command/': require('../sidebar/command_zh')(),
                '/zh/tools/': require('../sidebar/tools_zh')(),
                '/zh/column/': require('../sidebar/column_zh')(),
            },

        },
        '/en/': {

            selectText: 'Language',
            label: 'English',
            editLinkText: 'Edit on GitHub',



            nav: require('../nav/en.js'),
            sidebar: {
                '/en/tutorial/': require('../sidebar/tutorial_en')(),
                '/en/command/': require('../sidebar/command_en')(),
                '/en/tools/': require('../sidebar/tools_en')(),
                '/en/column/': require('../sidebar/column_en')(),
            },

        },

    }



}
